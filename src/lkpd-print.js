import { LKPD_JOB1 } from './lkpd-markup.js';

const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

const paperCss = `
  .lkpd-paper, .lkpd-paper * { box-sizing: border-box; }
  .lkpd-paper { width: 210mm; min-height: 297mm; padding: 12mm; background: #fff; color: #203b4d; font: 10pt/1.45 Arial, sans-serif; }
  .lkpd-paper p, .lkpd-paper h1, .lkpd-paper h2 { margin: 0; }
  .lkpd-paper-header { display: flex; justify-content: space-between; gap: 8mm; padding-bottom: 4mm; border-bottom: .4mm solid #254c63; }
  .lkpd-paper-kicker { color: #4e6f82; font-size: 8pt; letter-spacing: .07em; }
  .lkpd-paper h1 { margin: 1mm 0; font-size: 21pt; line-height: 1.1; }
  .lkpd-paper-subtitle { font-size: 8pt; color: #4e6f82; }
  .lkpd-paper-brand { align-self: center; text-align: right; font-size: 10pt; font-weight: bold; }
  .lkpd-paper-brand span { display: block; color: #4e6f82; font-size: 8pt; font-weight: normal; }
  .lkpd-paper-identity { display: grid; grid-template-columns: 1fr 1fr; gap: 2mm 7mm; padding: 4mm 0; }
  .lkpd-paper-identity p { overflow-wrap: anywhere; border-bottom: .2mm solid #c5d3db; padding-bottom: 1.5mm; }
  .lkpd-paper-identity b { font-size: 8pt; display: inline-block; min-width: 15mm; }
  .lkpd-paper-purpose { padding: 3mm; border: .2mm solid #c5d3db; border-radius: 2mm; font-size: 9pt; }
  .lkpd-paper-tools, .lkpd-paper-measurements { margin-top: 2mm !important; color: #4e6f82; font-size: 8pt; }
  .lkpd-paper-heading { margin: 5mm 0 2mm !important; font-size: 12pt; }
  .lkpd-paper-patterns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3mm 5mm; }
  .lkpd-paper-pattern { margin: 0; text-align: center; break-inside: avoid; }
  .lkpd-paper-pattern svg { display: block; width: 45mm; height: 45mm; margin: 0 auto 1mm; }
  .lkpd-paper-pattern figcaption { font-size: 8pt; font-weight: bold; }
  .lkpd-paper-bottom { display: grid; grid-template-columns: 1fr 1fr; gap: 7mm; }
  .lkpd-paper-bottom ol { padding-left: 5mm; margin: 0; font-size: 8pt; }
  .lkpd-paper-bottom li { margin-bottom: 1mm; }
  .lkpd-paper-checks { margin: 0; padding: 0; list-style: none; font-size: 8pt; }
  .lkpd-paper-checks li { display: flex; gap: 2mm; margin-bottom: 1.5mm; }
  .lkpd-paper-checkmark { display: inline-flex; flex: 0 0 3.5mm; width: 3.5mm; height: 3.5mm; border: .2mm solid #4e6f82; align-items: center; justify-content: center; font: bold 8pt Arial, sans-serif; }
  .lkpd-paper-assessment { margin-top: 4mm; padding: 3mm; border: .2mm solid #c5d3db; border-radius: 2mm; }
  .lkpd-paper-assessment-row { display: flex; justify-content: space-between; gap: 8mm; font-size: 9pt; }
  .lkpd-paper-assessment-row p { width: 50%; overflow-wrap: anywhere; }
  .lkpd-paper-notes { margin-top: 2mm !important; min-height: 12mm; white-space: pre-wrap; overflow-wrap: anywhere; font-size: 8pt; }
  .lkpd-paper-job2 .lkpd-paper-patterns { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2mm 7mm; }
  .lkpd-paper-job2 .lkpd-paper-pattern svg { width: 49mm; height: 49mm; }
  .lkpd-paper-job2 .lkpd-paper-heading { margin-top: 3mm !important; }
  .lkpd-paper-footer { margin-top: 4mm; padding-top: 2mm; border-top: .2mm solid #c5d3db; font-size: 7pt; color: #4e6f82; }
`;

export function createLkpdPrintSheet(payload = {}, job = LKPD_JOB1) {
  const value = key => escape(payload[key] || '................................');
  return `<article class="lkpd-paper${job.id === 2 ? ' lkpd-paper-job2' : ''}" aria-label="Lembar kerja ${job.label} untuk dicetak"><header class="lkpd-paper-header"><div><p class="lkpd-paper-kicker">LEMBAR KERJA PESERTA DIDIK · ${job.label.toUpperCase()}</p><h1>${job.title}</h1><p class="lkpd-paper-subtitle">SMK N 2 Depok Sleman · Gambar Teknik Manual · Kelas X</p></div><div class="lkpd-paper-brand">S-DRAFT<span>Latih tangan, rapikan garis.</span></div></header>
    <div class="lkpd-paper-identity"><p><b>Nama</b> ${value('name')}</p><p><b>Kelas</b> ${value('className')}</p><p><b>No. absen</b> ${value('absen')}</p><p><b>Tanggal</b> ${value('date')}</p></div>
    <div class="lkpd-paper-purpose"><b>Tujuan:</b> ${job.goal}<p class="lkpd-paper-tools"><b>Alat:</b> ${job.tools.join(', ')}.</p><p class="lkpd-paper-measurements">${job.measurementNote}</p></div>
    <h2 class="lkpd-paper-heading">Amati dan gambar ulang ${job.id === 2 ? 'empat konstruksi' : 'enam pola'} berikut.</h2><div class="lkpd-paper-patterns">${job.patterns.map(pattern => `<figure class="lkpd-paper-pattern">${job.renderPattern(pattern.id)}<figcaption>${pattern.id}. ${pattern.title}</figcaption></figure>`).join('')}</div>
    <div class="lkpd-paper-bottom"><section><h2 class="lkpd-paper-heading">Tugas singkat</h2><ol>${job.tasks.map(task => `<li>${task}</li>`).join('')}</ol></section><section><h2 class="lkpd-paper-heading">Cek sebelum dikumpulkan</h2><ul class="lkpd-paper-checks">${job.checks.map((label, index) => `<li><span class="lkpd-paper-checkmark">${payload.checks?.[index] ? '✓' : ''}</span>${label}</li>`).join('')}</ul></section></div>
    <section class="lkpd-paper-assessment"><div class="lkpd-paper-assessment-row"><p><b>Nilai:</b> ${value('score')} / 100</p><p><b>Paraf guru:</b> ${value('paraf')}</p></div><p class="lkpd-paper-notes"><b>Catatan:</b> ${escape(payload.note || '........................................................................................................................................')}</p></section><footer class="lkpd-paper-footer">LKPD ${job.label} · ${job.scaleNote}</footer></article>`;
}

export function createLkpdPrintDocument(payload = {}, job = LKPD_JOB1) {
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>LKPD ${job.label} — ${escape(payload.name || job.title)}</title><style>@page { size: A4 portrait; margin: 0; } html, body { margin: 0; padding: 0; background: #fff; } ${paperCss} @media print { .lkpd-paper { min-height: 0; } }</style></head><body>${createLkpdPrintSheet(payload, job)}</body></html>`;
}

export function openLkpdPrintPreview(section, payload = {}, job = LKPD_JOB1) {
  let dialog = section.querySelector('#lkpd-print-preview');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'lkpd-print-preview';
    dialog.className = 'lkpd-print-dialog';
    dialog.setAttribute('aria-labelledby', 'lkpd-print-title');
    dialog.setAttribute('aria-describedby', 'lkpd-print-description');
    section.append(dialog);
  }
  dialog.innerHTML = `<style>${paperCss}</style><div class="lkpd-dialog-heading"><div><p class="lkpd-kicker">A4 POTRET · 210 × 297 MM</p><h3 id="lkpd-print-title">Pratinjau lembar kerjamu.</h3></div><button type="button" class="lkpd-dialog-close" aria-label="Tutup pratinjau cetak">×</button></div><p class="lkpd-print-description" id="lkpd-print-description">Identitas dan isianmu ikut dicetak. Pilih A4 dan skala 100% untuk lembar kerja. ${job.measurementNote} ${job.scaleNote} Pratinjau dapat digeser pada layar kecil.</p><div class="lkpd-print-viewport">${createLkpdPrintSheet(payload, job)}</div><div class="lkpd-print-dialog-actions"><p role="status" aria-live="polite" class="lkpd-print-status">Menyiapkan lembar cetak.</p><button type="button" class="lkpd-primary lkpd-print-action" disabled>Cetak / Simpan PDF</button></div>`;
  const status = dialog.querySelector('.lkpd-print-status');
  const button = dialog.querySelector('.lkpd-print-action');
  const iframe = document.createElement('iframe');
  iframe.className = 'lkpd-print-frame-host';
  iframe.title = 'Dokumen LKPD untuk dicetak';
  iframe.tabIndex = -1;
  iframe.setAttribute('aria-hidden', 'true');
  iframe.addEventListener('load', () => {
    if (!iframe.isConnected) return;
    button.disabled = false;
    status.textContent = 'Lembar siap. Pilih Cetak / Simpan PDF untuk membuka pilihan printer.';
  });
  iframe.srcdoc = createLkpdPrintDocument(payload, job);
  dialog.append(iframe);
  dialog.querySelector('.lkpd-dialog-close').addEventListener('click', () => dialog.close());
  button.addEventListener('click', () => {
    if (button.disabled || !iframe.contentWindow) return;
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch {
      status.textContent = 'Pilihan cetak belum terbuka. Coba tombol Cetak / Simpan PDF sekali lagi.';
    }
  });
  if (!dialog.open) dialog.showModal();
  return true;
}
