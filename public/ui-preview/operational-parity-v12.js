/* SIMRS V12 role-first operational parity.
 * Enhances the existing worklist renderer; never changes authorization,
 * patient selection, saved clinical drafts, or server-side behaviour.
 */
(function () {
  "use strict";
  var v5 = window.SIMRSRoleUXV5;
  if (!v5 || typeof v5.renderPage !== "function") return;

  var targetRoles = [
    "Pendaftaran", "Dokter RJ", "Perawat", "Dokter IGD", "Bed Manager",
    "ATLM", "Farmasis", "Kasir", "Manajemen RS", "Admin Sistem",
    "Radiografer", "Radiolog", "Petugas MCU", "Koordinator MCU"
  ];
  var roleDescriptions = {
    "Pendaftaran":"Registrasi, check-in dan antrean",
    "Dokter RJ":"Konsultasi dan catatan klinis",
    "Perawat":"Asuhan dan pemantauan pasien",
    "Dokter IGD":"Triase dan penanganan darurat",
    "Bed Manager":"Penempatan dan kesiapan tempat tidur",
    "ATLM":"Spesimen dan hasil laboratorium",
    "Farmasis":"Telaah resep dan pelayanan farmasi",
    "Kasir":"Tagihan dan pembayaran",
    "Manajemen RS":"Ringkasan operasional rumah sakit",
    "Admin Sistem":"Pengaturan dan tata kelola sistem",
    "Radiografer":"Pemeriksaan radiologi",
    "Radiolog":"Pembacaan dan verifikasi radiologi",
    "Petugas MCU":"Pelaksanaan paket MCU",
    "Koordinator MCU":"Koordinasi layanan MCU"
  };
  var statuses = ["Semua", "Perlu ditinjau", "Menunggu", "Dalam proses"];
  var state = Object.create(null);
  var original = v5.renderPage;

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }
  function keyFor(role,section) { return role + "::" + (section || "home"); }
  function getState(key) {
    if (!state[key]) state[key] = {filter:"Semua",query:""};
    return state[key];
  }
  function matches(job,filter,query) {
    var statusOK = filter === "Semua" || job.status === filter;
    var haystack = [job.id,job.title,job.scope,job.reason,job.status,
      job.progress && job.progress.label]
      .join(" ").toLocaleLowerCase("id-ID");
    return statusOK && haystack.includes(String(query||"").trim().toLocaleLowerCase("id-ID"));
  }
  function contextMarkup(ctx,selected,patient) {
    var isPatient = !!patient;
    var caption = isPatient ? "Pasien / episode pelayanan" :
      (selected.kind === "bed" ? "Objek tempat tidur" : "Pekerjaan unit");
    var title = isPatient ? patient.name : selected.title;
    var left = '<div class="v12-context-title"><span class="v12-context-eyebrow">' +
      escapeHTML(roleDescriptions[ctx.role]||ctx.role) + ' · DATA DEMO</span>' +
      '<strong>' + escapeHTML(title) + '</strong><small>' +
      escapeHTML(caption + " · " + selected.scope) + '</small></div>';
    var chips = '<span>' + escapeHTML(selected.id) + '</span>' +
      (isPatient ? '<span>' + escapeHTML(patient.mrn || "RM-DEMO") + '</span>' +
      '<span>' + escapeHTML(patient.visit || "ENC-DEMO") + '</span>' :
      '<span>Tanpa tautan pasien</span>');
    return '<div class="v12-context" aria-label="Konteks pekerjaan yang dipilih">' +
      left + '<div class="v12-context-chips">' + chips + '</div></div>';
  }
  function toolbarMarkup(jobs,filter) {
    return '<div class="v12-filterbar" role="group" aria-label="Filter status pekerjaan">' +
      '<span>Filter pekerjaan</span>' + statuses.map(function(status){
        var count = status === "Semua" ? jobs.length :
          jobs.filter(function(j){ return j.status === status; }).length;
        return '<button type="button" class="v12-filter" data-v12-filter="' +
          escapeHTML(status) + '" aria-pressed="' + String(status===filter) + '">' +
          escapeHTML(status) + ' (' + count + ')</button>';
      }).join("") + '</div>';
  }
  v5.renderPage = function (ctx) {
    var html = original(ctx);
    if (!ctx || !targetRoles.includes(ctx.role) ||
        String(ctx.username||"").indexOf("reviewer.")===0 ||
        typeof html !== "string" || html.indexOf('class="uxv4 uxv5"') < 0) return html;
    var jobs = v5.jobRows(ctx.role,ctx.section);
    if (!Array.isArray(jobs) || jobs.length===0) return html;
    var position = Number(ctx.selectedJob);
    if (!Number.isInteger(position) || position<0 || position>=jobs.length) position=0;
    var selected=jobs[position];
    var shell=window.__SIMRS_PREVIEW__;
    var selectedContext=v5.selectionContext(ctx.role,ctx.section,position,shell&&shell.patients);
    var patient=selectedContext&&selectedContext.patient;
    var key=keyFor(ctx.role,ctx.section),ui=getState(key);
    var visible=0;
    html = html.replace('class="uxv4 uxv5"','class="uxv4 uxv5 v12-parity"');
    html = html.replace('<section class="uxv5-summary"',
      contextMarkup(ctx,selected,patient) + '<section class="uxv5-summary"');
    /* The gallery shows numeric worklist summaries, not a technical queue title. */
    html = html.replace(/(<section class="uxv5-summary"[^>]*><div><span>)Daftar kerja(<\/span><strong>)[^<]*(<\/strong><small>)[^<]*(<\/small>)/,
      function(_,a,b,c,d){return a + 'Pekerjaan aktif' + b + String(jobs.length) +
        c + escapeHTML(selected.queue) + d;});
    html = html.replace('<div class="uxv5-layout">',
      toolbarMarkup(jobs,ui.filter) + '<div class="uxv5-layout">');
    html = html.replace('id="uxv5-search" type="search"',
      'id="uxv5-search" type="search" value="' + escapeHTML(ui.query) + '"');
    html = html.replace(/<tr class="([^"]*)" data-uxv5-row="([0-9]+)">/g,
      function(_,className,number){
        var i=Number(number),row=jobs[i],shown=row&&matches(row,ui.filter,ui.query);
        if(shown) visible++;
        return '<tr class="' + className + '" data-uxv5-row="' + number +
          '" data-v12-status="' + escapeHTML(row?row.status:"") + '"' +
          ' aria-selected="' + String(i===position) + '"' +
          (shown?'':' data-v12-hidden="true"') + '>';
      });
    if (visible===0) {
      html = html.replace('id="uxv5-empty" class="uxv5-empty" hidden',
        'id="uxv5-empty" class="uxv5-empty"');
    }
    return html;
  };
  function updateVisible(root) {
    if (!root) return;
    var role=root.getAttribute("data-uxv4-role");
    var section=root.getAttribute("data-uxv4-section");
    var ui=getState(keyFor(role,section));
    var jobs=v5.jobRows(role,section),visible=0,first=null;
    root.querySelectorAll("tr[data-uxv5-row]").forEach(function(tr){
      var i=Number(tr.getAttribute("data-uxv5-row"));
      var show=!!jobs[i]&&matches(jobs[i],ui.filter,ui.query);
      if (show) {visible++;if (!first) first=tr;}
      if (show) tr.removeAttribute("data-v12-hidden");
      else tr.setAttribute("data-v12-hidden","true");
    });
    root.querySelectorAll("[data-v12-filter]").forEach(function(button){
      button.setAttribute("aria-pressed",String(button.getAttribute("data-v12-filter")===ui.filter));
    });
    var empty=root.querySelector("#uxv5-empty");
    if (empty) { empty.hidden=visible!==0;empty.textContent="Tidak ada pekerjaan yang sesuai dengan filter atau pencarian."; }
    return first;
  }
  document.addEventListener("click",function(event){
    var b=event.target.closest("[data-v12-filter]");
    if (!b) return;
    var root=b.closest(".uxv5.v12-parity");
    if (!root) return;
    var role=root.getAttribute("data-uxv4-role");
    var section=root.getAttribute("data-uxv4-section");
    var status=b.getAttribute("data-v12-filter");
    if (!statuses.includes(status)) return;
    getState(keyFor(role,section)).filter=status;
    var first=updateVisible(root);
    var selected=root.querySelector('tr[data-uxv5-row][aria-selected="true"]');
    if (first && (!selected || selected.hasAttribute("data-v12-hidden"))) {
      var choose=first.querySelector('[data-demo-action^="job:"]');
      if (choose) choose.click();
    }
  });
  /* Existing V5 handler runs first; this combines search and status instead of
   * allowing the legacy text-search routine to reveal filtered-out rows. */
  document.addEventListener("input",function(event){
    if (!event.target || event.target.id!=="uxv5-search") return;
    var root=event.target.closest(".uxv5.v12-parity");
    if (!root) return;
    var key=keyFor(root.getAttribute("data-uxv4-role"),root.getAttribute("data-uxv4-section"));
    getState(key).query=String(event.target.value||"");
    updateVisible(root);
  });
  window.SIMRSOperationalParityV12={
    roles:targetRoles.slice(),statuses:statuses.slice(),matches:matches
  };
})();
