import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanupObsoleteStorage } from '../src/obsolete-storage.js';

const retired = ['draftlab_student_session', 'draftlab_students_history', 'draftlab_sheets_url', 'draftlab_student_name'];
const preserved = ['draftlab_progress', 'sdraft_display_settings', 'sdraft_welcome_seen', 'draftlab_lkpd_job1_data', 'draftlab_lkpd_job1_data:student:archived', 'sdraft-etiket-v2', 'draftlab_diagnostik_submissions', 'draftlab_posttest_submissions', 'draftlab_certificate_name'];

test('retired identity data is removed from both storages while learning data is preserved', () => {
  const stores = [];
  const browser = Object.fromEntries(['localStorage', 'sessionStorage'].map(name => {
    const values = new Map([...retired, ...preserved].map(key => [key, `saved:${key}`]));
    stores.push(values);
    return [name, { removeItem: key => values.delete(key) }];
  }));
  cleanupObsoleteStorage(browser);
  cleanupObsoleteStorage(browser);
  for (const values of stores) {
    assert.deepEqual([...values.keys()], preserved);
    for (const key of preserved) assert.equal(values.get(key), `saved:${key}`);
  }
});

test('blocked storage does not prevent cleanup of the other storage or application startup', () => {
  const removed = [];
  const browser = {
    get localStorage() { throw new Error('blocked'); },
    sessionStorage: { removeItem: key => removed.push(key) }
  };
  assert.doesNotThrow(() => cleanupObsoleteStorage(browser));
  assert.deepEqual(removed, retired);
});

test('one failed removal does not skip the remaining obsolete keys', () => {
  const removed = [];
  const store = { removeItem(key) {
    if (key === retired[0]) throw new Error('denied');
    removed.push(key);
  } };
  assert.doesNotThrow(() => cleanupObsoleteStorage({ localStorage: store, sessionStorage: store }));
  assert.deepEqual(removed, [...retired.slice(1), ...retired.slice(1)]);
});
