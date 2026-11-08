import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
const read=name=>readFileSync(new URL("../public/ui-preview/"+name,import.meta.url),"utf8");
const records={
  "FIN-01":[
    {id:"CHG-1",patient_id:"p1",encounter_id:"e1",status:"Reviewed (Demo)",values:{service_ref:"CBC",quantity:"2",unit_price:"50000"}},
    {id:"CHG-2",patient_id:"p1",encounter_id:"e1",status:"Reviewed (Demo)",values:{service_ref:"XR",quantity:"1",unit_price:"150000"}},
    {id:"CHG-DRAFT",patient_id:"p1",encounter_id:"e1",status:"Draft",values:{quantity:"1",unit_price:"10000"}},
    {id:"CHG-OTHER",patient_id:"p2",encounter_id:"e1",status:"Reviewed (Demo)",values:{quantity:"1",unit_price:"200000"}},
    {id:"CHG-EPISODE",patient_id:"p1",encounter_id:"e2",status:"Reviewed (Demo)",values:{quantity:"1",unit_price:"200000"}}
  ],
  "FIN-02":[
    {id:"INV-1",patient_id:"p1",encounter_id:"e1",status:"Reviewed (Demo)",values:{invoice_no:"DEMO-INVOICE-1",subtotal:"100000",discount:"10000"}},
    {id:"INV-2",patient_id:"p1",encounter_id:"e1",status:"Reviewed (Demo)",values:{invoice_no:"DEMO-INVOICE-2",subtotal:"150000",discount:"0"}},
    {id:"INV-DRAFT",patient_id:"p1",encounter_id:"e1",status:"Draft",values:{subtotal:"25000"}},
    {id:"INV-OTHER",patient_id:"p2",encounter_id:"e1",status:"Reviewed (Demo)",values:{subtotal:"500000"}},
    {id:"INV-EPISODE",patient_id:"p1",encounter_id:"e2",status:"Reviewed (Demo)",values:{subtotal:"500000"}}
  ]
};
const sandbox={window:{},document:{addEventListener(){}},localStorage:{getItem(){return null;},setItem(){},removeItem(){}},console};
for(const file of ["p0-form-catalog.js","finance-form-rows.js","p0-forms.js"])
  runInNewContext(read(file),sandbox,{filename:file});
const finance=sandbox.window.SIMRSFinanceLines,engine=sandbox.window.SIMRSFormEngine,catalog=sandbox.window.SIMRS_FORM_CATALOG;
const get=code=>catalog.find(m=>m.code===code);
const ctx={role:"Kasir",patient:{id:"p1",visit:"e1",name:"Pasien Sintetis",mrn:"DEMO-01"}};
const invoice={invoice_no:"INV-DEMO-001",payer:"Umum",discount:"10000",due_date:"2026-11-08",
  invoice_state:"Draft",subtotal:"250000",
  charge_lines:[{charge_ref:"CHG-1"},{charge_ref:"CHG-2"}],
  charge_ids:["CHG-1","CHG-2"]};
const payment={payment_method:"Tunai (demo)",payment_at:"2026-11-08T14:00",payment_reference:"",
  verification:"Belum diverifikasi",invoice_ref:"INV-1",amount:"120000",
  allocations:[{invoice_ref:"INV-1",amount:"50000"},{invoice_ref:"INV-2",amount:"70000"}]};
test("only Reviewed (Demo) records of the same patient and encounter are selectable",()=>{
  const charges=finance.eligible(records,"FIN-01",ctx);
  const invoices=finance.eligible(records,"FIN-02",ctx);
  assert.equal(charges.length,2);
  assert.equal(invoices.length,2);
  assert.ok(charges.every(r=>r.id==="CHG-1"||r.id==="CHG-2"));
  assert.ok(invoices.every(r=>r.id==="INV-1"||r.id==="INV-2"));
  const html=finance.render("FIN-02",invoice,true,records,ctx);
  assert.ok(html.includes('value="CHG-1"'));
  assert.ok(!html.includes('value="CHG-OTHER"'));
  assert.ok(!html.includes('value="CHG-DRAFT"'));
  assert.ok(!html.includes('value="CHG-EPISODE"'));
});
test("charge subtotal and invoice allocation calculations are deterministic",()=>{
  assert.equal(finance.chargeTotal(records["FIN-01"][0]),100000);
  assert.equal(finance.chargeTotal(records["FIN-01"][1]),150000);
  assert.equal(finance.invoiceTotal(records["FIN-02"][0]),90000);
  assert.equal(finance.invoiceTotal(records["FIN-02"][1]),150000);
  assert.equal(finance.validate("FIN-02",invoice,true,records,ctx).length,0);
  assert.equal(engine.validate(get("FIN-02"),invoice,true).filter(x=>x.key==="discount").length,0);
  assert.equal(finance.validate("FIN-03",payment,true,records,ctx).length,0);
});
test("charge refs cannot be unreviewed, cross-patient, repeated, or inconsistent",()=>{
  const cases=[
    [{...invoice,charge_lines:[{charge_ref:"CHG-DRAFT"}],charge_ids:["CHG-DRAFT"],subtotal:"10000"},"finance-0-charge_ref"],
    [{...invoice,charge_lines:[{charge_ref:"CHG-OTHER"}],charge_ids:["CHG-OTHER"],subtotal:"200000"},"finance-0-charge_ref"],
    [{...invoice,charge_lines:[{charge_ref:"CHG-EPISODE"}],charge_ids:["CHG-EPISODE"],subtotal:"200000"},"finance-0-charge_ref"],
    [{...invoice,charge_lines:[{charge_ref:"CHG-1"},{charge_ref:"CHG-1"}],charge_ids:["CHG-1","CHG-1"],subtotal:"200000"},"finance-1-charge_ref"],
    [{...invoice,subtotal:"999999"},"finance-add"],
    [{...invoice,charge_ids:["CHG-2"]},"finance-add"]
  ];
  for(const [values,key] of cases) {
    const errors=finance.validate("FIN-02",values,true,records,ctx);
    assert.ok(errors.some(e=>e.key===key),JSON.stringify(errors));
  }
});
test("payment allocations cannot exceed source invoice, duplicate invoice, or reference another patient",()=>{
  const cases=[
    [{...payment,allocations:[{invoice_ref:"INV-1",amount:"95000"}],amount:"95000"},"finance-0-amount"],
    [{...payment,allocations:[{invoice_ref:"INV-1",amount:"0"}],amount:"0"},"finance-0-amount"],
    [{...payment,allocations:[{invoice_ref:"INV-1",amount:"1.5"}],amount:"1.5"},"finance-0-amount"],
    [{...payment,allocations:[{invoice_ref:"INV-1",amount:"1000"},{invoice_ref:"INV-1",amount:"2000"}],amount:"3000"},"finance-1-invoice_ref"],
    [{...payment,allocations:[{invoice_ref:"INV-OTHER",amount:"500"}],amount:"500"},"finance-0-invoice_ref"],
    [{...payment,allocations:[{invoice_ref:"INV-DRAFT",amount:"500"}],amount:"500"},"finance-0-invoice_ref"],
    [{...payment,allocations:[{invoice_ref:"INV-EPISODE",amount:"500"}],amount:"500"},"finance-0-invoice_ref"],
    [{...payment,amount:"5"},"finance-add"]
  ];
  for(const [values,key] of cases) {
    const errors=finance.validate("FIN-03",values,true,records,ctx);
    assert.ok(errors.some(e=>e.key===key),JSON.stringify(errors));
  }
});
test("empty draft rows are allowed but review requires valid references",()=>{
  assert.equal(finance.validate("FIN-02",{charge_lines:[{charge_ref:""}],charge_ids:[],subtotal:"0"},false,records,ctx).length,0);
  assert.ok(finance.validate("FIN-02",{charge_lines:[{charge_ref:""}],charge_ids:[],subtotal:"0"},true,records,ctx).length>0);
  assert.equal(finance.validate("FIN-03",{allocations:[{invoice_ref:"",amount:""}],amount:"0"},false,records,ctx).length,0);
  assert.ok(finance.validate("FIN-03",{allocations:[],amount:"0"},true,records,ctx).length>0);
});
test("display escapes malicious synthetic labels and locks Reviewed forms",()=>{
  const evil={...records,"FIN-01":[{...records["FIN-01"][0],values:{...records["FIN-01"][0].values,service_ref:'<img src=x onerror="alert(1)">'}}]};
  const html=finance.render("FIN-02",invoice,false,evil,ctx);
  assert.ok(html.includes("&lt;img"));
  assert.ok(!html.includes("<img src=x"));
  assert.ok(html.includes(" disabled"));
  assert.ok(!html.includes('data-finance-action="add"'));
});
