import { SEMESTER_EXAMS } from './semester-exam-data.js';

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadSemesterAttempt(exam, attempt) {
  const record = {
    ...attempt,
    examTitle: exam.title,
    answers: exam.questions.map((question, index) => ({
      number: index + 1, job: question.job, question: question.prompt, type: question.type,
      answer: question.type === 'mcq' ? question.options.find(option => option.id === attempt.answers[question.id])?.text || '' : attempt.answers[question.id] || ''
    }))
  };
  download(new Blob([JSON.stringify(record, null, 2)], { type: 'application/json;charset=utf-8' }), `${exam.badge}-${attempt.id}.json`);
}

const cell = value => {
  let text = String(value ?? '');
  if (/^[\s]*[=+@\-]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
};
export function semesterResultsCsv(records) {
  const headers = ['Ujian', 'ID', 'Nama', 'Kelas', 'No. absen', 'Waktu mulai', 'Waktu selesai', 'PG (60)', 'Uraian terjawab (5)', 'Nilai akhir', 'Jumlah catatan keluar', 'Alasan pengumpulan', 'Rincian catatan', ...Array.from({ length: 25 }, (_, i) => `Jawaban ${i + 1}`)];
  const rows = records.map(attempt => {
    const exam = SEMESTER_EXAMS[attempt.examId];
    return [exam.title, attempt.id, attempt.participant?.name, attempt.participant?.className, attempt.participant?.absen,
      new Date(attempt.startedAt).toISOString(), new Date(attempt.submittedAt).toISOString(), attempt.scores?.mcqScore ?? '', attempt.scores?.essayAnswered ?? '', 'Menunggu penilaian uraian', attempt.violations?.length || 0, attempt.submissionReason,
      (attempt.violations || []).map(entry => `${new Date(entry.at).toISOString()}: ${entry.reason}`).join(' | '),
      ...exam.questions.map(question => question.type === 'mcq' ? question.options.find(option => option.id === attempt.answers?.[question.id])?.text || '' : attempt.answers?.[question.id] || '')];
  });
  return '\uFEFF' + [headers, ...rows].map(row => row.map(cell).join(',')).join('\r\n') + '\r\n';
}

export function downloadSemesterCsv(records) {
  download(new Blob([semesterResultsCsv(records)], { type: 'text/csv;charset=utf-8' }), `Rekap-Ujian-Semester-${new Date().toISOString().slice(0, 10)}.csv`);
}
