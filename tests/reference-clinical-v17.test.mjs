import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { resolve } from "node:path";

const source=readFileSync(resolve("public/ui-preview/reference-clinical-v17.js"),"utf8");
function setup(){
  const listeners={};
  const jobs=[
    {id:"ENT-0101",title:"Dokter Demo A",scope:"Poliklinik",status:"Perlu ditinjau",reason:"Cek izin kerja",progress:null},
    {id:"ENT-0102",title:"Perawat Demo B",scope:"Rawat Inap",status:"Menunggu",reason:"Verifikasi jadwal",progress:{label:"Draft tersimpan"}},
  ];
  const original=()=>'<div class="uxv4 uxv5" data-uxv4-role="HR Admin" data-uxv4-section="home">'+
    '<section class="uxv5-summary"><div>2</div></section><div class="uxv5-layout"><table></table></div></div>';
  const window={SIMRSRoleUXV5:{renderPage:original,jobRows:()=>jobs}};
  const document={addEventListener(name,fn){listeners[name]=fn;}};
  runInNewContext(source,{window,document});
  return {window,listeners,jobs,original};
}
test("V17 renders card/table toggle with escaped job content",()=>{
  const {window,jobs}=setup();
  jobs[0].title='<img src=x onerror=alert(1)>';
  const html=window.SIMRSRoleUXV5.renderPage({role:"Dokter RJ",section:"home",selectedJob:0,username:"akun.dokter-rj"});
  assert.match(html,/data-v17-view="table"/);
  assert.match(html,/data-v17-view="grid"/);
  assert.match(html,/data-demo-action="job:0"/);
  assert.match(html,/&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.doesNotMatch(html,/<img src=x/);
  assert.doesNotMatch(html,/v17-staff-panel/);
});
test("V17 HR directory read-only is synthetic and confined to HR Admin home",()=>{
  const {window}=setup();
  const hr=window.SIMRSRoleUXV5.renderPage({role:"HR Admin",section:"home",selectedJob:0,username:"akun.hr-admin"});
  assert.match(hr,/v17-staff-panel/);
  assert.equal((hr.match(/class="v17-staff-card"/g)||[]).length,6);
  assert.match(hr,/hanya read-only|Direktori hanya read-only/);
  const detail=window.SIMRSRoleUXV5.renderPage({role:"HR Admin",section:"m0",selectedJob:0,username:"akun.hr-admin"});
  assert.doesNotMatch(detail,/v17-staff-panel/);
});
test("V17 does not alter the reviewer view or role authorization",()=>{
  const {window,original}=setup();
  assert.equal(window.SIMRSRoleUXV5.renderPage({role:"HR Admin",section:"home",username:"reviewer.demo"}),original());
  assert.match(source,/window\.SIMRSRoleUXV5|var worklists=window\.SIMRSRoleUXV5/);
  assert.doesNotMatch(source,/fetch\(|XMLHttpRequest|\/(api|fhir)\//);
});
test("V17 toggle stores per-role and per-section view preference",()=>{
  const {window,listeners}=setup();
  let mode="";
  const root={
    getAttribute(name){return {"data-uxv4-role":"Dokter RJ","data-uxv4-section":"home"}[name];},
    classList:{toggle(cls,isGrid){mode=isGrid?"grid":"table";}},
    querySelectorAll(){return [{getAttribute(){return "grid";},setAttribute(){}}];},
    querySelector(){return null;},
  };
  const button={getAttribute(){return "grid";},closest(){return root;}};
  listeners.click({target:{closest(selector){return selector==="[data-v17-view]"?button:null;}},preventDefault(){}});
  assert.equal(mode,"grid");
  assert.equal(window.SIMRSReferenceUIV17.modeFor("Dokter RJ","home"),"grid");
  assert.equal(window.SIMRSReferenceUIV17.modeFor("Perawat","home"),"table");
});
