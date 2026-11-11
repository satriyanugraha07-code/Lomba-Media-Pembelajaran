const RAD = Math.PI / 180;
const CUBE = [
  [0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0],
  [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]
];
const LEFT_FACE = [0, 3, 7, 4];
const RIGHT_FACE = [1, 2, 6, 5];
const FRONT_FACE = [0, 1, 5, 4];
const TOP_FACE = [4, 5, 6, 7];
const AXIS_COLORS = ['#73ecd9', '#ffd48b', '#f9add1'];
const FACE_COLORS = ['#21475d', '#2b576c', '#396980'];
const OUTLINE = '#d7f3ff';
const GUIDE = '#8cb5c8';
const INK = '#10283a';

function parallelProjection(basis, side, origin) {
  const angles = basis.slice(0, 2).map(([x, y]) => Math.atan2(Math.abs(y), Math.abs(x)) / RAD);
  const scales = basis.map(([x, y]) => Math.hypot(x, y));
  const project = ([x, y, z]) => [
    x * basis[0][0] + y * basis[1][0] + z * basis[2][0],
    x * basis[0][1] + y * basis[1][1] + z * basis[2][1]
  ];
  const endpoints = origin.map((_, axis) => project(origin.map((value, index) => value + (index === axis ? 1.28 : 0))));
  return { project, side, origin: project(origin), endpoints, angles, scales, farRatio: null };
}

function axonometricDrawing(angleX, angleY, scaleY = 1) {
  const x = angleX * RAD;
  const y = angleY * RAD;
  return parallelProjection([
    [Math.cos(x), -Math.sin(x)], [-scaleY * Math.cos(y), -scaleY * Math.sin(y)], [0, -1]
  ], LEFT_FACE, [0, 0, 0]);
}

function centralProjection({ points = 1, distance = 4.5 }) {
  const twoPoints = Number(points) === 2;
  const depthX = twoPoints ? Math.SQRT1_2 : 0;
  const depthY = twoPoints ? Math.SQRT1_2 : 1;
  const offset = twoPoints ? 0 : .55;
  const eyeHeight = 1.48;
  const project = ([x, y, z]) => {
    const depth = distance + depthX * x + depthY * y;
    return [(depthY * x - depthX * y + offset) / depth, (eyeHeight - z) / depth];
  };
  // The limit of each projected receding axis as its depth tends to infinity.
  const vanishing = twoPoints
    ? [{ x: -depthX / depthY, from: [0, 4], axis: 1 }, { x: depthY / depthX, from: [0, 4], axis: 0 }]
    : [{ x: 0, from: [0, 1, 4, 5], axis: 1 }];
  return { project, vanishing, side: LEFT_FACE, angles: [], scales: [], farRatio: distance / (distance + depthY) };
}

function projectionFor(mode, settings) {
  switch (mode) {
    case 'dimetric':
      return axonometricDrawing(7, 42, 0.5);
    case 'oblique': {
      const { angle = 45, depth = .5 } = settings;
      return parallelProjection([
        [1, 0], [depth * Math.cos(angle * RAD), -depth * Math.sin(angle * RAD)], [0, -1]
      ], RIGHT_FACE, [1, 0, 0]);
    }
    case 'perspective':
      return centralProjection(settings);
    default:
      return axonometricDrawing(30, 30);
  }
}

export function projectPictorial(mode, settings = {}) {
  const { angles, scales, farRatio } = projectionFor(mode, settings);
  return { angles, scales, farRatio };
}

function fittedView(points, width, height, padding, limit = Infinity) {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const scale = Math.min((width - 2 * padding) / (maxX - minX), (height - 2 * padding) / (maxY - minY), limit);
  const xOffset = (width - scale * (minX + maxX)) / 2;
  const yOffset = (height - scale * (minY + maxY)) / 2;
  return ([x, y]) => [x * scale + xOffset, y * scale + yOffset];
}

function line(context, from, to) {
  context.beginPath();
  context.moveTo(...from);
  context.lineTo(...to);
  context.stroke();
}

function diagramText(context, value, [x, y], color, align = 'center') {
  context.font = '600 12px ui-monospace, Consolas, monospace';
  context.textAlign = align;
  context.textBaseline = 'middle';
  context.strokeStyle = INK;
  context.lineWidth = 4;
  context.strokeText(value, x, y);
  context.fillStyle = color;
  context.fillText(value, x, y);
}

function drawCube(context, points, side) {
  [side, FRONT_FACE, TOP_FACE].forEach((face, index) => {
    context.beginPath();
    context.moveTo(...points[face[0]]);
    face.slice(1).forEach(vertex => context.lineTo(...points[vertex]));
    context.closePath();
    context.fillStyle = FACE_COLORS[index];
    context.fill();
    context.strokeStyle = OUTLINE;
    context.lineWidth = 1.55;
    context.stroke();
  });
}

function drawArrow(context, origin, tip, color) {
  const angle = Math.atan2(tip[1] - origin[1], tip[0] - origin[0]);
  const wing = offset => [tip[0] - 8 * Math.cos(angle + offset), tip[1] - 8 * Math.sin(angle + offset)];
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = 1.75;
  line(context, origin, tip);
  context.beginPath();
  context.moveTo(...tip);
  context.lineTo(...wing(.4));
  context.lineTo(...wing(-.4));
  context.closePath();
  context.fill();
  return angle;
}

function drawParallelGuides(context, projection, fit, width) {
  const origin = fit(projection.origin);
  context.save();
  context.strokeStyle = GUIDE;
  context.lineWidth = 1;
  context.globalAlpha = .65;
  context.setLineDash([4, 5]);
  line(context, [Math.max(16, origin[0] - width * .43), origin[1]], [Math.min(width - 16, origin[0] + width * .43), origin[1]]);
  context.restore();

  projection.endpoints.map(fit).forEach((tip, axis) => {
    const color = AXIS_COLORS[axis];
    const direction = drawArrow(context, origin, tip, color);
    diagramText(context, 'XYZ'[axis], [tip[0] + 15 * Math.cos(direction), tip[1] + 13 * Math.sin(direction)], color);
    const angle = projection.angles[axis];
    if (!angle) return;
    const horizontal = Math.cos(direction) < 0 ? Math.sign(direction) * Math.PI : 0;
    const radius = axis === 1 && projection.angles[0] === 0 ? 49 : 34;
    context.strokeStyle = color;
    context.lineWidth = 1.15;
    context.beginPath();
    context.arc(...origin, radius, Math.min(direction, horizontal), Math.max(direction, horizontal));
    context.stroke();
    const bisector = (direction + horizontal) / 2;
    const labelRadius = radius + 21;
    const shallowAngle = angle < 18;
    const labelDirection = shallowAngle ? direction : bisector;
    const shownAngle = Number(angle.toFixed(1)).toLocaleString('id-ID');
    diagramText(context, `${shownAngle}°`, [
      origin[0] + labelRadius * Math.cos(labelDirection),
      origin[1] + labelRadius * Math.sin(labelDirection) - (shallowAngle ? 11 : 0)
    ], color);
  });

  if (projection.angles.every(angle => Math.abs(angle - 30) < 0.0001)) {
    context.save();
    context.strokeStyle = GUIDE;
    context.lineWidth = 1;
    context.setLineDash([3, 4]);
    context.beginPath();
    const radius = 68;
    context.arc(...origin, radius, (projection.angles[1] - 180) * RAD, -projection.angles[0] * RAD);
    context.stroke();
    context.restore();
    diagramText(context, '120°', [origin[0], origin[1] - radius], OUTLINE);
  }
}

function drawHorizon(context, projection, fit, points, width) {
  const horizonY = fit([0, 0])[1];
  context.save();
  context.strokeStyle = GUIDE;
  context.lineWidth = 1;
  context.setLineDash([4, 5]);
  line(context, [16, horizonY], [width - 16, horizonY]);
  diagramText(context, 'Horizon', [width / 2, Math.max(11, horizonY - 27)], GUIDE);

  projection.vanishing.forEach(({ x, from, axis }, index) => {
    const target = fit([x, 0]);
    const color = AXIS_COLORS[axis];
    context.strokeStyle = color;
    context.lineWidth = 1;
    context.globalAlpha = .67;
    from.forEach(vertex => line(context, points[vertex], target));
    context.globalAlpha = 1;
    const inside = target[0] >= 24 && target[0] <= width - 24;
    const label = `TH ${index + 1}`;
    if (inside) {
      context.fillStyle = color;
      context.beginPath();
      context.arc(...target, 3.5, 0, Math.PI * 2);
      context.fill();
      diagramText(context, label, [target[0], horizonY - 12], color);
    } else if (target[0] < 24) {
      diagramText(context, `‹ ${label}`, [16, horizonY - 12], color, 'left');
    } else {
      diagramText(context, `${label} ›`, [width - 16, horizonY - 12], color, 'right');
    }
  });
  context.restore();
}

export function drawPictorial(canvas, mode, settings = {}) {
  const projection = projectionFor(mode, settings);
  const { angles, scales, farRatio } = projection;
  const metrics = { angles, scales, farRatio };
  const { width, height } = canvas.getBoundingClientRect();
  const context = canvas.getContext('2d');
  if (!context || width < 80 || height < 80) return metrics;

  const ratio = Math.min(3, globalThis.devicePixelRatio || 1);
  const pixelWidth = Math.round(width * ratio);
  const pixelHeight = Math.round(height * ratio);
  if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
  if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
  context.setTransform(pixelWidth / width, 0, 0, pixelHeight / height, 0, 0);
  context.clearRect(0, 0, width, height);
  context.lineJoin = 'round';
  context.lineCap = 'round';

  const cube = CUBE.map(projection.project);
  const fitPoints = projection.vanishing ? [...cube, [0, 0]] : [...cube, ...projection.endpoints];
  if (projection.vanishing && settings.fitVanishing && settings.guides !== false) {
    fitPoints.push(...projection.vanishing.map(({ x }) => [x, 0]));
  }
  const fit = fittedView(fitPoints, width, height, Math.min(width * .13, 56), projection.vanishing ? Infinity : 152);
  const vertices = cube.map(fit);
  if (settings.guides !== false && projection.vanishing) drawHorizon(context, projection, fit, vertices, width);
  drawCube(context, vertices, projection.side);
  if (settings.guides !== false && !projection.vanishing) drawParallelGuides(context, projection, fit, width);
  return metrics;
}
