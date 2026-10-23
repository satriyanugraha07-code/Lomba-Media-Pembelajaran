import { lkpdMarkup, getLkpdJob } from '../src/lkpd-markup.js';
import { openLkpdPrintPreview } from '../src/lkpd-print.js';
import { initLkpdPdfReader } from '../src/lkpd-pdf-reader.js';

const ACTIVE_JOB_KEY = 'draftlab_lkpd_active_job';

function todayText() {
  const today = new Date();
  return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
}

export function initLkpd() {
  const section = document.getElementById('lkpd');
  if (!section || section.dataset.lkpdReady === 'true') return;
  section.dataset.lkpdReady = 'true';
  let flushPending = () => {};
  const mount = (job, focus = false) => {
    flushPending();
    const pickerScrollTop = section.querySelector('.lkpd-job-selector')?.scrollTop || 0;
    section.innerHTML = lkpdMarkup(job);
    section.querySelector('.lkpd-job-selector').scrollTop = pickerScrollTop;
    if (job.format === 'pdf') {
      flushPending = initLkpdPdfReader(section.querySelector('[data-source-pdf]'));
      section.querySelectorAll('[data-lkpd-job]').forEach(button => button.addEventListener('click', () => {
        const next = getLkpdJob(button.dataset.lkpdJob);
        if (next.id === job.id) return;
        try { localStorage.setItem(ACTIVE_JOB_KEY, String(next.id)); } catch {}
        mount(next, true);
      }));
      if (focus) section.querySelector(`[data-lkpd-job="${job.id}"]`)?.focus({ preventScroll: true });
      return;
    }
    const STORAGE_KEY = job.storageKey;
    const patterns = job.patterns;
    const find = id => section.querySelector(`#${id}`);
    const fields = {
      name: find('lkpd-name'), className: find('lkpd-class'), absen: find('lkpd-absen'),
      date: find('lkpd-date'), score: find('lkpd-score'), paraf: find('lkpd-paraf'), note: find('lkpd-note')
    };
    const checks = Array.from(section.querySelectorAll('.lkpd-check-item input'));
    const status = find('lkpd-save-status');
    let saveTimer;
    let activePattern = 1;

    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (saved && typeof saved === 'object') {
        Object.entries(fields).forEach(([key, field]) => {
          if (typeof saved[key] === 'string' || typeof saved[key] === 'number') field.value = String(saved[key]);
        });
        if (Array.isArray(saved.checks)) checks.forEach((check, index) => { check.checked = saved.checks[index] === true; });
      }
    } catch {
      status.textContent = 'Isian sebelumnya belum bisa dimuat. Kamu tetap bisa mengisi lembar ini.';
    }
    if (!fields.date.value) fields.date.value = todayText();

    const payload = () => ({
      ...Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, field.value])),
      checks: checks.map(check => check.checked), updatedAt: new Date().toISOString()
    });

    const updateSheetIdentity = () => {
      const defaults = { name: 'Nama siswa', className: 'Kelas', date: '—', paraf: 'Paraf guru' };
      section.querySelectorAll('#lkpd-interactive-sheet [data-sheet-field]').forEach(cell => {
        cell.textContent = fields[cell.dataset.sheetField]?.value.trim() || defaults[cell.dataset.sheetField];
      });
    };

    const save = (explicit = false) => {
      updateSheetIdentity();
      clearTimeout(saveTimer);
      saveTimer = undefined;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload()));
        status.textContent = explicit ? `Isian ${job.label} berhasil disimpan di browser ini.` : 'Semua perubahan tersimpan di browser ini.';
        status.dataset.state = 'saved';
        return true;
      } catch {
        status.textContent = 'Browser belum bisa menyimpan isian. Isianmu tetap terlihat; cetak atau simpan PDF untuk menyimpan salinannya.';
        status.dataset.state = 'error';
        return false;
      }
    };

    const updateChecks = () => {
      const count = checks.filter(check => check.checked).length;
      find('lkpd-check-count').textContent = `${count} / 4`;
      find('lkpd-check-progress').value = count;
      find('lkpd-check-status').textContent = count === 4
        ? 'Semua sudah diperiksa. Siap dikumpulkan sesuai arahan guru.'
        : count === 0 ? 'Centang setelah kamu memeriksa hasil gambarmu.' : `${count} pemeriksaan selesai. Lanjutkan memeriksa bagian lainnya.`;
    };

    updateSheetIdentity();
    updateChecks();

    flushPending = () => { if (saveTimer) save(); };
    section.querySelectorAll('[data-lkpd-job]').forEach(button => button.addEventListener('click', () => {
      const next = getLkpdJob(button.dataset.lkpdJob);
      if (next.id === job.id) return;
      save();
      try { localStorage.setItem(ACTIVE_JOB_KEY, String(next.id)); } catch {}
      mount(next, true);
    }));
    let zoom = 1;
    const zoomPaper = delta => {
      zoom = Math.max(1, Math.min(3, zoom + delta));
      const paper = find('lkpd-interactive-sheet').querySelector('.lkpd-drawing-paper');
      paper.style.width = `${zoom * 100}%`;
      paper.style.maxWidth = zoom === 1 ? '' : 'none';
      find('lkpd-zoom-value').textContent = `${Math.round(zoom * 100)}%`;
      find('lkpd-zoom-out').disabled = zoom === 1;
      find('lkpd-zoom-in').disabled = zoom === 3;
    };
    find('lkpd-zoom-out').addEventListener('click', () => zoomPaper(-.5));
    find('lkpd-zoom-in').addEventListener('click', () => zoomPaper(.5));

    Object.values(fields).forEach(field => field.addEventListener('input', () => {
      updateSheetIdentity();
      status.textContent = 'Menyimpan perubahan…';
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => save(), 350);
    }));
    checks.forEach(check => check.addEventListener('change', () => { updateChecks(); save(); }));
    find('btn-save-lkpd').addEventListener('click', () => save(true));

    const scrollTo = element => {
      element.scrollIntoView({ block: 'start', behavior: 'auto' });
    };
    find('lkpd-start').addEventListener('click', () => {
      scrollTo(find('lkpd-identity'));
      fields.name.focus({ preventScroll: true });
    });

    const guide = find('lkpd-pattern-modal');
    const showPattern = id => {
      const pattern = patterns.find(item => item.id === Number(id));
      if (!pattern) return;
      activePattern = pattern.id;
      find('lkpd-modal-number').textContent = `PANDUAN ${job.id === 2 ? 'KONSTRUKSI' : 'POLA'} 0${pattern.id}`;
      find('lkpd-modal-title').textContent = pattern.title;
      find('lkpd-modal-tools').textContent = pattern.tools;
      find('lkpd-modal-desc').textContent = pattern.description;
      find('lkpd-modal-tip').textContent = pattern.tip;
      const steps = find('lkpd-modal-steps');
      steps.replaceChildren(...pattern.steps.map(text => {
        const item = document.createElement('li');
        item.textContent = text;
        return item;
      }));
      find('lkpd-modal-svg-box').innerHTML = job.renderPattern(pattern.id);
      find('lkpd-modal-svg-box').style.setProperty('--pattern-soft', pattern.soft);
      find('lkpd-guide-count').textContent = `${pattern.id} / ${patterns.length}`;
      find('lkpd-guide-prev').disabled = pattern.id === 1;
      find('lkpd-guide-next').disabled = pattern.id === patterns.length;
      if (!guide.open) guide.showModal();
      else guide.scrollTop = 0;
    };
    section.querySelectorAll('[data-pattern]').forEach(button => button.addEventListener('click', () => showPattern(button.dataset.pattern)));
    find('btn-guide-lkpd').addEventListener('click', () => showPattern(1));
    find('lkpd-guide-prev').addEventListener('click', () => showPattern(activePattern - 1));
    find('lkpd-guide-next').addEventListener('click', () => showPattern(activePattern + 1));
    find('lkpd-modal-close').addEventListener('click', () => guide.close());
    find('lkpd-modal-dismiss').addEventListener('click', () => guide.close());

    const resetDialog = find('lkpd-reset-dialog');
    find('btn-reset-lkpd').addEventListener('click', () => {
      resetDialog.showModal();
    });
    find('lkpd-reset-cancel').addEventListener('click', () => resetDialog.close());
    find('lkpd-reset-confirm').addEventListener('click', () => {
      Object.values(fields).forEach(field => { field.value = ''; });
      fields.date.value = todayText();
      checks.forEach(check => { check.checked = false; });
      updateChecks();
      save();
      if (status.dataset.state !== 'error') status.textContent = 'Isian sudah dikosongkan. Kamu bisa mulai lagi.';
      resetDialog.close();
      scrollTo(find('lkpd-identity'));
      fields.name.focus({ preventScroll: true });
    });

    find('btn-print-lkpd').addEventListener('click', () => {
      save();
      openLkpdPrintPreview(section, payload(), job);
    });
    if (focus) section.querySelector(`[data-lkpd-job="${job.id}"]`)?.focus({ preventScroll: true });
  };
  let initialJob = getLkpdJob(1);
  try { initialJob = getLkpdJob(localStorage.getItem(ACTIVE_JOB_KEY)); } catch {}
  mount(initialJob);
  window.addEventListener('pagehide', () => flushPending());
}
