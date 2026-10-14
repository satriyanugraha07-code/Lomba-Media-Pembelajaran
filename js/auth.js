/**
 * DRAFT-LAB — Student Authentication, History Log & Google Spreadsheet Integration
 * Handles:
 * - Student Login (Nama Lengkap, No. Absen, Kelas)
 * - Persistent browser session (localStorage)
 * - Automatic Google Spreadsheet sync via Google Apps Script (Web App)
 * - Built-in Student History Log & 1-Click Excel (.CSV) Export
 * - Dynamic Topbar Profile updates & Account Switch
 */

const AUTH_STORAGE_KEY = 'draftlab_student_session';
const HISTORY_STORAGE_KEY = 'draftlab_students_history';
const SCRIPT_URL_STORAGE_KEY = 'draftlab_sheets_url';
import { studentSessions, validateStudentIdentity } from '../src/student-session.js';

import { renderDiagnostikRekapTable, exportDiagnostikToCsv } from './diagnostik.js';
import { renderPostTestRekapTable, exportPostTestToCsv } from './post-test.js';

// Default SheetDB / Google Apps Script URL
export const DEFAULT_SCRIPT_URL = 'https://sheetdb.io/api/v1/dsn6t93x0uhsr';

function isSupportedSheetUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (
      (url.hostname === 'sheetdb.io' && url.pathname.startsWith('/api/v1/')) ||
      (url.hostname === 'script.google.com' && url.pathname.startsWith('/macros/s/'))
    );
  } catch {
    return false;
  }
}

export function getScriptUrl() {
  let saved;
  try { saved = localStorage.getItem(SCRIPT_URL_STORAGE_KEY); } catch {}
  if (saved && isSupportedSheetUrl(saved)) return saved;
  return DEFAULT_SCRIPT_URL;
}

export function setScriptUrl(url) {
  if (typeof url !== 'string' || !isSupportedSheetUrl(url.trim())) return false;
  try { localStorage.setItem(SCRIPT_URL_STORAGE_KEY, url.trim()); return true; } catch { return false; }
}

export function getStudentSession() {
  return studentSessions.get();
}

export function saveStudentSession(studentData) {
  return studentSessions.save(studentData);
}

export function clearStudentSession() {
  return studentSessions.clear();
}

/**
 * Get all students who have logged in on this browser
 */
export function getAllStudentsHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    const history = raw ? JSON.parse(raw) : [];
    return Array.isArray(history) ? history.filter(item => item && typeof item.nama === 'string') : [];
  } catch (e) {
    return [];
  }
}

/**
 * Record a login entry into history
 */
export function recordStudentLogin(student) {
  try {
    const history = getAllStudentsHistory();
    const entry = {
      id: Date.now(),
      nama: student.nama,
      absen: student.absen,
      kelas: student.kelas,
      waktu: new Date().toLocaleString('id-ID', { 
        dateStyle: 'medium', 
        timeStyle: 'short',
        timeZone: 'Asia/Jakarta' 
      }),
      timestamp: new Date().toISOString()
    };
    
    // Taruh data terbaru di paling atas
    history.unshift(entry);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving student history log:', e);
  }
}

/**
 * Export student history to CSV (Directly opens in Microsoft Excel or Google Sheets)
 */
export function exportStudentsToCsv() {
  const history = getAllStudentsHistory();
  if (history.length === 0) {
    alert('Belum ada data siswa yang login untuk diunduh.');
    return;
  }

  // BOM untuk UTF-8 agar nama dengan simbol/karakter khusus terbaca rapi di Excel
  let csvContent = '\uFEFF';
  csvContent += 'No,Tanggal & Waktu,Nama Lengkap,No. Absen,Kelas\r\n';

  history.forEach((row, index) => {
    const no = index + 1;
    const waktu = `"${(row.waktu || row.timestamp || '').replace(/"/g, '""')}"`;
    const nama = `"${(row.nama || '').replace(/"/g, '""')}"`;
    const absen = `"${String(row.absen ?? '').replace(/"/g, '""')}"`;
    const kelas = `"${String(row.kelas ?? '').replace(/"/g, '""')}"`;
    csvContent += `${no},${waktu},${nama},${absen},${kelas}\r\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const now = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `Rekap_Siswa_SDRAFT_${now}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Send student login record to Google Sheets via Apps Script Web App
 */
export async function sendLoginToSpreadsheet(data) {
  // Local previews must not create test attendance records in the live sheet.
  if (import.meta.env?.DEV) return { success: true, localOnly: true };
  const scriptUrl = getScriptUrl();
  
  // Jika URL masih placeholder bawaan, cukup log info
  if (!scriptUrl || scriptUrl.includes('GANTI_DENGAN_URL')) {
    console.info('[Google Sheets] URL Apps Script belum dikonfigurasi. Data tersimpan aman di Rekap Browser.');
    return { success: true, localOnly: true };
  }

  if (scriptUrl.includes('sheetdb.io')) {
    try {
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: [{
            'No': 'INCREMENT',
            'Waktu_Login': new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
            'Nama_Lengkap': data.nama,
            'No_Absen': data.absen,
            'Kelas': data.kelas,
            'Perangkat': navigator.userAgent
          }]
        })
      });
      if (!response.ok) throw new Error(`Presensi belum tersinkron (HTTP ${response.status}).`);
      return { success: true };
    } catch (e) {
      console.warn('[SheetDB Login Sync] Gagal mengirim:', e);
      return { success: false, error: e };
    }
  }

  const payload = {
    action: 'login',
    nama: data.nama,
    absen: data.absen,
    kelas: data.kelas,
    timestamp: new Date().toISOString(),
    waktuLokal: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
    userAgent: navigator.userAgent
  };

  try {
    // An opaque no-cors response cannot confirm that the server saved attendance.
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    return { success: false, unconfirmed: true };
  } catch (error) {
    console.warn('[Google Sheets Sync] Gagal mengirim ke Spreadsheet, data tersimpan di browser:', error);
    return { success: false, error };
  }
}

/**
 * Update the top header profile widget with student info
 */
export function updateHeaderProfile(student) {
  const badgeLevel = document.getElementById('badge-level');
  const userSubLabel = document.querySelector('.header-user-badge .user-sub-label');
  const popoverName = document.getElementById('popover-student-name');
  const popoverMeta = document.getElementById('popover-student-meta');

  if (student && student.nama) {
    if (badgeLevel) {
      badgeLevel.textContent = student.nama;
      badgeLevel.title = student.nama;
    }
    if (userSubLabel) {
      userSubLabel.textContent = `Kelas: ${student.kelas} • No. ${student.absen}`;
      userSubLabel.title = `Kelas: ${student.kelas} | No. Absen: ${student.absen}`;
    }
    if (popoverName) popoverName.textContent = student.nama;
    if (popoverMeta) popoverMeta.textContent = `Kelas: ${student.kelas} • No. Absen: ${student.absen}`;
  } else {
    if (badgeLevel) { badgeLevel.textContent = 'Masuk'; badgeLevel.removeAttribute('title'); }
    if (userSubLabel) { userSubLabel.textContent = 'Isi identitas siswa'; userSubLabel.removeAttribute('title'); }
    if (popoverName) popoverName.textContent = 'Belum Login';
    if (popoverMeta) popoverMeta.textContent = 'Klik untuk masuk';
  }
  const badge = document.getElementById('header-user-badge');
  badge?.setAttribute('aria-label', student ? `Akun siswa: ${student.nama}` : 'Masuk sebagai siswa');
  badge?.setAttribute('aria-haspopup', student ? 'true' : 'dialog');
  const changeLabel = document.querySelector('#btn-change-account span');
  if (changeLabel) changeLabel.textContent = student ? 'Ganti identitas' : 'Masuk';
  const exitButton = document.getElementById('btn-logout-account');
  if (exitButton) exitButton.hidden = !student;
}

/**
 * Show / Hide Login Modal
 */
let authReturnFocus;
let authAppWasInert = false;
export function showAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  const student = getStudentSession();
  const fields = { nama: 'auth-name', absen: 'auth-absen', kelas: 'auth-kelas' };
  for (const [key, id] of Object.entries(fields)) {
    const input = document.getElementById(id);
    if (input) { input.value = student?.[key] || ''; input.removeAttribute('aria-invalid'); }
  }
  const alertBox = document.getElementById('auth-alert');
  if (alertBox) alertBox.style.display = 'none';
  document.getElementById('auth-modal-title').textContent = student ? 'Ganti identitas siswa' : 'Masuk Ruang Belajar';
  document.querySelector('#auth-submit-btn .btn-text').textContent = student ? 'Simpan identitas' : 'Masuk & mulai belajar';
  authReturnFocus = document.activeElement;
  const app = document.querySelector('.app-container');
  authAppWasInert = app?.inert || false;
  if (app) app.inert = true;
  modal.style.display = 'flex';
  document.body.classList.add('auth-modal-open');
  
  setTimeout(() => {
    if (modal.style.display === 'flex') document.getElementById('auth-name')?.focus();
  }, 120);
}

export function hideAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.classList.remove('auth-modal-open');
  const app = document.querySelector('.app-container');
  if (app) app.inert = authAppWasInert;
  const target = authReturnFocus?.isConnected && authReturnFocus.getClientRects().length ? authReturnFocus : document.getElementById('header-user-badge');
  if (!app?.inert) target?.focus({ preventScroll: true });
}

/**
 * Render Student History Table inside the Admin Modal
 */
export function renderRekapTable() {
  const tbody = document.getElementById('rekap-table-body');
  const countBadge = document.getElementById('rekap-total-count');
  if (!tbody) return;

  const history = getAllStudentsHistory();
  if (countBadge) countBadge.textContent = `${history.length} Siswa Tercatat`;

  if (history.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2rem; color: #94a3b8;">
          Belum ada data siswa yang login.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = history.map((item, idx) => `
    <tr>
      <td><span class="rekap-num-badge">${idx + 1}</span></td>
      <td><strong>${escapeHtml(item.nama)}</strong></td>
      <td>${escapeHtml(item.absen)}</td>
      <td><span class="rekap-class-pill">${escapeHtml(item.kelas)}</span></td>
      <td style="color: #64748b; font-size: 0.78rem;">${escapeHtml(item.waktu || '-')}</td>
    </tr>
  `).join('');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Open locally stored learning results. */
export function showRekapModal() {
  const modal = document.getElementById('rekap-modal');
  if (!modal) return;
  renderRekapTable();
  renderDiagnostikRekapTable();

  // Isi input URL Apps Script yang tersimpan
  const urlInput = document.getElementById('sheet-url-input');
  if (urlInput) {
    let currentUrl = '';
    try { currentUrl = localStorage.getItem(SCRIPT_URL_STORAGE_KEY) || ''; } catch {}
    urlInput.value = currentUrl;
  }

  modal.style.display = 'flex';
  document.body.classList.add('modal-open');
}

export function hideRekapModal() {
  const modal = document.getElementById('rekap-modal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.classList.remove('modal-open');
}

/**
 * Initialize Authentication & Rekap System
 */
export function initAuth() {
  const authForm = document.getElementById('auth-form');
  if (!authForm || authForm.dataset.ready === 'true') return;
  authForm.dataset.ready = 'true';
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  const userBadge = document.getElementById('header-user-badge');
  const userPopover = document.getElementById('user-popover');
  const btnLogout = document.getElementById('btn-change-account');
  const btnExit = document.getElementById('btn-logout-account');
  let submitting = false;
  const btnOpenRekap = document.getElementById('btn-open-rekap');
  const btnCloseRekap = document.getElementById('btn-close-rekap');
  const btnExportCsv = document.getElementById('btn-export-csv');
  const btnClearHistory = document.getElementById('btn-clear-history');
  const btnSaveSheetUrl = document.getElementById('btn-save-sheet-url');
  document.getElementById('auth-close-btn')?.addEventListener('click', hideAuthModal);

  // 1. Cek sesi yang sudah ada di localStorage
  const currentSession = getStudentSession();

  updateHeaderProfile(currentSession);

  authForm.noValidate = true;
  authForm.querySelectorAll('input').forEach(input => input.addEventListener('input', () => {
    input.removeAttribute('aria-invalid');
    document.getElementById('auth-alert').style.display = 'none';
  }));
  authForm.addEventListener('submit', event => {
    event.preventDefault();
    if (submitting || document.getElementById('auth-modal').style.display !== 'flex') return;
    const checked = validateStudentIdentity({
      nama: document.getElementById('auth-name').value,
      absen: document.getElementById('auth-absen').value,
      kelas: document.getElementById('auth-kelas').value
    });
    if (!checked.valid) {
      showAuthAlert(checked.message);
      const input = document.getElementById({ nama: 'auth-name', absen: 'auth-absen', kelas: 'auth-kelas' }[checked.field]);
      input?.setAttribute('aria-invalid', 'true');
      input?.focus();
      return;
    }
    submitting = true;
    authSubmitBtn.disabled = true;
    const studentData = { ...checked.student, loginAt: new Date().toISOString() };
    try {
      const saved = saveStudentSession(studentData);
      if (!saved.success) { showAuthAlert(saved.message); return; }
      updateHeaderProfile(studentData);
      window.dispatchEvent(new CustomEvent('draftlab:student-login', { detail: studentData }));
      recordStudentLogin(studentData);
      sendLoginToSpreadsheet(studentData).catch(error => console.warn('Presensi belum tersinkron:', error));
      hideAuthModal();
      showLoginToast(saved.persisted ? `Selamat belajar, ${studentData.nama}!` : 'Berhasil masuk untuk kunjungan ini. Browser belum bisa menyimpan sesi setelah refresh.');
    } finally {
      submitting = false;
      authSubmitBtn.disabled = false;
      authSubmitBtn.classList.remove('is-loading');
    }
  });

  const closePopover = () => {
    if (userPopover) userPopover.style.display = 'none';
    userBadge?.setAttribute('aria-expanded', 'false');
  };
  if (userBadge && userPopover) {
    userBadge.setAttribute('aria-controls', 'user-popover');
    userBadge.setAttribute('aria-expanded', 'false');
    userBadge.addEventListener('click', event => {
      if (userPopover.contains(event.target)) return;
      event.stopPropagation();
      if (!getStudentSession()) { closePopover(); showAuthModal(); return; }
      const open = userPopover.style.display !== 'block';
      userPopover.style.display = open ? 'block' : 'none';
      userBadge.setAttribute('aria-expanded', String(open));
    });
    userBadge.addEventListener('keydown', event => {
      if (event.target !== userBadge) return;
      if (['Enter', ' '].includes(event.key)) { event.preventDefault(); userBadge.click(); }
    });
    document.addEventListener('click', event => {
      if (!userPopover.contains(event.target) && !userBadge.contains(event.target)) closePopover();
    });
  }
  btnLogout?.addEventListener('click', event => { event.stopPropagation(); closePopover(); showAuthModal(); });
  btnExit?.addEventListener('click', event => {
    event.stopPropagation();
    clearStudentSession();
    closePopover();
    updateHeaderProfile(null);
    window.dispatchEvent(new CustomEvent('draftlab:student-logout'));
    showLoginToast('Sudah keluar dari identitas siswa. Kamu tetap bisa menjelajah.');
    userBadge?.focus();
  });
  const modal = document.getElementById('auth-modal');
  modal?.addEventListener('click', event => { if (event.target === modal && !submitting) hideAuthModal(); });
  document.addEventListener('keydown', event => {
    if (modal?.style.display === 'flex') {
      if (event.key === 'Escape' && !submitting) { event.preventDefault(); hideAuthModal(); }
      if (event.key === 'Tab') {
        const targets = [...modal.querySelectorAll('button:not(:disabled), input:not(:disabled)')].filter(el => el.getClientRects().length);
        const first = targets[0], last = targets.at(-1);
        if (event.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    } else if (event.key === 'Escape') closePopover();
  });
  window.addEventListener('storage', event => {
    if (event.key !== AUTH_STORAGE_KEY && event.key !== null) return;
    const student = getStudentSession();
    updateHeaderProfile(student);
    window.dispatchEvent(new CustomEvent(student ? 'draftlab:student-login' : 'draftlab:student-logout', { detail: student }));
  });

  // 5. Tombol Buka Modal Rekap Data Siswa
  if (btnOpenRekap) {
    btnOpenRekap.addEventListener('click', () => {
      if (userPopover) userPopover.style.display = 'none';
      showRekapModal();
    });
  }

  if (btnCloseRekap) {
    btnCloseRekap.addEventListener('click', hideRekapModal);
  }

  // 6. Tombol Download CSV
  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', exportStudentsToCsv);
  }

  // 6b. Tab Switcher Rekap (Login vs Diagnostik vs Post-Test)
  const tabLogin = document.getElementById('tab-btn-rekap-login');
  const tabDiag = document.getElementById('tab-btn-rekap-diag');
  const tabPostTest = document.getElementById('tab-btn-rekap-posttest');
  const loginView = document.getElementById('rekap-login-view');
  const diagView = document.getElementById('rekap-diag-view');
  const postTestView = document.getElementById('rekap-posttest-view');
  const btnExportDiag = document.getElementById('btn-export-diag-csv');
  const btnExportPostTest = document.getElementById('btn-export-posttest-csv');

  const activateTab = (activeTabBtn, activeView, renderFn) => {
    [tabLogin, tabDiag, tabPostTest].forEach(tab => {
      if (tab) {
        tab.classList.remove('active');
        tab.style.borderBottomColor = 'transparent';
        tab.style.color = '#64748b';
      }
    });
    [loginView, diagView, postTestView].forEach(view => {
      if (view) view.style.display = 'none';
    });

    if (activeTabBtn) {
      activeTabBtn.classList.add('active');
      activeTabBtn.style.borderBottomColor = '#2567b9';
      activeTabBtn.style.color = '#2567b9';
    }
    if (activeView) activeView.style.display = 'block';
    if (typeof renderFn === 'function') renderFn();
  };

  tabLogin?.addEventListener('click', () => activateTab(tabLogin, loginView, renderRekapTable));
  tabDiag?.addEventListener('click', () => activateTab(tabDiag, diagView, renderDiagnostikRekapTable));
  tabPostTest?.addEventListener('click', () => activateTab(tabPostTest, postTestView, renderPostTestRekapTable));

  if (btnExportDiag) {
    btnExportDiag.addEventListener('click', exportDiagnostikToCsv);
  }

  if (btnExportPostTest) {
    btnExportPostTest.addEventListener('click', exportPostTestToCsv);
  }

  // 7. Tombol Reset / Bersihkan Riwayat
  if (btnClearHistory) {
    btnClearHistory.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin menghapus riwayat rekap siswa di browser ini?')) {
        localStorage.removeItem(HISTORY_STORAGE_KEY);
        renderRekapTable();
      }
    });
  }

  // 8. Tombol Simpan URL Spreadsheet
  if (btnSaveSheetUrl) {
    btnSaveSheetUrl.addEventListener('click', () => {
      const urlInput = document.getElementById('sheet-url-input');
      const val = urlInput?.value.trim() || '';
      if (val) {
        if (setScriptUrl(val)) {
          alert('URL sinkronisasi berhasil disimpan. Data berikutnya akan dikirim ke alamat tersebut.');
        } else {
          alert('Gunakan URL HTTPS dari SheetDB atau Google Apps Script.');
        }
      } else {
        localStorage.removeItem(SCRIPT_URL_STORAGE_KEY);
        alert('URL Google Spreadsheet direset ke default.');
      }
    });
  }

}

function showAuthAlert(message, type = 'error') {
  const alertBox = document.getElementById('auth-alert');
  if (!alertBox) return;
  alertBox.textContent = message;
  alertBox.className = `auth-alert auth-alert-${type}`;
  alertBox.style.display = 'block';

}

function showLoginToast(message) {
  let toast = document.getElementById('auth-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'auth-toast';
    toast.className = 'auth-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
