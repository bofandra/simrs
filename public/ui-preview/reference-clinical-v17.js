/* SIMRS V17 reference-led UI: worklist cards and HR directory.
 * Data are synthetic, actions still delegate to existing role-first worklist.
 * Does not grant permissions or send, approve, sign, allocate, charge or transmit.
 */
(function(){
"use strict";
var worklists=window.SIMRSRoleUXV5;
if(!worklists||typeof worklists.renderPage!=="function")return;
var original=worklists.renderPage;
var viewState=Object.create(null);
function esc(value){return String(value==null?"":value).replace(/[&<>"']/g,function(char){
 return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char];
});}
function key(role,section){return String(role||"")+"::"+String(section||"home");}
function avatar(name){
 var parts=String(name||"").replace(/\b(dr\.|Dr\.|Pasien|Demo)\b/g,"").trim().split(/\s+/).filter(Boolean);
 return esc((parts.length>1?parts[0][0]+parts[1][0]:(parts[0]||"?").slice(0,2)).toUpperCase());
}
function cardsHtml(jobs,selected,filter,query){
 var visible=0;
 return '<div class="v17-job-grid" aria-label="Pekerjaan dalam tampilan kartu">'+jobs.map(function(job,index){
  var active=index===selected,waiting=job.status==="Perlu ditinjau";
  var haystack=[job.id,job.title,job.scope,job.reason,job.status,job.progress&&job.progress.label].join(" ").toLocaleLowerCase("id-ID");
  var shown=(filter==="Semua"||job.status===filter)&&haystack.includes(query);
  if(shown)visible++;
  return '<button type="button" class="v17-job-card" data-v17-job="'+index+'" data-v17-card="'+index+'"' +(shown?'':' hidden')+
   ' aria-pressed="'+String(active)+'" aria-label="Lihat detail pekerjaan '+esc(job.id)+'">'+
   '<span class="v17-job-card-head"><span class="v17-job-avatar" aria-hidden="true">'+avatar(job.title)+'</span>'+
   '<span><strong>'+esc(job.title)+'</strong><small>'+esc(job.scope)+'</small></span></span>'+
   '<span class="v17-job-card-foot"><span>'+esc(job.id)+'</span><span class="uxv4-status'+(waiting?' uxv4-pending':'')+'">'+esc(job.status)+'</span></span>'+
   '<dl><div><dt>Perlu diperiksa</dt><dd>'+esc(job.reason)+'</dd></div>'+
   '<div><dt>Dokumentasi</dt><dd>'+esc(job.progress?job.progress.label:"Belum ada draft")+'</dd></div></dl></button>';
 }).join("")+'</div><p class="v17-grid-empty"'+(visible?' hidden':'')+'>Tidak ada pekerjaan yang cocok dengan filter atau pencarian.</p>';
}
var demoStaff=[
 ["DA","Dokter Demo Anggrek","Dokter · Poli Penyakit Dalam","Poli Dalam","Bertugas","Pagi"],
 ["DB","Dokter Demo Bima","Dokter · IGD","Instalasi Gawat Darurat","Bertugas","Siang"],
 ["PC","Perawat Demo Citra","Perawat · Rawat Inap","Ruang Melati","Bertugas","Pagi"],
 ["RD","Radiografer Demo Danu","Radiografer · Radiologi","Radiologi","Tidak bertugas","—"],
 ["AE","ATLM Demo Eka","ATLM · Laboratorium","Laboratorium","Bertugas","Siang"],
 ["FF","Farmasis Demo Farah","Farmasis · Farmasi","Farmasi","Tidak bertugas","—"]
];
function staffDirectory(){
 return '<section class="uxv4-panel v17-staff-panel" aria-label="Referensi direktori staf SDM demo">'+
  '<div class="uxv4-panel-head"><div><h2>Dokter & staf klinis</h2>'+
  '<p>Contoh tampilan kartu personel untuk area SDM; bukan daftar pegawai aktif.</p></div>'+
  '<span class="uxv4-subtle">6 profil contoh</span></div>'+
  '<div class="v17-staff-directory"><p class="v17-staff-note">Semua nama dan jadwal berikut sintetis. Direktori hanya read-only, tanpa nomor STR/SIP, kontak atau data identitas nyata. Penugasan aktual memerlukan master SDM dan hak akses terverifikasi.</p>'+
  '<div class="v17-staff-grid">'+demoStaff.map(function(row){
   return '<article class="v17-staff-card"><header><span class="v17-staff-avatar">'+esc(row[0])+'</span>'+
    '<div><h3>'+esc(row[1])+'</h3><p>'+esc(row[2])+'</p></div></header><dl>'+
    '<div><dt>Unit</dt><dd>'+esc(row[3])+'</dd></div>'+
    '<div><dt>Status contoh</dt><dd class="v17-status'+(row[4]==="Tidak bertugas"?" off":"")+'">'+esc(row[4])+'</dd></div>'+
    '<div><dt>Shift</dt><dd>'+esc(row[5])+'</dd></div>'+
    '</dl></article>';
  }).join("")+'</div></div></section>';
}
function activeFilter(root){
 var selected=root.querySelector('[data-v12-filter][aria-pressed="true"]');
 return selected?selected.getAttribute("data-v12-filter"):"Semua";
}
function syncGrid(root){
 if(!root)return;
 var role=root.getAttribute("data-uxv4-role");
 var section=root.getAttribute("data-uxv4-section");
 var jobs=worklists.jobRows(role,section)||[];
 var search=root.querySelector("#uxv5-search");
 var query=search?String(search.value||"").trim().toLocaleLowerCase("id-ID"):"";
 var filter=activeFilter(root),visible=0;
 root.querySelectorAll("[data-v17-card]").forEach(function(card){
  var job=jobs[Number(card.getAttribute("data-v17-card"))];
  var haystack=job?[job.id,job.title,job.scope,job.reason,job.status,job.progress&&job.progress.label].join(" ").toLocaleLowerCase("id-ID"):"";
  var show=!!job&&(filter==="Semua"||filter===job.status)&&haystack.includes(query);
  card.hidden=!show;if(show)visible++;
 });
 var empty=root.querySelector(".v17-grid-empty");
 if(empty)empty.hidden=visible!==0;
}
worklists.renderPage=function(ctx){
 var html=original(ctx);
 if(!ctx||!ctx.role||!ctx.username||String(ctx.username).startsWith("reviewer.")||
    typeof html!=="string"||html.indexOf('class="uxv4 uxv5')<0)return html;
 var jobs=worklists.jobRows(ctx.role,ctx.section);
 if(!Array.isArray(jobs)||!jobs.length)return html;
 var stateKey=key(ctx.role,ctx.section),grid=viewState[stateKey]==="grid";
 if(grid)html=html.replace('class="uxv4 uxv5','class="uxv4 uxv5 v17-grid-mode');
 var control='<div class="v17-switchbar"><span>Pilih tampilan daftar kerja</span>'+
  '<div class="v17-view-switch" role="group" aria-label="Tampilan pekerjaan">'+
  '<button type="button" data-v17-view="table" aria-pressed="'+String(!grid)+'">☷ Tabel</button>'+
  '<button type="button" data-v17-view="grid" aria-pressed="'+String(grid)+'">▦ Kartu</button>'+
  '</div></div>';
 var index=Number(ctx.selectedJob);
 if(!Number.isInteger(index)||index<0||index>=jobs.length)index=0;
 var activeStatus=(html.match(/data-v12-filter="([^"]+)" aria-pressed="true"/)||[])[1]||"Semua";
 var encodedQuery=(html.match(/id="uxv5-search" type="search" value="([^"]*)"/)||[])[1]||"";
 var query=encodedQuery.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").trim().toLocaleLowerCase("id-ID");
 html=html.replace('<div class="uxv5-layout">',control+cardsHtml(jobs,index,activeStatus,query)+'<div class="uxv5-layout">');
 if(ctx.role==="HR Admin"&&(ctx.section==="home"||!ctx.section)){
  html=html.replace('</section>', '</section>'+staffDirectory());
 }
 return html;
};
document.addEventListener("click",function(event){
 var card=event.target.closest("[data-v17-job]");
 if(card){
  event.preventDefault();
  var root=card.closest(".uxv4.uxv5");
  var index=Number(card.getAttribute("data-v17-job"));
  var existing=root&&root.querySelector('.uxv4-table [data-demo-action="job:'+index+'"]');
  if(existing)existing.click(); // Existing handler enforces role + patient/encounter context.
  return;
 }
 var toggle=event.target.closest("[data-v17-view]");
 if(toggle){
  var root=toggle.closest(".uxv4.uxv5");
  if(!root)return;
  event.preventDefault();
  var mode=toggle.getAttribute("data-v17-view");
  if(mode!=="grid"&&mode!=="table")return;
  viewState[key(root.getAttribute("data-uxv4-role"),root.getAttribute("data-uxv4-section"))]=mode;
  root.classList.toggle("v17-grid-mode",mode==="grid");
  root.querySelectorAll("[data-v17-view]").forEach(function(button){
   button.setAttribute("aria-pressed",String(button.getAttribute("data-v17-view")===mode));
  });
  syncGrid(root);
  return;
 }
 if(event.target.closest("[data-v12-filter]")){
  var root=document.querySelector(".uxv4.uxv5")||event.target.closest(".uxv4.uxv5");
  if(root)syncGrid(root);
 }
});
document.addEventListener("input",function(event){
 if(!event.target||event.target.id!=="uxv5-search")return;
 syncGrid(event.target.closest(".uxv4.uxv5"));
});
window.SIMRSReferenceUIV17={version:"17",staffProfiles:demoStaff.length,modeFor:function(role,section){
 return viewState[key(role,section)]||"table";
},syncGrid:syncGrid};
if(window.SIMRSRoleDemo&&window.SIMRSRoleDemo.isAuthenticated&&
   window.SIMRSRoleDemo.isAuthenticated()&&window.__SIMRS_PREVIEW__){
 window.__SIMRS_PREVIEW__.render();
}
})();
