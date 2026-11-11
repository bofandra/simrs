import assert from "node:assert/strict";
import {test} from "node:test";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const read=name=>readFileSync(new URL("../public/ui-preview/"+name,import.meta.url),"utf8");
const source=read("longtail-workspaces-v37.js"),styles=read("longtail-workspaces-v37.css"),html=read("index.html");
const expected=[
 "DPJP Rawat Inap","Petugas Bank Darah","Gudang","Pengadaan","Petugas Aset","Teknisi",
 "Petugas Fasilitas","Koordinator Transport","Petugas BPJS","Coder","Akuntan",
 "Budget Owner","Analis Biaya","Payroll Admin","Rekruter","Tim PPI"
];
function setup(){
 const patients=[
  {id:"p1",name:"Sari Amelia",visit:"ENC-DEMO-247",mrn:"RM-DEMO-1",unit:"Poli Umum"},
  {id:"p2",name:"Bima Rahman",visit:"ENC-DEMO-248",mrn:"RM-DEMO-2",unit:"Poli Jantung"},
  {id:"p3",name:"Nadia Laras",visit:"ENC-DEMO-249",mrn:"RM-DEMO-3",unit:"IGD"},
  {id:"p4",name:"Kirana Raka",visit:"ENC-DEMO-251",mrn:"RM-DEMO-4",unit:"Poli Bedah"}
 ];
 const store=new Map(),localStorage={
  getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)
 };
 const win={__SIMRS_PREVIEW__:{patients,state:{active:"forms"},render(){}},
  SIMRSRoleDemo:{getAccount(){return null;}}};
 const ctx={window:win,document:{addEventListener(){},querySelector(){return null;}},localStorage,Number};
 for(const file of [
  "role-workspace-v4.js","p0-form-catalog.js","p1-form-definitions.js","p2-p3-form-definitions.js",
  "role-worklist-detail-v5.js","role-worklists-v10.js","role-worklists-v11.js","longtail-workspaces-v37.js"
 ])runInNewContext(read(file),ctx,{timeout:3000});
 return {win,patients};
}
test("V37 ships after earlier role layers, preserves responsive, focus and reduced motion",()=>{
 assert.ok(html.indexOf("advanced-workspaces-v34.js")<html.indexOf("longtail-workspaces-v37.js"));
 assert.ok(html.indexOf("advanced-workspaces-v34.css")<html.indexOf("longtail-workspaces-v37.css"));
 assert.ok(html.indexOf("role-worklists-v11.js")<html.indexOf("longtail-workspaces-v37.js"));
 assert.match(styles,/@media\(max-width:700px\)/);
 assert.match(styles,/focus-visible/);
 assert.match(styles,/min-height:44px/);
 assert.match(styles,/prefers-reduced-motion/);
});
test("V37 covers all 16 remaining distinct roles, total 44 unique demo staff roles",()=>{
 const {win}=setup();
 const actual=Array.from(win.SIMRSLongTailUXV37.roles,entry=>entry.role);
 assert.equal(actual.length,16);
 assert.deepEqual(actual.sort(),expected.slice().sort());
 const v37=new Set(actual);
 const f1=["Pendaftaran","Dokter RJ","Perawat","Dokter IGD"];
 const f2=["Bed Manager","ATLM","Farmasis","Radiografer","Radiolog"];
 const f3=["Kasir","Petugas Billing","Casemix","Manajemen RS","Tim Mutu","Integrasi","Admin Sistem","HR Admin","Petugas MCU","Koordinator MCU"];
 const f4=["Koordinator OK","Dokter Anestesi","Perawat HD","Terapis Rehabilitasi","Ahli Gizi","Petugas Dapur","Petugas CSSD","Petugas Laundry","Pasien Demo"];
 const whole=[...f1,...f2,...f3,...f4,...v37];
 assert.equal(whole.length,44);
 assert.equal(new Set(whole).size,44);
 assert.deepEqual(whole.slice().sort(),Object.keys(win.SIMRSRoleUXV4.profiles).sort());
 for(const role of actual){
  const p=win.SIMRSRoleUXV4.getProfile(role);
  assert.ok(p&&p.features.length>0,role);
  for(const f of p.features){
   assert.match(f.code,/^[A-Z]+-\d+$/);
   assert.match(f.wf,/^WF-\d+$/);
   assert.ok(f.fr,role+" FR missing");
  }
 }
});
test("V37 worklist context remains patient-scoped or object-scoped per section",()=>{
 const {win,patients}=setup(),api=win.SIMRSRoleUXV5;
 for(const role of ["DPJP Rawat Inap","Petugas Bank Darah","Petugas BPJS","Coder"]){
  const c=api.selectionContext(role,"m0",0,patients);
  assert.equal(c.kind,"patient",role);assert.equal(c.patient.id,"p1");
 }
 for(const role of ["Gudang","Pengadaan","Petugas Aset","Teknisi","Petugas Fasilitas",
  "Akuntan","Budget Owner","Analis Biaya","Payroll Admin","Rekruter"]){
  const c=api.selectionContext(role,"m0",0,patients);
  assert.equal(c.kind,"object",role);assert.equal(c.patient,null,role);
 }
 const transportPatient=api.selectionContext("Koordinator Transport","m0",0,patients);
 const transportObject=api.selectionContext("Koordinator Transport","m1",0,patients);
 assert.equal(transportPatient.kind,"patient");assert.equal(transportObject.kind,"object");
 const ppiPatient=api.selectionContext("Tim PPI","m0",0,patients);
 const ppiObject=api.selectionContext("Tim PPI","m1",0,patients);
 assert.equal(ppiPatient.kind,"patient");assert.equal(ppiObject.kind,"object");
 assert.equal(transportObject.patient,null);assert.equal(ppiObject.patient,null);
 assert.equal(api.selectionContext("Petugas Bank Darah","m0",0,[]),null);
});
test("V38 has explicit draft-only, denied and missing context states without permissions or remote actions",()=>{
 assert.match(source,/data-v37-state/);
 assert.match(source,/missing-context/);
 assert.match(source,/state==="denied"/);
 assert.match(source,/\.disabled=true/);
 assert.match(source,/\.setAttribute\("aria-disabled","true"\)/);
 assert.match(source,/\.selectionContext\(role,section,index,shell\.patients\)/);
 assert.match(source,/\.jobRows\(role,section\)/);
 assert.match(source,/data-v37-action/);
 assert.match(source,/v37-zero/);
 assert.match(source,/data-v12-filter="Semua"/);
 assert.match(source,/account\.reviewer/);
 assert.doesNotMatch(source,/\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|\.patients\.push\(|\.allowModule\s*=/);
});
