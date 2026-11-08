import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const read=name=>readFileSync(new URL("../public/ui-preview/"+name,import.meta.url),"utf8");
const sandbox={window:{},document:{addEventListener(){}},localStorage:{getItem(){return null;},setItem(){},removeItem(){}},console};
for(const f of ["p0-form-catalog.js","p1-form-definitions.js","p2-p3-form-definitions.js",
  "synthetic-journey.js","master-lookups.js","p0-forms.js"])
  runInNewContext(read(f),sandbox,{filename:f});
const journeys=sandbox.window.SIMRSSyntheticJourney;
const catalog=sandbox.window.SIMRS_FORM_CATALOG;
const engine=sandbox.window.SIMRSFormEngine;
const patient={id:"p1",name:"Pasien Demo",mrn:"RM-DEMO",visit:"ENC-DEMO-247"};
const get=code=>catalog.find(x=>x.code===code);

test("RJ, IGD, RI have distinct guided track definitions and stable module routes",()=>{
  assert.deepEqual(Object.keys(journeys.flows).sort(),["IGD","RI","RJ"]);
  assert.equal(journeys.flows.RJ.steps.length,10);
  assert.equal(journeys.flows.IGD.steps.length,7);
  assert.equal(journeys.flows.RI.steps.length,9);
  for(const track of Object.values(journeys.flows)){
    assert.equal(new Set(track.steps).size,track.steps.length);
    for(const code of track.steps)assert.ok(get(code),code);
  }
  const source=journeys.makeFor("RJ",patient);
  assert.equal(source.length,10);
  assert.equal(source[0].record.id,journeys.make(patient)[0].record.id);
});

test("all track-generated records are Draft, synthetic, safe and patient/encounter-isolated",()=>{
  for(const flow of ["IGD","RI"]){
    const tag=flow+"-DEMO-"+patient.id+"-"+patient.visit;
    const records=journeys.makeFor(flow,patient,"2026-11-08T08:00:00.000Z",tag);
    assert.equal(records.length,journeys.flows[flow].steps.length);
    assert.equal(new Set(records.map(x=>x.code)).size,records.length);
    for(const row of records){
      assert.equal(row.record.status,"Draft");
      assert.equal(row.record.patient_id,patient.id);
      assert.equal(row.record.encounter_id,patient.visit);
      assert.equal(row.record.scenario_tag,tag);
      assert.ok(!("signed_at" in row.record));
      assert.ok(!("payment_status" in row.record));
      assert.ok(!("settled_at" in row.record));
      const errors=engine.validate(get(row.code),row.record.values,false);
      assert.equal(errors.length,0,row.code+" "+JSON.stringify(errors));
    }
  }
});

test("IGD triage and RI admission, bed, nutrition and meal drafts preserve safe links",()=>{
  const igd=new Map(journeys.makeFor("IGD",patient).map(x=>[x.code,x.record]));
  const inpatient=new Map(journeys.makeFor("RI",patient).map(x=>[x.code,x.record]));
  assert.equal(igd.get("RME-02").values.acuity,"Kuning");
  assert.equal(igd.get("FIN-01").values.source_order,igd.get("RME-08").id);
  assert.equal(igd.get("FIN-02").linked_source.record_id,igd.get("FIN-01").id);
  assert.equal(inpatient.get("OPS-10").values.availability,"Kosong");
  assert.equal(inpatient.get("RME-03").linked_source.record_id,inpatient.get("OPS-10").id);
  assert.equal(inpatient.get("OPS-05").values.diet_order_reference,inpatient.get("MED-11").id);
  assert.equal(inpatient.get("MED-11").values.allergy_diet_review,"Belum ditinjau");
  assert.equal(inpatient.get("FIN-02").values.charge_ids[0],inpatient.get("FIN-01").id);
});

test("same patient and encounter can seed all three independent flows without shared object IDs",()=>{
  const records=["RJ","IGD","RI"].flatMap(flow=>journeys.makeFor(flow,patient));
  const ids=records.map(x=>x.record.id);
  assert.equal(new Set(ids).size,ids.length);
  const shared=records.filter(x=>x.code==="CORE-09");
  assert.equal(shared.length,3);
  assert.equal(new Set(shared.map(x=>x.record.scenario_tag)).size,3);
  assert.equal(new Set(shared.map(x=>x.record.values.visit_type)).size,3);
  const other=journeys.makeFor("IGD",{id:"p2",visit:"ENC-OTHER"});
  assert.ok(other.every(r=>r.record.patient_id==="p2" && r.record.encounter_id==="ENC-OTHER"));
  assert.ok(other.every(r=>!ids.includes(r.record.id)));
  assert.throws(()=>journeys.makeFor("BAD",patient),/Unknown synthetic track/);
});

test("desktop and mobile track UI is accessible without exposing real operations",()=>{
  const html=engine.render({role:"Pendaftaran",patient});
  assert.ok(html.includes('aria-label="Jenis alur pelayanan"'));
  assert.equal((html.match(/data-p0-action="guideFlow"/g)||[]).length,3);
  assert.ok(html.includes('data-flow="RJ"'));
  assert.ok(html.includes('data-flow="IGD"'));
  assert.ok(html.includes('data-flow="RI"'));
  assert.ok(html.includes("Muat 7 draft IGD"));
  assert.ok(html.includes("Muat 9 draft rawat inap"));
  assert.ok(html.includes("10 tahap"));
  assert.ok(html.includes("DEMO – NO BACKEND"));
  assert.ok(html.includes("NONAKTIF"));
});
