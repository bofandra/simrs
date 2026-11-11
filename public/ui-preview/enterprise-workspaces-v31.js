/* SIMRS UI/UX V31-V33: Finance & Enterprise F3, S09/S10/S11/S13.
 * Presentation-only decoration of the existing role-authorized synthetic worklists.
 * Never creates, approves, pays, submits, releases, or changes any record.
 */
(function(){
 "use strict";
 var shell=window.__SIMRS_PREVIEW__;
 var auth=window.SIMRSRoleDemo;
 var lists=window.SIMRSRoleUXV5;
 var profiles=window.SIMRSRoleUXV4;
 if(!shell||!auth||!lists||!profiles||typeof shell.render!=="function")return;
 var original=shell.render;
 var roles={
  "Kasir":{screen:"S09",kind:"finance",title:"Loket pembayaran",subtitle:"Tagihan pasien, penjamin, saldo dan pemeriksaan alokasi",object:"Invoice / tagihan",checks:["Cocokkan tagihan dengan pasien, kunjungan dan penjamin.","Tinjau saldo sebelum menyiapkan alokasi; cegah kelebihan bayar.","Pembayaran, kuitansi dan rekonsiliasi tidak dieksekusi di mockup."]},
  "Petugas Billing":{screen:"S09",kind:"finance",title:"Review charge dan invoice",subtitle:"Sumber layanan, tarif yang berlaku dan invoice draft",object:"Charge / invoice",checks:["Pastikan tiap charge mempunyai sumber tindakan yang unik.","Periksa versi tarif, penjamin dan risiko duplikasi.","Pembuatan invoice riil dan posting keuangan tidak tersedia."]},
  "Casemix":{screen:"S09",kind:"finance",title:"Telaah berkas casemix",subtitle:"Kelengkapan berkas, grouping dan status klaim",object:"Berkas klaim",checks:["Pastikan dokumen episode dan coding lengkap sebelum review.","Bedakan hasil grouping internal dari respons penjamin.","Tidak ada pengajuan, approval, atau pembayaran klaim nyata."]},
  "Manajemen RS":{screen:"S10",kind:"management",title:"Prioritas operasional rumah sakit",subtitle:"Indikator, sumber data, periode dan tindak lanjut pengecualian",object:"Indikator / laporan",checks:["Validasi definisi indikator, pembilang dan penyebut.","Periksa periode, cakupan unit serta kesegaran data.","Angka pada demo bukan KPI RS aktual dan tidak boleh dipakai mengambil keputusan nyata."]},
  "Tim Mutu":{screen:"S10",kind:"management",title:"Pemantauan mutu dan keselamatan",subtitle:"Indikator mutu, variasi dan daftar tindak lanjut",object:"Indikator mutu",checks:["Periksa denominator serta kriteria inklusi dan eksklusi.","Bedakan dugaan variasi dari insiden yang sudah diverifikasi.","Tindak lanjut pada mockup bukan bukti pelaksanaan perbaikan."]},
  "Integrasi":{screen:"S10",kind:"management",title:"Pemantauan integrasi",subtitle:"Antrian, acknowledgement, retry dan pengecualian",object:"Event / integrasi",checks:["Bedakan status kirim internal dari ACK sistem eksternal.","Periksa korelasi event dan kemungkinan pengiriman berulang.","Tidak ada retry, pengiriman FHIR atau klaim ke sistem nyata."]},
  "Admin Sistem":{screen:"S11",kind:"admin",title:"Pengguna dan kewenangan",subtitle:"Akun, role, penugasan unit, master dan jejak akses",object:"Akun / permintaan",checks:["Periksa organisasi, unit, profesi, masa berlaku dan pemohon.","Pemberian hak berisiko perlu approval terpisah dan audit.","Demo tidak mengubah akses, autentikasi atau kebijakan produksi."]},
  "HR Admin":{screen:"S11",kind:"admin",title:"Direktori dan penugasan staf",subtitle:"Direktori demo, masa berlaku penugasan dan administrasi SDM",object:"Staf / penugasan",checks:["Verifikasi identitas staf serta hubungan dengan unit kerja.","Bedakan data contoh dari registri praktisi yang terverifikasi.","Tidak ada pembuatan akun atau perubahan privilege produksi."]},
  "Petugas MCU":{screen:"S13",kind:"mcu",title:"Layanan peserta MCU",subtitle:"Peserta, paket, stasiun pemeriksaan dan hasil tertunda",object:"Peserta / paket",checks:["Periksa peserta dan paket sebelum memilih pekerjaan.","Tandai hasil yang tertunda sebagai belum lengkap, bukan lulus.","Resume dan pengungkapan ke perusahaan memerlukan otorisasi dokter."]},
  "Koordinator MCU":{screen:"S13",kind:"mcu",title:"Koordinasi paket MCU",subtitle:"Jadwal, alur pemeriksaan dan pengecualian kelengkapan",object:"Paket / jadwal",checks:["Periksa komponen paket dan stasiun yang belum selesai.","Hasil belum tersedia harus tetap terlihat sebagai tertunda.","Tidak ada penerbitan resume atau disclosure data kesehatan nyata."]}
 };
 function el(tag,cls,value){
  var node=document.createElement(tag);
  if(cls)node.className=cls;
  if(value!==undefined)node.textContent=String(value);
  return node;
 }
 function cmd(label,action){
  var node=el("button","v31-action",label);
  node.type="button";node.setAttribute("data-v31-focus",action);
  return node;
 }
 function selection(role,section,index){
  try{return lists.selectionContext(role,section,index,shell.patients);}
  catch(_e){return null;}
 }
 function decorate(){
  var account=auth.getAccount&&auth.getAccount();
  if(!account||account.reviewer||shell.state.active!=="rolehome")return;
  var spec=roles[account.role];
  if(!spec||!profiles.getProfile(account.role))return;
  var root=document.querySelector("#main-content .uxv5");
  if(!root||root.getAttribute("data-uxv4-role")!==account.role||
     root.classList.contains("v31-enterprise"))return;
  var head=root.querySelector(".uxv4-head");
  var guide=root.querySelector(".v18-workflow");
  var layout=root.querySelector(".uxv5-layout");
  var list=layout&&layout.closest(".uxv4-panel");
  var summary=root.querySelector(".uxv5-summary");
  if(!head||!guide||!list||!summary)return;
  var section=auth.getCurrentSection&&auth.getCurrentSection()||"home";
  var jobs=lists.jobRows(account.role,section)||[];
  var index=Number(auth.getCurrentJobIndex&&auth.getCurrentJobIndex());
  if(!Number.isInteger(index)||index<0||index>=jobs.length)index=0;
  var current=jobs[index]||null;
  var binding=current&&selection(account.role,section,index);
  // Never surface a synthetic patient as the subject of an administrative or
  // aggregate management task, even if a generic demo fixture has one.
  var patient=(spec.kind==="admin"||spec.kind==="management")?null:
    binding&&binding.kind==="patient"&&binding.patient||null;
  root.classList.add("v31-enterprise");
  root.setAttribute("data-v31-screen",spec.screen);
  root.setAttribute("data-v31-kind",spec.kind);
  head.insertAdjacentElement("afterend",guide);
  guide.classList.add("v31-hero");
  var copy=guide.querySelector(".v18-workflow-copy");
  if(copy){
   var eyebrow=copy.querySelector(".v18-overline");
   if(eyebrow)eyebrow.textContent=spec.screen+" · "+account.role+" · DATA SIMULASI";
   var title=copy.querySelector("h2");
   if(title)title.textContent=spec.title;
   var paragraph=copy.querySelector("p");
   if(paragraph)copy.insertBefore(el("p","v31-subtitle",spec.subtitle),paragraph);
   var controls=el("div","v31-actions");
   controls.appendChild(cmd("Buka daftar pekerjaan","list"));
   controls.appendChild(cmd("Periksa alur kerja","guide"));
   copy.appendChild(controls);
  }
  var chip=guide.querySelector(".v18-workflow-chip");
  if(chip)chip.textContent=jobs.length+" pekerjaan demo";
  var safety=guide.querySelector(".v18-safety-strip");
  if(safety)safety.appendChild(el("span","v31-safe-note"," Tidak ada transaksi atau approval nyata."));
  var ctx=root.querySelector(".v12-context");
  if(!ctx&&(spec.kind==="admin"||spec.kind==="management")){
   // Tim Mutu, Integrasi and HR Admin did not receive V12's context banner.
   // Add an object-only context consistently rather than implying a patient.
   ctx=el("div","v12-context");
   ctx.appendChild(el("div","v12-context-title"));
   ctx.appendChild(el("div","v12-context-chips"));
   summary.insertAdjacentElement("beforebegin",ctx);
  }
  if(ctx){
   ctx.classList.add("v31-context");
   ctx.setAttribute("data-v31-context",patient?"patient":"object");
   ctx.setAttribute("aria-live","polite");
   if(spec.kind==="admin"||spec.kind==="management"){
    // V12 may generate a generic patient-oriented context for some fixtures.
    // Render these enterprise tasks strictly as objects, not as patient episodes.
    var titleRoot=ctx.querySelector(".v12-context-title");
    if(titleRoot){
     titleRoot.replaceChildren(
      el("span","v12-context-eyebrow",account.role+" · DATA DEMO"),
      el("strong",null,current?current.title:"Pekerjaan unit"),
      el("small",null,spec.object+" · pekerjaan administratif / agregat")
     );
    }
    var chips=ctx.querySelector(".v12-context-chips");
    if(chips)chips.replaceChildren(
     el("span",null,current?current.id:"—"),
     el("span",null,"Tanpa tautan pasien")
    );
   }
  }
  var featurePanels=Array.prototype.filter.call(root.querySelectorAll(".uxv4-panel"),function(panel){
   return !!panel.querySelector(".uxv4-features");
  });
  if(featurePanels.length===1&&featurePanels[0]!==list){
   list.insertAdjacentElement("afterend",featurePanels[0]);
   featurePanels[0].classList.add("v31-other-areas");
   var otherTitle=featurePanels[0].querySelector(".uxv4-panel-head h2");
   if(otherTitle)otherTitle.textContent="Area lain sesuai kewenangan";
  }
  list.classList.add("v31-worklist");
  list.setAttribute("data-v31-worklist","");
  var heading=list.querySelector(".uxv4-panel-head h2");
  if(heading){
   heading.id="v31-worklist-heading";
   list.setAttribute("aria-labelledby",heading.id);
  }
  var selectionRow=el("div","v31-selected");
  selectionRow.setAttribute("aria-label","Objek pekerjaan terpilih, data sintetis");
  selectionRow.appendChild(el("span","v31-selected-type",spec.object+" · CONTOH"));
  if(current){
   selectionRow.appendChild(el("strong","v31-selected-id",current.id||"—"));
   selectionRow.appendChild(el("span","v31-selected-name",current.title||"Objek simulasi"));
   selectionRow.appendChild(el("span","v31-selected-status","Status pekerjaan demo: "+(current.status||"Belum ditentukan")));
  }else selectionRow.appendChild(el("span","v31-selected-name","Tidak ada pekerjaan pada bagian ini"));
  if(patient)selectionRow.appendChild(el("small","v31-patient","Konteks demo: "+(patient.mrn||"RM simulasi")+" · "+(patient.visit||"Encounter simulasi")));
  head.appendChild(selectionRow);
  var review=el("section","v31-review");
  review.setAttribute("aria-label","Daftar pemeriksaan sebelum tindakan");
  review.appendChild(el("h3",null,"Periksa sebelum melanjutkan"));
  var checks=el("ul","v31-checklist");
  spec.checks.forEach(function(item){checks.appendChild(el("li",null,item));});
  review.appendChild(checks);
  review.appendChild(el("p","v31-review-note","Panduan baca-saja. Checklist bukan tanda telah dikerjakan atau disetujui."));
  list.insertAdjacentElement("afterend",review);
 }
 shell.render=function(){
  var result=original.apply(this,arguments);
  decorate();
  return result;
 };
 document.addEventListener("click",function(event){
  var btn=event.target&&event.target.closest&&event.target.closest("[data-v31-focus]");
  if(!btn)return;
  var root=btn.closest(".v31-enterprise");if(!root)return;
  event.preventDefault();
  if(btn.getAttribute("data-v31-focus")==="list"){
   var panel=root.querySelector("[data-v31-worklist]");
   var search=panel&&panel.querySelector("#uxv5-search");
   if(panel)panel.scrollIntoView({block:"start",behavior:"auto"});
   if(search)search.focus({preventScroll:true});
  }else if(btn.getAttribute("data-v31-focus")==="guide"){
   var details=root.querySelector(".v31-hero .v18-workflow-details");
   if(details){
    details.open=true;
    var sum=details.querySelector("summary");
    if(sum){sum.focus({preventScroll:true});sum.scrollIntoView({block:"nearest"});}
   }
  }
 });
 decorate();
 window.SIMRSEnterpriseUXV31={
  screens:Object.keys(roles).map(function(role){
   return {role:role,screen:roles[role].screen,kind:roles[role].kind};
  }),
  decorate:decorate
 };
})();
