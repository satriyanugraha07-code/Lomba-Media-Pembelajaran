import { SEMESTER_EXAMS } from './semester-exam-data.js';
import { readSemesterResults } from './semester-exam-session.js';
import { downloadSemesterAttempt, downloadSemesterCsv } from './semester-exam-export.js';
import { assessmentStorage } from './auth-session.js';

export function renderSemesterExamResults() {
  const body = document.getElementById('semester-results-body');
  const count = document.getElementById('semester-results-count');
  const exportButton = document.getElementById('semester-results-export');
  if (!body) return;
  body.replaceChildren();
  let records = [];
  try { records = readSemesterResults(assessmentStorage); }
  catch {
    const row = body.insertRow(), cell = row.insertCell();
    cell.colSpan = 8; cell.textContent = 'Rekap belum bisa dibaca. Bukti yang diunduh peserta tetap dapat digunakan.';
    exportButton.disabled = true;
    return;
  }
  count.textContent = `${records.length} percobaan tersimpan`;
  exportButton.disabled = records.length === 0;
  exportButton.onclick = () => downloadSemesterCsv(records);
  if (!records.length) {
    const cell = body.insertRow().insertCell();
    cell.colSpan = 8; cell.textContent = 'Belum ada hasil Tes Tengah Semester atau Tes Akhir Semester di perangkat ini.';
    return;
  }
  records.forEach(attempt => {
    const exam = SEMESTER_EXAMS[attempt.examId], row = body.insertRow();
    [exam.badge, attempt.participant?.name || '—', `${attempt.participant?.className || '—'} · No. ${attempt.participant?.absen || '—'}`,
      attempt.scores ? `${attempt.scores.mcqScore} / 60` : 'Menunggu', `${attempt.scores?.essayAnswered ?? '—'} / 5 · dinilai guru`,
      `${attempt.violations?.length || 0} · ${attempt.submissionReason || ''}`, new Date(attempt.submittedAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })]
      .forEach(value => { row.insertCell().textContent = value; });
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'rekap-btn-csv'; button.textContent = 'Unduh bukti';
    button.addEventListener('click', () => downloadSemesterAttempt(exam, attempt));
    row.insertCell().append(button);
  });
}
