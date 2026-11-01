(function(){
"use strict";
// Browser demo read-models; switching roles is NOT authentication / RBAC.
const roles=[["frontoffice","Pendaftaran"],["doctor","Dokter / DPJP"],["nurse","Perawat"],["lab","Laboratorium"],["pharmacy","Farmasi"],["cashier","Kasir"]];
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money=x=>"Rp "+Number(x||0).toLocaleString("id-ID");
const label=x=>roles.find(v=>v[0]===x)?.[1]||x;
const patient=(d,id)=>d.patients.find(p=>p.id===id)?.name||"—";
const invoice=dummy=>dummy;
function finance(d,encounterId){
 const invoice=d.invoices.find(i=>i.encounterId===encounterId);
 const total=d.charges.filter(x=>x.encounterId===encounterId).reduce((n,x)=>n+Number(x.amount||0),0);
 const paid=d.paymentAllocations.filter(x=>x.invoiceId===invoice?.id).reduce((n,x)=>n+Number(x.amount||0),0);
 return {invoice,total,paid,due:Math.max(0,total-paid)};
}
function integrity(d){
 const issues=[];
 for(const l of d.labs){
  const o=d.orders.find(x=>x.id===l.orderId);
  if(!o||!d.encounters.some(e=>e.id===o.encounterId))issues.push(l.id+" · lab tanpa order/encounter");
  if(d.labStages[l.id]==="released"&&l.resultObservationId&&!d.observations.some(x=>x.id===l.resultObservationId))issues.push(l.id+" · hasil Observation hilang");
 }
 for(const p of d.prescriptions){
  if(!d.encounters.some(e=>e.id===p.encounterId))issues.push(p.id+" · resep tanpa encounter");
  if(d.rxStages[p.id]==="dispensed"&&!d.movements.some(x=>x.ref===p.id))issues.push(p.id+" · dispensing tanpa stock movement");
 }
 for(const i of d.invoices){
  if(!d.encounters.some(e=>e.id===i.encounterId))issues.push(i.id+" · invoice tanpa encounter");
  const f=finance(d,i.encounterId);
  if(f.paid>f.total+0.01)issues.push(i.id+" · overpayment");
  if(i.status==="paid"&&f.total>0&&f.due>0.01)issues.push(i.id+" · paid tetapi masih outstanding");
 }
 return issues;
}
const make=(kind,id,encounterId,patientName,unit,state,detail,action)=>({kind,id,encounterId,patientName,unit,state,detail,action});
function worklist(d,role){
 const inspect=e=>window.SIMRS_CARE_JOURNEY?.inspect(d,e.id);
 if(role==="frontoffice")return d.appointments.map(a=>{
  const e=d.encounters.find(e=>e.patientId===a.patientId&&e.date===a.date&&e.unit===a.unit);
  return make("appointment",a.id,e?.id||"",patient(d,a.patientId),a.unit,a.status==="booked"?"action":a.status==="checked-in"||a.status==="served"?"done":"waiting",a.date+" · "+a.slot+" · "+a.status,"Buka Front Office");
 });
 if(role==="doctor")return d.encounters.map(e=>{
  const s=inspect(e),finished=e.status==="finished";let state="waiting",detail="Menunggu unit lain";
  if(finished){state="done";detail="Encounter selesai";}
  else if(!s?.complete.clinical){state="action";detail=s?.soap?.status==="draft"?"Draft menunggu signing":"SOAP/diagnosis/TTV belum lengkap";}
  else if(!s.lab){state="action";detail="Siap buat order LIS";}
  else if(!s.complete.lab)detail="Hasil LIS: "+s.labs;
  else if(!s.rx){state="action";detail="Hasil released, e-resep belum dibuat";}
  else if(!s.complete.pharmacy)detail="Menunggu farmasi: "+s.rxs;
  else if(!s.complete.billing)detail="Menunggu pembayaran";
  else {state="action";detail="Siap menutup encounter";}
  return make("encounter",e.id,e.id,patient(d,e.patientId),e.unit,state,detail,"Buka E2E");
 });
 if(role==="nurse")return d.encounters.map(e=>{
  const note=d.nursingNotes.some(n=>n.encounterId===e.id&&n.role==="nurse"&&n.status==="completed");
  const state=e.status==="finished"||note?"done":"action";
  return make("encounter",e.id,e.id,patient(d,e.patientId),e.unit,state,note?"Asuhan sudah dicatat":e.status==="finished"?"Encounter selesai":"Perlu catatan asuhan","Buka RME");
 });
 if(role==="lab")return d.labs.map(l=>{
  const o=d.orders.find(x=>x.id===l.orderId),e=d.encounters.find(x=>x.id===o?.encounterId);
  const stage=d.labStages[l.id]||"ordered";
  return make("lab",l.id,e?.id||"",patient(d,e?.patientId),o?.service||"Lab",stage==="released"?"done":e?.status==="finished"?"waiting":"action",l.accession+" · "+stage,"Buka LIS");
 });
 if(role==="pharmacy")return d.prescriptions.map(p=>{
  const e=d.encounters.find(x=>x.id===p.encounterId),stage=d.rxStages[p.id]||p.status;
  return make("prescription",p.id,p.encounterId,patient(d,e?.patientId),p.medication,stage==="dispensed"?"done":e?.status==="finished"?"waiting":"action","Qty "+p.quantity+" · "+stage,"Buka Farmasi");
 });
 if(role==="cashier")return d.invoices.map(i=>{
  const e=d.encounters.find(x=>x.id===i.encounterId),f=finance(d,i.encounterId),done=i.status==="paid"&&f.due<0.01;
  return make("invoice",i.id,i.encounterId,patient(d,e?.patientId),i.number,done?"done":f.due>0?"action":"waiting","Total "+money(f.total)+" · sisa "+money(f.due),"Buka Billing");
 });
 return [];
}
function render(page,c){
 if(page!=="role-worklists")return null;
 const u=c.ui,d=c.data;
 if(!roles.some(r=>r[0]===u.rwlRole))u.rwlRole="doctor";
 if(!["all","action","waiting","done"].includes(u.rwlFilter))u.rwlFilter="all";
 const rows=worklist(d,u.rwlRole),counts={all:rows.length,action:rows.filter(r=>r.state==="action").length,waiting:rows.filter(r=>r.state==="waiting").length,done:rows.filter(r=>r.state==="done").length};
 const list=rows.filter(r=>u.rwlFilter==="all"||r.state===u.rwlFilter),issues=integrity(d);
 const rolesUi=roles.map(([id,name])=>'<button class="rwl-role '+(u.rwlRole===id?"active":"")+'" data-action="rwl-role" data-id="'+id+'" aria-pressed="'+(u.rwlRole===id)+'"><strong>'+esc(name)+'</strong><small>'+worklist(d,id).filter(x=>x.state==="action").length+' perlu tindakan</small></button>').join("");
 const tabs=[["all","Semua"],["action","Perlu tindakan"],["waiting","Menunggu"],["done","Selesai"]].map(([id,name])=>'<button class="db-domain '+(u.rwlFilter===id?"active":"")+'" data-action="rwl-filter" data-id="'+id+'">'+name+' · '+counts[id]+'</button>').join("");
 const records=list.map(r=>{
  const status=r.state==="action"?"Perlu tindakan":r.state==="done"?"Selesai":"Menunggu";
  const color=r.state==="action"?"warning":r.state==="done"?"success":"neutral";
  const special=u.rwlRole==="frontoffice"&&r.state==="action"?'<button class="btn primary small" data-action="rwl-checkin" data-id="'+esc(r.id)+'">Check-in</button>':u.rwlRole==="nurse"&&r.state==="action"?'<button class="btn primary small" data-action="rwl-nursing" data-id="'+esc(r.encounterId)+'">Catat asuhan</button>':"";
  return '<article class="rwl-record"><div class="rwl-record-body"><div class="rwl-record-head"><strong>'+esc(r.patientName)+'</strong><span class="badge '+color+'">'+status+'</span></div><div class="rwl-record-meta">'+esc(r.id)+' · '+esc(r.unit)+'</div><p>'+esc(r.detail)+'</p></div><div class="rwl-actions">'+special+'<button class="btn soft small" data-action="rwl-open" data-id="'+esc(r.encounterId||r.id)+'">'+esc(r.action)+' →</button></div></article>';
 }).join("");
 return c.pageHead("WORKSPACE PETUGAS / DATA SINTETIS","Worklist Berdasarkan Peran","Enam perspektif antrean tugas dari Encounter, RME, LIS, Farmasi dan Billing yang sama.",'<button class="btn soft" data-nav="care-journey">Perjalanan Pasien E2E</button>')+
 '<div class="rwl-notice"><strong>Demo, bukan autentikasi.</strong> Pilihan peran hanya untuk review desain UI/UX. Tidak ada kontrol hak akses atau transaksi rumah sakit riil.</div>'+
 '<div class="rwl-layout"><aside class="panel rwl-sidebar"><h2>Pilih peran</h2><div class="rwl-roles">'+rolesUi+'</div></aside><div class="rwl-body">'+
 '<div class="rwl-metrics">'+[["Total",counts.all],["Perlu tindakan",counts.action],["Menunggu",counts.waiting],["Selesai",counts.done]].map(([n,v])=>'<div><small>'+n+'</small><strong>'+v+'</strong></div>').join("")+'</div>'+
 '<section class="panel"><h2>Antrean kerja · '+esc(label(u.rwlRole))+'</h2><div class="rwl-filters">'+tabs+'</div><div class="rwl-records">'+(records||'<p class="rwl-empty">Tidak ada record pada status ini.</p>')+'</div></section>'+
 '<section class="panel"><div class="rwl-integrity-title"><h2>Integritas relasi dan status</h2><span class="badge '+(issues.length?"warning":"success")+'">'+issues.length+' temuan</span></div>'+
 (issues.length?'<ul>'+issues.map(issue=>'<li>'+esc(issue)+'</li>').join("")+'</ul>':'<p class="rwl-ok">Tidak ditemukan konflik dari pemeriksaan dasar pada data demo.</p>')+
 '<p class="rwl-note">Pemeriksaan read-only: hubungan order/encounter, resep/stock movement, invoice/outstanding. Bukan pengganti foreign key dan transaksi backend.</p></section></div></div>';
}
function action(a,id,node,c){
 if(!a.startsWith("rwl-"))return false;
 const d=c.data,u=c.ui;
 if(a==="rwl-role"){if(roles.some(r=>r[0]===id)){u.rwlRole=id;u.rwlFilter="all";c.render();}return true;}
 if(a==="rwl-filter"){if(["all","action","waiting","done"].includes(id)){u.rwlFilter=id;c.render();}return true;}
 if(a==="rwl-open"){
  if(u.rwlRole==="frontoffice"){c.navigate("frontoffice");return true;}
  const e=d.encounters.find(e=>e.id===id);if(!e){c.notice("Encounter tidak ditemukan.");return true;}
  u.selectedEncounter=id;u.e2eRole=u.rwlRole;c.navigate(u.rwlRole==="nurse"?"clinical":"care-journey");return true;
 }
 if(a==="rwl-checkin"){
  if(u.rwlRole!=="frontoffice")return true;
  const ap=d.appointments.find(x=>x.id===id);
  if(!ap||ap.status!=="booked"||d.queue.some(q=>q.appointmentId===id))return true;
  const newId="Q-"+String(Math.max(0,...d.queue.map(q=>Number(String(q.id).match(/^Q-(\d+)$/)?.[1]||0)))+1).padStart(3,"0");
  ap.status="checked-in";d.queue.push({id:newId,appointmentId:id,patientId:ap.patientId,number:"A-"+String(d.queue.length+13).padStart(3,"0"),status:"waiting"});
  c.pushActivity("Check-in worklist demo",id+" · "+newId);c.save();c.render();return true;
 }
 if(a==="rwl-nursing"){
  if(u.rwlRole!=="nurse")return true;
  const e=d.encounters.find(e=>e.id===id);
  if(!e||e.status!=="in-progress"||d.nursingNotes.some(n=>n.encounterId===id&&n.role==="nurse"&&n.status==="completed"))return true;
  c.modal("Catatan Keperawatan Demo",'<div class="form-grid"><label class="form-label">Intervensi<textarea class="form-input" name="intervention" required>Monitoring tanda vital</textarea></label><label class="form-label">Hasil<textarea class="form-input" name="outcome" required>Pasien kooperatif</textarea></label><input type="hidden" name="encounterId" value="'+esc(id)+'"></div>',"rwl-nursing");return true;
 }
 return true;
}
function submit(kind,f,c){
 if(kind!=="rwl-nursing")return false;
 const d=c.data,id=String(f.get("encounterId")||"");
 const e=d.encounters.find(e=>e.id===id),intervention=String(f.get("intervention")||"").trim(),outcome=String(f.get("outcome")||"").trim();
 if(c.ui.rwlRole!=="nurse"||!e||e.status!=="in-progress"||!intervention||!outcome)return true;
 if(d.nursingNotes.some(n=>n.encounterId===id&&n.role==="nurse"&&n.status==="completed"))return true;
 const n="NN-"+String(Math.max(0,...d.nursingNotes.map(x=>Number(String(x.id).match(/^NN-(\d+)$/)?.[1]||0)))+1).padStart(3,"0");
 d.nursingNotes.push({id:n,encounterId:id,role:"nurse",intervention,outcome,status:"completed",recordedAt:"demo"});
 c.pushActivity("Asuhan keperawatan demo",n+" · "+id);c.closeModal();c.save();c.render();return true;
}
window.SIMRS_ROLE_WORKLISTS={roles,worklist,integrity,render,action,submit};
})();