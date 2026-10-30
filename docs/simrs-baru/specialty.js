(function(){
"use strict";
// SIMRS Baru v3: simulated workflow records, never real clinical data.
const e=v=>String(v??"").replace(/[&<>"']/g,k=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[k]));
const status=(x)=>'<span class="badge '+(/released|completed|delivered|sterile|distributed|present/.test(x)?"success":"warning")+'">'+e(x)+'</span>';
const B=(act,label,id="",cl="small primary")=>'<button class="btn '+cl+'" data-action="'+act+'" data-id="'+e(id)+'">'+e(label)+'</button>';
const T=(headers,rows)=>'<div class="table-wrap"><table><thead><tr>'+headers.map(h=>'<th>'+h+'</th>').join("")+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+row.map(v=>'<td>'+v+'</td>').join("")+'</tr>').join("")+'</tbody></table></div>';
const P=(title,sub,content)=>'<section class="panel"><div class="panel-head"><div><h2>'+title+'</h2><p>'+sub+'</p></div></div>'+content+'</section>';
const H=(code,title,desc,action)=>'<div class="page-heading"><div><div class="eyebrow">'+code+'</div><h1>'+title+'</h1><p class="subheading">'+desc+'</p></div><div class="page-tools">'+action+'</div></div>';
const M=(title,num,desc)=>'<article class="kpi"><span>'+title+'</span><strong>'+num+'</strong><small>'+desc+'</small></article>';
const pick=(name,label,items,chosen)=>'<label class="form-label">'+label+'<select name="'+name+'" class="form-input">'+items.map(([v,t])=>'<option value="'+e(v)+'" '+(v===chosen?"selected":"")+'>'+e(t)+'</option>').join("")+'</select></label>';
const input=(name,label,val="",attrs="")=>'<label class="form-label">'+label+'<input name="'+name+'" class="form-input" value="'+e(val)+'" '+attrs+' required></label>';
const notes='<div class="notice" style="margin-top:15px">Seluruh informasi dan transaksi dalam halaman ini adalah contoh sintetis, bukan data operasional rumah sakit. Tidak ada koneksi database, alat medis atau regulator.</div>';
const steps={
radiology:["requested","scheduled","acquired","reported","released"],
surgery:["requested","scheduled","checklist-ready","operating","recovery","completed"],
nutrition:["ordered","prepared","cooked","delivered"],
cssd:["dirty","decontaminated","packed","sterilizing","sterile","distributed"],
laundry:["received","sorted","washed","dried","inspected","delivered"]
};
const labels={requested:"Permintaan",scheduled:"Terjadwal",acquired:"Akuisisi",reported:"Ekspertise",released:"Released",operating:"Intraoperatif",recovery:"PACU","checklist-ready":"Checklist OK",completed:"Selesai",ordered:"Order Diet",prepared:"Persiapan",cooked:"Selesai Produksi",delivered:"Diterima",dirty:"Kotor",decontaminated:"Dekontaminasi",packed:"Pengemasan",sterilizing:"Sterilisasi",sterile:"Steril",distributed:"Distribusi",received:"Diterima",sorted:"Sortir",washed:"Pencucian",dried:"Pengeringan",inspected:"Inspeksi"};
const config={
radiology:{title:"Radiologi / RIS & PACS",eyebrow:"PENUNJANG · RADIOLOGI",description:"Worklist permintaan, penjadwalan, akuisisi, ekspertise, dan release hasil. Metadata DICOM ditampilkan sebagai simulasi.",create:"＋ Order Radiologi",array:"radStudies",event:"rad",table:"radiology.rad_orders",relations:["orders.service_orders → radiology.rad_orders","radiology.rad_orders → radiology.rad_exams","radiology.rad_exams → radiology.rad_reports"],cols:["No. Pemeriksaan","Encounter","Pemeriksaan / Modalitas","Status","Aksi"],seed:{id:"RAD-001",orderId:"SO-03",encounterId:"E-1003",exam:"Foto Thorax",modality:"CR",status:"requested",report:"",studyUid:"1.2.826.0.1.3680043.10.900.1"}},
surgery:{title:"Kamar Operasi & Anestesi",eyebrow:"PELAYANAN KHUSUS · BEDAH",description:"Jadwal bedah, checklist keselamatan, kesiapan set CSSD, tindakan, anestesi, dan pemulihan PACU.",create:"＋ Jadwalkan Operasi",array:"surgeryCases",event:"surgery",table:"operations.surgery_schedules",relations:["encounter.encounters → operations.surgery_schedules","operations.cssd_cycles → operations.surgery_events","operations.surgery_events → billing.charges"],cols:["Kasus Bedah","Encounter","Tindakan / Kamar","Status","Aksi"],seed:{id:"SUR-001",encounterId:"E-1003",procedure:"Debridement luka",room:"OK-02",cssdId:"CSSD-001",anesthesia:"Regional",notes:"",status:"requested",billed:false}},
nutrition:{title:"Gizi Klinis & Produksi",eyebrow:"GIZI · DIET & KITCHEN",description:"Order diet pasien, persiapan bahan, produksi makanan, dan distribusi tray ke pasien.",create:"＋ Order Diet",array:"diets",event:"diet",table:"nutrition.diet_orders",relations:["encounter.encounters → nutrition.diet_orders","nutrition.diet_orders → nutrition.production_batches","nutrition.production_batches → nutrition.tray_deliveries"],cols:["Order Diet","Encounter","Diet / Sesi Makan","Status","Aksi"],seed:{id:"DIET-001",encounterId:"E-1003",diet:"Diet DM 1700 kkal",meal:"Makan siang",allergy:"Belum diverifikasi",kitchenBatch:"",status:"ordered"}},
cssd:{title:"CSSD & Sterilisasi",eyebrow:"OPERASIONAL · STERIL SUPPLY",description:"Pelacakan set instrumen dari kotor hingga sterilisasi dan distribusi. Status CSSD mempengaruhi kesiapan operasi simulasi.",create:"＋ Batch CSSD",array:"cssdCycles",event:"cssd",table:"operations.cssd_cycles",relations:["operations.cssd_sets → operations.cssd_cycles","operations.cssd_cycles → operations.cssd_cycle_items","operations.cssd_cycles → operations.cssd_distributions"],cols:["Batch Sterilisasi","Set Instrumen","Jumlah / Sterilizer","Status","Aksi"],seed:{id:"CSSD-001",set:"Minor Surgery Set #1",instrumentCount:18,sterilizer:"STEAM-01",status:"dirty",history:["dirty"]}},
laundry:{title:"Laundry & Linen",eyebrow:"OPERASIONAL · LINEN",description:"Pengumpulan linen, sortir, pencucian, pengeringan, inspeksi dan pengantaran kembali ke unit.",create:"＋ Batch Laundry",array:"laundryCycles",event:"laundry",table:"operations.laundry_cycles",relations:["operations.linen_items → operations.linen_batches","operations.linen_batches → operations.laundry_cycles","operations.laundry_cycles → operations.linen_movements"],cols:["Batch Linen","Jenis Linen","Jumlah / Asal Unit","Status","Aksi"],seed:{id:"LINEN-001",item:"Linen rawat inap",quantity:24,source:"Ruang Melati",status:"received",history:["received"]}}
};
const patientFor=(d,id)=>{let pid=d.encounters.find(x=>x.id===id)?.patientId;return d.patients.find(x=>x.id===pid)?.name||"—"};
const encOptions=(d)=>pick("encounterId","Encounter",d.encounters.map(x=>[x.id,x.id+" · "+patientFor(d,x.id)]),"E-1003");
function init(d){
 for(const [name,def] of Object.entries(config))if(!Array.isArray(d[def.array]))d[def.array]=[JSON.parse(JSON.stringify(def.seed))];
 if(!Array.isArray(d.staff))d.staff=[{id:"EMP-001",name:"dr. Alya S. (Demo)",unit:"Poli Penyakit Dalam",role:"Dokter",practitionerId:"PR-01"},{id:"EMP-002",name:"Perawat Rina (Demo)",unit:"Ruang Melati",role:"Perawat",practitionerId:""},{id:"EMP-003",name:"Petugas Lab Bagas (Demo)",unit:"Laboratorium",role:"ATLM",practitionerId:""}];
 if(!Array.isArray(d.shifts))d.shifts=[{id:"SHIFT-001",employeeId:"EMP-001",date:"2026-10-30",start:"08:00",finish:"14:00"},{id:"SHIFT-002",employeeId:"EMP-002",date:"2026-10-30",start:"14:00",finish:"21:00"}];
 if(!Array.isArray(d.attendanceDemo))d.attendanceDemo=[];
}
function renderWorkflow(name,c){
 const def=config[name],d=c.data,records=d[def.array],phases=steps[name];
 const rows=records.map(r=>{
  let headline="",extra="";
  if(name==="radiology"){headline=r.exam+" / "+r.modality;extra=r.orderId;}
  if(name==="surgery"){headline=r.procedure+" / "+r.room;extra=r.cssdId;}
  if(name==="nutrition"){headline=r.diet+" / "+r.meal;extra=r.kitchenBatch||"Belum produksi";}
  if(name==="cssd"){headline=r.set;extra=r.instrumentCount+" alat / "+r.sterilizer;}
  if(name==="laundry"){headline=r.item;extra=r.quantity+" unit / "+r.source;}
  const idx=phases.indexOf(r.status),next=phases[idx+1];
  let target=name==="cssd"||name==="laundry"?headline:patientFor(d,r.encounterId)+" · "+r.encounterId;
  return ['<strong class="mono">'+e(r.id)+'</strong><div class="cell-sub">'+e(extra)+'</div>',e(target),e(headline),status(labels[r.status]||r.status),next?B("sp-next",labels[next]||next,r.id):status("Selesai")];
 });
 const done=records.filter(x=>x.status===phases.at(-1)).length;
 const stat='<div class="grid cols4" style="margin-bottom:16px">'+M("Total Worklist",records.length,def.table)+M("Belum Selesai",records.length-done,"Tahap proses")+M("Selesai",done,phases.at(-1))+M("Tahapan Workflow",phases.length,"Transisi demo")+'</div>';
 const relations=P("Tabel & Data Lineage","Nama tabel sesuai blueprint database SIMRS.",'<div class="special-relations">'+def.relations.map(s=>'<p><code>'+e(s)+'</code></p>').join("")+'</div>'+notes);
 let details=records.map(r=>'<div class="special-record"><div><strong>'+e(r.id)+'</strong><p class="muted-small">'+e(name==="radiology"?"StudyInstanceUID: "+r.studyUid:name==="surgery"?"Set instrumen: "+r.cssdId:name==="nutrition"?"Produksi: "+(r.kitchenBatch||"belum ada"):"Riwayat proses: "+(r.history||[]).join(" → "))+'</p><p class="muted-small">'+e(r.report||r.notes||"")+'</p></div>'+((name==="surgery")?B("sp-anesthesia","Catatan Anestesi",r.id,"small soft"):"")+(r.encounterId?B("sp-trace","Data Lineage",r.encounterId,"small soft"):"")+'</div>').join("");
 return H(def.eyebrow,def.title,def.description,B("sp-create",def.create,name,"primary"))+
 stat+P("Daftar Proses & Worklist","Klik tahap untuk memperbarui state dan record sintetis.",T(def.cols,rows))+
 '<div class="grid cols2" style="margin-top:16px">'+P("Record & Detail", "Referensi antarmodul berdasarkan ID sintetis.",details)+relations+'</div>';
}
function renderHr(c){
 const d=c.data;
 const rows=d.staff.map(s=>[e(s.id),e(s.name),e(s.role),e(s.unit),s.practitionerId?status(s.practitionerId):"Non-clinical",B("sp-shift","Tambah Shift",s.id,"small soft")]);
 const shift=d.shifts.map(x=>[e(x.id),e(d.staff.find(s=>s.id===x.employeeId)?.name),e(x.date),e(x.start+"–"+x.finish),d.attendanceDemo.some(a=>a.shiftId===x.id)?status("present"):B("sp-attendance","Catat Presensi",x.id)]);
 return H("ENTERPRISE · WORKFORCE","HRIS, Shift & Kehadiran","Employee, practitioner mapping, shift assignment dan kehadiran simulasi. Tidak ada payroll maupun data pegawai riil.",B("sp-employee","＋ Pegawai","","primary"))+
 '<div class="grid cols4" style="margin-bottom:16px">'+M("Pegawai",d.staff.length,"hr.employees")+M("Shift",d.shifts.length,"hr.shift_assignments")+M("Presensi",d.attendanceDemo.length,"hr.attendance")+M("Linked Practitioner",d.staff.filter(s=>s.practitionerId).length,"master.practitioners")+'</div>'+
 P("Master Pegawai","Pemetaan pegawai ke tenaga medis hanya jika relevan.",T(["ID","Nama","Peran","Unit","Practitioner","Aksi"],rows))+
 '<div class="grid cols2" style="margin-top:16px">'+P("Jadwal Kerja & Kehadiran","Presensi ditautkan ke shift_id dan employee_id.",T(["Shift","Pegawai","Tanggal","Jam","Aksi"],shift))+
 P("Relasi HRIS → Clinical","Batas antara pegawai dan peran praktisi klinis.",'<div class="special-relations"><p><code>hr.employees → hr.shift_assignments</code></p><p><code>hr.shift_assignments → hr.attendance</code></p><p><code>hr.employees ↔ master.practitioners</code></p></div>'+notes)+'</div>';
}
function renderReports(c){
 const d=c.data,types=["all","Rawat Jalan","IGD","Rawat Inap"],f=c.ui.specialReportFilter||"all",es=d.encounters.filter(x=>f==="all"||x.type===f);
 const o=d.orders.filter(x=>es.some(e=>e.id===x.encounterId)),ch=d.charges.filter(x=>es.some(e=>e.id===x.encounterId));
 const withDx=es.filter(x=>d.diagnoses.some(dx=>dx.encounterId===x.id)),percent=es.length?Math.round(withDx.length/es.length*100):0;
 let filter='<div class="filter-row" style="margin-bottom:16px">'+types.map(x=>'<button class="db-domain '+(x===f?"active":"")+'" data-action="sp-filter" data-id="'+e(x)+'">'+e(x==="all"?"Semua layanan":x)+'</button>').join("")+'</div>';
 let grouped=types.slice(1).map(type=>{let list=es.filter(x=>x.type===type);return[e(type),String(list.length),String(list.filter(x=>withDx.includes(x)).length),status("Simulasi")]});
 let specialties=[["LIS",d.labs.length,"laboratory.lab_orders"],["RIS",d.radStudies.length,"radiology.rad_orders"],["Operasi",d.surgeryCases.length,"operations.surgery_schedules"],["Gizi",d.diets.length,"nutrition.diet_orders"],["CSSD",d.cssdCycles.length,"operations.cssd_cycles"],["Laundry",d.laundryCycles.length,"operations.laundry_cycles"],["HR",d.shifts.length,"hr.shift_assignments"]];
 return H("ENTERPRISE · DATA ANALYTICS","Pelaporan & Indikator Mutu","Ringkasan dihitung dari record lokal. RL/SIRS ditampilkan sebagai contoh analitik, bukan laporan resmi atau format regulasi.",B("sp-quality","Cek Konsistensi Demo","","primary"))+
 filter+'<div class="grid cols4" style="margin-bottom:16px">'+M("Encounter",es.length,"encounter.encounters")+M("Order Layanan",o.length,"orders.service_orders")+M("Charge","Rp "+ch.reduce((s,x)=>s+x.amount,0).toLocaleString("id-ID"),"billing.charges")+M("Diagnosis Recorded",percent+"%","clinical.diagnoses")+'</div>'+
 '<div class="grid cols2">'+P("Rekap Encounter · RL Preview","Belum memenuhi spesifikasi RL/SIRS resmi.",T(["Jenis","Encounter","Dengan Diagnosis","Status"],grouped))+
 P("Workload Penunjang","Relasi ke berbagai domain klinis dan nonklinis.",T(["Unit","Volume Demo","Tabel"],specialties.map(x=>[e(x[0]),String(x[1]),'<code>'+e(x[2])+'</code>'])))+'</div>'+
 P("Kualitas Data Klinis","Proporsi encounter dengan diagnosis pada data sintetis.",'<div class="special-quality"><strong>'+percent+'%</strong><div class="progress-track"><div class="progress-bar" style="width:'+percent+'%"></div></div><p class="muted-small">'+withDx.length+' dari '+es.length+' encounter memiliki diagnosis.</p></div>'+notes);
}
function render(page,c){
 if(config[page])return renderWorkflow(page,c);
 if(page==="hr")return renderHr(c);
 if(page==="reports")return renderReports(c);
 return null;
}
function getModal(c,title,contents,kind){c.modal(title,'<div class="form-grid">'+contents+'</div>',kind);}
function nextStep(name,id,c){
 const d=c.data,def=config[name],r=d[def.array].find(x=>x.id===id);if(!r)return true;
 const stepset=steps[name],i=stepset.indexOf(r.status),next=stepset[i+1];if(!next)return true;
 if(name==="surgery"&&next==="operating"){
  let cssd=d.cssdCycles.find(x=>x.id===r.cssdId);
  if(!cssd||!["sterile","distributed"].includes(cssd.status)){c.notice("Set instrumen CSSD belum steril. Selesaikan proses CSSD terlebih dahulu.");return true;}
 }
 if(name==="radiology"&&next==="reported"){
  getModal(c,"Input Ekspertise Radiologi",'<input type="hidden" name="recordId" value="'+e(id)+'">'+input("report","Temuan / Kesan","Tidak tampak kelainan akut."),"sp-report");return true;
 }
 r.status=next;
 if(name==="cssd"||name==="laundry")r.history.push(next);
 if(name==="nutrition"&&next==="prepared")r.kitchenBatch="KIT-"+r.id;
 if(name==="radiology"&&next==="released"){
   if(!d.charges.some(x=>x.source==="RAD · "+r.id)){
    d.charges.push({id:"CH-RAD-"+r.id,encounterId:r.encounterId,source:"RAD · "+r.id,amount:195000});c.ensureInvoice(r.encounterId);
   }
   let sourceOrder=d.orders.find(x=>x.id===r.orderId);if(sourceOrder)sourceOrder.status="completed";
   c.pushEvent("DiagnosticReport",r.id,"radiology.report.released");
 }
 if(name==="surgery"&&next==="completed"&&!r.billed){
  d.charges.push({id:"CH-SUR-"+r.id,encounterId:r.encounterId,source:"SURGERY · "+r.id,amount:1150000});c.ensureInvoice(r.encounterId);r.billed=true;
  c.pushEvent("Procedure",r.id,"surgery.completed");
 }
 c.pushActivity("Tahap "+name+": "+next,r.id);c.save();c.render();c.notice("Tahap berubah menjadi "+next);
 return true;
}
function linkedModule(m){
 const t=m.toLowerCase();
 if(/radiologi|pacs|dicom/.test(t))return"radiology";
 if(/operasi|anestesi|bedah/.test(t))return"surgery";
 if(/gizi|nutrition|produksi.*makanan/.test(t))return"nutrition";
 if(/cssd|sterilisasi/.test(t))return"cssd";
 if(/laundry|linen/.test(t))return"laundry";
 if(/hris|payroll|attendance|rekrutmen|talent|sdm/.test(t))return"hr";
 if(/rl|report|indikator mutu|multi-hospital|mutu|hai|risk|patient safety/.test(t))return"reports";
 return null;
}
function actionClick(a,id,node,c){
 const d=c.data;
 if(a==="module-open"){let destination=linkedModule(node.dataset.module||"");if(destination){c.navigate(destination);return true;}}
 if(a==="sp-filter"){c.ui.specialReportFilter=id;c.render();return true;}
 if(a==="sp-trace"){c.ui.selectedEncounter=id;c.navigate("journey");return true;}
 if(a==="sp-create"){
  const page=id,def=config[page];if(!def)return false;
  let body="";
  if(page==="radiology")body=encOptions(d)+pick("modality","Modalitas",[["CR","CR"],["CT","CT"],["US","USG"]],"CR")+input("exam","Nama pemeriksaan","Foto Thorax");
  if(page==="surgery")body=encOptions(d)+input("procedure","Tindakan","Debridement luka")+pick("cssdId","Set CSSD",d.cssdCycles.map(x=>[x.id,x.set+" · "+x.status]),d.cssdCycles[0]?.id)+pick("room","Kamar Operasi",[["OK-01","OK-01"],["OK-02","OK-02"]],"OK-01");
  if(page==="nutrition")body=encOptions(d)+pick("diet","Diet",[["Diet DM 1700 kkal","Diet DM 1700 kkal"],["Diet Rendah Garam","Diet Rendah Garam"],["Diet Lunak","Diet Lunak"]],"Diet DM 1700 kkal")+pick("meal","Sesi",[["Pagi","Pagi"],["Siang","Siang"],["Malam","Malam"]],"Siang");
  if(page==="cssd")body=input("set","Nama set instrumen","General Surgery Set")+input("count","Jumlah instrumen","12",'type="number" min="1"');
  if(page==="laundry")body=input("item","Jenis Linen","Linen kamar operasi")+input("count","Jumlah Linen","20",'type="number" min="1"')+input("unit","Unit asal","OK-01");
  getModal(c,"Tambah "+def.title,body,'sp-create-'+page);return true;
 }
 if(a==="sp-next"){for(let name of Object.keys(config))if(d[config[name].array].some(x=>x.id===id))return nextStep(name,id,c);return true;}
 if(a==="sp-anesthesia"){
  const r=d.surgeryCases.find(x=>x.id===id);if(!r)return true;
  getModal(c,"Catatan Anestesi & PACU",'<input name="recordId" type="hidden" value="'+e(id)+'">'+input("notes","Catatan",r.notes||"Monitoring hemodinamik stabil"),"sp-anesthesia");return true;
 }
 if(a==="sp-employee"){getModal(c,"Tambah Pegawai Demo",input("name","Nama","Personel Baru (Demo)")+pick("role","Peran",[["Perawat","Perawat"],["ATLM","ATLM"],["Petugas CSSD","Petugas CSSD"],["Dokter","Dokter"]],"Perawat")+input("unit","Unit kerja","Rawat Inap"),"sp-new-employee");return true;}
 if(a==="sp-shift"){getModal(c,"Penugasan Shift",'<input name="employeeId" type="hidden" value="'+e(id)+'">'+input("date","Tanggal","2026-10-30",'type="date"')+input("start","Mulai","08:00",'type="time"')+input("finish","Selesai","16:00",'type="time"'),"sp-new-shift");return true;}
 if(a==="sp-attendance"){
  let shift=d.shifts.find(s=>s.id===id);if(!shift)return true;
  if(d.attendanceDemo.some(x=>x.shiftId===id)){c.notice("Kehadiran sudah dicatat.");return true;}
  d.attendanceDemo.push({id:"ATT-"+(d.attendanceDemo.length+1),shiftId:id,employeeId:shift.employeeId,status:"present"});
  c.pushActivity("Presensi shift",id);c.save();c.render();return true;
 }
 if(a==="sp-quality"){
  let badEncounter=d.encounters.filter(x=>!d.patients.some(p=>p.id===x.patientId)).length;
  let badOrder=d.orders.filter(x=>!d.encounters.some(e=>e.id===x.encounterId)).length;
  let badStock=d.stock.filter(x=>x.qty<0).length;
  c.notice("Integrity check demo: "+badEncounter+" orphan encounter, "+badOrder+" orphan order, "+badStock+" saldo negatif.");return true;
 }
 return false;
}
function submit(kind,f,c){
 const d=c.data;let record;
 if(kind.startsWith("sp-create-")){
  let page=kind.slice(10),def=config[page];if(!def)return false;
  let arr=d[def.array],id={radiology:"RAD",surgery:"SUR",nutrition:"DIET",cssd:"CSSD",laundry:"LINEN"}[page]+"-"+String(arr.length+1).padStart(3,"0");
  record=JSON.parse(JSON.stringify(def.seed));record.id=id;record.status=steps[page][0];
  if(page==="radiology"){
   let encounterId=String(f.get("encounterId"));if(!d.encounters.some(x=>x.id===encounterId))return true;
   let orderId="SO-RAD-"+String(arr.length+1);
   d.orders.push({id:orderId,encounterId,type:"Radiologi",service:String(f.get("exam")),priority:"routine",status:"requested"});
   Object.assign(record,{encounterId,orderId,modality:String(f.get("modality")),exam:String(f.get("exam")),report:"",studyUid:"2.25."+(8100000000+arr.length)});
   c.pushEvent("ServiceRequest",orderId,"radiology.order.created");
  }
  if(page==="surgery")Object.assign(record,{encounterId:String(f.get("encounterId")),procedure:String(f.get("procedure")),cssdId:String(f.get("cssdId")),room:String(f.get("room")),notes:"",billed:false});
  if(page==="nutrition"){Object.assign(record,{encounterId:String(f.get("encounterId")),diet:String(f.get("diet")),meal:String(f.get("meal")),kitchenBatch:""});c.pushEvent("NutritionOrder",id,"nutrition.order.created");}
  if(page==="cssd"){let n=Number(f.get("count"));if(!Number.isInteger(n)||n<=0){c.notice("Jumlah instrumen tidak valid.");return true;}Object.assign(record,{set:String(f.get("set")),instrumentCount:n,history:["dirty"]});}
  if(page==="laundry"){let n=Number(f.get("count"));if(!Number.isInteger(n)||n<=0){c.notice("Jumlah linen tidak valid.");return true;}Object.assign(record,{item:String(f.get("item")),quantity:n,source:String(f.get("unit")),history:["received"]});}
  arr.push(record);
 }else if(kind==="sp-report"){
  record=d.radStudies.find(x=>x.id===f.get("recordId"));if(!record||record.status!=="acquired")return true;
  let report=String(f.get("report")||"").trim();if(!report)return true;record.report=report;record.status="reported";
 }else if(kind==="sp-anesthesia"){
  record=d.surgeryCases.find(x=>x.id===f.get("recordId"));if(!record)return true;record.notes=String(f.get("notes"));
 }else if(kind==="sp-new-employee"){
  record={id:"EMP-"+String(d.staff.length+1).padStart(3,"0"),name:String(f.get("name")),role:String(f.get("role")),unit:String(f.get("unit")),practitionerId:""};d.staff.push(record);
 }else if(kind==="sp-new-shift"){
  if(String(f.get("start"))>=String(f.get("finish"))){c.notice("Jam selesai harus lebih besar daripada mulai.");return true;}
  record={id:"SHIFT-"+String(d.shifts.length+1).padStart(3,"0"),employeeId:String(f.get("employeeId")),date:String(f.get("date")),start:String(f.get("start")),finish:String(f.get("finish"))};d.shifts.push(record);
 }else return false;
 c.pushActivity("Simulasi: "+kind,record?.id||"");c.save();c.closeModal();c.render();c.notice("Record demo diperbarui.");
 return true;
}
function lineage(encounterId,d){
 const out=[];
 d.radStudies.filter(x=>x.encounterId===encounterId).forEach(x=>out.push(["radiology.rad_orders",x.id,x.exam+" · "+x.status]));
 d.surgeryCases.filter(x=>x.encounterId===encounterId).forEach(x=>out.push(["operations.surgery_schedules",x.id,x.procedure+" · "+x.status]));
 d.diets.filter(x=>x.encounterId===encounterId).forEach(x=>out.push(["nutrition.diet_orders",x.id,x.diet+" · "+x.status]));
 return out;
}
function samples(t,d){
 return ({"radiology.rad_orders":d.radStudies,"radiology.rad_exams":d.radStudies,"radiology.rad_reports":d.radStudies,
 "operations.surgery_schedules":d.surgeryCases,"operations.surgery_events":d.surgeryCases,"operations.anesthesia_records":d.surgeryCases,
 "nutrition.diet_orders":d.diets,"nutrition.production_batches":d.diets.filter(x=>x.kitchenBatch),
 "operations.cssd_cycles":d.cssdCycles,"operations.cssd_sets":d.cssdCycles,
 "operations.laundry_cycles":d.laundryCycles,"operations.linen_batches":d.laundryCycles,
 "hr.employees":d.staff,"hr.shift_assignments":d.shifts,"hr.attendance":d.attendanceDemo})[t]||[];
}
function fhirPayload(id,d){
 let rad=d.radStudies.find(x=>x.id===id);
 if(rad)return {resourceType:"ImagingStudy",id:rad.id,status:rad.status==="released"?"available":"registered",subject:{reference:"Patient/"+d.encounters.find(x=>x.id===rad.encounterId)?.patientId},encounter:{reference:"Encounter/"+rad.encounterId},identifier:[{system:"urn:dicom:uid",value:"urn:oid:"+rad.studyUid}],description:rad.exam};
 let diet=d.diets.find(x=>x.id===id);
 if(diet)return {resourceType:"NutritionOrder",id:diet.id,status:diet.status==="delivered"?"completed":"active",intent:"order",patient:{reference:"Patient/"+d.encounters.find(x=>x.id===diet.encounterId)?.patientId},encounter:{reference:"Encounter/"+diet.encounterId},oralDiet:{type:[{text:diet.diet}]}};
 return null;
}
const fhirOptions=d=>d.radStudies.map(x=>({id:x.id,txt:"ImagingStudy · "+x.id})).concat(d.diets.map(x=>({id:x.id,txt:"NutritionOrder · "+x.id})));
window.SIMRS_SPECIAL={init,render,action:actionClick,submit,lineage,samples,fhirPayload,fhirOptions,linkedModule};
})();