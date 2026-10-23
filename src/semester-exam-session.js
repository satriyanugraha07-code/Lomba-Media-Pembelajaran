export const MAX_EXAM_VIOLATIONS = 3;
export const SEMESTER_RESULTS_KEY = 'arcus_semester_results_v1';
export const examAttemptKey = id => `arcus_semester_attempt_v1:${id}`;

export function validateExamParticipant(input = {}) {
  const name = String(input.name || '').trim().replace(/\s+/g, ' ');
  const className = String(input.className || '').trim().replace(/\s+/g, ' ');
  const absen = String(input.absen || '').trim();
  if (name.length < 3 || name.length > 100) return { error: 'Isi nama peserta, 3–100 karakter.', field: 'name' };
  if (!className || className.length > 60) return { error: 'Isi kelas peserta, maksimal 60 karakter.', field: 'className' };
  if (!/^\d{1,2}$/.test(absen) || +absen < 1) return { error: 'Nomor absen harus 1–99.', field: 'absen' };
  return { participant: { name, className, absen: String(+absen) } };
}

export function createExamAttempt(exam, input, { now = Date.now(), id = crypto.randomUUID(), random = Math.random } = {}) {
  const checked = validateExamParticipant(input);
  if (checked.error) throw new Error(checked.error);
  const optionOrder = {};
  for (const question of exam.questions.filter(question => question.type === 'mcq')) {
    const order = question.options.map(option => option.id);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    optionOrder[question.id] = order;
  }
  return {
    id, examId: exam.id, version: exam.version, participant: checked.participant,
    startedAt: now, deadline: now + exam.durationMinutes * 60000, status: 'active',
    answers: {}, flags: [], violations: [], paused: false, optionOrder
  };
}

export const remainingExamSeconds = (attempt, now = Date.now()) => Math.max(0, Math.ceil((attempt.deadline - now) / 1000));
export const answeredQuestion = (question, answers) => question.type === 'mcq'
  ? question.options.some(option => option.id === answers[question.id])
  : typeof answers[question.id] === 'string' && answers[question.id].trim().length > 0;
export const examAnswerCount = (exam, attempt) => exam.questions.filter(question => answeredQuestion(question, attempt.answers)).length;

export function recordExamViolation(attempt, reason, now = Date.now()) {
  // Visibility, focus, and fullscreen events from one departure count as one episode.
  if (attempt.status !== 'active' || attempt.paused) return attempt;
  return { ...attempt, paused: true, violations: [...attempt.violations, { reason, at: now }] };
}

export function readExamAttempt(storage, exam) {
  const raw = storage.getItem(examAttemptKey(exam.id));
  if (!raw) return null;
  const attempt = JSON.parse(raw);
  if (!attempt || attempt.examId !== exam.id || attempt.version !== exam.version || !['active', 'submitted'].includes(attempt.status)
      || typeof attempt.id !== 'string' || !attempt.id || !validateExamParticipant(attempt.participant || {}).participant
      || !Number.isFinite(attempt.startedAt) || attempt.deadline !== attempt.startedAt + exam.durationMinutes * 60000
      || !attempt.answers || typeof attempt.answers !== 'object' || Array.isArray(attempt.answers)
      || !Array.isArray(attempt.flags) || !Array.isArray(attempt.violations) || typeof attempt.paused !== 'boolean'
      || !attempt.violations.every(entry => entry && typeof entry.reason === 'string' && Number.isFinite(entry.at))) {
    throw new Error('Data percobaan tidak sesuai. Hubungi guru sebelum melanjutkan.');
  }
  for (const question of exam.questions) {
    const answer = attempt.answers[question.id];
    if (answer !== undefined && (typeof answer !== 'string' || (question.type === 'essay' ? answer.length > 10000 : !question.options.some(option => option.id === answer)))) {
      throw new Error('Draf jawaban tidak sesuai. Hubungi guru.');
    }
    if (question.type === 'mcq') {
      const order = attempt.optionOrder?.[question.id];
      if (!Array.isArray(order) || order.length !== 4 || new Set(order).size !== 4 || !order.every(id => question.options.some(option => option.id === id))) {
        throw new Error('Urutan pilihan jawaban tidak sesuai. Hubungi guru.');
      }
    }
  }
  return attempt;
}

export function saveExamAttempt(storage, attempt) {
  storage.setItem(examAttemptKey(attempt.examId), JSON.stringify(attempt));
}

export function storeSemesterResult(storage, attempt) {
  const raw = storage.getItem(SEMESTER_RESULTS_KEY);
  const records = raw ? JSON.parse(raw) : [];
  if (!Array.isArray(records)) throw new Error('Rekap lama tidak dapat dibaca. Unduh bukti pengerjaan.');
  const existing = records.findIndex(record => record.id === attempt.id);
  if (existing >= 0) records[existing] = attempt;
  else records.unshift(attempt);
  storage.setItem(SEMESTER_RESULTS_KEY, JSON.stringify(records));
}

export function readSemesterResults(storage) {
  const raw = storage.getItem(SEMESTER_RESULTS_KEY);
  if (!raw) return [];
  const records = JSON.parse(raw);
  if (!Array.isArray(records)) throw new Error('Rekap ujian tidak dapat dibaca.');
  return records.filter(record => record && record.status === 'submitted' && ['uts', 'uas'].includes(record.examId));
}
