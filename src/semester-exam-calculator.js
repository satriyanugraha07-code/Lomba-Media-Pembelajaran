export function calculateExamNumber(operation, first, second) {
  const parse = value => {
    if (!String(value).trim()) throw new Error('Isi angka yang akan dihitung.');
    const number = Number(String(value).trim().replace(',', '.'));
    if (!Number.isFinite(number)) throw new Error('Gunakan angka yang valid.');
    return number;
  };
  const a = parse(first), b = operation === 'sqrt' ? 0 : parse(second);
  if (operation === '/' && b === 0) throw new Error('Pembagian dengan nol tidak dapat dihitung.');
  if (operation === 'sqrt' && a < 0) throw new Error('Akar kuadrat memerlukan angka tidak negatif.');
  const result = operation === '+' ? a + b : operation === '-' ? a - b : operation === '*' ? a * b : operation === '/' ? a / b : operation === 'sqrt' ? Math.sqrt(a) : NaN;
  if (!Number.isFinite(result)) throw new Error('Hasil perhitungan tidak tersedia.');
  return result;
}
