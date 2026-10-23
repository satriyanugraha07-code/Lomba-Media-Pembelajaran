import { AUTH_SESSION_KEY, getSession, setSession, validateStudentLogin } from './auth-session.js';
import { cloudRequest, connectCloud, deriveTeacherProof, getCloudEndpoint, loadCloudConfig, SPREADSHEET_ID } from './cloud-client.js';
import { flushAssessments, getSyncState } from './assessment-sync.js';

export async function initAuthentication() {
  const base = import.meta.env?.BASE_URL || '/';
  const gate = document.createElement('section'); gate.id = 'identity-gate'; gate.className = 'identity-gate'; gate.setAttribute('aria-label', 'Masuk ARCUS');
  gate.innerHTML = `<div class="login-layout"><div class="login-card"><header class="login-brand"><img src="${base}brand/arcus-logo.png" alt="ARCUS"><h1 class="login-sr-only">Masuk ke ARCUS</h1></header><div class="login-role-tabs" role="group" aria-label="Pilih peran"><button type="button" data-login-role="student" aria-pressed="true">Siswa</button><button type="button" data-login-role="teacher" aria-pressed="false">Guru</button></div>
    <form data-student-login><label>Nama lengkap<input name="name" autocomplete="name" maxlength="100" required placeholder="Nama siswa"></label><div class="login-input-row"><label>Kelas<input name="className" maxlength="60" placeholder="Contoh: X TP 1" required></label><label>No. absen<input name="absen" inputmode="numeric" maxlength="2" placeholder="01" required></label></div><button class="login-primary" type="submit">Masuk sebagai siswa <span aria-hidden="true">↗</span></button></form>
    <form data-teacher-login hidden><label>Nama guru<input name="name" autocomplete="username" maxlength="100" required placeholder="Nama akun guru"></label><label>Password<div class="login-password"><input name="password" type="password" autocomplete="current-password" required><button type="button" data-show-password aria-label="Tampilkan password">Lihat</button></div></label><button class="login-primary" type="submit">Masuk sebagai guru <span aria-hidden="true">↗</span></button></form>
    <p class="login-error" role="alert" data-login-error></p><p class="login-connection" role="status" data-login-connection>Memeriksa koneksi Google Sheets…</p>
    <details class="login-setup"><summary>Pengaturan koneksi untuk guru</summary><p>Pasang penghubung sekali pada spreadsheet tujuan, lalu masukkan URL web app.</p><ol><li>Gunakan berkas <b>Code.gs</b> dan <b>TeacherSetup.html</b> pada folder backend yang disediakan.</li><li>Buka <a href="https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit" target="_blank" rel="noopener">spreadsheet rekap</a> → Ekstensi → Apps Script. Pasang kedua berkas.</li><li>Jalankan <b>setupArcus</b>, lalu buat akun guru dari menu ARCUS pada spreadsheet.</li><li>Deploy sebagai web app, jalankan sebagai pemilik, akses <b>Anyone</b>. Data tetap memerlukan sesi siswa/guru pada API.</li></ol><label>URL Google Apps Script<input data-cloud-url type="url" placeholder="https://script.google.com/macros/s/…/exec" autocomplete="off"></label><button type="button" class="login-secondary" data-connect-cloud>Hubungkan Google Sheets</button><p>Akses spreadsheet sebaiknya dibatasi ke pemilik/guru. URL deployment dapat dipasang pada arcus-config.json untuk seluruh perangkat.</p></details></div></div>`;
  document.body.append(gate);
  const app = document.querySelector('.app-container'); app.inert = true;
  let resolveInitial, initialized = false, busy = false;
  const ready = new Promise(resolve => { resolveInitial = resolve; });
  const error = gate.querySelector('[data-login-error]'), connection = gate.querySelector('[data-login-connection]');
  const buttons = () => gate.querySelectorAll('button[type="submit"]');
  const updateConnection = () => {
    const configured = Boolean(getCloudEndpoint());
    connection.textContent = configured ? '' : 'Google Sheets belum dihubungkan. Guru perlu memasang penghubung terlebih dahulu.';
    connection.hidden = configured;
    gate.querySelector('.login-setup').hidden = configured;
    buttons().forEach(button => { button.disabled = !configured || busy; });
  };
  gate.querySelectorAll('[data-login-role]').forEach(button => button.addEventListener('click', () => {
    gate.querySelectorAll('[data-login-role]').forEach(node => node.setAttribute('aria-pressed', String(node === button)));
    gate.querySelector('[data-student-login]').hidden = button.dataset.loginRole !== 'student';
    gate.querySelector('[data-teacher-login]').hidden = button.dataset.loginRole !== 'teacher'; error.textContent = '';
  }));
  gate.querySelector('[data-show-password]').addEventListener('click', event => {
    const input = gate.querySelector('[name="password"]'), showing = input.type === 'password';
    input.type = showing ? 'text' : 'password'; event.currentTarget.textContent = showing ? 'Sembunyikan' : 'Lihat';
    event.currentTarget.setAttribute('aria-label', showing ? 'Sembunyikan password' : 'Tampilkan password');
  });
  const accept = session => {
    const previous = getSession();
    if (document.body.classList.contains('semester-exam-active') && previous?.profile.id !== session.profile.id) throw new Error('Selesaikan ujian sebelum berganti peserta.');
    sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ ...session, endpoint: getCloudEndpoint() }));
    setSession(session); gate.hidden = true; app.inert = !initialized; document.documentElement.dataset.auth = initialized ? 'ready' : 'loading';
    document.querySelectorAll('[data-exam-running] > .semester-shell').forEach(shell => { shell.inert = false; });
    gate.querySelector('[name="password"]').value = '';
    renderIdentity(session);
    if (!initialized) { initialized = true; resolveInitial(session); }
    else if (previous?.profile.id !== session.profile.id) location.reload();
    else flushAssessments();
    document.dispatchEvent(new CustomEvent('arcus:authenticated', { detail: { role: session.role, profile: session.profile } }));
  };
  const login = async (form, role) => {
    if (busy) return; busy = true; updateConnection(); error.textContent = '';
    try {
      let session;
      if (role === 'student') {
        const participant = validateStudentLogin(Object.fromEntries(new FormData(form)));
        session = await cloudRequest('studentLogin', participant);
      } else {
        const name = form.elements.name.value.trim(), password = form.elements.password.value;
        if (!name || !password) throw new Error('Isi nama dan password guru.');
        const challenge = await cloudRequest('teacherChallenge', { name });
        const proof = await deriveTeacherProof(password, challenge.salt, challenge.iterations);
        session = await cloudRequest('teacherLogin', { name, proof });
      }
      accept(session);
    } catch (failure) { error.textContent = failure.message; }
    finally { busy = false; updateConnection(); }
  };
  gate.querySelector('[data-student-login]').addEventListener('submit', event => { event.preventDefault(); login(event.currentTarget, 'student'); });
  gate.querySelector('[data-teacher-login]').addEventListener('submit', event => { event.preventDefault(); login(event.currentTarget, 'teacher'); });
  gate.querySelector('[data-connect-cloud]').addEventListener('click', async event => {
    event.currentTarget.disabled = true; error.textContent = '';
    try { await connectCloud(gate.querySelector('[data-cloud-url]').value); updateConnection(); }
    catch (failure) { error.textContent = failure.message; }
    finally { event.currentTarget.disabled = false; }
  });
  try { await loadCloudConfig(); }
  catch (failure) { error.textContent = failure.message; }
  gate.querySelector('[data-cloud-url]').value = getCloudEndpoint();
  updateConnection();
  try {
    const saved = JSON.parse(sessionStorage.getItem(AUTH_SESSION_KEY) || 'null');
    if (saved?.token && saved.endpoint === getCloudEndpoint() && saved.expiresAt > Date.now()) {
      const session = await cloudRequest('session', {}, saved.token); accept(session);
    }
  } catch { error.textContent = 'Sesi belum dapat dipulihkan. Masuk kembali; draf jawaban tetap tersimpan.'; }
  document.addEventListener('arcus:sync', event => {
    updateSyncStatus(event.detail);
    if (event.detail.state === 'auth') {
      const running = document.querySelector('[data-exam-running]');
      if (running) {
        running.append(gate); running.querySelectorAll(':scope > .semester-shell').forEach(shell => { shell.inert = true; });
        app.inert = false;
      } else { document.body.append(gate); app.inert = true; }
      gate.hidden = false; document.documentElement.dataset.auth = 'pending';
      error.textContent = 'Sesi berakhir. Masuk kembali dengan identitas yang sama untuk melanjutkan sinkronisasi.';
    }
  });
  return ready;
}

function renderIdentity(session) {
  let bar = document.getElementById('session-bar');
  if (!bar) { bar = document.createElement('div'); bar.id = 'session-bar'; bar.className = 'session-bar'; document.querySelector('.top-header').append(bar); }
  bar.replaceChildren();
  bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', 'Akun aktif');
  const avatar = document.createElement('span'); avatar.className = 'session-avatar'; avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = session.profile.name.trim().split(/\s+/).slice(0, 2).map(part => Array.from(part)[0] || '').join('').toLocaleUpperCase('id-ID');
  const identity = document.createElement('div'), name = document.createElement('strong'), meta = document.createElement('span');
  identity.className = 'session-identity'; meta.className = 'session-meta';
  name.textContent = session.profile.name; meta.textContent = session.role === 'teacher' ? 'Guru' : `${session.profile.className} · No. ${session.profile.absen}`;
  name.title = name.textContent; meta.title = meta.textContent;
  const sync = document.createElement('span'); sync.id = 'cloud-sync-status'; sync.setAttribute('role', 'status');
  identity.append(name, meta, sync);
  const logout = document.createElement('button'); logout.className = 'session-logout'; logout.type = 'button'; logout.textContent = 'Keluar';
  logout.addEventListener('click', async () => {
    if (document.body.classList.contains('semester-exam-active')) { alert('Kumpulkan jawaban ujian sebelum keluar.'); return; }
    logout.disabled = true;
    await Promise.race([flushAssessments(), new Promise(resolve => setTimeout(resolve, 2500))]);
    cloudRequest('logout', {}, session.token).catch(() => {});
    sessionStorage.removeItem(AUTH_SESSION_KEY); location.reload();
  });
  bar.append(avatar, identity, logout); updateSyncStatus(getSyncState());
  document.body.dataset.accountRole = session.role;
}

function updateSyncStatus(state) {
  const node = document.getElementById('cloud-sync-status'); if (!node) return;
  const labels = { idle: 'Google Sheets', pending: `Menunggu sinkronisasi (${state.count})`, synced: 'Tersimpan di Google Sheets', error: 'Belum terkirim · mencoba kembali', storage: 'Gagal menyimpan draf', auth: 'Masuk kembali untuk sinkronisasi' };
  node.textContent = labels[state.state] || 'Google Sheets'; node.dataset.state = state.state; node.title = state.error || '';
}
