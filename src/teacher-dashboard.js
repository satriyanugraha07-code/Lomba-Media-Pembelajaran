import { getSession, isTeacher } from './auth-session.js';
import { cloudRequest, SPREADSHEET_ID } from './cloud-client.js';
const labels = { diagnostik: 'Diagnostik', posttest: 'Pemahaman', uts: 'Tengah Semester', uas: 'Akhir Semester' };
const time = value => value ? new Date(value).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'short', timeStyle: 'short' }) : '—';
export function initTeacherDashboard() {
  if (!isTeacher()) return;
  const dashboard = document.getElementById('dashboard'), panel = document.createElement('section'); panel.className = 'teacher-panel';
  panel.innerHTML = `<header><div><p class="login-eyebrow">RUANG GURU</p><h2>Perkembangan pengerjaan siswa</h2><p>Draf masuk selama siswa mengerjakan. Submit menandai jawaban akhir.</p></div><a href="https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit" target="_blank" rel="noopener">Buka Google Sheets ↗</a></header><div class="teacher-controls"><label>Tes<select data-teacher-filter><option value="">Semua tes</option>${Object.entries(labels).map(([id,label]) => `<option value="${id}">${label}</option>`).join('')}</select></label><label>Cari siswa<input data-teacher-search placeholder="Nama atau kelas" type="search"></label><button type="button" data-teacher-refresh>Perbarui</button><button type="button" data-teacher-export>Unduh CSV</button></div><p data-teacher-status role="status"></p><div class="teacher-table-wrap"><table><thead><tr><th>Siswa</th><th>Tes</th><th>Status</th><th>Terjawab</th><th>PG</th><th>Pembaruan WIB</th><th>Jawaban</th></tr></thead><tbody data-teacher-rows></tbody></table></div><dialog class="teacher-detail" data-teacher-detail><header><h2>Jawaban siswa</h2><button type="button" data-close-teacher-detail>Tutup ×</button></header><p data-teacher-detail-meta></p><div data-teacher-answer-list></div></dialog>`;
  dashboard.prepend(panel);
  let records = [], busy = false;
  const status = panel.querySelector('[data-teacher-status]'), body = panel.querySelector('[data-teacher-rows]');
  const selected = () => records.filter(record => {
    const filter = panel.querySelector('[data-teacher-filter]').value, search = panel.querySelector('[data-teacher-search]').value.toLocaleLowerCase('id');
    return (!filter || record.examId === filter) && `${record.profile.name} ${record.profile.className}`.toLocaleLowerCase('id').includes(search);
  });
  const render = () => {
    body.replaceChildren();
    const rows = selected();
    if (!rows.length) { const cell = body.insertRow().insertCell(); cell.colSpan = 7; cell.textContent = 'Belum ada pengerjaan yang cocok.'; }
    for (const record of rows) {
      const row = body.insertRow();
      [`${record.profile.name}\n${record.profile.className} · No. ${record.profile.absen}`, labels[record.examId], record.status === 'submitted' ? 'Sudah disubmit' : 'Sedang dikerjakan', `${record.answered} / ${record.total}`, `${record.mcqScore} / ${record.mcqMax}`, time(record.updatedAt)]
        .forEach((value,index) => { const cell = row.insertCell(); cell.textContent = value; if (index === 2) cell.dataset.status = record.status; });
      const button = document.createElement('button'); button.type = 'button'; button.textContent = 'Lihat';
      button.addEventListener('click', async () => {
        button.disabled = true;
        try {
          const detail = await cloudRequest('attemptDetail', { id: record.id }, getSession().token), list = panel.querySelector('[data-teacher-answer-list]');
          list.replaceChildren(); panel.querySelector('[data-teacher-detail-meta]').textContent = `${record.profile.name} · ${record.profile.className} · ${labels[record.examId]} · ${record.status === 'submitted' ? 'Sudah disubmit' : 'Draf'}`;
          for (const answer of detail.questions) {
            const article = document.createElement('article'), heading = document.createElement('h3'), text = document.createElement('p');
            heading.textContent = `${answer.number}. ${answer.prompt.replace(/^\d+\.\s*/, '')}`; text.textContent = answer.answerText || 'Belum dijawab'; article.append(heading,text); list.append(article);
          }
          panel.querySelector('[data-teacher-detail]').showModal();
        } catch (error) { status.textContent = error.message; } finally { button.disabled = false; }
      }); row.insertCell().append(button);
    }
  };
  const refresh = async () => {
    if (busy) return; busy = true; status.textContent = 'Memuat rekap dari Google Sheets…';
    try { records = await cloudRequest('listAttempts', {}, getSession().token); render(); status.textContent = `${records.length} pengerjaan · diperbarui ${time(Date.now())}. Uraian dinilai guru.`; }
    catch (error) { status.textContent = error.message; }
    finally { busy = false; }
  };
  panel.querySelector('[data-teacher-filter]').addEventListener('change', render);
  panel.querySelector('[data-teacher-search]').addEventListener('input', render);
  panel.querySelector('[data-teacher-refresh]').addEventListener('click', refresh);
  panel.querySelector('[data-close-teacher-detail]').addEventListener('click', () => panel.querySelector('dialog').close());
  panel.querySelector('[data-teacher-export]').addEventListener('click', () => {
    const safe = value => `"${String(value ?? '').replace(/^[=+@-]/, "'$&").replace(/"/g, '""')}"`;
    const csv = '\uFEFF' + [['Nama','Kelas','Absen','Tes','Status','Terjawab','Total','PG','PG Maks','Diperbarui WIB'], ...selected().map(row => [row.profile.name,row.profile.className,row.profile.absen,labels[row.examId],row.status,row.answered,row.total,row.mcqScore,row.mcqMax,time(row.updatedAt)])].map(row => row.map(safe).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })), link = document.createElement('a'); link.href = url; link.download = 'Rekap_Tes_ARCUS.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  refresh(); setInterval(() => { if (!document.hidden && dashboard.classList.contains('active')) refresh(); }, 15000);
}
