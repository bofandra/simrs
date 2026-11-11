/* SIMRS Baru V16 — Clinical benchmark subforms. STATIC DEMO ONLY.
 * Source: Matriks_Field_Form_SIMRS_SATUSEHAT_FHIR_R4.xlsx.PDF (pages 1–5).
 * Source resources are candidates, not validated SATUSEHAT profiles.
 * Do not activate signing, restraint execution, medication administration,
 * stock mutations, patient transfers, financial posting or FHIR delivery.
 */
(function(){
"use strict";
var KEY="simrs-benchmark-clinical-v16-drafts";
var defs=[
{id:"CF-01",title:"Triase terstruktur ABCDE",modules:["RME-02"],roles:["Dokter IGD"],fhir:"Encounter; Observation; QuestionnaireResponse",groups:[
["Konteks triase",["triage_at|Waktu triase|datetime-local|1","arrive_mode|Cara datang|text","referral_source|Sumber rujukan|text","chief_complaint|Keluhan utama|textarea|1","triage_category|Kategori triase|text|1","urgency|Tingkat kegawatan|text","triage_staff|Petugas triase|text|1"]],
["Asesmen ABCDE",["airway|Airway|textarea|1","breathing|Breathing|textarea|1","circulation|Circulation|textarea|1","gcs|Disability / GCS|number","exposure|Exposure|textarea","pain_score|Skala nyeri (0–10)|number","allergy_note|Alergi teridentifikasi|text"]],
["TTV dan keputusan",["blood_pressure|Tekanan darah|text","heart_rate|Nadi|number","respiratory_rate|RR|number","temperature|Suhu|number","spo2|SpO₂|number","fall_risk|Risiko jatuh|text","triage_decision|Keputusan triase|textarea|1","destination|Area pelayanan|text","note|Catatan|textarea"]]]},
{id:"CF-02",title:"Asesmen keperawatan berjenjang",modules:["RME-07"],roles:["Perawat"],fhir:"Observation; QuestionnaireResponse; Condition; ClinicalImpression",groups:[
["Jenis dan identitas asesmen",["assessment_type|Jenis asesmen|select:cepat,awal,lanjutan,ulang|1","assessed_at|Waktu asesmen|datetime-local|1","nurse|Perawat|text|1","source|Sumber anamnesis|text","complaint|Keluhan utama|textarea"]],
["Fisik dan risiko",["medical_history|Riwayat kesehatan / keluarga|textarea","medication_history|Riwayat obat|textarea","consciousness|Kesadaran|text","vitals|Tanda vital|textarea","pain|Skala nyeri|number","abc_state|Airway / breathing / circulation|textarea","allergy|Alergi|text","fall_risk|Risiko jatuh|text","pressure_risk|Risiko dekubitus|text"]],
["Status dan rencana",["psychosocial|Psikososial|textarea","function|Status fungsional|text","nutrition|Nutrisi|text","elimination|Eliminasi|text","sleep|Tidur|text","skin|Kulit dan pemeriksaan fisik|textarea","problem|Masalah keperawatan|textarea|1","action|Tindakan segera / intervensi|textarea","response|Respons / evaluasi ulang|textarea","revision|Revisi rencana|textarea"]]]},
{id:"CF-03",title:"NCP dan implementasi keperawatan",modules:["RME-07"],roles:["Perawat"],fhir:"CarePlan; Goal; Condition; Procedure",groups:[
["Diagnosis dan bukti",["recorded_at|Tanggal/waktu|datetime-local|1","nurse|Perawat|text|1","nursing_diagnosis|Diagnosis/masalah keperawatan|textarea|1","subjective|Data subjektif|textarea","objective|Data objektif|textarea","etiology|Etiologi dan tanda/gejala|textarea"]],
["Tujuan dan intervensi",["goal|Tujuan/hasil diharapkan|textarea|1","indicator|Indikator hasil|textarea","intervention|Intervensi|textarea|1","frequency|Frekuensi|text","target_time|Target waktu|datetime-local","executor|Petugas pelaksana|text"]],
["Pelaksanaan dan evaluasi",["action|Tindakan dilakukan|textarea","parameters|Parameter|text","execution_state|Status pelaksanaan|select:direncanakan,terlaksana,tidak terlaksana|1","reason|Alasan tidak terlaksana|textarea","patient_response|Respons pasien|textarea","evaluation|Evaluasi|textarea","revision|Revisi rencana|textarea"]]]},
{id:"CF-04",title:"Alergi dan risiko klinis terstruktur",modules:["RME-05","RME-06"],roles:["Perawat","Dokter RJ","DPJP Rawat Inap"],fhir:"AllergyIntolerance; Condition; RiskAssessment",groups:[
["Identifikasi",["recorded_at|Tanggal pencatatan|datetime-local|1","recorder|Pencatat|text|1","record_kind|Jenis: alergi / diagnosis khusus / risiko|select:alergi,diagnosis khusus,risiko|1","substance|Zat, alergen atau diagnosis|text|1","terminology_code|Kode terminologi|text"]],
["Temuan dan verifikasi",["reaction|Manifestasi / reaksi|textarea","severity|Keparahan|text","clinical_status|Status klinis|text","verification|Status verifikasi|text","onset|Onset|text","last_date|Tanggal terakhir|date","source|Sumber informasi|text"]],
["Penilaian dan tindak lanjut",["risk_factors|Faktor risiko / nilai tiap faktor|textarea","risk_category|Kategori risiko|text","followup|Tindak lanjut|textarea","notes|Catatan|textarea"]]]},
{id:"CF-05",title:"Restrain: justifikasi sampai pelepasan",modules:["RME-02","RME-03"],roles:["Dokter IGD","DPJP Rawat Inap"],fhir:"Procedure; Observation; Consent",groups:[
["Instruksi dan indikasi",["started_at|Waktu mulai|datetime-local|1","indication|Indikasi|textarea|1","restraint_type|Jenis restrain|text|1","site|Lokasi|text","ordering_doctor|Dokter pemberi instruksi|text|1","installer|Petugas pemasang|text"]],
["Justifikasi",["pre_assessment|Asesmen sebelum pemasangan|textarea","alternatives|Alternatif yang dicoba|textarea|1","consent_reason|Persetujuan / justifikasi|textarea|1","monitoring_plan|Rencana pemantauan|textarea"]],
["Pemantauan dan penghentian",["monitoring|Pemantauan berkala|textarea","skin_circulation|Kondisi kulit / sirkulasi|textarea","evaluation|Evaluasi|textarea","ended_at|Waktu pelepasan|datetime-local","end_reason|Alasan pelepasan|textarea","notes|Catatan|textarea"]]]},
{id:"CF-06",title:"Skrining PRMRJ (instrumen belum disahkan)",modules:["RME-05"],roles:["Perawat","Dokter RJ"],fhir:"QuestionnaireResponse; Observation; RiskAssessment",gated:true,groups:[
["Identifikasi instrumen",["screened_at|Tanggal skrining|datetime-local","screened_by|Petugas|text","instrument|Nama/versi instrumen PRMRJ — TBD|text"]],
["Faktor dan tindak lanjut",["factors|Faktor risiko — menunggu standar|textarea","scores|Nilai tiap faktor — TBD|textarea","total|Skor total — TBD|number","risk_category|Kategori risiko — TBD|text","followup|Tindak lanjut|textarea"]]]},
{id:"CF-07",title:"Transfer dan keluar-masuk ICU",modules:["RME-03"],roles:["DPJP Rawat Inap","Dokter IGD"],fhir:"Encounter; Observation; Procedure",groups:[
["Identitas transfer",["admitted_at|Masuk ICU pada|datetime-local|1","discharged_at|Keluar ICU pada|datetime-local","origin|Unit asal|text|1","destination|Unit tujuan|text|1","indication|Indikasi ICU|textarea|1","diagnosis|Diagnosis|text"]],
["Kondisi dan handover",["admit_condition|Kondisi saat masuk|textarea","admit_vitals|Tanda vital saat masuk|textarea","dpjp|DPJP|text","discharge_reason|Alasan keluar|textarea","discharge_condition|Kondisi saat keluar|textarea","transfer_status|Status transfer|text","notes|Catatan|textarea"]]]},
{id:"CF-08",title:"Edukasi dan pemberian informasi pasien",modules:["RME-01","RME-07"],roles:["Dokter RJ","Perawat"],fhir:"Procedure; QuestionnaireResponse; Consent",groups:[
["Penerima dan topik",["recorded_at|Waktu edukasi/informasi|datetime-local|1","educator|Pemberi informasi|text|1","recipient|Penerima informasi|text|1","relationship|Hubungan dengan pasien|text","topic|Topik|text|1","content|Isi informasi/materi|textarea|1"]],
["Metode dan pemahaman",["method|Metode edukasi|text","language|Bahasa|text","special_need|Kebutuhan khusus|text","response|Respons pasien|textarea","teach_back|Evaluasi pemahaman / teach-back|textarea","questions|Pertanyaan|textarea"]],
["Keputusan dan tindak lanjut",["decision|Keputusan/persetujuan/penolakan|text","witness|Saksi|text","next_education|Edukasi lanjutan|textarea","notes|Catatan|textarea"]]]},
{id:"CF-09",title:"Hasil penunjang dari fasilitas luar",modules:["RME-10"],roles:["Dokter RJ","DPJP Rawat Inap"],fhir:"ServiceRequest; DiagnosticReport; Observation; DocumentReference",groups:[
["Sumber dan permintaan",["requested_at|Tanggal permintaan|datetime-local|1","ordering_doctor|Dokter peminta|text|1","outside_provider|Fasilitas/provider luar|text|1","exam_type|Jenis penunjang|text|1","indication|Indikasi|textarea","exam_name|Pemeriksaan|text"]],
["Hasil dan lampiran",["performed_at|Tanggal pelaksanaan|datetime-local","results|Hasil|textarea","unit|Satuan|text","reference_range|Nilai rujukan|text","interpretation|Interpretasi|textarea","attachment_ref|Referensi lampiran (demo, bukan upload)|text","verification_state|Status verifikasi sumber|select:belum diverifikasi,perlu review,diverifikasi demo|1","notes|Catatan|textarea"]]]},
{id:"CF-10",title:"Rencana pemberian obat rawat inap",modules:["MED-04","RME-03"],roles:["Dokter RJ","Dokter IGD","DPJP Rawat Inap"],fhir:"MedicationRequest; Medication; MedicationStatement",groups:[
["Obat dan instruksi",["ordered_at|Tanggal/waktu|datetime-local|1","prescriber|Dokter peminta|text|1","medication|Nama/kode obat|text|1","form_strength|Bentuk/kekuatan|text","dose|Dosis|text|1","route|Rute|text","frequency|Frekuensi|text","duration|Durasi|text","quantity|Jumlah|number"]],
["Jadwal dan keselamatan",["start_at|Mulai|datetime-local","end_at|Berakhir|datetime-local","indication|Indikasi|textarea","instructions|Instruksi|textarea","allergy_alert|Review alergi/alert (catatan)|text","status|Status rencana|text","notes|Catatan|textarea"]]]},
{id:"CF-11",title:"Rencana perawatan dan instruksi lintas profesi",modules:["RME-09"],roles:["Dokter RJ","DPJP Rawat Inap"],fhir:"CarePlan; Goal; Condition; ServiceRequest",groups:[
["Tujuan klinis",["plan_at|Waktu perencanaan|datetime-local|1","team|Tim/profesi|text|1","problem|Masalah/diagnosis|textarea|1","goal|Tujuan/target|textarea|1","indicator|Indikator evaluasi|textarea"]],
["Intervensi dan keputusan",["interventions|Intervensi tiap profesi|textarea|1","responsible|Penanggung jawab|text","schedule|Jadwal|text","doctor_instruction|Instruksi dokter|textarea","nurse_instruction|Instruksi perawat|textarea","conference|Hasil konferensi tim|textarea"]],
["Evaluasi",["execution_state|Status pelaksanaan|text","result|Hasil evaluasi|textarea","revision|Revisi|textarea","notes|Catatan|textarea"]]]},
{id:"CF-12",title:"Pemakaian BMHP per tindakan",modules:["RME-06"],roles:["Dokter RJ","DPJP Rawat Inap"],fhir:"Procedure; SupplyRequest (kandidat)",groups:[
["Konteks tindakan",["used_at|Tanggal/waktu|datetime-local|1","procedure_ref|Tindakan/indikasi terkait|text|1","item|Item BMHP / kode|text|1","lot|Batch/lot|text"]],
["Pencatatan penggunaan",["qty|Jumlah|number|1","unit|Satuan|text|1","user_unit|Unit pemakai|text","staff|Petugas|text|1","status|Status pemakaian|text","notes|Catatan|textarea"]]]},
{id:"CF-13",title:"Partograf persalinan — konfigurasi bersyarat",modules:["RME-03"],roles:["DPJP Rawat Inap"],fhir:"Observation; QuestionnaireResponse; CarePlan; Procedure",gated:true,groups:[
["Informasi obstetri",["observed_at|Tanggal/waktu|datetime-local","gravida_para|Gravida/para|text","gestational_age|Usia kehamilan|text","phase|Fase persalinan|text"]],
["Perkembangan dan kondisi",["fhr|DJJ|number","contraction|Kontraksi|text","dilation|Pembukaan|number","head_descent|Penurunan kepala|text","membrane|Ketuban/warna cairan|text","maternal_vitals|TD/nadi/suhu|textarea","urine|Urine|text","medication_fluids|Obat/cairan|textarea","interventions|Tindakan dan kondisi ibu/janin|textarea","clinician|Petugas|text"]]]}
];
var live={id:"",group:0,mode:"form",errors:[],historyIndex:-1};
var edits=Object.create(null),badInputs=Object.create(null),historyItems=[];
var raw={};try{raw=readDrafts();}catch(e){}
function readDrafts(){
 var value=localStorage.getItem(KEY),stored;
 try{stored=JSON.parse(value||"{}");}catch(e){return {};}
 return stored&&typeof stored==="object"&&!Array.isArray(stored)?stored:{};
}
function clone(value){return JSON.parse(JSON.stringify(value));}
function esc(x){return String(x==null?"":x).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function account(){return window.SIMRSRoleDemo&&window.SIMRSRoleDemo.getAccount&&window.SIMRSRoleDemo.getAccount();}
function context(){
 var acc=account(),engine=window.SIMRSFormEngine,form=document.getElementById("p0-editor");
 if(!acc||!engine||!engine.getWorkItemContext||!form||!document.body.classList.contains("demo-authenticated")||document.body.classList.contains("demo-reviewer"))return null;
 var selected=engine.getWorkItemContext(),patient=selected&&selected.patient;
 if(!selected||selected.role!==acc.role||!patient||!patient.id||!patient.visit||
   selected.module!==form.getAttribute("data-form-module")||!selected.workItem||selected.workItem.id!==form.getAttribute("data-work-item"))return null;
 return {role:acc.role,module:selected.module,patientId:patient.id,encounterId:patient.visit,patientName:patient.name,workItem:selected.workItem.id};
}
function available(ctx){return defs.filter(function(f){return f.modules.includes(ctx.module)&&f.roles.includes(ctx.role);});}
function recordKey(ctx,id){return [ctx.role,ctx.patientId,ctx.encounterId,ctx.workItem,ctx.module,id].join("|");}
/* Input guards for the demo, not normal ranges, triage scores or clinical alerts.
 * Vitals reuse the existing RME-02/RME-05 catalog constraints. */
function numericRule(key){
 var fixed={pain_score:{min:0,max:10,step:1},pain:{min:0,max:10,step:1},gcs:{min:3,max:15,step:1},spo2:{min:0,max:100,step:1},quantity:{min:1,step:1},qty:{positive:true,step:"any"}};
 if(fixed[key])return fixed[key];
 var module={heart_rate:"RME-05",temperature:"RME-05",respiratory_rate:"RME-02"}[key];
 var spec=(window.SIMRS_FORM_CATALOG||[]).find(function(m){return m.code===module;});
 var field=spec&&(spec.fields||[]).find(function(f){return f.key===key;});
 return field?{min:field.min,max:field.max,step:field.step||1}:{positive:true,step:"any"};
}
function fields(group){return group[1].map(function(s){var a=s.split("|");var x={key:a[0],label:a[1],type:a[2]||"text",required:a[3]==="1"};if(x.type.startsWith("select:")){x.options=x.type.slice(7).split(",");x.type="select";}if(x.type==="number")x.rule=numericRule(x.key);return x;});}
function validate(id,values,review){
 var d=defs.find(function(f){return f.id===id;}),errors=[];
 if(!d||d.gated)return [{key:"",group:0,message:"Form ini belum diaktifkan."}];
 d.groups.forEach(function(group,index){fields(group).forEach(function(f){
  var value=String(values[f.key]==null?"":values[f.key]).trim(),message="";
  if(!value){if(review&&f.required)message=f.label+" wajib diisi.";}
  else if(f.type==="number"){
   var n=Number(value),rule=f.rule;
   if(!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(value)||!Number.isFinite(n))message=f.label+" harus berupa angka yang valid.";
   else if(rule.positive&&n<=0)message=f.label+" harus lebih dari 0.";
   else if((rule.min!==undefined&&n<rule.min)||(rule.max!==undefined&&n>rule.max))message=f.label+" harus "+(rule.min!==undefined&&rule.max!==undefined?"antara "+rule.min+"–"+rule.max:rule.min!==undefined?"minimal "+rule.min:"maksimal "+rule.max)+".";
   else if(rule.step===1&&!Number.isInteger(n))message=f.label+" harus berupa bilangan bulat.";
   else if(typeof rule.step==="number"&&Math.abs(n/rule.step-Math.round(n/rule.step))>0.0000001)message=f.label+" harus menggunakan kelipatan "+rule.step+".";
  }else if(f.type==="select"&&!f.options.includes(value))message=f.label+" harus dipilih dari pilihan yang tersedia.";
  else if((f.type==="date"||f.type==="datetime-local")&&!Number.isFinite(Date.parse(value)))message=f.label+" harus berupa tanggal/waktu yang valid.";
  if(message)errors.push({key:f.key,group:index,message:message});
 });});
 var pairs={"CF-05":["started_at","ended_at"],"CF-07":["admitted_at","discharged_at"],"CF-10":["start_at","end_at"]},pair=pairs[id];
 if(pair&&values[pair[0]]&&values[pair[1]]&&Date.parse(values[pair[1]])<Date.parse(values[pair[0]])){
  d.groups.forEach(function(group,index){var end=fields(group).find(function(f){return f.key===pair[1];});if(end)errors.push({key:end.key,group:index,message:end.label+" tidak boleh sebelum waktu mulai/masuk."});});
 }
 return errors;
}
function note(ctx){return "Contoh pasien "+ctx.patientName+" · encounter "+ctx.encounterId+" · pekerjaan "+ctx.workItem;}
function header(ctx,items){return '<header class="v16-h"><div><span>FORM KLINIS TAMBAHAN · MATRIKS BENCHMARK</span><h3>Aktivitas klinis terkait</h3><p>Hanya satu subform aktif. '+esc(note(ctx))+'.</p></div><span class="v16-count">'+items.length+' subform</span></header>';}
function info(d){return '<p class="v16-fhir">FHIR R4 kandidat: '+esc(d.fhir)+'. Pemetaan final mengikuti profil SATUSEHAT per use case.</p>';}
function choices(items){return '<div class="v16-choices" role="group" aria-label="Pilih subform klinis">'+items.map(function(x){return '<button type="button" class="v16-choice'+(live.id===x.id?' active':'')+'" data-v16-action="choose" data-id="'+esc(x.id)+'"><span>'+esc(x.id)+'</span><strong>'+esc(x.title)+'</strong>'+(x.gated?'<small>Menunggu instrumen/SOP</small>':'<small>Buka form kontekstual</small>')+'</button>';}).join("")+'</div>';}
function renderField(f,values){
 var v=values[f.key]==null?"":values[f.key];
 var error=live.errors.find(function(e){return e.key===f.key;}),id="v16-field-"+f.key;
 var s='<label class="v16-field"><span>'+esc(f.label)+(f.required?' <em>*</em>':'')+'</span>';
 var attrs=' id="'+esc(id)+'" data-v16-field="'+esc(f.key)+'"'+(f.required?' required':'')+(error?' aria-invalid="true" aria-describedby="'+esc(id)+'-error"':'');
 if(f.type==="textarea")s+='<textarea'+attrs+' rows="3" placeholder="'+esc(f.label)+'">'+esc(v)+'</textarea>';
 else if(f.type==="select")s+='<select'+attrs+'><option value="">— Pilih —</option>'+f.options.map(function(opt){return '<option value="'+esc(opt)+'"'+(opt===v?' selected':'')+'>'+esc(opt)+'</option>';}).join("")+'</select>';
 else s+='<input type="'+esc(f.type)+'"'+attrs+' value="'+esc(v)+'"'+(f.rule?' step="'+esc(f.rule.step)+'"'+(f.rule.min!==undefined?' min="'+esc(f.rule.min)+'"':'')+(f.rule.max!==undefined?' max="'+esc(f.rule.max)+'"':''):'')+' />';
 return s+(error?'<small class="v16-field-error" id="'+esc(id)+'-error">'+esc(error.message)+'</small>':'')+'</label>';
}
function working(ctx,d){var k=recordKey(ctx,d.id);if(!edits[k])edits[k]=clone(raw[k]&&raw[k].values||{});return edits[k];}
function sameValues(left,right){
 left=left||{};right=right||{};
 return Object.keys(Object.assign({},left,right)).every(function(key){return String(left[key]==null?"":left[key])===String(right[key]==null?"":right[key]);});
}
function collectInto(ctx){
 var d=available(ctx).find(function(x){return x.id===live.id;});if(!d||d.gated||live.mode!=="form")return;
 var k=recordKey(ctx,d.id),values=working(ctx,d),bad=badInputs[k]||(badInputs[k]=Object.create(null));
 document.querySelectorAll("#v16-active [data-v16-field]").forEach(function(el){
  var key=el.getAttribute("data-v16-field");values[key]=String(el.value||"");
  if(el.validity&&el.validity.badInput)bad[key]=true;
 });
 return values;
}
function versionsOf(record){
 if(Array.isArray(record.revisions)&&record.revisions.length)return record.revisions;
 return [{version:1,values:clone(record.values||{}),recordedAt:record.updatedAt||record.createdAt||"",author:record.role||"",legacy:true}];
}
function saveRevision(ctx,d,values){
 var next=readDrafts(),k=recordKey(ctx,d.id),old=next[k],at=new Date().toISOString(),revisions=old?clone(versionsOf(old)):[];
 if(!old||!sameValues(old.values,values))revisions.push({version:revisions.length+1,values:clone(values),recordedAt:at,author:ctx.role});
 next[k]={id:d.id,module:ctx.module,role:ctx.role,patientId:ctx.patientId,encounterId:ctx.encounterId,workItem:ctx.workItem,
  status:"Draft (demo)",schemaVersion:2,createdAt:old&&old.createdAt||at,updatedAt:revisions[revisions.length-1].recordedAt,values:clone(values),revisions:revisions};
 localStorage.setItem(KEY,JSON.stringify(next));
 raw=next;
}
function drawActive(ctx,d){
 var k=recordKey(ctx,d.id),r=raw[k];
 if(d.gated)return '<section class="v16-active v16-gated" id="v16-active"><h4>'+esc(d.title)+'</h4><p>Belum diaktifkan: instrumen/cut-off PRMRJ atau SOP, profesi dan konfigurasi partograf belum disahkan. Tidak ada input maupun perhitungan klinis otomatis.</p>'+info(d)+'</section>';
 var step=Math.min(live.group,d.groups.length-1),group=d.groups[step],parts=fields(group),values=working(ctx,d);
 var status=r?"Draft (demo) · versi "+versionsOf(r).length:"Belum ada draft";
 if(r&&!sameValues(values,r.values))status+=" · perubahan belum disimpan";
 return '<section class="v16-active" id="v16-active"><div class="v16-active-head"><div><span>'+esc(d.id)+' · '+esc(ctx.module)+'</span><h4>'+esc(d.title)+'</h4></div><span class="v16-state">'+esc(status)+'</span></div>'+
  '<div class="v16-tabs">'+d.groups.map(function(g,i){return '<button type="button" data-v16-action="step" data-step="'+i+'" class="'+(i===step?'active':'')+'">'+String(i+1)+'. '+esc(g[0])+'</button>';}).join("")+'</div>'+
  '<div class="v16-fields">'+parts.map(function(f){return renderField(f,values);}).join("")+'</div>'+
  '<div id="v16-feedback" role="status" aria-live="polite"></div>'+
  '<div class="v16-controls"><button type="button" data-v16-action="back"'+(step===0?' disabled':'')+'>Sebelumnya</button><span>Bagian '+(step+1)+' dari '+d.groups.length+'</span><button type="button" data-v16-action="next"'+(step===d.groups.length-1?' disabled':'')+'>Selanjutnya</button><button class="v16-save" type="button" data-v16-action="save">Simpan draft (demo)</button><button type="button" data-v16-action="review">Tinjau kelengkapan</button></div>'+info(d)+'<p class="v16-caution">Draft tersimpan hanya pada browser untuk data sintetis. Tidak ada tanda tangan, order aktif, tindakan, mutasi stok, atau pengiriman FHIR.</p></section>';
}
function history(ctx){
 try{raw=readDrafts();}catch(e){}
 var records=window.SIMRSFormEngine&&window.SIMRSFormEngine.getRecords&&window.SIMRSFormEngine.getRecords()||{};
 var items=[];
 Object.keys(records).forEach(function(code){(records[code]||[]).forEach(function(r){if(r.patient_id!==ctx.patientId)return;items.push({date:r.updated_at||r.created_at||"",type:code,encounter:r.encounter_id||"",status:r.status||"",source:"Form operasional",author:r.actor||(r.history||[]).slice(-1)[0]?.actor||"Tidak tercatat",version:r.version||"—"});});});
 Object.keys(raw).forEach(function(key){var r=raw[key];if(!r||r.patientId!==ctx.patientId)return;
  versionsOf(r).forEach(function(version){items.push({date:version.recordedAt,type:r.id,encounter:r.encounterId||"",status:r.status||"Draft (demo)",source:version.legacy?"Subform V16 lama · konteks belum diverifikasi":"Subform tambahan",author:version.author||r.role||"",version:version.version,values:version.values,assessment:version.values.assessment_type||"",workItem:r.workItem||"",module:r.module||"",patientId:r.patientId});});
 });
 items.sort(function(a,b){return String(b.date).localeCompare(String(a.date))||(Number(b.version)||0)-(Number(a.version)||0);});
 historyItems=items;
 var allowed=["Semua","Klinis","Keperawatan","Obat/BMHP","Penunjang","Prosedur"];
 var kind=function(code){if(/^CF-0[23]|^RME-0[57]/.test(code))return "Keperawatan";if(/^CF-10|^CF-12|^MED-0[45]/.test(code))return "Obat/BMHP";if(/^CF-09|^MED-0[123]/.test(code))return "Penunjang";if(/^CF-05|^CF-13|^MED-0[67]/.test(code))return "Prosedur";return "Klinis";};
 var rows=items.map(function(r,index){return '<tr data-history-kind="'+esc(kind(r.type))+'"><td>'+esc(r.date.slice(0,16).replace("T"," "))+'</td><td><strong>'+esc(r.type)+(r.assessment?' · '+esc(r.assessment):'')+'</strong><small>'+esc(r.source)+'</small></td><td>'+esc(r.encounter)+'</td><td>'+esc(r.status)+'</td><td>'+esc(r.author)+'</td><td>'+esc(r.version)+'</td><td>'+(r.values?'<button type="button" data-v16-action="view-version" data-index="'+index+'">Lihat versi '+esc(r.version)+'</button>':'—')+'</td></tr>';}).join("");
 return '<section class="v16-history"><h4>Riwayat Klinis Pasien · baca saja</h4><p>Hanya catatan sintetis pasien '+esc(ctx.patientName)+' dari form yang telah dibuat. Filter lintas kunjungan dalam tenant simulasi; produksi tetap membutuhkan otorisasi dan audit akses.</p><div class="v16-filter">'+allowed.map(function(x){return '<button type="button" data-v16-action="filter" data-filter="'+esc(x)+'">'+esc(x)+'</button>';}).join("")+'</div>'+
  '<div class="v16-scroll"><table><thead><tr><th>Waktu</th><th>Catatan</th><th>Encounter</th><th>Status</th><th>Profesi</th><th>Versi</th><th>Isi catatan</th></tr></thead><tbody>'+ (rows||'<tr><td colspan="7">Belum ada catatan sintetis tersimpan untuk pasien ini.</td></tr>')+'</tbody></table></div><p>Riwayat berisi versi yang berhasil disimpan. Perubahan yang belum disimpan tidak ditambahkan. Catatan V16 lama tetap pada encounter asalnya.</p></section>';
}
function viewVersion(ctx){
 var r=historyItems[live.historyIndex],d=r&&defs.find(function(f){return f.id===r.type;});
 if(!r||r.patientId!==ctx.patientId||!d)return '<p>Versi catatan tidak tersedia untuk pasien ini.</p>';
 return '<section class="v16-history v16-version"><h4>'+esc(d.title)+' · versi '+esc(r.version)+'</h4><p>Baca saja · '+esc(r.encounter)+' · '+esc(r.author)+' · '+esc(r.date)+'</p>'+
  d.groups.map(function(group){return '<details><summary>'+esc(group[0])+'</summary><dl>'+fields(group).map(function(f){return '<dt>'+esc(f.label)+'</dt><dd>'+esc(r.values[f.key]||"—")+'</dd>';}).join("")+'</dl></details>';}).join("")+'</section>';
}
function mount(){
 var base=document.getElementById("p0-editor");if(!base)return;
 var ctx=context();if(!ctx){var stale=document.getElementById("benchmark-v16");if(stale)stale.remove();return;}
 var items=available(ctx);if(!items.length&&!/^(RME|MED)-/.test(ctx.module))return;
 var prev=document.getElementById("benchmark-v16");
 if(prev&&prev.dataset.ctx===recordKey(ctx,"screen"))return;
 if(prev)prev.remove();
 live={id:"",group:0,mode:"form",errors:[],historyIndex:-1};historyItems=[];
 var el=document.createElement("section");el.className="v16-root";el.id="benchmark-v16";el.dataset.ctx=recordKey(ctx,"screen");
 el.innerHTML=header(ctx,items)+
  '<details class="v16-details"><summary>Form klinis khusus dan histori pasien <span>▾</span></summary>'+
  '<div class="v16-body"><p class="v16-intro">Pilih satu formulir tambahan sesuai pekerjaan Anda. Bagian lain tidak tampil bersamaan.</p>'+
  (items.length?choices(items):'<p>Untuk modul ini tersedia riwayat klinis baca-saja.</p>')+
  '<div id="v16-detail">'+(live.mode==="history"?history(ctx):(items.find(function(x){return x.id===live.id;})?drawActive(ctx,items.find(function(x){return x.id===live.id;})):'<div class="v16-empty">Pilih subform di atas atau buka riwayat pasien.</div>'))+'</div>'+
  '<button class="v16-history-btn" type="button" data-v16-action="history">Riwayat klinis (read-only)</button></div></details>';
 base.parentNode.insertBefore(el,base.nextSibling);
}
function refresh(ctx){
 var items=available(ctx),d=items.find(function(x){return x.id===live.id;});
 var panel=document.getElementById("v16-detail");
 if(panel)panel.innerHTML=live.mode==="history"?history(ctx):live.mode==="version"?viewVersion(ctx):(d?drawActive(ctx,d):'<div class="v16-empty">Pilih subform sesuai pekerjaan.</div>');
 var list=document.querySelector(".v16-choices");if(list)list.outerHTML=choices(items);
}
function feedback(message,ok){var notice=document.getElementById("v16-feedback");if(notice){notice.textContent=message;notice.className=ok?"v16-ok":"v16-warning";}}
document.addEventListener("input",function(e){
 var field=e.target.closest("#v16-active [data-v16-field]");
 if(!field||!field.validity||field.validity.badInput)return;
 var ctx=context(),bad=ctx&&badInputs[recordKey(ctx,live.id)];
 if(bad)delete bad[field.dataset.v16Field];
});
document.addEventListener("click",async function(e){
 var b=e.target.closest("#benchmark-v16 [data-v16-action]");if(!b)return;
 var ctx=context(),root=document.getElementById("benchmark-v16");if(!ctx||!root||root.dataset.ctx!==recordKey(ctx,"screen"))return;e.preventDefault();
 var action=b.dataset.v16Action,items=available(ctx),d=items.find(function(x){return x.id===live.id;});
 if(action==="choose"){if(!items.some(function(x){return x.id===b.dataset.id;}))return;collectInto(ctx);live.id=b.dataset.id;live.group=0;live.mode="form";live.errors=[];refresh(ctx);return;}
 if(action==="history"){if(d&&!d.gated)collectInto(ctx);live.mode="history";refresh(ctx);return;}
 if(action==="view-version"){if(live.mode!=="history")return;live.historyIndex=Number(b.dataset.index);live.mode="version";refresh(ctx);return;}
 if(action==="filter"){var f=b.dataset.filter;document.querySelectorAll("#benchmark-v16 [data-history-kind]").forEach(function(tr){tr.hidden=f!=="Semua"&&tr.dataset.historyKind!==f;});return;}
 if(!d||d.gated||live.mode!=="form")return;
 if(action==="save"||action==="review"){
  var values=collectInto(ctx),bad=badInputs[recordKey(ctx,d.id)]||{};
  live.errors=validate(d.id,values,action==="review");
  d.groups.forEach(function(group,index){fields(group).forEach(function(f){if(bad[f.key])live.errors.push({key:f.key,group:index,message:f.label+" harus berupa angka yang valid."});});});
  if(live.errors.length){live.group=live.errors[0].group;refresh(ctx);feedback((action==="save"?"Draft belum disimpan. ":"Review belum dapat dilanjutkan. ")+live.errors.map(function(error){return error.message;}).join(" "),false);var field=document.querySelector('#v16-active [aria-invalid="true"]');if(field)field.focus();return;}
  if(action==="save"){
   var snapshot=clone(values);
   var save=function(){saveRevision(ctx,d,snapshot);};
   b.disabled=true;
   try{
    if(navigator.locks)await navigator.locks.request(KEY,save);
    else save();
   }catch(err){
    if(b.isConnected)feedback("Draft belum tersimpan. Penyimpanan browser gagal; periksa izin atau ruang penyimpanan lalu coba lagi.",false);
    return;
   }finally{b.disabled=false;}
   if(b.isConnected){
    collectInto(ctx);
    refresh(ctx);
    feedback("Draft simulasi tersimpan untuk encounter "+ctx.encounterId+" · versi "+versionsOf(raw[recordKey(ctx,d.id)]).length+". Versi sebelumnya tetap dapat dibaca di riwayat.",true);
   }
  }else{refresh(ctx);feedback("Isian wajib dan format data lengkap untuk review DEMO (belum ditandatangani).",true);}
  return;
 }
 if(["step","back","next"].includes(action)){collectInto(ctx);live.group=action==="step"?Number(b.dataset.step):live.group+(action==="next"?1:-1);live.group=Math.max(0,Math.min(d.groups.length-1,live.group));refresh(ctx);}
});
var root=document.getElementById("main-content");
if(root)new MutationObserver(mount).observe(root,{childList:true,subtree:false});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount);else mount();
window.SIMRSBenchmarkV16={defs:defs,available:available,mount:mount,validate:validate};
})();
