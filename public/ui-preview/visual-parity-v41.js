/* SIMRS UI/UX V41: 13 reference screen registry, recoverable empty states and
 * accessible form error navigation; 100% client-side synthetic UI.
 * V41 is display-only. It never changes role permissions, record state,
 * clinical transactions, inventory, claims or external data.
 */
(function(){
"use strict";
var shell=window.__SIMRS_PREVIEW__,auth=window.SIMRSRoleDemo;
if(!shell||!auth||typeof shell.render!=="function")return;
var original=shell.render;
var references=[
 {screen:"S01",file:"01_login.png",role:null,area:"Masuk ke SIMRS"},
 {screen:"S02",file:"02_front.png",role:"Pendaftaran",area:"Pendaftaran dan antrean"},
 {screen:"S03",file:"03_doctor.png",role:"Dokter RJ",area:"Konsultasi rawat jalan"},
 {screen:"S04",file:"04_nurse.png",role:"Perawat",area:"Asuhan keperawatan"},
 {screen:"S05",file:"05_igd.png",role:"Dokter IGD",area:"IGD dan triase"},
 {screen:"S06",file:"06_beds.png",role:"Bed Manager",area:"Manajemen tempat tidur"},
 {screen:"S07",file:"07_lab.png",role:"ATLM",area:"Laboratorium"},
 {screen:"S08",file:"08_pharmacy.png",role:"Farmasis",area:"Farmasi"},
 {screen:"S09",file:"09_finance.png",role:"Kasir",area:"Keuangan"},
 {screen:"S10",file:"10_management.png",role:"Manajemen RS",area:"Manajemen dan mutu"},
 {screen:"S11",file:"11_admin.png",role:"Admin Sistem",area:"Pengguna dan akses"},
 {screen:"S12",file:"12_radiology.png",role:"Radiografer",area:"Radiologi"},
 {screen:"S13",file:"13_mcu.png",role:"Petugas MCU",area:"MCU"}
];
var aliases={
 "Petugas Billing":"S09","Casemix":"S09","Tim Mutu":"S10",
 "Integrasi":"S10","Radiolog":"S12","Koordinator MCU":"S13"
};
var activeSummary=null,summaryObserver=null;
function make(tag,cls,label){
 var e=document.createElement(tag);
 if(cls)e.className=cls;
 if(label!==undefined)e.textContent=String(label);
 return e;
}
function applyRegistry(account){
 var login=document.getElementById("demo-login");
 if(login)login.setAttribute("data-v40-screen","S01");
 if(!account||account.reviewer||shell.state.active!=="rolehome")return;
 var ref=references.find(function(item){return item.role===account.role;});
 var id=(ref&&ref.screen)||aliases[account.role];
 var root=document.querySelector("#main-content .uxv5");
 if(!id||!root||root.getAttribute("data-uxv4-role")!==account.role)return;
 var record=references.find(function(item){return item.screen===id;});
 root.setAttribute("data-v40-screen",id);
 root.setAttribute("data-v40-reference",record.file);
}
function updateEmpty(root){
 if(!root||!root.isConnected||root.classList.contains("v37-workspace"))return;
 var fallback=root.querySelector("#uxv5-empty"),panel=root.querySelector(".v41-empty-panel");
 if(!fallback||!panel)return;
 var isEmpty=!fallback.hidden;
 panel.hidden=!isEmpty;
 fallback.hidden=true;
 root.setAttribute("data-v41-result-state",isEmpty?"empty":"results");
}
function decorateEmpty(root){
 if(!root||root.classList.contains("v37-workspace"))return;
 var old=root.querySelector("#uxv5-empty");
 if(!old||root.querySelector(".v41-empty-panel"))return;
 var panel=make("section","v41-empty-panel");
 panel.hidden=true;panel.setAttribute("role","status");panel.setAttribute("aria-live","polite");
 panel.appendChild(make("strong",null,"Tidak ada pekerjaan yang cocok."));
 panel.appendChild(make("p",null,"Ubah kata kunci atau filter status untuk menampilkan tugas lain. Data tidak berubah."));
 var btn=make("button","v41-empty-reset","Hapus pencarian dan filter");
 btn.type="button";btn.setAttribute("data-v41-reset","");
 panel.appendChild(btn);
 old.insertAdjacentElement("afterend",panel);
 updateEmpty(root);
}
function describeError(field,error){
 if(!field||!error)return;
 var key=field.getAttribute("name");
 if(!key)return;
 var id="v41-error-"+key.replace(/[^a-zA-Z0-9_-]/g,"-");
 error.id=id;
 var existing=(field.getAttribute("aria-describedby")||"").split(/\s+/).filter(Boolean);
 if(existing.indexOf(id)<0)existing.push(id);
 field.setAttribute("aria-describedby",existing.join(" "));
}
function refreshErrors(){
 var summary=activeSummary;
 if(!summary||!summary.isConnected)return;
 var form=summary.closest("#p0-editor");
 var pane=form&&form.querySelector(".v41-error-navigation");
 if(!form||!pane)return;
 var invalid=Array.from(form.querySelectorAll('.p0-field [name][aria-invalid="true"]'));
 if(summary.hidden||!invalid.length){
  pane.hidden=true;
  pane.querySelector(".v41-error-links").replaceChildren();
  pane.removeAttribute("data-v41-count");
  return;
 }
 var list=pane.querySelector(".v41-error-links");
 list.replaceChildren();
 invalid.forEach(function(field){
  var row=field.closest(".p0-field");
  if(!row)return;
  var label=row.querySelector("label");
  var error=row.querySelector(".p0-error");
  if(error)describeError(field,error);
  var b=make("button","v41-error-jump",(label?label.textContent.trim():field.name)+
   (error&&error.textContent.trim()?" — "+error.textContent.trim():""));
  b.type="button";b.setAttribute("data-v41-field",field.name);list.appendChild(b);
 });
 pane.querySelector(".v41-error-title").textContent=
  "Perbaiki "+String(list.children.length)+" kolom yang perlu diperiksa";
 pane.hidden=list.children.length===0;
 pane.setAttribute("data-v41-count",String(list.children.length));
}
function decorateForm(){
 if(summaryObserver){summaryObserver.disconnect();summaryObserver=null;activeSummary=null;}
 var form=document.querySelector("#main-content .p0-operational #p0-editor");
 if(!form)return;
 var actions=form.querySelector(".p0-form-actions"),summary=form.querySelector("#p0-validation-summary");
 if(!actions||!summary)return;
 var draft=actions.querySelector('[data-p0-action="save"]');
 var warning=form.closest(".p0-editor")&&form.closest(".p0-editor").querySelector(".p0-warning");
 var denied=!!(warning&&warning.textContent.indexOf("hanya dapat melihat")>=0);
 var state=denied?"denied":draft&&!draft.disabled?"draft":"read-only";
 form.setAttribute("data-v41-form-state",state);
 var head=form.querySelector(".p0-form-head");
 if(head){
  var banner=make("div","v41-form-state");
  banner.setAttribute("data-v41-state",state);
  var line=state==="denied"?"Akses terbatas":state==="read-only"?"Terkunci / baca saja":"Draft simulasi";
  var detail=state==="denied"?"Role ini tidak dapat mengubah form. Izin tidak ditingkatkan otomatis.":
   state==="read-only"?"Catatan atau form tidak dapat diedit. Tindakan release tetap nonaktif.":
   "Isi satu aktivitas, tinjau kembali kolom wajib, lalu simpan sebagai draft demo.";
  banner.appendChild(make("strong",null,line));
  banner.appendChild(make("span",null,detail));
  head.insertAdjacentElement("afterend",banner);
 }
 var pane=make("section","v41-error-navigation");
 pane.hidden=true;pane.setAttribute("aria-label","Daftar kolom bermasalah");
 pane.appendChild(make("strong","v41-error-title","Perbaiki kolom yang perlu diperiksa"));
 pane.appendChild(make("p",null,"Pilih kolom untuk membukanya, perbaiki isi, kemudian ulangi Tinjau kelengkapan."));
 pane.appendChild(make("div","v41-error-links"));
 summary.insertAdjacentElement("afterend",pane);
 activeSummary=summary;
 summaryObserver=new MutationObserver(refreshErrors);
 summaryObserver.observe(summary,{childList:true,characterData:true,attributes:true,attributeFilter:["hidden"],subtree:true});
 refreshErrors();
}
function decorate(){
 var account=auth.getAccount&&auth.getAccount();
 applyRegistry(account);
 if(!account||account.reviewer)return;
 if(shell.state.active==="rolehome"){
  var root=document.querySelector("#main-content .uxv5");
  decorateEmpty(root);
 }else if(shell.state.active==="forms"){
  decorateForm();
 }
}
shell.render=function(){
 var result=original.apply(this,arguments);
 decorate();
 return result;
};
document.addEventListener("click",function(event){
 var b=event.target&&event.target.closest&&event.target.closest("[data-v41-reset]");
 if(b){
  event.preventDefault();
  var root=b.closest(".uxv5");
  if(!root)return;
  var all=root.querySelector('[data-v12-filter="Semua"]');
  if(all)all.click();
  var current=document.querySelector("#main-content .uxv5");
  var input=current&&current.querySelector("#uxv5-search");
  if(input){
   input.value="";
   input.dispatchEvent(new Event("input",{bubbles:true}));
   input.focus({preventScroll:true});
  }
  updateEmpty(current);
  return;
 }
 b=event.target&&event.target.closest&&event.target.closest("[data-v41-field]");
 if(!b)return;
 var form=b.closest("#p0-editor");
 if(!form)return;
 event.preventDefault();
 var key=b.getAttribute("data-v41-field");
 var field=Array.from(form.querySelectorAll("[name]")).find(function(x){return x.name===key;});
 if(!field)return;
 var section=field.closest(".v13-form-section,.v15-generated-section");
 var progress=window.SIMRSProgressiveFormsV15;
 if(section&&progress&&typeof progress.stepsOf==="function"){
  var idx=progress.stepsOf(form).indexOf(section);
  if(idx>=0)progress.setStep(form,idx,false);
 }
 field.focus({preventScroll:true});
 if(typeof field.scrollIntoView==="function")field.scrollIntoView({behavior:"auto",block:"center"});
});
document.addEventListener("input",function(event){
 if(event.target&&event.target.id==="uxv5-search")updateEmpty(event.target.closest(".uxv5"));
});
document.addEventListener("click",function(event){
 if(event.target&&event.target.closest&&event.target.closest("[data-v12-filter]"))
  updateEmpty(document.querySelector("#main-content .uxv5"));
});
decorate();
window.SIMRSVisualParityV41={
 references:references.map(function(r){return {screen:r.screen,role:r.role,file:r.file};}),
 aliases:aliases,refreshErrors:refreshErrors
};
})();