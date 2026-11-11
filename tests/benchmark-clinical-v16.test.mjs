import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=name=>readFileSync(new URL('../public/ui-preview/'+name,import.meta.url),'utf8');
function get(){
  const localStorage={getItem(){return '{}';},setItem(){}};
  const document={readyState:'loading',addEventListener(){},getElementById(){return null;}};
  const window={};
  runInNewContext(read('p0-form-catalog.js'),{window},{timeout:3000});
  runInNewContext(read('benchmark-clinical-v16.js'),{window,document,localStorage},{timeout:3000});
  return window.SIMRSBenchmarkV16;
}
test('V16 remains within 68 modules, does not add global menus, and is loaded after login',()=>{
  const html=read('index.html');
  assert.ok(html.includes('benchmark-clinical-v16.css'));
  assert.ok(html.includes('benchmark-clinical-v16.js'));
  assert.ok(html.indexOf('role-demo-login.js')<html.indexOf('benchmark-clinical-v16.js'));
  assert.ok(html.indexOf('progressive-forms-v15.js')<html.indexOf('benchmark-clinical-v16.js'));
  const d=get().defs;
  assert.equal(d.length,13);
  assert.equal(new Set(d.map(x=>x.id)).size,13);
  for(const x of d){assert.ok(x.modules.length);assert.ok(x.roles.length);assert.ok(x.groups.length>=2);}
});

test('V16 rejects invalid numeric values on draft and review, using existing vital constraints',()=>{
 const api=get();
 const valid={pain_score:'0',gcs:'15',heart_rate:'80',respiratory_rate:'20',temperature:'36.8',spo2:'99'};
 assert.equal(api.validate('CF-01',valid,false).length,0);
 for(const [key,value] of Object.entries({pain_score:'99',gcs:'16',heart_rate:'-10',respiratory_rate:'101',temperature:'46',spo2:'101'})){
  for(const review of [false,true])assert.ok(api.validate('CF-01',{...valid,[key]:value},review).some(e=>e.key===key),key);
 }
 for(const value of ['NaN','Infinity','1e309','0x10','abc','1.5'])assert.ok(api.validate('CF-01',{gcs:value},false).some(e=>e.key==='gcs'),value);
 assert.ok(api.validate('CF-01',{temperature:'36.85'},false).some(e=>e.key==='temperature'));
 assert.equal(api.validate('CF-01',{pain_score:'10',gcs:'3',spo2:'0'},false).length,0);
 assert.ok(api.validate('CF-02',{pain:'11'},false).some(e=>e.key==='pain'));
 assert.ok(api.validate('CF-10',{quantity:'0'},false).some(e=>e.key==='quantity'));
 assert.ok(api.validate('CF-12',{qty:'-1'},false).some(e=>e.key==='qty'));
 assert.equal(api.validate('CF-12',{qty:'0.5'},false).length,0);
});

test('V16 allows incomplete drafts, requires review fields and rejects invalid dates, choices and time ordering',()=>{
 const api=get();
 assert.equal(api.validate('CF-01',{},false).length,0);
 const errors=api.validate('CF-01',{},true);
 assert.ok(errors.some(e=>e.key==='chief_complaint'&&e.group===0));
 assert.ok(errors.some(e=>e.key==='airway'&&e.group===1));
 assert.ok(errors.some(e=>e.key==='triage_decision'&&e.group===2));
 assert.ok(api.validate('CF-02',{assessment_type:'tidak sah'},false).some(e=>e.key==='assessment_type'));
 assert.ok(api.validate('CF-01',{triage_at:'bukan tanggal'},false).some(e=>e.key==='triage_at'));
 for(const [id,start,end] of [['CF-05','started_at','ended_at'],['CF-07','admitted_at','discharged_at'],['CF-10','start_at','end_at']]){
  assert.ok(api.validate(id,{[start]:'2026-11-10T12:00',[end]:'2026-11-10T11:00'},false).some(e=>e.key===end));
 }
 for(const id of ['CF-06','CF-13','unknown'])assert.ok(api.validate(id,{},false).length);
});
test('V16 covers key benchmark gap groups with source-derived fields',()=>{
  const m=Object.fromEntries(get().defs.map(x=>[x.id,x]));
  for(const code of ['CF-01','CF-02','CF-03','CF-04','CF-05','CF-06','CF-07','CF-08','CF-09','CF-10','CF-11','CF-12','CF-13'])assert.ok(m[code]);
  const keys=id=>m[id].groups.flatMap(g=>g[1].map(f=>f.split('|')[0]));
  for(const key of ['airway','breathing','circulation','gcs','exposure','triage_decision'])assert.ok(keys('CF-01').includes(key));
  for(const key of ['assessment_type','pressure_risk','revision'])assert.ok(keys('CF-02').includes(key));
  for(const key of ['etiology','indicator','intervention','patient_response'])assert.ok(keys('CF-03').includes(key));
  for(const key of ['alternatives','consent_reason','ended_at'])assert.ok(keys('CF-05').includes(key));
  for(const key of ['teach_back','decision','witness'])assert.ok(keys('CF-08').includes(key));
  for(const key of ['outside_provider','verification_state'])assert.ok(keys('CF-09').includes(key));
  for(const key of ['lot','qty','procedure_ref'])assert.ok(keys('CF-12').includes(key));
  assert.equal(m['CF-06'].gated,true,'PRMRJ is awaiting instrument SOP/cutoff');
  assert.equal(m['CF-13'].gated,true,'Partograph awaits profession/SOP validation');
});
test('V16 synthetic only: no backend calls and no clinical execution or release',()=>{
 const js=read('benchmark-clinical-v16.js');
 assert.ok(js.includes('data-work-item'));
 assert.ok(js.includes('encounterId'));
 assert.ok(js.includes('patientId'));
 assert.ok(js.includes('Draft (demo)'));
 assert.ok(js.includes('read-only')||js.includes('baca saja'));
 for(const disallowed of ['fetch(', 'XMLHttpRequest','sendBeacon','navigator.clipboard','/api/v1/','MedicationAdministration('])assert.ok(!js.includes(disallowed),'Unexpected action: '+disallowed);
 const d=get().defs;
 for(const x of d)for(const section of x.groups)assert.ok(section[1].every(f=>f.split('|').length>=3),x.id);
});
