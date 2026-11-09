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
function setup(data=patients){
 const store=new Map(),localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)};
 const ctx={window:{__SIMRS_PREVIEW__:{patients:data}},document:{addEventListener(){}},localStorage};
 for(const file of ["role-workspace-v4.js","p0-form-catalog.js","p1-form-definitions.js","p2-p3-form-definitions.js","role-worklist-detail-v5.js","role-worklists-v10.js","role-worklists-v11.js"]){
  runInNewContext(read(file),ctx,{timeout:3000});
 }
 return {ctx,api:ctx.window.SIMRSRoleUXV5,v11:ctx.window.SIMRSRoleUXV11};
}
test("V11 installs all remaining 25 worklists, 44 in total, with correct script loading order",()=>{
 const {ctx,api,v11}=setup();
 assert.equal(v11.roles.length,25);
 assert.equal(v11.invalid.length,0);
 assert.equal(new Set(v11.roles).size,25);
 assert.equal(Object.keys(api.specs).length,44);
 assert.deepEqual([...Object.keys(api.specs)].sort(),[...Object.keys(ctx.window.SIMRSRoleUXV4.profiles)].sort());
 const index=read("index.html");
 assert.ok(index.indexOf("role-worklist-detail-v5.js")<index.indexOf("role-worklists-v10.js"));
 assert.ok(index.indexOf("role-worklists-v10.js")<index.indexOf("role-worklists-v11.js"));
 assert.ok(index.indexOf("role-worklists-v11.js")<index.indexOf("role-demo-login.js"));
});
test("all V11 work areas have distinct context-specific work items, checks and PRD trace",()=>{
 const {ctx,api,v11}=setup(),profiles=ctx.window.SIMRSRoleUXV4;
 const catalog=ctx.window.SIMRS_FORM_CATALOG||[];
 for(const role of v11.roles){
  const profile=profiles.getProfile(role),spec=api.specs[role];
  assert.equal(spec.stages.length,profile.features.length,role);
  const ids=new Set();
  for(const f of profile.features){
   const rows=api.jobRows(role,f.key);
   assert.equal(rows.length,4,role+" "+f.key);
   for(const row of rows){
    assert.ok(row.title.includes(f.label),role+" "+f.key);
    assert.ok(row.reason.length>12,role);
    assert.equal(row.checks.length,3,role);
    assert.ok(!ids.has(row.id),role+" duplicate "+row.id);ids.add(row.id);
   }
   const can=code=>catalog.some(m=>m.code===code&&(m.roles||[]).includes(role));
   const page=api.renderPage({role,section:f.key,selectedJob:0,username:"akun.demo",canOpen:can});
   assert.ok(page.includes(f.code),role+" "+f.code);
   assert.ok(page.includes(f.fr),role+" "+f.fr);
   assert.ok(page.includes(f.wf),role+" "+f.wf);
   assert.match(page,/data-demo-action="job:1"/);
   if(can(f.code))assert.ok(page.includes('data-demo-action="module:'+f.code+'"'),role+" "+f.code);
   else{assert.ok(!page.includes('data-demo-action="module:'+f.code+'"'),role+" "+f.code);assert.match(page,/Belum diotorisasi bagi role ini/);}
  }
 }
});
test("patient context never leaks into object work; patient scoped roles fail closed without patients",()=>{
 const {api}=setup();
 for(const role of ["Petugas CSSD","Petugas Dapur","Petugas Laundry","Pengadaan","Akuntan","Payroll Admin","Manajemen RS"]){
  const selected=api.selectionContext(role,"m0",0,patients);
  assert.equal(selected.kind,"object",role);assert.equal(selected.patient,null,role);
 }
 for(const role of ["Ahli Gizi","Perawat HD","Coder","Petugas BPJS","Petugas Billing","Petugas Bank Darah"]){
  const selected=api.selectionContext(role,"m0",0,patients);
  assert.equal(selected.kind,"patient",role);assert.equal(selected.patient.id,"p1",role);
 }
 assert.equal(api.selectionContext("Koordinator Transport","m0",0,patients).kind,"patient");
 assert.equal(api.selectionContext("Koordinator Transport","m1",0,patients).kind,"object");
 assert.equal(api.selectionContext("Tim PPI","m0",0,patients).kind,"patient");
 assert.equal(api.selectionContext("Tim PPI","m1",0,patients).kind,"object");
 const blank=setup([]);
 assert.equal(blank.api.selectionContext("Ahli Gizi","m0",0,[]),null);
 assert.equal(blank.api.selectionContext("Koordinator Transport","m0",0,[]),null);
 assert.equal(blank.api.selectionContext("Petugas CSSD","m0",0,[]).patient,null);
});
test("patient portal stays bound to a single synthetic demo identity across sections",()=>{
 const {api}=setup();
 for(const section of ["m0","m1"])for(let i=0;i<4;i++){
  const selected=api.selectionContext("Pasien Demo",section,i,patients);
  assert.ok(selected,section+" "+i);
  assert.equal(selected.patient.id,"p1");
  assert.equal(selected.patient.visit,"ENC-DEMO-247");
 }
 assert.equal(api.selectionContext("Pasien Demo","m0",4,patients),null);
 assert.equal(setup([]).api.selectionContext("Pasien Demo","m0",0,[]),null);
});
test("V11 is demo-only and does not expand V10 role maps or backend transaction rights",()=>{
 const {api,v11}=setup();
 assert.equal(api.specs["DPJP Rawat Inap"].rows[0][0],"RI-DPJP-001");
 assert.equal(api.specs["Kasir"].rows[0][0],"INV-D081");
 for(const r of v11.roles)assert.ok(!["DPJP Rawat Inap","Kasir","Pendaftaran"].includes(r));
 assert.doesNotMatch(read("role-worklists-v11.js"),/fetch\s*\(|XMLHttpRequest|new WebSocket|navigator\.sendBeacon/);
 const denied=api.renderPage({role:"Petugas Bank Darah",section:"m0",selectedJob:0,username:"akun.petugas-bank-darah",canOpen:()=>false});
 assert.doesNotMatch(denied,/data-demo-action="module:MED-12"/);
});
