import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const read = (path) => readFileSync(new URL("../public/ui-preview/" + path, import.meta.url), "utf8");
const dom = { addEventListener() {} };
const storage = {getItem(){return null;},setItem(){},removeItem(){}};
const sandbox = {window:{}, document:dom, localStorage:storage, console};
runInNewContext(read("p0-form-catalog.js"),sandbox,{filename:"p0-form-catalog.js"});
runInNewContext(read("p0-forms.js"),sandbox,{filename:"p0-forms.js"});
const all=sandbox.window.SIMRS_FORM_CATALOG;
const engine=sandbox.window.SIMRSFormEngine;
const p0=all.filter(m=>m.priority==="P0");
const get=code=>all.find(m=>m.code===code);

const valuesFor=m=>Object.fromEntries(m.fields.map(f=>[
  f.key,
  f.type==="number" ? String(Math.max(f.min ?? 10,10)) :
  f.type==="date" ? "2026-11-08" :
  f.type==="datetime-local" ? "2026-11-08T10:00" :
  f.type==="select" ? f.options[0] :
  f.type==="email" ? "petugas@example.test" :
  f.key==="nik_demo" ? "1234567890123456" : "Data Demo"
]));

test("all 68 modules mapped; all 30 P0 form definitions present",()=>{
  assert.equal(all.length,68);
  assert.equal(new Set(all.map(m=>m.code)).size,68);
  assert.equal(p0.length,30);
  assert.equal(p0.reduce((n,m)=>n+m.fields.length,0),185);
  assert.ok(p0.every(m=>m.fields.length>=5));
});
test("each P0 has traceability and six acceptance criteria identifiers",()=>{
  p0.forEach(m=>{
    assert.ok(m.fr.length>=1, m.code+" missing FR");
    assert.equal(m.us,"US-"+m.code);
    assert.equal(m.ac_ids.length,6);
    assert.ok(m.entity.includes("."),m.code+" missing database entity");
    assert.ok(m.roles.length>0,m.code+" missing allowed role");
    assert.equal(new Set(m.fields.map(f=>f.key)).size,m.fields.length,m.code+" duplicate field keys");
    m.fields.filter(f=>f.type==="select").forEach(f=>assert.ok(f.options.length>0,m.code+":"+f.key+" lacks options"));
  });
});
test("every complete P0 sample can reach review-stage validation",()=>{
  p0.forEach(m=>{
    const v=valuesFor(m);
    if(m.code==="MED-04")v.allergy_checked="Sudah ditinjau";
    if(m.code==="MED-05")v.identity_check="Sudah ditinjau";
    const errors=engine.validate(m,v,true);
    assert.equal(errors.length,0,m.code+": "+JSON.stringify(errors));
  });
});
test("required fields are blocked on review but allowed during draft",()=>{
  const m=get("RME-04");
  assert.ok(engine.validate(m,{},true).length>0);
  assert.equal(engine.validate(m,{},false).length,0);
});
test("16-digit synthetic ID format enforced",()=>{
  const m=get("CORE-08");const v=valuesFor(m);v.nik_demo="1234";
  assert.ok(engine.validate(m,v,true).some(e=>e.key==="nik_demo"));
});
test("validity period and appointment time ordering are enforced",()=>{
  const a=get("CORE-12"),v=valuesFor(a);
  v.valid_from="2026-12-10";v.valid_until="2026-12-01";
  assert.ok(engine.validate(a,v,true).some(e=>e.key==="valid_until"));
  const b=get("CORE-10"),w=valuesFor(b);
  w.start_at="2026-11-08T12:00";w.end_at="2026-11-08T10:00";
  assert.ok(engine.validate(b,w,true).some(e=>e.key==="end_at"));
});
test("medication allergy and dispensing patient-ID review gates",()=>{
  const rx=get("MED-04"),a=valuesFor(rx);
  assert.ok(engine.validate(rx,a,true).some(e=>e.key==="allergy_checked"));
  const disp=get("MED-05"),b=valuesFor(disp);
  assert.ok(engine.validate(disp,b,true).some(e=>e.key==="identity_check"));
});
test("invalid vital sign relationship and invoice discount are blocked",()=>{
  const triage=get("RME-02"),a=valuesFor(triage);
  a.systolic="80";a.diastolic="100";
  assert.ok(engine.validate(triage,a,true).some(e=>e.key==="diastolic"));
  const bill=get("FIN-02"),b=valuesFor(bill);
  b.subtotal="10000";b.discount="20000";
  assert.ok(engine.validate(bill,b,true).some(e=>e.key==="discount"));
});
test("HTML rendering escapes patient context and disables critical release",()=>{
  const html=engine.render({role:"Pendaftaran",patient:{id:"p1",name:'<script>alert("x")</script>',mrn:"RM-TEST",visit:"ENC-TEST"}});
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(!html.includes('<script>alert("x")</script>'));
  assert.ok(html.includes("disabled aria-disabled"));
  assert.ok(html.includes("DATA")||html.includes("No. RM")||html.includes("Katalog 68 Modul"));
});
test("viewer role cannot edit an unauthorized module",()=>{
  const html=engine.render({role:"ATLM",patient:{id:"p1",name:"Pasien Demo",mrn:"RM-DEMO",visit:"ENC-DEMO"}});
  assert.ok(html.includes("hanya dapat melihat"));
});
