import test from 'node:test';
import assert from 'node:assert/strict';
import { createStudentSessionStore, validateStudentIdentity, studentDraftKey, STUDENT_SESSION_KEY } from '../src/student-session.js';

const student = { nama: 'Siswa Contoh', absen: '7', kelas: 'X TP 1' };
function storage() {
  const data = new Map();
  return { data, getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
}
test('valid identity is normalized and restored by a fresh session store after refresh', () => {
  const disk = storage(), store = createStudentSessionStore(() => disk);
  const result = store.save({ nama: '  Siswa   Contoh  ', absen: '07', kelas: '  X  TP 1 ' });
  assert.equal(result.persisted, true);
  assert.deepEqual(createStudentSessionStore(() => disk).get(), student);
});
test('invalid names, classes and absent numbers cannot replace an existing session', () => {
  const disk = storage(), store = createStudentSessionStore(() => disk);
  store.save(student);
  for (const change of [{ nama: '   ' }, { nama: 'Al' }, { nama: 'x'.repeat(101) }, { kelas: '\n\t' }, { absen: '0' }, { absen: '-2' }, { absen: '1.5' }, { absen: '1e1' }, { absen: '100' }]) {
    assert.equal(store.save({ ...student, ...change }).success, false);
    assert.deepEqual(store.get(), student);
  }
});
test('malformed or incomplete saved data becomes an anonymous session without throwing', () => {
  const disk = storage(), store = createStudentSessionStore(() => disk);
  for (const raw of ['{', 'null', '[]', '"name"', '{"nama":"Siswa Contoh"}']) {
    disk.setItem(STUDENT_SESSION_KEY, raw);
    assert.equal(store.get(), null);
  }
});
test('storage write denial uses a temporary session and logout never revives the old saved identity', () => {
  const disk = storage(); disk.setItem(STUDENT_SESSION_KEY, JSON.stringify(student));
  const blocked = { getItem: disk.getItem, setItem() { throw new Error('quota'); }, removeItem() { throw new Error('denied'); } };
  const store = createStudentSessionStore(() => blocked);
  const next = { ...student, nama: 'Siswa Kedua' };
  assert.equal(store.save(next).persisted, false);
  assert.deepEqual(store.get(), next);
  assert.equal(store.clear(), false);
  assert.equal(store.get(), null);
  assert.deepEqual(JSON.parse(disk.getItem(STUDENT_SESSION_KEY)), student);
});
test('fully blocked storage still supports login and logout for this visit', () => {
  const store = createStudentSessionStore(() => { throw new Error('unavailable'); });
  assert.equal(store.get(), null);
  assert.equal(store.save(student).success, true);
  assert.deepEqual(store.get(), student);
  store.clear(); assert.equal(store.get(), null);
});
test('different students use different drafts, returning students recover the same draft key', () => {
  const base = 'draftlab_lkpd_job1_data';
  const first = studentDraftKey(base, student);
  assert.notEqual(first, studentDraftKey(base, { ...student, nama: 'Siswa Kedua' }));
  assert.notEqual(first, studentDraftKey(base, { ...student, kelas: 'X TP 2' }));
  assert.notEqual(first, studentDraftKey(base, { ...student, absen: '8' }));
  assert.equal(first, studentDraftKey(base, { ...student, nama: ' SISWA   CONTOH ', absen: '07' }));
  assert.equal(studentDraftKey(base, null), base);
});
