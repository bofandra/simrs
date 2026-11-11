/* SIMRS UI/UX V28-V30: support service workspaces S06/S07/S08/S12.
 * Presentation only. Reuses the existing role-scoped synthetic worklist and context.
 * No RBAC changes, clinical decisions, stock, bed, dispensing or other transactions.
 */
(function(){
 "use strict";
 var shell=window.__SIMRS_PREVIEW__;
 var demo=window.SIMRSRoleDemo;
 var lists=window.SIMRSRoleUXV5;
 var profiles=window.SIMRSRoleUXV4;
 if(!shell||!demo||!lists||!profiles||typeof shell.render!=="function")return;
 var previous=shell.render;
 var roles={
  "Bed Manager":{screen:"S06",kind:"bed",title:"Ketersediaan dan penempatan bed",subtitle:"Permintaan rawat inap, kelas perawatan, kesiapan bed dan koordinasi antarunit",guard:"Periksa kelas, ruang, kesiapan dan penugasan. Tidak ada reservasi atau pemindahan bed aktual."},
  "ATLM":{screen:"S07",kind:"lab",title:"Alur kerja laboratorium",subtitle:"Order, identitas spesimen, proses/QC, hasil dan pemeriksaan sebelum verifikasi",guard:"Cocokkan order dengan label spesimen dan identitas pasien. Status kritis tetap perlu konfirmasi manual."},
  "Farmasis":{screen:"S08",kind:"pharmacy",title:"Telaah resep dan farmasi",subtitle:"Resep masuk, alergi, dosis, stok/lot dan rencana penyiapan",guard:"Periksa alergi, dosis, rute, lot dan kedaluwarsa. Tidak ada dispensing atau mutasi stok aktual."},
  "Radiografer":{screen:"S12",kind:"imaging",title:"Daftar pemeriksaan radiologi",subtitle:"Order, identitas studi, persiapan modalitas dan pemeriksaan kualitas",guard:"Periksa order, accession, studi dan identitas. Tidak ada akuisisi atau pengiriman DICOM aktual."},
  "Radiolog":{screen:"S12",kind:"imaging",title:"Pembacaan hasil radiologi",subtitle:"Worklist studi, konteks klinis, laporan dan pemeriksaan sebelum review",guard:"Verifikasi kecocokan studi dan pasien; gambar contoh bukan viewer diagnostik dan tidak ada release hasil."}
 };
 function element(tag,className,label){
  var el=document.createElement(tag);
  if(className)el.className=className;
  if(label!=null)el.textContent=String(label);
  return el;
 }
 function button(text,kind){
  var el=element("button","v28-command",text);
  el.type="button";
  el.setAttribute("data-v28-focus",kind);
  return el;
 }
 function contextFor(role,section,index){
  try{return lists.selectionContext(role,section,index,shell.patients);}
  catch(_error){return null;}
 }
 function decorate(){
  var account=demo.getAccount&&demo.getAccount();
  if(!account||account.reviewer||shell.state.active!=="rolehome")return;
  var spec=roles[account.role];if(!spec||!profiles.getProfile(account.role))return;
  var root=document.querySelector('#main-content .uxv5[data-uxv4-role="'+account.role+'"]');
  if(!root||root.classList.contains("v28-support"))return;
  var head=root.querySelector(".uxv4-head");
  var guide=root.querySelector(".v18-workflow");
  var summary=root.querySelector(".uxv5-summary");
  var layout=root.querySelector(".uxv5-layout");
  var worklist=layout&&layout.closest(".uxv4-panel");
  if(!head||!guide||!summary||!worklist)return;
  var section=demo.getCurrentSection&&demo.getCurrentSection()||"home";
  var jobs=lists.jobRows(account.role,section)||[];
  var index=Number(demo.getCurrentJobIndex&&demo.getCurrentJobIndex());
  if(!Number.isInteger(index)||index<0||index>=jobs.length)index=0;
  var selected=jobs[index]||null;
  var link=selected&&contextFor(account.role,section,index);
  var patient=link&&link.patient||null;
  root.classList.add("v28-support");
  root.setAttribute("data-v28-screen",spec.screen);
  root.setAttribute("data-v28-kind",spec.kind);
  // The patient and encounter are always sourced from the selected job; bed
  // requests do not inherit an unrelated patient from the previous session.
  if(spec.kind==="bed")patient=null;
  var headline=guide.querySelector(".v18-workflow-copy");
  if(headline){
   var code=headline.querySelector(".v18-overline");
   if(code)code.textContent=spec.screen+" · "+account.role+" · DATA SIMULASI";
   var title=headline.querySelector("h2");
   if(title)title.textContent=spec.title;
   var description=headline.querySelector("p");
   if(description){
    var caption=element("p","v28-caption",spec.subtitle);
    headline.insertBefore(caption,description);
    description.classList.add("v28-job-summary");
   }
   var controls=element("div","v28-controls");
   controls.appendChild(button("Buka antrean pekerjaan","worklist"));
   controls.appendChild(button("Lihat panduan alur","guide"));
   headline.appendChild(controls);
  }
  var safety=guide.querySelector(".v18-safety-strip");
  if(safety)safety.appendChild(element("span","v28-extra-guard"," "+spec.guard));
  var badge=guide.querySelector(".v18-workflow-chip");
  if(badge)badge.textContent=String(jobs.length)+" pekerjaan demo";
  guide.classList.add("v28-hero");
  // For imaging, preserve the V14 above-the-fold accession/study action.
  // Move detailed guidance after the actionable worklist, not before it.
  var existingContext=root.querySelector(".v12-context");
  if(existingContext){
   existingContext.classList.add("v28-context");
   existingContext.setAttribute("aria-live","polite");
   existingContext.setAttribute("data-v28-context",patient?"patient":"object");
   var chips=existingContext.querySelector(".v12-context-chips");
   if(chips&&patient&&patient.payer)chips.appendChild(element("span","v28-payer","Penjamin: "+patient.payer));
  }
  var panels=Array.prototype.filter.call(root.querySelectorAll(".uxv4-panel"),function(panel){
   return !!panel.querySelector(".uxv4-features");
  });
  if(panels.length===1&&panels[0]!==worklist){
   worklist.insertAdjacentElement("afterend",panels[0]);
   panels[0].classList.add("v28-other-areas");
   var otherTitle=panels[0].querySelector(".uxv4-panel-head h2");
   if(otherTitle)otherTitle.textContent="Area pekerjaan lain sesuai akun";
  }
  if(spec.kind==="imaging"){
   worklist.insertAdjacentElement("afterend",guide);
   guide.classList.add("v28-after-list");
  }else{
   head.insertAdjacentElement("afterend",guide);
  }
  worklist.classList.add("v28-primary-worklist");
  worklist.setAttribute("data-v28-worklist","");
  var titleNode=worklist.querySelector(".uxv4-panel-head h2");
  if(titleNode){
   titleNode.id="v28-worklist-heading";
   worklist.setAttribute("aria-labelledby",titleNode.id);
  }
  var contextLabel=spec.kind==="bed"?"Objek bed / permintaan":spec.kind==="imaging"?"Studi / pekerjaan":spec.kind==="lab"?"Spesimen / pekerjaan":"Resep / pekerjaan";
  if(selected){
   var selection=element("div","v28-selected-task");
   selection.setAttribute("aria-label","Pekerjaan terpilih pada daftar simulasi");
   selection.appendChild(element("span","v28-selected-overline",contextLabel+" · DATA DEMO"));
   selection.appendChild(element("strong","v28-selected-id",selected.id||"—"));
   selection.appendChild(element("span","v28-selected-title",selected.title||"Objek contoh"));
   selection.appendChild(element("span","v28-selected-status","Status contoh: "+(selected.status||"Belum ditentukan")));
   if(patient)selection.appendChild(element("small","v28-selected-patient","Konteks: "+(patient.mrn||"RM-DEMO")+" · "+(patient.visit||"Encounter demo")));
   head.appendChild(selection);
  }
 }
 shell.render=function(){
  var result=previous.apply(this,arguments);
  decorate();
  return result;
 };
 document.addEventListener("click",function(event){
  var target=event.target.closest("[data-v28-focus]");
  if(!target)return;
  var root=target.closest(".v28-support");
  if(!root)return;
  event.preventDefault();
  var action=target.getAttribute("data-v28-focus");
  if(action==="worklist"){
   var panel=root.querySelector("[data-v28-worklist]");
   var input=panel&&panel.querySelector("#uxv5-search");
   if(panel)panel.scrollIntoView({block:"start",behavior:"auto"});
   if(input)input.focus({preventScroll:true});
  }else if(action==="guide"){
   var details=root.querySelector(".v28-hero .v18-workflow-details");
   if(details){
    details.open=true;
    var summary=details.querySelector("summary");
    if(summary){summary.focus({preventScroll:true});summary.scrollIntoView({block:"nearest"});}
   }
  }
 });
 decorate();
 window.SIMRSSupportUXV28={screens:Object.keys(roles).map(function(role){
  return {role:role,screen:roles[role].screen};
 }),decorate:decorate};
})();