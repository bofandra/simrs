import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { resolve } from "node:path";

const js=readFileSync(resolve("public/ui-preview/workflow-context-v19-v20.js"),"utf8");
const css=readFileSync(resolve("public/ui-preview/unified-workspaces-v18.css"),"utf8");
const html=readFileSync(resolve("public/ui-preview/index.html"),"utf8");
function setup(){
 const original=()=>'<div class="uxv4 uxv5"><header>Heading</header><section>Worklist</section></div>';
 let jobs=[{id:"ENC-D01",title:"Pasien Demo A",reason:"Review klinis",scope:"Poli demo"}];
 const window={
  __SIMRS_PREVIEW__:{patients:[{mrn:"RM-DEMO-001",visit:"ENC-DEMO-01"}]},
  SIMRSRoleUXV5:{
   renderPage:original,
   jobRows:()=>jobs,
   selectionContext:()=>({patient:{mrn:"RM-DEMO-001",visit:"ENC-DEMO-01"}})
  },
  SIMRSRoleUXV4:{getFeature:()=>({label:"Asesmen dan SOAP"})}
 };
 runInNewContext(js,{window});
 return {window,original,jobs};
}
test("V18–V20 assets are loaded after V17 and before body end",()=>{
 assert.ok(html.indexOf('reference-clinical-v17.css')<html.indexOf('unified-workspaces-v18.css'));
 assert.ok(html.indexOf('reference-clinical-v17.js')<html.indexOf('workflow-context-v19-v20.js'));
 assert.match(css,/--simrs-primary:/);
 assert.match(css,/@media\(max-width:700px\)/);
 assert.match(css, /focus-visible/);
});
test("V19 clinical dashboard shows selected demo work context and verification reminders",()=>{
 const {window}=setup();
 const page=window.SIMRSRoleUXV5.renderPage({role:"Dokter RJ",section:"m1",username:"akun.dokter-rj",selectedJob:0});
 assert.match(page,/data-v18-screen="S03"/);
 assert.match(page,/Asesmen dan SOAP/);
 assert.match(page,/RM-DEMO-001/);
 assert.match(page,/ENC-DEMO-01/);
 assert.match(page,/v18-safety-strip v18-clinical/);
 assert.match(page,/Periksa dua identitas/);
 assert.match(page,/Urutan ini adalah panduan desain, bukan status/);
 assert.match(page,/<details class="v18-workflow-details">/);
});
test("V20 operational cards provide grounded workflow guidance, not transaction actions",()=>{
 const {window}=setup();
 const cases=[["Farmasis","S08"],["Kasir","S09"],["Radiografer","S12"],["Bed Manager","S06"],["ATLM","S07"],["Pendaftaran","S02"],["Manajemen RS","S10"],["Admin Sistem","S11"],["Petugas MCU","S13"]];
 cases.forEach(([role,screen])=>{
  const page=window.SIMRSRoleUXV5.renderPage({role,section:"home",username:"akun.demo",selectedJob:0});
  assert.ok(page.includes('data-v18-screen="'+screen+'"'),role);
  assert.match(page,/Panduan UI/);
  assert.doesNotMatch(page,/data-v18-commit|data-v18-sign|data-v18-pay|fetch\(/);
 });
});
test("Reviewer and non-targeted roles retain original UI",()=>{
 const {window,original}=setup();
 const args=[
  {role:"Dokter RJ",section:"home",username:"reviewer.demo",selectedJob:0},
  {role:"Terapis Rehabilitasi",section:"home",username:"akun.terapis",selectedJob:0},
  {role:"Dokter RJ",section:"home",username:"",selectedJob:0}
 ];
 args.forEach(args=>assert.equal(window.SIMRSRoleUXV5.renderPage(args),original()));
});
test("Untrusted synthetic labels are escaped and do not become HTML",()=>{
 const {window,jobs}=setup();
 jobs[0].title='<img src=x onerror=alert(1)>';
 jobs[0].reason='<svg onload=alert(1)>';
 jobs[0].id='<admin>';
 const page=window.SIMRSRoleUXV5.renderPage({role:"Perawat",section:"m0",username:"akun.perawat",selectedJob:0});
 assert.match(page,/&lt;img src=x onerror=alert\(1\)&gt;/);
 assert.match(page,/&lt;svg onload=alert\(1\)&gt;/);
 assert.match(page,/&lt;admin&gt;/);
 assert.doesNotMatch(page,/<img src=x|<svg onload|<admin>/);
 assert.doesNotMatch(js,/fetch\(|XMLHttpRequest|\/(api|fhir)\//);
});
test("Flow specifications do not expose mutable stored step arrays",()=>{
 const {window}=setup();
 const one=window.SIMRSUnifiedUXV18.flowFor("Dokter RJ");
 one.steps.push("External action");
 const two=window.SIMRSUnifiedUXV18.flowFor("Dokter RJ");
 assert.ok(!two.steps.includes("External action"));
 assert.equal(window.SIMRSUnifiedUXV18.flowFor("Not existing"),null);
});
