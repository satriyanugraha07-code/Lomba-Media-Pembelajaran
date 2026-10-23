const ink = '#24465a', blue = '#1386ae';
const text = (x, y, value, size = 15, color = ink) => `<text x="${x}" y="${y}" fill="${color}" stroke="none" font-size="${size}" text-anchor="middle">${value}</text>`;
const line = (x1, y1, x2, y2, color = ink, width = 2, dash = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const dimension = (x1, y1, x2, y2, label, tx, ty) => {
  const angle = Math.atan2(y2 - y1, x2 - x1), size = 6;
  const head = (x, y, direction) => {
    const a = angle + direction;
    return `<path d="M${x} ${y}l${size * Math.cos(a + .45)} ${size * Math.sin(a + .45)}M${x} ${y}l${size * Math.cos(a - .45)} ${size * Math.sin(a - .45)}" stroke="${blue}" stroke-width="1.4"/>`;
  };
  return line(x1, y1, x2, y2, blue, 1) + head(x1, y1, 0) + head(x2, y2, Math.PI) + text(tx, ty, label, 14, blue);
};
const polygon = (count, radius = 82, cx = 210, cy = 125) => Array.from({ length: count }, (_, i) => {
  const angle = -Math.PI / 2 + i * Math.PI * 2 / count;
  return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
});
const pathFrom = points => `M${points.map(point => point.join(' ')).join('L')}Z`;
const svg = (body, description) => `<svg viewBox="0 0 420 250" role="img" aria-label="${description}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="${ink}" stroke-width="2" font-family="Arial, sans-serif"><rect width="420" height="250" rx="12" fill="#fff" stroke="none"/>${body}</svg>`;
const captions = {
  'line-types': 'Empat pola garis gambar teknik. A tebal, B tipis, C gores, D gores-titik.',
  parallel: 'Lima garis sejajar; empat sela berukuran 3,5 mm.',
  diagonal: 'Jarak dua garis miring diukur tegak lurus arah garis.',
  hexagon: 'Segi enam beraturan di dalam lingkaran R30.',
  'hexagon-tangent': 'Segi enam beraturan mengelilingi dan menyinggung lingkaran.',
  pentagon: 'Segi lima beraturan di dalam lingkaran.',
  heptagon: 'Segi tujuh beraturan dan sudut pusatnya.',
  'regular-12': 'Lingkaran dibagi menjadi 12 interval sudut yang sama.',
  'angle-thirds': 'Sudut siku-siku dibagi menjadi tiga bagian sama besar.',
  cylinder: 'Tampak silinder Ø40 dengan tinggi 45 mm dan selimut yang dibuka.',
  'cylinder-divisions': 'Dua belas pembagian keliling dipindahkan menjadi generator pada bentangan.',
  cone: 'Kerucut tegak dengan jari-jari 30 mm dan tinggi 70 mm.',
  'cone-sector': 'Kerucut dan juring bentangannya; s adalah garis pelukis, θ sudut juring.',
  'pipe-development': 'Potongan miring pada pipa dan kurva hasil pemindahan tinggi 12 generator.',
  'pipe-generators': 'Nomor generator menghubungkan tinggi pada tampak depan dengan posisi bentangan.',
  'pipe-error': 'Contoh pola yang salah: tinggi awal dan akhir sambungan berbeda.',
  'iso-axes': 'Sumbu X dan Y miring 30° dari garis mendatar; Z tegak.',
  'iso-box': 'Kotak batas isometri dengan tiga arah rusuk sejajar sumbu.',
  'iso-circle': 'Lingkaran pada bidang datar dan penampilannya dalam isometri.',
  'boss-section': 'Tampak atas boss Ø40 dengan lubang sepusat Ø16.',
  scale: 'Panjang sebenarnya 100 mm; soal menentukan ukuran gambar pada skala 1:2.',
  compare: 'Tiga representasi: bentangan silinder, bentangan kerucut, dan isometri.'
};

function regularFigure(count, id) {
  const outer = id === 'hexagon-tangent';
  const radius = outer ? 76 : 82;
  const points = polygon(count, radius);
  let body = `<circle cx="210" cy="125" r="${outer ? radius * Math.cos(Math.PI / 6) : radius}" stroke="#adc7d5" stroke-width="1.2"/><path d="${pathFrom(points)}" stroke="${blue}" stroke-width="2.5"/>`;
  if (!outer) {
    points.forEach(([x, y], index) => {
      body += line(210, 125, x, y, '#b8cedb', 1, '4 4') + `<circle cx="${x}" cy="${y}" r="3" fill="${blue}" stroke="none"/>`;
      if (count === 12) body += text(210 + (x - 210) * 1.2, 130 + (y - 125) * 1.2, index + 1, 12);
    });
  }
  body += text(199, 143, 'O', 13);
  if (id === 'hexagon') body += line(210, 125, points[1][0], points[1][1], blue, 1.5) + text(261, 115, 'R30', 14, blue);
  if (id === 'pentagon' || id === 'heptagon') body += text(230, 94, 'α', 20, blue);
  return body + text(210, 237, outer ? 'Sisi-sisi mengelilingi lingkaran' : `${count} sisi / pembagian beraturan`, 14);
}

function cylinder(divided = false) {
  let body = `<ellipse cx="90" cy="60" rx="46" ry="16" fill="#eaf7fc"/>${line(44, 60, 44, 180)}${line(136, 60, 136, 180)}<path d="M44 180a46 16 0 0 0 92 0M44 180a46 16 0 0 1 92 0" stroke-dasharray="4 3"/><rect x="223" y="60" width="174" height="120" fill="#f5fbfe"/>`;
  if (divided) for (let i = 0; i <= 12; i++) body += line(223 + i * 14.5, 60, 223 + i * 14.5, 180, '#8ab8ca', 1) + text(223 + i * 14.5, 48, i === 12 ? '1' : i + 1, 10);
  body += dimension(44, 25, 136, 25, 'Ø40', 90, 17) + dimension(169, 60, 169, 180, '45', 190, 125) + dimension(223, 207, 397, 207, 'L = πD', 310, 231);
  return body + text(90, 235, 'Silinder', 14) + text(310, 30, divided ? '12 interval' : 'Selimut dibuka', 14);
}

function cone(sector = false) {
  let body = `<path d="M38 195L103 30L168 195" fill="#eef8fc"/><ellipse cx="103" cy="195" rx="65" ry="18"/>${line(103, 30, 103, 195, '#82aebf', 1, '5 4')}${dimension(190, 30, 190, 195, '70', 208, 119)}${dimension(38, 227, 168, 227, 'Ø60 / r30', 103, 247)}${text(74, 107, 's', 18, blue)}`;
  if (sector) {
    const cx = 296, cy = 142, r = 103, a = -110 * Math.PI / 180, b = 31.8 * Math.PI / 180;
    const p = [cx + r * Math.cos(a), cy + r * Math.sin(a)], q = [cx + r * Math.cos(b), cy + r * Math.sin(b)];
    body += `<path d="M${cx} ${cy}L${p.join(' ')}A${r} ${r} 0 0 1 ${q.join(' ')}Z" fill="#eef8fc" stroke="${blue}"/>${text(302, 126, 'θ', 20, blue)}${text(272, 90, 's', 17, blue)}${text(320, 238, 'Juring selimut', 14)}`;
  } else body += text(312, 87, 's = garis pelukis', 15) + text(312, 123, 'h = 70 mm', 15) + text(312, 158, 'r = 30 mm', 15);
  return body;
}

function pipe(error = false) {
  let body = `<path d="M25 87L111 47V195H25Z" fill="#f0f8fc"/>`;
  for (let i = 0; i <= 6; i++) body += line(25 + i * 14.33, 87 - i * 6.66, 25 + i * 14.33, 195, '#8fb6ca', 1) + text(25 + i * 14.33, 213, i + 1, 11);
  const xs = Array.from({ length: 13 }, (_, i) => 165 + i * 19);
  const ys = xs.map((_, i) => 106 - 38 * Math.sin(i / 12 * Math.PI * 2) + (error ? i * 3 : 0));
  body += line(165, 195, 393, 195);
  xs.forEach((x, i) => { body += line(x, ys[i], x, 195, '#84b2c6', 1) + text(x, 214, i === 12 ? '1' : i + 1, 10); });
  body += `<path d="M${xs.map((x, i) => `${x} ${ys[i]}`).join('L')}" stroke="${error ? '#c3564e' : blue}" stroke-width="3"/>`;
  body += text(70, 26, 'Tampak depan', 13) + text(280, 28, 'Bentangan Ø40 · 12 interval', 13) + dimension(165, 230, 393, 230, 'L = π × D', 280, 247);
  if (error) body += line(165, ys[0], 393, ys[0], '#c3564e', 1, '4 4') + text(350, 151, 'Tidak sama', 13, '#b14841');
  return body;
}

function box() {
  const project = (x, y, z) => [210 + (x - y) * .866, 209 - (x + y) * .5 - z];
  const p = [project(0, 0, 0), project(100, 0, 0), project(100, 60, 0), project(0, 60, 0), project(0, 0, 80), project(100, 0, 80), project(100, 60, 80), project(0, 60, 80)];
  return `<path d="${pathFrom([p[4], p[5], p[6], p[7]])}" fill="#e4f4fb"/><path d="${pathFrom([p[0], p[1], p[5], p[4]])}" fill="#f1f9fd"/><path d="${pathFrom([p[0], p[3], p[7], p[4]])}" fill="#d5eaf5"/>${line(...p[2], ...p[1], '#92b3c6', 1, '4 4')}${line(...p[2], ...p[3], '#92b3c6', 1, '4 4')}${line(...p[2], ...p[6], '#92b3c6', 1, '4 4')}${text(268, 210, 'X · 100', 14, blue)}${text(155, 218, 'Y · 60', 14, blue)}${text(130, 130, 'Z · 80', 14, blue)}`;
}

export function semesterFigure(id, baseUrl = '/') {
  if (id === 'support-source') return `<img src="${baseUrl}exams/jobs/dudukan-silinder.webp" alt="Job asli isometri dudukan silinder dengan boss dan lubang sepusat" width="1800" height="1273" loading="lazy"><div class="semester-figure-specs">Ukuran acuan (mm): <b>100 × 60 × 80</b> · alas <b>20</b> · boss <b>Ø40 × 20</b> · lubang <b>Ø16 tembus</b> · tiang <b>20</b> · takik atas <b>30 × 10</b> · takik alas <b>20 × 8</b> · pengaku <b>10</b>.</div>`;
  let body = '';
  if (id === 'line-types') ['A', 'B', 'C', 'D'].forEach((label, index) => {
    const y = 45 + index * 52;
    body += text(43, y + 5, label, 18, blue) + line(80, y, 378, y, ink, index === 0 ? 5 : 1.6, index === 2 ? '18 9' : index === 3 ? '30 7 3 7' : '');
  });
  else if (id === 'parallel') {
    for (let i = 0; i < 5; i++) body += line(55, 45 + i * 37, 295, 45 + i * 37, ink, i === 0 ? 3 : 1.5) + text(36, 50 + i * 37, i + 1, 13);
    body += dimension(325, 45, 325, 82, '3,5 mm', 365, 70) + text(210, 238, '5 garis / 4 sela sama', 15);
  } else if (id === 'diagonal') body = `<rect x="80" y="25" width="225" height="200" stroke="#b6ccd9"/>${line(90, 190, 245, 35)}${line(119, 219, 274, 64)}${dimension(155, 125, 184, 154, '7 mm', 226, 151)}<path d="M155 125l8-8 8 8" stroke="${blue}" stroke-width="1"/>${text(336, 207, '45°', 17, blue)}`;
  else if (['hexagon', 'hexagon-tangent', 'pentagon', 'heptagon', 'regular-12'].includes(id)) body = regularFigure(id.includes('hexagon') ? 6 : id === 'pentagon' ? 5 : id === 'heptagon' ? 7 : 12, id);
  else if (id === 'angle-thirds') body = `${line(105, 205, 335, 205)}${line(105, 205, 105, 20)}${line(105, 205, 304, 90, blue, 1.7)}${line(105, 205, 220, 6, blue, 1.7)}<path d="M105 178h27v27" stroke="#8aaec0" stroke-width="1"/>${text(163, 194, 'α', 19, blue)}${text(150, 153, 'α', 19, blue)}${text(117, 138, 'α', 19, blue)}${text(291, 52, 'Total 90°', 17)}${text(210, 240, 'Tiga bagian sama besar', 14)}`;
  else if (id === 'cylinder' || id === 'cylinder-divisions') body = cylinder(id.endsWith('divisions'));
  else if (id === 'cone' || id === 'cone-sector') body = cone(id.endsWith('sector'));
  else if (id.startsWith('pipe-')) body = pipe(id === 'pipe-error');
  else if (id === 'iso-axes') body = `${line(20, 193, 400, 193, '#a8c0cf', 1, '5 4')}${line(210, 193, 350, 112, blue)}${line(210, 193, 70, 112, blue)}${line(210, 193, 210, 25, blue)}${text(365, 108, 'X', 19)}${text(54, 108, 'Y', 19)}${text(226, 28, 'Z', 19)}${text(304, 181, '30°', 15)}${text(116, 181, '30°', 15)}${text(199, 214, 'O', 14)}`;
  else if (id === 'iso-box') body = box();
  else if (id === 'iso-circle') body = `<circle cx="90" cy="120" r="58" fill="#edf8fc" stroke="${blue}"/><ellipse cx="303" cy="120" rx="74" ry="31" fill="#edf8fc" stroke="${blue}"/>${line(90, 49, 90, 191, '#aac3d1', 1, '5 4')}${line(17, 120, 165, 120, '#aac3d1', 1, '5 4')}${line(221, 120, 385, 120, '#aac3d1', 1, '5 4')}${text(90, 220, 'Tampak bidang', 15)}${text(303, 220, 'Tampak isometri', 15)}${text(196, 125, '→', 24, blue)}`;
  else if (id === 'boss-section') body = `<circle cx="210" cy="125" r="76" fill="#e4f3f9"/><circle cx="210" cy="125" r="30.4" fill="#fff"/>${line(110, 125, 310, 125, blue, 1, '28 6 3 6')}${line(210, 27, 210, 223, blue, 1, '28 6 3 6')}${dimension(134, 20, 286, 20, 'Ø40', 210, 14)}${dimension(179.6, 125, 240.4, 125, 'Ø16', 210, 114)}`;
  else if (id === 'scale') body = `<rect x="60" y="82" width="300" height="70" rx="5" fill="#e8f5fb"/>${dimension(60, 182, 360, 182, 'Panjang sebenarnya = 100 mm', 210, 209)}${text(210, 45, 'Skala pada gambar soal: 1 : 2', 17)}`;
  else if (id === 'compare') body = `<rect x="18" y="85" width="105" height="80" fill="#edf8fc"/><path d="M210 140L169 64A87 87 0 0 1 296 140Z" fill="#edf8fc" stroke="${blue}"/><g transform="translate(250 12) scale(.36)">${box()}</g>${text(73, 219, 'Silinder', 14)}${text(214, 219, 'Kerucut', 14)}${text(351, 219, 'Isometri', 14)}`;
  else throw new Error(`Unknown semester figure: ${id}`);
  return svg(body, captions[id]);
}
