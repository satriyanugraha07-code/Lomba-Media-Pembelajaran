import { PROJECTION_VIEWS, projectedShape, viewPosition } from './projection-drawing.js';

export const JOB_VIEWS = Object.freeze({
  front: Object.freeze({ ...PROJECTION_VIEWS.front, description: 'Profil berbentuk L memperlihatkan sisi tinggi di kiri dan undakan di kanan.', measures: Object.freeze(['width', 'height']) }),
  right: Object.freeze({ ...PROJECTION_VIEWS.right, description: 'Garis mendatar di dalam tampak kanan menunjukkan rusuk undakan yang terlihat dari sisi kanan.', measures: Object.freeze(['depth', 'height']) }),
  top: Object.freeze({ ...PROJECTION_VIEWS.top, description: 'Garis tegak di dalam tampak atas memisahkan bidang penumpu yang tinggi dan yang rendah.', measures: Object.freeze(['width', 'depth']) })
});

const sheetWidth = 188;
const sheetHeight = 166;
const drawingHeight = 144;
const resolveJobView = view => Object.hasOwn(JOB_VIEWS, view) ? view : 'front';

export function jobViewPosition(view, system = 'eu') {
  const { col, row } = viewPosition(resolveJobView(view), system);
  return system === 'us' ? { col: col - 1, row } : { col, row: row - 1 };
}

function dimension(measure, value, lines, arrows, labelPosition) {
  return `<g class="views-dimension" data-views-measure="${measure}" color="#4a667b">
    <path class="views-dimension-lines" d="${lines}" fill="none" stroke="currentColor" stroke-width="1.25"/>
    <path class="views-dimension-arrows" d="${arrows}" fill="currentColor"/>
    <text class="views-dimension-label" ${labelPosition} fill="currentColor" font-size="14" font-weight="700" text-anchor="middle">${value}</text>
  </g>`;
}

function horizontalDimension(measure, left, right, bottom) {
  const y = bottom + 19;
  return dimension(measure, right - left,
    `M${left} ${bottom + 3}V${y + 3}M${right} ${bottom + 3}V${y + 3}M${left} ${y}H${right}`,
    `M${left} ${y}l6 -2.5v5ZM${right} ${y}l-6 -2.5v5Z`,
    `x="${(left + right) / 2}" y="${y - 5}"`);
}

function verticalDimension(measure, right, top, bottom) {
  const x = right + 15;
  return dimension(measure, bottom - top,
    `M${right + 3} ${top}H${x + 3}M${right + 3} ${bottom}H${x + 3}M${x} ${top}V${bottom}`,
    `M${x} ${top}l-2.5 6h5ZM${x} ${bottom}l-2.5 -6h5Z`,
    `transform="translate(${x + 11} ${(top + bottom) / 2}) rotate(-90)" dominant-baseline="middle"`);
}

export function createJobView(view) {
  const id = resolveJobView(view);
  const { dimensions: { width, height }, measures: [horizontal, vertical] } = JOB_VIEWS[id];
  // Shared sheet coordinates keep the top view aligned to the front by width
  // and the right view aligned to the front by height at any tile size.
  const x = (sheetWidth - width) / 2;
  const y = (drawingHeight - height) / 2;
  const right = x + width;
  const bottom = y + height;
  return `<svg class="views-drawing" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${sheetWidth} ${sheetHeight}" aria-hidden="true" focusable="false">
    <g class="views-drawing-shape" color="#183f55">${projectedShape(id, { x, y, colored: false })}</g>
    ${horizontalDimension(horizontal, x, right, bottom)}
    ${verticalDimension(vertical, right, y, bottom)}
  </svg>`;
}
