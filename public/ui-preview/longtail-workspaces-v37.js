/* SIMRS F4 V37–V39 — 16 remaining role-first workspaces and explicit UI states.
 * Data and authority come exclusively from the existing role V4/V5/V11 model.
 * No APIs, clinical sign/release, financial posting, stock or partner submissions.
 */
(function(){
"use strict";
var shell=window.__SIMRS_PREVIEW__,auth=window.SIMRSRoleDemo;
var lists=window.SIMRSRoleUXV5,profiles=window.SIMRSRoleUXV4;
if(!shell||!auth||!lists||!profiles||typeof shell.render!=="function")return;
var original=shell.render;
var roles={
 "DPJP Rawat Inap":{group:"clinical",title:"Visite dan perawatan rawat inap",subtitle:"Pasien dalam penugasan, catatan perkembangan, terapi dan persiapan pulang",object:"Episode rawat inap",guard:"Periksa DPJP, alergi, episode dan handover. Tidak ada clinical sign, discharge, resep atau order riil."},
 "Petugas Bank Darah":{group:"clinical",title:"Pelayanan bank darah",subtitle:"Permintaan, identitas komponen, kecocokan dan serah terima",object:"Permintaan komponen",guard:"Crossmatch, kecocokan dan serah terima memerlukan verifikasi sesuai SOP. Tidak ada pelepasan produk darah atau mutasi stok."},
 "Gudang":{group:"operations",title:"Persediaan dan lot gudang",subtitle:"Saldo contoh, permintaan bahan, penerimaan dan pengecualian",object:"Stok / lot",guard:"Cek lot, expiry, penanggung jawab dan jejak transaksi. Tidak ada reservasi, mutasi atau posting stok."},
 "Pengadaan":{group:"operations",title:"Pengadaan dan vendor",subtitle:"Permintaan pembelian, pembanding penawaran dan dokumen PO",object:"Permintaan pembelian",guard:"Tidak ada persetujuan anggaran, pemilihan vendor, PO resmi atau penerimaan inventori dari prototipe."},
 "Petugas Aset":{group:"operations",title:"Inventaris dan pemeliharaan aset",subtitle:"Identitas aset, lokasi, riwayat dan permintaan mutasi",object:"Aset",guard:"Perpindahan aset, perubahan lokasi produksi dan pencatatan ledger membutuhkan otorisasi sistem nyata."},
 "Teknisi":{group:"operations",title:"Pemeliharaan dan kalibrasi",subtitle:"Tiket pekerjaan, inspeksi, jadwal kalibrasi dan downtime",object:"Tiket teknis",guard:"Status laik pakai atau sertifikat kalibrasi harus diverifikasi pihak yang berwenang; tidak ada release alat."},
 "Petugas Fasilitas":{group:"operations",title:"Layanan sarana dan kebersihan",subtitle:"Permintaan perbaikan, daftar tugas dan kesiapan area",object:"Tugas fasilitas",guard:"Label siap pakai hanya contoh; keputusan penggunaan ruang memerlukan inspeksi dan konfirmasi unit."},
 "Koordinator Transport":{group:"operations",title:"Transport dan perpindahan pasien",subtitle:"Permintaan, kesiapan armada dan status perjalanan",object:"Perjalanan / armada",guard:"Pilih konteks yang tepat: permintaan perjalanan dapat berpasien, alokasi armada adalah objek. Tidak memindahkan pasien nyata."},
 "Petugas BPJS":{group:"finance",title:"Administrasi penjamin BPJS",subtitle:"Eligibilitas, rujukan, SEP dan pengecualian respons",object:"Eligibility / SEP",guard:"Tinjau aturan penjamin dan episode sumber. Tidak ada pembuatan SEP, bridging atau keputusan coverage sebenarnya."},
 "Coder":{group:"finance",title:"Coding dan kelengkapan berkas",subtitle:"Diagnosis, prosedur, bukti dokumentasi dan review grouping",object:"Berkas coding",guard:"Coder tidak menegakkan diagnosis klinis baru. Coding demo tidak mengirim klaim atau mengubah RME terverifikasi."},
 "Akuntan":{group:"finance",title:"Rekonsiliasi keuangan",subtitle:"Jurnal, bukti transaksi, piutang dan utang",object:"Jurnal / akun",guard:"Angka contoh bukan ledger rumah sakit. Tidak ada journal posting, closing, settlement atau transfer."},
 "Budget Owner":{group:"finance",title:"Pengendalian anggaran unit",subtitle:"Permintaan, realisasi dan deviasi anggaran",object:"Anggaran / persetujuan",guard:"Persetujuan biaya memerlukan otorisasi dan kontrol audit; tidak ada pencairan atau approval anggaran nyata."},
 "Analis Biaya":{group:"finance",title:"Analisis biaya pelayanan",subtitle:"Unit cost, sumber biaya dan peninjauan anomali",object:"Biaya / indikator",guard:"Biaya pada mockup bukan tarif resmi; analisis tidak mengubah tarif atau keputusan finansial."},
 "Payroll Admin":{group:"people",title:"Validasi payroll dan kehadiran",subtitle:"Rekap absensi, komponen gaji dan selisih periode",object:"Payroll / periode",guard:"Penggajian, koreksi kehadiran dan transfer pembayaran tidak dilakukan dalam mockup."},
 "Rekruter":{group:"people",title:"Seleksi dan rekrutmen",subtitle:"Lamaran, tahapan wawancara dan evaluasi kandidat",object:"Lamaran / kandidat",guard:"Semua pelamar adalah contoh. Tidak ada data kandidat nyata atau keputusan penerimaan pegawai."},
 "Tim PPI":{group:"quality",title:"Pencegahan dan pengendalian infeksi",subtitle:"Surveilans HAIs, audit kepatuhan dan indikator",object:"Surveilans / indikator",guard:"Surveilans kasus dapat memiliki konteks pasien, sedangkan audit/indikator adalah objek. Tidak menetapkan diagnosis infeksi atau hasil audit resmi."}
};
function el(tag,cls,textValue){
 var e=document.createElement(tag);
 if(cls)e.className=cls;
 if(textValue!==undefined)e.textContent=String(textValue);
 return e;
}
function action(label,command){
 var e=el("button","v37-action",label);e.type="button";e.setAttribute("data-v37-action",command);return e;
}
function nodeContext(role,section,index){
 try{return lists.selectionContext(role,section,index,shell.patients);}catch(_error){return null;}
}
function syncEmpty(root){
 if(!root||!root.isConnected)return;
 var fallback=root.querySelector("#uxv5-empty"),zero=root.querySelector(".v37-zero");
 if(!fallback||!zero)return;
 var empty=!fallback.hidden;
 zero.hidden=!empty;
 fallback.hidden=true; // our accessible empty-state replaces the legacy plain label
 if(empty)root.setAttribute("data-v37-filter-state","empty");
 else root.setAttribute("data-v37-filter-state","results");
}
function decorate(){
 var account=auth.getAccount&&auth.getAccount();
 if(!account||account.reviewer||shell.state.active!=="rolehome")return;
 var role=account.role,spec=roles[role];
 if(!spec)return;
 var profile=profiles.getProfile(role);
 var root=document.querySelector("#main-content .uxv5");
 if(!profile||!root||root.getAttribute("data-uxv4-role")!==role||root.classList.contains("v37-workspace"))return;
 var header=root.querySelector(".uxv4-head"),metrics=root.querySelector(".uxv5-summary");
 var worklist=root.querySelector(".uxv5-layout")&&root.querySelector(".uxv5-layout").closest(".uxv4-panel");
 if(!header||!metrics||!worklist)return;
 var section=auth.getCurrentSection&&auth.getCurrentSection()||"home";
 var jobs=lists.jobRows(role,section)||[];
 var chosen=Number(auth.getCurrentJobIndex&&auth.getCurrentJobIndex());
 if(!Number.isInteger(chosen)||chosen<0||chosen>=jobs.length)chosen=0;
 var selected=jobs[chosen]||null;
 var linked=selected&&nodeContext(role,section,chosen);
 var patient=selected&&selected.kind==="patient"&&linked&&linked.kind==="patient"&&linked.patient||null;
 var feature=profiles.getFeature(role,section)||profile.features[0];
 var permitted=!!worklist.querySelector('.uxv5-detail-actions [data-demo-action^="module:"]');
 var restricted=!permitted;
 var missing=selected&&selected.kind==="patient"&&!patient;
 var state=missing?"missing-context":restricted?"denied":"draft-only";
 root.classList.add("v37-workspace");
 root.setAttribute("data-v37-role",role);
 root.setAttribute("data-v37-group",spec.group);
 root.setAttribute("data-v37-state",state);
 root.setAttribute("data-v37-kind",selected?selected.kind:"none");
 var hero=el("section","v37-hero");
 hero.setAttribute("aria-label","Ringkasan ruang kerja "+role);
 var copy=el("div","v37-copy");
 copy.appendChild(el("span","v37-eyebrow",profile.unit+" · DATA DEMO"));
 copy.appendChild(el("h2",null,spec.title));
 copy.appendChild(el("p","v37-subtitle",spec.subtitle));
 var identity=el("p","v37-identity","Akun "+account.username+" · Hak akses sesuai role");
 copy.appendChild(identity);
 var buttons=el("div","v37-actions");
 buttons.appendChild(action("Cari di daftar kerja","search"));
 buttons.appendChild(action("Panduan tugas terpilih","guide"));
 copy.appendChild(buttons);
 hero.appendChild(copy);
 var totals=el("div","v37-totals");
 var statuses=["Perlu ditinjau","Menunggu","Dalam proses"];
 statuses.forEach(function(status){
  var item=el("div","v37-stat");
  item.appendChild(el("span",null,status));
  item.appendChild(el("strong",null,jobs.filter(function(j){return j.status===status;}).length));
  totals.appendChild(item);
 });
 totals.appendChild(el("small",null,"Jumlah contoh pada daftar ini, bukan KPI RS."));
 hero.appendChild(totals);
 header.insertAdjacentElement("afterend",hero);
 var context=el("section","v37-context");
 context.setAttribute("aria-label","Konteks pekerjaan yang dipilih");
 var ribbon=el("div","v37-context-ribbon");
 ribbon.appendChild(el("span","v37-context-label",spec.object));
 ribbon.appendChild(el("strong",null,selected?selected.id:"Belum ada item"));
 ribbon.appendChild(el("span","v37-context-status",selected?selected.status:"Daftar kosong"));
 context.appendChild(ribbon);
 context.appendChild(el("h3",null,selected?selected.title:"Tidak ada tugas terpilih"));
 context.appendChild(el("p","v37-context-reason",selected?selected.reason:"Tidak ada pekerjaan pada sumber simulasi."));
 context.appendChild(el("p","v37-context-scope",selected?selected.scope:""));
 if(patient){
  context.appendChild(el("p","v37-patient","Pasien simulasi: "+(patient.name||"Pasien Demo")+" · "+(patient.mrn||"RM demo")+" · "+(patient.visit||"Episode demo")));
 }else if(missing){
  context.appendChild(el("p","v37-context-missing","Konteks pasien/encounter tidak tersedia. Pembukaan form berkonteks pasien ditahan."));
  var cta=worklist.querySelector('.uxv5-detail-actions [data-demo-action^="module:"]');
  if(cta){cta.disabled=true;cta.setAttribute("aria-disabled","true");}
 }else{
  context.appendChild(el("p","v37-object","Pekerjaan berbasis objek; tidak ada identitas pasien yang ditautkan."));
 }
 context.appendChild(el("small","v37-trace",feature.code+" · "+feature.fr+" · "+feature.wf+" · PRD final 6 November 2026"));
 var access=el("p","v37-access");
 access.setAttribute("data-v37-access",state);
 access.textContent=state==="missing-context"?"Tertahan: konteks pasien tidak lengkap":
  state==="denied"?"Akses form belum tersedia untuk role ini — lanjutkan melalui prosedur berwenang":
  "Form yang berizin hanya menyimpan draft simulasi. Tidak ada verifikasi/eksekusi riil.";
 context.appendChild(access);
 metrics.insertAdjacentElement("afterend",context);
 worklist.classList.add("v37-worklist");
 worklist.setAttribute("data-v37-worklist","");
 var title=worklist.querySelector(".uxv4-panel-head h2");
 if(title){title.id="v37-worklist-heading";worklist.setAttribute("aria-labelledby",title.id);}
 var th=worklist.querySelector(".uxv4-table thead th:nth-child(2)");
 if(th&&selected&&selected.kind==="object")th.textContent="Objek pekerjaan";
 var guide=el("details","v37-guide");
 guide.appendChild(el("summary",null,"Pemeriksaan sebelum melanjutkan"));
 var checks=el("ol","v37-checks");
 (selected&&Array.isArray(selected.checks)?selected.checks:[]).forEach(function(c){
  checks.appendChild(el("li",null,c));
 });
 guide.appendChild(checks);
 guide.appendChild(el("p","v37-guard",spec.guard));
 guide.appendChild(el("p","v37-footnote","Panduan bukan tanda persetujuan. Kegiatan release, posting, pengiriman, mutasi dan tindakan klinis tetap nonaktif."));
 worklist.insertAdjacentElement("afterend",guide);
 var featurePanels=Array.prototype.filter.call(root.querySelectorAll(".uxv4-panel"),function(node){
  return !!node.querySelector(".uxv4-features")&&node!==worklist;
 });
 if(featurePanels.length===1){
  guide.insertAdjacentElement("afterend",featurePanels[0]);
  featurePanels[0].classList.add("v37-other");
  var otherTitle=featurePanels[0].querySelector(".uxv4-panel-head h2");
  if(otherTitle)otherTitle.textContent="Area pekerjaan lain sesuai kewenangan";
 }
 var zero=el("div","v37-zero");
 zero.hidden=true;zero.setAttribute("role","status");zero.setAttribute("aria-live","polite");
 zero.appendChild(el("strong",null,"Tidak ada pekerjaan sesuai pencarian atau filter."));
 zero.appendChild(el("p",null,"Periksa kata kunci atau status. Data demo tidak berubah."));
 zero.appendChild(action("Hapus pencarian dan filter","reset"));
 var empty=worklist.querySelector("#uxv5-empty");
 if(empty){empty.insertAdjacentElement("afterend",zero);syncEmpty(root);}
}
shell.render=function(){
 var result=original.apply(this,arguments);
 decorate();
 return result;
};
document.addEventListener("click",function(event){
 var button=event.target&&event.target.closest&&event.target.closest("[data-v37-action]");
 if(!button)return;
 var root=button.closest(".v37-workspace");
 if(!root)return;
 event.preventDefault();
 var actionName=button.getAttribute("data-v37-action");
 if(actionName==="search"){
  var search=root.querySelector("#uxv5-search"),list=root.querySelector(".v37-worklist");
  if(list)list.scrollIntoView({behavior:"auto",block:"start"});
  if(search)search.focus({preventScroll:true});
 }else if(actionName==="guide"){
  var details=root.querySelector(".v37-guide");
  if(details){details.open=true;var summary=details.querySelector("summary");if(summary)summary.focus({preventScroll:true});}
 }else if(actionName==="reset"){
  var all=root.querySelector('[data-v12-filter="Semua"]');
  if(all)all.click();
  var input=root.querySelector("#uxv5-search");
  if(input){input.value="";input.dispatchEvent(new Event("input",{bubbles:true}));input.focus({preventScroll:true});}
  syncEmpty(document.querySelector(".v37-workspace"));
 }
});
document.addEventListener("input",function(event){
 if(event.target&&event.target.id==="uxv5-search")syncEmpty(event.target.closest(".v37-workspace"));
});
document.addEventListener("click",function(event){
 if(event.target&&event.target.closest&&event.target.closest("[data-v12-filter]")){
  syncEmpty(document.querySelector(".v37-workspace"));
 }
});
decorate();
window.SIMRSLongTailUXV37={
 roles:Object.keys(roles).map(function(role){return {role:role,group:roles[role].group};}),
 decorate:decorate
};
})();