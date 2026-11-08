/* SIMRS Baru P0 Forms — demo-only rendering and local browser storage.
 * Source of module metadata: p0-form-catalog.js (PRD 2026-11-08).
 * This is a UI prototype; not clinical authorization, backend, patient storage,
 * electronic signature, claim, dispensing, stock movement or official integration.
 */
(function () {
  "use strict";
  var catalog = Array.isArray(window.SIMRS_FORM_CATALOG) ? window.SIMRS_FORM_CATALOG : [];
  var key = "simrs-demo-p0-forms-v1";
  var state = { code:"CORE-09", priority:"P0", recordId:null, search:"", prefill:null, linkSource:null };
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
    if (m.patient_context) return all.filter(function(r){return r.patient_id === context().patient.id && r.encounter_id === context().patient.visit;});
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
    var master=window.SIMRSMasterLookups;
    if(master && master.supports(currentModule().code,f.key))
      return master.field(f,values,editable,currentModule().code);
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
    return '<section class="card p0-catalog" aria-label="Katalog modul SIMRS"><div class="card-h"><h2>Katalog 68 Modul</h2>'+pill("68 form demo")+'</div>'+
      '<div class="p0-catalog-tools"><label for="p0-search">Cari kode / nama modul</label><input id="p0-search" class="forminput" placeholder="Mis. RME-04 / farmasi" value="'+esc(state.search)+'" />'+
      '<label for="p0-priority">Prioritas</label><select id="p0-priority" class="forminput"><option value="P0"'+(state.priority==="P0"?" selected":"")+'>P0 (30 form)</option>'+
      '<option value="all"'+(state.priority==="all"?" selected":"")+'>Semua prioritas</option>'+
      ['P1','P2','P3'].map(function(p){return '<option value="'+p+'"'+(state.priority===p?' selected':'')+'>'+p+' ('+(p==='P1'?17:p==='P2'?14:7)+' form demo)</option>';}).join("")+'</select></div>'+
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
  function renderContract(m) {
    var d=window.SIMRS_CONTRACT_AUDIT && window.SIMRS_CONTRACT_AUDIT[m.code];
    var source='<a target="_blank" rel="noopener noreferrer" href="https://drive.google.com/file/d/1RMo7tZ9rdoLjEVYRf-tycxTLzrDgzd08/view">OpenAPI 3.1</a> · '+
      '<a target="_blank" rel="noopener noreferrer" href="https://drive.google.com/file/d/16UTtaKH-wDhXWMtVaf5Z68Osom2ZWfx1/view">model.json</a>';
    if(!d)return '<section class="card p0-contract"><div class="card-h"><h2>Kontrak API & database</h2>'+pill("Belum diaudit")+'</div>'+
      '<div class="card-body"><p class="muted">Form untuk modul '+esc(m.code)+' belum mempunyai crosswalk field ke request schema OpenAPI. Tidak boleh dianggap payload API siap dipakai.</p>'+
      '<p class="hint">Sumber acuan: '+source+'</p></div></section>';
    var rows=Object.keys(d.fields||{}).map(function(k){
      var info=d.fields[k],isRequired=d.required.indexOf(k)>=0;
      var missing=String(info[0]).indexOf("belum tersedia")>=0||String(info[0]).indexOf("nonaktif")>=0;
      return '<tr><td><code>'+esc(k)+'</code> '+(isRequired?pill("Wajib","primary"):"")+'</td>'+
        '<td>'+esc(info[0])+'</td><td>'+esc(info[1])+'</td><td>'+pill(missing?"Gap":"Review mapping",missing?"warn":"")+'</td></tr>';
    }).join("");
    return '<section class="card p0-contract"><div class="card-h"><h2>Kontrak API & database</h2>'+pill("Audit awal 12 modul","primary")+'</div>'+
      '<details class="p0-contract-details"><summary>Periksa mapping form terhadap OpenAPI dan kolom database — '+esc(m.code)+'</summary>'+
      '<div class="card-body"><p><strong>POST '+esc(d.path)+'</strong> · operationId <code>'+esc(d.op)+'</code> · schema <code>'+esc(d.schema)+'</code></p>'+
      '<p class="muted">Kolom pada '+esc(m.entity)+': '+esc((d.columns||[]).join(", "))+'</p>'+
      '<p class="hint">Mapping ini merupakan audit awal, <strong>bukan</strong> bukti request telah sesuai atau backend tersedia. Semua ID di mockup adalah sintetis.</p>'+
      '<div class="table-wrap"><table class="p0-contract-table"><thead><tr><th>Properti API</th><th>Padanan UI</th><th>Catatan</th><th>Status</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
      '<div class="p0-contract-gaps"><strong>Gap yang wajib diselesaikan</strong><ul>'+
         d.gaps.map(function(g){return '<li>'+esc(g)+'</li>';}).join("")+'</ul></div>'+
      '<p class="hint">Sumber: '+source+' (baseline 8 November 2026). Integrasi API tetap nonaktif.</p></div></details></section>';
  }
  var demoJourneys = {
    "WF-01":["CORE-08","CORE-10","CORE-09"],
    "WF-02":["CORE-09","RME-01","RME-05","RME-04","RME-06","RME-08"],
    "WF-03":["CORE-09","RME-02","RME-03"],
    "WF-04":["CORE-05","OPS-10","RME-03"],
    "WF-05":["RME-08","MED-01"],
    "WF-07":["RME-08","MED-04","MED-05"],
    "WF-08":["FIN-01","FIN-02","FIN-03","FIN-05","FIN-06","FIN-07"],
    "WF-06":["RME-08","MED-02","MED-03"],
    "WF-10":["MED-06","MED-07","OPS-03"],
    "WF-11":["RME-03","MED-11","OPS-05"],
    "WF-12":["ENT-06","ENT-08","ENT-09"],
    "WF-14":["RME-08","MED-01"],
    "WF-15":["MED-01","OPS-01"]
  };
  function renderJourney(m) {
    var wf=(m.wf||[]).find(function(w){return demoJourneys[w] && demoJourneys[w].indexOf(m.code)>=0;});
    if(!wf)return "";
    return '<section class="card p0-journey"><div class="card-h"><h2>Alur contoh '+esc(wf)+'</h2>'+pill("Navigasi demo")+'</div>'+
      '<div class="card-body"><div class="p0-journey-steps">'+demoJourneys[wf].map(function(code,i){
        var x=catalog.find(function(a){return a.code===code;});
        return '<button class="p0-journey-step'+(code===m.code?' active':'')+'" type="button" data-p0-action="choose" data-code="'+esc(code)+'" aria-current="'+(code===m.code?'step':'false')+'"><span>'+esc(i+1)+'</span><strong>'+esc(code)+'</strong><small>'+esc(x?x.name:"")+'</small></button>';
      }).join("")+'</div><p class="hint">Konteks pasien/encounter tetap mengikuti pasien demo yang dipilih. Perpindahan ini belum membuat order, hasil, charge, atau transaksi lintas modul secara otomatis.</p></div></section>';
  }
  function renderGuide() {
    var journey=window.SIMRSSyntheticJourney;
    if(!journey || !Array.isArray(journey.steps))return "";
    var current=journey.steps.indexOf(state.code),completed=0;
    var tiles=journey.steps.map(function(code,index){
      var module=catalog.find(function(x){return x.code===code;});
      if(!module)return "";
      var records=recordsFor(module),record=records[0];
      var status=record?record.status:"Belum ada draft";
      if(status==="Reviewed (Demo)")completed++;
      return '<button type="button" class="p0-guide-step'+(code===state.code?' active':'')+
        '" data-p0-action="guide" data-code="'+esc(code)+'" aria-current="'+(code===state.code?'step':'false')+
        '" aria-label="Buka tahap '+(index+1)+' '+esc(module.name)+' · '+esc(status)+'">'+
        '<span class="p0-guide-number">'+(index+1)+'</span><span><strong>'+esc(code)+'</strong>'+
        '<small>'+esc(module.name)+'</small><em>'+esc(status)+'</em></span></button>';
    }).join("");
    var next=current>=0 && current<journey.steps.length-1?journey.steps[current+1]:null;
    var nextModule=next?catalog.find(function(x){return x.code===next;}):null;
    var action=nextModule?button("Tahap berikut: "+next,"guide","btn-primary",'data-code="'+esc(next)+'"'):"";
    var master=window.SIMRSMasterLookups;
    var note=master?'<p class="p0-guide-master">Katalog sintetis: '+master.units.length+' unit, '+master.doctors.length+
      ' dokter, '+master.services.length+' layanan/tarif, '+master.medications.length+' obat.</p>':"";
    return '<section class="card p0-guide" aria-label="Panduan alur rawat jalan"><div class="card-h"><h2>Jelajahi alur rawat jalan</h2>'+
      pill(completed+" / "+journey.steps.length+" ditinjau (demo)")+'</div>'+
      '<div class="card-body"><div class="p0-guide-steps">'+tiles+'</div>'+
      '<div class="p0-guide-foot"><p>Buka tahap tanpa mencari kode modul. Peran demo akan disesuaikan saat berpindah; seluruh draft tetap pada konteks pasien dan encounter terpilih.</p>'+action+'</div>'+
      note+'</div></section>';
  }
  function renderLinks(m) {
    if (!window.SIMRSDemoLinks || !m.fields.length)return "";
    var rows=recordsFor(m).filter(function(r){return r.status==="Reviewed (Demo)";}).slice(0,3);
    var cards=[];
    rows.forEach(function(r) {
      var targets=window.SIMRSDemoLinks.edgesFrom(m.code,r.values);
      targets.forEach(function(edge) {
        var dest=catalog.find(function(x){return x.code===edge.to;});
        if(!dest || !dest.fields || !dest.fields.length)return;
        cards.push('<div class="p0-link-row"><div><strong>'+esc(r.id)+'</strong><span>'+esc(edge.label)+' → '+esc(dest.code)+' · '+esc(dest.name)+'</span></div>'+
          button('Buat draft terkait','link','', 'data-source="'+esc(r.id)+'" data-target="'+esc(dest.code)+'"')+'</div>');
      });
    });
    if(!cards.length)return "";
    return '<section class="card p0-related"><div class="card-h"><h2>Lanjutkan alur dari catatan demo</h2>'+pill(cards.length+" referensi")+'</div>'+
      '<div class="card-body">'+cards.join("")+'<p class="hint">Hanya catatan Reviewed (Demo) dari pasien dan encounter yang sama. Menyalin referensi ke form lain tidak sama dengan persetujuan, sign, release atau posting transaksi.</p></div></section>';
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
    if (!m.fields.length) return '<section class="card"><div class="card-body"><h3>Form modul belum tersedia</h3><p>Modul '+esc(m.code)+' sudah terpetakan ke PRD, FR dan User Story, tetapi form spesifiknya belum dibuat.</p><p>Rencana berikutnya: susun field, validasi, worklist dan skenario UAT untuk modul '+esc(m.priority)+'.</p></div></section>';
    var r=record(), allowed=canEdit(m), editable=allowed && (!r || r.status==="Draft");
    var values=(r && r.values)||state.prefill||{};
    var id = r?r.id:"Baru (belum tersimpan)";
    var ctx=context();
    return '<section class="card p0-editor"><div class="card-h"><h2>Form '+esc(m.code)+'</h2>'+pill(r?r.status:"Belum disimpan",r&&r.status==="Reviewed (Demo)"?"good":"")+'</div>'+
      (m.patient_context?'<div class="p0-patient-banner"><strong>Pasien demo: '+esc(ctx.patient.name)+'</strong><span>MRN '+esc(ctx.patient.mrn)+' · Encounter '+esc(ctx.patient.visit)+'</span><span>Identitas dan encounter merupakan konteks read-only.</span></div>':'<div class="p0-patient-banner"><strong>Data administrasi / master</strong><span>RS Demo Nusantara · Tenant demonstrasi</span></div>')+
      (!allowed?'<div class="p0-warning" role="status">Peran <strong>'+esc(ctx.role)+'</strong> hanya dapat melihat. Peran untuk mengisi: '+esc((m.roles||[]).join(", ")||"Belum ditetapkan")+'. Ubah peran demo di bagian kanan atas.</div>':'')+
      (r&&r.status!=="Draft"?'<div class="p0-warning">Catatan telah ditinjau dan terkunci pada mode demonstrasi. Perubahan memerlukan alur koreksi/addendum terpisah yang belum dibuat.</div>':'')+
      ((r&&r.linked_source)||state.linkSource?'<div class="p0-provenance"><strong>Referensi catatan demo:</strong> '+esc(((r&&r.linked_source)||state.linkSource).module)+' / '+esc(((r&&r.linked_source)||state.linkSource).record_id)+' — hanya salin rujukan ke draft, tanpa membuat transaksi klinis/keuangan.</div>':'')+
      '<form id="p0-editor" data-form-module="'+esc(m.code)+'" novalidate><div class="p0-form-head"><div><span class="muted">Nomor catatan</span><strong>'+esc(id)+'</strong></div><div><span class="muted">Peran penginput</span><strong>'+esc(ctx.role)+'</strong></div></div>'+
      '<div class="p0-fields">'+m.fields.filter(function(f){return (!window.SIMRSLineItems || window.SIMRSLineItems.skipFields(m.code).indexOf(f.key)<0) && (!window.SIMRSFinanceLines || window.SIMRSFinanceLines.skipFields(m.code).indexOf(f.key)<0);}).map(function(f){return renderField(f,values,editable);}).join("")+'</div>'+ (window.SIMRSLineItems ? window.SIMRSLineItems.render(m.code,values,editable) : "")+
      (window.SIMRSFinanceLines ? window.SIMRSFinanceLines.render(m.code,values,editable,demo.records,ctx) : "")+
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
    return '<div class="page-head"><div><div class="eyebrow">DESAIN FORM • SEMUA PRIORITAS P0–P3</div>'+
      '<h1>Katalog Form & Workflow SIMRS</h1><p>Form sesuai domain PRD, dapat diisi dan ditinjau menggunakan data sintetis. Perubahan hanya tersimpan di browser ini.</p></div>'+
      '<div class="actions">'+pill("68/68 modul memiliki form demo","good")+pill("DEMO – NO BACKEND")+button("Muat 10 draft rawat jalan","seedScenario","btn-primary")+'</div></div>'+
      '<div class="p0-warning" role="note"><strong>Bukan sistem operasional.</strong> Jangan masukkan data pasien asli, NIK sebenarnya, nomor transaksi, atau informasi sensitif. Tidak ada sinkronisasi ke API/FHIR atau database RS.</div>'+
      '<div class="p0-layout">'+renderCatalog()+'<div class="p0-detail">'+
      '<section class="card"><div class="card-body">'+renderInfo(m)+'</div></section>'+
      renderGuide()+renderJourney(m)+renderRecordList(m)+renderLinks(m)+renderEditor(m)+renderContract(m)+
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
    form.querySelectorAll(".p0-fields [name]").forEach(function(el){values[el.name]=String(el.value||"").trim();});
    var lineData=window.SIMRSLineItems && window.SIMRSLineItems.collect(currentModule().code,form);
    if(lineData){values.items=lineData.items;Object.assign(values,lineData.scalar);}
    var financeData=window.SIMRSFinanceLines && window.SIMRSFinanceLines.collect(currentModule().code,form,demo.records,context());
    if(financeData)Object.assign(values,financeData);
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
    var ranges=[["valid_from","valid_until"],["effective_from","effective_until"],["start_at","end_at"],["admission_at","discharge_at"],["scheduled_start","scheduled_end"],["cycle_started","cycle_finished"],["period_start","period_end"],["session_start","session_end"],["departure_at","arrival_at"]];
    ranges.forEach(function(pair){
      if(values[pair[0]] && values[pair[1]] && values[pair[1]]<values[pair[0]]){
        var f=m.fields.find(function(x){return x.key===pair[1];});
        if(f)add(f,"Akhir periode harus setelah atau sama dengan awal.");
      }
    });
    if (review && m.code==="MED-04" && values.allergy_checked!=="Sudah ditinjau") errors.push({key:"allergy_checked",label:"Review alergi",message:"Review alergi wajib sebelum lanjut."});
    if (review && m.code==="MED-05" && values.identity_check!=="Sudah ditinjau") errors.push({key:"identity_check",label:"Identitas pasien",message:"Verifikasi identitas demo wajib sebelum lanjut."});
    if (review && m.code==="MED-11" && values.allergy_diet_review!=="Sudah ditinjau") errors.push({key:"allergy_diet_review",label:"Alergi dan pantangan",message:"Alergi/pantangan perlu ditinjau sebelum review diet demo."});
    if (review && m.code==="FIN-06" && values.clinical_documents_state!=="Lengkap untuk simulasi") errors.push({key:"clinical_documents_state",label:"Dokumen klinis",message:"Perlu pemeriksaan kelengkapan dokumen pada mockup; bukan konfirmasi signed klinis."});
    if (review && m.code==="FIN-07" && values.dossier_check!=="Lengkap untuk simulasi") errors.push({key:"dossier_check",label:"Berkas klaim",message:"Berkas belum lengkap untuk simulasi review; pengajuan asli tetap nonaktif."});
    if (review && m.code==="ENT-08" && Number(values.denominator)<=0) errors.push({key:"denominator",label:"Penyebut indikator",message:"Penyebut harus lebih dari nol untuk indikator rasio demo."});
    if (review && values.systolic && values.diastolic && Number(values.diastolic)>=Number(values.systolic)) {
      errors.push({key:"diastolic",label:"Diastolik",message:"Nilai diastolik harus lebih kecil dari sistolik; periksa nilai demo."});
    }
    if (review && m.code==="FIN-02" && Number(values.discount||0)>Number(values.subtotal||0)) errors.push({key:"discount",label:"Diskon",message:"Diskon tidak boleh melebihi subtotal."});
    if (review && m.code==="MED-12" && values.double_check!=="Diperiksa secara simulasi") errors.push({key:"double_check",label:"Double-check identitas",message:"Lengkapi pemeriksaan identitas simulasi sebelum review; tidak boleh dijadikan otorisasi transfusi nyata."});
    if (review && m.code==="FIN-08" && (Number(values.debit_total)<=0 || Number(values.debit_total)!==Number(values.credit_total))) errors.push({key:"credit_total",label:"Saldo jurnal",message:"Jurnal demo harus berimbang dan nominalnya lebih dari nol; posting nyata tetap nonaktif."});
    if (review && m.code==="ENT-02" && Number(values.deduction)>Number(values.gross_pay)) errors.push({key:"deduction",label:"Potongan payroll",message:"Potongan simulasi tidak boleh melebihi bruto."});
    if (review && m.code==="FIN-11" && Number(values.volume)<=0) errors.push({key:"volume",label:"Volume driver",message:"Volume driver harus lebih dari nol."});
    if (review && m.code==="MED-05" && values.expiry_date && values.expiry_date<"2026-11-08") errors.push({key:"expiry_date",label:"Kedaluwarsa",message:"Lot sudah kedaluwarsa pada tanggal contoh."});
    if (window.SIMRSLineItems) errors.push.apply(errors,window.SIMRSLineItems.validate(m.code,values,review));
    if (window.SIMRSFinanceLines) errors.push.apply(errors,window.SIMRSFinanceLines.validate(m.code,values,review,demo.records,context()));
    if (window.SIMRSMasterLookups) errors.push.apply(errors,window.SIMRSMasterLookups.validate(m,values,review));
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
      old={id:"DEMO-"+m.code+"-"+String(demo.seq).padStart(4,"0"),status:"Draft",patient_id:m.patient_context?context().patient.id:null,encounter_id:m.patient_context?context().patient.visit:null,created_at:at,linked_source:state.linkSource?{module:state.linkSource.module,record_id:state.linkSource.record_id}:null,history:[]};
      demo.records[m.code].unshift(old);
    }
    old.values=vals;old.updated_at=at;old.history.push({at:at,event:"Draft disimpan di browser",actor:actor});
    state.recordId=old.id;state.prefill=null;state.linkSource=null;if(persist()){update();notice("Draft sintetis tersimpan secara lokal: "+old.id);}
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
    if (action==="guide"){
      var target=b.getAttribute("data-code");
      var next=catalog.find(function(x){return x.code===target;});
      if(!next || !window.SIMRSSyntheticJourney || window.SIMRSSyntheticJourney.steps.indexOf(target)<0)return;
      var requiredRole=(next.roles||[])[0],changedRole=false;
      var shell=window.__SIMRS_PREVIEW__;
      if(requiredRole && next.roles.indexOf(context().role)<0 && shell && shell.state){
        shell.state.role=requiredRole;changedRole=true;
      }
      state.code=target;state.priority="all";state.search="";state.prefill=null;state.linkSource=null;
      var latest=recordsFor(next)[0];state.recordId=latest?latest.id:null;
      update();
      if(changedRole)notice("Peran DEMO disesuaikan ke "+requiredRole+" untuk mengisi "+target+".");
      return;
    }
    if (action==="choose"){state.code=b.getAttribute("data-code");state.recordId=null;state.search="";state.prefill=null;state.linkSource=null;var selected=catalog.find(function(m){return m.code===state.code;});if(selected && state.priority!=='all')state.priority=selected.priority;update();return;}
    if (action==="open"){state.recordId=b.getAttribute("data-record");state.prefill=null;state.linkSource=null;update();return;}
    if (action==="new"){state.recordId=null;state.prefill=null;state.linkSource=null;update();return;}
    if (action==="save"){saveDraft();return;}
    if (action==="review"){review();return;}
    if (action==="link"){
      var targetCode=b.getAttribute("data-target"),sourceId=b.getAttribute("data-source");
      var dest=catalog.find(function(x){return x.code===targetCode;});
      var from=currentModule();
      var source=recordsFor(from).find(function(r){return r.id===sourceId && r.status==="Reviewed (Demo)";});
      if(!source || !dest || !dest.fields.length || !window.SIMRSDemoLinks){notice("Referensi tidak valid atau belum direview (demo).");return;}
      if(!window.SIMRSDemoLinks.edgesFrom(from.code,source.values).some(function(x){return x.to===dest.code;})){notice("Relasi antar-modul tidak berlaku untuk catatan ini.");return;}
      state.prefill=window.SIMRSDemoLinks.suggest(from,source,dest);
      state.linkSource={module:from.code,record_id:source.id};
      state.code=dest.code;state.recordId=null;state.search="";state.priority="all";
      update();notice("Draft "+dest.code+" terhubung ke "+source.id+". Data belum tersimpan.");
      return;
    }
    if (action==="seedScenario"){seedScenario();return;}
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
    if(e.target.id==="p0-priority"){state.priority=e.target.value;state.search="";state.recordId=null;state.prefill=null;state.linkSource=null;update();}
  });
  document.addEventListener("submit",function(e){
    if(e.target.id==="p0-editor"){e.preventDefault();e.stopPropagation();saveDraft();}
  });
  function seedScenario() {
    var patient=context().patient;
    if(!patient || !patient.id || !patient.visit || !window.SIMRSSyntheticJourney) {
      notice("Skenario pasien sintetis belum tersedia.");return;
    }
    var scenarioId="RJ-DEMO-"+patient.id+"-"+patient.visit;
    var existing=Object.keys(demo.records).some(function(code){
      return (demo.records[code]||[]).some(function(x){return x.scenario_tag===scenarioId;});
    });
    if(existing){
      state.code="CORE-09";state.priority="P0";state.search="";state.recordId=null;
      state.prefill=null;state.linkSource=null;
      var row=(demo.records["CORE-09"]||[]).find(function(r){return r.scenario_tag===scenarioId;});
      if(row)state.recordId=row.id;
      update();notice("Skenario untuk pasien dan encounter ini sudah dimuat. Draft lama tidak ditimpa.");
      return;
    }
    var rows=window.SIMRSSyntheticJourney.make(patient,new Date().toISOString(),scenarioId);
    rows.forEach(function(x){
      if(!demo.records[x.code])demo.records[x.code]=[];
      demo.records[x.code].unshift(x.record);
    });
    state.code="CORE-09";state.priority="P0";state.search="";state.recordId=rows.find(function(x){return x.code==="CORE-09";}).record.id;
    state.prefill=null;state.linkSource=null;
    if(persist()) {
      update();notice("10 draft sintetis dibuat. Seluruhnya berstatus Draft; tidak ada persetujuan, dispensing, pembayaran, atau pengiriman API.");
    }
  }
  function resetDemo() {
    demo={version:1,seq:0,records:{}};
    state.recordId=null;state.code="CORE-09";state.priority="P0";state.search="";state.prefill=null;state.linkSource=null;
    try{localStorage.removeItem(key);}catch(e){}
  }
  window.SIMRSFormEngine={render:render,validate:validate,collect:collect,resetDemo:resetDemo,getCatalog:function(){return catalog;},getRecords:function(){return demo.records;}};
})();
