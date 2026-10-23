export const AUTH_SESSION_KEY = 'arcus_auth_session_v1';
let current = null;
export function getSession() { return current; }
export function setSession(value) { current = value; }
export function studentProfile() { return current?.role === 'student' ? current.profile : null; }
export function isTeacher() { return current?.role === 'teacher'; }
export function validateStudentLogin(input) {
  const name = String(input.name || '').trim().replace(/\s+/g, ' ');
  const className = String(input.className || '').trim().replace(/\s+/g, ' ');
  const absen = String(input.absen || '').trim();
  if (name.length < 3 || name.length > 100) throw new Error('Isi nama lengkap, 3–100 karakter.');
  if (!className || className.length > 60) throw new Error('Isi kelas, maksimal 60 karakter.');
  if (!/^\d{1,2}$/.test(absen) || +absen < 1) throw new Error('No. absen harus 1–99.');
  return { name, className, absen: String(+absen) };
}
export function studentStorageKey(key, session = current) {
  if (!session?.profile?.id) throw new Error('Masuk terlebih dahulu untuk membuka data tes.');
  return `arcus_user_v1:${session.profile.id}:${key}`;
}
export const assessmentStorage = {
  getItem(key) { return current ? localStorage.getItem(studentStorageKey(key)) : null; },
  setItem(key, value) { localStorage.setItem(studentStorageKey(key), value); },
  removeItem(key) { if (current) localStorage.removeItem(studentStorageKey(key)); }
};
