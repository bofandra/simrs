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
for(const f of ["catalog.js","database-tables.js","enhancements.js","app.js"]){
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
for(const page of ["dashboard","modules","patients","patient360","frontoffice","encounters","clinical","orders","laboratory","pharmacy","billing","inventory","journey","database","fhir"]){
 click({nav:page});
 check("route "+page,el("workspace").innerHTML.length>500);
}
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
click({action:"reset-demo"});
check("reset seeds enhanced fixture",state().appointments.length===2 && state().paymentAllocations.length===0);
console.log("All SIMRS mockup smoke tests passed.");
