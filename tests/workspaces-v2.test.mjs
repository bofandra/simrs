import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const source=readFileSync(new URL("../public/ui-preview/workspaces-v2.js",import.meta.url),"utf8");
const html=readFileSync(new URL("../public/ui-preview/index.html",import.meta.url),"utf8");
const css=readFileSync(new URL("../public/ui-preview/workspaces-v2.css",import.meta.url),"utf8");

function harness(){
  const fields={};
  const listeners={};
  const persisted=new Map();
  const messages=[];
  const patients=[
    {id:"p1",name:"Sari Amelia",mrn:"RM-DEMO-0083",age:"42 th · P",unit:"Poli Penyakit Dalam",payer:"BPJS",visit:"ENC-DEMO-247"},
    {id:"p2",name:"Demo <script>",mrn:"RM-DEMO-0094",age:"61 th · L",unit:"Poli Jantung",payer:"Umum",visit:"ENC-DEMO-248"}
  ];
  const document={
    addEventListener(name,fn){listeners[name]=fn;},
    getElementById(id){return fields[id]||null;},
    querySelector(){return {focus(){}};}
  };
  const window={addEventListener(){},__SIMRS_PREVIEW__:null};
  const sandbox={document,window,location:{hash:""},localStorage:{
    getItem(key){return persisted.get(key)||null;},
    setItem(key,val){persisted.set(key,val);},
    removeItem(key){persisted.delete(key);}
  }};
  runInNewContext(source,sandbox,{timeout:1000});
  const api=window.SIMRSWorkspacesV2;
  const shell={patients,state:{active:"front",role:"Pendaftaran",patient:"p1",clinicalTab:"soap"},render(){},toast(x){messages.push(x);}};
  window.__SIMRS_PREVIEW__=shell;
  const click=(cmd)=>listeners.click({
    target:{closest(selector){return selector==="[data-ux-action]"?{getAttribute(){return cmd;}}:null;}},
    preventDefault(){},stopImmediatePropagation(){}
  });
  const set=(id,value,checked)=>{fields[id]={value,checked:!!checked,hidden:true,textContent:""};};
  return {api,patients,shell,fields,messages,click,set,location:sandbox.location};
}

test("active root loads both role-based workspaces and style sheet",()=>{
  assert.match(html,/\.\/workspaces-v2\.js/);
  assert.match(html,/\.\/workspaces-v2\.css/);
  assert.match(html,/id="role-nav"/);
  assert.match(css,/ux-main-grid/);
  assert.doesNotMatch(source,/\bfetch\s*\(|XMLHttpRequest|sendBeacon/);
});

test("front office has scoped identity, worklist and registration actions",()=>{
  const h=harness();
  const out=h.api.front({state:h.shell.state,patients:h.patients});
  assert.match(out,/Daftar pasien hari ini/);
  assert.match(out,/id="ux-registration"/);
  assert.match(out,/data-ux-action="mpi"/);
  assert.match(out,/data-ux-action="checkin-front"/);
  assert.match(out,/ENC-DEMO-247/);
  assert.doesNotMatch(out,/<script>/);
  assert.match(out,/Demo &lt;script&gt;/);
  assert.equal(h.api.shortcuts("Pendaftaran")[0][0],"Registrasi");
  assert.equal(h.api.shortcuts("Dokter RJ")[0][0],"SOAP / CPPT");
});

test("front office rejects premature check-in and never duplicates local status",()=>{
  const h=harness();
  h.set("ux-visit-type","Rawat Jalan");h.set("ux-reg-unit","Poli Penyakit Dalam");
  h.set("ux-reg-payer","BPJS");h.set("ux-reg-doctor","dr. Andi Demo");
  h.set("ux-reg-reason","Kontrol");
  h.set("ux-reg-error","");
  h.click("checkin-front");
  assert.equal(Object.keys(h.api.getStore().front).length,0);
  h.click("mpi");
  h.click("checkin-front");
  assert.equal(!!h.api.getStore().front["p1|ENC-DEMO-247"].checkedIn,false);
  h.click("save-front");
  assert.equal(h.api.getStore().front["p1|ENC-DEMO-247"].draftSaved,true);
  h.click("checkin-front");
  assert.equal(h.api.getStore().front["p1|ENC-DEMO-247"].checkedIn,true);
  const count=Object.keys(h.api.getStore().front).length;
  h.click("checkin-front");
  assert.equal(Object.keys(h.api.getStore().front).length,count);
});

test("clinical SOAP is patient-scoped, review-gated, and cannot be edited after review",()=>{
  const h=harness();
  h.shell.state.role="Dokter RJ";
  let out=h.api.clinical({state:h.shell.state,patients:h.patients});
  assert.match(out,/data-ux-action="doctor-review"/);
  assert.match(out,/data-ux-action="module:RME-08"/);
  h.set("ux-soap-s","");
  h.set("ux-soap-o","TTV sintetis");
  h.set("ux-soap-a","Evaluasi");
  h.set("ux-soap-p","Rencana");
  h.set("ux-allergy","",false);
  h.set("ux-soap-error","");
  h.click("doctor-review");
  assert.equal(Object.keys(h.api.getStore().doctor).length,0);
  h.set("ux-soap-s","Keluhan contoh");
  h.set("ux-allergy","",true);
  h.click("doctor-review");
  const record=h.api.getStore().doctor["p1|ENC-DEMO-247"];
  assert.equal(record.status,"Reviewed (Demo)");
  assert.equal(record.versions.length,1);
  out=h.api.clinical({state:h.shell.state,patients:h.patients});
  assert.match(out,/data-ux-action="doctor-addendum"/);
  h.click("doctor-save");
  assert.equal(h.api.getStore().doctor["p1|ENC-DEMO-247"].versions.length,1);
  h.click("doctor-addendum");
  assert.equal(h.api.getStore().doctor["p1|ENC-DEMO-247"].revision,2);
  assert.equal(h.api.getStore().doctor["p1|ENC-DEMO-247"].status,"Draft");
  assert.equal(h.api.getStore().doctor["p2|ENC-DEMO-248"],undefined);
});

test("deep linking chooses work area and does not accept arbitrary paths",()=>{
  const h=harness();
  h.location.hash="#/clinical/diagnosis";
  h.api.routeFromHash(h.shell.state);
  assert.equal(h.shell.state.active,"clinical");
  assert.equal(h.shell.state.clinicalTab,"diagnosis");
  h.location.hash="#/clinical/<script>";
  h.api.routeFromHash(h.shell.state);
  assert.equal(h.shell.state.clinicalTab,"diagnosis");
});
