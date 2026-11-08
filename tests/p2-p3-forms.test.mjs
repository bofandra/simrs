import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const read=(f)=>readFileSync(new URL("../public/ui-preview/"+f,import.meta.url),"utf8");
function boot(){
  const sandbox={window:{},document:{addEventListener(){}},localStorage:{getItem(){return null;},setItem(){},removeItem(){}},console};
  for(const f of ["p0-form-catalog.js","p1-form-definitions.js","p2-p3-form-definitions.js","demo-workflow-links.js","p0-forms.js"])
    runInNewContext(read(f),sandbox,{filename:f});
  return sandbox.window;
}
const w=boot(), all=w.SIMRS_FORM_CATALOG,engine=w.SIMRSFormEngine;
const p2p3=all.filter(m=>m.priority==="P2"||m.priority==="P3");
const get=code=>all.find(m=>m.code===code);
function values(m) {
  return Object.fromEntries(m.fields.map(f=>[f.key,
    f.type==="number"?String(Math.max(f.min??10,10)):
    f.type==="date"?"2026-11-08":f.type==="datetime-local"?"2026-11-08T10:00":
    f.type==="select"?f.options[0]:
    f.type==="email"?"synthetic@example.test":"DATA DEMO"
  ]));
}
test("all 68 modules have nonempty field specs",()=>{
  assert.equal(all.length,68);
  assert.equal(new Set(all.map(m=>m.code)).size,68);
  assert.equal(all.filter(m=>m.fields.length>0).length,68);
  assert.equal(all.filter(m=>m.priority==="P0").length,30);
  assert.equal(all.filter(m=>m.priority==="P1").length,17);
  assert.equal(all.filter(m=>m.priority==="P2").length,14);
  assert.equal(all.filter(m=>m.priority==="P3").length,7);
  assert.equal(p2p3.reduce((n,m)=>n+m.fields.length,0),158);
  assert.equal(all.reduce((n,m)=>n+m.fields.length,0),468);
});
test("P2/P3 forms keep PRD metadata and role mapping",()=>{
  for(const m of p2p3){
    assert.ok(m.fr.length>0,m.code);
    assert.equal(m.us,"US-"+m.code,m.code);
    assert.equal(m.ac_ids.length,6,m.code);
    assert.ok(m.entity.includes("."),m.code);
    assert.ok(m.roles.length>0,m.code);
    assert.ok(m.fields.length>=5,m.code);
    assert.equal(new Set(m.fields.map(f=>f.key)).size,m.fields.length,m.code);
    for(const f of m.fields.filter(f=>f.type==="select")) assert.ok(f.options.length>=2,m.code+":"+f.key);
  }
});
test("P2/P3 representative complete input passes demo review",()=>{
  for(const m of p2p3){
    const v=values(m);
    if(m.code==="MED-12")v.double_check="Diperiksa secara simulasi";
    const err=engine.validate(m,v,true);
    assert.equal(err.length,0,m.code+":"+JSON.stringify(err));
  }
});
test("P2/P3 missing required input blocked only on review",()=>{
  for(const m of p2p3){
    assert.ok(engine.validate(m,{},true).length>0,m.code);
    assert.equal(engine.validate(m,{},false).length,0,m.code);
  }
});
test("journal debit/credit balance check and payroll deductions",()=>{
  const journal=get("FIN-08"),a=values(journal);
  a.debit_total="9000";a.credit_total="8000";
  assert.ok(engine.validate(journal,a,true).some(e=>e.key==="credit_total"));
  const payroll=get("ENT-02"),b=values(payroll);
  b.gross_pay="5000";b.deduction="9000";
  assert.ok(engine.validate(payroll,b,true).some(e=>e.key==="deduction"));
});
test("blood administration identity review and transport time checks",()=>{
  const blood=get("MED-12"),a=values(blood);
  assert.ok(engine.validate(blood,a,true).some(e=>e.key==="double_check"));
  const trip=get("OPS-09"),b=values(trip);
  b.departure_at="2026-11-08T14:00";b.arrival_at="2026-11-08T11:00";
  assert.ok(engine.validate(trip,b,true).some(e=>e.key==="arrival_at"));
});
test("all module forms are renderable for their designated role",()=>{
  const html=engine.render({role:"Pendaftaran",patient:{id:"p1",name:"Pasien Demo",mrn:"RM-DEMO",visit:"ENC-DEMO"}});
  assert.ok(html.includes("68/68 modul memiliki form demo"));
  assert.ok(html.includes("Katalog 68 Modul"));
  assert.ok(html.includes("NONAKTIF") || html.includes("Sign / Approve / Release"));
  assert.ok(!html.includes("sudah terhubung ke backend"));
});
