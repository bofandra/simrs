/* SIMRS V18–V20: role-native workflow guidance and safety context.
 * Read-only UI, synthetic data only. No permissions, transaction state or network effects.
 * The final 2026-11-06 PRD remains normative; pathways here are UX guidance, not clinical SOP.
 */
(function(){
"use strict";
var ux=window.SIMRSRoleUXV5;
if(!ux||typeof ux.renderPage!=="function")return;
var v4=window.SIMRSRoleUXV4;
var previous=ux.renderPage;
var flows={
 "Pendaftaran":{id:"S02",title:"Registrasi dan antrean",type:"front",steps:["Cari pasien / MPI","Verifikasi identitas","Registrasi kunjungan","Check-in dan antrean"],guard:"Pastikan nomor RM dan kunjungan benar sebelum membuat encounter baru."},
 "Dokter RJ":{id:"S03",title:"Konsultasi rawat jalan",type:"clinical",steps:["Buka pasien terjadwal","Periksa riwayat dan alergi","Asesmen / diagnosis","Order atau resep (draft)","Review dan handoff"],guard:"Periksa identitas pasien, encounter, alergi dan obat aktif sebelum mencatat atau merencanakan terapi."},
 "Perawat":{id:"S04",title:"Asuhan keperawatan",type:"clinical",steps:["Daftar penugasan","TTV dan asesmen","Rencana keperawatan","Evaluasi dan handover"],guard:"Cocokkan pasien, bed, shift, alergi dan instruksi yang berlaku; form ini bukan catatan signed."},
 "Dokter IGD":{id:"S05",title:"IGD dan triase",type:"clinical",steps:["Identifikasi pasien","Triase klinis","Stabilisasi / observasi","Disposisi / rujukan"],guard:"Triase dan eskalasi kegawatan harus dinilai tenaga berwenang; tidak ada alarm maupun keputusan otomatis."},
 "DPJP Rawat Inap":{id:"S06",title:"Visite dan perawatan inap",type:"clinical",steps:["Daftar pasien per ruang","Tinjau kondisi dan hasil","Visite / CPPT","Rencana terapi","Discharge dan handoff"],guard:"Pastikan episode rawat inap, dokter penanggung jawab, instruksi aktif dan alergi telah diperiksa."},
 "Bed Manager":{id:"S06",title:"Pengelolaan tempat tidur",type:"operations",steps:["Lihat permintaan","Periksa ketersediaan dan kelas","Konfirmasi kesiapan","Rencanakan penempatan","Handover unit"],guard:"Label ketersediaan adalah contoh; belum ada pemindahan atau penguncian bed secara nyata."},
 "ATLM":{id:"S07",title:"Pemeriksaan laboratorium",type:"operations",steps:["Order masuk","Identifikasi spesimen","Pemrosesan / QC","Review hasil","Verifikasi dan pelepasan"],guard:"Hasil harus ditautkan ke order dan specimen yang benar; hasil kritis memerlukan penerima dan acknowledgement."},
 "Farmasis":{id:"S08",title:"Telaah resep dan farmasi",type:"operations",steps:["Resep masuk","Telaah klinis","Periksa stok/lot","Rencana penyiapan","Konseling / serah terima"],guard:"Verifikasi resep, alergi, dosis, rute, lot dan kedaluwarsa; tidak ada dispensing atau mutasi stok aktual."},
 "Kasir":{id:"S09",title:"Tagihan dan pembayaran",type:"operations",steps:["Periksa charge layanan","Tinjau invoice dan penjamin","Rencanakan alokasi","Rekonsiliasi kuitansi"],guard:"Outstanding dan alokasi harus berasal dari invoice yang sama; tidak ada transaksi uang atau posting jurnal."},
 "Petugas Billing":{id:"S09",title:"Billing dan charge",type:"operations",steps:["Terima sumber charge","Rekonsiliasi tarif","Cegah duplikasi","Siapkan invoice"],guard:"Charge belum menjadi pembayaran dan klaim belum menjadi penerimaan dana."},
 "Casemix":{id:"S09",title:"Kelengkapan klaim",type:"operations",steps:["Berkas episode","Coding dan grouping","Validasi dokumen","Review status pengajuan"],guard:"Review lokal tidak sama dengan pengajuan atau penerimaan klaim penjamin."},
 "Manajemen RS":{id:"S10",title:"Monitoring rumah sakit",type:"operations",steps:["Pilih indikator","Tinjau periode dan sumber","Periksa exception","Putuskan tindak lanjut"],guard:"Semua metrik situs bersumber data demo; bukan indikator rumah sakit aktual."},
 "Tim Mutu":{id:"S10",title:"Mutu dan keselamatan",type:"operations",steps:["Pantau indikator","Lihat variasi","Tinjau evidensi","Rencanakan perbaikan"],guard:"Pastikan definisi indikator, pembilang, penyebut dan periode sebelum menyimpulkan kinerja."},
 "Integrasi":{id:"S10",title:"Pemantauan integrasi",type:"operations",steps:["Pantau antrean outbox","Tinjau ACK","Investigasi retry/DLQ","Rekonsiliasi"],guard:"Status proses internal berbeda dari status ACK eksternal; semua status pada situs merupakan simulasi."},
 "Admin Sistem":{id:"S11",title:"Pengguna dan hak akses",type:"operations",steps:["Tinjau pengguna","Tentukan unit dan role","Periksa hak spesifik","Audit dan review"],guard:"Perubahan hak akses produksi membutuhkan otorisasi dan audit server-side."},
 "HR Admin":{id:"S11",title:"Direktori dan penugasan SDM",type:"operations",steps:["Tinjau direktori","Verifikasi penugasan","Periksa jadwal","Review catatan SDM"],guard:"Enam kartu staf pada demo bukan master pegawai dan tidak boleh dianggap data resmi."},
 "Radiografer":{id:"S12",title:"Pemeriksaan radiologi",type:"operations",steps:["Order masuk","Persiapan identitas","Akuisisi studi","Tinjau kualitas","Serahkan ke radiolog"],guard:"Verifikasi order, studi, pasien dan accession; gambar tidak menggantikan PACS/DICOM nyata."},
 "Radiolog":{id:"S12",title:"Interpretasi radiologi",type:"clinical",steps:["Daftar studi","Review gambar dan konteks","Draft laporan","Verifikasi / pelepasan"],guard:"Periksa kecocokan studi-pasien dan temuan kritis sebelum meninjau laporan; tidak ada release nyata."},
 "Petugas MCU":{id:"S13",title:"Pelayanan medical check-up",type:"operations",steps:["Daftar peserta","Rangkaian pemeriksaan","Konsolidasi hasil","Review resume"],guard:"Pelepasan ringkasan MCU memerlukan review dokter dan kebijakan disclosure."},
 "Koordinator MCU":{id:"S13",title:"Koordinasi medical check-up",type:"operations",steps:["Periksa paket","Koordinasi stasiun","Pantau hasil tertunda","Review kelengkapan"],guard:"Kelengkapan paket demo tidak dapat menjadi dasar penerbitan laporan MCU resmi."}
};
function esc(value){
 return String(value==null?"":value).replace(/[&<>"']/g,function(c){
  return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
 });
}
function selectedJob(ctx){
 if(!ux.jobRows)return null;
 var jobs=ux.jobRows(ctx.role,ctx.section);
 if(!Array.isArray(jobs)||!jobs.length)return null;
 var index=Number(ctx.selectedJob);
 if(!Number.isInteger(index)||index<0||index>=jobs.length)index=0;
 return {job:jobs[index],index:index};
}
function selectedContext(ctx,index){
 if(!ux.selectionContext)return null;
 try{
  var shell=window.__SIMRS_PREVIEW__;
  return ux.selectionContext(ctx.role,ctx.section,index,shell&&shell.patients);
 }catch(_error){return null;}
}
function guidance(ctx,flow){
 var current=selectedJob(ctx);
 if(!current||!current.job)return "";
 var job=current.job,feature=v4&&v4.getFeature&&v4.getFeature(ctx.role,ctx.section);
 var label=feature?feature.label:"Daftar pekerjaan";
 var reason=job.reason||"Periksa detail pekerjaan sebelum melanjutkan.";
 var context=selectedContext(ctx,current.index);
 var patient=context&&context.patient;
 var id=job.id||"Pekerjaan contoh";
 var currentHint=patient?
  "Konteks sintetis: "+String(patient.mrn||"Nomor RM demo")+" · "+String(patient.visit||"Encounter belum dipastikan")+". ":
  "Objek kerja: "+String(id)+". ";
 var safety=flow.type==="clinical"?
  "Periksa dua identitas dan encounter menurut SOP. "+flow.guard:
  flow.guard;
 return '<section class="v18-workflow" data-v18-screen="'+esc(flow.id)+'" data-v18-role="'+esc(ctx.role)+'" aria-label="Panduan kerja '+esc(ctx.role)+'">'+
  '<div class="v18-workflow-overview"><div class="v18-workflow-copy">'+
  '<span class="v18-overline">'+esc(flow.id)+' · '+esc(flow.title)+' · Panduan UI</span>'+
  '<h2>'+esc(label)+'</h2>'+
  '<p><strong>'+esc(id)+'</strong> · '+esc(job.title||"Objek demo")+
   ' — '+esc(reason)+'</p></div>'+
  '<span class="v18-workflow-chip">Konteks pekerjaan demo</span></div>'+
  '<details class="v18-workflow-details"><summary>Urutan kerja dan pemeriksaan sebelum melanjutkan</summary>'+
  '<ol class="v18-flow-steps" aria-label="Urutan acuan, bukan indikator tahapan yang sudah selesai">'+
   flow.steps.map(function(step){return '<li>'+esc(step)+'</li>';}).join("")+
  '</ol><p class="v18-flow-note">Urutan ini adalah panduan desain, bukan status proses yang sudah dikerjakan atau tindakan otomatis. Pilih satu pekerjaan, lanjutkan ke form, lalu kembali ke daftar kerja.</p></details>'+
  '<div class="v18-safety-strip '+(flow.type==="clinical"?"v18-clinical":flow.type==="operations"?"v18-operation":"")+
  '"><strong>Periksa sebelum lanjut:</strong> '+esc(currentHint+safety)+'</div></section>';
}
ux.renderPage=function(ctx){
 var html=previous(ctx);
 if(!ctx||!ctx.role||!ctx.username||String(ctx.username).startsWith("reviewer.")||
    !flows[ctx.role]||typeof html!=="string"||html.indexOf('class="uxv4 uxv5')<0)return html;
 var insertion=guidance(ctx,flows[ctx.role]);
 return insertion?html.replace("</header>","</header>"+insertion):html;
};
window.SIMRSUnifiedUXV18={
 version:"18-21-preview",
 supportedRoles:Object.keys(flows),
 flowFor:function(role){return flows[role]?{id:flows[role].id,title:flows[role].title,steps:flows[role].steps.slice()}:null;}
};
if(window.SIMRSRoleDemo&&window.SIMRSRoleDemo.isAuthenticated&&
   window.SIMRSRoleDemo.isAuthenticated()&&window.__SIMRS_PREVIEW__){
 window.__SIMRS_PREVIEW__.render();
}
})();
