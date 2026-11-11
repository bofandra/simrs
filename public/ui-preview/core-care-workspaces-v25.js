/* SIMRS V25–V26 — role-first presentation for Front Office, Dokter RJ, Perawat and IGD.
 * Reorders existing, authorized worklist DOM; never grants access or writes clinical state.
 * All identifiers, statuses and patient context remain synthetic demo data.
 */
(function(){
"use strict";
var shell=window.__SIMRS_PREVIEW__,auth=window.SIMRSRoleDemo;
var worklists=window.SIMRSRoleUXV5,profiles=window.SIMRSRoleUXV4;
if(!shell||!auth||!worklists||!profiles||typeof shell.render!=="function")return;
var original=shell.render;
var roles={
 "Pendaftaran":{screen:"S02",title:"Meja pendaftaran",caption:"Pencarian identitas, registrasi, check-in dan antrean pasien",kind:"front",caution:"Cocokkan identitas dan kemungkinan pasien duplikat sebelum melanjutkan."},
 "Dokter RJ":{screen:"S03",title:"Ruang konsultasi",caption:"Daftar poli, riwayat pasien, asesmen SOAP dan rencana pelayanan",kind:"clinical",caution:"Baca alergi, riwayat, obat aktif dan episode yang dipilih sebelum dokumentasi."},
 "Perawat":{screen:"S04",title:"Ruang keperawatan",caption:"Pasien dalam penugasan shift, observasi, asuhan dan serah terima",kind:"clinical",caution:"Cocokkan identitas, penugasan shift serta instruksi klinis sebelum pencatatan."},
 "Dokter IGD":{screen:"S05",title:"Ruang pelayanan IGD",caption:"Triage, pemeriksaan darurat, observasi dan disposisi pasien",kind:"emergency",caution:"Status triase dalam demo tidak menentukan kegawatan atau prioritas klinis aktual."}
};
function make(tag,className,value){
 var el=document.createElement(tag);
 if(className)el.className=className;
 if(value!=null)el.textContent=String(value);
 return el;
}
function actionButton(label,action){
 var button=make("button","v25-hero-button",label);
 button.type="button";
 button.setAttribute("data-v25-focus",action);
 return button;
}
function selectedContext(role,section,index){
 try{return worklists.selectionContext(role,section,index,shell.patients);}catch(_error){return null;}
}
function decorate(){
 var account=auth.getAccount&&auth.getAccount();
 if(!account||account.reviewer||shell.state.active!=="rolehome")return;
 var spec=roles[account.role];if(!spec)return;
 var root=document.querySelector("#main-content .uxv5");
 if(!root||root.getAttribute("data-uxv4-role")!==account.role||root.classList.contains("v25-core"))return;
 root.classList.add("v25-core");
 root.setAttribute("data-v25-role",spec.kind);
 root.setAttribute("data-v25-screen",spec.screen);
 var header=root.querySelector(".uxv4-head");
 var guide=root.querySelector(".v18-workflow");
 var context=root.querySelector(".v12-context");
 var summary=root.querySelector(".uxv5-summary");
 var worklistArea=root.querySelector(".uxv5-layout");
 var worklist=worklistArea&&worklistArea.closest(".uxv4-panel");
 if(!header||!guide||!summary||!worklist)return;
 var roleProfile=profiles.getProfile(account.role);
 var section=auth.getCurrentSection&&auth.getCurrentSection()||"home";
 var jobs=worklists.jobRows(account.role,section)||[];
 var index=auth.getCurrentJobIndex&&auth.getCurrentJobIndex()||0;
 if(!Number.isInteger(index)||index<0||index>=jobs.length)index=0;
 var selected=jobs[index];
 var patient=selectedContext(account.role,section,index);
 patient=patient&&patient.patient||null;
 // Put the existing V18 guidance immediately below the professional header.
 // Never duplicate its text, do not alter clinical workflow action controls.
 header.insertAdjacentElement("afterend",guide);
 guide.classList.add("v25-hero");
 var overview=guide.querySelector(".v18-workflow-overview");
 var copy=guide.querySelector(".v18-workflow-copy");
 if(copy){
  var kicker=copy.querySelector(".v18-overline");
  if(kicker)kicker.textContent=spec.screen+" · "+spec.title+" · DATA SIMULASI";
  var title=copy.querySelector("h2");
  if(title)title.textContent=spec.title;
  var description=copy.querySelector("p");
  if(description){
   // V19's existing summary contains the selected work-item ID and reason.
   // Keep it intact so contextual selections remain visible and accessible.
   var profession=make("p","v25-profession-caption",spec.caption);
   copy.insertBefore(profession,description);
   description.classList.add("v25-active-job-summary");
  }
  var commands=make("div","v25-hero-commands");
  commands.appendChild(actionButton("Lihat antrean kerja","worklist"));
  commands.appendChild(actionButton("Tinjau langkah kerja","guidance"));
  copy.appendChild(commands);
 }
 var badge=guide.querySelector(".v18-workflow-chip");
 if(badge)badge.textContent=String(jobs.length)+" pekerjaan demo";
 if(overview)overview.setAttribute("aria-label",spec.title+"; "+jobs.length+" pekerjaan sintetis");
 var note=guide.querySelector(".v18-safety-strip");
 if(note){
   note.setAttribute("data-v25-care","review");
   note.appendChild(make("span","v25-extra-safety"," "+spec.caution));
 }
 if(context){
  context.classList.add("v25-active-context");
  context.setAttribute("aria-live","polite");
  context.setAttribute("aria-atomic","true");
  context.setAttribute("data-v25-context",patient?"patient":"unlinked");
  if(patient){
   var chips=context.querySelector(".v12-context-chips");
   if(chips){
    if(patient.age)chips.appendChild(make("span","v25-context-age",patient.age));
    if(patient.payer)chips.appendChild(make("span","v25-context-payer","Penjamin: "+patient.payer));
   }
  }
 }
 // Move 'Area kerja saya' below the active worklist: task-first, not module-first.
 var featurePanels=Array.prototype.filter.call(root.querySelectorAll(".uxv4-panel"),function(p){
  return !!p.querySelector(".uxv4-features");
 });
 if(featurePanels.length===1&&featurePanels[0]!==worklist){
  var other=featurePanels[0];
  worklist.insertAdjacentElement("afterend",other);
  other.classList.add("v25-related-areas");
  var title=other.querySelector(".uxv4-panel-head h2");
  if(title)title.textContent="Area layanan sesuai profesi";
  var hint=other.querySelector(".uxv4-panel-head p");
  if(hint)hint.textContent="Buka daftar kerja lain sesuai hak akun demo; bukan katalog seluruh modul SIMRS.";
 }
 worklist.classList.add("v25-primary-list");
 worklist.setAttribute("data-v25-main-worklist","");
 var listHeading=worklist.querySelector(".uxv4-panel-head h2");
 if(listHeading)listHeading.setAttribute("id","v25-worklist-heading");
 worklist.setAttribute("aria-labelledby","v25-worklist-heading");
 // Selected item summary is factual for this synthetic worklist, not real clinical acuity.
 if(selected){
  var selectNote=make("div","v25-current-task");
  selectNote.appendChild(make("span","v25-current-label","PEKERJAAN TERPILIH"));
  selectNote.appendChild(make("strong","v25-current-id",selected.id||"—"));
  selectNote.appendChild(make("span","v25-current-title",selected.title||"Objek demo"));
  selectNote.appendChild(make("span","v25-current-state","Status contoh: "+(selected.status||"Belum ditentukan")));
  if(patient)selectNote.appendChild(make("span","v25-current-patient","Konteks: "+(patient.mrn||"RM demo")+" · "+(patient.visit||"Encounter demo")));
  header.appendChild(selectNote);
 }
}
shell.render=function(){
 var result=original.apply(this,arguments);
 decorate();
 return result;
};
document.addEventListener("click",function(event){
 var button=event.target.closest("[data-v25-focus]");
 if(!button)return;
 var roleRoot=button.closest(".v25-core");
 if(!roleRoot)return;
 event.preventDefault();
 var mode=button.getAttribute("data-v25-focus");
 if(mode==="worklist"){
  var panel=roleRoot.querySelector("[data-v25-main-worklist]");
  var target=panel&&panel.querySelector("#uxv5-search");
  if(panel)panel.scrollIntoView({block:"start",behavior:"auto"});
  if(target)target.focus({preventScroll:true});
 }else if(mode==="guidance"){
  var guide=roleRoot.querySelector(".v25-hero .v18-workflow-details");
  if(guide){
   guide.open=true;
   var heading=guide.querySelector("summary");
   if(heading){heading.focus({preventScroll:true});heading.scrollIntoView({block:"nearest"});}
  }
 }
});
decorate();
window.SIMRSCoreCareV25={screens:Object.keys(roles).map(function(role){return {role:role,screen:roles[role].screen};}),decorate:decorate};
})();
