/* SIMRS Demo Role Login — static prototype, NOT actual authentication.
 * All accounts and credentials are intentionally public. Never use with real patient data.
 */
(function(){
"use strict";
var PASSWORD="demo123";
var KEY="simrs-demo-login-session-v1";
var roleList=(window.__SIMRS_PREVIEW__&&window.__SIMRS_PREVIEW__.roles)||[];
var ACCOUNT_PREFIX="akun.";
var reviewer={username:"reviewer.demo",role:"Reviewer UI/QA",label:"Reviewer UI/QA",department:"Pengujian Mockup",reviewer:true};
var areaByRole={
 "Pendaftaran":"front","Dokter RJ":"clinical","Perawat":"clinical","Dokter IGD":"acute",
 "ATLM":"lab","Petugas MCU":"lab","Farmasis":"pharmacy","Kasir":"finance",
 "Manajemen RS":"management"
};
var descriptions={
 "Pendaftaran":"Pencarian pasien, identitas, registrasi, janji temu, dan antrean",
 "Dokter RJ":"Daftar pasien poli, asesmen, SOAP, diagnosis, resep, dan order",
 "Perawat":"Daftar pasien, observasi, catatan keperawatan dan tanda vital",
 "Dokter IGD":"Pantauan pasien gawat darurat, triase, tindakan dan disposisi",
 "DPJP Rawat Inap":"Daftar pasien ruang rawat, visite, terapi dan discharge",
 "ATLM":"Penerimaan sampel, analyzer, verifikasi dan hasil laboratorium",
 "Petugas MCU":"Paket peserta, pemeriksaan, kelengkapan dan buku hasil MCU",
 "Farmasis":"Antrean resep, telaah obat, lot, dan penyiapan obat",
 "Kasir":"Tagihan, alokasi pembayaran, dan kuitansi",
 "Casemix":"Kelengkapan berkas, grouping dan rekonsiliasi klaim",
 "Manajemen RS":"Kinerja pelayanan, indikator, kepatuhan dan tren rumah sakit",
 "Admin Sistem":"Akun, organisasi, master data, terminologi dan integrasi",
 "Petugas CSSD":"Penerimaan instrumen, sterilisasi dan serah-terima",
 "Petugas Laundry":"Penerimaan linen, pencucian, penyelesaian dan distribusi",
 "Ahli Gizi":"Asesmen gizi, rencana intervensi dan pemantauan",
 "Petugas Dapur":"Produksi, permintaan tray dan distribusi makanan",
 "HR Admin":"Data pegawai, penugasan dan administrasi kepegawaian",
 "Rekruter":"Kandidat, seleksi, tahapan dan rekrutmen"
};
var groups={
 "Pelayanan & RME":["Pendaftaran","Dokter RJ","Dokter IGD","DPJP Rawat Inap","Perawat","Perawat HD","Terapis Rehabilitasi"],
 "Penunjang Medis":["ATLM","Petugas MCU","Radiografer","Radiolog","Farmasis","Koordinator MCU","Petugas Bank Darah","Dokter Anestesi","Koordinator OK","Ahli Gizi"],
 "Operasional & Logistik":["Gudang","Petugas CSSD","Petugas Dapur","Petugas Laundry","Pengadaan","Petugas Aset","Teknisi","Petugas Fasilitas","Koordinator Transport"],
 "Keuangan & Klaim":["Kasir","Casemix","Petugas BPJS","Coder","Akuntan","Budget Owner","Analis Biaya"],
 "Manajemen & Enterprise":["Manajemen RS","Tim Mutu","Integrasi","Admin Sistem","HR Admin","Payroll Admin","Rekruter","Tim PPI","Pasien Demo"]
};
function dept(role){return Object.keys(groups).find(function(n){return groups[n].includes(role);})||"Unit Rumah Sakit";}
function slug(s){return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}
var accounts=roleList.map(function(role){return {username:ACCOUNT_PREFIX+slug(role),role:role,label:role,department:dept(role),reviewer:false};});
accounts.push(reviewer);
var current=null;
var selected=accounts[0];
var loginRoot=document.getElementById("demo-login");
function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,function(x){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x];});}
function authenticated(){return !!current;}
function isReviewer(){return !!(current&&current.reviewer);}
function getAccount(){return current;}
function lookup(username){return accounts.find(function(a){return a.username===username;})||null;}
function tasks(role){
 var base=window.SIMRSWorkspacesV2?.shortcuts(role)||[];
 var catalog=window.SIMRSFormEngine?.getCatalog?.()||[];
 var permitted=base.filter(function(task){
  if(!task[1].startsWith("module:"))return true;
  var module=catalog.find(function(x){return x.code===task[1].slice(7);});
  return !!(module&&Array.isArray(module.roles)&&module.roles.includes(role));
 });
 if(areaByRole[role])return permitted;
 return permitted.filter(function(task){return task[1].startsWith("module:")||task[1]==="forms";});
}
function areaFor(role){return areaByRole[role]||"rolehome";}
function allowArea(area){
 if(isReviewer())return true;
 if(!authenticated())return false;
 return area==="rolehome"||area==="forms"||area===areaFor(current.role);
}
function allowModule(code){
 if(isReviewer())return true;
 if(!authenticated())return false;
 var direct=tasks(current.role).some(function(t){return t[1]==="module:"+code;});
 var m=window.SIMRSFormEngine?.getCatalog?.().find(function(x){return x.code===code;});
 return direct||!!(m&&Array.isArray(m.roles)&&m.roles.includes(current.role));
}
function beforeRender(state){
 if(!authenticated())return;
 if(!isReviewer()){
  state.role=current.role;
  if(!allowArea(state.active))state.active=areaFor(current.role);
  if(state.active==="lab")state.labTab=current.role==="Petugas MCU"?"mcu":"lis";
  if(state.active==="clinical"&&state.clinicalTab==="history"){} // history is patient-scoped demo
 }
}
function actionToLabel(t){
 var command=t[1];
 if(command.startsWith("module:")){
  var id=command.slice(7),m=window.SIMRSFormEngine?.getCatalog?.().find(function(item){return item.code===id;});
  return m?.description||"Buka form "+t[0]+" sesuai peran.";
 }
 return descriptions[current?.role]||"Buka daftar kerja sesuai tugas.";
}
function paintRoleNav(){
 if(!authenticated())return;
 var roleLabel=document.getElementById("demo-current-role");
 if(roleLabel)roleLabel.textContent=isReviewer()?"Reviewer UI/QA":current.role;
 if(isReviewer())return;
 var holder=document.getElementById("role-nav");
 if(!holder)return;
 var shell=window.__SIMRS_PREVIEW__;
 holder.innerHTML='<button class="ux-nav-link'+(shell.state.active==="rolehome"?" active":"")+'" data-demo-action="home" type="button">Beranda saya</button>'+
  tasks(current.role).map(function(x){
   return '<button type="button" class="ux-nav-link" data-demo-action="'+esc(x[1])+'">'+esc(x[0])+'</button>';
  }).join("");
}
function renderHome(){
 if(!current)return "";
 var role=current.role,list=tasks(role);
 var cards=list.map(function(item,i){
  return '<article class="demo-task-card"><div class="demo-task-index">'+String(i+1).padStart(2,"0")+'</div>'+
  '<h3>'+esc(item[0])+'</h3><p>'+esc(actionToLabel(item))+'</p>'+
  '<button class="btn btn-primary" type="button" data-demo-action="'+esc(item[1])+'">Buka pekerjaan</button></article>';
 }).join("");
 return '<div class="page-head"><div><div class="eyebrow">BERANDA SAYA · '+esc(dept(role))+'</div>'+
  '<h1>'+esc(role)+'</h1><p>'+esc(descriptions[role]||"Daftar tugas dan formulir sesuai kewenangan peran ini.")+'</p></div></div>'+
  '<div class="demo-welcome"><div><span class="demo-eyebrow">SIMRS BARU · SESI DEMO</span><h2>Selamat bekerja</h2>'+
  '<p>Anda sedang menggunakan akun contoh <strong>'+esc(current.username)+'</strong> pada RS Demo Nusantara. Semua aktivitas di bawah bersifat simulasi.</p></div>'+
  '<span class="demo-welcome-tag">'+esc(role)+'</span></div>'+
  '<section class="demo-task-section"><div class="demo-task-head"><div><h2>Daftar kerja saya</h2><p>Hanya tugas untuk peran ini. Pilih pekerjaan untuk membuka halaman/form terkait.</p></div><span>'+list.length+' akses tugas</span></div>'+
  '<div class="demo-task-grid">'+cards+'</div></section>'+
  '<div class="demo-safe-line"><strong>Mode latihan:</strong> data pasien dan transaksi hanyalah contoh. Aplikasi tidak melakukan perubahan klinis, keuangan, stok, atau integrasi nasional.</div>';
}
function renderLogin(){
 if(!loginRoot)return;
 var byDept=Object.keys(groups).map(function(g){
  var members=accounts.filter(function(a){return a.department===g;});
  if(!members.length)return "";
  return '<div class="demo-account-group"><h3>'+esc(g)+' <span>'+members.length+'</span></h3><div class="demo-accounts">'+members.map(function(a){
   return '<button type="button" class="demo-account'+(selected.username===a.username?' selected':'')+'" data-demo-account="'+esc(a.username)+'" data-account-search="'+esc((a.role+' '+a.username+' '+a.department).toLowerCase())+'">'+
    '<span class="demo-account-symbol">'+esc(a.role.slice(0,2).toUpperCase())+'</span><span><strong>'+esc(a.role)+'</strong><small>'+esc(a.username)+'</small></span></button>';
  }).join("")+'</div></div>';
 }).join("");
 loginRoot.innerHTML='<main class="demo-login-wrap"><section class="demo-login-intro">'+
 '<div class="demo-login-brand"><span>+</span><strong>SIMRS Baru</strong></div>'+
 '<span class="demo-eyebrow">MOCKUP UI/UX RUMAH SAKIT</span>'+
 '<h1>Masuk sesuai <em>peran Anda.</em></h1>'+
 '<p>Setiap peran memiliki akun demo dan akan melihat tugas, menu, serta formulir sesuai pekerjaan sehari-hari di rumah sakit.</p>'+
 '<div class="demo-login-points"><span>42 akun role operasional</span><span>Workspace personal per peran</span><span>Semua data sintetis</span></div>'+
 '<div class="demo-login-disclaimer"><strong>Hanya prototipe.</strong> Akun dan kata sandi demo bersifat publik. Tidak ada autentikasi server, RBAC nyata, atau data pasien asli.</div></section>'+
 '<section class="demo-login-panel"><div class="demo-login-header"><div><h2>Login Demo SIMRS</h2><p>Pilih akun atau masukkan username demo.</p></div><span class="demo-online">Mode Demo</span></div>'+
 '<form id="demo-login-form" novalidate><div class="demo-login-fields"><label for="demo-username">Username demo</label><input id="demo-username" autocomplete="username" spellcheck="false" value="'+esc(selected.username)+'"/>'+
 '<label for="demo-password">Kata sandi demo</label><input id="demo-password" type="password" autocomplete="off" value="'+PASSWORD+'"/>'+
 '<p class="demo-pass-hint">Semua akun menggunakan kata sandi latihan: <strong>demo123</strong></p><div id="demo-login-error" role="alert" aria-live="polite" hidden></div>'+
 '<button class="demo-login-submit" type="submit">Masuk ke workspace</button></div></form>'+
 '<div class="demo-account-title"><div><h3>Pilih akun berdasarkan role</h3><p>Daftar akun demo tersedia untuk semua pengguna.</p></div><span>'+roleList.length+' Role</span></div>'+
 '<input id="demo-account-filter" aria-label="Cari akun demo" placeholder="Cari role atau username (mis. farmasi, dokter, kasir)"/>'+
 '<div id="demo-account-list" class="demo-account-scroll">'+byDept+
 '<div class="demo-account-group"><h3>Reviewer / QA <span>1</span></h3><div class="demo-accounts">'+
 '<button type="button" class="demo-account'+(selected.reviewer?' selected':'')+'" data-demo-account="reviewer.demo" data-account-search="reviewer ui qa testing">'+
 '<span class="demo-account-symbol">QA</span><span><strong>Reviewer UI/QA</strong><small>reviewer.demo · akses pengujian seluruh modul</small></span></button></div></div></div>'+
 '<p class="demo-login-foot">Lingkungan demonstrasi · Jangan masukkan NIK, data pasien atau password sebenarnya.</p></section></main>';
}
function choose(username){
 var a=lookup(username);if(!a)return;
 selected=a;
 var user=document.getElementById("demo-username");if(user)user.value=a.username;
 document.querySelectorAll("[data-demo-account]").forEach(function(b){b.classList.toggle("selected",b.dataset.demoAccount===a.username);});
}
function showLogin(){
 current=null;
 document.body.classList.remove("demo-authenticated","demo-reviewer");
 document.body.classList.add("demo-login-active");
 delete document.body.dataset.demoRole;
 loginRoot.hidden=false;
 renderLogin();
}
function showApp(){
 if(!current)return;
 document.body.classList.remove("demo-login-active");
 document.body.classList.add("demo-authenticated");
 document.body.classList.toggle("demo-reviewer",!!current.reviewer);
 document.body.dataset.demoRole=current.reviewer?"reviewer":slug(current.role);
 loginRoot.hidden=true;
 var shell=window.__SIMRS_PREVIEW__;
 if(!shell)return;
 shell.state.role=current.reviewer?"Pendaftaran":current.role;
 shell.state.active=current.reviewer?"front":areaFor(current.role);
 if(current.role==="Petugas MCU")shell.state.labTab="mcu";
 else if(current.role==="ATLM")shell.state.labTab="lis";
 if(current.role==="Dokter RJ"||current.role==="Perawat")shell.state.clinicalTab="soap";
 if(!current.reviewer)location.hash="#/"+shell.state.active;
 else location.hash="";
 shell.render();
}
function login(username,password){
 var a=lookup(String(username||"").trim().toLowerCase());
 if(!a||password!==PASSWORD)return false;
 current=a;
 try{sessionStorage.setItem(KEY,a.username);}catch(_error){}
 showApp();
 return true;
}
function logout(){
 try{sessionStorage.removeItem(KEY);}catch(_error){}
 var shell=window.__SIMRS_PREVIEW__;
 if(shell){shell.state.active="front";shell.state.role="Pendaftaran";}
 try{history.replaceState(null,"",location.pathname+location.search);}catch(_error){location.hash="";}
 document.getElementById("modal-root").innerHTML="";
 showLogin();
}
function handleDemoCommand(command){
 var shell=window.__SIMRS_PREVIEW__;
 if(!shell||!current)return;
 if(command==="home"){shell.state.active="rolehome";location.hash="#/rolehome";shell.render();return;}
 if(command==="logout"){logout();return;}
 if(command==="forms"){
  if(isReviewer()){shell.state.active="forms";shell.render();return;}
  shell.toast("Buka formulir melalui daftar pekerjaan Anda.");return;
 }
 if(command.startsWith("module:")){
  if(!allowModule(command.slice(7))){shell.toast("Form ini tidak tersedia untuk akun demo Anda.");return;}
  shell.state.active="forms";shell.render();
  var code=command.slice(7);
  var p=document.getElementById("p0-priority");if(p){p.value="all";p.dispatchEvent(new Event("change",{bubbles:true}));}
  var b=document.querySelector('#p0-catalog-list [data-code="'+code+'"]');
  if(b)b.click();
  else shell.toast("Form belum bisa dibuka pada mockup.");
  return;
 }
 if(command.startsWith("route:")){
  var parts=command.split(":");
  if(!allowArea(parts[1])){shell.toast("Workspace ini bukan tugas role "+current.role+".");return;}
  shell.state.active=parts[1];
  if(parts[1]==="clinical")shell.state.clinicalTab=parts[2]||"soap";
  if(parts[1]==="lab")shell.state.labTab=parts[2]==="mcu"?"mcu":"lis";
  location.hash="#/"+parts[1]+"/"+(parts[2]||"overview");
  shell.render();
 }
}
document.addEventListener("click",function(e){
 var button=e.target.closest("[data-demo-account]");
 if(button){choose(button.dataset.demoAccount);return;}
 var act=e.target.closest("[data-demo-action]");
 if(act){e.preventDefault();e.stopImmediatePropagation();handleDemoCommand(act.getAttribute("data-demo-action"));return;}
 if(e.target.closest("#demo-logout")){e.preventDefault();e.stopImmediatePropagation();logout();}
},true);
document.addEventListener("submit",function(e){
 if(e.target.id!=="demo-login-form")return;
 e.preventDefault();var username=document.getElementById("demo-username").value;
 var password=document.getElementById("demo-password").value;
 if(!login(username,password)){var error=document.getElementById("demo-login-error");error.hidden=false;error.textContent="Username atau kata sandi demo tidak cocok. Pilih akun dari daftar dan gunakan demo123.";}
},true);
document.addEventListener("input",function(e){
 if(e.target.id!=="demo-account-filter")return;
 var q=e.target.value.toLowerCase().trim();
 document.querySelectorAll(".demo-account").forEach(function(b){b.hidden=!b.dataset.accountSearch.includes(q);});
 document.querySelectorAll(".demo-account-group").forEach(function(g){g.hidden=!g.querySelector(".demo-account:not([hidden])");});
},true);
window.SIMRSRoleDemo={accounts:accounts,login:login,logout:logout,renderHome:renderHome,
 beforeRender:beforeRender,paintRoleNav:paintRoleNav,allowArea:allowArea,allowModule:allowModule,
 isAuthenticated:authenticated,isReviewer:isReviewer,getAccount:getAccount,tasks:tasks,areaFor:areaFor};
var restored=null;
try{restored=lookup(sessionStorage.getItem(KEY)||"");}catch(_error){}
if(restored){current=restored;showApp();}else showLogin();
})();
