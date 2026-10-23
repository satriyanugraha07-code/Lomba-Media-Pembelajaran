import { renderDiagnostikRekapTable, exportDiagnostikToCsv } from './diagnostik.js';
import { renderPostTestRekapTable, exportPostTestToCsv } from './post-test.js';
import { renderSemesterExamResults } from '../src/semester-exam-results.js';
import { isTeacher } from '../src/auth-session.js';

export function initLearningResults() {
  const dialog = document.getElementById('learning-results-dialog');
  if (!dialog || dialog.dataset.ready) return;
  dialog.dataset.ready = 'true';
  const tabs = [...dialog.querySelectorAll('[data-results-tab]')];
  const renderers = { diag: renderDiagnostikRekapTable, posttest: renderPostTestRekapTable, semester: renderSemesterExamResults };
  const select = name => {
    tabs.forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.resultsTab === name)));
    dialog.querySelectorAll('[data-results-panel]').forEach(panel => {
      panel.hidden = panel.dataset.resultsPanel !== name;
    });
    renderers[name]();
  };
  document.getElementById('btn-open-learning-results')?.addEventListener('click', () => {
    if (!isTeacher()) return;
    select('diag');
    dialog.showModal();
  });
  dialog.querySelector('[data-close-results]').addEventListener('click', () => dialog.close());
  tabs.forEach(tab => tab.addEventListener('click', () => select(tab.dataset.resultsTab)));
  dialog.querySelector('#btn-export-diag-csv').addEventListener('click', exportDiagnostikToCsv);
  dialog.querySelector('#btn-export-posttest-csv').addEventListener('click', exportPostTestToCsv);
}
