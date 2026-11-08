import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const read=p=>readFileSync(new URL("../public/ui-preview/"+p,import.meta.url),"utf8");
const sandbox={window:{},document:{addEventListener(){}},localStorage:{getItem(){return null;},setItem(){},removeItem(){}},console};
for(const file of ["p0-form-catalog.js","master-lookups.js","synthetic-journey.js","p0-forms.js"])
  runInNewContext(read(file),sandbox,{filename:file});
const master=sandbox.window.SIMRSMasterLookups;
const engine=sandbox.window.SIMRSFormEngine;
const catalog=sandbox.window.SIMRS_FORM_CATALOG;
const moduleFor=code=>catalog.find(x=>x.code===code);
const baseCtx={role:"Pendaftaran",patient:{id:"p1",name:"Pasien Demo",mrn:"RM-001",visit:"ENC-DEMO-247"}};

test("synthetic reference catalog has stable fixture identifiers and counts",()=>{
  assert.equal(master.units.length,7);
  assert.equal(master.doctors.length,5);
  assert.equal(master.services.length,5);
  assert.equal(master.medications.length,3);
  for(const kind of ["units","doctors","services","medications"])
    assert.equal(new Set(master[kind].map(x=>x.id)).size,master[kind].length);
  assert.equal(master.find("CORE-09","unit","Poli Umum").id,"UNIT-DEMO-01");
  assert.ok(master.entries("MED-04","medication_code",{}).some(x=>x.value==="PARA-500 — Parasetamol 500 mg"));
});

test("appointment and outpatient doctor choices must match selected unit",()=>{
  const inCardiology=master.entries("CORE-10","practitioner",{unit:"Jantung"});
  assert.equal(inCardiology.length,1);
  assert.equal(inCardiology[0].value,"dr. Andi Demo");
  const appointment={unit:"Jantung",practitioner:"dr. Demo",start_at:"2026-11-08T09:00",
    end_at:"2026-11-08T09:30",appointment_state:"Dipesan",visit_reason:"Kontrol sintetis"};
  assert.ok(engine.validate(moduleFor("CORE-10"),appointment,true).some(x=>x.key==="practitioner"));
  appointment.practitioner="dr. Andi Demo";
  assert.equal(engine.validate(moduleFor("CORE-10"),appointment,true).length,0);
});

test("master validates service price and charge group but allows matching catalog prices",()=>{
  const values={service_ref:"CBC — Darah lengkap",performed_at:"2026-11-08T10:00",
    quantity:"1",unit_price:"85000",charge_category:"Penunjang",source_order:""};
  assert.equal(engine.validate(moduleFor("FIN-01"),values,true).length,0);
  const wrongPrice={...values,unit_price:"1000"};
  assert.ok(engine.validate(moduleFor("FIN-01"),wrongPrice,true).some(x=>x.key==="unit_price"));
  const wrongCategory={...values,charge_category:"Obat"};
  assert.ok(engine.validate(moduleFor("FIN-01"),wrongCategory,true).some(x=>x.key==="charge_category"));
  const wrongService={...values,service_ref:"NONCATALOG"};
  assert.ok(engine.validate(moduleFor("FIN-01"),wrongService,true).some(x=>x.key==="service_ref"));
});

test("lookup renders escaped selection labels, disabled read-only and master provenance",()=>{
  const module=moduleFor("CORE-10"),f=module.fields.find(x=>x.key==="practitioner");
  const html=master.field(f,{practitioner:'<svg onload="alert(1)">',unit:"Poli Umum"},false,"CORE-10");
  assert.ok(html.includes("&lt;svg"));
  assert.ok(!html.includes("<svg onload"));
  assert.ok(html.includes(" disabled"));
  assert.ok(html.includes("Tidak ada pada master"));
  assert.ok(master.field(f,{practitioner:"dr. Demo",unit:"Poli Umum"},true,"CORE-10").includes("PRACT-DEMO-01"));
});

test("guided journey renders 10 navigable stages with patient context and traceability",()=>{
  const html=engine.render(baseCtx);
  assert.equal((html.match(/class="p0-guide-step/g)||[]).length,10);
  assert.ok(html.includes("Jelajahi alur rawat jalan"));
  assert.ok(html.includes("10 ditinjau")===false);
  assert.ok(html.includes('data-code="CORE-10"'));
  assert.ok(html.includes('data-code="FIN-03"'));
  assert.ok(html.includes("Master")||html.includes("katalog"));
  assert.ok(html.includes("Encounter"));
});
