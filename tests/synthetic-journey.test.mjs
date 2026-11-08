import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const read=f=>readFileSync(new URL("../public/ui-preview/"+f,import.meta.url),"utf8");
const box={window:{},document:{addEventListener(){}},localStorage:{getItem(){return null;},setItem(){},removeItem(){}},console};
for(const file of ["p0-form-catalog.js","p1-form-definitions.js","p2-p3-form-definitions.js","contract-audit.js","synthetic-journey.js","p0-forms.js"])
  runInNewContext(read(file),box,{filename:file});
const catalog=box.window.SIMRS_FORM_CATALOG;
const engine=box.window.SIMRSFormEngine;
const make=box.window.SIMRSSyntheticJourney.make;
const audit=box.window.SIMRS_CONTRACT_AUDIT;

test("12 audited modules have grounded OpenAPI and DB metadata",()=>{
  assert.equal(Object.keys(audit).length,12);
  for(const [code,a] of Object.entries(audit)){
    assert.ok(catalog.find(m=>m.code===code),code+" absent");
    assert.ok(a.path.startsWith("/api/v1/"),code);
    assert.ok(a.schema.endsWith("Create"),code);
    assert.ok(a.op,code);
    assert.ok(a.required.length>0,code);
    assert.ok(a.columns.length>0,code);
    assert.ok(a.gaps.length>0,code);
    for(const f of a.required)assert.ok(a.fields[f],code+" missing required API crosswalk for "+f);
  }
  assert.ok(audit["FIN-02"].gaps.some(x=>x.includes("charge_ids")));
  assert.ok(audit["RME-08"].gaps.some(x=>x.includes("item-level CPOE")));
});
test("synthetic outpatient scenario creates ten draft records for one encounter",()=>{
  const patient={id:"p1",visit:"ENC-DEMO-247"},tag="TEST-RJ-p1-247";
  const items=make(patient,"2026-11-08T10:00:00.000Z",tag);
  assert.equal(items.length,10);
  assert.equal(new Set(items.map(x=>x.code)).size,10);
  assert.equal(new Set(items.map(x=>x.record.id)).size,10);
  for(const x of items){
    assert.equal(x.record.status,"Draft");
    assert.equal(x.record.patient_id,"p1");
    assert.equal(x.record.encounter_id,"ENC-DEMO-247");
    assert.equal(x.record.scenario_tag,tag);
    assert.equal(engine.validate(catalog.find(m=>m.code===x.code),x.record.values,false).length,0,x.code);
    assert.ok(!Object.hasOwn(x.record,"signed_at"));
    assert.ok(!Object.hasOwn(x.record,"approved_at"));
  }
  const by=new Map(items.map(x=>[x.code,x.record]));
  assert.equal(by.get("FIN-01").values.source_order,by.get("RME-08").id);
  assert.equal(by.get("FIN-03").values.invoice_ref,by.get("FIN-02").id);
  assert.equal(by.get("FIN-02").linked_source.record_id,by.get("FIN-01").id);
  assert.equal(by.get("MED-01").linked_source.record_id,by.get("RME-08").id);
  assert.equal(by.get("FIN-02").values.subtotal,"85000");
  assert.equal(by.get("FIN-01").values.quantity,"1");
  assert.equal(by.get("FIN-01").values.unit_price,"85000");
});
test("generated sample requires allergy review and cannot imply signed clinical status",()=>{
  const items=make({id:"p2",visit:"ENC-DEMO-248"});
  const rx=items.find(x=>x.code==="MED-04").record;
  assert.equal(rx.values.allergy_checked,"Belum ditinjau");
  assert.ok(engine.validate(catalog.find(m=>m.code==="MED-04"),rx.values,true).some(x=>x.key==="allergy_checked"));
});
test("synthetic sample IDs and references stay isolated for different patients",()=>{
  const a=make({id:"p1",visit:"ENC-101"});
  const b=make({id:"p2",visit:"ENC-202"});
  assert.notEqual(a[0].record.id,b[0].record.id);
  assert.ok(a.every(x=>x.record.encounter_id==="ENC-101"));
  assert.ok(b.every(x=>x.record.encounter_id==="ENC-202"));
});
test("form preview loads audit and scenario assets before engine",()=>{
  const html=read("index.html");
  const assets=["p0-form-catalog.js","p1-form-definitions.js","p2-p3-form-definitions.js","demo-workflow-links.js","contract-audit.js","synthetic-journey.js","p0-forms.js"];
  const positions=assets.map(a=>html.indexOf('<script src="./'+a+'"></script>'));
  assert.ok(positions.every(x=>x>=0),JSON.stringify(positions));
  for(let i=1;i<positions.length;i++)assert.ok(positions[i]>positions[i-1]);
});
