/* SIMRS Baru P0 Forms — demo-only rendering and local browser storage.
 * Source of module metadata: p0-form-catalog.js (PRD 2026-11-08).
 * This is a UI prototype; not clinical authorization, backend, patient storage,
 * electronic signature, claim, dispensing, stock movement or official integration.
 */
(function () {
  "use strict";
  var catalog = Array.isArray(window.SIMRS_FORM_CATALOG) ? window.SIMRS_FORM_CATALOG : [];
  var key = "simrs-demo-p0-forms-v1";
  var state = { code:"CORE-09", priority:"P0", recordId:null, search:"" };
  var demo = readDemo();
  var lastContext = null;
  var riskyActions = "Tanda tangan, release hasil, dispensing, mutasi stok, pembayaran, posting jurnal, pengajuan klaim, pengiriman API dan publikasi laporan hanya contoh desain: NONAKTIF sampai SOP/UAT dan otorisasi.";

  function readDemo() {
    try {
      var raw = JSON.parse(localStorage.getItem(key) || "{}");
      if (raw && typeof raw === "object" && !Array.isArray(raw) && raw.records && typeof raw.records === "object") return raw;
    } catch (e) {}
    return { version:1, seq:0, records:{} };
  }
  function persist() {
    try { localStorage.setItem(key, JSON.stringify(demo)); return true; }
    catch (e) { notice("Penyimpanan lokal gagal. Periksa izin browser / ruang penyimpanan."); return false; }
  }
  function esc(value) {
    return String(value === null || value === undefined ? "" : value)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }
  function currentModule() { return catalog.find(function (m) {return m.code === state.code;}) || catalog.find(function(m){return m.priority === "P0";});}
  function context() {return lastContext || { role:"Pendaftaran", patient:{id:"p1",name:"Pasien Demo",mrn:"RM-DEMO",visit:"ENC-DEMO"} };}
  function canEdit(m) {return !!(m && m.fields && m.fields.length && m.roles.indexOf(context().role) >= 0);}
  function recordsFor(m) {
    var all = Array.isArray(demo.records[m.code]) ? demo.records[m.code] : [];
    if (m.patient_context) return all.filter(function(r){return r.patient_id === context().patient.id;});
    return all;
  }
  function record() {return recordsFor(currentModule()).find(function(r){return r.id === state.recordId;}) || null;}
  function notice(message) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = message;
    t.classList.add("show");
    window.clearTimeout(notice.timer);
    notice.timer = window.setTimeout(function(){t.classList.remove("show");},3500);
  }
  function update() {
    var shell = window.__SIMRS_PREVIEW__;
    if (shell && typeof shell.render === "function") shell.render();
    else {
      var main = document.getElementById("main-content");
      if (main) main.innerHTML = render(context());
    }
  }
  function pill(text,extra) {return '<span class="p0-pill '+(extra || "")+'">'+esc(text)+'</span>';}
  function button(label,action,klass,attr,disabled) {
    return '<button type="button" class="btn '+(klass || "")+'" data-p0-action="'+esc(action)+'" '+(attr || "")+(disabled?' disabled aria-disabled="true"':'')+'>'+esc(label)+'</button>';
  }
  function renderField(f,values,editable) {
    var id = "p0-f-"+f.key;
    var val = values[f.key] === undefined ? "" : values[f.key];
    var base = 'id="'+esc(id)+'" name="'+esc(f.key)+'" class="forminput" '+(editable?'':'disabled ')+' ';
    var flags = ' autocomplete="off"'+(f.required?' required':'')+(f.min !== undefined?' min="'+esc(f.min)+'"':'')+
      (f.max !== undefined?' max="'+esc(f.max)+'"':'')+(f.step !== undefined?' step="'+esc(f.step)+'"':'')+
      (f.pattern?' pattern="'+esc(f.pattern)+'"':'');
    var input = "";
    if (f.type === "textarea") {
      input = '<textarea '+base+flags+' rows="3">'+esc(val)+'</textarea>';
    } else if (f.type === "select") {
      input = '<select '+base+flags+'><option value="">— Pilih —</option>'+(f.options || []).map(function(o){
        return '<option value="'+esc(o)+'"'+(String(o)===String(val)?' selected':'')+'>'+esc(o)+'</option>';
      }).join("")+'</select>';
    } else {
      var ty = ["text","email","date","datetime-local","tel","number"].indexOf(f.type) >= 0 ? f.type : "text";
      input = '<input type="'+ty+'" '+base+' value="'+esc(val)+'"'+flags+' />';
    }
    return '<div class="field p0-field" data-field="'+esc(f.key)+'"><label for="'+esc(id)+'">'+esc(f.label)+(f.required?' <span class="p0-required" aria-label="wajib">*</span>':'')+'</label>'+
      input+(f.help?'<span class="hint">'+esc(f.help)+'</span>':'')+
      '<span class="p0-error" data-error-for="'+esc(f.key)+'" aria-live="polite"></span></div>';
  }
  function renderCatalog() {
    return '<section class="card p0-catalog" aria-label="Katalog modul SIMRS"><div class="card-h"><h2>Katalog 68 Modul</h2>'+pill("30 P0")+'</div>'+
      '<div class="p0-catalog-tools"><label for="p0-search">Cari kode / nama modul</label><input id="p0-search" class="forminput" placeholder="Mis. RME-04 / farmasi" value="'+esc(state.search)+'" />'+
      '<label for="p0-priority">Prioritas</label><select id="p0-priority" class="forminput"><option value="P0"'+(state.priority==="P0"?" selected":"")+'>P0 (form tersedia)</option>'+
      '<option value="all"'+(state.priority==="all"?" selected":"")+'>Semua prioritas</option>'+
      ['P1','P2','P3'].map(function(p){return '<option value="'+p+'"'+(state.priority===p?' selected':'')+'>'+p+'</option>';}).join("")+'</select></div>'+
      '<div id="p0-catalog-list" class="p0-module-list">'+catalog.filter(function(m){return state.priority==="all" || state.priority===m.priority;}).map(function(m){
        var ready=m.fields && m.fields.length;var active=m.code===state.code;
        return '<button class="p0-module-item'+(active?' active':'')+'" type="button" data-p0-action="choose" data-code="'+esc(m.code)+'" data-search="'+esc((m.code+" "+m.name).toLowerCase())+'" aria-current="'+(active?'true':'false')+'"><span><strong>'+esc(m.code)+'</strong><small>'+esc(m.name)+'</small></span><span class="p0-module-meta">'+esc(m.priority)+'<small>'+(ready?'Form':'Roadmap')+'</small></span></button>';
      }).join("")+'</div><p id="p0-no-match" class="p0-empty" hidden>Tidak ada modul sesuai pencarian.</p></section>';
  }
  function renderInfo(m) {
    var labels=[m.code,m.priority].concat(m.fr).concat([m.us]).concat(m.wf||[]);
    return '<div class="p0-module-head"><div><div class="eyebrow">MODUL '+esc(m.code)+' · PIC '+esc(m.pic)+'</div>'+
       '<h2>'+esc(m.name)+'</h2><p>'+esc(m.description||"Modul tercatat dalam PRD SIMRS Baru.")+'</p></div>'+
       '<div>'+pill(m.priority,"primary")+'</div></div>'+
       '<div class="p0-trace">'+labels.map(function(x){return pill(x);}).join("")+'</div>'+
       '<div class="p0-entity">Entitas utama di PRD: <code>'+esc(m.entity||"—")+'</code> · Workspace: <strong>'+esc(m.workspace)+'</strong></div>';
  }
  function renderRecordList(m) {
    var rs = recordsFor(m);
    return '<section class="card"><div class="card-h"><h2>Daftar & detail form</h2>'+pill(rs.length+" data demo")+'</div>'+
      '<div class="p0-record-list">'+(rs.length?rs.map(function(r){
         return '<button class="p0-record-item'+(r.id===state.recordId?' active':'')+'" type="button" data-p0-action="open" data-record="'+esc(r.id)+'">'+
           '<span><strong>'+esc(r.id)+'</strong><small>'+esc(new Date(r.updated_at).toLocaleString("id-ID"))+'</small></span>'+
           pill(r.status,r.status==="Reviewed (Demo)"?"good":"")+'</button>';
       }).join(""):'<p class="p0-empty">Belum ada catatan demo. Pilih <b>Form baru</b> lalu isi dan simpan draft.</p>')+'</div>'+
      '<div class="card-body">'+button("+ Form baru","new","btn-primary","",!canEdit(m))+'</div></section>';
  }
  function renderEditor(m) {
    if (!m.fields.length) return '<section class="card"><div class="card-body"><h3>Belum masuk tahap P0</h3><p>Modul '+esc(m.code)+' sudah terpetakan ke PRD, FR dan User Story, tetapi form spesifiknya belum dibuat.</p><p>Rencana berikutnya: susun field, validasi, worklist dan skenario UAT untuk modul '+esc(m.priority)+'.</p></div></section>';
    var r=record(), allowed=canEdit(m), editable=allowed && (!r || r.status==="Draft");
    var values=(r && r.values)||{};
    var id = r?r.id:"Baru (belum tersimpan)";
    var ctx=context();
    return '<section class="card p0-editor"><div class="card-h"><h2>Form '+esc(m.code)+'</h2>'+pill(r?r.status:"Belum disimpan",r&&r.status==="Reviewed (Demo)"?"good":"")+'</div>'+
      (m.patient_context?'<div class="p0-patient-banner"><strong>Pasien demo: '+esc(ctx.patient.name)+'</strong><span>MRN '+esc(ctx.patient.mrn)+' · Encounter '+esc(ctx.patient.visit)+'</span><span>Identitas dan encounter merupakan konteks read-only.</span></div>':'<div class="p0-patient-banner"><strong>Data administrasi / master</strong><span>RS Demo Nusantara · Tenant demonstrasi</span></div>')+
      (!allowed?'<div class="p0-warning" role="status">Peran <strong>'+esc(ctx.role)+'</strong> hanya dapat melihat. Peran untuk mengisi: '+esc((m.roles||[]).join(", ")||"Belum ditetapkan")+'. Ubah peran demo di bagian kanan atas.</div>':'')+
      (r&&r.status!=="Draft"?'<div class="p0-warning">Catatan telah ditinjau dan terkunci pada mode demonstrasi. Perubahan memerlukan alur koreksi/addendum terpisah yang belum dibuat.</div>':'')+
      '<form id="p0-editor" novalidate><div class="p0-form-head"><div><span class="muted">Nomor catatan</span><strong>'+esc(id)+'</strong></div><div><span class="muted">Peran penginput</span><strong>'+esc(ctx.role)+'</strong></div></div>'+
      '<div class="p0-fields">'+m.fields.map(function(f){return renderField(f,values,editable);}).join("")+'</div>'+
      '<div id="p0-validation-summary" class="p0-validation-summary" role="alert" hidden></div>'+
      '<div class="p0-form-actions">'+button("Simpan draft (demo)","save","btn-primary","",!editable)+
      button("Tinjau kelengkapan","review","","",!editable)+
      button("Sign / Approve / Release","blocked","", 'title="Nonaktif sampai SOP, UAT, audit, dan otorisasi"',true)+
      '</div></form>'+
      '<div class="p0-safety-note">'+esc(riskyActions)+'</div>'+
      (r?'<details class="p0-audit"><summary>Riwayat catatan demonstrasi</summary><ol>'+(r.history||[]).map(function(h){return '<li>'+esc(h.at)+' — '+esc(h.event)+' ('+esc(h.actor)+')</li>';}).join("")+'</ol></details>':'')+
      '</section>';
  }
  function render(ctx) {
    lastContext=ctx || context();
    var m=currentModule();
    if (state.priority!=="all" && state.priority!==m.priority && !state.search) {
      state.code=(catalog.find(function(x){return x.priority===state.priority;})||m).code;
      m=currentModule();state.recordId=null;
    }
    return '<div class="page-head"><div><div class="eyebrow">DESAIN FORM • P0 IMPLEMENTATION</div>'+
      '<h1>Katalog Form & Workflow SIMRS</h1><p>Form sesuai domain PRD, dapat diisi dan ditinjau menggunakan data sintetis. Perubahan hanya tersimpan di browser ini.</p></div>'+
      '<div class="actions">'+pill("30/30 modul P0 terdefinisi","good")+pill("DEMO – NO BACKEND")+'</div></div>'+
      '<div class="p0-warning" role="note"><strong>Bukan sistem operasional.</strong> Jangan masukkan data pasien asli, NIK sebenarnya, nomor transaksi, atau informasi sensitif. Tidak ada sinkronisasi ke API/FHIR atau database RS.</div>'+
      '<div class="p0-layout">'+renderCatalog()+'<div class="p0-detail">'+
      '<section class="card"><div class="card-body">'+renderInfo(m)+'</div></section>'+
      renderRecordList(m)+renderEditor(m)+
      '<section class="card p0-acceptance"><div class="card-h"><h2>Traceability & kriteria penerimaan PRD</h2></div><div class="card-body"><p>Referensi: '+esc(m.us)+' · '+esc(m.fr.join(", "))+' · '+esc((m.wf||[]).join(", ")||"Alur lintas modul")+'.</p>'+
      '<div class="p0-trace">'+m.ac_ids.map(function(x){return pill(x);}).join("")+'</div>'+
      '<p class="muted">Enam AC adalah ID kontrak PRD. Form ini hanya memprototipe input, validasi dan review; pengujian kontrak OpenAPI, DB constraint, RBAC/IDOR, konkurensi, audit/outbox serta UAT masih diperlukan.</p>'+
      '</div></section></div></div>';
  }
  function showErrors(errors) {
    var summary=document.getElementById("p0-validation-summary");
    document.querySelectorAll("#p0-editor .p0-field").forEach(function(row){
      row.classList.remove("invalid");
      var hint=row.querySelector(".p0-error");if(hint)hint.textContent="";
      var field=row.querySelector("[name]");if(field)field.removeAttribute("aria-invalid");
    });
    if (!summary) return;
    summary.hidden=!errors.length;
    summary.textContent=errors.length?"Periksa "+errors.length+" field: "+errors.map(function(x){return x.label;}).join(", ")+".":"";
    errors.forEach(function(e){
      var field=document.querySelector('#p0-editor [name="'+e.key+'"]');
      if(!field)return;
      field.setAttribute("aria-invalid","true");
      var row=field.closest(".p0-field");if(!row)return;row.classList.add("invalid");
      var err=row.querySelector(".p0-error");if(err)err.textContent=e.message;
    });
    if(errors.length){var f=document.querySelector('#p0-editor [name="'+errors[0].key+'"]');if(f)f.focus();}
  }
  function collect() {
    var form=document.getElementById("p0-editor");var values={};
    if(!form)return values;
    form.querySelectorAll("[name]").forEach(function(el){values[el.name]=String(el.value||"").trim();});
    return values;
  }
  function validate(m,values,review) {
    var errors=[];
    function add(f,msg){errors.push({key:f.key,label:f.label,message:msg});}
    m.fields.forEach(function(f) {
      var val=(values[f.key]||"").trim();
      if (review && f.required && !val){add(f,"Field wajib diisi sebelum ditinjau.");return;}
      if (!val) return;
      if (f.pattern && !(new RegExp(f.pattern)).test(val)){add(f,"Format tidak sesuai pola.");return;}
      if (f.type==="number" && (!Number.isFinite(Number(val)) || (f.min!==undefined && Number(val)<f.min) || (f.max!==undefined && Number(val)>f.max))){add(f,"Angka di luar rentang yang diizinkan.");return;}
      if (f.type==="email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)){add(f,"Alamat email tidak valid.");return;}
      if (f.type==="select" && f.options.indexOf(val)<0){add(f,"Pilih opsi katalog yang tersedia.");return;}
    });
    var ranges=[["valid_from","valid_until"],["effective_from","effective_until"],["start_at","end_at"],["admission_at","discharge_at"]];
    ranges.forEach(function(pair){
      if(values[pair[0]] && values[pair[1]] && values[pair[1]]<values[pair[0]]){
        var f=m.fields.find(function(x){return x.key===pair[1];});
        if(f)add(f,"Akhir periode harus setelah atau sama dengan awal.");
      }
    });
    if (review && m.code==="MED-04" && values.allergy_checked!=="Sudah ditinjau") errors.push({key:"allergy_checked",label:"Review alergi",message:"Review alergi wajib sebelum lanjut."});
    if (review && m.code==="MED-05" && values.identity_check!=="Sudah ditinjau") errors.push({key:"identity_check",label:"Identitas pasien",message:"Verifikasi identitas demo wajib sebelum lanjut."});
    if (review && values.systolic && values.diastolic && Number(values.diastolic)>=Number(values.systolic)) {
      errors.push({key:"diastolic",label:"Diastolik",message:"Nilai diastolik harus lebih kecil dari sistolik; periksa nilai demo."});
    }
    if (review && m.code==="FIN-02" && Number(values.discount||0)>Number(values.subtotal||0)) errors.push({key:"discount",label:"Diskon",message:"Diskon tidak boleh melebihi subtotal."});
    if (review && m.code==="MED-05" && values.expiry_date && values.expiry_date<"2026-11-08") errors.push({key:"expiry_date",label:"Kedaluwarsa",message:"Lot sudah kedaluwarsa pada tanggal contoh."});
    return errors;
  }
  function saveDraft() {
    var m=currentModule();if(!canEdit(m)){notice("Peran tidak diizinkan mengisi form ini (demo).");return;}
    var old=record();if(old && old.status!=="Draft"){notice("Catatan yang sudah ditinjau tidak dapat diubah.");return;}
    var vals=collect(),errors=validate(m,vals,false);
    showErrors(errors);if(errors.length)return;
    var at=new Date().toISOString(), actor=context().role;
    if(!Array.isArray(demo.records[m.code]))demo.records[m.code]=[];
    if(!old){
      demo.seq+=1;
      old={id:"DEMO-"+m.code+"-"+String(demo.seq).padStart(4,"0"),status:"Draft",patient_id:m.patient_context?context().patient.id:null,encounter_id:m.patient_context?context().patient.visit:null,created_at:at,history:[]};
      demo.records[m.code].unshift(old);
    }
    old.values=vals;old.updated_at=at;old.history.push({at:at,event:"Draft disimpan di browser",actor:actor});
    state.recordId=old.id;if(persist()){update();notice("Draft sintetis tersimpan secara lokal: "+old.id);}
  }
  function review() {
    var m=currentModule();if(!canEdit(m)){notice("Peran tidak diizinkan meninjau form ini (demo).");return;}
    var r=record();if(!r){notice("Simpan draft terlebih dahulu.");return;}
    if(r.status!=="Draft"){notice("Catatan sudah ditinjau.");return;}
    var values=collect(),errors=validate(m,values,true);
    showErrors(errors);if(errors.length)return;
    r.values=values;r.status="Reviewed (Demo)";r.updated_at=new Date().toISOString();
    r.history.push({at:r.updated_at,event:"Validasi field dan review UI berhasil (simulasi)",actor:context().role});
    if(persist()){update();notice("Field lengkap. Status: Reviewed (Demo). Tidak ada sign/approve/release nyata.");}
  }
  function handleClick(e) {
    var b=e.target.closest("[data-p0-action]");
    if(!b)return;
    e.preventDefault();e.stopImmediatePropagation();
    var action=b.getAttribute("data-p0-action");
    if (action==="choose"){state.code=b.getAttribute("data-code");state.recordId=null;state.search="";update();return;}
    if (action==="open"){state.recordId=b.getAttribute("data-record");update();return;}
    if (action==="new"){state.recordId=null;update();return;}
    if (action==="save"){saveDraft();return;}
    if (action==="review"){review();return;}
    if (action==="blocked"){notice("NONAKTIF: menunggu SOP, UAT, dan otorisasi.");return;}
  }
  function handleInput(e) {
    if(e.target.id!=="p0-search")return;
    state.search=e.target.value;
    var q=state.search.trim().toLowerCase(),shown=0;
    document.querySelectorAll("#p0-catalog-list .p0-module-item").forEach(function(item){
      var match=item.getAttribute("data-search").indexOf(q)>=0;
      item.hidden=!match;if(match)shown++;
    });
    var no=document.getElementById("p0-no-match");if(no)no.hidden=shown!==0;
  }
  document.addEventListener("click",handleClick);
  document.addEventListener("input",handleInput);
  document.addEventListener("change",function(e){
    if(e.target.id==="p0-priority"){state.priority=e.target.value;state.search="";state.recordId=null;update();}
  });
  document.addEventListener("submit",function(e){
    if(e.target.id==="p0-editor"){e.preventDefault();e.stopPropagation();saveDraft();}
  });
  window.SIMRSFormEngine={render:render,validate:validate,collect:collect,getCatalog:function(){return catalog;},getRecords:function(){return demo.records;}};
})();
