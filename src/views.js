import { PROJECTION_MODEL } from './projection-drawing.js';
import { createJobView, JOB_VIEWS, jobViewPosition } from './views-drawing.js';

const methods = {
  eu: { name: 'Eropa', angle: 'Sudut pertama', placement: 'Tampak kanan di kiri tampak depan. Tampak atas di bawah tampak depan.' },
  us: { name: 'Amerika', angle: 'Sudut ketiga', placement: 'Tampak kanan di kanan tampak depan. Tampak atas di atas tampak depan.' }
};

const measures = {
  width: { name: 'Lebar', pair: 'depan dan atas' },
  height: { name: 'Tinggi', pair: 'depan dan kanan' },
  depth: { name: 'Kedalaman', pair: 'kanan dan atas' }
};

const drawingHint = 'Pilih ukuran untuk menyorotnya pada dua tampak.';

function markup() {
  const methodButtons = Object.entries(methods).map(([id, method]) => `
    <button type="button" data-views-system="${id}" aria-pressed="${id === 'eu'}">
      <strong>${method.name}</strong><span>${method.angle}</span>
    </button>`).join('');
  const viewButtons = Object.entries(JOB_VIEWS).map(([id, view]) => `
    <button type="button" class="views-tile" data-views-view="${id}" aria-pressed="${id === 'front'}" aria-controls="views-inspector">
      <span>${view.name}</span>${createJobView(id)}
    </button>`).join('');
  const measureButtons = Object.entries(measures).map(([id, { name }]) => `
    <button type="button" data-views-dimension="${id}" aria-pressed="false">${name}</button>`).join('');

  return `<div class="views-lesson" aria-labelledby="views-title">
    <header class="views-hero">
      <div>
        <h2 id="views-title">Pandangan Benda</h2>
        <p>Satu tampak adalah gambar dua dimensi dari satu arah. Baca tiga tampak berikut dan coba bayangkan bentuk benda kerjanya.</p>
      </div>
      <div class="views-job">
        <span>JOB GAMBAR TEKNIK</span>
        <strong>Dudukan bertingkat</strong>
        <p>Dudukan dengan dua bidang penumpu pada ketinggian berbeda.</p>
      </div>
    </header>

    <div class="views-workspace">
      <article class="views-board" aria-labelledby="views-board-title">
        <div class="views-board-head">
          <div><h3 id="views-board-title">Baca tiga tampaknya</h3><p>Pilih salah satu gambar. Semua ukuran dalam mm.</p></div>
          <div class="views-methods" role="group" aria-label="Susunan tampak">${methodButtons}</div>
        </div>
        <div class="views-sheet" role="group" aria-label="Tiga tampak dudukan bertingkat">${viewButtons}</div>
        <p class="views-placement" data-views-placement role="status"></p>
      </article>

      <aside class="views-inspector" id="views-inspector" aria-labelledby="views-current">
        <div class="views-current" aria-live="polite">
          <h3 id="views-current"></h3>
          <p data-views-description></p>
          <ul class="views-dimension-list" data-views-dimension-list aria-label="Ukuran yang terlihat"></ul>
        </div>
        <div class="views-compare">
          <h4>Ukuran yang sama</h4>
          <div class="views-measures" role="group" aria-label="Sorot ukuran">${measureButtons}</div>
          <p data-views-measure-note role="status">${drawingHint}</p>
        </div>
      </aside>
    </div>

    <section class="views-challenge" aria-labelledby="views-challenge-title">
      <div>
        <h3 id="views-challenge-title">Coba dari depan saja</h3>
        <p>Kalau hanya diberi tampak depan, apakah kamu bisa menentukan kedalaman dudukan?</p>
      </div>
      <div class="views-answers" role="group" aria-label="Jawaban latihan">
        <button type="button" data-views-answer="front" aria-pressed="false">Bisa, 120 mm</button>
        <button type="button" data-views-answer="other" aria-pressed="false">Perlu tampak lain</button>
      </div>
      <p class="views-answer-note" data-views-answer-note role="status" hidden></p>
    </section>

    <section class="views-next" aria-labelledby="views-next-title">
      <div><h3 id="views-next-title">Sudah terbayang bentuk dudukannya?</h3><p>Coba sketsa dari tiga tampak ini. Setelah itu, putar model benda yang sama di Proyeksi Ortogonal dan cocokkan dengan sketsamu.</p></div>
      <button type="button" data-open-module="projection">Lanjut ke Proyeksi Ortogonal <span aria-hidden="true">→</span></button>
    </section>

    <p class="views-sources">Acuan <a href="https://www.iso.org/standard/11502.html" target="_blank" rel="noopener noreferrer">ISO 5456-2 · Proyeksi ortogonal</a> dan <a href="https://athena.ecs.csus.edu/~ysuh/EGTextbook/Ch6-Multiview-Drawings.html" target="_blank" rel="noopener noreferrer">Sacramento State · Gambar multiview</a>.</p>
  </div>`;
}

export function initViews() {
  const section = document.getElementById('views');
  if (!section || section.dataset.viewsReady) return;
  section.innerHTML = markup();
  section.dataset.viewsReady = 'true';

  const find = selector => section.querySelector(selector);
  const methodButtons = [...section.querySelectorAll('[data-views-system]')];
  const viewButtons = [...section.querySelectorAll('[data-views-view]')];
  const measureButtons = [...section.querySelectorAll('[data-views-dimension]')];
  const answerButtons = [...section.querySelectorAll('[data-views-answer]')];
  const dimensionMarks = [...section.querySelectorAll('.views-dimension')];
  let highlighted = null;

  function selectSystem(system) {
    methodButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.viewsSystem === system)));
    viewButtons.forEach(button => {
      const { col, row } = jobViewPosition(button.dataset.viewsView, system);
      button.style.gridColumn = String(col + 1);
      button.style.gridRow = String(row + 1);
    });
    find('[data-views-placement]').textContent = `${methods[system].name}. ${methods[system].placement}`;
  }

  function selectView(id) {
    const view = JOB_VIEWS[id];
    viewButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.viewsView === id)));
    find('#views-current').textContent = view.name;
    find('[data-views-description]').textContent = view.description;
    find('[data-views-dimension-list]').innerHTML = view.measures.map(measure =>
      `<li>${measures[measure].name} <strong>${PROJECTION_MODEL[measure]} mm</strong></li>`).join('');
  }

  function highlightMeasure(id) {
    highlighted = id;
    measureButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.viewsDimension === id)));
    viewButtons.forEach(button => button.classList.toggle('views-tile-related', JOB_VIEWS[button.dataset.viewsView].measures.includes(id)));
    dimensionMarks.forEach(mark => mark.classList.toggle('views-dimension-highlight', mark.dataset.viewsMeasure === id));
    find('[data-views-measure-note]').textContent = id
      ? `${measures[id].name} ${PROJECTION_MODEL[id]} mm terbaca pada tampak ${measures[id].pair}.`
      : drawingHint;
  }

  methodButtons.forEach(button => button.addEventListener('click', () => selectSystem(button.dataset.viewsSystem)));
  viewButtons.forEach(button => button.addEventListener('click', () => selectView(button.dataset.viewsView)));
  measureButtons.forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.viewsDimension;
    highlightMeasure(highlighted === id ? null : id);
  }));
  answerButtons.forEach(button => button.addEventListener('click', () => {
    answerButtons.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
    const correct = button.dataset.viewsAnswer === 'other';
    const note = find('[data-views-answer-note]');
    note.hidden = false;
    note.dataset.correct = String(correct);
    note.textContent = correct
      ? 'Betul. Tampak depan memberi lebar dan tinggi. Kedalaman 60 mm terlihat pada tampak kanan dan atas.'
      : 'Angka 120 mm di tampak depan menunjukkan lebar dan tinggi. Coba cocokkan dengan ukuran yang terlihat dari kanan atau atas.';
  }));

  selectSystem('eu');
  selectView('front');
}
