export const STUDENT_SESSION_KEY = 'draftlab_student_session';

const clean = value => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
export function validateStudentIdentity(input) {
  const nama = clean(input?.nama), kelas = clean(input?.kelas);
  const rawAbsen = String(input?.absen ?? '').trim();
  if (nama.length < 3 || nama.length > 100) return { valid: false, field: 'nama', message: 'Isi nama lengkap, minimal 3 dan maksimal 100 karakter.' };
  if (!/^\d{1,2}$/.test(rawAbsen) || Number(rawAbsen) < 1 || Number(rawAbsen) > 99) return { valid: false, field: 'absen', message: 'Nomor absen harus bilangan bulat dari 1 sampai 99.' };
  if (!kelas || kelas.length > 60) return { valid: false, field: 'kelas', message: 'Isi kelas, maksimal 60 karakter.' };
  return { valid: true, student: { nama, absen: String(Number(rawAbsen)), kelas,
    ...(typeof input.loginAt === 'string' ? { loginAt: input.loginAt } : {}) } };
}

export function createStudentSessionStore(storage = () => localStorage) {
  let memory = null;
  let temporary = false;
  return {
    get() {
      if (temporary) return memory;
      let raw;
      try { raw = storage().getItem(STUDENT_SESSION_KEY); } catch { return memory; }
      try {
        const checked = validateStudentIdentity(JSON.parse(raw || 'null'));
        memory = checked.valid ? checked.student : null;
      } catch { memory = null; }
      return memory;
    },
    save(input) {
      const checked = validateStudentIdentity(input);
      if (!checked.valid) return { success: false, ...checked };
      memory = checked.student;
      try {
        storage().setItem(STUDENT_SESSION_KEY, JSON.stringify(memory));
        temporary = false;
        return { success: true, persisted: true, student: memory };
      } catch {
        temporary = true;
        return { success: true, persisted: false, student: memory };
      }
    },
    clear() {
      memory = null;
      temporary = true;
      try { storage().removeItem(STUDENT_SESSION_KEY); temporary = false; return true; } catch { return false; }
    }
  };
}

export const studentSessions = createStudentSessionStore();
export const getStudentSession = () => studentSessions.get();
export const studentDraftKey = (base, student) => {
  const checked = validateStudentIdentity(student);
  if (!checked.valid) return base;
  const { nama, kelas, absen } = checked.student;
  return `${base}:student:${encodeURIComponent(JSON.stringify([nama.toLocaleLowerCase('id'), kelas.toLocaleLowerCase('id'), absen]))}`;
};
