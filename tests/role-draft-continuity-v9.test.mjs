import assert from "node:assert/strict";
import {test} from "node:test";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const source=n=>readFileSync(new URL("../public/ui-preview/"+n,import.meta.url),"utf8");
const patients=[
 {id:"p1",name:"Sari Amelia",mrn:"RM-001",unit:"Poli Umum",visit:"ENC-DEMO-247",payer:"BPJS"},
 {id:"p2",name:"Bima Rahman",mrn:"RM-002",unit:"Poli Jantung",visit:"ENC-DEMO-248",payer:"Umum"},
 {id:"p3",name:"Nadia Laras",mrn:"RM-003",unit:"Poli Umum",visit:"ENC-DEMO-249",payer:"Umum"},
 {id:"p4",name:"Kirana Raka",mrn:"RM-004",unit:"Poli Bedah",visit:"ENC-DEMO-251",payer:"BPJS"}
];
let saved={version:1,seq:4,records:{}};
const storage={
 getItem:key=>key==="simrs-demo-p0-forms-v1"?JSON.stringify(saved):null,
 setItem:(key,value)=>{if(key==="simrs-demo-p0-forms-v1")saved=JSON.parse(value);},
 removeItem:()=>{}
};
const ctx={window:{__SIMRS_PREVIEW__:{patients}},document:{addEventListener(){}},localStorage:storage};
runInNewContext(source("role-workspace-v4.js"),ctx);
runInNewContext(source("p0-form-catalog.js"),ctx);
runInNewContext(source("role-worklist-detail-v5.js"),ctx);
const api=ctx.window.SIMRSRoleUXV5;

test("V9 shows draft progress only for exact work item and patient episode",()=>{
 saved={version:1,records:{"CORE-09":[
  {id:"DEMO-CORE-09-0001",status:"Draft",work_item_id:"REG-D002",patient_id:"p2",encounter_id:"ENC-DEMO-248",updated_at:"2026-11-09T00:10:00Z",values:{visit_type:"Rawat Jalan"}},
  {id:"DEMO-CORE-09-0002",status:"Draft",work_item_id:"REG-D003",patient_id:"p3",encounter_id:"WRONG-ENCOUNTER",updated_at:"2026-11-09T00:15:00Z"}
 ]}};
 const jobs=api.jobRows("Pendaftaran","m1");
 assert.equal(jobs[0].progress,null);
 assert.equal(jobs[1].progress.label,"Draft tersimpan");
 assert.equal(jobs[2].progress,null);
 const html=api.renderPage({role:"Pendaftaran",section:"m1",selectedJob:1,username:"akun.pendaftaran",canOpen:()=>true});
 assert.match(html,/Lanjutkan draft/);
 assert.match(html,/DEMO-CORE-09-0001/);
 assert.match(html,/Draft tersimpan/);
 const other=api.renderPage({role:"Pendaftaran",section:"m1",selectedJob:0,username:"akun.pendaftaran",canOpen:()=>true});
 assert.doesNotMatch(other,/Lanjutkan draft/);
});

test("V9 does not treat reviewed demo as a real operational completion",()=>{
 saved={version:1,records:{"RME-04":[
  {id:"SOAP-0001",status:"Reviewed (Demo)",work_item_id:"ENC-RJ02",patient_id:"p2",encounter_id:"ENC-DEMO-248",updated_at:"2026-11-09T01:00:00Z"}
 ]}};
 const html=api.renderPage({role:"Dokter RJ",section:"m1",selectedJob:1,username:"akun.dokter-rj",canOpen:()=>true});
 assert.match(html,/Ditinjau \(demo\)/);
 assert.match(html,/Lihat catatan/);
 assert.match(html,/Data latihan saja/);
 assert.equal(api.localProgress("RME-04","ENC-RJ02","p2","ENC-DEMO-999"),null);
});

test("V9 continues matching synthetic draft but isolates a different patient task",()=>{
 saved={version:1,seq:1,records:{"CORE-09":[
  {id:"DEMO-CORE-09-0001",status:"Draft",work_item_id:"REG-D002",patient_id:"p2",encounter_id:"ENC-DEMO-248",updated_at:"2026-11-09T00:10:00Z",values:{visit_type:"Rawat Jalan"},history:[]}
 ]}};
 const ectx={window:{__SIMRS_PREVIEW__:{patients}},document:{addEventListener(){}},localStorage:storage};
 runInNewContext(source("p0-form-catalog.js"),ectx);
 runInNewContext(source("p0-forms.js"),ectx);
 const engine=ectx.window.SIMRSFormEngine;
 const p2=patients[1],p1=patients[0];
 assert.equal(engine.openForRole("CORE-09","Pendaftaran",{role:"Pendaftaran",kind:"patient",workItem:{id:"REG-D002",scope:"Rawat Jalan"},patient:p2}),true);
 assert.match(engine.render({role:"Pendaftaran",patient:p2}),/DEMO-CORE-09-0001/);
 assert.equal(engine.openForRole("CORE-09","Pendaftaran",{role:"Pendaftaran",kind:"patient",workItem:{id:"REG-D001",scope:"Rawat Jalan"},patient:p1}),true);
 const form=engine.render({role:"Pendaftaran",patient:p1});
 assert.match(form,/Baru \(belum tersimpan\)/);
 assert.doesNotMatch(form,/DEMO-CORE-09-0001/);
});
