/* SIMRS Baru — contextual worklists for seven operational roles.
 * UX-only: every name, task, status and identifier is synthetic.
 * No patient context is submitted to an API or silently transferred to forms.
 */
(function(){
"use strict";
var v4=window.SIMRSRoleUXV4;
if(!v4)return;
var specs={
 "Pendaftaran":{
  rows:[["REG-D001","Pasien Demo A","Rawat Jalan · Poli Dalam"],["REG-D002","Pasien Demo B","Rawat Jalan · Poli Anak"],["REG-D003","Pasien Demo C","IGD · walk-in"],["REG-D004","Pasien Demo D","Rawat Inap · rencana admisi"]],
  stages:[
   ["Pemeriksaan identitas",["Identitas belum dicocokkan","Potensi data ganda","Data kependudukan perlu ditinjau","Perubahan biodata diminta"],["Cek nomor RM dan data identitas","Tinjau kemungkinan duplikasi MPI","Jangan membuat pasien baru jika identitas belum jelas"]],
   ["Check-in dan kunjungan",["Pasien telah hadir, check-in belum dibuat","Janji temu perlu dikonfirmasi","Penjamin perlu diverifikasi","Encounter belum tercatat"],["Pastikan pasien dan kunjungan tepat","Cek status penjamin dan tujuan unit","Gunakan encounter yang sesuai, bukan membuat duplikat"]],
   ["Janji temu",["Konfirmasi jadwal dokter","Kuota poli perlu ditinjau","Permintaan penjadwalan ulang","Booking menunggu konfirmasi"],["Cek kesesuaian unit dan dokter","Periksa slot dan kuota simulasi","Konfirmasi jadwal sebelum check-in"]],
   ["Antrean layanan",["Nomor antrean belum dipanggil","Pasien perlu dialihkan ke unit","Antrean menunggu layanan","Panggilan terlewat"],["Pastikan check-in sudah sesuai","Cek tujuan unit dan nomor antrean","Jangan melewati status pelayanan tanpa verifikasi"]]
  ]
 },
 "Dokter RJ":{
  rows:[["ENC-RJ01","Pasien Demo A","Poli Dalam · kunjungan aktif"],["ENC-RJ02","Pasien Demo B","Poli Anak · menunggu dokter"],["ENC-RJ03","Pasien Demo C","Poli Jantung · kontrol"],["ENC-RJ04","Pasien Demo D","Poli Bedah · konsultasi"]],
  stages:[
   ["Pasien dalam daftar poli",["Menunggu pemeriksaan","Rekam medis siap ditinjau","Kunjungan kontrol","Riwayat perlu ditinjau"],["Pastikan encounter aktif dan penugasan dokter","Baca alergi, obat, dan riwayat relevan","Pastikan konteks pasien benar sebelum menulis"]],
   ["Dokumentasi SOAP",["Asesmen belum lengkap","Catatan masih draft","Perlu tinjauan alergi","Rencana belum ditulis"],["Tinjau subjektif dan objektif","Periksa diagnosis dan rencana tindakan","Simpan draft; tanda tangan klinis tidak tersedia di demo"]],
   ["Diagnosis dan tindakan",["Diagnosis utama perlu diperiksa","Diagnosis tambahan belum lengkap","Kesesuaian tindakan perlu ditinjau","Catatan medis perlu klarifikasi"],["Pastikan penilaian klinis mendukung kode","Hubungkan diagnosis dan tindakan ke encounter","Hindari diagnosis otomatis berdasarkan contoh"]],
   ["Order pemeriksaan",["Order laboratorium direncanakan","Order radiologi menunggu input","Indikasi pemeriksaan perlu ditinjau","Order tindak lanjut belum lengkap"],["Pastikan alasan klinis dan identitas pasien","Pilih item pemeriksaan dan prioritas","Order demo belum dikirim ke LIS atau RIS"]],
   ["Resep elektronik",["Telaah alergi sebelum meresepkan","Dosis dan frekuensi perlu diisi","Obat aktif perlu direkonsiliasi","Jumlah resep perlu diperiksa"],["Periksa alergi dan obat aktif pasien","Periksa dosis, rute, frekuensi, durasi dan jumlah","Tidak ada prescribing atau dispensing nyata"]],
   ["Surat dan resume",["Surat kontrol perlu ditinjau","Dokumen klinis belum lengkap","Resume kunjungan perlu review","Permintaan ringkasan medis"],["Pastikan dokumentasi sumber sudah ditinjau","Cek penerima dan isi dokumen","Tidak ada tanda tangan atau pelepasan dokumen nyata"]]
  ]
 },
 "Perawat":{
  rows:[["RI-N01","Pasien Demo A","Melati A · bed A-05 · shift pagi"],["RI-N02","Pasien Demo B","Melati A · bed A-07 · shift pagi"],["RI-N03","Pasien Demo C","Melati B · bed B-02 · shift pagi"],["RI-N04","Pasien Demo D","Melati B · bed B-04 · shift pagi"]],
  stages:[
   ["Pasien dalam penugasan",["Observasi awal perlu ditinjau","Intervensi shift menunggu","Handover perlu konfirmasi","Dokumentasi perawatan belum lengkap"],["Periksa nama, bed dan episode perawatan","Pastikan penugasan perawat dalam shift","Tinjau instruksi keperawatan yang berlaku"]],
   ["Tanda vital dan asesmen",["Tanda vital menunggu input","Pengukuran ulang direncanakan","Skor risiko belum lengkap","Observasi perlu review"],["Catat waktu dan parameter pengukuran","Periksa perubahan dan nilai yang perlu eskalasi","Tidak ada validasi klinis atau alarm aktif"]],
   ["Asuhan keperawatan",["Rencana asuhan perlu diperbarui","Intervensi belum dicatat","Evaluasi respons pasien menunggu","Asesmen lanjutan diperlukan"],["Tinjau diagnosis dan rencana keperawatan","Catat intervensi dan respons sesuai shift","Tidak memberi hak meresepkan atau dispense"]],
   ["CPPT dan serah terima",["Catatan perkembangan belum lengkap","Handover belum ditinjau","Perubahan kondisi perlu dikomunikasikan","Serah terima shift menunggu"],["Cantumkan waktu, pemberi dan penerima informasi","Tinjau tindak lanjut yang belum selesai","Catatan demo bukan dokumen klinis signed"]]
  ]
 },
 "Dokter IGD":{
  rows:[["IGD-D01","Pasien Demo A","IGD · triase kuning"],["IGD-D02","Pasien Demo B","IGD · triase hijau"],["IGD-D03","Pasien Demo C","IGD · triase merah (contoh)"],["IGD-D04","Pasien Demo D","IGD · observasi"]],
  stages:[
   ["Triage dan prioritas IGD",["Asesmen awal perlu ditinjau","Prioritas menunggu konfirmasi","Evaluasi kegawatan dibutuhkan","Keluhan utama perlu dikaji"],["Gunakan penilaian tenaga klinis berwenang","Periksa tanda vital, gejala dan risiko","Kategori triase hanya label sintetis, bukan keputusan otomatis"]],
   ["Observasi klinis",["Pemantauan ulang diperlukan","Hasil observasi belum lengkap","Perubahan kondisi perlu ditinjau","Observasi berkala menunggu"],["Tinjau trend tanda vital dan waktu","Periksa eskalasi ke dokter penanggung jawab","Tidak ada alarm atau monitoring real-time"]],
   ["Order IGD",["Pemeriksaan cepat perlu dipilih","Indikasi order perlu ditinjau","Pemeriksaan lanjutan direncanakan","Tindak lanjut order menunggu"],["Pastikan indikasi klinis dan prioritas","Cek konteks encounter dan pemeriksaan sebelumnya","Order demo tidak dikirim ke layanan penunjang"]],
   ["Keputusan disposisi",["Rencana pulang perlu ditinjau","Observasi lanjutan direncanakan","Kebutuhan rawat inap perlu dikaji","Rencana rujukan perlu konfirmasi"],["Tinjau kondisi terkini dan asesmen","Pastikan tujuan pulang, rawat inap atau rujuk","Tidak ada admisi atau transfer pasien nyata"]],
   ["Rujukan pasien",["Kandidat tujuan belum ditinjau","Berkas rujukan perlu lengkap","Status penerimaan belum diketahui","Rencana transport perlu dikaji"],["Verifikasi alasan dan tujuan rujukan","Cek informasi klinis dan persetujuan sesuai kebijakan","Tidak mengirim data ke SATUSEHAT Rujukan"]]
  ]
 },
 "Farmasis":{
  rows:[["RX-0027","Resep Demo A","Poli Dalam · 4 item obat"],["RX-0028","Resep Demo B","Poli Anak · 2 item obat"],["RX-0029","Resep Demo C","IGD · 3 item obat"],["RX-0030","Resep Demo D","Poli Jantung · 5 item obat"]],
  stages:[
   ["Resep masuk",["Resep baru menunggu telaah","Riwayat alergi belum diperiksa","Item perlu klarifikasi","Resep dari IGD menunggu"],["Pastikan identitas, dokter dan encounter","Cek item resep dan status review","Tidak memproses resep pasien nyata"]],
   ["Telaah kefarmasian",["Interaksi obat perlu ditinjau","Penyesuaian dosis perlu konfirmasi","Riwayat alergi perlu ditelaah","Duplikasi terapi perlu review"],["Periksa dosis, rute, frekuensi dan interaksi","Tinjau alergi, kontraindikasi dan duplikasi","Review UI bukan verifikasi farmasis sah"]],
   ["Penyiapan obat",["Daftar item belum disiapkan","Lot perlu dipilih","Kuantitas perlu dikonfirmasi","Penyiapan menunggu verifikasi"],["Cocokkan item dan jumlah resep","Periksa expiry dan lot referensi simulasi","Tidak ada reservasi atau mutasi stok nyata"]],
   ["Penyerahan dan riwayat",["Dokumen edukasi belum ditinjau","Rencana serah terima perlu konfirmasi","Informasi penggunaan belum lengkap","Riwayat dispensing perlu ditinjau"],["Konfirmasi kecocokan identitas pasien","Periksa instruksi dan konseling obat","Tombol demo tidak menyerahkan obat atau mencatat ledger"]]
  ]
 },
 "Kasir":{
  rows:[["INV-D081","Tagihan Demo A","Rawat Jalan · umum · Rp 628.500"],["INV-D082","Tagihan Demo B","Rawat Inap · umum · Rp 4.750.000"],["INV-D083","Tagihan Demo C","Rawat Jalan · umum · Rp 1.320.000"],["INV-D084","Tagihan Demo D","Rawat Jalan · umum · Rp 345.000"]],
  stages:[
   ["Tagihan siap ditinjau",["Tagihan belum dibayar","Invoice perlu dicocokkan","Alokasi parsial perlu diperiksa","Invoice menunggu pembayaran"],["Periksa nomor invoice, pasien dan outstanding","Pastikan invoice berasal dari billing yang sesuai","Kasir tidak mengubah tarif atau charge capture"]],
   ["Penerimaan pembayaran",["Metode pembayaran belum dipilih","Nominal perlu dikonfirmasi","Sisa tagihan perlu ditinjau","Alokasi pembayaran belum lengkap"],["Pastikan nominal tidak melampaui outstanding","Periksa metode dan referensi pembayaran","Tidak ada settlement atau transaksi uang sungguhan"]],
   ["Kuitansi dan riwayat",["Kuitansi demo belum ditinjau","Rincian alokasi perlu review","Riwayat pembayaran perlu diperiksa","Status pencetakan belum ada"],["Cocokkan kuitansi dan alokasi invoice","Pastikan status pembayaran diperiksa","Tidak menerbitkan kuitansi fiskal atau posting jurnal"]]
  ]
 },
 "Bed Manager":{
  rows:[["BED-A05","Melati A · Bed A-05","Tersedia (contoh)"],["BED-A07","Melati A · Bed A-07","Permintaan dari IGD (contoh)"],["BED-B01","Melati B · Bed B-01","Transfer direncanakan"],["BED-C03","Mawar C · Bed C-03","Menunggu kesiapan ruang"]],
  stages:[
   ["Pemantauan tempat tidur",["Perlu konfirmasi kesiapan","Prioritas penempatan menunggu","Status occupancy perlu review","Pembersihan ruang perlu verifikasi"],["Periksa unit, kelas, status kesiapan dan kebutuhan isolasi","Konfirmasi ketersediaan bersama unit perawatan","Label tersedia tidak menjamin bed benar-benar kosong"]],
   ["Permintaan penempatan",["Permintaan admisi belum diputuskan","Pasien IGD menunggu bed (contoh)","Prioritas bed perlu ditinjau","Alokasi belum dikonfirmasi"],["Cek kebutuhan klinis dan kriteria penempatan","Tinjau permintaan bed dan unit tujuan","Tidak melakukan reservasi atau admisi nyata"]],
   ["Transfer dan pelepasan bed",["Transfer internal masih rencana","Pelepasan bed belum dikonfirmasi","Koordinasi antarbangsal diperlukan","Bed perlu verifikasi siap pakai"],["Periksa episode, tujuan transfer dan serah terima","Konfirmasi cleaning serta kesiapan sebelum dialokasikan","Tidak mengubah occupancy atau status bed produksi"]]
  ]
 }
};
function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function jobRows(role,section){
 var spec=specs[role],p=v4.getProfile(role);
 if(!spec||!p)return [];
 var key=v4.getFeature(role,section),feature=key||p.features[0];
 var i=p.features.indexOf(feature),stage=spec.stages[i];
 if(!stage)return [];
 var shell=window.__SIMRS_PREVIEW__,patients=shell&&Array.isArray(shell.patients)?shell.patients:[];
 return spec.rows.map(function(row,j){
  var patient=role==="Bed Manager"?null:patients[j];
  var patientId=role==="Bed Manager"?null:(patient?patient.id:"p"+(j+1));
  var title=(patient&&["Pendaftaran","Dokter RJ","Perawat","Dokter IGD"].indexOf(role)>=0)?patient.name:row[1];
  var scope=patient&&role==="Dokter RJ"?patient.unit+" · "+row[0]:row[2];
  if(patient&&role==="Pendaftaran"){
    scope=j===2?"IGD · walk-in":j===3?"Rawat Inap · rencana admisi":"Rawat Jalan · "+patient.unit;
  }
  if(patient&&(role==="Farmasis"||role==="Kasir"))scope+=" · "+patient.name;
  var encounterId=patient?(role==="Dokter IGD"?"ENC-IGD-DEMO-"+String(j+1).padStart(2,"0"):
    role==="Perawat"?"ENC-RI-DEMO-"+String(j+1).padStart(2,"0"):
    role==="Pendaftaran"&&j===2?"ENC-IGD-DEMO-03":
    role==="Pendaftaran"&&j===3?"ENC-RI-DEMO-04":patient.visit):null;
  return {
   id:row[0],title:title,scope:scope,patientId:patientId,encounterId:encounterId,
   kind:role==="Bed Manager"?"bed":"patient",
   status:(j===0?"Perlu ditinjau":j===1?"Menunggu":j===2?"Dalam proses":"Menunggu"),
   reason:stage[1][j],checks:stage[2],feature:feature,queue:stage[0]
  };
 });
}
/* Bind a work item only to a known synthetic patient and encounter.
 * This is not MPI matching or a real association of clinical resources. */
function selectionContext(role,section,index,patients){
 var rows=jobRows(role,section),position=Number(index);
 if(!Number.isInteger(position)||position<0||position>=rows.length)return null;
 var item=rows[position],workItem={id:item.id,title:item.title,scope:item.scope,kind:item.kind};
 if(item.kind==="bed")return {role:role,kind:"bed",workItem:workItem,patient:null};
 var patient=Array.isArray(patients)&&patients.find(function(p){return p.id===item.patientId;});
 if(!patient||!patient.id||!patient.visit)return null;
 var visit=item.encounterId||patient.visit;
 if(!visit)return null;
 return {role:role,kind:"patient",workItem:workItem,patient:Object.assign({},patient,{visit:visit})};
}
function renderPage(ctx){
 var spec=specs[ctx.role];if(!spec)return v4.renderPage(ctx);
 var p=v4.getProfile(ctx.role);if(!p)return v4.renderPage(ctx);
 var feature=v4.getFeature(ctx.role,ctx.section),active=feature||p.features[0],isHome=!feature;
 var jobs=jobRows(ctx.role,ctx.section),index=Number(ctx.selectedJob);
 if(!Number.isInteger(index)||index<0||index>=jobs.length)index=0;
 var selected=jobs[index],canOpen=!!(ctx.canOpen&&ctx.canOpen(active.code));
 var shell=window.__SIMRS_PREVIEW__;
 var selectedContext=selectionContext(ctx.role,ctx.section,index,shell&&shell.patients);
 var moduleAction=canOpen?
   '<button type="button" class="btn btn-primary" data-demo-action="module:'+esc(active.code)+'">Buka '+esc(active.label)+'</button>':
   '<span class="uxv4-disabled" role="note">Form belum tersedia untuk akun demo ini</span>';
 var cards=isHome?'<section class="uxv4-panel"><div class="uxv4-panel-head"><div><h2>Area kerja saya</h2><p>Pilih pekerjaan sesuai kewenangan; tidak ada katalog modul global.</p></div></div><div class="uxv4-features">'+
  p.features.map(function(f){return '<button type="button" class="uxv4-feature" data-demo-action="section:'+esc(f.key)+'"><span class="uxv4-feature-code">'+esc(f.code)+'</span><strong>'+esc(f.label)+'</strong><small>'+esc(f.task)+'</small><span class="uxv4-feature-arrow">Lihat daftar kerja →</span></button>';}).join("")+'</div></section>':"";
 var rows=jobs.map(function(j,i){return '<tr class="'+(i===index?'uxv5-selected':'')+'" data-uxv5-row="'+i+'"><td class="uxv4-job-id">'+esc(j.id)+'</td><td><strong>'+esc(j.title)+'</strong><small>'+esc(j.scope)+'</small></td><td>'+esc(j.reason)+'</td><td><span class="uxv4-status '+(j.status==="Perlu ditinjau"?'uxv4-pending':'')+'">'+esc(j.status)+'</span></td><td><button class="btn btn-sm" type="button" data-demo-action="job:'+i+'" aria-pressed="'+(i===index?'true':'false')+'" aria-label="Lihat detail '+esc(j.id)+'">Lihat detail</button></td></tr>';}).join("");
 var checks=selected.checks.map(function(line){return '<li>'+esc(line)+'</li>';}).join("");
 var trace='<div class="uxv4-trace">Acuan: <strong>PRD final 6 Nov 2026</strong> · '+esc(active.code)+' · '+esc(active.fr)+' · '+esc(active.wf)+
   ' · '+esc(v4.workflowNames[active.wf]||"Workflow terkait")+'</div>';
 return '<div class="uxv4 uxv5" data-uxv4-role="'+esc(ctx.role)+'" data-uxv4-section="'+esc(ctx.section||"home")+'">'+
  '<header class="uxv4-head"><div><span class="eyebrow">'+esc(p.unit)+' · AKUN DEMO</span><h1>'+esc(isHome?"Beranda "+ctx.role:feature.label)+'</h1><p>'+esc(isHome?p.focus:feature.task)+'</p></div><div class="uxv4-identity"><span>PENGGUNA</span><strong>'+esc(ctx.username)+'</strong><small>Hak akses mockup berdasarkan role</small></div></header>'+
  '<section class="uxv5-summary" aria-label="Ringkasan pekerjaan"><div><span>Daftar kerja</span><strong>'+esc(selected.queue)+'</strong><small>'+esc(p.unit)+'</small></div><div><span>Perlu ditinjau</span><strong>01</strong><small>Data sintetis</small></div><div><span>Alur PRD</span><strong>'+esc(active.wf)+'</strong><small>'+esc(active.fr)+'</small></div></section>'+
  cards+'<section class="uxv4-panel"><div class="uxv4-panel-head"><div><h2>'+esc(isHome?"Pekerjaan prioritas":active.label)+'</h2><p>Pilih baris untuk melihat konteks dan pemeriksaan sebelum membuka formulir.</p></div><label class="uxv5-search-label">Cari pekerjaan<input id="uxv5-search" type="search" autocomplete="off" placeholder="Cari nomor, pasien atau status" aria-label="Cari daftar pekerjaan"/></label></div>'+
  '<div class="uxv5-layout"><div class="uxv4-table-scroller"><table class="uxv4-table"><thead><tr><th>Nomor</th><th>Pasien / objek kerja</th><th>Perhatian</th><th>Status demo</th><th>Detail</th></tr></thead><tbody>'+rows+'</tbody></table><p id="uxv5-empty" class="uxv5-empty" hidden>Tidak ada pekerjaan yang cocok dengan pencarian.</p></div>'+
  '<aside class="uxv5-detail" aria-label="Detail pekerjaan yang dipilih"><div class="uxv5-detail-header"><span>RINCIAN PEKERJAAN · DEMO</span><strong>'+esc(selected.id)+'</strong><h3>'+esc(selected.title)+'</h3><p>'+esc(selected.scope)+'</p></div>'+
  '<dl><div><dt>Status</dt><dd>'+esc(selected.status)+'</dd></div><div><dt>Perlu diperiksa</dt><dd>'+esc(selected.reason)+'</dd></div>'+
  (selectedContext&&selectedContext.patient?'<div><dt>Konteks pasien</dt><dd>'+esc(selectedContext.patient.mrn)+' · '+esc(selectedContext.patient.visit)+'</dd></div>':'')+
  '<div><dt>Form / modul</dt><dd>'+esc(active.code)+' · '+esc(active.fr)+'</dd></div></dl>'+
  '<h4>Checklist sebelum melanjutkan</h4><ul>'+checks+'</ul><div class="uxv5-detail-actions">'+moduleAction+'</div>'+
  '<p class="uxv5-context-note">'+(selectedContext&&selectedContext.patient?
   'Konteks pasien dan encounter sintetis dari pekerjaan '+esc(selected.id)+' akan diteruskan ke form. Verifikasi sebelum menyimpan draft.':
   selected.kind==="bed"?'Objek kerja adalah tempat tidur, bukan pasien. Tidak ada pasien yang ditautkan otomatis.':
   'Konteks belum tersedia. Pastikan pasien demo dan encounter valid sebelum menyimpan draft.')+'</p></aside></div>'+trace+'</section>'+
  '<p class="uxv4-safety"><strong>Data latihan saja:</strong> seluruh identitas, antrean, status dan angka adalah contoh. Tidak ada keputusan klinis, pengeluaran obat, pemindahan bed, pembayaran, posting atau pengiriman data sungguhan.</p></div>';
}
document.addEventListener("input",function(event){
 if(!event.target||event.target.id!=="uxv5-search")return;
 var table=document.querySelector(".uxv5 .uxv4-table"),empty=document.getElementById("uxv5-empty");
 if(!table)return;
 var query=String(event.target.value||"").trim().toLocaleLowerCase("id-ID"),count=0;
 table.querySelectorAll("tbody tr").forEach(function(tr){
  var yes=tr.textContent.toLocaleLowerCase("id-ID").includes(query);
  tr.hidden=!yes;if(yes)count++;
 });
 if(empty)empty.hidden=count!==0;
});
window.SIMRSRoleUXV5={specs:specs,jobRows:jobRows,selectionContext:selectionContext,renderPage:renderPage};
})();
