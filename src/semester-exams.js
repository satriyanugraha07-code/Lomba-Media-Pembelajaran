import { SEMESTER_EXAMS } from './semester-exam-data.js';
import { createExamAttempt, readExamAttempt, saveExamAttempt, storeSemesterResult, recordExamViolation, remainingExamSeconds, examAnswerCount, validateExamParticipant, MAX_EXAM_VIOLATIONS } from './semester-exam-session.js';
import { createSemesterGuard } from './semester-exam-guard.js';
import { semesterFigure } from './semester-exam-figures.js';
import { examIntroMarkup, examRoomMarkup, examResultMarkup } from './semester-exam-markup.js';
import { downloadSemesterAttempt } from './semester-exam-export.js';
import { calculateExamNumber } from './semester-exam-calculator.js';
import { assessmentStorage, studentProfile, isTeacher } from './auth-session.js';
import { queueAssessment, semesterCloudAttempt, findRemoteAttempt, getSyncState } from './assessment-sync.js';

function createExamController(exam) {
  const section = document.getElementById(exam.id);
  if (!section || section.dataset.semesterReady) return null;
  section.dataset.semesterReady = 'true';
  const baseUrl = import.meta.env?.BASE_URL || '/';
  let attempt = null, timer, finishing = false, resultSaved = false;
  const find = selector => section.querySelector(selector);
  const guard = createSemesterGuard({
    section, onSave: () => persist(),
    onViolation: reason => {
      attempt = recordExamViolation(attempt, reason);
      persist();
      if (attempt.violations.length >= MAX_EXAM_VIOLATIONS) finish('Batas tiga kejadian keluar tercapai.');
      else showPause(reason);
    },
    onBlocked: () => { if (attempt?.status === 'active') showPause('Selesaikan atau kumpulkan ujian sebelum membuka halaman lain.'); }
  });

  function persist(sync = true) {
    if (!attempt) return false;
    try {
      if (sync) {
        const queued = queueAssessment(semesterCloudAttempt(attempt), {immediate:attempt.status === 'submitted'});
        if (queued) attempt.revision = queued.revision;
      }
      saveExamAttempt(assessmentStorage, attempt);
      const warning = find('[data-exam-storage-error]');
      if (warning) warning.hidden = true;
      const status = find('[data-exam-save]');
      if (status) status.textContent = getSyncState().state === 'synced' ? 'Tersimpan di Google Sheets.' : 'Draf tersimpan · menunggu sinkronisasi.';
      return true;
    } catch {
      const warning = find('[data-exam-storage-error]');
      if (warning) { warning.hidden = false; warning.textContent = 'Draf belum bisa disimpan. Tetap di halaman ini dan unduh bukti pengerjaan setelah mengumpulkan jawaban.'; }
      return false;
    }
  }

  function refreshProgress() {
    const count = examAnswerCount(exam, attempt);
    find('[data-exam-count]').textContent = count;
    find('[data-exam-progress]').value = count;
    exam.questions.forEach(question => {
      const jump = find(`[data-exam-jump="${question.id}"]`);
      const answered = question.type === 'mcq' ? question.options.some(option => option.id === attempt.answers[question.id]) : Boolean(attempt.answers[question.id]?.trim());
      jump.classList.toggle('is-answered', answered);
      jump.classList.toggle('is-flagged', attempt.flags.includes(question.id));
    });
    section.querySelectorAll('[data-exam-violations]').forEach(node => { node.textContent = `Catatan keluar: ${attempt.violations.length} / ${MAX_EXAM_VIOLATIONS}`; });
  }

  function updateTimer() {
    if (!attempt || attempt.status !== 'active') return;
    const remaining = remainingExamSeconds(attempt);
    const formatted = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
    section.querySelectorAll('[data-exam-time]').forEach(node => { node.textContent = formatted; });
    find('.semester-timer')?.classList.toggle('is-urgent', remaining <= 300);
    if (!remaining) finish('Waktu ujian habis.');
  }

  function showPause(reason) {
    if (attempt?.status !== 'active' || finishing) return;
    section.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
    find('.semester-workspace').inert = true;
    find('[data-exam-monitor]').lastChild.textContent = ' Ujian dijeda · timer tetap berjalan';
    find('[data-exam-pause-reason]').textContent = reason;
    find('[data-exam-pause-count]').textContent = `${attempt.violations.length} dari ${MAX_EXAM_VIOLATIONS} kejadian keluar tercatat.`;
    find('[data-exam-pause]').hidden = false;
    find('[data-exam-pause]').focus({ preventScroll: true });
    refreshProgress();
  }

  function attachRoom() {
    section.innerHTML = examRoomMarkup(exam, attempt, baseUrl);
    find('[data-exam-monitor]').lastChild.textContent = attempt.supervision === 'fullscreen' ? ' Layar penuh · pengawasan aktif' : ' Pengawasan tab · layar penuh tidak tersedia';
    find('[data-exam-answers]').addEventListener('input', event => {
      const input = event.target.closest('[data-exam-answer]');
      if (!input || attempt.paused || attempt.status !== 'active') return;
      if (!remainingExamSeconds(attempt)) { finish('Waktu ujian habis.'); return; }
      attempt.answers[input.dataset.examAnswer] = input.value;
      persist(); refreshProgress();
    });
    section.querySelectorAll('[data-exam-jump]').forEach(button => button.addEventListener('click', () => {
      find(`#exam-${button.dataset.examJump}`).scrollIntoView({ behavior: 'auto', block: 'start' });
      section.querySelectorAll('[data-exam-jump]').forEach(node => node.classList.toggle('is-current', node === button));
    }));
    section.querySelectorAll('[data-exam-flag]').forEach(button => button.addEventListener('click', () => {
      if (attempt.paused) return;
      const id = button.dataset.examFlag;
      attempt.flags = attempt.flags.includes(id) ? attempt.flags.filter(value => value !== id) : [...attempt.flags, id];
      button.setAttribute('aria-pressed', String(attempt.flags.includes(id)));
      persist(); refreshProgress();
    }));
    const picture = find('[data-exam-figure-dialog]');
    section.querySelectorAll('[data-exam-zoom]').forEach(button => button.addEventListener('click', () => {
      if (attempt.paused) return;
      const question = exam.questions.find(question => question.id === button.dataset.examZoom);
      find('[data-exam-figure-title]').textContent = `Gambar soal ${exam.questions.indexOf(question) + 1} · ${question.job}`;
      find('[data-exam-figure-content]').innerHTML = semesterFigure(question.figure, baseUrl);
      picture.showModal();
    }));
    find('[data-exam-close-figure]').addEventListener('click', () => picture.close());
    const calculator = find('[data-exam-calculator]'), calculatorForm = find('[data-exam-calculate]');
    find('[data-exam-calculator-open]').addEventListener('click', () => { if (!attempt.paused) calculator.showModal(); });
    find('[data-exam-calculator-close]').addEventListener('click', () => calculator.close());
    calculatorForm.elements.operation.addEventListener('change', () => { calculatorForm.elements.second.disabled = calculatorForm.elements.operation.value === 'sqrt'; });
    calculatorForm.addEventListener('submit', event => {
      event.preventDefault();
      try {
        const result = calculateExamNumber(calculatorForm.elements.operation.value, calculatorForm.elements.first.value, calculatorForm.elements.second.value);
        find('[data-exam-calc-result]').textContent = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 8 }).format(result);
      } catch (error) { find('[data-exam-calc-result]').textContent = error.message; }
    });
    const confirm = find('[data-exam-confirm]');
    section.querySelectorAll('[data-exam-submit]').forEach(button => button.addEventListener('click', () => {
      const answered = examAnswerCount(exam, attempt);
      find('[data-exam-confirm-summary]').textContent = `${answered} dari 25 soal terjawab. ${25 - answered} soal belum diisi; ${attempt.flags.length} soal ditandai untuk ditinjau.`;
      confirm.showModal();
    }));
    find('[data-exam-cancel-submit]').addEventListener('click', () => confirm.close());
    find('[data-exam-confirm-submit]').addEventListener('click', () => { confirm.close(); finish('Dikumpulkan oleh peserta.'); });
    find('[data-exam-resume]').addEventListener('click', async event => {
      const button = event.currentTarget; button.disabled = true;
      try {
        const mode = await guard.resume();
        if (attempt.status !== 'active' || finishing) return;
        if (!remainingExamSeconds(attempt)) { finish('Waktu ujian habis.'); return; }
        attempt.supervision = mode; attempt.paused = false;
        persist(); find('.semester-workspace').inert = false; find('[data-exam-pause]').hidden = true;
        find('[data-exam-monitor]').lastChild.textContent = mode === 'fullscreen' ? ' Layar penuh · pengawasan aktif' : ' Pengawasan tab · layar penuh tidak tersedia';
      } catch {
        find('[data-exam-resume-error]').textContent = 'Layar penuh belum aktif. Izinkan layar penuh lalu coba lagi.';
      } finally { button.disabled = false; }
    });
    refreshProgress(); updateTimer();
  }

  async function scoreAndStore() {
    try {
      const { gradeSemesterExam } = await import('./semester-exam-grading.js');
      attempt.scores = gradeSemesterExam(exam, attempt);
    } catch { attempt.scores = null; }
    resultSaved = persist();
    try { storeSemesterResult(assessmentStorage, attempt); } catch { resultSaved = false; }
  }

  async function finish(reason) {
    if (finishing || attempt?.status !== 'active') return;
    finishing = true;
    clearInterval(timer); guard.stop();
    section.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
    attempt = { ...attempt, status: 'submitted', paused: false, submittedAt: Date.now(), submissionReason: reason };
    persist();
    section.innerHTML = '<div class="semester-shell semester-saving" role="status">Jawaban dikumpulkan. Menyiapkan bukti pengerjaan…</div>';
    await scoreAndStore();
    showResult();
    window.completeModule?.(exam.id, exam.title);
    finishing = false;
  }

  function showResult() {
    section.innerHTML = examResultMarkup(exam, attempt, resultSaved);
    find('[data-exam-download]').addEventListener('click', () => downloadSemesterAttempt(exam, attempt));
    find('[data-exam-home]').addEventListener('click', () => document.querySelector('[data-target="dashboard"]').click());
    find('[data-exam-new]').addEventListener('click', () => {
      // The previous submitted record remains in the local results archive.
      attempt = null; showIntro();
    });
  }

  function showIntro() {
    section.innerHTML = examIntroMarkup(exam, baseUrl);
    const profile = studentProfile();
    if (profile) {
      const form = find('[data-exam-start]');
      for (const name of ['name','className','absen']) { form.elements[name].value = profile[name]; form.elements[name].readOnly = true; }
    }
    if (isTeacher()) { find('button[type="submit"]').disabled = true; find('[data-exam-entry-error]').textContent = 'Pratinjau guru. Pengerjaan ujian dimulai melalui akun siswa.'; }
    find('[data-exam-start]').addEventListener('submit', async event => {
      event.preventDefault();
      if (!studentProfile()) return;
      const form = event.currentTarget, error = find('[data-exam-entry-error]');
      const input = Object.fromEntries(['name', 'className', 'absen'].map(name => [name, form.elements[name].value]));
      const checked = validateExamParticipant(input);
      if (checked.error) { error.textContent = checked.error; form.elements[checked.field].focus(); return; }
      if (!form.elements.agree.checked) { error.textContent = 'Baca aturan dan centang persetujuan sebelum memulai.'; form.elements.agree.focus(); return; }
      const button = form.querySelector('button[type="submit"]'); button.disabled = true;
      try {
        const mode = await guard.requestFullscreen();
        const draft = createExamAttempt(exam, checked.participant);
        draft.supervision = mode;
        saveExamAttempt(assessmentStorage, draft);
        attempt = draft;
        const queued = queueAssessment(semesterCloudAttempt(attempt), {immediate:true});
        if (queued) { attempt.revision = queued.revision; saveExamAttempt(assessmentStorage,attempt); }
        attachRoom(); guard.begin();
        timer = setInterval(updateTimer, 1000);
        section.scrollTop = 0; window.scrollTo({ top: 0, behavior: 'auto' });
      } catch (failure) {
        if (document.fullscreenElement === section) document.exitFullscreen().catch(() => {});
        error.textContent = failure.name === 'QuotaExceededError' || failure.name === 'SecurityError'
          ? 'Penyimpanan browser diperlukan untuk menyimpan jawaban. Izinkan penyimpanan, lalu coba lagi.'
          : 'Ujian belum dimulai. Pastikan layar penuh diizinkan, lalu coba lagi.';
      } finally { button.disabled = false; }
    });
  }

  try {
    attempt = readExamAttempt(assessmentStorage, exam);
    const remote = findRemoteAttempt(exam.id);
    if (remote) {
      const restored = { ...remote, examId:exam.id, version:exam.version, supervision:attempt?.supervision || 'monitored' };
      saveExamAttempt(assessmentStorage, restored);
      attempt = readExamAttempt(assessmentStorage, exam);
    }
  }
  catch {
    showIntro();
    find('[data-exam-entry-error]').textContent = 'Data ujian pada browser tidak bisa dibaca. Hubungi guru sebelum melanjutkan.';
    find('button[type="submit"]').disabled = true;
    return { hasPending: () => false };
  }
  if (attempt?.status === 'submitted') { scoreAndStore().then(showResult); }
  else showIntro();
  document.addEventListener('arcus:attempt-saved', event => {
    const ack = event.detail;
    if (attempt?.id !== ack.id || attempt.status !== 'active' || !ack.deadline) return;
    attempt.startedAt = ack.startedAt; attempt.deadline = ack.deadline; persist(false); updateTimer();
  });
  document.addEventListener('arcus:attempt-closed', event => {
    const remote = event.detail;
    if (attempt?.id !== remote?.id || attempt.status !== 'active') return;
    attempt.answers = remote.answers; finish(remote.submissionReason || 'Percobaan sudah disubmit di Google Sheets.');
  });
  document.addEventListener('arcus:sync', event => {
    const status = find('[data-exam-save]');
    if (status) status.textContent = event.detail.state === 'synced' ? 'Tersimpan di Google Sheets.' : event.detail.state === 'pending' ? 'Draf tersimpan · menunggu sinkronisasi.' : 'Draf di perangkat · sinkronisasi belum berhasil.';
  });
  return {
    hasPending: () => attempt?.status === 'active',
    restore() {
      document.querySelector(`[data-target="${exam.id}"]`).click();
      if (!remainingExamSeconds(attempt)) { finish('Waktu ujian habis saat sesi terputus.'); return; }
      if (!attempt.paused) attempt = recordExamViolation(attempt, 'Sesi ujian dimuat ulang atau sebelumnya terputus.');
      if (attempt.violations.length >= MAX_EXAM_VIOLATIONS) { finish('Batas tiga kejadian keluar tercapai.'); return; }
      attachRoom(); guard.begin({ startPaused: true }); persist();
      timer = setInterval(updateTimer, 1000);
      showPause('Percobaan sebelumnya masih berlangsung. Waktu tetap dihitung; lanjutkan pada ruang ujian ini.');
    }
  };
}

export function initSemesterExams() {
  const controllers = Object.values(SEMESTER_EXAMS).map(createExamController).filter(Boolean);
  controllers.find(controller => controller.hasPending())?.restore();
}
