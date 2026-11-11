import { drawPictorial, projectPictorial } from './pictorial-drawing.js';

const isoSource = ['ISO 5456-3 · Aksonometri, §5.1–5.3', 'https://cdn.standards.iteh.ai/samples/11503/006c88f9e0b040618800ce7a590d049f/ISO-5456-3-1996.pdf'];
const manualDrawingSource = ['UPI YAI · Membaca Gambar Teknik', 'https://dosen.upi-yai.ac.id/v5/dokumen/materi/210005/75_20221001103217_Modul%20ke%202.pdf#page=52'];
const formatNumber = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 });
const number = value => formatNumber.format(value);
const degrees = value => `${number(value)}°`;
const percent = value => `${number(value * 100)}%`;

const lessons = {
  isometric: {
    name: 'Isometri',
    caption: 'Tiga skala sama',
    description: 'Gambar sumbu Z tegak. Sumbu X dan Y masing-masing naik 30° dari garis horizontal. Gunakan skala yang sama pada ketiga sumbu.',
    question: 'Dari mana datangnya 30°–30°?',
    steps: [
      ['Lihat sepanjang diagonal ruang', 'Bayangkan garis dari satu sudut kubus ke sudut yang berseberangan di dalam kubus. Saat melihat sepanjang garis itu, ketiga sumbu terlihat simetris.'],
      ['Bagi satu putaran menjadi tiga', 'Arah X, Y, dan perpanjangan Z ke bawah membagi 360° menjadi tiga sudut sama besar. Jadi, sudut antara X dan Y adalah 360° ÷ 3 = 120°.'],
      ['Bagi sisa sudut di atas horizontal', 'Di atas garis horizontal ada 180°. Setelah dikurangi 120° di antara X dan Y, tersisa 60°. Karena kiri dan kanan simetris, sudut tiap sumbu terhadap horizontal adalah 60° ÷ 2 = 30°.']
    ],
    note: 'Pada proyeksi isometri murni, setiap rusuk sejajar sumbu tampak sekitar 0,816 kali panjang aslinya. Pada gambar isometri praktis, ketiga arah biasanya digambar dengan ukuran nominal. Perbandingannya tetap 1 : 1 : 1.',
    definition: 'Proyeksi isometri menampilkan benda tiga dimensi dalam satu gambar dengan skala yang sama pada sumbu X, Y, dan Z.',
    purpose: 'Memperjelas bentuk komponen dan hubungan antarbagian. Contohnya, gambar perakitan mesin membantu pembaca melihat letak tiap komponen dalam rakitan.',
    try: 'Dengan garis bantu, lihat bagaimana 30° + 120° + 30° membentuk sudut lurus.',
    sources: [
      ['MIT OpenCourseWare · Engineering Drawing and Sketching', 'https://ocw.mit.edu/courses/2-007-design-and-manufacturing-i-spring-2009/pages/related-resources/drawing_and_sketching/'],
      isoSource
    ]
  },
  dimetric: {
    name: 'Dimetri',
    caption: 'Dua skala sama',
    description: 'Untuk gambar dimetri manual ini, gambar Z tegak, X naik 7°, dan Y naik 42° dari garis horizontal. Gunakan setengah skala pada sumbu Y.',
    question: 'Bagaimana cara menggambar dimetri?',
    steps: [
      ['Tentukan dua sumbu berskala sama', 'Gambar Z tegak dan X naik 7° dari garis horizontal. Gunakan skala yang sama di kedua arah itu.'],
      ['Pendekkan rusuk pada sumbu ketiga', 'Gambar Y naik 42° dari garis horizontal. Gunakan setengah panjang untuk rusuk yang sejajar dengan sumbu Y.'],
      ['Jaga arah rusuk sejajar', 'Setiap rusuk kubus mengikuti salah satu dari tiga sumbu. Salin sudut sumbu yang sesuai ketika menggambar rusuk sejajar.']
    ],
    definition: 'Proyeksi dimetri memakai skala yang sama pada dua sumbu dan skala yang berbeda pada sumbu ketiga.',
    purpose: 'Menonjolkan sisi yang memuat detail utama sambil memperlihatkan kedalaman benda. Contohnya, gambar dudukan bertingkat dapat memperjelas profil undakan dengan memperpendek arah kedalaman.',
    try: 'Rusuk 40 mm digambar 40 mm pada arah X atau Z, dan 20 mm pada arah Y, saat X dan Z memakai skala penuh.',
    sources: [manualDrawingSource, ['Università di Cagliari · Dimetric projection, hlm. 12', 'https://web.unica.it/unica/protected/277893/0/def/ref/MAT264085/']]
  },
  oblique: {
    name: 'Proyeksi Miring',
    caption: 'Bidang depan tetap',
    description: 'Bidang depan mempertahankan bentuk dan proporsinya. Rusuk yang menuju belakang digambar sejajar mengikuti sumbu kedalaman.',
    question: 'Apa bedanya cabinet dan cavalier?',
    steps: [
      ['Gambar bidang depan', 'Gunakan X untuk lebar dan Z untuk tinggi. Untuk sebuah kubus, bentuk bidang depannya tetap persegi.'],
      ['Tentukan arah kedalaman', 'Tarik rusuk yang menuju belakang pada sudut yang sama, misalnya 45° terhadap horizontal. Rusuk-rusuk itu tetap sejajar.'],
      ['Pilih skala kedalaman', 'Cavalier memakai panjang penuh. Cabinet memakai setengah panjang. Jika kedalaman benda 40 mm, gambarlah 40 mm pada cavalier atau 20 mm pada cabinet dengan skala bidang depan 1 : 1.']
    ],
    definition: 'Proyeksi miring mempertahankan bentuk dan proporsi bidang depan. Garis yang menunjukkan kedalaman digambar miring dan tetap sejajar satu sama lain.',
    purpose: 'Menunjukkan detail muka benda sekaligus memberi gambaran ketebalannya. Contohnya, lubang pada muka pelat tetap terlihat bulat, sementara tepi yang miring menunjukkan ketebalan pelat.',
    try: 'Pilih Cabinet dan Cavalier secara bergantian. Perhatikan bidang depan dan bandingkan panjang rusuk kedalamannya.',
    defaults: { angle: 45, depth: 0.5 },
    sliders: [
      ['angle', 'Sudut sumbu kedalaman', 15, 65, 1, degrees],
      ['depth', 'Skala kedalaman', 0.25, 1, 0.01, percent]
    ],
    choices: { key: 'depth', label: 'Skala standar', options: [[0.5, 'Cabinet · ½'], [1, 'Cavalier · 1']] },
    reset: 'Kembalikan pengaturan',
    sources: [
      ['California State University, Sacramento · Oblique Projection', 'https://athena.ecs.csus.edu/~ysuh/EGTextbook/Ch4-Parallel-Projection.html'],
      isoSource
    ]
  },
  perspective: {
    name: 'Perspektif',
    caption: 'Garis menuju titik hilang',
    description: 'Perspektif menggambarkan benda sebagaimana tampak dari satu posisi mata. Rusuk yang lebih jauh terlihat lebih pendek. Garis sejajar yang menjauh ke arah yang sama tampak menuju satu titik hilang.',
    question: 'Ke mana arah garis kedalamannya?',
    steps: [
      ['Tentukan horizon', 'Pada pandangan datar, garis horizon berada setinggi mata. Letakkan titik hilang arah mendatar pada garis ini.'],
      ['Pilih satu atau dua titik hilang', 'Pada satu titik, bidang depan menghadap pengamat dan rusuk kedalaman bertemu di satu titik. Pada dua titik, kedua kelompok rusuk mendatar menuju titik hilangnya masing-masing.'],
      ['Perhatikan rusuk vertikal', 'Dalam contoh pandangan datar ini, garis vertikal tetap tegak dan sejajar. Perspektif tiga titik memakai titik hilang tambahan untuk arah vertikal saat pandangan menengadah atau menunduk.']
    ],
    definition: 'Proyeksi perspektif menggambarkan benda dari satu titik pandang. Di antara dua benda berukuran sama, yang letaknya lebih jauh tampak lebih kecil.',
    purpose: 'Memberi kesan ruang dan kedalaman yang menyerupai pandangan mata. Contohnya, gambar interior membantu pembaca membayangkan letak furnitur dan bentuk ruangan dari arah pintu masuk.',
    try: 'Ubah jarak pandang dan amati perbedaan tinggi rusuk dekat dan jauh.',
    defaults: { points: 2, distance: 4.5, fitVanishing: false },
    sliders: [['distance', 'Jarak pandang', 3, 8, 0.1, value => `${number(value)} satuan`]],
    choices: { key: 'points', label: 'Titik hilang', options: [[1, '1 titik'], [2, '2 titik']] },
    reset: 'Kembalikan pengaturan',
    sources: [
      ['Columbia GSAPP · Perspectival Projection', 'https://smorgasbord.cdp.arch.columbia.edu/modules/13-arch-drawing/13-2_projection/#perspectival-projection'],
      ['ISO 5456-4 · Proyeksi pusat', 'https://www.iso.org/standard/11504.html']
    ]
  }
};

function lessonMarkup() {
  return `
    <div class="pictorial-lesson" aria-labelledby="pictorial-title">
      <header class="pictorial-hero">
        <div>
          <h2 id="pictorial-title">Proyeksi <span>Piktorial</span></h2>
          <p>Gambarkan lebar, tinggi, dan kedalaman dalam satu pandangan. Coba empat cara menggambar kubus yang sama.</p>
        </div>
        <div class="pictorial-hero-angle" aria-hidden="true">
          <div><span>30°</span><b>·</b><span>30°</span></div>
          <p>Sudut X dan Y pada isometri</p>
        </div>
      </header>
      <div class="pictorial-modes" role="group" aria-label="Pilih jenis proyeksi">
        ${Object.entries(lessons).map(([key, lesson]) => `<button type="button" data-pictorial-mode="${key}" aria-pressed="${key === 'isometric'}"><strong>${lesson.name}</strong><span>${lesson.caption}</span></button>`).join('')}
      </div>
      <div class="pictorial-workspace" aria-labelledby="pictorial-mode-title">
        <figure class="pictorial-board">
          <figcaption><h3 id="pictorial-mode-title">Isometri</h3><span>Kubus 1 × 1 × 1</span></figcaption>
          <div class="pictorial-stage"><canvas role="img" aria-label="Diagram proyeksi kubus">Nilai sudut dan skala proyeksi tersedia di bawah diagram.</canvas></div>
          <dl class="pictorial-metrics" data-pictorial-metrics></dl>
        </figure>
        <div class="pictorial-controls">
          <h3 data-pictorial-panel-title>Aturan gambar</h3>
          <p data-pictorial-description></p>
          <div class="pictorial-context">
            <div><h4>Pengertian</h4><p data-pictorial-definition></p></div>
            <div><h4>Fungsi</h4><p data-pictorial-purpose></p></div>
          </div>
          <div class="pictorial-mode-controls" data-pictorial-controls></div>
          <div class="pictorial-tools">
            <label><input type="checkbox" data-pictorial-guides checked> Garis bantu</label>
            <button type="button" data-pictorial-reset></button>
          </div>
          <p class="pictorial-feedback" data-pictorial-feedback></p>
        </div>
      </div>
      <p class="pictorial-status" role="status" data-pictorial-status></p>
      <section class="pictorial-explanation" aria-labelledby="pictorial-question" data-pictorial-explanation></section>
    </div>`;
}

function controlMarkup(lesson) {
  if (!lesson.sliders) return '';
  const choices = lesson.choices;
  return `
    ${choices ? `<div class="pictorial-choices" role="group" aria-label="${choices.label}">${choices.options.map(([value, label]) => `<button type="button" data-pictorial-choice="${value}" aria-pressed="false">${label}</button>`).join('')}</div>` : ''}
    ${lesson.sliders.map(([key, label, min, max, step]) => `
      <div class="pictorial-range">
        <div><label for="pictorial-${key}">${label}</label><output for="pictorial-${key}" data-pictorial-value="${key}" aria-live="off"></output></div>
        <input type="range" id="pictorial-${key}" min="${min}" max="${max}" step="${step}" data-pictorial-range="${key}">
      </div>`).join('')}
    ${Object.hasOwn(lesson.defaults, 'fitVanishing') ? '<label class="pictorial-check"><input type="checkbox" data-pictorial-fit> Tampilkan kedua titik hilang</label>' : ''}`;
}

function explanationMarkup(lesson) {
  return `
    <h3 id="pictorial-question">${lesson.question}</h3>
    <ol>${lesson.steps.map(([title, detail]) => `<li><strong>${title}</strong><p>${detail}</p></li>`).join('')}</ol>
    ${lesson.note ? `<p class="pictorial-note">${lesson.note}</p>` : ''}
    <div class="pictorial-sources"><h4>Sumber materi</h4><ul>
      ${lesson.sources.map(([title, url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${title} <span aria-hidden="true">↗</span></a></li>`).join('')}
      <li><a href="https://repositori.kemendikdasmen.go.id/9901/" target="_blank" rel="noopener noreferrer">Kemendikdasmen · Gambar Teknik Kelas X <span aria-hidden="true">↗</span></a></li>
    </ul></div>`;
}

function readouts(mode, settings, { angles, scales, farRatio }) {
  switch (mode) {
    case 'isometric':
      return [
        ['X / Y dari horizontal', angles.map(degrees).join(' / ')],
        ['Sudut X–Y', degrees(180 - angles[0] - angles[1])],
        ['Skala X : Y : Z', scales.map(number).join(' : ')]
      ];
    case 'dimetric':
      return [
        ['X / Y dari horizontal', angles.map(degrees).join(' / ')],
        ['Skala X : Y : Z', scales.map(number).join(' : ')],
        ['Sumbu sama panjang', 'X dan Z']
      ];
    case 'oblique':
      return [
        ['Sudut kedalaman', degrees(settings.angle)],
        ['Skala X : Y : Z', `1 : ${number(settings.depth)} : 1`],
        ['Bidang depan', 'Persegi']
      ];
    case 'perspective':
      return [
        ['Titik hilang', `${settings.points} pada horizon`],
        ['Tinggi rusuk jauh / dekat', percent(farRatio)],
        ['Rusuk vertikal', 'Tetap sejajar']
      ];
  }
}

function feedback(mode, settings) {
  if (mode === 'perspective' && settings.points === 2 && !settings.fitVanishing) {
    return 'Aktifkan “Tampilkan kedua titik hilang” untuk melihat pertemuan garis bantu. Ubah jarak pandang dan bandingkan tinggi rusuk dekat dan jauh.';
  }
  return lessons[mode].try;
}

export function initPictorial() {
  const section = document.getElementById('pictorial');
  if (!section || section.dataset.initialized) return;
  section.innerHTML = lessonMarkup();
  section.dataset.initialized = 'true';

  const canvas = section.querySelector('canvas');
  const title = section.querySelector('#pictorial-mode-title');
  const panelTitle = section.querySelector('[data-pictorial-panel-title]');
  const modes = [...section.querySelectorAll('[data-pictorial-mode]')];
  const controls = section.querySelector('[data-pictorial-controls]');
  const guides = section.querySelector('[data-pictorial-guides]');
  const metrics = section.querySelector('[data-pictorial-metrics]');
  const description = section.querySelector('[data-pictorial-description]');
  const definition = section.querySelector('[data-pictorial-definition]');
  const purpose = section.querySelector('[data-pictorial-purpose]');
  const feedbackNode = section.querySelector('[data-pictorial-feedback]');
  const status = section.querySelector('[data-pictorial-status]');
  const explanation = section.querySelector('[data-pictorial-explanation]');
  const reset = section.querySelector('[data-pictorial-reset]');
  const settingsByMode = Object.fromEntries(Object.entries(lessons).map(([key, lesson]) => [key, { ...lesson.defaults }]));
  let mode = 'isometric';

  const currentSettings = () => ({ ...settingsByMode[mode], guides: guides.checked });
  const draw = () => drawPictorial(canvas, mode, currentSettings());
  const announce = () => { status.textContent = canvas.getAttribute('aria-label'); };

  function update() {
    const lesson = lessons[mode];
    const settings = currentSettings();
    const projection = projectPictorial(mode, settings);
    const values = readouts(mode, settings, projection);
    for (const [key, , , , , format] of lesson.sliders ?? []) {
      const slider = controls.querySelector(`[data-pictorial-range="${key}"]`);
      const value = format(settings[key]);
      slider.value = settings[key];
      slider.setAttribute('aria-valuetext', value);
      controls.querySelector(`[data-pictorial-value="${key}"]`).value = value;
    }
    controls.querySelectorAll('[data-pictorial-choice]').forEach(button => {
      button.setAttribute('aria-pressed', String(settings[lesson.choices.key] === Number(button.dataset.pictorialChoice)));
    });
    const fit = controls.querySelector('[data-pictorial-fit]');
    if (fit) {
      fit.checked = settings.fitVanishing;
      fit.closest('label').hidden = settings.points !== 2;
    }
    metrics.innerHTML = values.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');
    feedbackNode.textContent = feedback(mode, settings);
    canvas.setAttribute('aria-label', `Diagram kubus. ${lesson.name}. ${values.map(([label, value]) => `${label} ${value}`).join('. ')}.`);
    draw();
  }

  function selectMode(key) {
    mode = key;
    const lesson = lessons[key];
    const adjustable = Boolean(lesson.defaults);
    modes.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.pictorialMode === key)));
    title.textContent = lesson.name;
    panelTitle.textContent = adjustable ? 'Atur proyeksi' : 'Aturan gambar';
    description.textContent = lesson.description;
    definition.textContent = lesson.definition;
    purpose.textContent = lesson.purpose;
    controls.hidden = !adjustable;
    controls.innerHTML = controlMarkup(lesson);
    explanation.innerHTML = explanationMarkup(lesson);
    reset.hidden = !adjustable;
    reset.textContent = lesson.reset ?? '';
    update();
  }

  modes.forEach(button => button.addEventListener('click', () => {
    if (mode === button.dataset.pictorialMode) return;
    selectMode(button.dataset.pictorialMode);
    announce();
  }));
  controls.addEventListener('input', event => {
    if (event.target.matches('[data-pictorial-fit]')) {
      settingsByMode[mode].fitVanishing = event.target.checked;
      if (event.target.checked) guides.checked = true;
      update();
      return;
    }
    const key = event.target.dataset.pictorialRange;
    if (!key) return;
    settingsByMode[mode][key] = event.target.valueAsNumber;
    update();
  });
  controls.addEventListener('change', event => {
    if (event.target.matches('[data-pictorial-range]')) announce();
  });
  controls.addEventListener('click', event => {
    const choice = event.target.closest('[data-pictorial-choice]');
    if (!choice) return;
    settingsByMode[mode][lessons[mode].choices.key] = Number(choice.dataset.pictorialChoice);
    update();
    announce();
  });
  guides.addEventListener('change', () => {
    if (!guides.checked) {
      settingsByMode.perspective.fitVanishing = false;
    }
    update();
  });
  reset.addEventListener('click', () => {
    settingsByMode[mode] = { ...lessons[mode].defaults };
    update();
    announce();
  });
  new ResizeObserver(draw).observe(canvas);
  selectMode(mode);
}
