export const SPREADSHEET_ID = '1lJRwjknEZcjQUThTr_muJxltySKCWVcqXO1olZ3leqo';
export const CONNECTION_KEY = 'arcus_cloud_endpoint_v1';
let endpoint = '';

export function validateEndpoint(value) {
  const url = new URL(String(value).trim());
  if (url.protocol !== 'https:' || url.hostname !== 'script.google.com' || !/^\/macros\/s\/[\w-]+\/exec$/.test(url.pathname) || url.search || url.hash || url.username || url.password) {
    throw new Error('Gunakan URL deployment Google Apps Script yang berakhiran /exec.');
  }
  return url.href;
}

export async function loadCloudConfig() {
  let configured = import.meta.env?.VITE_GOOGLE_SCRIPT_URL || '';
  try {
    const response = await fetch(`${import.meta.env?.BASE_URL || '/'}arcus-config.json`, { cache: 'no-store' });
    if (response.ok) {
      const config = await response.json();
      if (config.spreadsheetId !== SPREADSHEET_ID) throw new Error('Tujuan spreadsheet tidak cocok.');
      configured ||= config.webAppUrl || '';
    }
  } catch { /* A saved connection may still be available. */ }
  try { configured ||= localStorage.getItem(CONNECTION_KEY) || ''; } catch {}
  if (configured) endpoint = validateEndpoint(configured);
  return endpoint;
}

export function getCloudEndpoint() { return endpoint; }
export async function cloudRequest(action, payload = {}, token = '', { url = endpoint, timeout = 20000, keepalive = false } = {}) {
  if (!url) throw new Error('Google Sheets belum dihubungkan. Minta guru memasang Apps Script terlebih dahulu.');
  const controller = new AbortController(), timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(validateEndpoint(url), {
      method: 'POST', redirect: 'follow', credentials: 'omit', mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, token, payload }), signal: controller.signal, keepalive
    });
    if (!response.ok) throw new Error('Layanan Google Sheets belum dapat dihubungi.');
    let result;
    try { result = await response.json(); } catch { throw new Error('Respons Apps Script tidak sesuai. Periksa deployment web app dan izin aksesnya.'); }
    if (!result.ok) {
      const error = new Error(result.error || 'Permintaan ditolak.'); error.code = result.code; throw error;
    }
    if (result.spreadsheetId !== SPREADSHEET_ID) throw new Error('Apps Script terhubung ke spreadsheet yang berbeda.');
    return result.data;
  } catch (error) {
    if (error.name === 'AbortError' || error instanceof TypeError) throw new Error('Koneksi terputus atau deployment belum dapat diakses. Jawaban tetap disimpan di perangkat.');
    throw error;
  } finally { clearTimeout(timer); }
}

export async function connectCloud(value) {
  const candidate = validateEndpoint(value);
  const health = await cloudRequest('health', {}, '', { url: candidate });
  if (!health.ready) throw new Error('Jalankan setupArcus di Apps Script terlebih dahulu.');
  localStorage.setItem(CONNECTION_KEY, candidate); endpoint = candidate;
  return health;
}

// PBKDF2 runs in the browser; neither the site bundle nor Sheets contains a teacher password.
export async function deriveTeacherProof(password, salt, iterations) {
  if (!crypto?.subtle) throw new Error('Login guru memerlukan HTTPS atau localhost.');
  if (!Number.isInteger(iterations) || iterations < 100000 || iterations > 1000000 || !/^[\w-]{16,100}$/.test(salt)) throw new Error('Pengaturan keamanan akun guru tidak sesuai.');
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: encoder.encode(salt), iterations, hash: 'SHA-256' }, key, 256);
  return [...new Uint8Array(bits)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}
