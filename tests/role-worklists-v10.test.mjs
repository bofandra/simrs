import assert from "node:assert/strict";
import {test} from "node:test";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
const read=name=>readFileSync(new URL("../public/ui-preview/"+name,import.meta.url),"utf8");
const patients=[
 {id:"p1",name:"Sari Amelia",visit:"ENC-DEMO-247",mrn:"RM-DEMO-1",unit:"Poli Umum",payer:"BPJS"},
 {id:"p2",name:"Bima Rahman",visit:"ENC-DEMO-248",mrn:"RM-DEMO-2",unit:"Poli Jantung",payer:"Umum"},
 {id:"p3",name:"Nadia Laras",visit:"ENC-DEMO-249",mrn:"RM-DEMO-3",unit:"IGD",payer:"Asuransi"},
 {id:"p4",name:"Kirana Raka",visit:"ENC-DEMO-251",mrn:"RM-DEMO-4",unit:"Poli Bedah",payer:"BPJS"}
];
function setup(){
 const store=new Map();
 const localStorage={getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value),removeItem:key=>store.delete(key)};
 const ctx={window:{__SIMRS_PREVIEW__:{patients}},document:{addEventListener(){}},localStorage};
 for(const f of ["role-workspace-v4.js","p0-form-catalog.js","p1-form-definitions.js","p2-p3-form-definitions.js","role-worklist-detail-v5.js","role-worklists-v10.js"])
  runInNewContext(read(f),ctx,{timeout:3000});
 return {ctx,api:ctx.window.SIMRSRoleUXV5,extended:ctx.window.SIMRSRoleUXV10,localStorage};
}
const roles=["DPJP Rawat Inap","ATLM","Petugas MCU","Radiografer","Radiolog","Casemix","Koordinator OK","Dokter Anestesi","Tim Mutu","Admin Sistem","Integrasi","Gudang"];
test("V10 adds 12 specific worklists to V5, preserves 44 accounts and correct loading order",()=>{
 const {ctx,api,extended}=setup();
 assert.deepEqual([...extended.roles].sort(),roles.slice().sort());
 assert.equal(Object.keys(api.specs).length,19);
 const html=read("index.html");
 assert.ok(html.indexOf("role-worklist-detail-v5.js")<html.indexOf("role-worklists-v10.js"));
 assert.ok(html.indexOf("role-worklists-v10.js")<html.indexOf("role-demo-login.js"));
 assert.match(html,/role-worklists-v10\.css/);
 assert.doesNotMatch(read("role-demo-login.js"),/"ATLM":"lab"/);
 assert.doesNotMatch(read("role-demo-login.js"),/"Petugas MCU":"lab"/);
 assert.equal(ctx.window.SIMRSRoleUXV4.matrix().length,44);
});
test("12 roles show distinct worklist rows for all mapped features and deny ungranted forms",()=>{
 const {ctx,api}=setup(),catalog=ctx.window.SIMRS_FORM_CATALOG;
 for(const role of roles){
  const profile=ctx.window.SIMRSRoleUXV4.getProfile(role),spec=api.specs[role];
  assert.equal(spec.stages.length,profile.features.length,role);
  for(const f of profile.features){
   const rows=api.jobRows(role,f.key);
   assert.equal(rows.length,4,role+" "+f.key);
   assert.equal(new Set(rows.map(r=>r.id)).size,4,role);
   assert.ok(rows.every(r=>r.checks.length>=3),role);
   const can=code=>catalog.some(m=>m.code===code&&(m.roles||[]).includes(role));
   const html=api.renderPage({role,section:f.key,selectedJob:0,username:"akun.demo",canOpen:can});
   assert.match(html,/Akses form/);
   assert.match(html,/data-demo-action="job:1"/);
   assert.ok(html.includes(f.code),role+" "+f.code);
   if(can(f.code))assert.ok(html.includes('data-demo-action="module:'+f.code+'"'),role);
   else{assert.ok(!html.includes('data-demo-action="module:'+f.code+'"'),role);assert.match(html,/Belum diotorisasi bagi role ini/);}
  }
 }
});
test("RI and lab patients use scoped encounters; nonpatient objects never invent patient links",()=>{
 const {api}=setup();
 const dpjp=api.selectionContext("DPJP Rawat Inap","m1",1,patients);
 assert.equal(dpjp.kind,"patient");assert.equal(dpjp.patient.id,"p2");assert.equal(dpjp.patient.visit,"ENC-RI-DEMO-02");
 const lab=api.selectionContext("ATLM","m1",2,patients);
 assert.equal(lab.kind,"patient");assert.equal(lab.patient.visit,"ENC-DEMO-249");
 const admin=api.selectionContext("Admin Sistem","m0",0,patients);
 assert.equal(admin.kind,"object");assert.equal(admin.patient,null);
 const consent=api.selectionContext("Admin Sistem","m5",0,patients);
 assert.equal(consent.kind,"patient");assert.equal(consent.patient.id,"p1");
 for(const role of ["Radiolog","Radiografer","Casemix","Petugas MCU","Koordinator OK","Dokter Anestesi"]){
  const selected=api.selectionContext(role,"m0",0,patients);
  assert.equal(selected.kind,"patient",role);assert.equal(selected.patient.id,"p1",role);
 }
 const incident=api.selectionContext("Tim Mutu","m1",0,patients);
 assert.equal(incident.kind,"patient");assert.equal(incident.patient.id,"p1");
 for(const role of ["Tim Mutu","Gudang","Integrasi"]){
  const selected=api.selectionContext(role,"m0",0,patients);
  assert.equal(selected.kind,"object",role);assert.equal(selected.patient,null,role);
 }
});
test("form engine allows scoped admin object but rejects object for patient-context consent",()=>{
 const {ctx,api}=setup();
 runInNewContext(read("p0-forms.js"),ctx,{timeout:3000});
 const e=ctx.window.SIMRSFormEngine;
 assert.equal(e.openForRole("CORE-02","Admin Sistem",api.selectionContext("Admin Sistem","m0",0,patients)),true);
 assert.equal(e.openForRole("CORE-12","Admin Sistem",api.selectionContext("Admin Sistem","m0",0,patients)),false);
 assert.equal(e.openForRole("MED-02","Radiolog",api.selectionContext("Radiolog","m0",0,patients)),true);
 assert.equal(e.openForRole("MED-10","Petugas MCU",api.selectionContext("Petugas MCU","m0",0,patients)),true);
 assert.equal(e.openForRole("CORE-12","Admin Sistem",api.selectionContext("Admin Sistem","m5",0,patients)),true);
});
test("patient selection fails closed if synthetic patients are absent",()=>{
 const {api}=setup();
 assert.equal(api.selectionContext("DPJP Rawat Inap","m1",0,[]),null);
 assert.equal(api.selectionContext("Radiolog","m0",0,[]),null);
 assert.equal(api.selectionContext("Gudang","m0",0,[]).patient,null);
});
