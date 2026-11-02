(function(){
"use strict";
// Executable DESIGN DEMO ONLY. No BPJS/SATUSEHAT calls, financial postings, RBAC, or real master data.
const esc=v=>String(v==null?"":v).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const validCode=v=>/^[A-Z0-9][A-Z0-9_-]{1,29}$/.test(v);
const clean=v=>String(v==null?"":v).trim();
const next=(rows,prefix)=>prefix+"-"+String(Math.max(0,...rows.map(x=>Number(String(x.id).split("-").at(-1))||0))+1).padStart(3,"0");
const money=n=>"Rp "+Number(n||0).toLocaleString("id-ID");
function init(d){
 if(!d.designWorkflows)d.designWorkflows={
  units:[
   {id:"UNIT-001",code:"POLI-PD",name:"Poli Penyakit Dalam",status:"active"},
   {id:"UNIT-002",code:"IGD",name:"Instalasi Gawat Darurat",status:"active"},
   {id:"UNIT-003",code:"MELATI",name:"Ruang Melati",status:"active"}],
  services:[{id:"SVC-001",code:"KONSUL-PD",name:"Konsultasi Penyakit Dalam",price:150000,unitId:"UNIT-001"}],
  assignments:[{id:"ASN-001",practitionerId:"PR-01",unitId:"UNIT-001"}],
  beds:[{id:"BED-001",code:"MELATI-01",unitId:"UNIT-003",status:"available"}],
  referrals:[],claims:[]
 };
 for(const key of ["units","services","assignments","beds","referrals","claims"]){
  if(!Array.isArray(d.designWorkflows[key]))d.designWorkflows[key]=[];
 }
}
const store=d=>(init(d),d.designWorkflows);
const label=(options,id)=>options.find(x=>x.id===id)?.name||id;
const result=(c,message)=>{c.save();c.render();c.notice(message)};
const error=(c,message)=>{c.notice(message);return true};
const opt=(id,label)=>'<option value="'+esc(id)+'">'+esc(label)+'</option>';
const rows=(headers,items)=>'<div class="table-wrap"><table><thead><tr>'+headers.map(x=>'<th>'+esc(x)+'</th>').join("")+'</tr></thead><tbody>'+items.join("")+'</tbody></table></div>';
const tr=cells=>'<tr>'+cells.map(x=>'<td>'+x+'</td>').join("")+'</tr>';
const field=(name,title,placeholder="")=>'<label class="form-label">'+esc(title)+'<input class="form-input" name="'+name+'" placeholder="'+esc(placeholder)+'" required maxlength="120"></label>';
const select=(name,title,options)=>'<label class="form-label">'+esc(title)+'<select class="form-input" name="'+name+'" required>'+options.join("")+'</select></label>';
const form=(kind,content,submitText)=>'<form data-form="'+kind+'" class="panel" style="padding:18px;margin-bottom:16px"><div class="grid cols2">'+content+'</div><button class="btn primary" type="submit" style="margin-top:12px">'+submitText+'</button></form>';
function master(d,c){
 const a=store(d),unitOpts=a.units.filter(x=>x.status==="active").map(x=>opt(x.id,x.code+" · "+x.name));
 const docOpts=d.practitioners.map(x=>opt(x.id,x.name));
 return c.pageHead("MASTER DATA / DESIGN DEMO","Master Fasilitas, Tarif & Bed","CRUD contoh dengan validasi kode unik dan referensi unit; tidak menulis ke master rumah sakit.")+
 '<section class="panel" style="margin-bottom:16px;padding:18px"><strong>Kontrak desain:</strong> unit layanan menjadi FK untuk layanan, penugasan tenaga kesehatan dan bed. Penghapusan data terpakai, tarif historis, approval dan audit belum tersedia di demo.</section>'+
 form("dw-unit",field("code","Kode unit","Contoh: POLI-JANTUNG")+field("name","Nama unit","Poli Jantung"),"Tambah unit")+
 rows(["Kode unit","Nama","Status"],a.units.map(x=>tr([esc(x.code),esc(x.name),esc(x.status)])))+
 '<h2 style="margin:22px 0 10px">Katalog layanan dan tarif</h2>'+
 form("dw-service",field("code","Kode layanan","KONSUL-JANTUNG")+field("name","Nama layanan","Konsultasi jantung")+field("price","Tarif demo (Rp)","100000")+select("unitId","Unit pelaksana",unitOpts),"Tambah layanan")+
 rows(["Kode","Layanan","Unit","Tarif"],a.services.map(x=>tr([esc(x.code),esc(x.name),esc(label(a.units,x.unitId)),money(x.price)])))+
 '<h2 style="margin:22px 0 10px">Penugasan practitioner ke unit</h2>'+
 form("dw-assign",select("practitionerId","Dokter / tenaga medis",docOpts)+select("unitId","Unit",unitOpts),"Tambah penugasan")+
 rows(["Practitioner","Unit"],a.assignments.map(x=>tr([esc(label(d.practitioners,x.practitionerId)),esc(label(a.units,x.unitId))])))+
 '<h2 style="margin:22px 0 10px">Bed master (bukan bed assignment pasien)</h2>'+
 form("dw-bed",field("code","Kode bed","MELATI-02")+select("unitId","Lokasi unit",unitOpts),"Tambah bed")+
 rows(["Kode bed","Unit","Status"],a.beds.map(x=>tr([esc(x.code),esc(label(a.units,x.unitId)),esc(x.status)])));
}
function referral(d,c){
 const a=store(d),available=d.encounters.filter(x=>x.status==="in-progress");
 const en=available.map(x=>opt(x.id,x.id+" · "+x.type+" · "+(d.patients.find(p=>p.id===x.patientId)?.name||"")));
 const status=x=>x==="requested"?"Menunggu respons":x==="accepted"?"Diterima":"Ditolak";
 return c.pageHead("RUJUKAN / DESIGN DEMO","Rujukan Internal & Eksternal","Simulasi permintaan serta keputusan diterima/ditolak, terikat Encounter aktif. Bukan transaksi SATUSEHAT Rujukan.")+
 '<section class="panel" style="padding:18px;margin-bottom:16px"><strong>Kontrak desain:</strong> permintaan membutuhkan Encounter aktif, tujuan dan alasan. Keputusan hanya sekali dari status requested. Untuk produksi diperlukan identitas faskes tujuan, persetujuan, validasi wilayah/strata, consent, dan Task/ServiceRequest/CarePlan sesuai skenario.</section>'+
 (available.length?form("dw-referral",select("encounterId","Encounter aktif",en)+field("destination","Tujuan rujukan (label demo)","RS Tujuan Demo")+field("reason","Indikasi / alasan (min. 8 karakter)","Butuh pelayanan lanjutan"),"Buat permintaan rujukan"):'<div class="panel" style="padding:18px">Tidak ada Encounter aktif untuk dirujuk.</div>')+
 rows(["ID","Encounter","Tujuan / alasan","Status","Aksi"],a.referrals.map(x=>tr([
 esc(x.id),esc(x.encounterId),esc(x.destination)+"<small style=\"display:block\">"+esc(x.reason)+"</small>",esc(status(x.status)),
 x.status==="requested"?'<button class="btn soft small" data-action="dw-referral-accept" data-id="'+esc(x.id)+'">Terima (demo)</button> <button class="btn soft small" data-action="dw-referral-reject" data-id="'+esc(x.id)+'">Tolak (demo)</button>':"Final (tidak dapat diubah)"
 ])));
}
function claimChecks(d,id){
 const e=d.encounters.find(x=>x.id===id);
 const charges=d.charges.filter(x=>x.encounterId===id);
 const amount=charges.reduce((n,x)=>n+Number(x.amount||0),0);
 const checks=[
  {code:"encounter",label:"Encounter tersedia dan finished",ok:!!e&&e.status==="finished"},
  {code:"payer",label:"Penjamin encounter BPJS",ok:!!e&&e.payer==="BPJS"},
  {code:"diagnosis",label:"Diagnosis klinis terkait encounter tersedia",ok:d.diagnoses.some(x=>x.encounterId===id)},
  {code:"charge",label:"Charge positif terkait encounter tersedia",ok:amount>0}
 ];
 return {checks,passed:checks.every(x=>x.ok),amount};
}
function claims(d,c){
 const a=store(d),opts=d.encounters.map(x=>opt(x.id,x.id+" · "+x.payer+" · "+x.status));
 const checkRows=a.claims.map(x=>{const chk=claimChecks(d,x.encounterId);
  const actions=x.status==="draft"?'<button class="btn primary small" data-action="dw-claim-validate" data-id="'+esc(x.id)+'">Validasi</button>':x.status==="validated"?'<button class="btn primary small" data-action="dw-claim-submit" data-id="'+esc(x.id)+'">Ajukan (demo)</button>':x.status==="submitted"?'<button class="btn soft small" data-action="dw-claim-return" data-id="'+esc(x.id)+'">Simulasikan retur</button>':'<button class="btn soft small" data-action="dw-claim-revise" data-id="'+esc(x.id)+'">Revisi draft</button>';
  return tr([esc(x.id),esc(x.encounterId),money(chk.amount),esc(x.status),chk.checks.map(k=>(k.ok?"✓ ":"✕ ")+esc(k.label)).join("<div></div>"),actions]);
 });
 return c.pageHead("BPJS / CASEMIX / DESIGN DEMO","Workbench Kesiapan Klaim","Checklist diagnosis, encounter dan charge sebelum pengajuan. Tidak melakukan grouping INA-CBG, penerbitan SEP, bridging, maupun submission BPJS.")+
 '<section class="panel" style="padding:18px;margin-bottom:16px"><strong>Kontrak desain:</strong> validasi kelengkapan data adalah gate lokal, bukan keputusan penjamin. Nilai charge bukan tarif klaim INA-CBG. Pengajuan, retur dan revisi hanya state-machine sintetis. SEP, grouping, kode ICD, berkas, dan audit versi diperlukan sebelum produksi.</section>'+
 form("dw-claim",select("encounterId","Encounter untuk draft klaim",opts),"Buat draft klaim")+
 rows(["ID","Encounter","Charge","State","Checklist validasi","Aksi"],checkRows);
}
function render(page,c){
 if(page==="master-data")return master(c.data,c);
 if(page==="referrals")return referral(c.data,c);
 if(page==="claims")return claims(c.data,c);
 return null;
}
function submit(kind,values,c){
 if(!kind.startsWith("dw-"))return false;
 const d=c.data,a=store(d),get=k=>clean(values.get(k)),code=get("code").toUpperCase();
 if(kind==="dw-unit"){
  if(!validCode(code)||get("name").length<3)return error(c,"Kode tidak valid atau nama unit terlalu pendek.");
  if(a.units.some(x=>x.code===code))return error(c,"Kode unit sudah digunakan.");
  a.units.push({id:next(a.units,"UNIT"),code,name:get("name"),status:"active"});
  return result(c,"Unit demo ditambahkan.");
 }
 if(kind==="dw-service"){
  const price=Number(get("price"));
  if(!validCode(code)||get("name").length<3||!Number.isSafeInteger(price)||price<0||!a.units.some(x=>x.id===get("unitId")&&x.status==="active"))return error(c,"Kode, tarif, nama atau referensi unit tidak valid.");
  if(a.services.some(x=>x.code===code))return error(c,"Kode layanan sudah digunakan.");
  a.services.push({id:next(a.services,"SVC"),code,name:get("name"),price,unitId:get("unitId")});
  return result(c,"Layanan/tarif demo ditambahkan.");
 }
 if(kind==="dw-assign"){
  const practitionerId=get("practitionerId"),unitId=get("unitId");
  if(!d.practitioners.some(x=>x.id===practitionerId)||!a.units.some(x=>x.id===unitId&&x.status==="active"))return error(c,"Referensi tenaga kesehatan atau unit tidak ditemukan.");
  if(a.assignments.some(x=>x.practitionerId===practitionerId&&x.unitId===unitId))return error(c,"Penugasan sudah ada.");
  a.assignments.push({id:next(a.assignments,"ASN"),practitionerId,unitId});
  return result(c,"Penugasan demo ditambahkan.");
 }
 if(kind==="dw-bed"){
  if(!validCode(code)||!a.units.some(x=>x.id===get("unitId")&&x.status==="active"))return error(c,"Kode bed atau unit tidak valid.");
  if(a.beds.some(x=>x.code===code))return error(c,"Kode bed sudah digunakan.");
  a.beds.push({id:next(a.beds,"BED"),code,unitId:get("unitId"),status:"available"});
  return result(c,"Bed master demo ditambahkan.");
 }
 if(kind==="dw-referral"){
  const encounterId=get("encounterId"),destination=get("destination"),reason=get("reason"),e=d.encounters.find(x=>x.id===encounterId);
  if(!e||e.status!=="in-progress"||destination.length<3||destination.length>120||reason.length<8||reason.length>120)return error(c,"Rujukan memerlukan encounter aktif, tujuan dan alasan yang valid.");
  if(a.referrals.some(x=>x.encounterId===encounterId&&x.destination.toLowerCase()===destination.toLowerCase()&&x.status!=="rejected"))return error(c,"Rujukan aktif/diterima ke tujuan tersebut sudah ada.");
  a.referrals.push({id:next(a.referrals,"REF"),encounterId,destination,reason,status:"requested"});
  return result(c,"Permintaan rujukan demo dibuat.");
 }
 if(kind==="dw-claim"){
  const encounterId=get("encounterId");
  if(!d.encounters.some(x=>x.id===encounterId))return error(c,"Encounter tidak ditemukan.");
  if(a.claims.some(x=>x.encounterId===encounterId))return error(c,"Draft klaim untuk encounter tersebut sudah ada.");
  a.claims.push({id:next(a.claims,"CLM"),encounterId,status:"draft",revision:1});
  return result(c,"Draft klaim demo dibuat. Periksa checklist.");
 }
 return false;
}
function action(kind,id,node,c){
 if(!kind.startsWith("dw-"))return false;
 const a=store(c.data);
 if(kind==="dw-referral-accept"||kind==="dw-referral-reject"){
  const r=a.referrals.find(x=>x.id===id);
  if(!r||r.status!=="requested")return error(c,"Rujukan sudah final atau tidak ditemukan.");
  r.status=kind==="dw-referral-accept"?"accepted":"rejected";return result(c,"Status rujukan demo diperbarui.");
 }
 const claim=a.claims.find(x=>x.id===id);
 if(!claim)return error(c,"Klaim demo tidak ditemukan.");
 if(kind==="dw-claim-validate"){
  if(claim.status!=="draft")return error(c,"Hanya draft yang dapat divalidasi.");
  const checks=claimChecks(c.data,claim.encounterId);
  if(!checks.passed)return error(c,"Validasi ditolak: lengkapi prasyarat encounter, BPJS, diagnosis, charge.");
  claim.status="validated";return result(c,"Kelengkapan draft klaim demo tervalidasi.");
 }
 if(kind==="dw-claim-submit"){
  if(claim.status!=="validated"||!claimChecks(c.data,claim.encounterId).passed)return error(c,"Pengajuan ditolak: status/checklist tidak valid.");
  claim.status="submitted";return result(c,"Status pengajuan demo dicatat. Tidak ada permintaan ke BPJS.");
 }
 if(kind==="dw-claim-return"){
  if(claim.status!=="submitted")return error(c,"Hanya klaim diajukan yang dapat diretur.");
  claim.status="returned";return result(c,"Klaim demo diretur untuk revisi.");
 }
 if(kind==="dw-claim-revise"){
  if(claim.status!=="returned")return error(c,"Hanya klaim retur yang dapat direvisi.");
  claim.status="draft";claim.revision=(claim.revision||1)+1;return result(c,"Draft versi baru dibuat; perlu validasi ulang.");
 }
 return false;
}
window.SIMRS_DESIGN_WORKFLOWS={init,render,submit,action,claimChecks};
})();