import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SEMESTER_EXAMS } from '../src/semester-exam-data.js';
import { semesterFigure } from '../src/semester-exam-figures.js';
import { createExamAttempt, readExamAttempt, saveExamAttempt, recordExamViolation, remainingExamSeconds, examAnswerCount, validateExamParticipant, storeSemesterResult, readSemesterResults, examAttemptKey } from '../src/semester-exam-session.js';
import { gradeSemesterExam, ESSAY_RUBRICS } from '../src/semester-exam-grading.js';
import { semesterResultsCsv } from '../src/semester-exam-export.js';
import { examRoomMarkup, examResultMarkup } from '../src/semester-exam-markup.js';
import { createSemesterGuard } from '../src/semester-exam-guard.js';
import { calculateExamNumber } from '../src/semester-exam-calculator.js';

const person = { name: 'Peserta Contoh', className: 'X TP 1', absen: '07' };
const make = (exam = SEMESTER_EXAMS.uts, extra = {}) => createExamAttempt(exam, person, { now: 10000, id: 'attempt-example', random: () => .25, ...extra });
const storage = () => { const values = new Map(); return { values, getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }; };

test('in-room calculator supports decimal comma, geometry calculations and rejects invalid operations', () => {
  assert.equal(calculateExamNumber('*', '3,14', '40'), 125.60000000000001);
  assert.ok(Math.abs(calculateExamNumber('sqrt', '5800', '') - 76.157731) < .00001);
  assert.equal(calculateExamNumber('/', '100', '2'), 50);
  assert.throws(() => calculateExamNumber('/', '12', '0'));
  assert.throws(() => calculateExamNumber('sqrt', '-1', ''));
  assert.throws(() => calculateExamNumber('+', 'bad()', '3'));
  assert.throws(() => calculateExamNumber('eval', '1', '2'));
});

test('both job-based papers contain 20 illustrated MCQs and 5 illustrated essays, totaling 100 points', () => {
  for (const exam of Object.values(SEMESTER_EXAMS)) {
    assert.equal(exam.questions.length, 25);
    assert.equal(new Set(exam.questions.map(question => question.id)).size, 25);
    assert.equal(exam.questions.filter(question => question.type === 'mcq').length, 20);
    assert.equal(exam.questions.filter(question => question.type === 'essay').length, 5);
    assert.equal(exam.questions.reduce((total, question) => total + question.points, 0), 100);
    for (const question of exam.questions) {
      assert.ok(question.job.length > 5);
      assert.match(semesterFigure(question.figure), /<svg|<img/);
      if (question.type === 'mcq') {
        assert.equal(question.options.length, 4);
        assert.equal(new Set(question.options.map(option => option.text)).size, 4);
      }
    }
    assert.equal(ESSAY_RUBRICS[exam.id].length, 5);
    assert.ok(ESSAY_RUBRICS[exam.id].every(criteria => criteria.length === 4));
  }
  assert.equal(SEMESTER_EXAMS.uts.durationMinutes, 60);
  assert.equal(SEMESTER_EXAMS.uas.durationMinutes, 90);
  assert.ok(readFileSync(new URL('../public/exams/jobs/dudukan-silinder.webp', import.meta.url)).length > 1000);
});

test('numeric answer keys agree with the geometry and dimensions used by the questions', () => {
  for (const [exam, id, expected] of [
    [SEMESTER_EXAMS.uts, 'u03', '14 mm'], [SEMESTER_EXAMS.uts, 'u05', '30 mm'],
    [SEMESTER_EXAMS.uts, 'u13', `${(3.14 * 40).toFixed(1)} mm`], [SEMESTER_EXAMS.uts, 'u20', '141,8°'],
    [SEMESTER_EXAMS.uas, 'a01', '125,66 mm'], [SEMESTER_EXAMS.uas, 'a02', '10,47 mm'],
    [SEMESTER_EXAMS.uas, 'a13', `${(40 - 16) / 2} mm`], [SEMESTER_EXAMS.uas, 'a20', `${100 / 2} mm`]
  ]) {
    const question = exam.questions.find(question => question.id === id);
    const option = question.options.find(option => option.text === expected.replace('125.6', '125,6'));
    assert.ok(option, `${id}: expected dimension is present`);
    const attempt = make(exam); attempt.answers[id] = option.id;
    assert.equal(gradeSemesterExam(exam, attempt).mcqScore, 3, id);
  }
  assert.ok(Math.abs(360 * 30 / Math.hypot(70, 30) - 141.8) < .05);
});

test('shuffled semantic option IDs, answers, flags and absolute deadlines survive refresh', () => {
  const disk = storage(), exam = SEMESTER_EXAMS.uts, attempt = make();
  attempt.answers.u01 = '2'; attempt.answers.u21 = 'Langkah pengerjaan saya.'; attempt.flags = ['u01', 'u21'];
  saveExamAttempt(disk, attempt);
  const restored = readExamAttempt(disk, exam);
  assert.deepEqual(restored, attempt);
  assert.equal(remainingExamSeconds(restored, 10000 + 125000), 60 * 60 - 125);
  assert.equal(remainingExamSeconds(restored, attempt.deadline + 10000), 0);
  assert.equal(examAnswerCount(exam, restored), 2);
  for (const order of Object.values(restored.optionOrder)) assert.deepEqual([...order].sort(), ['0', '1', '2', '3']);
});

test('empty or forged participant data, deadlines, option orders and invalid answers are rejected', () => {
  assert.ok(validateExamParticipant({ ...person, name: ' ' }).error);
  assert.ok(validateExamParticipant({ ...person, absen: '0' }).error);
  assert.ok(validateExamParticipant({ ...person, absen: '1.5' }).error);
  const exam = SEMESTER_EXAMS.uts;
  for (const mutate of [a => a.deadline++, a => a.optionOrder.u01 = ['0', '0', '1', '2'], a => a.answers.u01 = '9', a => a.violations.push({ reason: 'Invalid' })]) {
    const disk = storage(), attempt = make(); mutate(attempt); saveExamAttempt(disk, attempt);
    assert.throws(() => readExamAttempt(disk, exam));
    assert.ok(disk.getItem(examAttemptKey(exam.id)), 'bad data is not silently discarded');
  }
});

test('one departure episode counts once across focus, visibility and fullscreen events, and survives reload', () => {
  let attempt = make();
  attempt = recordExamViolation(attempt, 'Tab tersembunyi', 12000);
  attempt = recordExamViolation(attempt, 'Fokus hilang', 12050);
  attempt = recordExamViolation(attempt, 'Keluar layar penuh', 12100);
  assert.equal(attempt.violations.length, 1);
  const disk = storage(); saveExamAttempt(disk, attempt); attempt = readExamAttempt(disk, SEMESTER_EXAMS.uts);
  assert.equal(attempt.paused, true);
  attempt.paused = false; attempt = recordExamViolation(attempt, 'Kejadian kedua', 15000);
  attempt.paused = false; attempt = recordExamViolation(attempt, 'Kejadian ketiga', 20000);
  assert.equal(attempt.violations.length, 3);
  attempt.status = 'submitted'; attempt.paused = false;
  assert.equal(recordExamViolation(attempt, 'Setelah selesai', 30000), attempt);
});

test('essays remain ungraded and whitespace is not counted as an answer', () => {
  const attempt = make(); attempt.answers.u01 = '0'; attempt.answers.u02 = '0';
  attempt.answers.u21 = '   '; attempt.answers.u22 = 'Jawaban panjang tidak berarti otomatis benar.';
  const score = gradeSemesterExam(SEMESTER_EXAMS.uts, attempt);
  assert.equal(score.mcqScore, 3); assert.equal(score.essayAnswered, 1);
  assert.equal(score.finalScore, null); assert.equal(score.essayMax, 40);
});

test('submitted results are idempotent, preserve other attempts and export safe CSV with full answers', () => {
  const disk = storage(), first = { ...make(), status: 'submitted', submittedAt: 50000, submissionReason: 'Selesai', scores: { mcqScore: 3, essayAnswered: 1 } };
  first.participant.name = '=HYPERLINK("https://example.invalid")'; first.answers.u21 = 'Dua baris\n"Jawaban"';
  storeSemesterResult(disk, first); storeSemesterResult(disk, first);
  storeSemesterResult(disk, { ...first, id: 'second-attempt' });
  const records = readSemesterResults(disk); assert.equal(records.length, 2);
  const csv = semesterResultsCsv(records);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.match(csv, /'=HYPERLINK/);
  assert.match(csv, /Dua baris\n""Jawaban""/);
  assert.match(csv, /Menunggu penilaian uraian/);
});

test('all 25 questions render together and participant/essay markup cannot inject HTML', () => {
  const attempt = make(); attempt.participant.name = '<script>bad</script>'; attempt.answers.u21 = '</textarea><img src=x onerror=bad>';
  const html = examRoomMarkup(SEMESTER_EXAMS.uts, attempt, '/nested/');
  assert.equal((html.match(/class="semester-question"/g) || []).length, 25);
  assert.equal((html.match(/data-exam-zoom=/g) || []).length, 25);
  assert.doesNotMatch(html, /<script>bad|<img src=x/);
  assert.match(html, /&lt;script&gt;/);
  const result = examResultMarkup(SEMESTER_EXAMS.uts, { ...attempt, submittedAt: 50000, submissionReason: 'Selesai', scores: null }, false);
  assert.match(result, /Unduh bukti/);
  assert.doesNotMatch(result, /<script>bad/);
});

function guardEnvironment(fullscreenSupported = true) {
  const page = new EventTarget(), browser = new EventTarget();
  page.body = { classList: { add() {}, remove() {} } };
  page.hidden = false; page.visibilityState = 'visible'; page.hasFocus = () => true;
  page.fullscreenEnabled = fullscreenSupported;
  browser.location = { href: 'https://example.test/exam' }; browser.navigator = {};
  browser.history = { state: { previous: true }, pushes: 0, pushState(state) { this.state = state; this.pushes++; }, replaceState(state) { this.state = state; } };
  const section = { id: 'uts', dataset: {}, contains: node => node.inside === true };
  if (fullscreenSupported) section.requestFullscreen = async () => { page.fullscreenElement = section; page.dispatchEvent(new Event('fullscreenchange')); };
  page.exitFullscreen = async () => { page.fullscreenElement = null; page.dispatchEvent(new Event('fullscreenchange')); };
  const timers = [];
  return { page, browser, section, environment: { document: page, window: browser, setTimeout: fn => { timers.push(fn); return timers.length; }, clearTimeout() {} }, timers };
}

test('guard verifies fullscreen, blocks navigation/back/reload, deduplicates and removes all restrictions after completion', async () => {
  const env = guardEnvironment(), reasons = []; let saves = 0;
  const guard = createSemesterGuard({ section: env.section, environment: env.environment, onViolation: reason => reasons.push(reason), onSave: () => saves++, onBlocked() {} });
  assert.equal(await guard.requestFullscreen(), 'fullscreen'); guard.begin();
  const before = new Event('beforeunload', { cancelable: true }); env.browser.dispatchEvent(before);
  assert.equal(before.defaultPrevented, true); assert.equal(saves, 1);
  env.page.hidden = true; env.page.visibilityState = 'hidden'; env.page.dispatchEvent(new Event('visibilitychange'));
  env.page.fullscreenElement = null; env.page.dispatchEvent(new Event('fullscreenchange'));
  assert.equal(reasons.length, 1);
  env.page.hidden = false; env.page.visibilityState = 'visible'; await guard.resume();
  const nav = new Event('click', { cancelable: true });
  Object.defineProperty(nav, 'target', { value: { closest: () => ({ dataset: { target: 'dashboard' }, matches: () => false }) } });
  env.page.dispatchEvent(nav); assert.equal(nav.defaultPrevented, true); assert.equal(reasons.length, 2);
  await guard.resume(); env.browser.dispatchEvent(new Event('popstate')); assert.equal(reasons.length, 3);
  assert.equal(env.browser.history.pushes, 2);
  guard.stop();
  const after = new Event('beforeunload', { cancelable: true }); env.browser.dispatchEvent(after);
  assert.equal(after.defaultPrevented, false); assert.equal(saves, 1);
  env.browser.dispatchEvent(new Event('popstate')); assert.equal(env.browser.history.pushes, 2);
  assert.equal(env.section.dataset.examRunning, undefined);
  assert.deepEqual(env.browser.history.state, { previous: true });
});

test('unsupported fullscreen is disclosed, while rejected fullscreen never starts supervision', async () => {
  const unsupported = guardEnvironment(false);
  const makeGuard = env => createSemesterGuard({ section: env.section, environment: env.environment, onViolation() {}, onSave() {}, onBlocked() {} });
  const fallback = makeGuard(unsupported); assert.equal(await fallback.requestFullscreen(), 'monitored');
  const refused = guardEnvironment(); refused.section.requestFullscreen = async () => { throw new Error('denied'); };
  const guard = makeGuard(refused); await assert.rejects(guard.requestFullscreen());
  assert.equal(refused.browser.history.pushes, 0); assert.equal(refused.section.dataset.examRunning, undefined);
  const event = new Event('beforeunload', { cancelable: true }); refused.browser.dispatchEvent(event); assert.equal(event.defaultPrevented, false);
});

test('a delayed fullscreen response cannot reopen an exam after automatic submission', async () => {
  const env = guardEnvironment();
  const guard = createSemesterGuard({ section: env.section, environment: env.environment, onViolation() {}, onSave() {}, onBlocked() {} });
  await guard.requestFullscreen(); guard.begin();
  let completeRequest;
  env.section.requestFullscreen = () => new Promise(resolve => { completeRequest = () => { env.page.fullscreenElement = env.section; resolve(); }; });
  const pending = guard.resume();
  guard.stop(); completeRequest();
  await assert.rejects(pending, /sudah berakhir/);
  assert.equal(env.page.fullscreenElement, null);
  assert.equal(env.section.dataset.examRunning, undefined);
});
