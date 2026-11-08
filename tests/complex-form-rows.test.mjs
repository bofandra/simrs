import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const read = filename => readFileSync(new URL("../public/ui-preview/" + filename, import.meta.url), "utf8");
const sandbox = {
  window: {},
  document: { addEventListener() {} },
  localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  console
};
for (const filename of ["p0-form-catalog.js", "complex-form-rows.js", "p0-forms.js"]) {
  runInNewContext(read(filename), sandbox, {filename});
}
const catalog = sandbox.window.SIMRS_FORM_CATALOG;
const lines = sandbox.window.SIMRSLineItems;
const engine = sandbox.window.SIMRSFormEngine;
const moduleFor = code => catalog.find(m => m.code === code);

const cpoe = {
  order_type:"Laboratorium", service_code:"CBC — Darah lengkap", priority:"Rutin",
  ordered_at:"2026-11-08T09:15", indication:"Sampel sintetis", orderer:"Dokter Demo",
  items:[
    {service_code:"CBC — Darah lengkap",quantity:"1",clinical_question:"Cek darah"},
    {service_code:"GLU — Glukosa",quantity:"2",clinical_question:"Cek glukosa"}
  ]
};
const prescription = {
  medication_code:"PARA-500 — Parasetamol 500 mg", dose:"500 mg", route:"Oral",
  frequency:"3 kali sehari", quantity:"10", allergy_checked:"Sudah ditinjau",
  prescriber:"Dokter Demo",
  items:[
    {medication_code:"PARA-500 — Parasetamol 500 mg",dose:"500 mg",route:"Oral",frequency:"3 kali sehari",quantity:"10"},
    {medication_code:"OMEP-20 — Omeprazol 20 mg",dose:"20 mg",route:"Oral",frequency:"1 kali sehari",quantity:"5"}
  ]
};
test("CPOE and e-Resep support multiple item-level entries, not other modules", () => {
  assert.equal(lines.supported("RME-08"),true);
  assert.equal(lines.supported("MED-04"),true);
  assert.equal(lines.supported("FIN-02"),false);
  assert.equal(lines.skipFields("RME-08").includes("service_code"),true);
  assert.equal(lines.itemsFrom("MED-04",{medication_code:"PARA-500 — Parasetamol 500 mg",dose:"500 mg"})[0].dose,"500 mg");
});
test("complete multi-line CPOE and e-Resep pass review validation", () => {
  assert.equal(engine.validate(moduleFor("RME-08"),cpoe,true).length,0);
  assert.equal(engine.validate(moduleFor("MED-04"),prescription,true).length,0);
});
test("CPOE checks missing item, order type, quantity and duplicates", () => {
  const code="RME-08", m=moduleFor(code);
  const v=Object.assign({},cpoe,{items:[]});
  assert.ok(engine.validate(m,v,true).some(e=>e.key==="line-add"));
  const badQty=Object.assign({},cpoe,{items:[{service_code:"CBC — Darah lengkap",quantity:"0"}]});
  assert.ok(engine.validate(m,badQty,true).some(e=>e.key==="line-0-quantity"));
  const typeMismatch=Object.assign({},cpoe,{order_type:"Radiologi"});
  assert.ok(engine.validate(m,typeMismatch,true).some(e=>e.message.includes("Jenis pemeriksaan")));
  const repeated=Object.assign({},cpoe,{items:[cpoe.items[0],cpoe.items[0]]});
  assert.ok(engine.validate(m,repeated,true).some(e=>e.message.includes("sama sudah tercantum")));
});
test("e-Resep checks required line fields, duplication and allergy review", () => {
  const m=moduleFor("MED-04");
  const absentDose=Object.assign({},prescription,{items:[{medication_code:prescription.medication_code,route:"Oral",quantity:"2"}]});
  assert.ok(engine.validate(m,absentDose,true).some(e=>e.key==="line-0-dose"));
  const repeated=Object.assign({},prescription,{items:[prescription.items[0],prescription.items[0]]});
  assert.ok(engine.validate(m,repeated,true).some(e=>e.message.includes("sama sudah tercantum")));
  const allergy=Object.assign({},prescription,{allergy_checked:"Belum ditinjau"});
  assert.ok(engine.validate(m,allergy,true).some(e=>e.key==="allergy_checked"));
});
test("draft accepts empty item fields but rejects invalid non-empty quantity", () => {
  assert.equal(lines.validate("RME-08",{items:[{}]},false).length,0);
  assert.ok(lines.validate("RME-08",{items:[{quantity:"-2"}]},false).some(e=>e.key==="line-0-quantity"));
});
test("item HTML escapes unsafe text and review-only forms disable item editing", () => {
  const html=lines.render("RME-08",{items:[{service_code:"CBC — Darah lengkap",clinical_question:'<img src=x onerror="alert(1)">' }]},false);
  assert.ok(html.includes("&lt;img"));
  assert.ok(!html.includes("<img src=x"));
  assert.ok(html.includes(" disabled"));
  assert.ok(!html.includes('data-line-action="add"'));
});
