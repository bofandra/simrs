import assert from "node:assert/strict";
import {test} from "node:test";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const source=readFileSync(new URL("../public/ui-preview/role-workspace-v4.js",import.meta.url),"utf8");
const index=readFileSync(new URL("../public/ui-preview/index.html",import.meta.url),"utf8");
const rolesText=index.match(/const roles=(\[[^\n]+\]);/);
if(!rolesText)throw new Error("Expected inline list of 42 demo roles");
const roles=JSON.parse(rolesText[1].replace(/'/g,'"'));
const context={window:{}};
runInNewContext(source,context,{timeout:1500});
const api=context.window.SIMRSRoleUXV4;

test("42 login roles each have an intentional, unique role-specific menu",()=>{
 assert.equal(roles.length,42);
 assert.deepEqual([...Object.keys(api.profiles)].sort(),[...roles].sort());
 assert.equal(api.matrix().length,42);
 for(const role of roles){
  const profile=api.getProfile(role);
  assert.ok(profile?.unit,role);
  assert.ok(profile?.features?.length>=2,role);
  assert.equal(new Set(profile.features.map(x=>x.key)).size,profile.features.length,role);
  assert.equal(new Set(profile.features.map(x=>x.label)).size,profile.features.length,role);
  assert.match(api.navHtml(role,"home"),/AREA PEKERJAAN/);
  assert.match(api.navHtml(role,"home"),/data-demo-action="home"/);
  assert.doesNotMatch(api.navHtml(role,"home"),/data-demo-action="module:/);
  for(const feature of profile.features){
   assert.match(feature.code,/^(CORE|RME|MED|OPS|FIN|ENT)-\d\d$/);
   assert.match(feature.fr,/^FR-\d\d\d$|^FR lintas domain$/);
   assert.match(feature.wf,/^WF-(0[1-9]|1[012])$/);
  }
 }
 assert.equal(api.matrix().reduce((sum,r)=>sum+r.menus.length,0),143);
});

test("separation of duties: cashier cannot see claims, debt ledger or tariff admin",()=>{
 const text=api.navHtml("Kasir","home");
 assert.match(text,/Daftar tagihan/);
 assert.match(text,/Terima pembayaran/);
 for(const term of ["Klaim","Piutang","Bridging","Verifikasi tarif","Gudang","SOAP"]){
  assert.ok(!text.includes(term),term);
 }
 assert.deepEqual(Array.from(api.getProfile("Kasir").features.map(x=>x.code)),["FIN-02","FIN-03","FIN-03"]);
});

test("pharmacist sees prescription & dispensing, not inventory administration",()=>{
 const pharmacy=api.getProfile("Farmasis").features.map(x=>x.code);
 assert.ok(pharmacy.includes("MED-04"));
 assert.ok(pharmacy.includes("MED-05"));
 assert.ok(!pharmacy.includes("OPS-01"));
 const warehouse=api.getProfile("Gudang").features.map(x=>x.code);
 assert.ok(warehouse.includes("OPS-01"));
 assert.ok(!warehouse.includes("MED-05"));
});

test("clinical access: nurses do not see doctor prescribing, coders do not sign notes",()=>{
 const nurse=api.navHtml("Perawat","home");
 assert.doesNotMatch(nurse,/Resep elektronik|Diagnosis dan tindakan|Invoice|Penerbitan resep/);
 assert.ok(api.getProfile("Perawat").features.some(x=>x.code==="RME-07"));
 const coder=api.getProfile("Coder").features.map(x=>x.code);
 assert.ok(coder.every(x=>x==="FIN-06"));
 const doctor=api.getProfile("Dokter RJ").features.map(x=>x.code);
 assert.ok(doctor.includes("RME-08")&&doctor.includes("MED-04"));
 assert.ok(!doctor.some(x=>x.startsWith("FIN-")));
});

test("worklist displays traceability and respects deny-by-default form access",()=>{
 const context={role:"Petugas Laundry",username:"akun.petugas-laundry",section:"m0",canOpen:()=>false};
 const closed=api.renderPage(context);
 assert.match(closed,/Penerimaan linen/);
 assert.match(closed,/OPS-04/);
 assert.match(closed,/FR-023/);
 assert.match(closed,/WF-10/);
 assert.match(closed,/Form belum tersedia/);
 assert.doesNotMatch(closed,/data-demo-action="module:OPS-04"/);
 const opened=api.renderPage({...context,canOpen:(code)=>code==="OPS-04"});
 assert.match(opened,/data-demo-action="module:OPS-04"/);
 assert.match(opened,/data-uxv4-section="m0"/);
 assert.match(api.renderPage({...context,section:"home"}),/Area kerja yang tersedia/);
});
