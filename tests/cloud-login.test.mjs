import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { createHash, createHmac, randomUUID, pbkdf2Sync, webcrypto } from 'node:crypto';
import { createOutbox } from '../src/cloud-outbox.js';
import { validateStudentLogin, studentStorageKey } from '../src/auth-session.js';
import { validateEndpoint, deriveTeacherProof } from '../src/cloud-client.js';
import { semesterCloudAttempt } from '../src/assessment-sync.js';

const memory = () => { const map=new Map(); return {getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,value)}; };
test('login uses only name/class/number, isolates student data and accepts only HTTPS Apps Script deployments', () => {
  assert.deepEqual(validateStudentLogin({name:'  Siswa   Satu ',className:'X TP 1',absen:'07'}),{name:'Siswa Satu',className:'X TP 1',absen:'7'});
  for(const input of [{name:'a',className:'X',absen:'1'},{name:'Siswa',className:'',absen:'1'},{name:'Siswa',className:'X',absen:'0'}]) assert.throws(()=>validateStudentLogin(input));
  assert.notEqual(studentStorageKey('draft',{profile:{id:'a'}}),studentStorageKey('draft',{profile:{id:'b'}}));
  assert.throws(()=>studentStorageKey('draft',null));
  assert.equal(validateEndpoint('https://script.google.com/macros/s/example-id/exec'),'https://script.google.com/macros/s/example-id/exec');
  for(const url of ['https://evil.test/exec','http://script.google.com/macros/s/id/exec','https://script.google.com/macros/s/id/dev','https://script.google.com/macros/s/id/exec?token=x']) assert.throws(()=>validateEndpoint(url));
});
test('teacher password derivation matches PBKDF2 SHA-256 and validates server work factors', async () => {
  const salt='1234567890abcdef1234567890abcdef',password='Local test password only!';
  assert.equal(await deriveTeacherProof(password,salt,310000),pbkdf2Sync(password,salt,310000,32,'sha256').toString('hex'));
  await assert.rejects(deriveTeacherProof(password,salt,1));
});
test('the owner setup form reads named inputs safely and sends a derived proof instead of the password', async () => {
  const salt='1234567890abcdef1234567890abcdef',password='Local setup test only';let handler,captured,success,reset=false;
  const form={name:'',elements:{name:{value:'Guru Penguji'},password:{value:password},repeat:{value:password}},addEventListener:(_type,fn)=>{handler=fn;},reset:()=>{reset=true;}};
  const status={textContent:''},button={disabled:false};
  const run={withSuccessHandler(fn){success=fn;return this;},withFailureHandler(){return this;},teacherSetupChallenge(){success({salt,iterations:310000});},configureTeacher(input){captured=input;success('Akun tersimpan.');}};
  const html=readFileSync(new URL('../backend/TeacherSetup.html',import.meta.url),'utf8');
  vm.runInNewContext(html.match(/<script>([\s\S]*)<\/script>/)[1],{document:{getElementById:id=>({form,status,save:button})[id]},google:{script:{run}},crypto:webcrypto,TextEncoder});
  await handler({preventDefault(){}});
  assert.equal(captured.name,'Guru Penguji');assert.equal(captured.proof,pbkdf2Sync(password,salt,310000,32,'sha256').toString('hex'));
  assert.equal(captured.password,undefined);assert.equal(reset,true);assert.equal(button.disabled,false);
});
test('newer edits survive an in-flight acknowledgement, revisions survive reopening and final status never regresses', async () => {
  const disk=memory(); let resolve, sent;
  const box=createOutbox({storage:disk,key:'outbox',send:attempt=>{sent=attempt;return new Promise(done=>{resolve=done;});}});
  const draft={id:'attempt-1',status:'active',answers:{q1:'A'}};
  box.enqueue(draft); const sending=box.flush();
  box.enqueue({...draft,answers:{q1:'B'}}); resolve({id:sent.id,revision:sent.revision}); await sending;
  assert.equal(box.pending(),1); assert.equal(box.snapshot()['attempt-1'].answers.q1,'B');
  const again=createOutbox({storage:disk,key:'outbox',send:async attempt=>({id:attempt.id,revision:attempt.revision})});
  await again.flush(); assert.equal(again.pending(),0);
  assert.equal(again.enqueue({...draft,status:'submitted'}).revision,3);
  again.enqueue(draft); assert.equal(again.snapshot()['attempt-1'].status,'submitted');
});
test('offline and malformed acknowledgements retain the full pending draft until confirmed', async () => {
  const disk=memory(), draft={id:'attempt-1',status:'active',answers:{essay:'Belum disubmit'}};
  const box=createOutbox({storage:disk,key:'outbox',send:async()=>{throw new Error('offline');}}); box.enqueue(draft);
  await assert.rejects(box.flush()); assert.equal(box.pending(),1);
  const wrong=createOutbox({storage:disk,key:'outbox',send:async()=>({id:'other',revision:1})}); await assert.rejects(wrong.flush()); assert.equal(wrong.pending(),1);
  assert.equal(wrong.snapshot()['attempt-1'].answers.essay,'Belum disubmit');
});
test('restored server revisions are preserved and stale saves remain pending until a newer revision is acknowledged', async () => {
  const disk=memory();let stale=true;
  const box=createOutbox({storage:disk,key:'outbox',send:async attempt=>stale?{id:attempt.id,revision:attempt.revision,stale:true,currentRevision:120}:{id:attempt.id,revision:attempt.revision}});
  const restored=semesterCloudAttempt({id:'restored',examId:'uts',revision:100,answers:{u01:'1'},status:'active'});
  assert.equal(box.enqueue(restored).revision,101);
  await box.flush();assert.equal(box.pending(),1);assert.equal(box.snapshot().restored.revision,121);
  stale=false;await box.flush();assert.equal(box.pending(),0);
});

function backend() {
  let now=Date.UTC(2026,9,23,12),activeEmail='owner@example.test';
  class Clock extends Date { constructor(...args){super(...(args.length?args:[now]));} static now(){return now;} }
  class Range {
    constructor(sheet,row,col,rows=1,cols=1){Object.assign(this,{sheet,row,col,rows,cols});assert.ok(row+rows-1<=sheet.max,'range must fit allocated rows');}
    getValues(){return Array.from({length:this.rows},(_,r)=>Array.from({length:this.cols},(_,c)=>this.sheet.data[this.row+r-1]?.[this.col+c-1]??''));}
    setValues(values){assert.equal(values.length,this.rows);values.forEach((row,r)=>{assert.equal(row.length,this.cols);this.sheet.data[this.row+r-1]||=[];row.forEach((value,c)=>{assert.notEqual(value,undefined,'Sheets does not accept undefined');this.sheet.data[this.row+r-1][this.col+c-1]=value;});});return this;}
    setBackground(){return this;} setFontColor(){return this;} setFontWeight(){return this;} setVerticalAlignment(){return this;} setNumberFormat(){return this;}
    createTextFinder(id){const range=this;return {matchEntireCell(){return this;},useRegularExpression(){return this;},findNext(){for(let r=range.row;r<range.row+range.rows;r++)if(range.sheet.data[r-1]?.[0]===id)return {getRow:()=>r};return null;}};}
  }
  class Sheet {
    constructor(){this.data=[];this.max=1000;} getLastRow(){return this.data.length;} getMaxRows(){return this.max;} insertRowsAfter(_after,count){this.max+=count;} getRange(...args){return new Range(this,...args);} setFrozenRows(){} setColumnWidths(){}
  }
  const sheets=new Map(),properties=new Map(),cache=new Map();
  const book={getId:()=> '1lJRwjknEZcjQUThTr_muJxltySKCWVcqXO1olZ3leqo',getOwner:()=>({getEmail:()=> 'owner@example.test'}),getSheetByName:name=>sheets.get(name),insertSheet:name=>{const sheet=new Sheet();sheets.set(name,sheet);return sheet;},setSpreadsheetTimeZone(){}};
  const propertiesAPI={getProperty:key=>properties.get(key)||null,setProperty(key,value){properties.set(key,value);return this;},setProperties(values){Object.entries(values).forEach(([key,value])=>properties.set(key,value));}};
  const cacheAPI={get:key=>{const record=cache.get(key);return record&&record.until>now?record.value:null;},put:(key,value,seconds)=>cache.set(key,{value,until:now+seconds*1000}),remove:key=>cache.delete(key)};
  const lock={waitLock(){},releaseLock(){}};
  const context=vm.createContext({Date:Clock,console,PropertiesService:{getScriptProperties:()=>propertiesAPI},CacheService:{getScriptCache:()=>cacheAPI},LockService:{getScriptLock:()=>lock},Session:{getActiveUser:()=>({getEmail:()=>activeEmail})},SpreadsheetApp:{openById:()=>book,getActiveSpreadsheet:()=>book,flush(){},getUi:()=>({createMenu:()=>({addItem(){return this;},addToUi(){}})})},Utilities:{getUuid:randomUUID,DigestAlgorithm:{SHA_256:'sha256'},Charset:{UTF_8:'utf8'},computeDigest:(_alg,value)=>[...createHash('sha256').update(value).digest()],computeHmacSha256Signature:(value,key)=>[...createHmac('sha256',key).update(value).digest()],base64EncodeWebSafe:bytes=>Buffer.from(bytes).toString('base64url')}});
  vm.runInContext(readFileSync(new URL('../backend/Code.gs',import.meta.url),'utf8'),context);
  context.setupArcus();
  return {context,sheets,properties,advance:ms=>{now+=ms;},asEditor:()=>{activeEmail='editor@example.test';},call:(action,payload={},token='')=>context.arcusDispatch_(action,payload,token)};
}
const login=(api,name='Siswa Satu',absen='1')=>api.call('studentLogin',{name,className:'X TP 1',absen});
const draft=(id='attempt-one')=>({id,examId:'uts',status:'active',revision:1,answers:{u01:'0',u21:'Jawaban sementara'},optionOrder:Object.fromEntries(Array.from({length:20},(_,i)=>[`u${String(i+1).padStart(2,'0')}`,['0','1','2','3']]))});
test('backend rejects forged roles, cross-student reads/writes and unauthenticated teacher access', () => {
  const api=backend(),one=login(api),two=login(api,'Siswa Dua','2');
  assert.throws(()=>api.call('listAttempts',{},one.token),error=>error.arcusCode==='FORBIDDEN');
  assert.throws(()=>api.call('listAttempts'),error=>error.arcusCode==='AUTH_REQUIRED');
  api.call('saveAttempt',{attempt:draft(),role:'teacher'},one.token);
  assert.equal(api.call('ownAttempts',{},two.token).length,0);
  assert.throws(()=>api.call('saveAttempt',{attempt:{...draft(),revision:2}},two.token),error=>error.arcusCode==='FORBIDDEN');
  assert.throws(()=>api.call('attemptDetail',{id:'attempt-one'},one.token),error=>error.arcusCode==='FORBIDDEN');
});
test('backend saves drafts before submit, computes server scores, ignores stale writes and freezes submitted answers', () => {
  const api=backend(),student=login(api),first=draft(); first.scores={mcqScore:60};first.participant={name:'Forged'};
  const ack=api.call('saveAttempt',{attempt:first},student.token);
  assert.equal(ack.closed,false);
  let own=api.call('ownAttempts',{},student.token)[0];
  assert.equal(own.status,'active');assert.equal(own.mcqScore,3);assert.equal(own.profile.name,'Siswa Satu');assert.equal(own.answers.u21,'Jawaban sementara');
  api.call('saveAttempt',{attempt:{...first,revision:2,status:'submitted',answers:{u01:'1',u21:'Jawaban akhir'}}},student.token);
  api.call('saveAttempt',{attempt:{...first,revision:3,answers:{u01:'0'}}},student.token);
  own=api.call('ownAttempts',{},student.token)[0];assert.equal(own.status,'submitted');assert.equal(own.answers.u21,'Jawaban akhir');assert.equal(own.mcqScore,0);
  assert.equal(api.sheets.get('ARCUS_Tes').getLastRow(),2);assert.equal(api.sheets.get('ARCUS_Jawaban').getLastRow(),26);
});
test('retrying a partial Sheets write reuses the answer block and preserves one row per attempt', () => {
  const api=backend(),student=login(api),sheet=api.sheets.get('ARCUS_Tes'),getRange=sheet.getRange.bind(sheet);let fail=true;
  sheet.getRange=(...args)=>{const range=getRange(...args),set=range.setValues.bind(range);if(args[0]===2&&args[1]===1&&args[2]===1)range.setValues=values=>{if(fail){fail=false;throw new Error('temporary write failure');}return set(values);};return range;};
  assert.throws(()=>api.call('saveAttempt',{attempt:draft()},student.token));
  assert.equal(api.sheets.get('ARCUS_Jawaban').getLastRow(),26);
  api.call('saveAttempt',{attempt:draft()},student.token);
  assert.equal(api.sheets.get('ARCUS_Jawaban').getLastRow(),26);assert.equal(sheet.getLastRow(),2);
});
test('backend keeps server deadlines and auto-closes expired exams even if the client submits a later clock', () => {
  const api=backend(),student=login(api),first=draft();
  const ack=api.call('saveAttempt',{attempt:{...first,startedAt:Date.now()+999999999}},student.token);
  assert.equal(ack.deadline-ack.startedAt,60*60000);
  api.advance(61*60000);
  const closed=api.call('saveAttempt',{attempt:{...first,revision:2,answers:{u01:'3',u21:'Edited after deadline'}}},student.token);
  assert.equal(closed.closed,true);assert.equal(closed.attempt.submissionReason,'Waktu ujian habis.');
  assert.equal(closed.attempt.answers.u21,'Jawaban sementara');
});
test('opening the recap closes an expired semester attempt even if the student never returns to submit', () => {
  const api=backend(),student=login(api);
  api.call('saveAttempt',{attempt:draft()},student.token);api.advance(61*60000);
  const own=api.call('ownAttempts',{},student.token)[0];
  assert.equal(own.status,'submitted');assert.equal(own.answers.u21,'Jawaban sementara');
  assert.match(own.submissionReason,/Waktu ujian habis/);
});
test('teacher credentials are salted/peppered outside Sheets; setup requires owner and reset revokes old teacher sessions', () => {
  const api=backend(),challenge=api.context.teacherSetupChallenge(),proof=pbkdf2Sync('Test credential only',challenge.salt,challenge.iterations,32,'sha256').toString('hex');
  api.context.configureTeacher({name:'Guru Uji',salt:challenge.salt,proof});
  assert.notEqual(api.properties.get('ARCUS_TEACHER_HASH'),proof);
  const teacher=api.call('teacherLogin',{name:'Guru Uji',proof});assert.equal(teacher.role,'teacher');assert.equal(api.call('listAttempts',{},teacher.token).length,0);
  api.context.configureTeacher({name:'Guru Uji',salt:challenge.salt,proof});
  assert.throws(()=>api.call('listAttempts',{},teacher.token),error=>error.arcusCode==='AUTH_REQUIRED');
  api.asEditor();assert.throws(()=>api.context.configureTeacher({name:'Guru Lain',salt:challenge.salt,proof}));
});
test('all four papers have human answer rows, safe spreadsheet text, correct counts and room to grow', () => {
  const api=backend(),student=login(api,'=HYPERLINK("bad")');
  for(const [examId,total,answers] of [['diagnostik',9,{q1:'B',q6_choice:'Sama',q6_reason:'Alasan',q7_info:['A','B'],q8_impact:'=SUM(A1)',q9_critical:'Uraian'}],['posttest',35,{mcq:{1:'B'},essay:{21:'Uraian akhir'}}],['uts',25,{u01:'0'}],['uas',25,{a01:'2'}]]) {
    api.call('saveAttempt',{attempt:{id:`attempt-${examId}`,examId,status:'active',revision:1,answers}},student.token);
    const own=api.call('ownAttempts',{},student.token).find(attempt=>attempt.examId===examId);
    assert.equal(own.total,total);assert.equal(own.mcqScore,examId==='diagnostik'?5:3);
  }
  assert.ok(api.sheets.get('ARCUS_Siswa').data[1][1].startsWith("'="));
  const answerRows=api.sheets.get('ARCUS_Jawaban').data;
  assert.ok(answerRows.some(row=>row[7]==="'=SUM(A1)"));
  assert.equal(answerRows.length,95);
  for(let index=0;index<38;index++)api.call('saveAttempt',{attempt:draft(`growth-attempt-${index}`)},student.token);
  assert.ok(api.sheets.get('ARCUS_Jawaban').getMaxRows()>1000);
  const definitions=vm.runInContext('ARCUS_EXAMS',api.context);
  for(const paper of Object.values(definitions))for(const question of paper.questions)assert.ok(typeof question.prompt==='string' && question.prompt.length>5);
});
