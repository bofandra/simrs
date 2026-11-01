/* GitHub Pages interactive mockup regression smoke test — no backend required. */
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const root=path.join(__dirname,"..","docs","simrs-baru");
const listeners={};const elements={};const saved={};
const el=id=>elements[id]||(elements[id]={
 innerHTML:"",textContent:"",style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},
 addEventListener(event,cb){listeners[id+":"+event]=cb},appendChild(){},focus(){}
});
const document={
 getElementById:el,
 addEventListener(event,cb){listeners[event]=cb},
 querySelector(selector){return selector.startsWith(".modal input")?{focus(){}}:null},
 querySelectorAll(){return []},
 createElement(){return{className:"",textContent:"",style:{},remove(){}}},
 activeElement:{tagName:"BODY"},body:{innerHTML:""}
};
const browser={addEventListener(){},scrollTo(){}};
const loc={hash:""};
const storage={getItem:key=>saved[key]||null,setItem(key,val){saved[key]=val}};
class DemoFormData{constructor(form){this.values=form.values}get(key){return this.values[key]}}
const context=vm.createContext({window:browser,document,location:loc,localStorage:storage,confirm:()=>true,setTimeout:()=>{},FormData:DemoFormData,console});
for(const f of ["catalog.js","database-tables.js","enhancements.js","specialty.js","feature-map.js","care-journey.js","role-worklists.js","app.js"]){
 const source=fs.readFileSync(path.join(root,f),"utf8");
 new vm.Script(source,{filename:f}).runInContext(context);
}
const click=(dataset)=>listeners.click({target:{closest:()=>({dataset})}});
const submit=(kind,values)=>listeners.submit({target:{closest:()=>({dataset:{form:kind},values})},preventDefault(){}});
const state=()=>JSON.parse(saved["simrs-baru-interactive-demo-v1"]);
const check=(name,test)=>{assert.ok(test,name);console.log("PASS",name)};
check("271 table names",browser.SIMRS_ALL_TABLE_NAMES.length===271);
check("23 schemas",Object.keys(browser.SIMRS_ALL_TABLES).length===23);
check("68 modules",browser.SIMRS_CATALOG.moduleGroups.reduce((n,g)=>n+g.modules.length,0)===68);
const fmap=browser.SIMRS_FEATURE_MAP;
check("feature mapping covers 68 modules",fmap.features.length===68&&fmap.features.every(f=>fmap.workflows[f.workflowId]));
check("feature workflow tables canonical",fmap.invalidTables.length===0&&Object.values(fmap.workflows).every(w=>w.tables.every(t=>browser.SIMRS_ALL_TABLE_NAMES.includes(t))));
const fieldTables=Object.entries(browser.SIMRS_CATALOG.db).flatMap(([schema,g])=>Object.keys(g.tables).map(t=>schema+"."+t));
check("catalog detailed tables canonical",fieldTables.every(t=>browser.SIMRS_ALL_TABLE_NAMES.includes(t)));
const fieldFks=Object.values(browser.SIMRS_CATALOG.db).flatMap(g=>Object.values(g.tables).flatMap(fs=>fs.filter(f=>f.includes("FK → ")).map(f=>f.split("FK → ")[1])));
check("catalog FK targets canonical",fieldFks.every(t=>browser.SIMRS_ALL_TABLE_NAMES.includes(t)));
for(const page of ["dashboard","modules","feature-map","care-journey","role-worklists","patients","patient360","frontoffice","encounters","clinical","orders","laboratory","pharmacy","radiology","surgery","nutrition","cssd","laundry","hr","reports","billing","inventory","journey","database","fhir"]){
 click({nav:page});
 check("route "+page,el("workspace").innerHTML.length>500);
}
click({nav:"feature-map"});
check("feature workspace includes selected workflow",el("workspace").innerHTML.includes("Rawat Jalan")&&el("workspace").innerHTML.includes("Resource HL7 FHIR R4"));
click({action:"feature-open",module:"Laboratorium LIS"});
check("feature-open links catalog to LIS workflow",el("workspace").innerHTML.includes("LIS: permintaan hingga hasil"));
click({action:"feature-db",id:"laboratory.lab_orders"});
check("feature table opens explorer",loc.hash.replace(/^#/, "")==="database"&&el("workspace").innerHTML.includes("laboratory.lab_orders"));
click({nav:"feature-map"});
click({action:"feature-group",id:"FIN"});
check("feature group filter navigable",el("workspace").innerHTML.includes("Klaim BPJS &amp; Swasta"));
click({action:"ext-book-appointment"});
submit("ext-appointment",{patientId:"P-006",date:"2026-10-30",slot:"13:00",unit:"Poli Anak"});
let a=state().appointments.at(-1);
check("appointment created",state().appointments.length===3);
click({action:"ext-checkin",id:a.id});
check("appointment check-in creates queue",state().queue.length===3);
click({action:"ext-open-rme",id:"E-1002"});click({action:"ext-clinical-tab",value:"triage"});
submit("ext-triage",{acuity:"2",complaint:"Demo triage",airway:"Paten",breathing:"Spontan",circulation:"Stabil"});
check("triage retained",state().triageRecords["E-1002"].acuity==="2");
click({action:"ext-open-rme",id:"E-1001"});
submit("ext-soap",{s:"subjective",o:"objective",a:"assessment",p:"plan"});
click({action:"ext-sign-soap"});
check("SOAP draft/sign",state().soapRecords["E-1001"].status==="signed");
submit("ext-rx",{encounterId:"E-1001",medication:"Amlodipine 5 mg",quantity:"3"});
let rx=state().prescriptions.at(-1);
click({action:"ext-verify-rx",id:rx.id});
let qty=state().stock[0].qty;
submit("ext-dispense",{rxId:rx.id,stockId:"ST-01"});
check("dispense lot and stock ledger",state().stock[0].qty===qty-3&&state().rxStages[rx.id]==="dispensed");
submit("lab-order",{encounterId:"E-1001",service:"Hemoglobin",priority:"routine"});
const lab=state().labs.at(-1);
for(let i=0;i<3;i++)click({action:"ext-lab-next",id:lab.id});
check("lab specimen path",state().labStages[lab.id]==="processing");
let chargesBefore=state().charges.length;
submit("ext-lab-verify",{labId:lab.id,result:"13.1"});
check("lab verification charge",state().charges.length===chargesBefore+1);
click({action:"ext-lab-next",id:lab.id});
check("lab release generates event",state().labStages[lab.id]==="released"&&state().outbox.some(x=>x.ref===lab.id&&x.type==="lab.released"));
let invoice=state().invoices.find(i=>i.encounterId==="E-1001");
submit("ext-payment",{invoiceId:invoice.id,amount:"50000",method:"QRIS"});
check("payment allocation",state().paymentAllocations.length===1&&state().invoices.find(i=>i.id===invoice.id).status==="partial");
click({nav:"database"});click({action:"ext-db-schema",id:"operations"});
check("operations tables rendered",el("workspace").innerHTML.includes("facility_work_orders"));
click({action:"ext-open-db",id:"master.organization_units"});
check("FK target navigable",el("workspace").innerHTML.includes("master.organization_units"));
click({nav:"journey"});
check("record lineage",el("workspace").innerHTML.includes("Record Trace"));

/* Specialty workflow regression: real state transitions, still browser-only. */
click({nav:"surgery"});
for(let n=0;n<3;n++)click({action:"sp-next",id:"SUR-001"});
check("surgery blocks before CSSD sterile",state().surgeryCases[0].status==="checklist-ready");
click({nav:"cssd"});
for(let n=0;n<4;n++)click({action:"sp-next",id:"CSSD-001"});
check("CSSD set sterilized",state().cssdCycles[0].status==="sterile");
const preSurgeryCharges=state().charges.length;
click({nav:"surgery"});
for(let n=0;n<3;n++)click({action:"sp-next",id:"SUR-001"});
check("surgery recovery completed",state().surgeryCases[0].status==="completed");
check("surgery charge exactly once",state().charges.length===preSurgeryCharges+1);
click({action:"sp-next",id:"SUR-001"});
check("completed surgery cannot double charge",state().charges.length===preSurgeryCharges+1);
click({nav:"radiology"});
for(let n=0;n<2;n++)click({action:"sp-next",id:"RAD-001"});
check("RIS acquired",state().radStudies[0].status==="acquired");
submit("sp-report",{recordId:"RAD-001",report:"Contoh ekspertise radiologi"});
click({action:"sp-next",id:"RAD-001"});
check("RIS report released",state().radStudies[0].status==="released");
check("RIS service order completed",state().orders.find(x=>x.id==="SO-03").status==="completed");
check("RIS outbox resource created",state().outbox.some(x=>x.ref==="RAD-001"&&x.entity==="DiagnosticReport"));
click({nav:"nutrition"});
for(let n=0;n<3;n++)click({action:"sp-next",id:"DIET-001"});
check("diet produced and delivered",state().diets[0].status==="delivered"&&state().diets[0].kitchenBatch);
click({nav:"laundry"});
for(let n=0;n<5;n++)click({action:"sp-next",id:"LINEN-001"});
check("linen distributed",state().laundryCycles[0].status==="delivered");
click({nav:"hr"});click({action:"sp-attendance",id:"SHIFT-001"});
check("attendance recorded",state().attendanceDemo.length===1);
click({action:"sp-attendance",id:"SHIFT-001"});
check("attendance is idempotent",state().attendanceDemo.length===1);
click({nav:"reports"});click({action:"sp-filter",id:"IGD"});
check("operational report filtered",el("workspace").innerHTML.includes("IGD"));
click({nav:"journey"});
listeners.change({target:{id:"encounter-select",value:"E-1003"}});
check("radiology joins encounter E-1003",el("workspace").innerHTML.includes("radiology.rad_orders"));
check("surgery joins encounter E-1003",el("workspace").innerHTML.includes("operations.surgery_schedules"));
click({nav:"database"});click({action:"ext-open-db",id:"radiology.rad_orders"});
check("RIS sample rows available",el("workspace").innerHTML.includes("RAD-001"));
click({nav:"fhir"});
check("ImagingStudy example available",el("workspace").innerHTML.includes("ImagingStudy · RAD-001"));
click({action:"reset-demo"});
check("reset specialty seed",state().radStudies.length===1&&state().cssdCycles[0].status==="dirty"&&state().attendanceDemo.length===0);

click({action:"reset-demo"});
check("reset seeds enhanced fixture",state().appointments.length===2 && state().paymentAllocations.length===0);

/* Integrated care journey transaction regression. */
click({action:"reset-demo"});
click({nav:"care-journey"});
click({action:"e2e-new"});
submit("e2e-create",{patientId:"P-006",doctor:"PR-01",unit:"Poli Umum",date:"2026-11-01",slot:"10:30"});
const integratedId=state().encounters.at(-1).id;
const care=()=>browser.SIMRS_CARE_JOURNEY.inspect(state(),integratedId);
check("E2E registration creates queue appointment and encounter",state().e2eRegistrations.some(x=>x.encounterId===integratedId)&&state().queue.some(q=>q.id===state().e2eRegistrations.at(-1).queueId));
check("E2E patient identity linked",care().patient.id==="P-006");
click({action:"e2e-order"});
check("E2E lab order blocked without signed RME",!care().lab);
listeners.change({target:{id:"e2e-role",value:"doctor"}});
submit("e2e-clinical",{s:"keluhan",o:"objektif",a:"analisis",p:"rencana",dxCode:"I10",dxName:"Hipertensi",sbp:"120",dbp:"80"});
check("E2E RME draft with two BP observations",care().soap.status==="draft"&&state().observations.filter(x=>x.encounterId===integratedId&&["8480-6","8462-4"].includes(x.code)).length===2);
click({action:"e2e-sign"});
check("E2E RME signed",care().complete.clinical);
submit("e2e-clinical",{s:"ubah",o:"ubah",a:"ubah",p:"ubah",dxCode:"I10",dxName:"lain",sbp:"125",dbp:"85"});
check("E2E signed clinical cannot overwrite",care().soap.s==="keluhan");
click({action:"e2e-order"});
check("E2E laboratory order has encounter lineage",!!care().lab&&state().orders.some(x=>x.id===care().lab.orderId&&x.encounterId===integratedId));
listeners.change({target:{id:"e2e-role",value:"lab"}});
for(let i=0;i<3;i++)click({action:"e2e-labnext"});
check("E2E specimen reaches processing",care().labs==="processing");
submit("e2e-verify",{result:"13.7"});
check("E2E Hb result Observation LOINC 718-7",care().labs==="verified"&&state().observations.some(x=>x.id===care().lab.resultObservationId&&x.code==="718-7"));
const beforeLabCharges=state().charges.filter(x=>x.encounterId===integratedId).length;
submit("e2e-verify",{result:"15"});
check("E2E lab verification idempotent",state().charges.filter(x=>x.encounterId===integratedId).length===beforeLabCharges);
click({action:"e2e-labnext"});
check("E2E lab release outbox",care().complete.lab&&state().outbox.some(x=>x.ref===care().lab.id&&x.type==="lab.released"));
listeners.change({target:{id:"e2e-role",value:"doctor"}});
submit("e2e-rx",{medication:"Amlodipine 5 mg",quantity:"5"});
check("E2E e-prescription created",care().rxs==="prescribed");
listeners.change({target:{id:"e2e-role",value:"pharmacy"}});
click({action:"e2e-rxverify"});
check("E2E pharmacist verifies prescription",care().rxs==="verified");
const stockBeforeE2E=state().stock.find(x=>x.id==="ST-01").qty;
submit("e2e-dispense",{stockId:"ST-01"});
check("E2E dispense decrements stock ledger",care().complete.pharmacy&&state().stock.find(x=>x.id==="ST-01").qty===stockBeforeE2E-5);
const billLines=state().charges.filter(x=>x.encounterId===integratedId).length;
submit("e2e-dispense",{stockId:"ST-01"});
check("E2E dispense cannot double charge",state().charges.filter(x=>x.encounterId===integratedId).length===billLines);
listeners.change({target:{id:"e2e-role",value:"cashier"}});
submit("e2e-pay",{payment:"50000",method:"QRIS"});
check("E2E partial payment allocation",care().paid===50000&&care().invoice.status==="partial");
submit("e2e-pay",{payment:String(care().balance+1),method:"Tunai"});
check("E2E no overpayment",care().paid===50000);
submit("e2e-pay",{payment:String(care().balance),method:"Transfer"});
check("E2E invoice settled",care().complete.billing&&care().invoice.status==="paid"&&care().balance===0);
click({action:"e2e-close"});
check("E2E role prevents cashier closing encounter",care().encounter.status==="in-progress");
listeners.change({target:{id:"e2e-role",value:"doctor"}});
click({action:"e2e-close"});
check("E2E encounter closed only after all 5 stages",care().done&&care().encounter.status==="finished");
click({action:"e2e-close"});
check("E2E close idempotent",state().outbox.filter(x=>x.ref===integratedId&&x.type==="encounter.finished").length===1);
click({nav:"fhir"});
check("E2E FHIR preview can select Hb result",el("workspace").innerHTML.includes(care().lab.resultObservationId));
click({action:"reset-demo"});
check("E2E reset removes linked audit",state().e2eAudit.length===0&&state().e2eRegistrations.length===0);


/* Role worklists: status view, nurse documentation, check-in idempotency and shared records. */
click({action:"reset-demo"});
click({nav:"role-worklists"});
const roleview=browser.SIMRS_ROLE_WORKLISTS;
check("six role worklist groups",roleview.roles.length===6&&roleview.roles.some(x=>x[0]==="nurse"));
check("doctor worklist has actionable encounter",roleview.worklist(state(),"doctor").some(x=>x.state==="action"));
submit("ext-appointment",{patientId:"P-005",date:"2026-11-01",slot:"14:00",unit:"Poli Umum"});
const newAppointmentId=state().appointments.at(-1).id;
click({nav:"role-worklists"});
click({action:"rwl-role",id:"frontoffice"});
const book=state().appointments.find(x=>x.id===newAppointmentId),qBefore=state().queue.length;
click({action:"rwl-checkin",id:book.id});
check("front office check-in creates queue",state().queue.length===qBefore+1&&state().appointments.find(x=>x.id===book.id).status==="checked-in");
click({action:"rwl-checkin",id:book.id});
check("replayed check-in does not double queue",state().queue.length===qBefore+1);
click({action:"rwl-checkin",id:"APT-002"});
check("existing queue is reconciled, not duplicated",state().queue.length===qBefore+1&&state().appointments.find(x=>x.id==="APT-002").status==="checked-in");
click({action:"rwl-role",id:"nurse"});
submit("rwl-nursing",{encounterId:"E-1001",intervention:"Pantau TTV",outcome:"Stabil"});
check("nursing note stored on existing encounter",state().nursingNotes.some(n=>n.encounterId==="E-1001"&&n.role==="nurse"&&n.status==="completed"));
const noteCount=state().nursingNotes.length;
submit("rwl-nursing",{encounterId:"E-1001",intervention:"Duplikat",outcome:"Duplikat"});
check("nursing note repeated submit no duplicate",state().nursingNotes.length===noteCount);
click({action:"rwl-open",id:"E-1002"});
check("nurse goes to selected clinical RME",loc.hash.replace(/^#/,"")==="clinical");
click({nav:"role-worklists"});
click({action:"rwl-role",id:"lab"});
check("LIS worklist reuses lab fixtures",roleview.worklist(state(),"lab").some(x=>x.id==="LAB-02"));
click({action:"rwl-filter",id:"action"});
check("role status filter displays action items",el("workspace").innerHTML.includes("Perlu tindakan"));
click({action:"rwl-role",id:"pharmacy"});
check("pharmacy worklist reuses Rx fixtures",roleview.worklist(state(),"pharmacy").some(x=>x.id==="RX-01"));
click({action:"rwl-role",id:"cashier"});
check("cashier worklist reuses invoices",roleview.worklist(state(),"cashier").some(x=>x.id==="INV-01"));
check("read-model integrity reports no fixture orphan",roleview.integrity(state()).length===0);
click({action:"rwl-open",id:"E-1001"});
check("cashier deep-link opens same encounter E2E",loc.hash.replace(/^#/,"")==="care-journey");
click({action:"reset-demo"});

console.log("All SIMRS mockup smoke tests passed.");
