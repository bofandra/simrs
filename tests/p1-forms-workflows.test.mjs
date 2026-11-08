import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const read=(p)=>readFileSync(new URL("../public/ui-preview/"+p, import.meta.url),"utf8");
function init(recordStore={}){
  const store={
    getItem(k){return k==="simrs-demo-p0-forms-v1"?JSON.stringify({version:1,seq:3,records:recordStore}):null;},
    setItem(){},removeItem(){}
  };
  const sandbox={window:{},document:{addEventListener(){}},localStorage:store,console};
  for(const f of ["p0-form-catalog.js","p1-form-definitions.js","demo-workflow-links.js","p0-forms.js"]){
    runInNewContext(read(f),sandbox,{filename:f});
  }
  return {all:sandbox.window.SIMRS_FORM_CATALOG,engine:sandbox.window.SIMRSFormEngine,links:sandbox.window.SIMRSDemoLinks};
}
const {all,engine,links}=init();
const p1=all.filter(x=>x.priority==="P1");
const get=code=>all.find(x=>x.code===code);
function sample(m){
  return Object.fromEntries(m.fields.map(f=>[
    f.key,f.type==="number"?String(Math.max(f.min??10,10)):
    f.type==="date"?"2026-11-08":
    f.type==="datetime-local"?"2026-11-08T10:00":
    f.type==="select"?f.options[0]:
    f.type==="email"?"review@example.test":"DATA DEMO"
  ]));
}
test("P1: 17 modules and 125 fields; total 47 interactive modules",()=>{
  assert.equal(all.length,68);
  assert.equal(all.filter(x=>x.fields.length>0).length,47);
  assert.equal(p1.length,17);
  assert.equal(p1.reduce((n,m)=>n+m.fields.length,0),125);
});
test("P1: every form has FR, US, AC-01..06, role, entity and unique fields",()=>{
  for(const m of p1){
    assert.ok(m.fr.length>0,m.code);
    assert.equal(m.us,"US-"+m.code);
    assert.equal(m.ac_ids.length,6,m.code);
    assert.ok(m.entity.includes("."),m.code);
    assert.ok(m.roles.length>0,m.code);
    assert.equal(new Set(m.fields.map(x=>x.key)).size,m.fields.length,m.code);
    for(const f of m.fields.filter(x=>x.type==="select"))assert.ok(f.options.length>0,m.code+" "+f.key);
  }
});
test("P1: complete synthetic samples pass review after expected safety checks",()=>{
  for(const m of p1){
    const values=sample(m);
    if(m.code==="MED-11")values.allergy_diet_review="Sudah ditinjau";
    if(m.code==="FIN-06")values.clinical_documents_state="Lengkap untuk simulasi";
    if(m.code==="FIN-07")values.dossier_check="Lengkap untuk simulasi";
    const failures=engine.validate(m,values,true);
    assert.equal(failures.length,0,m.code+": "+JSON.stringify(failures));
  }
});
test("P1: required fields block review, draft allows partial data",()=>{
  for(const m of p1){
    assert.ok(engine.validate(m,{},true).length>0,m.code);
    assert.equal(engine.validate(m,{},false).length,0,m.code);
  }
});
test("P1: dates and nutrition/claims review gates",()=>{
  const cases=[
    ["MED-06","scheduled_start","scheduled_end"],
    ["OPS-03","cycle_started","cycle_finished"],
    ["ENT-08","period_start","period_end"],
    ["ENT-09","period_start","period_end"]
  ];
  for(const [code,a,b] of cases){
    const v=sample(get(code));v[a]="2026-12-10";v[b]="2026-11-08";
    assert.ok(engine.validate(get(code),v,true).some(e=>e.key===b),code);
  }
  const nutr=sample(get("MED-11"));
  assert.ok(engine.validate(get("MED-11"),nutr,true).some(e=>e.key==="allergy_diet_review"));
  const claims=sample(get("FIN-07"));
  assert.ok(engine.validate(get("FIN-07"),claims,true).some(e=>e.key==="dossier_check"));
});
test("Linked demo: only relevant source order type may branch to LIS or RIS",()=>{
  const lab=links.edgesFrom("RME-08",{order_type:"Laboratorium"});
  assert.ok(lab.some(x=>x.to==="MED-01"));
  assert.ok(!lab.some(x=>x.to==="MED-02"));
  const rad=links.edgesFrom("RME-08",{order_type:"Radiologi"});
  assert.ok(rad.some(x=>x.to==="MED-02"));
  assert.ok(!rad.some(x=>x.to==="MED-01"));
});
test("Linked demo: draft prefill carries source IDs, but never a signed/settled status",()=>{
  const med=get("MED-04"),disp=get("MED-05");
  const copied=links.suggest(med,{id:"DEMO-RX-3",values:{medication_code:"PARA-500 — Parasetamol 500 mg"}},disp);
  assert.equal(copied.prescription_ref,"DEMO-RX-3");
  assert.equal(copied.medication_code,"PARA-500 — Parasetamol 500 mg");
  assert.equal(Object.hasOwn(copied,"status"),false);
  const charge=get("FIN-01"),invoice=get("FIN-02");
  const amount=links.suggest(charge,{id:"DEMO-CHG-2",values:{quantity:"2",unit_price:"50000"}},invoice);
  assert.equal(amount.subtotal,"100000");
  assert.equal(amount.invoice_no,"INV-DEMO-DEMO-CHG-2");
});
test("Patient and encounter data do not leak into another demo visit",()=>{
  const rec=(id,patient,encounter)=>({id,status:"Reviewed (Demo)",patient_id:patient,encounter_id:encounter,updated_at:"2026-11-08T00:00:00Z",values:{visit_type:"Rawat Jalan"}});
  const {engine:isolated}=init({"CORE-09":[rec("RECORD-ONE","p1","ENC-ONE"),rec("RECORD-TWO","p2","ENC-ONE"),rec("RECORD-OTHER-EPISODE","p1","ENC-TWO")]});
  const html=isolated.render({role:"Pendaftaran",patient:{id:"p1",name:"Pasien Satu",mrn:"RM-1",visit:"ENC-ONE"}});
  assert.ok(html.includes("RECORD-ONE"));
  assert.ok(!html.includes("RECORD-TWO"));
  assert.ok(!html.includes("RECORD-OTHER-EPISODE"));
});
test("Demo linked source is listed only if reviewed",()=>{
  const make=(id,status)=>({id,status,patient_id:"p1",encounter_id:"E1",updated_at:"2026-11-08T00:00:00Z",values:{visit_type:"Rawat Jalan"}});
  const {engine:onlyReviewed}=init({"CORE-09":[make("DEMO-REVIEWED","Reviewed (Demo)"),make("DEMO-DRAFT","Draft")]});
  const html=onlyReviewed.render({role:"Pendaftaran",patient:{id:"p1",name:"P1",mrn:"RM1",visit:"E1"}});
  assert.ok(html.includes('data-source="DEMO-REVIEWED"'));
  assert.ok(!html.includes('data-source="DEMO-DRAFT"'));
});
