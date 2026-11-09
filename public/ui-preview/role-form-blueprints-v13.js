/* SIMRS V13 — role-native, field-preserving form blueprints.
 * Uses existing catalog, field renderer, validation, draft and role checks.
 * Never runs clinical, billing, stock, external or authorization operations.
 */
(function(){
"use strict";
var specs={
 "CORE-08":{title:"Pemeriksaan identitas pasien",subtitle:"Telusuri dan cocokkan identitas sebelum menggunakan data pasien.",
  steps:["Identitas","Kandidat serupa","Review petugas"],note:"Hasil possible-match hanya contoh; tidak menggabungkan identitas otomatis.",
  groups:[["Identitas dasar","Cocokkan nama, tanggal lahir dan jenis kelamin.",["patient_name","dob","gender"]],
    ["Kontak pasien","Informasi kontak hanya menggunakan data sintetis.",["nik_demo","phone_demo"]],
    ["Pemeriksaan kandidat","Tentukan hasil penelusuran tanpa melakukan merge.",["match_state"]]]},
 "CORE-09":{title:"Registrasi kunjungan",subtitle:"Hubungkan pasien demo dengan tujuan layanan dan penjamin yang benar.",
  steps:["Tujuan layanan","Penjamin","Check-in"],note:"Check-in dan pembentukan encounter riil tidak dijalankan oleh mockup.",
  groups:[["Kunjungan yang dilayani","Jenis, tanggal, dan unit tujuan.",["visit_type","visit_date","unit"]],
    ["Penjamin dan rujukan","Periksa informasi cakupan administrasi.",["payer","referral_reference"]],
    ["Kelengkapan check-in","Status contoh registrasi untuk evaluasi alur.",["checkin_state"]]]},
 "CORE-10":{title:"Penjadwalan pasien",subtitle:"Atur contoh jadwal berdasarkan unit, tenaga kesehatan dan slot.",
  steps:["Pilih layanan","Tetapkan jadwal","Konfirmasi"],note:"Penjadwalan tidak memesan slot dokter sebenarnya.",
  groups:[["Unit dan dokter","Periksa tujuan dan penanggung jawab layanan.",["unit","practitioner"]],
    ["Waktu kunjungan","Masukkan rentang jadwal yang konsisten.",["start_at","end_at"]],
    ["Permintaan janji temu","Status permintaan dan alasan kunjungan.",["appointment_state","visit_reason"]]]},
 "CORE-11":{title:"Antrean layanan",subtitle:"Pantau nomor antrean dan pemanggilan secara simulasi.",
  steps:["Identifikasi antrean","Unit tujuan","Status layanan"],note:"Tidak ada panggilan antrean atau notifikasi pasien nyata.",
  groups:[["Identitas antrean","Nomor antrean dan identitas layanan.",["queue_number","queue_type","patient_ref"]],
    ["Lokasi dan pemanggilan","Unit layanan serta waktu rencana panggil.",["service_unit","called_at"]],
    ["Pencatatan petugas","Status antrean dan catatan.",["queue_state","queue_reason"]]]},
 "FIN-04":{title:"Pemeriksaan penjamin",subtitle:"Review informasi cakupan sebelum melanjutkan pelayanan.",
  steps:["Peserta","Masa berlaku","Eligibility"],note:"Eligibility dan kepesertaan hanya data contoh, bukan keputusan BPJS/asuransi.",
  groups:[["Data penjamin","Pilih sumber pembayaran dan nomor peserta sintetis.",["payer_type","policy_no"]],
    ["Berlaku sejak","Tinjau kesesuaian awal dan akhir periode.",["valid_from","valid_until"]],
    ["Verifikasi administrasi","Status hasil pemeriksaan contoh.",["eligibility_state","notes"]]]},
 "RME-01":{title:"Pemeriksaan pasien rawat jalan",subtitle:"Catat konteks kunjungan dan keluhan sebelum asesmen klinis.",
  steps:["Kunjungan aktif","Keluhan awal","Tindak lanjut"],note:"Informasi klinis wajib dinilai oleh tenaga berwenang; mockup tidak membuat diagnosis.",
  groups:[["Konteks pelayanan","Waktu pemeriksaan, poli dan dokter.",["recorded_at","unit","practitioner"]],
    ["Keluhan pasien","Catatan keluhan utama sesuai encounter.",["chief_complaint"]],
    ["Penutup kunjungan","Tahap episode dan rencana tindak lanjut.",["encounter_state","follow_up"]]]},
 "RME-02":{title:"Triase dan asesmen IGD",subtitle:"Urutan dokumentasi kegawatan tanpa menentukan prioritas secara otomatis.",
  steps:["Pilih kategori","Isi tanda vital","Catat tindakan awal"],note:"Kategori triase harus dipilih petugas klinis; warna bukan rekomendasi penanganan.",
  groups:[["Prioritas triase","Waktu dan kategori dipilih tenaga kesehatan.",["triage_at","acuity"]],
    ["Tanda vital awal","Data objektif untuk asesmen IGD.",["systolic","diastolic","respiratory_rate"]],
    ["Keluhan dan tindakan","Catat pengamatan dan tindakan awal oleh petugas.",["triage_note"]]]},
 "RME-03":{title:"Kunjungan dan pemulangan rawat inap",subtitle:"Catat penempatan dan rencana tindak lanjut episode rawat inap.",
  steps:["Masuk ruang rawat","Penempatan","Rencana pulang"],note:"Tidak mengalokasikan bed atau mengakhiri encounter nyata.",
  groups:[["Penerimaan rawat inap","Waktu dan status episode.",["admission_at","admission_state"]],
    ["Penempatan","Bangsal dan kode tempat tidur sintetis.",["ward","bed_code"]],
    ["Rencana pemulangan","Waktu dan rencana transisi perawatan.",["discharge_at","discharge_plan"]]]},
 "RME-04":{title:"Catatan klinis SOAP",subtitle:"Dokumentasi terstruktur S, O, A dan P sesuai profesi dan episode.",
  steps:["Konteks catatan","SOAP","Review kelengkapan"],note:"Catatan ditinjau (demo) bukan catatan ditandatangani; keputusan klinis tidak diisi otomatis.",
  groups:[["Informasi catatan","Jenis catatan, waktu dan penulis.",["note_at","note_type","author"]],
    ["S — Subjektif","Keluhan dan informasi yang dilaporkan pasien.",["subjective"]],
    ["O — Objektif","Temuan pemeriksaan serta data terukur.",["objective"]],
    ["A — Asesmen","Interpretasi klinis petugas berwenang.",["assessment"]],
    ["P — Rencana","Rencana pelayanan dan tindak lanjut.",["plan"]]]},
 "RME-05":{title:"Pencatatan tanda vital",subtitle:"Pengukuran dan antropometri tercatat pada episode pasien yang dipilih.",
  steps:["Waktu pemeriksaan","Tanda vital","Antropometri"],note:"Angka tidak diinterpretasikan otomatis; review field tidak sama dengan validasi klinis.",
  groups:[["Waktu pengukuran","Pastikan waktu sesuai pengukuran.",["measured_at"]],
    ["Tekanan darah","Catat sistolik dan diastolik bersama.",["systolic","diastolic"]],
    ["Nadi dan suhu","Pengukuran observasi rutin.",["heart_rate","temperature"]],
    ["Antropometri","Opsional sesuai layanan dan kondisi pasien.",["weight","height"]]]},
 "RME-06":{title:"Diagnosis dan tindakan",subtitle:"Dokumentasikan kode dan alasan klinis setelah asesmen.",
  steps:["Klasifikasi","Kode","Alasan klinis"],note:"Pemilihan kode memerlukan penilaian klinis; tidak ada autodiagnosis.",
  groups:[["Sistem terminologi","Gunakan referensi kode contoh.",["diagnosis_system","diagnosis_code"]],
    ["Status kepastian dan tindakan","Periksa tahap diagnosis dan tindakan terkait.",["certainty","procedure_code"]],
    ["Justifikasi klinis","Ringkasan alasan penetapan diagnosis.",["clinical_note"]]]},
 "RME-07":{title:"Asuhan keperawatan",subtitle:"Catatan masalah, intervensi, dan evaluasi per shift.",
  steps:["Shift","Intervensi","Evaluasi"],note:"Evaluasi demo tidak menggantikan dokumentasi keperawatan terverifikasi.",
  groups:[["Penanggung jawab shift","Petugas, shift dan waktu observasi.",["nurse","shift","observed_at"]],
    ["Masalah dan intervensi","Tulis asesmen kebutuhan dan rencana tindakan.",["nursing_problem","nursing_intervention"]],
    ["Evaluasi pasien","Catatan respons terhadap tindakan.",["response"]]]},
 "RME-08":{title:"Order pemeriksaan",subtitle:"Susun contoh order klinis dengan indikasi dan prioritas yang jelas.",
  steps:["Pilih layanan","Indikasi","Review order"],note:"Order belum dikirim ke unit penunjang; penandatanganan atau eksekusi tidak aktif.",
  groups:[["Jenis dan prioritas order","Pilih kategori serta tingkat prioritas.",["order_type","priority"]],
    ["Permintaan layanan","Pilih layanan dari katalog sintetis dan waktu order.",["service_code","ordered_at"]],
    ["Alasan dan pemesan","Dokumentasi indikasi klinis dan dokter.",["indication","orderer"]]]},
 "MED-01":{title:"Penerimaan spesimen dan hasil laboratorium",subtitle:"Pisahkan identifikasi sampel dari pencatatan hasil.",
  steps:["Accession","Spesimen","Hasil dan review"],note:"Pencatatan hasil demo tidak mengaktifkan verifikasi atau release LIS.",
  groups:[["Identitas spesimen","Nomor sampel, jenis, dan waktu pengambilan.",["accession","specimen_type","collected_at"]],
    ["Pemeriksaan terpesan","Kode tes untuk sampel yang dipilih.",["test_code"]],
    ["Hasil pengukuran","Hasil, satuan, dan status pekerjaan.",["result_value","unit_symbol","lab_state"]]]},
 "MED-02":{title:"Pelaksanaan radiologi",subtitle:"Pantau pemeriksaan RIS dengan pemisahan order dan catatan akuisisi.",
  steps:["Konfirmasi order","Pemeriksaan","Catatan"],note:"Hasil radiologi dan interpretasi tidak dirilis melalui mockup.",
  groups:[["Order radiologi","Identitas permintaan, jenis dan prioritas.",["order_reference","exam_code","priority"]],
    ["Pelaksanaan","Petugas, waktu dan status pemeriksaan.",["radiographer","exam_at","study_state"]],
    ["Catatan pemeriksaan","Temuan contoh hanya untuk peninjauan.",["finding_note"]]]},
 "MED-03":{title:"Pemeriksaan studi radiologi",subtitle:"Tinjau metadata studi DICOM sintetis.",
  steps:["Pilih studi","Metadata","Review akses"],note:"Viewer dan transfer DICOM riil belum terhubung; tidak ada penandatanganan hasil.",
  groups:[["Identitas studi","UID dan referensi order RIS.",["study_uid_demo","order_reference"]],
    ["Metadata akuisisi","Modalitas, jumlah instance dan waktu.",["modality","instance_count","acquired_at"]],
    ["Tinjauan akses dan catatan","Scope akses contoh dan catatan pemeriksaan.",["access_state","study_note"]]]},
 "MED-04":{title:"Penyusunan resep elektronik",subtitle:"Tinjau obat, dosis, frekuensi dan alergi sebelum menyimpan resep draft.",
  steps:["Obat dan dosis","Rute dan jumlah","Tinjau alergi"],note:"Resep bukan resep signed; tidak ada pengiriman ke farmasi atau dispensing.",
  groups:[["Pemilihan obat","Katalog obat sintetis dan dosis.",["medication_code","dose"]],
    ["Aturan pemakaian","Rute, frekuensi, dan jumlah.",["route","frequency","quantity"]],
    ["Pemeriksaan klinis","Review alergi dan identitas prescriber.",["allergy_checked","prescriber"]]]},
 "MED-05":{title:"Telaah dan penyiapan obat",subtitle:"Pemeriksaan resep, lot serta identitas secara simulasi.",
  steps:["Periksa resep","Lot dan kedaluwarsa","Konfirmasi identitas"],note:"Tidak mengurangi stok, menyerahkan obat, membuat BCMA, atau memvalidasi transaksi dispense.",
  groups:[["Resep yang ditelaah","Identitas resep dan kode obat demo.",["prescription_ref","medication_code"]],
    ["Pemilihan batch","Lot, masa berlaku dan jumlah rencana.",["lot_number","expiry_date","quantity"]],
    ["Pemeriksaan terakhir","Konfirmasi identitas serta farmasis reviewer.",["identity_check","pharmacist"]]]},
 "MED-10":{title:"Medical Check Up",subtitle:"Pantau paket, pemeriksaan dan kelengkapan MCU peserta sintetis.",
  steps:["Paket peserta","Rencana tes","Review laporan"],note:"Kesimpulan MCU demo bukan laporan kesehatan resmi.",
  groups:[["Paket dan peserta","Identitas paket, peserta dan kelompok MCU.",["package_code","participant_ref","checkup_group"]],
    ["Rencana pemeriksaan","Tanggal dan katalog pemeriksaan.",["mcu_date","exam_catalog"]],
    ["Kelengkapan dan kesimpulan","Review hasil serta catatan kesimpulan.",["completion_state","conclusion_note"]]]},
 "FIN-01":{title:"Pencatatan tindakan yang dapat ditagihkan",subtitle:"Rangkum aktivitas pelayanan sebagai draft charge.",
  steps:["Sumber pelayanan","Tarif","Review charge"],note:"Charge draft tidak membuat tagihan atau transaksi pendapatan resmi.",
  groups:[["Sumber layanan","Layanan dan waktu pelaksanaan.",["service_ref","performed_at","source_order"]],
    ["Perhitungan charge","Kuantitas, tarif satuan dan kategori.",["quantity","unit_price","charge_category"]]]},
 "FIN-02":{title:"Penyusunan tagihan",subtitle:"Gabungkan detail invoice dan penjamin sebelum review.",
  steps:["Invoice","Komponen tagihan","Status"],note:"Invoice adalah simulasi; tidak ada penerbitan resmi atau posting keuangan.",
  groups:[["Identitas tagihan","Nomor dan pihak penjamin.",["invoice_no","payer"]],
    ["Perhitungan invoice","Subtotal, diskon serta jatuh tempo.",["subtotal","discount","due_date"]],
    ["Status tagihan","Tahap dokumen invoice demo.",["invoice_state"]]]},
 "FIN-03":{title:"Pencatatan pembayaran",subtitle:"Tinjau nominal dan referensi transaksi demo.",
  steps:["Pilih invoice","Metode dan nominal","Review administrasi"],note:"Penyimpanan draft tidak menerima uang, menerbitkan kuitansi atau settlement.",
  groups:[["Invoice yang dibayar","Referensi invoice sintetis.",["invoice_ref"]],
    ["Metode dan nominal","Metode, jumlah serta waktu contoh.",["payment_method","amount","payment_at"]],
    ["Pemeriksaan administrasi","Referensi dan status review transaksi.",["payment_reference","verification"]]]}
};
function esc(x){return String(x==null?"":x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
function blueprint(code){return Object.prototype.hasOwnProperty.call(specs,code)?specs[code]:null;}
function render(module,fields,values,editable,renderField){
 var spec=blueprint(module&&module.code);
 if(!spec)return null;
 var known=new Set(),panels=[];
 spec.groups.forEach(function(group,i){
  var groupFields=fields.filter(function(f){return group[2].includes(f.key);});
  if(!groupFields.length)return;
  groupFields.forEach(function(f){known.add(f.key);});
  var key="v13-section-"+module.code+"-"+i;
  var type=module.code==="RME-04"&&["subjective","objective","assessment","plan"].includes(groupFields[0].key)?
   groupFields[0].key:"";
  panels.push('<section class="v13-form-section" data-v13-section="'+esc(i+1)+'" data-v13-type="'+esc(type)+'" aria-labelledby="'+esc(key)+'">'+
   '<header class="v13-section-head"><span class="v13-section-index">'+String(i+1).padStart(2,"0")+'</span><div><h3 id="'+esc(key)+'">'+esc(group[0])+'</h3><p>'+esc(group[1])+'</p></div></header>'+
   '<div class="v13-field-grid">'+groupFields.map(function(f){return renderField(f,values,editable);}).join("")+'</div></section>');
 });
 var extra=fields.filter(function(f){return !known.has(f.key);});
 if(extra.length){
  panels.push('<section class="v13-form-section" data-v13-section="extra"><header class="v13-section-head"><span class="v13-section-index">+</span><div><h3>Informasi tambahan</h3><p>Field lain sesuai kontrak modul.</p></div></header>'+
   '<div class="v13-field-grid">'+extra.map(function(f){return renderField(f,values,editable);}).join("")+'</div></section>');
 }
 var required=fields.filter(function(f){return f.required;});
 var filled=required.filter(function(f){return String(values[f.key]==null?"":values[f.key]).trim()!=="";});
 var steps='<div class="v13-flow" role="list" aria-label="Tahapan kerja">'+spec.steps.map(function(step,i){
  return '<span role="listitem"><b>'+String(i+1)+'</b>'+esc(step)+'</span>';
 }).join("")+'</div>';
 var intro='<div class="v13-form-intro" data-v13-module="'+esc(module.code)+'"><div class="v13-intro-top"><div>'+
  '<span class="v13-overline">FORM PEKERJAAN · '+esc(module.code)+'</span><h3>'+esc(spec.title)+'</h3>'+
  '<p>'+esc(spec.subtitle)+'</p></div>'+
  '<div class="v13-completion"><small>Kelengkapan isian wajib</small><strong id="v13-progress-label" aria-live="polite">'+filled.length+' / '+required.length+' terisi</strong>'+
  '<progress id="v13-progress" max="'+required.length+'" value="'+filled.length+'"></progress></div></div>'+
  steps+'<p class="v13-note" role="note">'+esc(spec.note)+'</p></div>';
 return {intro:intro,fields:panels.join(""),code:module.code,groupCount:panels.length,fieldCount:fields.length};
}
function refresh(form){
 if(!form||!form.querySelector("#v13-progress"))return;
 var required=Array.from(form.querySelectorAll(".p0-fields.v13-form-fields [required]"));
 var filled=required.filter(function(el){return String(el.value||"").trim()!=="";}).length;
 var el=form.querySelector("#v13-progress"),label=form.querySelector("#v13-progress-label");
 if(el){el.max=required.length||1;el.value=filled;}
 if(label)label.textContent=filled+" / "+required.length+" terisi";
}
document.addEventListener("input",function(e){if(e.target&&e.target.closest(".p0-fields.v13-form-fields"))refresh(e.target.closest("#p0-editor"));});
document.addEventListener("change",function(e){if(e.target&&e.target.closest(".p0-fields.v13-form-fields"))refresh(e.target.closest("#p0-editor"));});
window.SIMRSFormBlueprintsV13={specs:specs,blueprint:blueprint,render:render,refresh:refresh};
})();