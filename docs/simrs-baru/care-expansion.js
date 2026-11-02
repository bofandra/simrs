(function(){
"use strict";
// Purely synthetic administrative workflow examples: NOT clinical clearance, medical advice,
// transfusion matching, dispensing, billing, legal signing, or actual patient-care actions.
const esc=x=>String(x==null?"":x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const defs={
 "hemodialysis":{name:"Hemodialisis",phases:["Permintaan dicatat","Penjadwalan didokumentasikan","Checklist pra-sesi dicatat","Sesi terdokumentasi","Review administratif selesai"],description:"Contoh dokumentasi jadwal dan sesi, bukan penilaian kelayakan dialisis."},
 "rehabilitation":{name:"Rehabilitasi Medik",phases:["Permintaan dicatat","Asesmen terdokumentasi","Rencana latihan dicatat","Sesi terapi dicatat","Evaluasi administratif selesai"],description:"Tidak menetapkan program terapi maupun menentukan indikasi klinis."},
 "mcu":{name:"Medical Check Up",phases:["Pendaftaran MCU","Paket pemeriksaan dicatat","Item pemeriksaan didokumentasikan","Draft laporan dibuat","Review administratif selesai"],description:"Bukan hasil pemeriksaan atau surat keterangan sehat yang sah."},
 "blood":{name:"Bank Darah & Transfusi",phases:["Permintaan tercatat","Sampel administratif tercatat","Pemeriksaan kompatibilitas: status dokumentasi","Verifikasi dokumen dicatat","Administrasi selesai"],description:"Tidak melakukan crossmatch, mengesahkan kompatibilitas, me-release darah, atau mengeksekusi transfusi."}
};
const modeLabels={"Rawat Jalan":"Rawat Jalan","IGD":"IGD","Rawat Inap":"Rawat Inap"};
const typePages={"hemodialysis":"hemodialysis","rehabilitation":"rehabilitation","mcu":"mcu","blood":"blood-bank"};
function init(d){
 if(!d.careExpansion||typeof d.careExpansion!=="object")d.careExpansion={care:{},specialties:[]};
 if(!d.careExpansion.care||typeof d.careExpansion.care!=="object")d.careExpansion.care={};
 if(!Array.isArray(d.careExpansion.specialties))d.careExpansion.specialties=[];
}
const state=d=>(init(d),d.careExpansion);
const fail=(c,msg)=>{c.notice(msg);return true};
const ok=(c,msg)=>{c.save();c.render();c.notice(msg);return true};
const patient=(d,enc)=>d.patients.find(x=>x.id===enc.patientId)?.name||"Pasien demo";
const panel=(title,content)=>'<section class="panel" style="padding:18px;margin:0 0 16px"><h2 style="margin-bottom:12px">'+title+'</h2>'+content+'</section>';
const td=items=>'<div class="table-wrap"><table><tbody>'+items.map(x=>'<tr><th>'+esc(x[0])+'</th><td>'+esc(x[1])+'</td></tr>').join("")+'</tbody></table></div>';
const btn=(action,id,title,kind="soft")=>'<button type="button" class="btn '+kind+' small" data-action="'+action+'" data-id="'+esc(id)+'">'+esc(title)+'</button>';
const opts=(arr,choose)=>arr.map(x=>'<option value="'+esc(x.id)+'" '+(x.id===choose?"selected":"")+'>'+esc(x.label)+'</option>').join("");
function careSteps(type){
 if(type==="Rawat Jalan")return ["Registrasi kunjungan","Asesmen dan pencatatan RME","Verifikasi dokumentasi","Selesai simulasi pelayanan"];
 if(type==="IGD")return ["Kedatangan IGD","Triase terdokumentasi","Observasi administratif","Keputusan disposisi"];
 return ["Admission","Penempatan bed","Asuhan terdokumentasi","Persiapan discharge","Selesai simulasi rawat inap"];
}
function careRender(c){
 const d=c.data,u=c.ui,all=state(d),types=Object.keys(modeLabels);
 if(!types.includes(u.careMode))u.careMode="Rawat Jalan";
 const selected=d.encounters.filter(e=>e.type===u.careMode);
 if(!selected.some(x=>x.id===u.careEncounter))u.careEncounter=selected[0]?.id||"";
 const enc=selected.find(e=>e.id===u.careEncounter);
 const a=enc?all.care[enc.id]:null;
 const steps=careSteps(u.careMode);
 const tabs=types.map(t=>btn("cfx-mode",t,t,u.careMode===t?"primary":"soft")).join(" ");
 let content=panel("Pilih konteks pelayanan",'<div class="cfx-actions">'+tabs+'</div><p class="cfx-muted">Gunakan data encounter sintetis yang sama dengan Patient 360/RME. Status workflow di sini tidak menutup encounter asli atau membuat billing.</p>');
 content+=panel("Daftar encounter "+esc(u.careMode),
  '<div class="cfx-actions">'+selected.map(e=>btn("cfx-select",e.id,e.id+" · "+patient(d,e),u.careEncounter===e.id?"primary":"soft")).join("")+'</div>');
 if(!enc)return c.pageHead("RME / PENDALAMAN WORKFLOW","RJ / IGD / RI — Skenario Pelayanan","Tidak ada contoh encounter untuk mode ini.")+content;
 content+=panel("Jejak data",
  td([["Encounter",enc.id],["Pasien",patient(d,enc)],["Konteks",enc.type],["Status encounter existing",enc.status],["DPJP",d.practitioners.find(p=>p.id===enc.doctor)?.name||"—"],["Status simulasi",a?steps[a.step]:"Belum dimulai"]])+
  '<div class="cfx-actions">'+btn("cfx-open-rme",enc.id,"Buka RME terkait")+
  btn("cfx-open-db",enc.id,"Lihat database")+'</div>');
 if(!a){
  content+=panel("Mulai skenario","<p>Simulasi alur perawatan dipisahkan dari state Encounter existing agar tidak mengubah klaim, stok atau discharge nyata.</p>"+btn("cfx-start",enc.id,"Mulai alur "+enc.type,"primary"));
 }else{
  content+=panel("State & validasi",'<ol class="cfx-stages">'+steps.map((step,i)=>'<li class="'+(i===a.step?"current":"")+'"><strong>'+esc(step)+'</strong><small>'+(i<a.step?"Dilewati":i===a.step?"Tahap aktif":"Belum dimulai")+'</small></li>').join("")+'</ol>');
  if(u.careMode==="Rawat Jalan"&&a.step<3){
   content+=panel("Tindakan administratif",'<p>Penutupan simulasi membutuhkan diagnosis dan RME yang telah ditandai signed pada data demo.</p>'+btn("cfx-next",enc.id,"Lanjut tahap", "primary"));
  }
  if(u.careMode==="IGD"&&a.step<3){
   content+=panel("Tindakan administratif",'<p>Transisi kedatangan ke triase hanya bila catatan triase demo tersedia. Tidak menggantikan asesmen klinis.</p>'+btn("cfx-next",enc.id,"Lanjut tahap","primary"));
  }
  if(u.careMode==="IGD"&&a.step===3&&!a.disposition){
   content+=panel("Pilih disposisi demo",'<p>Keputusan administratif ilustratif saja; tidak membuat admission, rujukan, atau discharge nyata.</p><div class="cfx-actions">'+["discharge","admit","refer"].map(x=>btn("cfx-disposition",enc.id+"|"+x,{"discharge":"Pulang (demo)","admit":"Rawat inap (demo)","refer":"Rujuk (demo)"}[x],"primary")).join("")+'</div>');
  }
  if(u.careMode==="Rawat Inap"&&a.step<4){
   const beds=(d.designWorkflows?.beds||[]).filter(b=>b.status==="available"||b.id===a.bedId).map(b=>({id:b.id,label:b.code+" · "+b.status}));
   content+=panel("Bed master dan pindah bed",
    '<p>Penempatan berdasar bed master simulasi, bukan sensus bed RS. Satu bed tidak dapat dipakai dua alur secara bersamaan.</p>'+
    (beds.length?'<form data-form="cfx-bed" class="cfx-form"><input type="hidden" name="encounterId" value="'+esc(enc.id)+'"><select class="form-input" name="bedId" required>'+opts(beds,a.bedId)+'</select><button class="btn soft" type="submit">'+(a.bedId?"Pindahkan bed demo":"Tempatkan bed demo")+'</button></form>':'<p>Tidak ada bed demo tersedia.</p>')+
    (a.bedId?'<p>Bed terpilih: '+esc((d.designWorkflows?.beds||[]).find(b=>b.id===a.bedId)?.code||a.bedId)+'</p>':""));
   content+=panel("Tahap rawat inap",'<p>Asuhan terdokumentasi adalah keberadaan nursing note sintetis; bukan penilaian kelayakan discharge.</p>'+btn("cfx-next",enc.id,"Lanjut tahap","primary"));
  }
  if(a.step===steps.length-1&&(u.careMode!=="IGD"||a.disposition))content+=panel("Hasil",'<strong>'+esc(a.disposition?"Disposisi: "+a.disposition:"Alur administrasi demo selesai")+'</strong><p>Data klinis dan encounter utama tidak diubah oleh skenario ini.</p>');
  content+=panel("Jejak perubahan demo",'<ol class="cfx-history">'+a.history.map(h=>'<li>'+esc(h)+'</li>').join("")+'</ol>');
 }
 return c.pageHead("RME / WORKFLOW SETTING / DATA SINTETIS","Rawat Jalan, IGD & Rawat Inap","Detail alur administratif yang dapat diuji, terikat Encounter yang sudah ada. Tidak membuat keputusan medis.")+content;
}
function specialtyRender(page,c){
 const type=Object.keys(typePages).find(x=>typePages[x]===page);if(!type)return null;
 const d=c.data,u=c.ui,def=defs[type],a=state(d);
 const encounters=d.encounters.filter(e=>e.status==="in-progress");
 const cases=a.specialties.filter(x=>x.type===type);
 let content=panel("Batasan simulasi",'<p>'+esc(def.description)+' Tidak ada order, charge, inventory, persediaan darah, diagnosis klinis ataupun dokumen sah yang dihasilkan.</p>');
 const options=encounters.map(x=>({id:x.id,label:x.id+" · "+x.type+" · "+patient(d,x)}));
 if(options.length)content+=panel("Buat episode layanan",'<form data-form="cfx-specialty-start" class="cfx-form"><input type="hidden" name="type" value="'+type+'"><select class="form-input" name="encounterId" required>'+opts(options,"")+'</select><button class="btn primary" type="submit">Tambah episode demo</button></form>');
 else content+=panel("Buat episode layanan","<p>Tidak ada encounter aktif.</p>");
 if(!cases.length)content+=panel("Episode yang tercatat","<p>Belum ada episode. Pilih encounter demo untuk melihat transisi administrasi.</p>");
 for(const x of cases){
  const enc=d.encounters.find(e=>e.id===x.encounterId),current=x.cancelled?"Dibatalkan":def.phases[x.step];
  content+=panel(esc(x.id)+" · "+esc(enc?.id||x.encounterId),
   '<p class="cfx-muted">Pasien demo: '+esc(enc?patient(d,enc):"—")+'</p>'+
   '<div class="cfx-stages">'+def.phases.map((p,i)=>'<div class="cfx-step '+(i===x.step?"current":"")+'">'+(i+1)+". "+esc(p)+(i<x.step?" ✓":"")+'</div>').join("")+'</div>'+
   '<p>Status: <strong>'+esc(current)+'</strong></p>'+
   (!x.cancelled&&x.step<def.phases.length-1?btn("cfx-specialty-next",x.id,"Catat tahap berikutnya","primary"):"")+
   (!x.cancelled&&x.step<def.phases.length-1?'<form data-form="cfx-specialty-cancel" class="cfx-form" style="margin-top:12px"><input type="hidden" name="caseId" value="'+esc(x.id)+'"><input name="reason" class="form-input" minlength="8" maxlength="120" placeholder="Alasan pembatalan (min. 8 karakter)" required><button type="submit" class="btn soft">Batalkan episode</button></form>':"")+
   (x.cancelled?'<p>Alasan: '+esc(x.cancelReason||"")+'</p>':"")+
   '<details><summary>Jejak perubahan</summary><ol>'+x.history.map(t=>'<li>'+esc(t)+'</li>').join("")+'</ol></details>'
  );
 }
 return c.pageHead("LAYANAN SPESIALISTIK / SKENARIO ADMINISTRATIF",def.name,"State-machine dan data lineage sintetis; belum ada integrasi alat maupun verifikasi klinis.")+content;
}
function render(page,c){
 if(page==="care-settings")return careRender(c);
 if(Object.values(typePages).includes(page))return specialtyRender(page,c);
 return null;
}
function advanceCare(d,x){
 const e=d.encounters.find(y=>y.id===x.encounterId);if(!e||e.type!==x.type||e.status!=="in-progress")return "Encounter tidak aktif / jenis tidak cocok.";
 if(x.type==="Rawat Jalan"&&x.step===1){
  const diagnosed=d.diagnoses.some(y=>y.encounterId===e.id);
  const signed=d.soapRecords?.[e.id]?.status==="signed"||d.notes.some(y=>y.encounterId===e.id&&y.signed);
  if(!diagnosed||!signed)return "Butuh diagnosis dan catatan RME signed (demo) sebelum verifikasi.";
 }
 if(x.type==="IGD"&&x.step===0&&!d.triageRecords?.[e.id])return "Catatan triase belum tersedia. Isi melalui RME IGD.";
 if(x.type==="Rawat Inap"){
  if(x.step===0&&!x.bedId)return "Tempatkan bed demo sebelum melanjutkan.";
  if(x.step===2&&!d.nursingNotes?.some(n=>n.encounterId===e.id))return "Dokumentasi asuhan keperawatan belum tersedia pada encounter.";
 }
 const last=careSteps(x.type).length-1;
 if(x.step>=last)return "Tahap sudah final.";
 x.step++;
 x.history.push("Tahap: "+careSteps(x.type)[x.step]);
 if(x.step===last&&x.bedId){
  const bed=d.designWorkflows?.beds?.find(b=>b.id===x.bedId);
  if(bed&&bed.heldBy===e.id){bed.status="available";delete bed.heldBy;}
 }
 return null;
}
function action(kind,id,node,c){
 if(!kind.startsWith("cfx-"))return false;
 const d=c.data,u=c.ui,a=state(d);
 if(kind==="cfx-mode"){if(!modeLabels[id])return fail(c,"Jenis pelayanan tidak dikenal.");u.careMode=id;u.careEncounter="";c.render();return true;}
 if(kind==="cfx-select"){if(!d.encounters.some(e=>e.id===id&&e.type===u.careMode))return fail(c,"Encounter tidak sesuai.");u.careEncounter=id;c.render();return true;}
 if(kind==="cfx-open-rme"){if(!d.encounters.some(e=>e.id===id))return fail(c,"Encounter tidak ditemukan.");u.selectedEncounter=id;c.navigate("clinical");return true;}
 if(kind==="cfx-open-db"){u.dbQualified="encounter.encounters";u.schema="encounter";c.navigate("database");return true;}
 if(kind==="cfx-start"){
  const e=d.encounters.find(x=>x.id===id);
  if(!e||e.status!=="in-progress"||!modeLabels[e.type])return fail(c,"Skenario hanya untuk Encounter RJ/IGD/RI yang aktif.");
  if(a.care[id])return fail(c,"Skenario sudah dimulai, tidak boleh duplikat.");
  a.care[id]={encounterId:id,type:e.type,step:0,bedId:null,history:["Skenario administratif dimulai"]};
  return ok(c,"Skenario pelayanan dibuat.");
 }
 if(kind==="cfx-next"){
  const x=a.care[id];if(!x)return fail(c,"Skenario tidak ditemukan.");
  const error=advanceCare(d,x);if(error)return fail(c,error);
  return ok(c,"Tahap pelayanan demo diperbarui.");
 }
 if(kind==="cfx-disposition"){
  const [encounterId,decision]=id.split("|"),x=a.care[encounterId];
  if(!x||x.type!=="IGD"||x.step!==3||x.disposition||!["admit","refer","discharge"].includes(decision))return fail(c,"Keputusan tidak valid atau sudah final.");
  x.disposition=decision;x.history.push("Disposisi administratif: "+decision);
  return ok(c,"Keputusan demo dicatat; tidak melakukan transfer/discharge/rujukan nyata.");
 }
 if(kind==="cfx-specialty-next"){
  const x=a.specialties.find(t=>t.id===id);if(!x||x.cancelled||!defs[x.type]||x.step>=defs[x.type].phases.length-1)return fail(c,"Episode final/dibatalkan atau tidak ditemukan.");
  const e=d.encounters.find(y=>y.id===x.encounterId);if(!e||e.status!=="in-progress")return fail(c,"Encounter dasar tidak aktif.");
  x.step++;x.history.push(defs[x.type].phases[x.step]);
  return ok(c,"Dokumentasi tahap layanan demo dicatat.");
 }
 return false;
}
function submit(kind,values,c){
 if(!kind.startsWith("cfx-"))return false;
 const d=c.data,a=state(d),get=k=>String(values.get(k)||"").trim();
 if(kind==="cfx-bed"){
  const e=d.encounters.find(x=>x.id===get("encounterId")),x=a.care[get("encounterId")],bed=d.designWorkflows?.beds?.find(b=>b.id===get("bedId"));
  if(!e||e.type!=="Rawat Inap"||e.status!=="in-progress"||!x||x.type!=="Rawat Inap"||x.step>=4||!bed)return fail(c,"Encounter, state atau bed tidak valid.");
  if(bed.status!=="available"&&bed.heldBy!==e.id)return fail(c,"Bed demo sudah dipakai.");
  if(x.bedId===bed.id)return fail(c,"Bed yang sama sudah terpasang.");
  const old=d.designWorkflows?.beds?.find(b=>b.id===x.bedId);
  if(old&&old.heldBy===e.id){old.status="available";delete old.heldBy;}
  bed.status="occupied";bed.heldBy=e.id;x.bedId=bed.id;x.history.push("Penempatan/pindah bed: "+bed.code);
  return ok(c,"Penempatan bed demo disimpan.");
 }
 if(kind==="cfx-specialty-start"){
  const type=get("type"),e=d.encounters.find(x=>x.id===get("encounterId"));
  if(!defs[type]||!e||e.status!=="in-progress")return fail(c,"Jenis layanan/Encounter tidak valid.");
  if(a.specialties.some(x=>x.type===type&&x.encounterId===e.id&&!x.cancelled))return fail(c,"Episode aktif jenis ini sudah ada untuk Encounter tersebut.");
  const seq=Math.max(0,...a.specialties.map(x=>Number(x.id.split("-").at(-1))||0))+1;
  const rec={id:"SPX-"+String(seq).padStart(3,"0"),type,encounterId:e.id,step:0,cancelled:false,history:[defs[type].phases[0]]};
  a.specialties.push(rec);return ok(c,"Episode spesialistik demo dibuat.");
 }
 if(kind==="cfx-specialty-cancel"){
  const x=a.specialties.find(y=>y.id===get("caseId")),reason=get("reason");
  if(!x||x.cancelled||x.step>=defs[x.type].phases.length-1)return fail(c,"Episode sudah final/dibatalkan.");
  if(reason.length<8||reason.length>120)return fail(c,"Alasan pembatalan wajib 8–120 karakter.");
  x.cancelled=true;x.cancelReason=reason;x.history.push("Dibatalkan: "+reason);
  return ok(c,"Episode demo dibatalkan, alasan tercatat.");
 }
 return false;
}
window.SIMRS_CARE_EXPANSION={init,render,action,submit,defs,advanceCare};
})();