import assert from 'node:assert/strict';
import test from 'node:test';
import { PROJECTION_MODEL } from '../src/projection-drawing.js';
import { JOB_VIEWS, createJobView, jobViewPosition } from '../src/views-drawing.js';

test('the three job drawings expose just the two dimensions visible in each view', () => {
  const expected = { front: ['width', 'height'], right: ['depth', 'height'], top: ['width', 'depth'] };
  for (const [id, measures] of Object.entries(expected)) {
    const svg = createJobView(id);
    assert.deepEqual(JOB_VIEWS[id].measures, measures);
    assert.match(svg, /<svg\b[^>]*aria-hidden="true"/);
    const labels = [...svg.matchAll(/data-views-measure="(\w+)"[^>]*>[\s\S]*?<text[^>]*>(\d+)<\/text>/g)]
      .map(([, measure, value]) => [measure, Number(value)]);
    assert.deepEqual(labels, measures.map(measure => [measure, PROJECTION_MODEL[measure]]));
  }
});

test('the job drawings share a scale and align the projected dimensions', () => {
  const drawings = Object.fromEntries(Object.keys(JOB_VIEWS).map(id => {
    const svg = createJobView(id);
    const [, box] = svg.match(/viewBox="([^"]+)"/);
    const [x, y, scale] = svg.match(/data-shape-view="\w+" transform="translate\((\d+) (\d+)\) scale\((\d+)\)"/).slice(1).map(Number);
    return [id, { box, x, y, scale }];
  }));
  const { front, right, top } = drawings;
  assert.equal(top.x, front.x);
  assert.equal(right.y, front.y);
  for (const drawing of Object.values(drawings)) {
    assert.equal(drawing.scale, 1);
    assert.equal(drawing.box, front.box);
  }
});

test('the three-view grid uses the correct first- and third-angle placement', () => {
  const placement = {
    eu: { front: [1, 0], right: [0, 0], top: [1, 1] },
    us: { front: [0, 1], right: [1, 1], top: [0, 0] }
  };
  for (const [system, views] of Object.entries(placement)) {
    for (const [id, [col, row]] of Object.entries(views)) {
      assert.deepEqual(jobViewPosition(id, system), { col, row });
    }
  }
});
