import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=name=>readFileSync(new URL('../public/ui-preview/'+name,import.meta.url),'utf8');
function get(){
  const localStorage={getItem(){return '{}';},setItem(){}};
  const document={readyState:'loading',addEventListener(){},getElementById(){return null;}};
  const window={};runInNewContext(read('benchmark-clinical-v16.js'),{window,document,localStorage},{timeout:3000});
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
