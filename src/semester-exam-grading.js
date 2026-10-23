// Loaded only when an attempt is submitted; solutions are never inserted into the exam page.
const answers = {
  uts: [0, 1, 2, 3, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2],
  uas: [2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3]
};

export const ESSAY_RUBRICS = {
  uts: [
    ['A: garis benda terlihat, kontinu tebal', 'B: garis bantu/ukuran, kontinu tipis', 'C: rusuk tersembunyi, gores tipis', 'D: sumbu, gores-titik tipis'],
    ['Lingkaran R30 dan sumbu dibuat tipis', 'Bukaan jangka R30 dipindahkan enam kali', 'Enam titik berurutan dihubungkan', 'Kesamaan sisi dan penutupan diperiksa'],
    ['Panjang πD = 125,6 mm', 'Tinggi bentangan 45 mm', 'Dua belas interval sama, sekitar 10,47 mm', 'Nomor generator sesuai dan sambungan diperiksa'],
    ['s = √5800 ≈ 76,2 mm', 'θ = 360 × 30/√5800 ≈ 141,8°', 'Busur juring sama dengan 2πr', 'Bukan tinggi tegak sebagai radius juring'],
    ['Sumber kesalahan alat/titik pusat dijelaskan', 'Kesalahan pemindahan jarak atau pembagian sudut dijelaskan', 'Sudut, sisi, dan penutupan diperiksa', 'Garis bantu dikoreksi sebelum penebalan']
  ],
  uas: [
    ['Keliling 125,66 mm dan interval 10,47 mm', 'Tampak depan serta pembagian lingkaran benar', 'Tinggi dipindahkan ke generator bernomor sama', 'Kurva halus dan ujung sambungan sama tinggi'],
    ['Ujung berbeda tidak cocok saat disambung', 'Urutan generator 1 sampai kembali 1 diperiksa', 'Tinggi tiap titik ditelusuri ke tampak depan', 'Kurva dan titik akhir dikoreksi tanpa mengubah keliling'],
    ['X/Y 30° dan Z tegak', 'Kotak batas dibangun menurut ukuran sumbu', 'Detail dipindahkan sejajar sumbu yang sesuai', 'Kesamaan arah, ukuran, dan garis benda diperiksa'],
    ['Kotak batas 100 × 60 × 80 dan alas/tiang dibangun', 'Boss Ø40 tinggi 20 dan elips lubang Ø16 sepusat', 'Takik atas 30 × 10 dan alas 20 × 8 diperiksa', 'Pengaku lebar 10, garis bantu, dan garis benda diperiksa'],
    ['Silinder: persegi panjang πD × tinggi', 'Kerucut: juring dengan radius garis pelukis', 'Isometri: tiga sumbu dan lingkaran menjadi elips', 'Pemeriksaan keliling/busur dan ukuran menurut sumbu dijelaskan']
  ]
};

export function gradeSemesterExam(exam, attempt) {
  let correctCount = 0;
  const mcqs = exam.questions.filter(question => question.type === 'mcq');
  mcqs.forEach((question, index) => {
    if (attempt.answers[question.id] === String(answers[exam.id][index])) correctCount++;
  });
  const essayAnswered = exam.questions.filter(question => question.type === 'essay' && String(attempt.answers[question.id] || '').trim().length > 0).length;
  return { correctCount, mcqScore: correctCount * 3, mcqMax: 60, essayAnswered, essayCount: 5, essayMax: 40, finalScore: null };
}
