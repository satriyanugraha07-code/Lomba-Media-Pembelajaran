// Keep the PDF's own job numbers separate from the two existing exercises.
const documents = [
  [1, 'Konstruksi geometri 03', 'Job_01_Konstruksi_Geometri_03.pdf'],
  [2, 'Bentangan 01 · Silinder', 'Job_02_Bentangan_01_Silinder.pdf'],
  [4, 'Konstruksi geometri 01', 'Job_04_Konstruksi_Geometri_01.pdf'],
  [5, 'Konstruksi geometri 02', 'Job_05_Konstruksi_Geometri_02.pdf'],
  [6, 'Bentangan kerucut', 'Job_06_Bentangan_Kerucut.pdf'],
  [7, 'Bentangan pipa miring', 'Job_07_Bentangan_Pipa_Miring.pdf'],
  [8, 'Bukaan pipa miring', 'Job_08_Bukaan_Pipa_Miring.pdf'],
  [9, 'Isometri · Garis bantu', 'Job_09_Isometri_Garis_Bantu.pdf'],
  [10, 'Isometri · Dudukan silinder', 'Job_10_Isometri_Dudukan_Silinder.pdf']
];

export const LKPD_PDF_JOBS = documents.map(([number, title, filename]) => ({
  id: 100 + number,
  label: `PDF · Job ${String(number).padStart(2, '0')}`,
  title,
  format: 'pdf',
  sourcePath: `worksheets/${filename}`,
  downloadName: filename
}));
