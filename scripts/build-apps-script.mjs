import { readFile, writeFile } from 'node:fs/promises';
import { SEMESTER_EXAMS } from '../src/semester-exam-data.js';
import { gradeSemesterExam } from '../src/semester-exam-grading.js';
import { MCQ_KEYS } from '../js/diagnostik.js';
import { POST_TEST_DATA, POST_TEST_MCQ_KEYS } from '../js/post-test.js';

const html = await readFile(new URL('../index.html',import.meta.url),'utf8');
const plain = text => text.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const diagBlocks = [...html.matchAll(/id="diag-item-(\d+)"[\s\S]*?(?=id="diag-item-\d+"|id="diag-result-card")/g)];
const diagnostic = Array.from({length:9},(_,index) => {
  const no=index+1,block=diagBlocks.find(match=>+match[1]===no)?.[0] || '';
  const options=Object.fromEntries([...block.matchAll(/class="diag-mcq-opt"[^>]*data-val="([A-D])"[\s\S]*?class="diag-mcq-text">([\s\S]*?)<\/span>/g)].map(match=>[match[1],plain(match[2])]));
  return {id:no<=5 ? `q${no}` : no===6 ? 'q6' : no===7 ? 'q7' : no===8 ? 'q8_impact' : 'q9_critical',type:no<=5?'mcq':'essay',prompt:plain(block.match(/class="diag-q-text"[^>]*>([\s\S]*?)<\/p>/)?.[1] || `Soal diagnostik ${no}`),options,correct:MCQ_KEYS[`q${no}`] || '',points:no<=5?5:0};
});
const exams={diagnostik:{id:'diagnostik',title:'Tes Diagnostik',essayMax:75,questions:diagnostic},posttest:{id:'posttest',title:'Tes Pemahaman',essayMax:40,questions:[...POST_TEST_DATA.mcq.map(q=>({id:String(q.no),type:'mcq',prompt:q.q,options:q.options,correct:POST_TEST_MCQ_KEYS[q.no],points:3})),...POST_TEST_DATA.essay.map(q=>({id:String(q.no),type:'essay',prompt:q.q || q.question,points:0}))]}};
for(const exam of Object.values(SEMESTER_EXAMS)) exams[exam.id]={id:exam.id,title:exam.title,durationMinutes:exam.durationMinutes,essayMax:40,questions:exam.questions.map(question=>({id:question.id,type:question.type,prompt:question.prompt,points:question.points,options:question.options?Object.fromEntries(question.options.map(option=>[option.id,option.text])):undefined,correct:question.options?.find(option=>gradeSemesterExam(exam,{answers:{[question.id]:option.id}}).correctCount===1)?.id}))};
const template=await readFile(new URL('../backend/Code.template.gs',import.meta.url),'utf8');
await writeFile(new URL('../backend/Code.gs',import.meta.url),template.replace('/* EXAM_DEFINITIONS */',`const ARCUS_EXAMS = ${JSON.stringify(exams,null,2)};`));
console.log(`Apps Script dibuat: ${Object.values(exams).map(exam=>`${exam.id} ${exam.questions.length} soal`).join(', ')}.`);
