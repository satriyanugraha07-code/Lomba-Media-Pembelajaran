import assert from 'node:assert/strict';
import test from 'node:test';
import { drawPictorial, projectPictorial } from '../src/pictorial-drawing.js';

function close(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 1e-10, `Expected ${actual} to be close to ${expected}`);
}

function recordCanvas(width, height) {
  let path = [];
  const segments = [];
  const circles = [];
  const faces = [];
  const context = {
    beginPath() { path = []; },
    moveTo(...point) { path.push(point); },
    lineTo(...point) { path.push(point); },
    arc(x, y, radius, start, end) { circles.push({ x, y, radius, start, end }); },
    stroke() { if (path.length === 2) segments.push(path); },
    fill() { if (path.length === 4) faces.push(path); },
    closePath() {}, save() {}, restore() {}, setLineDash() {},
    fillText() {}, strokeText() {}, setTransform() {}, clearRect() {}
  };
  return { canvas: { getBoundingClientRect: () => ({ width, height }), getContext: () => context }, segments, circles, faces };
}

test('the isometric diagram shows 30° from the horizontal and a 120° arc between X and Y', () => {
  const { canvas, segments, circles } = recordCanvas(360, 300);
  const { angles, scales } = drawPictorial(canvas, 'isometric');
  angles.forEach(angle => close(angle, 30));
  scales.forEach(scale => close(scale, 1));

  const [[x, y], [u, v]] = segments.slice(-3).map(([[x, y], [tipX, tipY]]) => [tipX - x, tipY - y]);
  close((x * u + y * v) / (Math.hypot(x, y) * Math.hypot(u, v)), -0.5);
  const arc = circles.at(-1);
  close(arc.start, Math.atan2(v, u));
  close(arc.end, Math.atan2(y, x));
  assert.deepEqual(projectPictorial('isometric', { azimuth: 55, elevation: 40 }), { angles, scales, farRatio: null });
});

test('isometric and dimetric cubes and axes are above the horizontal line', () => {
  for (const mode of ['isometric', 'dimetric']) {
    const { canvas, segments, faces } = recordCanvas(280, 250);
    drawPictorial(canvas, mode);
    const [[, horizontalY], [, endY]] = segments[0];
    close(horizontalY, endY);
    const rays = segments.slice(-3);
    rays.forEach(([[, originY], [, tipY]]) => {
      close(originY, horizontalY);
      assert.ok(tipY < horizontalY);
    });
    assert.equal(faces.length, 3);
    assert.ok(faces.flat().every(([, y]) => y <= horizontalY));
    assert.ok(faces.at(-1).every(([, y]) => y < horizontalY));
  }
});

test('the manual dimetric drawing uses fixed 7° and 42° rays and a half-scale Y axis', () => {
  const { canvas, segments } = recordCanvas(280, 250);
  const dimetric = drawPictorial(canvas, 'dimetric');
  assert.deepEqual(projectPictorial('dimetric', { shortScale: 1 }), dimetric);
  const axes = segments.slice(-3).map(([[x, y], [tipX, tipY]]) => [tipX - x, tipY - y]);
  for (const [axis, expected] of [7, 42].entries()) {
    const [x, y] = axes[axis];
    close(Math.atan2(-y, Math.abs(x)) * 180 / Math.PI, expected);
    close(dimetric.angles[axis], expected);
  }
  const lengths = axes.map(([x, y]) => Math.hypot(x, y));
  close(lengths[1] / lengths[0], 0.5);
  close(lengths[2] / lengths[0], 1);
  dimetric.scales.forEach((scale, index) => close(scale, [1, 0.5, 1][index]));
});

test('oblique preserves the front square when depth changes', () => {
  for (const depth of [0.5, 1]) {
    const { angles, scales } = projectPictorial('oblique', { angle: 45, depth });
    close(angles[1], 45);
    scales.forEach((scale, index) => close(scale, [1, depth, 1][index]));
  }
});

test('the perspective overview fits both vanishing points on the same horizon on a small canvas', () => {
  for (const points of [1, 2]) {
    const { canvas, circles, segments } = recordCanvas(280, 300);
    const near = drawPictorial(canvas, 'perspective', { points, distance: 3, fitVanishing: true });
    const far = projectPictorial('perspective', { points, distance: 8 });
    assert.ok(near.farRatio < far.farRatio && far.farRatio < 1);
    assert.equal(circles.length, points);
    for (const { x, y } of circles) {
      assert.ok(x > 24 && x < 256 && y > 24 && y < 276);
      close(y, circles[0].y);
      assert.ok(segments.filter(([, end]) => end[0] === x && end[1] === y).length >= 2);
    }
  }
});
