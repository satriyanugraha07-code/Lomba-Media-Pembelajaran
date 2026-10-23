import { getSession, studentProfile, assessmentStorage } from './auth-session.js';
import { cloudRequest } from './cloud-client.js';
import { createOutbox } from './cloud-outbox.js';

let outbox, timer, retry, lastState = { state: 'idle', count: 0 }, remoteAttempts = [];
const title = { diagnostik: 'Tes Diagnostik', posttest: 'Tes Pemahaman', uts: 'Tes Tengah Semester', uas: 'Tes Akhir Semester' };
const announce = state => { lastState = state; document.dispatchEvent(new CustomEvent('arcus:sync', { detail: state })); };
export function getSyncState() { return lastState; }
export function getRemoteAttempts() { return remoteAttempts; }
export async function initAssessmentSync() {
  if (!studentProfile()) return;
  const session = getSession();
  outbox = createOutbox({ storage: localStorage, key: `arcus_outbox_v1:${session.profile.id}`,
    send: async attempt => {
      const ack = await cloudRequest('saveAttempt', { attempt }, getSession()?.token);
      document.dispatchEvent(new CustomEvent('arcus:attempt-saved', { detail: ack }));
      return ack;
    }, onChange: announce,
    onClosed: attempt => document.dispatchEvent(new CustomEvent('arcus:attempt-closed', { detail: attempt })) });
  try {
    await outbox.flush();
    remoteAttempts = await cloudRequest('ownAttempts', {}, session.token);
  } catch (error) { announce({ state: 'error', error: error.message, count: outbox.pending() }); }
  announce({ ...lastState, count: outbox.pending() });
  const retryPending = () => { if (outbox.pending()) flushAssessments(); };
  window.addEventListener('online', retryPending);
  retry = setInterval(retryPending, 10000);
  window.addEventListener('pagehide', () => {
    // An unacknowledged unload remains queued and is retried on the next login.
    const pending = Object.values(outbox.snapshot());
    for (const attempt of pending) {
      if (new TextEncoder().encode(JSON.stringify(attempt)).length > 45000) continue;
      cloudRequest('saveAttempt', { attempt }, getSession()?.token, { keepalive: true }).catch(() => {});
    }
  });
}
export function queueAssessment(attempt, { immediate = false } = {}) {
  if (!studentProfile() || !outbox) return;
  try {
    const next = outbox.enqueue({ ...attempt, examTitle: title[attempt.examId] || attempt.examId });
    clearTimeout(timer); timer = setTimeout(flushAssessments, immediate ? 0 : 1000);
    return next;
  } catch (error) { announce({ state: 'storage', error: 'Antrean jawaban belum tersimpan. Tetap di halaman ini dan beri tahu guru.', count: outbox.pending() }); }
}
export async function flushAssessments() {
  clearTimeout(timer);
  try { await outbox?.flush(); } catch { /* Status is reported and the persisted queue is retained. */ }
}
export function legacyAttempt(examId, answers, submitted = false, extra = {}) {
  const key = `cloud_attempt:${examId}`;
  let meta;
  try { meta = JSON.parse(assessmentStorage.getItem(key) || 'null'); } catch {}
  if (!meta) meta = { id: crypto.randomUUID(), startedAt: Date.now(), revision: 0 };
  if (meta.status === 'submitted' && !submitted) return null;
  const attempt = { ...meta, examId, answers: structuredClone(answers), status: submitted ? 'submitted' : 'active', ...extra };
  const queued = queueAssessment(attempt, { immediate: submitted });
  const value = queued || attempt;
  assessmentStorage.setItem(key, JSON.stringify({ id: value.id, startedAt: value.startedAt, revision: value.revision, status: value.status }));
  return value;
}
export function beginLegacyRetry(examId) { assessmentStorage.removeItem(`cloud_attempt:${examId}`); }
export function findRemoteAttempt(examId) { return remoteAttempts.filter(attempt => attempt.examId === examId).sort((a, b) => b.updatedAt - a.updatedAt)[0]; }
export function semesterCloudAttempt(attempt) { return { id: attempt.id, examId: attempt.examId, version: attempt.version, revision:attempt.revision || 0, startedAt: attempt.startedAt, deadline: attempt.deadline, answers: attempt.answers, status: attempt.status, submittedAt: attempt.submittedAt || null, submissionReason: attempt.submissionReason || '', violations: attempt.violations, optionOrder: attempt.optionOrder, flags: attempt.flags, paused: attempt.paused }; }

export function initTestVisitTracking() {
  if (!studentProfile()) return;
  for (const [id, examId] of [['diagnostik','diagnostik'],['quiz','posttest']]) {
    const section = document.getElementById(id); let active = false;
    const check = () => {
      const next = section.classList.contains('active');
      if (next && !active) document.dispatchEvent(new CustomEvent('arcus:test-visited',{detail:{examId}}));
      active = next;
    };
    new MutationObserver(check).observe(section,{attributes:true,attributeFilter:['class']}); check();
  }
}
