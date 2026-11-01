(function(){
"use strict";
// Synthetic browser-only end-to-end SIMRS; shared demo collections across modules.
const esc=v=>String(v??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
const roles=[["frontoffice","Front Office"],["doctor","Dokter/DPJP"],["lab","Analis Lab"],["pharmacy","Farmasis"],["cashier","Kasir"]];
const stageRole={new:"frontoffice",clinical:"doctor",sign:"doctor",order:"doctor",labnext:"lab",verify:"lab",rx:"doctor",rxverify:"pharmacy",dispense:"pharmacy",pay:"cashier",close:"doctor"};
const amount=n=>"Rp "+Number(n||0).toLocaleString("id-ID");
const next=(a,prefix)=>prefix+"-"+String(Math.max(0,...a.map(x=>Number(String(x.id).match(new RegExp("^"+prefix+"-([0-9]+)$"))?.[1]||0)))+1).padStart(4,"0");
function init(d){if(!Array.isArray(d.e2eRegistrations))d.e2eRegistrations=[];if(!Array.isArray(d.e2eAudit))d.e2eAudit=[];if(!d.e2eClinical)d.e2eClinical={};}
function inspect(d,id){
 const encounter=d.encounters.find(e=>e.id===id);if(!encounter)return null;
 const lab=d.labs.filter(l=>d.orders.some(o=>o.id===l.orderId&&o.encounterId===id&&o.type==="Laboratorium")).at(-1);
 const rx=d.prescriptions.filter(r=>r.encounterId===id).at(-1);
 const invoice=d.invoices.find(i=>i.encounterId===id);
 const total=d.charges.filter(ch=>ch.encounterId===id).reduce((n,ch)=>n+Number(ch.amount),0);
 const paid=d.paymentAllocations.filter(a=>a.invoiceId===invoice?.id).reduce((n,a)=>n+Number(a.amount),0);
 const soap=d.soapRecords[id];
 const labs=lab?(d.labStages[lab.id]||"ordered"):"none";
 const rxs=rx?(d.rxStages[rx.id]||rx.status||"prescribed"):"none";
 const complete={
  registration:true,
  clinical:soap?.status==="signed"&&d.diagnoses.some(dx=>dx.encounterId===id)&&["8480-6","8462-4"].every(code=>d.observations.some(o=>o.encounterId===id&&o.code===code)),
  lab:labs==="released",
  pharmacy:rxs==="dispensed"&&d.movements.some(m=>m.ref===rx?.id),
  billing:!!invoice&&total>0&&paid>0&&total-paid<0.01
 };
 return {encounter,patient:d.patients.find(p=>p.id===encounter.patientId),lab,rx,soap,invoice,total,paid,balance:Math.max(0,total-paid),labs,rxs,complete,done:Object.values(complete).every(Boolean)};
}
const roleOK=(c,op)=>{if(c.ui.e2eRole===stageRole[op])return true;c.notice("Pilih peran "+roles.find(r=>r[0]===stageRole[op])?.[1]+" untuk aksi ini (simulasi).");return false;};
function commit(c,label,detail){
 c.data.e2eAudit.unshift({id:next(c.data.e2eAudit,"AUD"),encounterId:c.ui.selectedEncounter,label,detail});
 c.pushActivity("E2E "+label,detail);c.save();c.render();
}
const btn=(action,label,enabled)=>'<button type="button" class="btn '+(enabled?"primary":"soft")+'" data-action="e2e-'+action+'" '+(enabled?"":"disabled")+'>'+esc(label)+'</button>';
const field=(name,label,value,type="text",attrs="")=>'<label class="form-label">'+esc(label)+'<input class="form-input" name="'+esc(name)+'" type="'+type+'" value="'+esc(value)+'" '+attrs+' required></label>';
function render(page,c){
 if(page!=="care-journey")return null;
 const d=c.data,u=c.ui;if(!roles.some(r=>r[0]===u.e2eRole))u.e2eRole="frontoffice";
 let s=inspect(d,u.selectedEncounter)||inspect(d,d.encounters[0]?.id);if(s)u.selectedEncounter=s.encounter.id;
 const role=u.e2eRole,on=key=>role===stageRole[key],active=s?.encounter.status==="in-progress";
 const opts=d.encounters.map(e=>'<option value="'+esc(e.id)+'" '+(e.id===u.selectedEncounter?"selected":"")+'>'+esc(e.id+" · "+(d.patients.find(p=>p.id===e.patientId)?.name||"?"))+'</option>').join("");
 const complete=s?.complete||{},progress=Object.values(complete).filter(Boolean).length;
 const stages=[
  {key:"registration",title:"Registrasi & Encounter",owner:"Front Office",tables:"patient.patients → scheduling.appointments → scheduling.queue_tickets → encounter.encounters",evidence:s?esc(d.e2eRegistrations.find(x=>x.encounterId===s.encounter.id)?.id||"Encounter awal (fixture)"):"Belum dipilih",actions:""},
  {key:"clinical",title:"RME, Diagnosis, Tekanan Darah & Signing",owner:"Dokter/DPJP",tables:"clinical.clinical_notes → clinical.diagnoses + clinical.observations",evidence:esc(s?.soap?.status||"Belum ada SOAP")+" · Dx "+(s?d.diagnoses.filter(x=>x.encounterId===s.encounter.id).length:0),actions:btn("clinical","Isi RME",on("clinical")&&active&&s?.soap?.status!=="signed")+btn("sign","Sign CPPT",on("sign")&&active&&s?.soap?.status==="draft"&&d.diagnoses.some(x=>x.encounterId===s?.encounter.id))},
  {key:"lab",title:"LIS: Order → Specimen → Hasil → Release",owner:"DPJP / Analis lab",tables:"orders.service_orders → laboratory.specimens → laboratory.lab_results",evidence:esc(s?.lab?.id||"Belum ada order")+" · "+esc(s?.labs||"none"),actions:s?.lab?(s.labs==="processing"?btn("verify","Verifikasi Hb",on("verify")&&active):btn("labnext",s.labs==="verified"?"Release hasil":"Tahap specimen berikutnya",on("labnext")&&active&&s.labs!=="released")):btn("order","Buat order Hb",on("order")&&active&&complete.clinical)},
  {key:"pharmacy",title:"Farmasi: E-Resep → Verifikasi → Dispensing",owner:"DPJP / Farmasis",tables:"pharmacy.prescriptions → pharmacy.dispenses → inventory.stock_movements",evidence:esc(s?.rx?.id||"Belum ada resep")+" · "+esc(s?.rxs||"none"),actions:s?.rx?(["prescribed","waiting"].includes(s.rxs)?btn("rxverify","Verifikasi resep",on("rxverify")&&complete.lab&&active):s.rxs==="verified"?btn("dispense","Dispensing obat",on("dispense")&&complete.lab&&active):"<span>Obat diserahkan (demo)</span>"):btn("rx","Buat e-resep",on("rx")&&complete.lab&&active)},
  {key:"billing",title:"Billing: Charge → Invoice → Pembayaran",owner:"Kasir / DPJP",tables:"billing.charges → billing.invoices → billing.payments → billing.payment_allocations",evidence:amount(s?.paid||0)+" dibayar · "+amount(s?.balance||0)+" sisa",actions:btn("pay","Catat pembayaran",on("pay")&&complete.lab&&complete.pharmacy&&s?.balance>0&&active)+btn("close","Selesaikan encounter",on("close")&&s?.done&&active)}
 ];
 const cards=stages.map((x,i)=>'<section class="panel e2e-stage"><div class="e2e-stage-head"><div><small>TAHAP '+(i+1)+' · '+esc(x.owner)+'</small><h2>'+esc(x.title)+'</h2></div><span class="badge '+(complete[x.key]?"success":"warning")+'">'+(complete[x.key]?"Selesai":"Pending")+'</span></div><div class="e2e-tables">'+esc(x.tables)+'</div><p class="e2e-evidence">Evidence: '+x.evidence+'</p><div class="e2e-actions">'+x.actions+'</div></section>').join("");
 const charges=s?d.charges.filter(x=>x.encounterId===s.encounter.id):[];
 const audit=s?d.e2eAudit.filter(x=>x.encounterId===s.encounter.id).slice(0,15):[];
 return c.pageHead("MOCKUP / LINTAS MODUL","Perjalanan Pasien End-to-End","Satu encounter dan data bersama: registrasi, RME, LIS, farmasi, inventory, billing dan pelacakan.",btn("new","＋ Registrasi alur baru",on("new")))+
 '<div class="e2e-disclaimer"><strong>DATA SINTETIS — DEMO BROWSER.</strong> Simulasi peran bukan autentikasi; signing bukan tanda tangan legal, stok dan pembayaran bukan transaksi riil. Tidak terhubung ke BPJS maupun SATUSEHAT.</div>'+
 '<div class="panel e2e-toolbar"><label class="form-label">Pasien / Encounter<select id="e2e-encounter" class="form-input">'+opts+'</select></label><label class="form-label">Peran simulasi<select id="e2e-role" class="form-input">'+roles.map(r=>'<option value="'+r[0]+'" '+(role===r[0]?"selected":"")+'>'+esc(r[1])+'</option>').join("")+'</select></label><div><small>'+esc(s?.patient?.mrn||"")+' · '+esc(s?.encounter.payer||"")+'</small><strong>'+progress+' / 5 tahap</strong></div></div>'+
 '<div class="e2e-progress"><span style="width:'+(progress*20)+'%"></span></div><div class="e2e-grid">'+cards+'</div>'+
 '<div class="e2e-detail"><section class="panel"><h2>Charge Ledger · '+esc(s?.encounter.id||"")+'</h2><div class="table-wrap"><table><thead><tr><th>ID</th><th>Uraian</th><th>Jumlah</th></tr></thead><tbody>'+charges.map(ch=>'<tr><td>'+esc(ch.id)+'</td><td>'+esc(ch.source)+'</td><td>'+amount(ch.amount)+'</td></tr>').join("")+'</tbody></table></div><strong>Outstanding: '+amount(s?.balance||0)+'</strong></section>'+
 '<section class="panel"><h2>Event & Record Lineage</h2><ol class="e2e-audit">'+audit.map(a=>'<li><strong>'+esc(a.label)+'</strong> · '+esc(a.detail)+'</li>').join("")+'</ol><div class="e2e-actions"><button class="btn soft" type="button" data-action="e2e-patient">Patient 360</button><button class="btn soft" type="button" data-action="e2e-lineage">Record Lineage</button><button class="btn soft" type="button" data-nav="fhir">FHIR Preview</button></div></section></div>';
}
function action(a,id,node,c){
 if(!a.startsWith("e2e-"))return false;
 const op=a.slice(4),d=c.data,s=inspect(d,c.ui.selectedEncounter);
 if(op==="patient"){if(s){c.ui.selectedPatientId=s.encounter.patientId;c.navigate("patient360");}return true;}
 if(op==="lineage"){c.navigate("journey");return true;}
 if(op==="new"){
  if(!roleOK(c,"new"))return true;
  c.modal("Registrasi Pasien E2E",'<div class="form-grid"><label class="form-label">Pilih Pasien<select class="form-input" name="patientId">'+d.patients.map(p=>'<option value="'+esc(p.id)+'">'+esc(p.mrn+" · "+p.name)+'</option>').join("")+'</select></label><label class="form-label">DPJP<select class="form-input" name="doctor">'+d.practitioners.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.name)+'</option>').join("")+'</select></label>'+field("unit","Poli / Unit","Poli Umum")+field("date","Tanggal","2026-11-01","date")+field("slot","Jam","09:00","time")+'</div>',"e2e-create");return true;
 }
 if(!s){c.notice("Pilih encounter terlebih dahulu.");return true;}
 const active=s.encounter.status==="in-progress";
 if(op==="clinical"){
  if(!roleOK(c,"clinical")||!active||s.soap?.status==="signed")return true;
  c.modal("SOAP, diagnosis dan TTV",'<div class="form-grid">'+["s","o","a","p"].map((k,i)=>'<label class="form-label">'+["Subjective","Objective","Assessment","Plan"][i]+'<textarea name="'+k+'" class="form-input" required>'+esc(s.soap?.[k]||["Keluhan rutin","TTV diperiksa","Hipertensi","Periksa Hb"][i])+'</textarea></label>').join("")+field("dxCode","ICD-10","I10")+field("dxName","Diagnosis","Hipertensi esensial")+field("sbp","Sistolik","120","number",'min="41" max="259"')+field("dbp","Diastolik","80","number",'min="20" max="179"')+'</div>',"e2e-clinical");return true;
 }
 if(op==="sign"){
  if(!roleOK(c,"sign")||!active||s.soap?.status!=="draft"||!s.complete.registration)return true;
  const bp=["8480-6","8462-4"].every(code=>d.observations.some(o=>o.encounterId===s.encounter.id&&o.code===code));
  if(!bp||!d.diagnoses.some(dx=>dx.encounterId===s.encounter.id)){c.notice("Diagnosis dan dua Observation tekanan darah wajib lengkap.");return true;}
  s.soap.status="signed";s.soap.signedAt="demo";c.pushEvent("Composition",s.encounter.id,"cppt.signed");commit(c,"CPPT signed","Status demo; bukan tanda tangan legal");return true;
 }
 if(op==="order"){
  if(!roleOK(c,"order")||!active||!s.complete.clinical||s.lab)return true;
  const o=next(d.orders,"SO"),l=next(d.labs,"LAB");
  d.orders.push({id:o,encounterId:s.encounter.id,type:"Laboratorium",service:"Hemoglobin",priority:"routine",status:"requested"});
  d.labs.push({id:l,orderId:o,accession:"LIS-"+l,status:"pending",specimen:"SP-"+l,test:"Hemoglobin",value:"",unit:"g/dL"});
  d.labStages[l]="ordered";c.pushEvent("ServiceRequest",o,"lab.ordered");commit(c,"Lab order",o+" / "+l);return true;
 }
 if(op==="labnext"){
  if(!roleOK(c,"labnext")||!active||!s.lab)return true;
  const seq=["ordered","collected","received","processing","verified","released"],i=seq.indexOf(s.labs);
  if(i<0||i===3||i===5)return true;
  const nextStep=seq[i+1];d.labStages[s.lab.id]=nextStep;d.specimenEvents.push({labId:s.lab.id,step:nextStep});
  if(nextStep==="released"){s.lab.status="verified";const order=d.orders.find(o=>o.id===s.lab.orderId);if(order)order.status="completed";c.pushEvent("DiagnosticReport",s.lab.id,"lab.released");}
  commit(c,"LIS "+nextStep,s.lab.id);return true;
 }
 if(op==="verify"){
  if(!roleOK(c,"verify")||!active||s.labs!=="processing")return true;
  c.modal("Verifikasi Hb",field("result","Hb (g/dL)","13.5","number",'min="0.1" max="30" step="0.1"'),"e2e-verify");return true;
 }
 if(op==="rx"){
  if(!roleOK(c,"rx")||!active||!s.complete.lab||s.rx)return true;
  c.modal("Resep elektronik",'<label class="form-label">Obat<select class="form-input" name="medication">'+d.stock.filter(x=>x.item!=="Spuit 3 mL").map(x=>'<option>'+esc(x.item)+'</option>').join("")+'</select></label>'+field("quantity","Jumlah tablet","5","number",'min="1" max="999"'),"e2e-rx");return true;
 }
 if(op==="rxverify"){
  if(!roleOK(c,"rxverify")||!active||!s.complete.lab||!["prescribed","waiting"].includes(s.rxs))return true;
  d.rxStages[s.rx.id]="verified";commit(c,"Resep diverifikasi",s.rx.id);return true;
 }
 if(op==="dispense"){
  if(!roleOK(c,"dispense")||!active||!s.complete.lab||s.rxs!=="verified")return true;
  const lots=d.stock.filter(x=>x.item===s.rx.medication);
  c.modal("Dispensing & ledger stok",'<label class="form-label">Lot<select class="form-input" name="stockId">'+lots.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.lot+" · "+x.qty+" tersedia · ED "+x.expiry)+'</option>').join("")+'</select></label>',"e2e-dispense");return true;
 }
 if(op==="pay"){
  if(!roleOK(c,"pay")||!active||!s.complete.lab||!s.complete.pharmacy||s.balance<=0)return true;
  c.modal("Pembayaran kasir",'<p>Outstanding: '+amount(s.balance)+'</p>'+field("payment","Jumlah bayar",""+s.balance,"number",'min="1" step="1"')+'<label class="form-label">Metode<select name="method" class="form-input"><option>QRIS</option><option>Tunai</option><option>Transfer</option></select></label>',"e2e-pay");return true;
 }
 if(op==="close"){
  if(!roleOK(c,"close")||!active||!s.done){c.notice("Selesaikan lima tahap dan tagihan terlebih dahulu.");return true;}
  s.encounter.status="finished";c.pushEvent("Encounter",s.encounter.id,"encounter.finished");commit(c,"Encounter selesai",s.encounter.id);return true;
 }
 return true;
}
function submit(kind,form,c){
 if(!kind.startsWith("e2e-"))return false;
 const op=kind.slice(4),d=c.data,s=inspect(d,c.ui.selectedEncounter),val=x=>String(form.get(x)??"").trim();
 if(op==="create"){
  if(!roleOK(c,"new"))return true;
  const p=d.patients.find(x=>x.id===val("patientId")),doc=d.practitioners.find(x=>x.id===val("doctor")),date=val("date"),slot=val("slot"),unit=val("unit");
  if(!p||!doc||!unit||!/^20\d{2}-\d\d-\d\d$/.test(date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(slot)){c.notice("Isian pendaftaran tidak valid.");return true;}
  const eid="E-"+String(Math.max(1000,...d.encounters.map(x=>Number(x.id.match(/^E-(\d+)$/)?.[1]||0)))+1),aid=next(d.appointments,"APT"),qid=next(d.queue,"Q"),reg=next(d.e2eRegistrations,"REG");
  d.appointments.push({id:aid,patientId:p.id,type:"Rawat Jalan",unit,date,slot,doctor:doc.id,status:"checked-in"});
  d.queue.push({id:qid,appointmentId:aid,patientId:p.id,number:"A-"+String(d.queue.length+13).padStart(3,"0"),status:"waiting"});
  d.encounters.push({id:eid,patientId:p.id,date,type:"Rawat Jalan",unit,doctor:doc.id,status:"in-progress",payer:p.payer});
  d.e2eRegistrations.push({id:reg,encounterId:eid,patientId:p.id,appointmentId:aid,queueId:qid});
  c.ui.selectedEncounter=eid;c.pushEvent("Encounter",eid,"encounter.created");c.closeModal();commit(c,"Registrasi",reg+" / "+aid+" / "+qid);return true;
 }
 if(!s||s.encounter.status!=="in-progress"){c.notice("Encounter tidak aktif.");return true;}
 if(op==="clinical"){
  if(!roleOK(c,"clinical")||s.soap?.status==="signed")return true;
  const parts=["s","o","a","p"].map(val),code=val("dxCode").toUpperCase(),name=val("dxName"),sbp=Number(val("sbp")),dbp=Number(val("dbp"));
  if(parts.some(x=>!x)||!name||!/^[A-Z][0-9]{2}(\.[0-9A-Z]{1,4})?$/.test(code)||!Number.isInteger(sbp)||!Number.isInteger(dbp)||sbp<=dbp||sbp>259||dbp<20){c.notice("SOAP/ICD-10/TTV tidak valid.");return true;}
  d.soapRecords[s.encounter.id]={s:parts[0],o:parts[1],a:parts[2],p:parts[3],status:"draft",author:s.encounter.doctor};
  const previous=d.e2eClinical[s.encounter.id];
  if(previous){
   const dx=d.diagnoses.find(x=>x.id===previous.dx);if(dx){dx.code=code;dx.name=name;}
   const o1=d.observations.find(x=>x.id===previous.sbp),o2=d.observations.find(x=>x.id===previous.dbp);
   if(o1)o1.value=sbp;if(o2)o2.value=dbp;
  }else{
   const dx=next(d.diagnoses,"DX");d.diagnoses.push({id:dx,encounterId:s.encounter.id,code,name});
   const a=next(d.observations,"OBS");d.observations.push({id:a,encounterId:s.encounter.id,code:"8480-6",name:"Tekanan darah sistolik",value:sbp,unit:"mm[Hg]",time:"Demo"});
   const b=next(d.observations,"OBS");d.observations.push({id:b,encounterId:s.encounter.id,code:"8462-4",name:"Tekanan darah diastolik",value:dbp,unit:"mm[Hg]",time:"Demo"});
   d.e2eClinical[s.encounter.id]={dx,sbp:a,dbp:b};
   c.pushEvent("Condition",dx,"diagnosis.created");c.pushEvent("Observation",a,"vital.created");c.pushEvent("Observation",b,"vital.created");
  }
  c.closeModal();commit(c,"RME draft","SOAP + ICD-10 + 2 Observation LOINC");return true;
 }
 if(op==="verify"){
  if(!roleOK(c,"verify")||s.labs!=="processing"||!s.lab)return true;
  const hb=Number(val("result"));if(!Number.isFinite(hb)||hb<=0||hb>30){c.notice("Nilai Hb tidak valid.");return true;}
  s.lab.value=String(hb);s.lab.status="verified";d.labStages[s.lab.id]="verified";d.specimenEvents.push({labId:s.lab.id,step:"verified"});
  const oid="LR-"+s.lab.id;s.lab.resultObservationId=oid;
  if(!d.observations.some(x=>x.id===oid))d.observations.push({id:oid,encounterId:s.encounter.id,code:"718-7",name:"Hemoglobin",value:hb,unit:"g/dL",time:"Demo"});
  if(!d.charges.some(ch=>ch.source.includes(s.lab.id))){d.charges.push({id:next(d.charges,"CH"),encounterId:s.encounter.id,source:s.lab.id+" · Hemoglobin",amount:95000});c.ensureInvoice(s.encounter.id);}
  c.pushEvent("Observation",oid,"lab.observation.verified");c.pushEvent("DiagnosticReport",s.lab.id,"lab.verified");
  c.closeModal();commit(c,"Verifikasi LIS",s.lab.id+" · "+hb+" g/dL");return true;
 }
 if(op==="rx"){
  if(!roleOK(c,"rx")||!s.complete.lab||s.rx)return true;
  const med=val("medication"),qty=Number(val("quantity"));
  if(!d.stock.some(x=>x.item===med)||!Number.isInteger(qty)||qty<1||qty>999){c.notice("Obat/jumlah tidak valid.");return true;}
  const rid=next(d.prescriptions,"RX");d.prescriptions.push({id:rid,encounterId:s.encounter.id,medication:med,quantity:qty,status:"waiting"});d.rxStages[rid]="prescribed";
  c.pushEvent("MedicationRequest",rid,"prescription.created");c.closeModal();commit(c,"E-resep",rid+" · "+med);return true;
 }
 if(op==="dispense"){
  if(!roleOK(c,"dispense")||!s.complete.lab||s.rxs!=="verified")return true;
  const stock=d.stock.find(x=>x.id===val("stockId"));
  if(!stock||stock.item!==s.rx.medication||stock.qty<s.rx.quantity||stock.expiry<"2026-11-01"){c.notice("Lot, jumlah atau kedaluwarsa tidak valid.");return true;}
  stock.qty-=s.rx.quantity;s.rx.status="dispensed";d.rxStages[s.rx.id]="dispensed";
  d.movements.unshift({id:next(d.movements,"MV"),stockId:stock.id,delta:-s.rx.quantity,ref:s.rx.id,reason:"Dispensing"});
  if(!d.charges.some(ch=>ch.encounterId===s.encounter.id&&ch.source==="RX · "+s.rx.medication)){d.charges.push({id:next(d.charges,"CH"),encounterId:s.encounter.id,source:"RX · "+s.rx.medication,amount:75000});c.ensureInvoice(s.encounter.id);}
  c.pushEvent("MedicationDispense",s.rx.id,"pharmacy.dispensed");c.closeModal();commit(c,"Dispensing",s.rx.id+" · "+stock.lot);return true;
 }
 if(op==="pay"){
  if(!roleOK(c,"pay")||!s.complete.lab||!s.complete.pharmacy||!s.invoice)return true;
  const payment=Number(val("payment")),method=val("method");
  if(!Number.isInteger(payment)||payment<=0||payment>s.balance||!["QRIS","Tunai","Transfer"].includes(method)){c.notice("Pembayaran tidak valid atau melebihi outstanding.");return true;}
  const pid=next(d.payments,"PAY");d.payments.push({id:pid,method,amount:payment,recordedAt:"demo"});
  d.paymentAllocations.push({id:next(d.paymentAllocations,"PAL"),invoiceId:s.invoice.id,paymentId:pid,amount:payment});
  s.invoice.status=payment===s.balance?"paid":"partial";c.closeModal();commit(c,"Pembayaran",pid+" · "+amount(payment));return true;
 }
 return true;
}
window.SIMRS_CARE_JOURNEY={init,inspect,render,action,submit};
})();