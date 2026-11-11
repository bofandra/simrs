/* SIMRS V34-V36 / F4: role-native advanced service and patient portal workspaces.
 * Decorates already-authorized synthetic worklists only. No real clinical,
 * bed, blood, inventory, billing, portal disclosure or integration actions.
 */
(function(){
"use strict";
var shell=window.__SIMRS_PREVIEW__;
var auth=window.SIMRSRoleDemo;
var lists=window.SIMRSRoleUXV5;
var profiles=window.SIMRSRoleUXV4;
if(!shell||!auth||!lists||!profiles||typeof shell.render!=="function")return;
var previous=shell.render;
var roles={
 "Koordinator OK":{
  kind:"clinical",title:"Koordinasi kamar operasi",subtitle:"Jadwal operasi, kesiapan tim, ruang dan serah terima",
  object:"Jadwal operasi",warning:"Time-out, persetujuan dan kesiapan instrumen harus dilakukan sesuai SOP di sistem dan proses yang berwenang; tidak ada booking atau tindakan nyata."
 },
 "Dokter Anestesi":{
  kind:"clinical",title:"Ruang kerja anestesi",subtitle:"Asesmen pra-anestesi, pemantauan dan pemulihan",
  object:"Kunjungan anestesi",warning:"Data monitor adalah contoh. Tidak ada tindakan anestesi, tanda tangan atau keputusan pemindahan pasien dari mockup."
 },
 "Perawat HD":{
  kind:"clinical",title:"Daftar sesi hemodialisis",subtitle:"Kesiapan tindakan, observasi dan serah terima per sesi",
  object:"Sesi HD",warning:"Identitas, order, akses vaskular dan kesiapan mesin perlu diperiksa tenaga klinis. Tidak ada tindakan dialisis atau koneksi alat."
 },
 "Terapis Rehabilitasi":{
  kind:"clinical",title:"Layanan rehabilitasi medik",subtitle:"Jadwal sesi, rencana terapi dan evaluasi outcome",
  object:"Sesi rehabilitasi",warning:"Hanya catatan demo. Tidak ada konfirmasi pelaksanaan tindakan, penilaian outcome otomatis atau perubahan rencana klinis."
 },
 "Ahli Gizi":{
  kind:"clinical",title:"Asuhan gizi pasien",subtitle:"Skrining, asesmen, order diet dan evaluasi asupan",
  object:"Asuhan gizi",warning:"Diet pasien membutuhkan penilaian dan persetujuan klinis. Draft di sini tidak dikirim menjadi instruksi dapur."
 },
 "Petugas Dapur":{
  kind:"operations",title:"Produksi makanan pasien",subtitle:"Permintaan tray, batch produksi dan tujuan distribusi",
  object:"Tray / batch",warning:"Cocokkan label alergi dan instruksi diet yang sah. Tidak ada produksi, alokasi tray atau distribusi makanan nyata."
 },
 "Petugas CSSD":{
  kind:"operations",title:"Manajemen instrumen steril",subtitle:"Set instrumen, status siklus, indikator dan serah terima",
  object:"Set / batch",warning:"Release steril memerlukan bukti siklus dan otorisasi. Mockup tidak mencatat sterilitas atau mendistribusikan set."
 },
 "Petugas Laundry":{
  kind:"operations",title:"Pengelolaan linen",subtitle:"Penerimaan, proses, selisih dan serah terima linen",
  object:"Linen / batch",warning:"Pisahkan kategori infeksius, cek kuantitas dan bukti proses. Tidak ada mutasi persediaan atau release distribusi."
 },
 "Pasien Demo":{
  kind:"portal",title:"Layanan kesehatan saya",subtitle:"Janji temu dan dokumen yang tersedia pada akun contoh ini",
  object:"Janji temu / dokumen",warning:"Portal hanya contoh dengan satu identitas sintetis. Bukan akses RME nasional, tidak ada booking, dokumen klinis nyata atau unduhan."
 }
};
function make(tag,cls,value){
 var node=document.createElement(tag);
 if(cls)node.className=cls;
 if(value!==undefined)node.textContent=String(value);
 return node;
}
function focusButton(label,action){
 var node=make("button","v34-action",label);
 node.type="button";
 node.setAttribute("data-v34-action",action);
 return node;
}
function context(role,section,index){
 try{return lists.selectionContext(role,section,index,shell.patients);}
 catch(_error){return null;}
}
function decorate(){
 var account=auth.getAccount&&auth.getAccount();
 if(!account||account.reviewer||shell.state.active!=="rolehome")return;
 var spec=roles[account.role];
 if(!spec||!profiles.getProfile(account.role))return;
 var root=document.querySelector("#main-content .uxv5");
 if(!root||root.getAttribute("data-uxv4-role")!==account.role||
    root.classList.contains("v34-advanced"))return;
 var header=root.querySelector(".uxv4-head");
 var layout=root.querySelector(".uxv5-layout");
 var worklist=layout&&layout.closest(".uxv4-panel");
 var metrics=root.querySelector(".uxv5-summary");
 if(!header||!worklist||!metrics)return;
 var section=auth.getCurrentSection&&auth.getCurrentSection()||"home";
 var jobs=lists.jobRows(account.role,section)||[];
 var index=Number(auth.getCurrentJobIndex&&auth.getCurrentJobIndex());
 if(!Number.isInteger(index)||index<0||index>=jobs.length)index=0;
 var selected=jobs[index]||null;
 var linked=selected&&context(account.role,section,index);
 var patient=linked&&linked.kind==="patient"&&linked.patient||null;
 if(spec.kind==="operations")patient=null;
 // The portal is confined to the single selfOnly synthetic patient of V11.
 // This is a UI invariant, not production identity authentication.
 if(spec.kind==="portal"){
  var self=shell.patients&&shell.patients[0];
  if(!self||!patient||patient.id!==self.id)patient=null;
 }
 root.classList.add("v34-advanced");
 root.setAttribute("data-v34-role",spec.kind);
 root.setAttribute("data-v34-owner",account.role);
 var hero=make("section","v34-hero");
 hero.setAttribute("aria-label",spec.kind==="portal"?"Ringkasan akun portal contoh":"Ringkasan pekerjaan sesuai profesi");
 var heroCopy=make("div","v34-hero-copy");
 heroCopy.appendChild(make("span","v34-eyebrow",spec.kind==="portal"?"AKUN PASIEN SIMULASI":"RUANG KERJA · DATA SIMULASI"));
 heroCopy.appendChild(make("h2",null,spec.title));
 heroCopy.appendChild(make("p","v34-subtitle",spec.subtitle));
 var line=make("p","v34-active");
 line.appendChild(make("strong",null,selected?(selected.id+" · "+selected.title):"Belum ada tugas dipilih"));
 line.appendChild(make("span",null,selected?(" — "+selected.reason):""));
 heroCopy.appendChild(line);
 var controls=make("div","v34-commands");
 controls.appendChild(focusButton(spec.kind==="portal"?"Lihat daftar saya":"Buka daftar kerja","worklist"));
 controls.appendChild(focusButton("Lihat panduan pemeriksaan","checks"));
 heroCopy.appendChild(controls);
 hero.appendChild(heroCopy);
 var count=make("div","v34-count");
 count.appendChild(make("span",null,spec.kind==="portal"?"Item akun demo":"Pekerjaan demo"));
 count.appendChild(make("strong",null,jobs.length));
 count.appendChild(make("small",null,"Bukan data pelayanan aktual"));
 hero.appendChild(count);
 header.insertAdjacentElement("afterend",hero);
 var selection=make("section","v34-selection");
 selection.setAttribute("aria-label",spec.kind==="portal"?"Identitas dan konteks akun pasien demo":"Konteks pekerjaan terpilih");
 selection.appendChild(make("span","v34-selection-type",spec.object+" · SIMULASI"));
 if(selected){
  selection.appendChild(make("strong","v34-selection-id",selected.id));
  selection.appendChild(make("span","v34-selection-title",selected.title));
  selection.appendChild(make("span","v34-selection-status","Status demo: "+selected.status));
  selection.appendChild(make("small","v34-selection-scope",selected.scope));
 }
 if(patient){
  selection.appendChild(make("p","v34-patient","Konteks sintetis: "+(patient.name||"Pasien demo")+" · "+(patient.mrn||"RM demo")+" · "+(patient.visit||"Episode demo")));
 }else if(spec.kind==="clinical"||spec.kind==="portal"){
  selection.appendChild(make("p","v34-missing-context","Konteks pasien belum tersedia. Form berkonteks pasien harus ditolak tanpa tautan yang valid."));
 }else{
  selection.appendChild(make("p","v34-object-only","Objek kerja nonpasien: tidak ada pasien atau encounter yang ditautkan."));
 }
 // Existing worklist and permitted form CTA remain authoritative; never
 // synthesize a module action or a link to someone else's patient.
 metrics.insertAdjacentElement("afterend",selection);
 var guide=make("details","v34-checks");
 guide.appendChild(make("summary",null,"Panduan sebelum melanjutkan"));
 var list=make("ul","v34-checklist");
 (selected&&Array.isArray(selected.checks)?selected.checks:[]).forEach(function(c){
  list.appendChild(make("li",null,c));
 });
 guide.appendChild(list);
 guide.appendChild(make("p","v34-guard",spec.warning));
 guide.appendChild(make("p","v34-disclaimer","Panduan ini tidak menyatakan bahwa tugas selesai, pasien diverifikasi, atau transaksi disetujui."));
 worklist.insertAdjacentElement("afterend",guide);
 var workTitle=worklist.querySelector(".uxv4-panel-head h2");
 if(workTitle){
  workTitle.id="v34-worklist-heading";
  worklist.setAttribute("aria-labelledby",workTitle.id);
 }
 worklist.classList.add("v34-worklist");
 worklist.setAttribute("data-v34-worklist","");
 var featurePanels=Array.prototype.filter.call(root.querySelectorAll(".uxv4-panel"),function(node){
  return !!node.querySelector(".uxv4-features");
 });
 if(featurePanels.length===1&&featurePanels[0]!==worklist){
  guide.insertAdjacentElement("afterend",featurePanels[0]);
  featurePanels[0].classList.add("v34-other");
  var title=featurePanels[0].querySelector(".uxv4-panel-head h2");
  if(title)title.textContent=spec.kind==="portal"?"Layanan saya lainnya":"Area pekerjaan lainnya";
 }
 if(spec.kind==="portal"){
  var portals=make("nav","v34-portal-nav");
  portals.setAttribute("aria-label","Menu portal pasien contoh");
  for(var i=0;i<2;i++){
   var opt=make("button","v34-portal-link",i===0?"Janji temu saya":"Dokumen saya");
   opt.type="button";
   opt.setAttribute("data-demo-action","section:m"+i);
   if((section==="home"?"m0":section)==="m"+i)opt.setAttribute("aria-current","page");
   portals.appendChild(opt);
  }
  heroCopy.appendChild(portals);
  var col=worklist.querySelector(".uxv4-table thead th:nth-child(2)");
  if(col)col.textContent="Agenda / dokumen saya";
 }
}
shell.render=function(){
 var ret=previous.apply(this,arguments);
 decorate();
 return ret;
};
document.addEventListener("click",function(event){
 var target=event.target&&event.target.closest&&event.target.closest("[data-v34-action]");
 if(!target)return;
 var root=target.closest(".v34-advanced");
 if(!root)return;
 event.preventDefault();
 if(target.getAttribute("data-v34-action")==="worklist"){
  var panel=root.querySelector("[data-v34-worklist]");
  var search=panel&&panel.querySelector("#uxv5-search");
  if(panel)panel.scrollIntoView({block:"start",behavior:"auto"});
  if(search)search.focus({preventScroll:true});
 }else if(target.getAttribute("data-v34-action")==="checks"){
  var details=root.querySelector(".v34-checks");
  if(details){
   details.open=true;
   var summary=details.querySelector("summary");
   if(summary){summary.focus({preventScroll:true});summary.scrollIntoView({block:"nearest"});}
  }
 }
});
decorate();
window.SIMRSAdvancedUXV34={
 roles:Object.keys(roles).map(function(role){return {role:role,kind:roles[role].kind};}),
 decorate:decorate
};
})();