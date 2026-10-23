/* ARCUS Google Sheets API. Generated with exam definitions by npm run backend:build. */
const ARCUS_SPREADSHEET_ID = '1lJRwjknEZcjQUThTr_muJxltySKCWVcqXO1olZ3leqo';
const ARCUS_ITERATIONS = 310000;
/* EXAM_DEFINITIONS */
const ARCUS_HEADERS = ['ID Percobaan','ID Siswa','Nama','Kelas','No Absen','ID Tes','Tes','Status','Mulai WIB','Pembaruan WIB','Submit WIB','Terjawab','Jumlah Soal','Nilai PG','PG Maks','Uraian Terisi','Uraian Maks','Catatan Keluar','Alasan Submit','Revisi','Awal Jawaban','Metadata'];

function onOpen() { SpreadsheetApp.getUi().createMenu('ARCUS').addItem('Siapkan tabel rekap','setupArcus').addItem('Atur akun guru','showTeacherSetup').addToUi(); }
function setupArcusDanGuru() { setupArcus(); showTeacherSetup(); }
function arcusOwner_() {
  const active = Session.getActiveUser().getEmail(), owner = SpreadsheetApp.openById(ARCUS_SPREADSHEET_ID).getOwner().getEmail();
  if (!active || active !== owner || !SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.getActiveSpreadsheet().getId() !== ARCUS_SPREADSHEET_ID) throw new Error('Buka dari editor Apps Script/spreadsheet dengan akun pemilik.');
}
function setupArcus() {
  arcusOwner_();
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('ARCUS_PEPPER')) props.setProperty('ARCUS_PEPPER', Utilities.getUuid() + Utilities.getUuid());
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const book = SpreadsheetApp.openById(ARCUS_SPREADSHEET_ID); book.setSpreadsheetTimeZone('Asia/Jakarta');
    arcusSheet_('ARCUS_Siswa',['ID Siswa','Nama','Kelas','No Absen','Masuk Terakhir WIB']);
    arcusSheet_('ARCUS_Tes',ARCUS_HEADERS);
    arcusSheet_('ARCUS_Jawaban',['ID Percobaan','ID Siswa','ID Tes','Nomor','ID Soal','Jenis','Pertanyaan','Jawaban','Kode Jawaban','Pembaruan WIB']);
    props.setProperty('ARCUS_READY','1');
  } finally { lock.releaseLock(); }
  onOpen();
}
function arcusSheet_(name, headers) {
  const book = SpreadsheetApp.openById(ARCUS_SPREADSHEET_ID);
  let sheet = book.getSheetByName(name);
  if (!sheet) sheet = book.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1,1,1,headers.length).setValues([headers]).setBackground('#173f57').setFontColor('#ffffff').setFontWeight('bold');
    sheet.setFrozenRows(1); sheet.getRange(1,1,sheet.getMaxRows(),headers.length).setVerticalAlignment('top');
    sheet.setColumnWidths(1,headers.length,150);
  } else {
    const old = sheet.getRange(1,1,1,headers.length).getValues()[0];
    if (headers.some((value,index) => value !== old[index])) throw new Error('Header tabel '+name+' berbeda. Data lama dipertahankan; hubungi pengembang.');
  }
  return sheet;
}
function arcusRows_(sheet,last) { if (last > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(),Math.max(500,last-sheet.getMaxRows())); }
function showTeacherSetup() {
  arcusOwner_();
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutputFromFile('TeacherSetup').setWidth(440).setHeight(520), 'Atur akun guru ARCUS');
}
function teacherSetupChallenge() { arcusOwner_(); return { salt: Utilities.getUuid().replace(/-/g,''), iterations: ARCUS_ITERATIONS }; }
function configureTeacher(input) {
  arcusOwner_(); arcusReady_();
  const name = arcusText_(input.name,100), salt = String(input.salt || ''), proof = String(input.proof || '');
  if (name.length < 3 || !/^[\w-]{16,100}$/.test(salt) || !/^[a-f0-9]{64}$/.test(proof)) throw new Error('Data akun guru tidak sesuai.');
  PropertiesService.getScriptProperties().setProperties({ ARCUS_TEACHER_NAME: name, ARCUS_TEACHER_SALT: salt, ARCUS_TEACHER_HASH: arcusHmac_(proof), ARCUS_TEACHER_VERSION: Utilities.getUuid() });
  return 'Akun guru tersimpan. Password tidak ditulis ke spreadsheet.';
}
function doGet() { return arcusOutput_({ ok: true, spreadsheetId: ARCUS_SPREADSHEET_ID, data: { service: 'ARCUS', ready: PropertiesService.getScriptProperties().getProperty('ARCUS_READY') === '1' } }); }
function doPost(event) {
  try {
    const raw = event && event.postData && event.postData.contents;
    if (!raw || raw.length > 500000) arcusFail_('Permintaan terlalu besar atau kosong.','INVALID');
    const request = JSON.parse(raw);
    const data = arcusDispatch_(request.action,request.payload || {},request.token || '');
    return arcusOutput_({ ok: true, spreadsheetId: ARCUS_SPREADSHEET_ID, data: data });
  } catch (error) { return arcusOutput_({ ok: false, spreadsheetId: ARCUS_SPREADSHEET_ID, error: error.arcusCode ? error.message : 'Layanan belum dapat memproses permintaan. Periksa setup dan log Apps Script.', code: error.arcusCode || 'SERVER_ERROR' }); }
}
function arcusOutput_(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
function arcusFail_(message,code) { const error = new Error(message); error.arcusCode = code; throw error; }
function arcusReady_() { if (PropertiesService.getScriptProperties().getProperty('ARCUS_READY') !== '1') arcusFail_('Jalankan setupArcus terlebih dahulu.','NOT_READY'); }
function arcusText_(value,max) { return String(value || '').trim().replace(/\s+/g,' ').slice(0,max); }
function arcusDigest_(value) { return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,value,Utilities.Charset.UTF_8).map(function(byte) { return ('0'+((byte+256)%256).toString(16)).slice(-2); }).join(''); }
function arcusHmac_(value) { return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(value,PropertiesService.getScriptProperties().getProperty('ARCUS_PEPPER'))); }
function arcusEqual_(a,b) { let difference = a.length ^ b.length; for (let i=0;i<Math.max(a.length,b.length);i++) difference |= (a.charCodeAt(i)||0) ^ (b.charCodeAt(i)||0); return difference === 0; }
function arcusCell_(value) { const text = String(value == null ? '' : value); return /^[\s]*[=+@-]/.test(text) ? "'"+text : text; }
function arcusUncell_(value) { const text=String(value == null ? '' : value); return /^'[\s]*[=+@-]/.test(text) ? text.slice(1) : text; }
function arcusSession_(token, role) {
  if (!/^[\w-]{60,100}$/.test(token)) arcusFail_('Sesi berakhir. Silakan masuk kembali.','AUTH_REQUIRED');
  const raw = CacheService.getScriptCache().get('session:'+arcusDigest_(token));
  if (!raw) arcusFail_('Sesi berakhir. Silakan masuk kembali.','AUTH_REQUIRED');
  const session = JSON.parse(raw);
  if (session.expiresAt <= Date.now() || (session.role === 'teacher' && session.version !== PropertiesService.getScriptProperties().getProperty('ARCUS_TEACHER_VERSION'))) arcusFail_('Sesi berakhir. Silakan masuk kembali.','AUTH_REQUIRED');
  if (role && session.role !== role) arcusFail_('Akses hanya untuk '+(role === 'teacher' ? 'guru.' : 'siswa.'),'FORBIDDEN');
  return session;
}
function arcusIssue_(role,profile) {
  const token = Utilities.getUuid()+Utilities.getUuid(), seconds = role === 'teacher' ? 7200 : 21600;
  const session = { token: token, role: role, profile: profile, expiresAt: Date.now()+seconds*1000, version: PropertiesService.getScriptProperties().getProperty('ARCUS_TEACHER_VERSION') || '' };
  CacheService.getScriptCache().put('session:'+arcusDigest_(token),JSON.stringify(session),seconds); return session;
}
function arcusDispatch_(action,payload,token) {
  if (action === 'health') return { ready: PropertiesService.getScriptProperties().getProperty('ARCUS_READY') === '1' };
  arcusReady_();
  if (action === 'studentLogin') return arcusStudentLogin_(payload);
  if (action === 'teacherChallenge') {
    const props = PropertiesService.getScriptProperties();
    if (!props.getProperty('ARCUS_TEACHER_HASH')) arcusFail_('Pemilik belum membuat akun guru dari menu ARCUS pada spreadsheet.','NOT_READY');
    return { salt: props.getProperty('ARCUS_TEACHER_SALT'), iterations: ARCUS_ITERATIONS };
  }
  if (action === 'teacherLogin') return arcusTeacherLogin_(payload);
  const session = arcusSession_(token);
  if (action === 'session') return session;
  if (action === 'logout') { CacheService.getScriptCache().remove('session:'+arcusDigest_(token)); return { loggedOut: true }; }
  if (action === 'saveAttempt') { arcusSession_(token,'student'); return arcusSave_(payload.attempt,session); }
  if (action === 'ownAttempts') { arcusSession_(token,'student'); return arcusRecords_(session.profile.id).map(function(record) { return arcusAttempt_(record); }); }
  if (action === 'listAttempts') { arcusSession_(token,'teacher'); return arcusRecords_().map(arcusSummary_); }
  if (action === 'attemptDetail') {
    arcusSession_(token,'teacher');
    const record = arcusRecords_().filter(function(row) { return row[0] === payload.id; })[0];
    if (!record) arcusFail_('Percobaan tidak ditemukan.','NOT_FOUND');
    return { summary: arcusSummary_(record), questions: arcusAnswerRows_(record).map(function(row) { return { number: row[3], key: row[4], type: row[5], prompt: arcusUncell_(row[6]), answerText: arcusUncell_(row[7]) }; }) };
  }
  arcusFail_('Aksi tidak tersedia.','INVALID');
}
function arcusStudentLogin_(input) {
  const name = arcusText_(input.name,101), className = arcusText_(input.className,61), absen = String(input.absen || '').trim();
  if (name.length < 3 || name.length > 100 || !className || className.length > 60 || !/^\d{1,2}$/.test(absen) || +absen < 1) arcusFail_('Nama, kelas, atau nomor absen tidak sesuai.','INVALID');
  const profile = { id: arcusDigest_([name.toLowerCase(),className.toLowerCase(),String(+absen)].join('\n')), name: name, className: className, absen: String(+absen) };
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const sheet = SpreadsheetApp.openById(ARCUS_SPREADSHEET_ID).getSheetByName('ARCUS_Siswa');
    const row = arcusFindRow_(sheet,profile.id), values = [[profile.id,arcusCell_(name),arcusCell_(className),+absen,new Date()]];
    arcusRows_(sheet,row || sheet.getLastRow()+1);
    sheet.getRange(row || sheet.getLastRow()+1,1,1,5).setValues(values); sheet.getRange(row || sheet.getLastRow(),5).setNumberFormat('dd/MM/yyyy HH:mm:ss');
  } finally { lock.releaseLock(); }
  return arcusIssue_('student',profile);
}
function arcusTeacherLogin_(input) {
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const props = PropertiesService.getScriptProperties(), cache = CacheService.getScriptCache();
    const failed = JSON.parse(cache.get('teacher-failures') || '{"count":0,"since":0}');
    if (failed.count >= 5 && Date.now()-failed.since < 900000) arcusFail_('Terlalu banyak percobaan. Coba lagi setelah 15 menit.','RATE_LIMIT');
    const expected = props.getProperty('ARCUS_TEACHER_HASH') || '', actual = /^[a-f0-9]{64}$/.test(input.proof || '') ? arcusHmac_(input.proof) : '';
    if (!expected || !arcusEqual_(expected,actual) || arcusText_(input.name,100).toLowerCase() !== (props.getProperty('ARCUS_TEACHER_NAME') || '').toLowerCase()) {
      const sameWindow = Date.now()-failed.since < 900000; cache.put('teacher-failures',JSON.stringify({ count: sameWindow ? failed.count+1 : 1, since: sameWindow ? failed.since : Date.now() }),900);
      arcusFail_('Nama atau password guru salah.','INVALID_CREDENTIALS');
    }
    cache.remove('teacher-failures'); return arcusIssue_('teacher',{ id: 'teacher', name: props.getProperty('ARCUS_TEACHER_NAME') });
  } finally { lock.releaseLock(); }
}
function arcusFindRow_(sheet,id) {
  if (sheet.getLastRow() < 2) return 0;
  const cell = sheet.getRange(2,1,sheet.getLastRow()-1,1).createTextFinder(id).matchEntireCell(true).useRegularExpression(false).findNext();
  return cell ? cell.getRow() : 0;
}
function arcusRecords_(studentId) {
  const sheet = SpreadsheetApp.openById(ARCUS_SPREADSHEET_ID).getSheetByName('ARCUS_Tes');
  if (sheet.getLastRow() < 2) return [];
  const rows = sheet.getRange(2,1,sheet.getLastRow()-1,ARCUS_HEADERS.length).getValues().filter(function(row) { return row[0] && (!studentId || row[1] === studentId); });
  const expired = rows.filter(function(row) { const meta=JSON.parse(row[21] || '{}'); return row[7] !== 'Sudah disubmit' && meta.deadline && Date.now() >= meta.deadline; });
  if (expired.length) {
    const lock=LockService.getScriptLock(); lock.waitLock(20000);
    try {
      expired.forEach(function(row) {
        const index=arcusFindRow_(sheet,row[0]), fresh=sheet.getRange(index,1,1,ARCUS_HEADERS.length).getValues()[0], meta=JSON.parse(fresh[21] || '{}');
        if (fresh[7] !== 'Sudah disubmit' && meta.deadline && Date.now() >= meta.deadline) {
          fresh[7]='Sudah disubmit'; fresh[9]=new Date(); fresh[10]=new Date(meta.deadline); fresh[18]='Waktu ujian habis saat halaman ditinggalkan.';
          sheet.getRange(index,1,1,ARCUS_HEADERS.length).setValues([fresh]);
        }
        for(let col=0;col<fresh.length;col++) row[col]=fresh[col];
      });
      SpreadsheetApp.flush();
    } finally { lock.releaseLock(); }
  }
  return rows.sort(function(a,b) { return new Date(b[9])-new Date(a[9]); });
}
function arcusSummary_(row) {
  return { id: row[0], profile: { id: row[1], name: arcusUncell_(row[2]), className: arcusUncell_(row[3]), absen: String(row[4]) }, examId: row[5], status: row[7] === 'Sudah disubmit' ? 'submitted' : 'active', startedAt: +new Date(row[8]), updatedAt: +new Date(row[9]), submittedAt: row[10] ? +new Date(row[10]) : null, answered: row[11], total: row[12], mcqScore: row[13], mcqMax: row[14], essayAnswered: row[15], revision: row[19], submissionReason: arcusUncell_(row[18]) };
}
function arcusAnswerRows_(row) { return SpreadsheetApp.openById(ARCUS_SPREADSHEET_ID).getSheetByName('ARCUS_Jawaban').getRange(row[20],1,row[12],10).getValues(); }
function arcusAttempt_(row) {
  const summary = arcusSummary_(row), answers = {}, examId = row[5];
  arcusAnswerRows_(row).forEach(function(answer) {
    const code = arcusUncell_(answer[8]);
    if (examId === 'diagnostik' && answer[4] === 'q6') { const value = JSON.parse(code || '{}'); answers.q6_choice = value.choice || null; answers.q6_reason = value.reason || ''; }
    else if (examId === 'diagnostik' && answer[4] === 'q7') answers.q7_info = JSON.parse(code || '[]');
    else if (examId === 'posttest') { const type = answer[5] === 'mcq' ? 'mcq' : 'essay'; answers[type] = answers[type] || {}; if(code) answers[type][answer[4]] = code; }
    else if (code) answers[answer[4]] = code;
  });
  return Object.assign(summary,JSON.parse(row[21] || '{}'),{ answers: answers, participant: { name: summary.profile.name, className: summary.profile.className, absen: summary.profile.absen }, version: 1 });
}
function arcusNormalize_(definition,input) {
  input = input || {};
  return definition.questions.map(function(question,index) {
    let value = definition.id === 'posttest' ? (input[question.type] || {})[question.id] : input[question.id];
    if (definition.id === 'diagnostik' && question.id === 'q6') value = { choice: input.q6_choice || '', reason: String(input.q6_reason || '').slice(0,10000) };
    if (definition.id === 'diagnostik' && question.id === 'q7') value = (Array.isArray(input.q7_info) ? input.q7_info : []).slice(0,4).map(function(text) { return String(text).slice(0,2000); });
    let code = typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value == null ? '' : value).slice(0,10000), answerText = code;
    if (question.type === 'mcq') {
      if (code && !Object.prototype.hasOwnProperty.call(question.options,code)) arcusFail_('Pilihan jawaban tidak sesuai.','INVALID');
      answerText = question.options[code] || '';
    } else if (question.id === 'q6' && definition.id === 'diagnostik') answerText = value.choice + (value.reason ? '\n'+value.reason : '');
    else if (question.id === 'q7' && definition.id === 'diagnostik') answerText = value.filter(Boolean).join('\n');
    const answered = Boolean(answerText.trim());
    return { number: index+1, key: question.id, type: question.type, prompt: question.prompt, code: code, answerText: answerText, answered: answered, points: question.type === 'mcq' && code === question.correct ? question.points : 0 };
  });
}
function arcusSave_(attempt,session) {
  if (!attempt || !/^[\w-]{8,120}$/.test(attempt.id || '') || !Number.isSafeInteger(attempt.revision) || attempt.revision < 1 || !['active','submitted'].includes(attempt.status) || !Object.prototype.hasOwnProperty.call(ARCUS_EXAMS,attempt.examId)) arcusFail_('Data percobaan tidak sesuai.','INVALID');
  const definition = ARCUS_EXAMS[attempt.examId], now = Date.now();
  let answers = arcusNormalize_(definition,attempt.answers);
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const book = SpreadsheetApp.openById(ARCUS_SPREADSHEET_ID), sheet = book.getSheetByName('ARCUS_Tes'), answerSheet = book.getSheetByName('ARCUS_Jawaban');
    let rowNumber = arcusFindRow_(sheet,attempt.id), old = rowNumber ? sheet.getRange(rowNumber,1,1,ARCUS_HEADERS.length).getValues()[0] : null;
    if (old && (old[1] !== session.profile.id || old[5] !== attempt.examId)) arcusFail_('Percobaan ini milik peserta lain.','FORBIDDEN');
    if (old && old[7] === 'Sudah disubmit') return { id: attempt.id, revision: attempt.revision, closed: true, attempt: arcusAttempt_(old) };
    if (old && attempt.revision <= old[19]) return { id: attempt.id, revision: attempt.revision, stale: true, currentRevision: old[19] };
    const previousMeta = old ? JSON.parse(old[21] || '{}') : {};
    // Wall clock and scores are owned by the server. Client scores/identity are ignored.
    const startedAt = old ? +new Date(old[8]) : now;
    const deadline = definition.durationMinutes ? startedAt+definition.durationMinutes*60000 : null;
    const expired = deadline && now >= deadline, submitted = attempt.status === 'submitted' || expired;
    if (expired && old) answers = arcusNormalize_(definition,arcusAttempt_(old).answers);
    const reason = expired ? 'Waktu ujian habis.' : arcusText_(attempt.submissionReason || (submitted ? 'Dikumpulkan oleh peserta.' : ''),200);
    const violations = Array.isArray(attempt.violations) ? attempt.violations.slice(0,50).map(function(entry) { return { at: Number.isFinite(entry.at) ? entry.at : now, reason: arcusText_(entry.reason,250) }; }) : [];
    const meta = { deadline: deadline, optionOrder: attempt.optionOrder || previousMeta.optionOrder || {}, flags: Array.isArray(attempt.flags) ? attempt.flags.slice(0,35) : [], paused: Boolean(attempt.paused), violations: violations };
    if (JSON.stringify(meta).length > 25000) arcusFail_('Metadata percobaan terlalu besar.','INVALID');
    const orphan = old ? 0 : arcusFindRow_(answerSheet,attempt.id);
    if (orphan) {
      const owner = answerSheet.getRange(orphan,1,1,3).getValues()[0];
      if (owner[1] !== session.profile.id || owner[2] !== attempt.examId) arcusFail_('Percobaan ini milik peserta lain.','FORBIDDEN');
    }
    const start = old ? old[20] : orphan || Math.max(2,answerSheet.getLastRow()+1);
    arcusRows_(answerSheet,start+answers.length-1);
    answerSheet.getRange(start,1,answers.length,10).setValues(answers.map(function(answer) { return [attempt.id,session.profile.id,attempt.examId,answer.number,answer.key,answer.type,arcusCell_(answer.prompt),arcusCell_(answer.answerText),arcusCell_(answer.code),new Date(now)]; }));
    answerSheet.getRange(start,10,answers.length,1).setNumberFormat('dd/MM/yyyy HH:mm:ss');
    const mcqScore = answers.reduce(function(sum,answer) { return sum+answer.points; },0), mcqMax = definition.questions.reduce(function(sum,q) { return sum+(q.type === 'mcq' ? q.points : 0); },0);
    const values = [attempt.id,session.profile.id,arcusCell_(session.profile.name),arcusCell_(session.profile.className),+session.profile.absen,attempt.examId,definition.title,submitted ? 'Sudah disubmit' : 'Sedang dikerjakan',new Date(startedAt),new Date(now),submitted ? new Date(now) : '',answers.filter(function(a) { return a.answered; }).length,answers.length,mcqScore,mcqMax,answers.filter(function(a) { return a.type === 'essay' && a.answered; }).length,definition.essayMax,violations.length,arcusCell_(reason),attempt.revision,start,JSON.stringify(meta)];
    rowNumber = rowNumber || sheet.getLastRow()+1;
    arcusRows_(sheet,rowNumber);
    sheet.getRange(rowNumber,1,1,values.length).setValues([values]); sheet.getRange(rowNumber,9,1,3).setNumberFormat('dd/MM/yyyy HH:mm:ss');
    SpreadsheetApp.flush();
    return { id: attempt.id, revision: attempt.revision, closed: Boolean(submitted), attempt: submitted ? arcusAttempt_(values) : null, startedAt: startedAt, deadline: deadline };
  } finally { lock.releaseLock(); }
}
