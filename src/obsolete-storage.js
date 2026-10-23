// Remove retired account data without touching lessons, worksheet drafts, or results.
const obsoleteKeys = [
  'draftlab_student_session',
  'draftlab_students_history',
  'draftlab_sheets_url',
  'draftlab_student_name'
];

export function cleanupObsoleteStorage(browser = window) {
  for (const name of ['localStorage', 'sessionStorage']) {
    for (const key of obsoleteKeys) {
      try { browser[name].removeItem(key); } catch { /* Restricted storage must not block the app. */ }
    }
  }
}
