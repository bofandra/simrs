(function(){
"use strict";
// Clinical Pathway: browser-only synthetic demonstration, NOT a validated treatment protocol.
const esc=v=>String(v??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
const template={id:"CP-DEMO-RI-01",code:"DEMO-RI",title:"Alur Asuhan Rawat Inap Terpadu",version:"1.0",status:"DRAFT SIMULASI",guideline:"Belum divalidasi komite medis; tidak untuk keputusan klinis"};
const categories=[
 {id:"medis",title:"Asuhan medis",owner:"DPJP / dokter jaga",activities:["Asesmen & diagnosis kerja","Visite dan evaluasi respon","Evaluasi perkembangan dan rencana pulang","Resume medis serta rencana kontrol"]},
 {id:"perawat",title:"Asuhan keperawatan",owner:"Perawat",activities:["Asesmen awal, TTV & risiko jatuh","Pemantauan TTV dan kebutuhan pasien","Edukasi dan kesiapan pulang","Serah terima serta edukasi tanda bahaya"]},
 {id:"penunjang",title:"Lab / radiologi",owner:"Tim penunjang",activities:["Tinjau indikasi dan order penunjang","Review hasil / kebutuhan pemeriksaan ulang","Evaluasi kebutuhan pemeriksaan tambahan","Pastikan hasil yang perlu ditindaklanjuti"]},
 {id:"farmasi",title:"Terapi & farmasi",owner:"Dokter / apoteker",activities:["Rekonsiliasi dan rencana terapi","Evaluasi terapi dan keamanan obat","Tinjau kelanjutan / perubahan terapi","Rekonsiliasi obat pulang"]},
 {id:"nutrisi",title:"Nutrisi / diet",owner:"Ahli gizi",activities:["Skrining dan rencana diet individual","Evaluasi toleransi diet","Tinjau kebutuhan dan asupan","Edukasi nutrisi untuk di rumah"]},
 {id:"outcome",title:"Kriteria hasil",owner:"DPJP / tim multidisiplin",activities:["Masalah prioritas teridentifikasi","Respons awal terhadap asuhan dinilai","Kriteria kesiapan pulang dinilai","Keputusan pulang aman / tindak lanjut"]}
];
const steps=categories.flatMap(cat=>cat.activities.map((activity,i)=>({
 id:cat.id+"-"+(i+1),day:i+1,category:cat.id,activity,owner:cat.owner,required:true
})));
const unique=(arr,prefix)=>prefix+"-"+String(Math.max(0,...arr.map(x=>Number(String(x.id||"").split("-").pop())||0))+1).padStart(3,"0");
function init(data){
 if(!data.pathwayDemo||typeof data.pathwayDemo!=="object")data.pathwayDemo={};
 const p=data.pathwayDemo;
 for(const key of ["enrollments","executions","variances","outcomes"]){if(!Array.isArray(p[key]))p[key]=[];}
 if(!p.seeded&&data.encounters.some(e=>e.id==="E-1003")){
  p.enrollments.push({id:"CPE-001",encounterId:"E-1003",pathwayId:template.id,templateVersion:template.version,status:"active",startedAt:"2026-10-30",source:"synthetic-demo"});
  p.executions.push(
   {id:"CPX-001",enrollmentId:"CPE-001",stepId:"medis-1",status:"completed",actor:"DPJP (demo)",actualAt:"2026-10-30T09:00",evidenceRef:"DX-03",note:"Asesmen awal terdokumentasi dalam contoh"},
   {id:"CPX-002",enrollmentId:"CPE-001",stepId:"perawat-1",status:"completed",actor:"Perawat (demo)",actualAt:"2026-10-30T09:20",evidenceRef:"OBS-04",note:"TTV tersedia pada encounter"},
   {id:"CPX-003",enrollmentId:"CPE-001",stepId:"farmasi-1",status:"completed",actor:"Apoteker (demo)",actualAt:"2026-10-30T10:00",evidenceRef:"RX-02",note:"Data resep demo terhubung"}
  );
  p.variances.push({id:"CPV-001",enrollmentId:"CPE-001",stepId:"nutrisi-2",reasonCode:"patient-condition",reason:"Toleransi asupan belum sesuai rencana (contoh)",impact:"Perlu penilaian ulang rencana diet",followUp:"Evaluasi bersama ahli gizi",status:"open",recordedAt:"2026-10-31T11:00",actor:"Tim gizi (demo)"});
  p.seeded=true;
 }
 return p;
}
function enroll(data,id){const p=init(data);return p.enrollments.find(e=>e.encounterId===id);}
function summary(data,e){
 const p=init(data),executions=p.executions.filter(x=>x.enrollmentId===e?.id&&x.status==="completed");
 const variances=p.variances.filter(x=>x.enrollmentId===e?.id&&x.status==="open");
 const outcomes=p.outcomes.filter(x=>x.enrollmentId===e?.id&&x.result==="achieved");
 const completedIds=new Set(executions.map(x=>x.stepId).concat(outcomes.map(x=>x.stepId)));
 variances.forEach(x=>completedIds.delete(x.stepId));
 return {complete:completedIds.size,variance:variances.length,outcome:outcomes.length,total:steps.length,progress:Math.round(100*completedIds.size/steps.length)};
}
function evidenceOptions(d,encounterId){
 const items=[];
 (d.diagnoses||[]).filter(x=>x.encounterId===encounterId).forEach(x=>items.push([x.id,"Diagnosis · "+x.code]));
 (d.observations||[]).filter(x=>x.encounterId===encounterId).forEach(x=>items.push([x.id,"Observasi · "+x.name]));
 (d.orders||[]).filter(x=>x.encounterId===encounterId).forEach(x=>items.push([x.id,"Order · "+x.service+" ("+x.status+")"]));
 (d.prescriptions||[]).filter(x=>x.encounterId===encounterId).forEach(x=>items.push([x.id,"Resep · "+x.medication]));
 (d.notes||[]).filter(x=>x.encounterId===encounterId).forEach(x=>items.push([x.id,"CPPT · "+x.summary.slice(0,45)]));
 (d.nursingNotes||[]).filter(x=>x.encounterId===encounterId).forEach(x=>items.push([x.id,"Asuhan · "+x.intervention]));
 return items;
}
function statusFor(d,enrollment,step){
 if(!enrollment)return "not-enrolled";
 const p=init(d),out=p.outcomes.find(x=>x.enrollmentId===enrollment.id&&x.stepId===step.id);
 const ex=p.executions.find(x=>x.enrollmentId===enrollment.id&&x.stepId===step.id);
 const varOpen=p.variances.some(x=>x.enrollmentId===enrollment.id&&x.stepId===step.id&&x.status==="open");
 if(varOpen)return "variance";
 if(out)return out.result==="achieved"?"completed":out.result==="not-achieved"?"variance":"in-progress";
 return ex?.status==="completed"?"completed":"planned";
}
const stateBadge={completed:["✓","success","Selesai"],planned:["○","neutral","Rencana"],variance:["!","danger","Varian"],"in-progress":["◷","warning","Review"],"not-enrolled":["—","neutral","Belum mulai"]};
function badge(state){const b=stateBadge[state]||stateBadge.planned;return '<span class="cp-status '+b[1]+'" title="'+b[2]+'">'+b[0]+' <span>'+b[2]+'</span></span>';}
function activeEncounter(c){return c.enc(c.ui.cpEncounterId)||c.data.encounters.find(x=>x.type==="Rawat Inap")||c.data.encounters[0];}
function render(page,c){
 if(page!=="clinical-pathway")return null;
 const d=c.data,p=init(d),u=c.ui;
 if(!u.cpEncounterId||!c.enc(u.cpEncounterId)){u.cpEncounterId=d.encounters.find(x=>x.type==="Rawat Inap")?.id||d.encounters[0]?.id;}
 if(!u.cpTab)u.cpTab="matrix";
 const en=activeEncounter(c),person=c.patient(en.patientId),enrollment=enroll(d,en.id),stats=summary(d,enrollment),readonly=en.status!=="in-progress";
 const actions=c.btn("↗ Workspace Klinis","cp-open-clinical","soft")+(enrollment&& !readonly?c.btn("＋ Catat varian","cp-new-variance","primary"):"");
 let html=c.pageHead("MANAJEMEN MUTU / CLINICAL WORKFLOW","Clinical Pathway","Matriks rencana → pelaksanaan → bukti → varian → outcome, terhubung ke encounter. Semua contoh sintetis dan bukan instruksi terapi.",actions);
 html+='<div class="cp-banner"><strong>Simulasi UI · bukan clinical guideline.</strong> Template belum disahkan komite medis. Semua aktivitas dan outcome pada halaman ini bersifat ilustratif; tidak ada pengiriman data ke sistem eksternal.</div>';
 html+='<section class="panel cp-context"><div class="cp-context-grid"><div><span class="detail-label">Encounter pasien</span><select class="form-input" id="cp-encounter" aria-label="Pilih encounter clinical pathway">'+d.encounters.map(x=>'<option value="'+esc(x.id)+'" '+(x.id===en.id?"selected":"")+'>'+esc(x.id+" · "+c.patientName(x.patientId)+" · "+x.type)+'</option>').join("")+'</select><div class="cp-secondary">'+esc(person?.mrn||"")+" · "+esc(en.unit)+" · "+esc(c.doctor(en.doctor))+'</div></div><div><span class="detail-label">Diagnosis encounter</span><div class="cp-primary">'+((d.diagnoses||[]).filter(x=>x.encounterId===en.id).map(x=>esc(x.code)+" · "+esc(x.name)).join("; ")||"Belum ada diagnosis")+'</div><span class="cp-secondary">Penjamin: '+esc(en.payer||"—")+' · Casemix belum ditetapkan</span></div><div><span class="detail-label">Template pathway</span><div class="cp-primary">'+esc(template.code)+' · v'+esc(enrollment?.templateVersion||template.version)+'</div><span class="cp-secondary">'+esc(template.status)+' · '+esc(enrollment?.status||"Belum dimulai")+'</span></div></div></section>';
 if(en.type!=="Rawat Inap"){html+=c.panel("Belum berlaku untuk encounter ini","Clinical pathway matriks ini disiapkan khusus untuk simulasi rawat inap.",'<div class="notice warn">Pilih encounter dengan tipe Rawat Inap. Tidak ada enrollment otomatis pada rawat jalan atau IGD.</div>');return html;}
 if(!enrollment){html+=c.panel("Mulai Clinical Pathway","Penerapan template pada encounter harus eksplisit.",'<p class="cp-copy">Contoh template: '+esc(template.title)+'. Versi '+esc(template.version)+' akan dikunci pada enrollment ini agar riwayat pasien tetap dapat diaudit.</p>'+(!readonly?c.btn("Aktifkan pathway untuk encounter ini","cp-enroll","primary"):'<div class="notice warn">Encounter telah ditutup; enrollment baru tidak diperbolehkan.</div>'));return html;}
 html+='<div class="cp-metrics"><div><span>Aktivitas selesai</span><strong>'+stats.complete+' / '+stats.total+'</strong><small>Pelaksanaan tercatat</small></div><div><span>Progres pathway</span><strong>'+stats.progress+'%</strong><div class="progress-track"><div class="progress-bar" style="width:'+stats.progress+'%"></div></div></div><div><span>Varian terbuka</span><strong>'+stats.variance+'</strong><small>Perlu tindak lanjut</small></div><div><span>Outcome tercapai</span><strong>'+stats.outcome+'</strong><small>Penilaian terdokumentasi</small></div></div>';
 html+='<div class="cp-tabs" role="tablist" aria-label="Tampilan clinical pathway">'+[["matrix","Matriks harian"],["variance","Varian & tindak lanjut"],["outcomes","Outcome & evaluasi"],["data","Relasi & bukti data"]].map(([key,name])=>'<button type="button" role="tab" aria-selected="'+(u.cpTab===key)+'" data-action="cp-tab" data-id="'+key+'" class="'+(u.cpTab===key?"active":"")+'">'+name+'</button>').join("")+'</div>';
 if(u.cpTab==="matrix"){
  html+='<section class="panel cp-matrix-panel"><div class="panel-head"><div><h2>Aktivitas multidisiplin per hari perawatan</h2><p>Klik sel untuk mencatat bukti pelaksanaan, atau varian bila rencana tidak tercapai.</p></div><span class="badge neutral">H1–H4 · ilustratif</span></div><div class="cp-table-scroll"><table class="cp-table"><thead><tr><th scope="col">Kelompok pelayanan</th>'+[1,2,3,4].map(n=>'<th scope="col">Hari '+n+'</th>').join("")+'</tr></thead><tbody>'+categories.map(cat=>'<tr><th scope="row"><span class="cp-category">'+esc(cat.title)+'</span><small>'+esc(cat.owner)+'</small></th>'+[1,2,3,4].map(day=>{
   const s=steps.find(x=>x.category===cat.id&&x.day===day),st=statusFor(d,enrollment,s);
   const ex=p.executions.find(x=>x.enrollmentId===enrollment.id&&x.stepId===s.id),out=p.outcomes.find(x=>x.enrollmentId===enrollment.id&&x.stepId===s.id);
   return '<td><button type="button" class="cp-cell '+(st==="variance"?"cp-alert":"")+'" data-action="cp-step" data-id="'+s.id+'" aria-label="'+esc("Hari "+day+", "+cat.title+", "+s.activity+": "+stateBadge[st][2])+'"><span class="cp-activity">'+esc(s.activity)+'</span>'+badge(st)+(ex?.evidenceRef?'<span class="cp-ref">↳ '+esc(ex.evidenceRef)+'</span>':"")+(out?'<span class="cp-ref">↳ Outcome dinilai</span>':"")+'</button></td>';
  }).join("")+'</tr>').join("")+'</tbody></table></div><div class="cp-legend">'+[["completed","Tercatat selesai"],["planned","Direncanakan"],["variance","Varian / target belum tercapai"]].map(([s,t])=>'<span>'+badge(s)+' '+t+'</span>').join("")+'</div></section>';
 }else if(u.cpTab==="variance"){
  const vv=p.variances.filter(x=>x.enrollmentId===enrollment.id);
  html+=c.panel("Pencatatan variance","Kesenjangan rencana vs pelaksanaan harus memiliki alasan, dampak, tindak lanjut dan status penutupan.",vv.length?'<div class="cp-table-scroll"><table class="cp-table cp-detail"><thead><tr><th>Aktivitas</th><th>Alasan dan dampak</th><th>Tindak lanjut</th><th>Status</th></tr></thead><tbody>'+vv.map(v=>{const s=steps.find(x=>x.id===v.stepId);return '<tr><td>'+esc(s?.activity||v.stepId)+'<small>H'+esc(s?.day||"?")+' · '+esc(v.actor||"")+'</small></td><td><strong>'+esc(v.reason)+'</strong><small>'+esc(v.impact)+'</small></td><td>'+esc(v.followUp)+(v.resolution?'<small>Penutupan: '+esc(v.resolution)+'</small>':"")+'</td><td>'+c.status(v.status==="open"?"open":"completed")+(v.status==="open"&&!readonly?'<div>'+c.btn("Tutup varian","cp-resolve","small soft",'data-id="'+esc(v.id)+'"')+'</div>':"")+'</td></tr>'}).join("")+'</tbody></table></div>':c.empty("Belum ada varian","Jika terjadi deviasi klinis, catat alasan dan rencana tindak lanjut."),!readonly?c.btn("＋ Catat varian","cp-new-variance","small primary"):"");
 }else if(u.cpTab==="outcomes"){
  const outcomes=p.outcomes.filter(x=>x.enrollmentId===enrollment.id);
  html+=c.panel("Target dan hasil aktual","Penilaian outcome didokumentasikan oleh tim klinis, tidak diturunkan otomatis dari status order.",'<div class="cp-table-scroll"><table class="cp-table cp-detail"><thead><tr><th>Hari</th><th>Target ilustratif</th><th>Hasil penilaian</th><th>Status</th><th></th></tr></thead><tbody>'+steps.filter(s=>s.category==="outcome").map(s=>{const o=outcomes.find(x=>x.stepId===s.id);return '<tr><td>H'+s.day+'</td><td>'+esc(s.activity)+'</td><td>'+esc(o?.note||"Belum dinilai")+'<small>'+esc(o?.actor||"")+'</small></td><td>'+badge(statusFor(d,enrollment,s))+'</td><td>'+(!readonly?c.btn(o?"Perbarui":"Nilai","cp-step","small soft",'data-id="'+s.id+'"'):"")+'</td></tr>'}).join("")+'</tbody></table></div>');
 }else{
  const links=evidenceOptions(d,en.id);
  html+=c.panel("Bukti dari modul klinis","Record sudah tersedia di modul lain namun tidak otomatis berarti langkah pathway selesai.",links.length?'<div class="cp-evidence">'+links.map(([id,label])=>'<div><span class="mono">'+esc(id)+'</span> '+esc(label)+'</div>').join("")+'</div>':c.empty("Belum ada bukti dari modul","Input RME, order, atau farmasi terlebih dahulu."))+
  c.panel("Desain relasi kandidat","Blueprint saat ini sudah memiliki pathway master, steps dan enrollment. Detail eksekusi serta varian masih usulan.",'<div class="record-chain">'+["patient.patients","encounter.encounters","clinical.pathway_enrollments","clinical.pathway_steps","clinical.pathway_step_executions","clinical.pathway_variances","clinical.pathway_outcome_assessments"].map((s,i)=>(i?'<span class="arrow">→</span>':"")+'<span class="chain-entity">'+esc(s)+'</span>').join("")+'</div><div class="notice warn" style="margin-top:14px">Tiga tabel terakhir adalah <strong>usulan desain</strong>, bukan tabel PostgreSQL yang sudah dibuat. Evidence reference harus diverifikasi sebelum dipakai untuk pelaksanaan klinis nyata.</div>');
 }
 html+='<div class="cp-footnote">Sumber data: encounter '+esc(en.id)+'; enrollment '+esc(enrollment.id)+'; versi template '+esc(enrollment.templateVersion)+'. Data aksi disimpan hanya di localStorage browser dan hilang saat Reset Demo.</div>';
 return html;
}
function requireActive(c){const en=activeEncounter(c);if(!en||en.type!=="Rawat Inap"||en.status!=="in-progress"){c.notice("Hanya encounter rawat inap aktif yang boleh diubah pada demo.");return null;}return en;}
function openStep(c,id){
 const step=steps.find(x=>x.id===id),enc=requireActive(c);if(!step||!enc)return;
 const enrol=enroll(c.data,enc.id);if(!enrol)return;
 const p=init(c.data),ex=p.executions.find(x=>x.enrollmentId===enrol.id&&x.stepId===id),out=p.outcomes.find(x=>x.enrollmentId===enrol.id&&x.stepId===id);
 const top='<div class="notice">H'+step.day+' · '+esc(categories.find(x=>x.id===step.category)?.title)+'<br><strong>'+esc(step.activity)+'</strong><br>Pelaksana: '+esc(step.owner)+'</div><input type="hidden" name="stepId" value="'+esc(step.id)+'">';
 if(step.category==="outcome"){
  c.modal("Evaluasi kriteria hasil",top+'<div class="form-grid" style="margin-top:13px"><label class="form-label">Hasil penilaian<select class="form-input" name="result"><option value="achieved" '+(out?.result==="achieved"?"selected":"")+'>Tercapai</option><option value="in-progress" '+(out?.result==="in-progress"?"selected":"")+'>Dalam evaluasi</option><option value="not-achieved" '+(out?.result==="not-achieved"?"selected":"")+'>Belum tercapai</option></select></label><label class="form-label">Penilai<input required class="form-input" name="actor" value="'+esc(out?.actor||"DPJP (demo)")+'"></label><label class="form-label full">Hasil klinis / bukti penilaian<textarea required maxlength="500" class="form-input" name="note" rows="3">'+esc(out?.note||"")+'</textarea></label></div>',"cp-outcome");return;
 }
 const evidence=evidenceOptions(c.data,enc.id);
 c.modal("Catat pelaksanaan pathway",top+'<div class="form-grid" style="margin-top:13px"><label class="form-label">Pelaksana<input required maxlength="80" name="actor" class="form-input" value="'+esc(ex?.actor||step.owner)+'"></label><label class="form-label">Waktu aktual<input required type="datetime-local" name="actualAt" class="form-input" value="'+esc(ex?.actualAt||new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,16))+'"></label><label class="form-label full">Bukti modul lain (opsional)<select class="form-input" name="evidenceRef"><option value="">— Belum dipilih —</option>'+evidence.map(([rid,label])=>'<option value="'+esc(rid)+'" '+(rid===ex?.evidenceRef?"selected":"")+'>'+esc(rid+" · "+label)+'</option>').join("")+'</select></label><label class="form-label full">Catatan aktual<textarea required maxlength="500" class="form-input" name="note" rows="3">'+esc(ex?.note||"")+'</textarea></label></div><div class="cp-form-alternative"><span>Rencana tidak terlaksana?</span><button type="button" class="btn soft small" data-action="cp-new-variance" data-id="'+esc(id)+'">Catat varian →</button></div>',"cp-execution");
}
function openVariance(c,stepId){
 const en=requireActive(c);if(!en||!enroll(c.data,en.id))return;
 const s=steps.find(x=>x.id===stepId);
 c.modal("Catat varian Clinical Pathway",'<div class="notice warn">Varian adalah penyimpangan dari rencana. Tidak otomatis menandai tindakan selesai.</div><div class="form-grid" style="margin-top:13px"><label class="form-label full">Langkah pathway<select name="stepId" class="form-input">'+steps.map(x=>'<option value="'+esc(x.id)+'" '+(x.id===stepId?"selected":"")+'>'+esc("H"+x.day+" · "+x.activity)+'</option>').join("")+'</select></label><label class="form-label">Kategori alasan<select class="form-input" name="reasonCode"><option value="patient-condition">Kondisi pasien</option><option value="clinical-decision">Keputusan klinis</option><option value="service-availability">Ketersediaan layanan</option><option value="operational">Operasional</option><option value="other">Lainnya</option></select></label><label class="form-label">Pelapor<input required maxlength="80" class="form-input" name="actor" value="Tim klinis (demo)"></label><label class="form-label full">Alasan varian<textarea class="form-input" required maxlength="500" name="reason" rows="2"></textarea></label><label class="form-label full">Dampak / penilaian risiko<textarea required maxlength="500" class="form-input" name="impact" rows="2"></textarea></label><label class="form-label full">Rencana tindak lanjut<textarea required maxlength="500" class="form-input" name="followUp" rows="2"></textarea></label></div>',"cp-variance");
}
function action(a,id,node,c){
 if(!a?.startsWith("cp-"))return false;
 if(a==="cp-tab"){c.ui.cpTab=id;c.render();return true;}
 if(a==="cp-open-clinical"){c.ui.selectedEncounter=c.ui.cpEncounterId;c.navigate("clinical");return true;}
 if(a==="cp-enroll"){
  const enc=requireActive(c);if(!enc)return true;
  const p=init(c.data);if(!enroll(c.data,enc.id)){p.enrollments.push({id:unique(p.enrollments,"CPE"),encounterId:enc.id,pathwayId:template.id,templateVersion:template.version,status:"active",startedAt:enc.date,source:"user-demo"});c.pushActivity("Enrollment Clinical Pathway (demo)",enc.id);c.save();}
  c.render();return true;
 }
 if(a==="cp-step"){openStep(c,id);return true;}
 if(a==="cp-new-variance"){openVariance(c,id);return true;}
 if(a==="cp-resolve"){
  const enc=requireActive(c);if(!enc)return true;
  const v=init(c.data).variances.find(x=>x.id===id&&x.enrollmentId===enroll(c.data,enc.id)?.id&&x.status==="open");
  if(v)c.modal("Tutup varian pathway",'<input type="hidden" name="varianceId" value="'+esc(v.id)+'"><div class="notice">'+esc(v.reason)+'</div><label class="form-label" style="margin-top:13px">Hasil tindak lanjut / dasar penutupan<textarea name="resolution" class="form-input" required maxlength="500" rows="3"></textarea></label>',"cp-resolve");
  return true;
 }
 return false;
}
function submit(kind,f,c){
 if(!kind?.startsWith("cp-"))return false;
 const current=requireActive(c);if(!current)return true;
 const p=init(c.data),en=enroll(c.data,current.id);if(!en)return true;
 const val=k=>String(f.get(k)||"").trim();
 const step=steps.find(x=>x.id===val("stepId"));
 if(kind==="cp-execution"){
  if(!step||step.category==="outcome"||!val("actor")||!val("actualAt")||!val("note")){c.notice("Lengkapi pelaksana, waktu dan catatan pelaksanaan.");return true;}
  const evidence=val("evidenceRef"),validRefs=evidenceOptions(c.data,current.id).map(x=>x[0]);
  if(evidence&&!validRefs.includes(evidence)){c.notice("Bukti tidak terkait encounter aktif.");return true;}
  let entry=p.executions.find(x=>x.enrollmentId===en.id&&x.stepId===step.id);
  if(!entry){entry={id:unique(p.executions,"CPX"),enrollmentId:en.id,stepId:step.id};p.executions.push(entry);}
  Object.assign(entry,{status:"completed",actor:val("actor"),actualAt:val("actualAt"),note:val("note"),evidenceRef:evidence});
  c.pushActivity("Pelaksanaan pathway dicatat",current.id+" · "+step.id);
 }else if(kind==="cp-variance"){
  if(!step||!val("actor")||!val("reason")||!val("impact")||!val("followUp")){c.notice("Alasan, dampak dan tindak lanjut wajib diisi.");return true;}
  if(p.variances.some(x=>x.enrollmentId===en.id&&x.stepId===step.id&&x.status==="open")){c.notice("Varian terbuka sudah ada pada langkah ini.");return true;}
  p.variances.push({id:unique(p.variances,"CPV"),enrollmentId:en.id,stepId:step.id,reasonCode:val("reasonCode"),reason:val("reason"),impact:val("impact"),followUp:val("followUp"),status:"open",actor:val("actor"),recordedAt:new Date().toISOString()});
  c.pushActivity("Varian pathway dicatat",current.id+" · "+step.id);
 }else if(kind==="cp-outcome"){
  if(!step||step.category!=="outcome"||!["achieved","in-progress","not-achieved"].includes(val("result"))||!val("actor")||!val("note")){c.notice("Lengkapi evaluasi outcome.");return true;}
  let entry=p.outcomes.find(x=>x.enrollmentId===en.id&&x.stepId===step.id);
  if(!entry){entry={id:unique(p.outcomes,"CPO"),enrollmentId:en.id,stepId:step.id};p.outcomes.push(entry);}
  Object.assign(entry,{result:val("result"),actor:val("actor"),note:val("note"),assessedAt:new Date().toISOString()});
  c.pushActivity("Evaluasi outcome pathway",current.id+" · "+step.id);
 }else if(kind==="cp-resolve"){
  const v=p.variances.find(x=>x.id===val("varianceId")&&x.enrollmentId===en.id&&x.status==="open");
  if(!v||!val("resolution")){c.notice("Alasan penutupan wajib diisi.");return true;}
  Object.assign(v,{status:"resolved",resolution:val("resolution"),resolvedAt:new Date().toISOString()});
  c.pushActivity("Varian pathway ditutup",current.id+" · "+v.id);
 }else return false;
 c.closeModal();c.save();c.render();c.notice("Clinical Pathway demo tersimpan lokal.");return true;
}
function change(target,c){
 if(target?.id!=="cp-encounter")return false;
 if(!c.enc(target.value))return true;
 c.ui.cpEncounterId=target.value;c.ui.selectedEncounter=target.value;c.render();return true;
}
window.SIMRS_PATHWAY={init,render,action,submit,change,steps,summary};
})();