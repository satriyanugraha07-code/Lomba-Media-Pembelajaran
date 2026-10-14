import { createLkpdHero, createLkpdPattern } from './lkpd-drawing.js';
import { createLkpdDrawingSheet, LKPD_SHEET_CSS } from './lkpd-sheet.js';
import { LKPD_JOB2 } from './lkpd-job2.js';

export const LKPD_PATTERNS = [
  {
    id: 1, title: 'Garis mendatar', hint: 'Sejajar · jarak 3,5 mm', color: '#1595b2', soft: '#e3f7fd', tools: 'Mistar lurus · pensil',
    description: 'Latih garis mendatar berjarak 3,5 mm. Ikuti susunan garis utuh tebal, utuh tipis, gores, dan gores-titik pada contoh.',
    steps: ['Buat kotak 70 × 70 mm. Beri tanda setiap 3,5 mm pada sisi kiri dan kanan dengan skala mistar.', 'Sejajarkan mistar dengan kedua tanda. Tahan agar tidak bergeser, lalu tarik garis sepanjang sisinya.', 'Ulangi pada tanda berikutnya dengan susunan tebal-tipis seperti contoh. Uji ketebalan dahulu pada kertas sisa.', 'Untuk garis gores dan gores-titik, jaga panjang segmen dan celah agar konsisten.'],
    tip: 'Ukur jarak 3,5 mm antara dua garis yang berdekatan. Tarikan stabil membantu menjaga ketebalan tetap seragam.'
  },
  {
    id: 2, title: 'Garis tegak', hint: 'Siku · jarak 3,5 mm', color: '#419d87', soft: '#e7f7ef', tools: 'Sepasang segitiga · mistar · pensil',
    description: 'Buat garis tegak sejajar berjarak 3,5 mm. Segitiga menjaga arah siku-siku; skala mistar menentukan jaraknya.',
    steps: ['Buat kotak 70 × 70 mm. Tandai posisi garis setiap 3,5 mm pada sisi atas dan bawah.', 'Tahan segitiga pengarah pada arah dasar. Rapatkan segitiga gambar agar sisi yang digunakan tegak lurus terhadap dasar.', 'Geser segitiga gambar sepanjang sisi pengarah menuju setiap tanda ukur. Segitiga pengarah tetap ditahan.', 'Tarik garis mengikuti sisi tegak segitiga. Ikuti susunan garis utuh, gores, serta gores-titik seperti contoh.'],
    tip: 'Ukur 3,5 mm pada arah mendatar di antara garis tegak. Sisi segitiga yang menjadi pengarah tidak harus memiliki skala.'
  },
  {
    id: 3, title: 'Pola anyaman', hint: 'Pita bersilang · lebar 7 mm', color: '#b78c2e', soft: '#fff6df', tools: 'Mistar · sepasang segitiga · pensil',
    description: 'Susun pita mendatar dan tegak yang tampak saling menganyam. Setiap pita lebarnya 7 mm, dengan bagian yang bergantian lewat di atas dan di bawah.',
    steps: ['Buat kotak 70 × 70 mm. Buat garis bantu tipis dengan interval 7 mm untuk menentukan lebar pita.', 'Amati contoh, lalu bentuk bagian pita mendatar dan tegak dengan sudut siku-siku.', 'Pada setiap persilangan, tentukan pita yang tampak di atas. Hentikan garis pita di bawah pada tepi pita yang menutupinya.', 'Tebalkan batas pita yang terlihat, lalu hapus garis bantu pada bagian yang tertutup. Periksa agar urutan anyaman tetap bergantian.'],
    tip: 'Angka 7 mm menunjukkan lebar pita. Polanya terbentuk dari batas pita yang saling menutupi, bukan garis isi pada petak-petak.'
  },
  {
    id: 4, title: 'Garis miring 45°', hint: 'Empat kuadran · jarak 7 mm', color: '#9881bd', soft: '#f3edfc', tools: 'Segitiga 45° · mistar · pensil',
    description: 'Sumbu mendatar dan tegak membagi kotak menjadi empat kuadran. Garis miring 45° bertemu pada sumbu untuk membentuk susunan sudut seperti contoh.',
    steps: ['Buat kotak 70 × 70 mm. Tandai tengah setiap sisi pada 35 mm, lalu tarik sumbu mendatar dan tegak tipis melalui pusat.', 'Gunakan segitiga 45° untuk membuat garis pada tiap kuadran. Ikuti arah miring pada contoh agar garis bertemu membentuk sudut di sumbu.', 'Beri jarak 7 mm antara dua garis sejajar, diukur tegak lurus terhadap arah garis miring.', 'Hentikan garis pada sumbu atau tepi kotak. Cocokkan titik pertemuan dari dua kuadran yang bersebelahan.'],
    tip: 'Jarak 7 mm adalah jarak terpendek antara garis sejajar; jangan mengukurnya sepanjang sisi kotak.'
  },
  {
    id: 5, title: 'Segitiga & segi enam', hint: 'Tiga arah · ukuran mendatar 7 mm', color: '#c37e5d', soft: '#fff0e8', tools: 'Segitiga 30°–60° · mistar · pensil',
    description: 'Buat kisi segitiga tipis dari tiga arah garis: mendatar, 60°, dan 120°. Tebalkan sisi-sisi pilihan untuk membentuk susunan segi enam seperti contoh.',
    steps: ['Buat kotak 70 × 70 mm. Beri tanda mendatar berinterval 7 mm sesuai dua panah ukuran pada contoh.', 'Gunakan segitiga 30°–60° untuk membuat garis tipis dengan arah 60° dan 120° terhadap arah mendatar.', 'Lengkapi garis mendatar tipis sehingga ketiga arah bertemu pada simpul yang sama dan membentuk kisi segitiga.', 'Pilih rangkaian enam sisi pada kisi seperti contoh, lalu tebalkan untuk membentuk segi enam. Pertahankan garis kisi lainnya tetap tipis.'],
    tip: 'Kedua angka 7 mm diukur mendatar. Periksa simpul tiga arah dan bentuk segi enam sebelum menebalkan garis.'
  },
  {
    id: 6, title: 'Garis lengkung', hint: 'Empat pusat · selisih radius 7 mm', color: '#4b96c3', soft: '#eaf4ff', tools: 'Jangka · mistar · pensil',
    description: 'Gunakan keempat sudut sebagai pusat busur. Busur pembatas melewati pusat kotak; busur di dalamnya memiliki jari-jari yang berkurang 7 mm secara bertahap.',
    steps: ['Buat kotak 70 × 70 mm. Tandai pusat kotak pada 35 mm dari dua sisi yang berdekatan.', 'Ukur jarak sudut ke pusat kotak, sekitar 49,5 mm. Gunakan jarak itu sebagai jari-jari busur pembatas dari keempat sudut, mengikuti bagian yang terlihat pada contoh.', 'Kurangi bukaan jangka 7 mm untuk tiap busur berikutnya: sekitar 42,5; 35,5; 28,5; 21,5; 14,5; dan 7,5 mm. Ulangi dari keempat sudut.', 'Jarum tetap di sudut yang sama; putar kepala jangka dengan ibu jari dan telunjuk. Hentikan setiap busur pada tepi kotak atau busur pembatas keluarga di sebelahnya.'],
    tip: 'Jarak sudut ke pusat diukur pada kotakmu. Selisih radius tetap 7 mm; pertemuan tengah dibentuk busur lengkung tanpa garis pembagi mendatar atau tegak.'
  }
];

export const LKPD_MEASUREMENT_NOTE = 'Ukuran dalam mm. Jarak utama 7 mm; jarak rapat 3,5 mm. Buat kotak latihan 70 × 70 mm.';
export const LKPD_SCALE_NOTE = 'Contoh di layar dan cetak diperkecil. Gunakan angka ukuran untuk menggambar, bukan mengukur contoh dengan mistar.';

export const LKPD_CHECKS = ['Keenam pola sudah digambar', 'Tebal-tipis dan pola garis sesuai', 'Gambar rapi dan kertas bersih', 'Identitas sudah lengkap'];

export const LKPD_JOB1 = {
  id: 1, label: 'Job 1', title: 'Garis dalam gambar', sheetTitle: 'GARIS DALAM GAMBAR',
  storageKey: 'draftlab_lkpd_job1_data', patterns: LKPD_PATTERNS, renderPattern: createLkpdPattern,
  heroArt: createLkpdHero, portrait: false,
  heroTitle: 'Dari latihan kecil,<br><span>jadi garis yang rapi.</span>',
  heroDescription: 'Kenali polanya, ikuti panduannya, lalu coba di kertasmu. Enam latihan sederhana untuk membiasakan tangan menggambar dengan teliti.',
  heroNote: 'Sedikit demi sedikit, makin rapi.', panelTitle: 'Satu lembar. Enam pola.',
  panelDescription: 'Klik salah satu kotak di lembar gambar untuk melihat alat dan langkah pengerjaannya. Keenam pola tetap tersusun seperti di kertas.',
  measurementNote: LKPD_MEASUREMENT_NOTE, scaleNote: LKPD_SCALE_NOTE,
  sheetNote: 'Jarak 7 mm dan 3,5 mm<br>Kotak 70 × 70 mm',
  goalTitle: 'Tangan terlatih,<br>garis lebih teliti.',
  goal: 'Mengenali alat gambar dan meniru enam pola dengan jarak, arah, serta tebal-tipis yang rapi.',
  tools: ['Kertas gambar A4', 'Pensil 2H, H, HB, atau 2B', 'Mistar lurus dan sepasang segitiga', 'Jangka dan penghapus'],
  toolsNote: 'Pilih mata pensil dan tekanan sesuai jenis garis. Ukur kotak 70 × 70 mm serta jarak 7 mm atau 3,5 mm dengan mistar.',
  tasks: ['Isi identitas dan siapkan alat.', 'Amati keenam contoh pola.', 'Gambar ulang kotak 70 × 70 mm dengan jarak sesuai contoh.', 'Periksa hasil sebelum dikumpulkan.'],
  checks: LKPD_CHECKS
};
export const LKPD_JOBS = [LKPD_JOB1, LKPD_JOB2];
export const getLkpdJob = id => LKPD_JOBS.find(job => job.id === Number(id)) || LKPD_JOB1;

const icon = (contents, size = 24) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${contents}</svg>`;
const arrow = icon('<path d="M5 12h14m-5-5 5 5-5 5"/>', 18);

export function lkpdMarkup(job = LKPD_JOB1) {
  const patterns = job.patterns;
  const pdfUrl = job.sourcePath ? `${import.meta.env?.BASE_URL || '/'}${job.sourcePath}` : '';
  const jobPicker = `<div class="lkpd-job-selector" role="group" aria-label="Pilih job lembar kerja">${LKPD_JOBS.map(item => `<button type="button" data-lkpd-job="${item.id}" aria-pressed="${item.id === job.id}"><span>JOB ${String(item.id).padStart(2, '0')}${item.id === 2 ? ' · BAGIAN 1' : ''}</span><strong>${item.title}</strong><small>${item.format === 'pdf' ? 'PDF asli · 1 halaman' : `${item.patterns.length} pola`}</small></button>`).join('')}</div>`;
  if (job.format === 'pdf') {
    return `<div class="lkpd-lesson lkpd-pdf-lesson">${jobPicker}
      <section class="lkpd-panel lkpd-pdf-panel" aria-labelledby="lkpd-pdf-title">
        <div class="lkpd-panel-heading"><div><p class="lkpd-kicker">JOB 02 · BAGIAN 1</p><h2 id="lkpd-pdf-title">${job.title}</h2></div><div class="lkpd-pdf-actions"><a class="lkpd-secondary" href="${pdfUrl}" target="_blank" rel="noopener">Buka PDF ↗</a><a class="lkpd-primary" href="${pdfUrl}" download="JOB 2 Bagian 1.pdf">Unduh PDF ↓</a></div></div>
        <div class="lkpd-pdf-reader" data-source-pdf="${pdfUrl}"><div class="lkpd-pdf-toolbar"><p data-pdf-status role="status" aria-live="polite">Memuat PDF asli…</p><div role="group" aria-label="Perbesaran PDF"><button type="button" class="lkpd-secondary" data-pdf-zoom="out" aria-label="Perkecil PDF" disabled>−</button><output>100%</output><button type="button" class="lkpd-secondary" data-pdf-zoom="in" aria-label="Perbesar PDF" disabled>+</button><button type="button" class="lkpd-secondary" data-pdf-zoom="fit" disabled>Pas halaman</button></div></div><div class="lkpd-pdf-viewport"><canvas role="img" aria-label="Halaman asli PDF Job 2 Bagian 1" hidden></canvas></div></div>
        <p class="lkpd-small-note">Geser untuk melihat seluruh halaman. Gunakan + untuk membaca lebih dekat, atau buka file PDF di tab baru.</p>
      </section>
    </div>`;
  }
  return `<div class="lkpd-lesson"><style>${LKPD_SHEET_CSS}</style>
    <header class="lkpd-hero">
      <div class="lkpd-hero-copy"><p class="lkpd-eyebrow">LEMBAR KERJA · GAMBAR TEKNIK</p><h2>${job.heroTitle}</h2><svg class="lkpd-hero-swoosh" viewBox="0 0 260 15" aria-hidden="true"><path d="M3 10Q122-3 257 8" fill="none" stroke="#46b3c6" stroke-width="5" stroke-linecap="round"/></svg><p>${job.heroDescription}</p><button type="button" class="lkpd-primary" id="lkpd-start">Mulai ${job.label} ${arrow}</button></div>
      <div class="lkpd-hero-art">${job.heroArt()}<span class="lkpd-hero-note">${job.heroNote}</span></div>
    </header>
    ${jobPicker}<div class="lkpd-job-strip"><div><span class="lkpd-job-pill">${job.label.toUpperCase()}</span><strong>${job.title}</strong><span class="lkpd-job-context">Gambar Teknik Manual · Kelas X</span></div>${pdfUrl ? `<a class="lkpd-secondary" href="${pdfUrl}" target="_blank" rel="noopener">Buka PDF asli ↗</a>` : ''}</div>
    <section class="lkpd-identity-panel lkpd-panel" id="lkpd-identity" aria-labelledby="lkpd-identity-title"><div class="lkpd-panel-heading"><div><p class="lkpd-kicker">SEBELUM MULAI</p><h3 id="lkpd-identity-title">Ini lembar kerjamu.</h3></div><span class="lkpd-sync-badge" id="lkpd-sync-badge" hidden>${icon('<path d="m5 12 4 4L19 6"/>', 16)}<span id="lkpd-sync-text">Tersinkron dengan akun siswa</span></span></div><div class="lkpd-identity-grid"><label for="lkpd-name">Nama lengkap<input id="lkpd-name" type="text" maxlength="100" autocomplete="name" placeholder="Nama lengkapmu"></label><label for="lkpd-class">Kelas<input id="lkpd-class" type="text" maxlength="60" placeholder="Contoh: X TP 1"></label><label for="lkpd-absen">No. absen<input id="lkpd-absen" type="text" maxlength="12" inputmode="numeric" placeholder="Contoh: 14"></label><label for="lkpd-date">Tanggal<input id="lkpd-date" type="text" maxlength="30" placeholder="DD/MM/YYYY"></label></div><p class="lkpd-account-note" id="lkpd-account-note" hidden>Nama, kelas, dan nomor absen mengikuti akun siswa yang sedang masuk.</p><div class="lkpd-save-row"><p id="lkpd-save-status" role="status" aria-live="polite">Isian tersimpan otomatis di browser ini.</p><button type="button" class="lkpd-secondary" id="btn-save-lkpd">${icon('<path d="M4 3h13l3 3v15H4Z"/><path d="M8 3v6h8V3M8 21v-8h8v8"/>', 17)} Simpan isian</button></div></section>
    <div class="lkpd-workspace" id="lkpd-sheet-job${job.id}"><section class="lkpd-pattern-panel lkpd-panel" aria-labelledby="lkpd-pattern-heading"><div class="lkpd-panel-heading"><div><p class="lkpd-kicker">AMATI, LALU COBA</p><h3 id="lkpd-pattern-heading">${job.panelTitle}</h3></div><button type="button" class="lkpd-secondary" id="btn-guide-lkpd">${icon('<path d="M4 4h6q2 0 2 2v15q0-3-4-3H4ZM20 4h-6q-2 0-2 2v15q0-3 4-3h4Z"/>', 17)} Panduan</button></div><div class="lkpd-sheet-zoom" role="group" aria-label="Perbesaran lembar gambar"><span>Perbesar untuk membaca titik &amp; garis</span><button type="button" class="lkpd-secondary" id="lkpd-zoom-out" aria-label="Perkecil lembar gambar" disabled>−</button><output id="lkpd-zoom-value">100%</output><button type="button" class="lkpd-secondary" id="lkpd-zoom-in" aria-label="Perbesar lembar gambar">+</button></div><p class="lkpd-panel-intro">${job.panelDescription}</p><div class="lkpd-sheet-viewport${job.portrait ? ' is-portrait' : ''}" id="lkpd-interactive-sheet">${createLkpdDrawingSheet({ patterns, interactive: true, jobId: job.id, title: job.sheetTitle, note: job.sheetNote, portrait: job.portrait, renderPattern: job.renderPattern })}</div><p class="lkpd-sheet-help">${icon('<path d="m9 3 10 9-6 1-3 6Z"/>', 16)} Ketuk gambarnya untuk melihat cara pengerjaan.</p><p class="lkpd-small-note">${job.measurementNote} Etiket mengikuti identitas yang kamu isi.</p></section>
      <aside class="lkpd-preparation" aria-label="Persiapan dan tugas"><section class="lkpd-preparation-card lkpd-goal-card">${icon('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="m12 12 7-7"/>')}<p class="lkpd-kicker">TUJUAN LATIHAN</p><h3>${job.goalTitle}</h3><p>${job.goal}</p></section><section class="lkpd-preparation-card lkpd-tools-card"><p class="lkpd-kicker">SIAPKAN ALATMU</p><h3>Mulai dari yang sederhana.</h3><ul>${job.tools.map(tool => `<li>${tool}</li>`).join('')}</ul><p class="lkpd-small-note">${job.toolsNote}</p></section><section class="lkpd-preparation-card lkpd-task-card"><p class="lkpd-kicker">URUTAN MENGERJAKAN</p><ol>${job.tasks.map(task => `<li>${task}</li>`).join('')}</ol></section></aside></div>
    <div class="lkpd-finish-grid"><section class="lkpd-check-panel lkpd-panel" aria-labelledby="lkpd-check-title"><div class="lkpd-panel-heading"><div><p class="lkpd-kicker">SEBELUM DIKUMPULKAN</p><h3 id="lkpd-check-title">Cek hasil latihanmu.</h3></div><span class="lkpd-check-count" id="lkpd-check-count">0 / 4</span></div><div class="lkpd-checklist">${job.checks.map((label, index) => `<label class="lkpd-check-item" for="lkpd-chk-${index + 1}"><input type="checkbox" id="lkpd-chk-${index + 1}"><span>${label}</span></label>`).join('')}</div><progress id="lkpd-check-progress" value="0" max="4" aria-label="Jumlah pemeriksaan yang selesai"></progress><p class="lkpd-check-status" id="lkpd-check-status" role="status" aria-live="polite">Centang setelah kamu memeriksa hasil gambarmu.</p></section>
    <section class="lkpd-evaluation-panel lkpd-panel" aria-labelledby="lkpd-evaluation-title"><div class="lkpd-panel-heading"><div><p class="lkpd-kicker">DIISI BERSAMA GURU</p><h3 id="lkpd-evaluation-title">Ruang untuk evaluasi.</h3></div>${icon('<path d="M4 4h16v14H8l-4 3Z"/><path d="M8 8h8M8 12h5"/>')}</div><div class="lkpd-evaluation-grid"><label for="lkpd-score">Nilai / 100<input id="lkpd-score" type="text" inputmode="decimal" maxlength="12" placeholder="—"></label><label for="lkpd-paraf">Paraf guru<input id="lkpd-paraf" type="text" maxlength="60" placeholder="Nama / paraf"></label><label class="lkpd-evaluation-note" for="lkpd-note">Catatan<textarea id="lkpd-note" rows="3" maxlength="500" placeholder="Bagian yang sudah baik dan yang bisa diperbaiki…"></textarea></label></div></section></div>
    <section class="lkpd-print-callout"><div class="lkpd-print-callout-icon">${icon('<path d="M7 8V3h10v5M7 16H4V8h16v8h-3M7 13h10v8H7Z"/><path d="M16 10h1"/>', 28)}</div><div><h3>Bawa lembar kerjamu ke kertas.</h3><p>Cetak contoh, identitas, checklist, dan catatan dalam satu lembar A4.</p></div><div class="lkpd-footer-actions"><button type="button" class="lkpd-primary" id="btn-print-lkpd">Cetak / Simpan PDF ${arrow}</button><button type="button" class="lkpd-text-button" id="btn-reset-lkpd">Kosongkan isian</button></div></section>
    <p class="lkpd-local-note">Isian disimpan pada browser yang sedang kamu gunakan. Hasil latihan tetap dikerjakan dan dikumpulkan sesuai arahan guru.</p>
    <dialog id="lkpd-pattern-modal" class="lkpd-guide-dialog" aria-labelledby="lkpd-modal-title" aria-describedby="lkpd-modal-desc"><div class="lkpd-dialog-heading"><div><p class="lkpd-kicker" id="lkpd-modal-number">PANDUAN POLA 01</p><h3 id="lkpd-modal-title"></h3></div><button type="button" class="lkpd-dialog-close" id="lkpd-modal-close" aria-label="Tutup panduan">×</button></div><div class="lkpd-guide-body"><div class="lkpd-guide-preview" id="lkpd-modal-svg-box"></div><div class="lkpd-guide-copy"><p class="lkpd-guide-tools" id="lkpd-modal-tools"></p><p id="lkpd-modal-desc"></p><ol id="lkpd-modal-steps"></ol><p class="lkpd-guide-tip" id="lkpd-modal-tip"></p><p class="lkpd-small-note">${job.measurementNote} ${job.scaleNote}</p></div></div><div class="lkpd-dialog-footer"><button type="button" class="lkpd-secondary" id="lkpd-guide-prev">← ${job.id === 2 ? 'Konstruksi' : 'Pola'} sebelumnya</button><span id="lkpd-guide-count"></span><button type="button" class="lkpd-secondary" id="lkpd-guide-next">${job.id === 2 ? 'Konstruksi' : 'Pola'} berikutnya →</button><button type="button" class="lkpd-primary" id="lkpd-modal-dismiss">Siap mencoba ${arrow}</button></div></dialog>
    <dialog id="lkpd-reset-dialog" class="lkpd-reset-dialog" aria-labelledby="lkpd-reset-title" aria-describedby="lkpd-reset-description"><p class="lkpd-kicker">MULAI DARI AWAL</p><h3 id="lkpd-reset-title">Kosongkan isian ${job.label}?</h3><p id="lkpd-reset-description">Checklist, nilai, paraf, dan catatan akan dikosongkan. Identitas akun siswa yang sedang masuk tetap digunakan.</p><div class="lkpd-reset-actions"><button type="button" class="lkpd-secondary" id="lkpd-reset-cancel">Batal</button><button type="button" class="lkpd-primary" id="lkpd-reset-confirm">Ya, kosongkan</button></div></dialog>
  </div>`;
}
