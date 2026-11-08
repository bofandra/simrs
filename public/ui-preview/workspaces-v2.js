/* SIMRS Baru — role-oriented front office and outpatient physician workspaces.
 * Static UI-only design. All records are synthetic and browser-local.
 */
(function(){
"use strict";
var KEY="simrs-workspace-journeys-v2";
var store={front:{},doctor:{}};
try{
  var parsed=JSON.parse(localStorage.getItem(KEY)||"{}");
  if(parsed && typeof parsed==="object")store={front:parsed.front||{},doctor:parsed.doctor||{}};
}catch(_error){}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(store));}catch(_error){}}
function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function ctxKey(p){return p.id+"|"+p.visit;}
function defaultFront(p){return {visitType:"Rawat Jalan",unit:p.unit,payer:p.payer,doctor:"dr. Andi Demo",reason:"Konsultasi rawat jalan (contoh)",mpiChecked:false,draftSaved:false,checkedIn:false};}
function frontRecord(p){var k=ctxKey(p);return Object.assign({},defaultFront(p),store.front[k]||{});}
function doctorRecord(p){var k=ctxKey(p);return Object.assign({soapS:"",soapO:"",soapA:"",soapP:"",allergyReviewed:false,status:"Belum disimpan",revision:1,versions:[]},store.doctor[k]||{});}
function current(params){return params.patients.find(function(p){return p.id===params.state.patient;})||params.patients[0];}
function chip(txt,kind){return '<span class="status '+(kind||"info")+'">'+esc(txt)+'</span>';}
function button(label,action,extra){return '<button type="button" class="btn '+(extra||"")+'" data-ux-action="'+esc(action)+'">'+esc(label)+'</button>';}
function field(label,id,value,kind,options,disabled){
 var control="";
 if(kind==="select"){
   control='<select class="forminput" id="'+id+'" name="'+id+'"'+(disabled?' disabled':'')+'>';
   (options||[]).forEach(function(item){control+='<option value="'+esc(item)+'"'+(value===item?' selected':'')+'>'+esc(item)+'</option>';});
   control+='</select>';
 }else if(kind==="textarea"){
   control='<textarea class="forminput" id="'+id+'" name="'+id+'" rows="3"'+(disabled?' disabled':'')+'>'+esc(value)+'</textarea>';
 }else{
   control='<input class="forminput" id="'+id+'" name="'+id+'" value="'+esc(value)+'" '+(kind==='readonly'?'readonly':'')+(disabled?' disabled':'')+'/>';
 }
 return '<div class="field ux-field"><label for="'+id+'">'+esc(label)+'</label>'+control+'</div>';
}
function patientCard(p,s,isActive){
 return '<button type="button" class="ux-patient'+(isActive?' active':'')+'" data-patient="'+esc(p.id)+'" aria-current="'+(isActive?'true':'false')+'"><span class="ux-patient-head"><strong>'+esc(p.name)+'</strong>'+chip(s,"wait")+'</span><span>'+esc(p.mrn)+' · '+esc(p.age)+'</span><span>'+esc(p.unit)+' · '+esc(p.payer)+'</span></button>';
}
function front(params){
 var selected=current(params),r=frontRecord(selected),allowed=params.state.role==="Pendaftaran"||params.state.role==="Admin Sistem",checked=params.patients.filter(function(p){return frontRecord(p).checkedIn;}).length;
 var optionsUnit=["Poli Penyakit Dalam","Poli Jantung","Poli Umum","Poli Bedah","IGD","Rawat Inap"];
 if(optionsUnit.indexOf(r.unit)<0)optionsUnit.unshift(r.unit);
 var step=r.checkedIn?3:r.draftSaved?2:r.mpiChecked?1:0;
 var stepNames=["Cari pasien & MPI","Isi formulir","Simpan draft","Check-in"];
 var work=params.patients.map(function(p){
   var x=frontRecord(p);return patientCard(p,x.checkedIn?"Check-in":x.draftSaved?"Draft":"Terjadwal",p.id===selected.id);
 }).join("");
 return '<div class="page-head"><div><div class="eyebrow">FR-004 / FR-005 / FR-006 · WF-01</div><h1>Registrasi & perjalanan pasien</h1><p>Daftar kerja pendaftaran, pencocokan identitas, penjamin dan check-in dalam satu konteks.</p></div><div class="actions">'+button("Buat appointment","appointment")+' '+button("Buka katalog CORE-09","module:CORE-09","btn-primary")+'</div></div>'+
 (allowed?'':'<p class="ux-notice">Peran ini hanya dapat melihat registrasi. Pilih Pendaftaran untuk mengubah draft atau check-in demo.</p>')+'<div class="ux-kpis"><div><span>Pasien demo terjadwal</span><strong>'+params.patients.length+'</strong></div><div><span>Check-in demo</span><strong>'+checked+'</strong></div><div><span>Menunggu registrasi</span><strong>'+(params.patients.length-checked)+'</strong></div></div>'+
 '<div class="ux-flow" aria-label="Tahapan registrasi">'+stepNames.map(function(n,i){return '<span class="'+(i<=step?'done':'')+'">'+(i+1)+'. '+esc(n)+'</span>';}).join('')+'</div>'+
 '<div class="ux-main-grid"><section class="card ux-worklist"><div class="card-h"><h2>Daftar pasien hari ini</h2>'+chip("Data sintetis")+'</div><div class="card-body"><label for="ux-patient-search">Cari nama / nomor RM</label><input class="forminput" id="ux-patient-search" placeholder="Cari pasien demo" autocomplete="off"/><div class="ux-patient-list" id="ux-patients">'+work+'</div></div></section>'+
 '<section class="card ux-work-area"><div class="ux-patient-banner"><div><strong>'+esc(selected.name)+'</strong><span>'+esc(selected.mrn)+' · '+esc(selected.age)+' · '+esc(selected.visit)+'</span></div><div>'+chip(r.checkedIn?"Check-in (Demo)":r.draftSaved?"Draft tersimpan":"Belum check-in",r.checkedIn?"good":"wait")+'</div></div>'+
 '<div class="card-body"><div class="ux-subhead"><div><h2>Registrasi kunjungan</h2><p>Identitas pasien dan encounter berasal dari konteks demo yang sama.</p></div>'+(allowed?button("Periksa MPI (Demo)","mpi"):'')+'</div>'+
 (r.mpiChecked?'<p class="ux-positive" role="status">Pencocokan identitas telah ditinjau dalam simulasi. Tidak membuat/merge master pasien.</p>':'<p class="ux-notice">Sebelum check-in, tinjau kemungkinan duplikasi dan pastikan pasien yang benar.</p>')+
 '<form id="ux-registration" novalidate><div class="ux-form-grid">'+
 field("Pasien · read-only","ux-reg-patient",selected.name+" / "+selected.mrn,"readonly",null,true)+
 field("Encounter · read-only","ux-reg-encounter",selected.visit,"readonly",null,true)+
 field("Jenis kunjungan *","ux-visit-type",r.visitType,"select",["Rawat Jalan","IGD","Rawat Inap"],r.checkedIn)+
 field("Poli / tujuan *","ux-reg-unit",r.unit,"select",optionsUnit,r.checkedIn)+
 field("Penjamin *","ux-reg-payer",r.payer,"select",["BPJS","Umum","Asuransi"],r.checkedIn)+
 field("Dokter / penanggung jawab *","ux-reg-doctor",r.doctor,"select",["dr. Andi Demo","dr. Budi Demo","dr. Citra Demo"],r.checkedIn)+
 field("Alasan kunjungan","ux-reg-reason",r.reason,"textarea",null,r.checkedIn)+
 '</div><div id="ux-reg-error" class="ux-error" role="alert" hidden></div><div class="ux-actionbar">'+chip(r.draftSaved?"Draft tersimpan":"Belum disimpan",r.draftSaved?"good":"wait")+'<span class="spacer"></span>'+
 button("Simpan draft","save-front",r.checkedIn||!allowed?"ux-hide":"")+' '+button("Check-in demo","checkin-front","btn-primary"+(r.checkedIn||!allowed?" ux-hide":""))+'</div></form>'+
 '<div class="ux-links"><strong>Lanjutkan ke:</strong>'+button("Appointment","module:CORE-10")+' '+button("Antrean","module:CORE-11")+' '+(window.SIMRSRoleDemo&&window.SIMRSRoleDemo.isAuthenticated()&&!window.SIMRSRoleDemo.isReviewer()?"":button("Workspace dokter","route:clinical:soap"))+'</div></div></section>'+
 '<section class="card ux-aside"><div class="card-h"><h2>Ringkasan episode</h2></div><div class="card-body"><div class="statline"><span>Nomor RM</span><strong>'+esc(selected.mrn)+'</strong></div><div class="statline"><span>Encounter</span><strong>'+esc(selected.visit)+'</strong></div><div class="statline"><span>Unit</span><strong>'+esc(r.unit)+'</strong></div><div class="statline"><span>Penjamin</span><strong>'+esc(r.payer)+'</strong></div><div class="statline"><span>Status</span>'+chip(r.checkedIn?"Check-in (Demo)":"Belum check-in",r.checkedIn?"good":"wait")+'</div><p class="ux-notice">Check-in ini hanya mengubah status lokal di browser; tidak membuat Encounter atau nomor antrean nyata.</p></div></section></div>';
}
function clinical(params){
 var p=current(params),r=doctorRecord(p),tab=params.state.clinicalTab||"soap";
 var tabs=params.state.role==="Perawat"&&window.SIMRSRoleDemo?.isAuthenticated()&&!window.SIMRSRoleDemo.isReviewer()?
 [["soap","CPPT Keperawatan"],["vitals","Asesmen & TTV"],["history","Riwayat"]]:
 [["soap","SOAP / CPPT"],["vitals","Asesmen & TTV"],["diagnosis","Diagnosis"],["order","CPOE"],["medication","E-Resep"],["history","Riwayat"]];
 var locked=r.status==="Reviewed (Demo)";
 var authorized=params.state.role==="Dokter RJ"||params.state.role==="Perawat"||params.state.role==="DPJP Rawat Inap";
 var readOnly=locked||!authorized;
 var main="";
 if(tab==="soap"){
  main='<div class="ux-form-grid">'+
   field("Subjektif (S) *","ux-soap-s",r.soapS,"textarea",null,readOnly)+
   field("Objektif (O) *","ux-soap-o",r.soapO,"textarea",null,readOnly)+
   field("Asesmen (A) *","ux-soap-a",r.soapA,"textarea",null,readOnly)+
   field("Rencana (P) *","ux-soap-p",r.soapP,"textarea",null,readOnly)+'</div>'+
   '<label class="ux-check"><input id="ux-allergy" type="checkbox"'+(r.allergyReviewed?' checked':'')+(readOnly?' disabled':'')+'/> Saya telah meninjau informasi alergi, obat aktif dan riwayat pada panel kanan.</label>'+
   '<div id="ux-soap-error" class="ux-error" role="alert" hidden></div><div class="ux-actionbar">'+chip(r.status,r.status==="Reviewed (Demo)"?"good":"wait")+'<span class="spacer"></span>'+
   (locked?(authorized?button("Buat addendum demo","doctor-addendum"):''):button("Simpan draft","doctor-save",readOnly?"ux-hide":""))+' '+button("Tinjau kelengkapan","doctor-review","btn-primary"+(readOnly?" ux-hide":""))+'</div>';
 }else if(tab==="vitals"){
  main='<div class="ux-module-panel"><h3>Asesmen dan tanda vital</h3><p>Catat tekanan darah, suhu, nadi, respirasi, antropometri, dan asesmen dengan referensi kunjungan yang sama.</p>'+button("Buka form Asesmen & TTV","module:RME-05","btn-primary")+'</div>';
 }else if(tab==="diagnosis"){
  main='<div class="ux-module-panel"><h3>Diagnosis dan prosedur</h3><p>Kode diagnosis dipilih dari terminologi. Diagnosis utama dan sekunder ditautkan ke encounter pasien.</p>'+button("Buka form Diagnosis & Prosedur","module:RME-06","btn-primary")+'</div>';
 }else if(tab==="order"){
  main='<div class="ux-module-panel"><h3>Computerized Provider Order Entry</h3><p>Permintaan lab, radiologi atau tindakan memakai katalog layanan dan item berulang, belum dikirim ke layanan nyata.</p>'+button("Buka komposer CPOE","module:RME-08","btn-primary")+'</div>';
 }else if(tab==="medication"){
  main='<div class="ux-module-panel"><h3>Resep elektronik</h3><p>Review alergi, pilih obat dari master, masukkan dosis, rute, frekuensi, jumlah dan instruksi.</p>'+button("Buka komposer E-Resep","module:MED-04","btn-primary")+'</div>';
 }else{
  main='<div class="ux-module-panel"><h3>Riwayat catatan (Demo)</h3><div class="timeline"><div class="timeline-item"><b>Registrasi</b><span>'+esc(p.visit)+'</span></div>'+
   (r.versions||[]).map(function(v){return '<div class="timeline-item"><b>Review versi '+esc(v.version)+'</b><span>'+esc(v.at)+'</span></div>';}).join('')+
   '<div class="timeline-item"><b>Catatan saat ini</b><span>'+esc(r.status)+'</span></div></div></div>';
 }
 return '<div class="page-head"><div><div class="eyebrow">RME-01 / RME-04 / FR-009 · WF-02</div><h1>'+esc(params.state.role==="Perawat"?"Workspace Keperawatan":"Workspace Dokter Rawat Jalan")+'</h1><p>Daftar pasien, dokumentasi klinis dan riwayat dalam satu konteks encounter.</p></div><div class="actions">'+button("Lihat riwayat","tab:history")+(params.state.role==="Perawat"&&window.SIMRSRoleDemo?.isAuthenticated()&&!window.SIMRSRoleDemo.isReviewer()?"":' '+button("Buka form CPOE","module:RME-08","btn-primary"))+'</div></div>'+
 '<div class="ux-main-grid ux-clinical"><section class="card ux-worklist"><div class="card-h"><h2>Daftar pasien klinis</h2>'+chip(params.patients.length+" pasien demo")+'</div><div class="card-body"><label for="ux-patient-search">Cari pasien / No. RM</label><input id="ux-patient-search" class="forminput" placeholder="Nama / nomor RM"/><div class="ux-patient-list" id="ux-patients">'+
 params.patients.map(function(item){var d=doctorRecord(item);return patientCard(item,d.status==="Reviewed (Demo)"?"Ditinjau":"Menunggu",item.id===p.id);}).join('')+'</div></div></section>'+
 '<section class="card ux-work-area"><div class="ux-patient-banner"><div><strong>'+esc(p.name)+'</strong><span>'+esc(p.mrn)+' · '+esc(p.age)+' · '+esc(p.visit)+' · '+esc(p.unit)+'</span></div>'+chip("Encounter aktif (Demo)","good")+'</div>'+
 '<div class="ux-tabs" role="tablist" aria-label="Menu klinis pasien">'+tabs.map(function(pair){return '<button type="button" role="tab" aria-selected="'+(tab===pair[0])+'" class="'+(tab===pair[0]?'active':'')+'" data-ux-action="tab:'+pair[0]+'">'+esc(pair[1])+'</button>';}).join('')+'</div>'+
 '<div class="card-body"><div class="ux-subhead"><div><h2>'+esc(tabs.find(function(v){return v[0]===tab;})?.[1]||"Dokumentasi")+'</h2><p>Catatan versi '+esc(r.revision)+' · '+esc(p.visit)+'</p></div>'+chip(r.status,r.status==="Reviewed (Demo)"?"good":"wait")+'</div>'+
 (!authorized?'<p class="ux-error ux-error-visible" role="alert">Peran ini hanya dapat melihat. Ubah ke Dokter RJ atau Perawat untuk membuat draft demo.</p>':'')+
 (locked&&tab==="soap"?'<p class="ux-positive">Catatan telah ditinjau dan dikunci di browser demo. Perubahan berikutnya melalui addendum baru.</p>':'')+
 main+'<p class="ux-muted">Tidak ada tanda tangan klinis atau pengiriman SATUSEHAT. Tombol review hanya memeriksa kelengkapan data demo.</p></div></section>'+
 '<section class="card ux-aside"><div class="card-h"><h2>Clinical summary</h2>'+chip("Periksa sebelum tindakan","wait")+'</div><div class="card-body">'+
 '<div class="statline"><span>Alergi</span><strong>Penisilin (Demo)</strong></div>'+
 '<div class="statline"><span>Obat aktif</span><strong>Amlodipin (Demo)</strong></div>'+
 '<div class="statline"><span>Diagnosis terdahulu</span><strong>I10 (Demo)</strong></div>'+
 '<div class="statline"><span>Observasi</span><strong>138/88 (Demo)</strong></div>'+
 '<div class="divider"></div><h3>Linimasa episode</h3><div class="timeline"><div class="timeline-item"><b>Registrasi</b><span>'+esc(p.visit)+'</span></div>'+
 '<div class="timeline-item"><b>Dokumentasi</b><span>'+esc(r.status)+'</span></div></div>'+
 '<div class="ux-links">'+button("Form keperawatan","module:RME-07")+' '+button("Dokumen medis","module:RME-11")+'</div></div></section></div>';
}
function shortcuts(role){
 var groups={
 "Pendaftaran":[["Registrasi","route:front:registration"],["Pencocokan MPI","module:CORE-08"],["Appointment","module:CORE-10"],["Antrean","module:CORE-11"]],
 "Dokter RJ":[["SOAP / CPPT","route:clinical:soap"],["Tanda vital","route:clinical:vitals"],["Diagnosis","route:clinical:diagnosis"],["Order pemeriksaan","route:clinical:order"],["E-Resep","route:clinical:medication"]],
 "Perawat":[["Catatan SOAP","route:clinical:soap"],["Asesmen & TTV","module:RME-05"],["Keperawatan","module:RME-07"]],
 "Dokter IGD":[["IGD & Triase","route:acute:tracker"],["Form triase","module:RME-02"],["Order","module:RME-08"]],
 "DPJP Rawat Inap":[["Rawat Inap","route:acute:tracker"],["CPPT","route:clinical:soap"],["Discharge","module:RME-03"]],
 "ATLM":[["LIS","route:lab:lis"],["Order lab","module:MED-01"]],
 "Farmasis":[["Farmasi","route:pharmacy:queue"],["E-Resep","module:MED-04"],["Dispensing","module:MED-05"]],
 "Kasir":[["Keuangan","route:finance:billing"],["Invoice","module:FIN-02"],["Pembayaran","module:FIN-03"]],
 "Admin Sistem":[["Master pasien","module:CORE-08"],["Master praktisi","module:CORE-04"],["Otorisasi","module:CORE-02"],["Integrasi","module:ENT-11"]],
 "Petugas MCU":[["MCU perusahaan","route:lab:mcu"],["Form MCU","module:MED-10"]],
 "Gudang":[["Farmasi & Logistik","route:pharmacy:queue"],["Inventory","module:OPS-01"],["Pengadaan","module:OPS-02"]],
 "Casemix":[["Klaim & Keuangan","route:finance:billing"],["Casemix INA-CBG","module:FIN-06"],["Klaim","module:FIN-07"]],
 "Manajemen RS":[["Dashboard RS","route:management:overview"],["Laporan RL","module:ENT-09"],["Analitik Multi-RS","module:ENT-10"]],
 "Tim Mutu":[["Manajemen & Mutu","route:management:overview"],["Indikator Mutu","module:ENT-08"],["Patient Safety","module:ENT-06"]],
 "Integrasi":[["Monitoring integrasi","module:ENT-11"],["Dashboard RS","route:management:overview"]],
 "Koordinator OK":[["Operasi & Bed","route:acute:tracker"],["Kamar Operasi","module:MED-06"]],
 "Dokter Anestesi":[["Anestesi & Recovery","module:MED-07"],["Kamar Operasi","module:MED-06"]],
 "Radiografer":[["Diagnostic workspace","route:lab:lis"],["Radiologi RIS","module:MED-02"]],
 "Radiolog":[["Radiologi RIS","module:MED-02"],["PACS / DICOM","module:MED-03"]],
 "Ahli Gizi":[["Asesmen Gizi","module:MED-11"],["Produksi gizi","module:OPS-05"]],
 "Petugas CSSD":[["Sterilisasi CSSD","module:OPS-03"],["Logistik","route:pharmacy:queue"]],
 "Petugas Dapur":[["Produksi & distribusi gizi","module:OPS-05"],["Gizi klinis","module:MED-11"]],
 "Petugas BPJS":[["Bridging BPJS","module:FIN-05"],["Klaim","module:FIN-07"]],
 "Coder":[["Casemix & INA-CBG","module:FIN-06"],["Diagnosis","module:RME-06"]],
 "Pasien Demo":[["Portal Pasien","module:RME-12"],["Appointment","module:CORE-10"]],
 "Perawat HD":[["Hemodialisis","module:MED-08"],["Keperawatan","module:RME-07"]],
 "Terapis Rehabilitasi":[["Rehabilitasi Medik","module:MED-09"]],
 "Koordinator MCU":[["MCU perusahaan","route:lab:mcu"],["Program MCU","module:MED-10"]],
 "Petugas Bank Darah":[["Bank Darah & Transfusi","module:MED-12"]],
 "Pengadaan":[["Purchase & Procurement","module:OPS-02"],["Inventory","module:OPS-01"]],
 "Petugas Laundry":[["Laundry & Linen","module:OPS-04"]],
 "Akuntan":[["General Ledger","module:FIN-08"],["AP / AR","module:FIN-09"]],
 "Budget Owner":[["Budgeting","module:FIN-10"],["Dashboard Keuangan","route:finance:billing"]],
 "Analis Biaya":[["Unit Costing","module:FIN-11"],["Billing","route:finance:billing"]],
 "Petugas Aset":[["Manajemen Aset","module:OPS-06"]],
 "Teknisi":[["Maintenance & Kalibrasi","module:OPS-07"],["Manajemen Aset","module:OPS-06"]],
 "Petugas Fasilitas":[["Housekeeping & Fasilitas","module:OPS-08"],["Maintenance","module:OPS-07"]],
 "Koordinator Transport":[["Ambulans & Transport","module:OPS-09"]],
 "HR Admin":[["HRIS & Personnel","module:ENT-01"]],
 "Payroll Admin":[["Attendance & Payroll","module:ENT-02"]],
 "Rekruter":[["Rekrutmen & Talent","module:ENT-03"]],
 "Tim PPI":[["HAIs & PPI","module:ENT-05"],["Patient Safety","module:ENT-06"]]
 };
 return groups[role]||[["Area kerja saya","route:management:overview"],["Katalog form sesuai peran","forms"]];
}
function decorate(params){
 var holder=document.getElementById("role-nav");
 if(holder){
  holder.innerHTML=shortcuts(params.state.role).map(function(item){
   var route=item[1],active=(route.indexOf("route:")===0 && route.split(":")[1]===params.state.active);
   return '<button type="button" class="ux-nav-link'+(active?' active':'')+'" data-ux-action="'+esc(route)+'">'+esc(item[0])+'</button>';
  }).join("");
 }
 var crumb=document.getElementById("crumb");
 if(crumb && params.state.active==="clinical")crumb.textContent="Dokter & Perawat / "+(params.state.clinicalTab||"SOAP").toUpperCase();
 if(crumb && params.state.active==="front")crumb.textContent="Front Office / Registrasi";
}
function error(id,message){
 var box=document.getElementById(id);if(box){box.hidden=!message;box.textContent=message||"";}
 if(message){var focus=document.querySelector("#ux-registration .forminput:not(:disabled), #ux-soap-s:not(:disabled)");if(focus)focus.focus();}
}
function value(id){var el=document.getElementById(id);return el?String(el.value||"").trim():"";}
function selectedPatient(){var shell=window.__SIMRS_PREVIEW__;return shell?.state&&shell?.patients?.find(function(p){return p.id===shell.state.patient;});}
function navigate(area,tab){
 var shell=window.__SIMRS_PREVIEW__;if(!shell)return;
 if(window.SIMRSRoleDemo&&!window.SIMRSRoleDemo.allowArea(area)){shell.toast("Workspace tidak tersedia untuk akun demo ini.");return;}
 var st=shell.state;st.active=area;
 if(area==="clinical"){
  st.clinicalTab=tab||"soap";
  if(st.role==="Pendaftaran")st.role="Dokter RJ"; /* role selector is a demo, never real authorization */
 }
 if(area==="front")st.frontTab=tab||"registration";
 var sub=(area==="front"?st.frontTab:area==="clinical"?st.clinicalTab:tab||"overview");
 if(location.hash!=="#/"+area+"/"+sub)location.hash="#/"+area+"/"+sub;
 shell.render();
}
function openModule(code){
 var shell=window.__SIMRS_PREVIEW__;
 if(!shell||!window.SIMRSFormEngine)return;
 if(window.SIMRSRoleDemo&&!window.SIMRSRoleDemo.allowModule(code)){shell.toast("Form tidak tersedia untuk akun demo ini.");return;}
 if(window.SIMRSRoleDemo&&window.SIMRSRoleDemo.isAuthenticated()&&!window.SIMRSRoleDemo.isReviewer()){
  if(!window.SIMRSFormEngine.openForRole(code,shell.state.role)){shell.toast("Form belum tersedia untuk akun demo ini.");return;}
  shell.state.active="forms";
  location.hash="#/forms/"+code;
  shell.render();
  return;
 }
 shell.state.active="forms";
 shell.render();
 var control=document.querySelector('#p0-catalog-list [data-code="'+code+'"]');
 if(!control){var filter=document.getElementById("p0-priority");if(filter){filter.value="all";filter.dispatchEvent(new Event("change",{bubbles:true}));control=document.querySelector('#p0-catalog-list [data-code="'+code+'"]');}}
 if(control)control.click();
 location.hash="#/forms/"+code;
}
function saveFront(checkin){
 var shell=window.__SIMRS_PREVIEW__;if(!shell)return;
 if(shell.state.role!=="Pendaftaran"&&shell.state.role!=="Admin Sistem"){shell.toast("Peran ini tidak dapat mengubah registrasi demo.");return;}
 var p=shell.patients.find(function(item){return item.id===shell.state.patient;});
 if(!p)return;
 var k=ctxKey(p),r=frontRecord(p);
 if(r.checkedIn){shell.toast("Check-in demo sudah dicatat; tidak dibuat ulang.");return;}
 r.visitType=value("ux-visit-type");r.unit=value("ux-reg-unit");r.payer=value("ux-reg-payer");
 r.doctor=value("ux-reg-doctor");r.reason=value("ux-reg-reason");
 if(!r.visitType||!r.unit||!r.payer||!r.doctor){error("ux-reg-error","Jenis kunjungan, unit, penjamin, dan dokter wajib diisi.");return;}
 if(!r.mpiChecked){error("ux-reg-error","Lakukan pemeriksaan MPI simulasi sebelum menyimpan registrasi.");return;}
 if(checkin&&!r.draftSaved){error("ux-reg-error","Simpan draft registrasi terlebih dahulu sebelum check-in.");return;}
 r.draftSaved=true;if(checkin)r.checkedIn=true;
 store.front[k]=r;persist();shell.render();
 shell.toast(checkin?"Check-in DEMO selesai untuk "+p.name+". Tidak ada Encounter nyata.":"Draft registrasi demo tersimpan untuk "+p.name+".");
}
function saveDoctor(review){
 var shell=window.__SIMRS_PREVIEW__;if(!shell)return;
 if(!["Dokter RJ","Perawat","DPJP Rawat Inap"].includes(shell.state.role)){shell.toast("Peran demo tidak memiliki akses edit SOAP.");return;}
 var p=shell.patients.find(function(item){return item.id===shell.state.patient;});if(!p)return;
 var k=ctxKey(p),r=doctorRecord(p);
 if(r.status==="Reviewed (Demo)"){shell.toast("Catatan ditinjau terkunci. Buat addendum demo.");return;}
 r.soapS=value("ux-soap-s");r.soapO=value("ux-soap-o");r.soapA=value("ux-soap-a");r.soapP=value("ux-soap-p");
 r.allergyReviewed=!!document.getElementById("ux-allergy")?.checked;
 if(review){
  var missing=[["S",r.soapS],["O",r.soapO],["A",r.soapA],["P",r.soapP]].filter(function(pair){return !pair[1];}).map(function(pair){return pair[0];});
  if(!r.allergyReviewed)missing.push("review alergi");
  if(missing.length){error("ux-soap-error","Lengkapi "+missing.join(", ")+" sebelum review.");return;}
  r.status="Reviewed (Demo)";
  r.versions=(r.versions||[]).concat([{version:r.revision,at:new Date().toISOString()}]);
 }else r.status="Draft";
 store.doctor[k]=r;persist();shell.render();
 shell.toast(review?"SOAP telah ditinjau dan dikunci sebagai DEMO (belum signed).":"Draft SOAP tersimpan pada pasien/encounter demo.");
}
function action(command){
 var shell=window.__SIMRS_PREVIEW__;if(!shell)return;
 if(command.indexOf("route:")===0){var a=command.split(":");navigate(a[1],a[2]);return;}
 if(command.indexOf("module:")===0){openModule(command.slice(7));return;}
 if(command.indexOf("tab:")===0){navigate("clinical",command.slice(4));return;}
 if(command==="forms"){shell.state.active="forms";shell.render();location.hash="#/forms/catalog";return;}
 if(command==="appointment"){
  var b=document.querySelector('[data-action="appointment"]');if(b)b.click();else openModule("CORE-10");return;
 }
 var p=shell.patients.find(function(item){return item.id===shell.state.patient;});if(!p)return;
 if(command==="mpi"){
  if(shell.state.role!=="Pendaftaran"&&shell.state.role!=="Admin Sistem"){shell.toast("Peran ini tidak dapat meninjau MPI demo.");return;}
  var r=frontRecord(p);r.mpiChecked=true;store.front[ctxKey(p)]=r;persist();shell.render();
  shell.toast("Review MPI disimulasikan; verifikasi identitas asli tidak dilakukan.");return;
 }
 if(command==="save-front"){saveFront(false);return;}
 if(command==="checkin-front"){saveFront(true);return;}
 if(command==="doctor-save"){saveDoctor(false);return;}
 if(command==="doctor-review"){saveDoctor(true);return;}
 if(command==="doctor-addendum"){
  if(!["Dokter RJ","Perawat","DPJP Rawat Inap"].includes(shell.state.role)){shell.toast("Peran demo tidak memiliki akses addendum.");return;}
  var d=doctorRecord(p);if(d.status!=="Reviewed (Demo)")return;
  d.revision++;d.status="Draft";store.doctor[ctxKey(p)]=d;persist();shell.render();
  shell.toast("Addendum demo baru dibuat; riwayat review sebelumnya disimpan.");return;
 }
}
function routeFromHash(st){
 var m=(location.hash||"").match(/^#\/(front|clinical|acute|lab|pharmacy|finance|management)\/([a-z-]+)$/);
 if(!m)return;
 st.active=m[1];
 if(m[1]==="clinical")st.clinicalTab=m[2];
 if(m[1]==="front")st.frontTab=m[2];
}
document.addEventListener("click",function(e){
 var b=e.target.closest("[data-ux-action]");if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();action(b.getAttribute("data-ux-action"));
},true);
document.addEventListener("input",function(e){
 if(e.target.id!=="ux-patient-search")return;
 var q=e.target.value.toLowerCase();document.querySelectorAll("#ux-patients .ux-patient").forEach(function(row){
  row.hidden=row.textContent.toLowerCase().indexOf(q)<0;
 });
},true);
window.addEventListener("hashchange",function(){
 var shell=window.__SIMRS_PREVIEW__;if(!shell)return;
 routeFromHash(shell.state);shell.render();
});
window.SIMRSWorkspacesV2={front:front,clinical:clinical,decorate:decorate,shortcuts:shortcuts,routeFromHash:routeFromHash,
  getStore:function(){return store;},reset:function(){store={front:{},doctor:{}};try{localStorage.removeItem(KEY);}catch(_error){}}};
})();
