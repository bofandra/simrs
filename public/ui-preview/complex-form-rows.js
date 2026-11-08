/* SIMRS Baru — item-level composers for CPOE and e-Resep.
 * Browser-only prototype. Items are not API DTOs or executable orders.
 */
(function () {
  "use strict";
  var MAX_ITEMS = 12;
  function moduleFor(code) {
    return (window.SIMRS_FORM_CATALOG || []).find(function (m) { return m.code === code; });
  }
  function fieldFor(code, key) {
    var m = moduleFor(code);
    return m && m.fields.find(function (f) { return f.key === key; });
  }
  var configs = {
    "RME-08": {
      title: "Daftar item CPOE (simulasi)",
      description: "Satu draft order dapat berisi beberapa layanan. Kategori pemeriksaan mengikuti Jenis order pada header. Ini belum membentuk payload items[] API.",
      hidden: ["service_code"],
      scalar: ["service_code"],
      fields: [
        fieldFor("RME-08", "service_code"),
        {key:"quantity",label:"Jumlah pemeriksaan",type:"number",required:true,min:1,max:20},
        {key:"clinical_question",label:"Pertanyaan klinis per item",type:"text",required:false}
      ]
    },
    "MED-04": {
      title: "Daftar item e-Resep (simulasi)",
      description: "Setiap baris memuat obat, dosis, rute, frekuensi, dan jumlah. Review alergi di header tetap wajib; tidak membuat resep yang dapat ditebus.",
      hidden: ["medication_code", "dose", "route", "frequency", "quantity"],
      scalar: ["medication_code", "dose", "route", "frequency", "quantity"],
      fields: ["medication_code", "dose", "route", "frequency", "quantity"].map(function (key) {
        return fieldFor("MED-04", key);
      })
    }
  };
  function esc(value) {
    return String(value === undefined || value === null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function itemsFrom(code, values) {
    var cfg = configs[code];
    if (!cfg) return [];
    if (Array.isArray(values && values.items)) {
      return values.items.filter(function (row) {
        return row && typeof row === "object" && !Array.isArray(row);
      }).slice(0, MAX_ITEMS).map(function (row) { return Object.assign({}, row); });
    }
    var first = {};
    cfg.scalar.forEach(function (key) {
      if (values && values[key] !== undefined) first[key] = String(values[key]);
    });
    return [first];
  }
  function fieldMarkup(f, value, index, editable) {
    var name = "line-" + index + "-" + f.key;
    var attrs = ' class="forminput" name="' + esc(name) + '" data-line-input="' + esc(f.key) + '" id="' + esc(name) + '"' +
      (editable ? '' : ' disabled') + (f.required ? ' required' : '') +
      (f.min !== undefined ? ' min="' + esc(f.min) + '"' : '') +
      (f.max !== undefined ? ' max="' + esc(f.max) + '"' : '');
    var control;
    if (f.type === "select") {
      control = '<select' + attrs + '><option value="">— Pilih —</option>' +
        (f.options || []).map(function (option) {
          return '<option value="' + esc(option) + '"' + (String(value) === String(option) ? ' selected' : '') +
            '>' + esc(option) + '</option>';
        }).join('') + '</select>';
    } else {
      control = '<input type="' + (f.type === "number" ? "number" : "text") + '"' + attrs +
        ' value="' + esc(value) + '" autocomplete="off" />';
    }
    return '<div class="field p0-field" data-field="' + esc(name) + '">' +
      '<label for="' + esc(name) + '">' + esc(f.label) + (f.required ? ' <span class="p0-required">*</span>' : '') + '</label>' +
      control + '<span class="p0-error" data-error-for="' + esc(name) + '" aria-live="polite"></span></div>';
  }
  function renderRows(code, rows, editable) {
    var cfg = configs[code];
    return rows.map(function (row, index) {
      return '<fieldset class="p0-line-row" data-line-row="' + index + '">' +
        '<legend>Item ' + (index + 1) + '</legend><div class="p0-line-fields">' +
        cfg.fields.map(function (f) { return fieldMarkup(f, row[f.key] || "", index, editable); }).join('') +
        '</div>' + (editable ? '<button type="button" class="btn btn-sm" data-line-action="remove" data-line-index="' + index +
        '" aria-label="Hapus item ' + (index + 1) + '">Hapus item</button>' : '') + '</fieldset>';
    }).join('');
  }
  function render(code, values, editable) {
    var cfg = configs[code];
    if (!cfg) return "";
    var rows = itemsFrom(code, values || {});
    return '<section class="p0-line-editor" data-line-editor="' + esc(code) + '" data-line-editable="' + (editable ? 'yes' : 'no') + '">' +
      '<div class="p0-line-head"><div><h3>' + esc(cfg.title) + '</h3><p>' + esc(cfg.description) + '</p></div>' +
      '<span class="p0-pill">' + rows.length + ' item</span></div>' +
      '<div class="p0-line-rows">' + renderRows(code, rows, editable) + '</div>' +
      (editable ? '<button type="button" class="btn" data-line-action="add">+ Tambah item</button>' : '') +
      '<p class="hint">Batas 12 item per draft demo. Tidak ada transaksi, verifikasi klinis, maupun pengiriman API.</p></section>';
  }
  function readRows(section) {
    return Array.from(section.querySelectorAll("[data-line-row]")).map(function (element) {
      var row = {};
      element.querySelectorAll("[data-line-input]").forEach(function (input) {
        row[input.getAttribute("data-line-input")] = String(input.value || "").trim();
      });
      return row;
    });
  }
  function collect(code, form) {
    var cfg = configs[code], section = form && form.querySelector('[data-line-editor="' + code + '"]');
    if (!cfg || !section) return null;
    var items = readRows(section), scalar = {};
    cfg.scalar.forEach(function (key) { scalar[key] = items.length ? (items[0][key] || "") : ""; });
    return {items:items,scalar:scalar};
  }
  function validate(code, values, review) {
    var cfg = configs[code];
    if (!cfg || !Array.isArray(values && values.items)) return [];
    var errors = [], seen = {};
    if (review && !values.items.length) {
      errors.push({key:"line-add", label:"Daftar item", message:"Tambahkan sedikitnya satu item."});
    }
    if (values.items.length > MAX_ITEMS) {
      errors.push({key:"line-add",label:"Daftar item",message:"Maksimal 12 item per draft."});
    }
    values.items.forEach(function (row, i) {
      if (!row || typeof row !== "object") {
        errors.push({key:"line-" + i + "-service_code",label:"Item " + (i + 1),message:"Format item tidak valid."});
        return;
      }
      cfg.fields.forEach(function (f) {
        var v = String(row[f.key] === undefined || row[f.key] === null ? "" : row[f.key]).trim();
        var key = "line-" + i + "-" + f.key;
        if (review && f.required && !v) {
          errors.push({key:key,label:"Item " + (i + 1) + " · " + f.label,message:"Field wajib diisi sebelum review."});
          return;
        }
        if (!v) return;
        if (f.type === "select" && (f.options || []).indexOf(v) < 0) {
          errors.push({key:key,label:"Item " + (i + 1) + " · " + f.label,message:"Kode tidak ada di katalog sintetis."});
        }
        if (f.type === "number" && (!Number.isFinite(Number(v)) || Number(v) % 1 !== 0 ||
          (f.min !== undefined && Number(v) < f.min) || (f.max !== undefined && Number(v) > f.max))) {
          errors.push({key:key,label:"Item " + (i + 1) + " · " + f.label,message:"Jumlah harus bilangan bulat dalam batas yang ditentukan."});
        }
      });
      if (!review) return;
      if (code === "RME-08") {
        var service = String(row.service_code || "");
        var group = service.indexOf("CBC") === 0 || service.indexOf("GLU") === 0 ? "Laboratorium" :
          service.indexOf("XR-") === 0 ? "Radiologi" : service.indexOf("ECG") === 0 ? "Tindakan" : "";
        if (service && group !== values.order_type) {
          errors.push({key:"line-" + i + "-service_code",label:"Item " + (i + 1) + " · Kategori layanan",
            message:values.order_type === "Obat" ? "Gunakan form MED-04 untuk e-Resep." : "Jenis pemeriksaan harus sesuai jenis order di header."});
        }
        if (service && seen[service]) {
          errors.push({key:"line-" + i + "-service_code",label:"Item " + (i + 1) + " · Layanan",
            message:"Layanan yang sama sudah tercantum. Ubah jumlah pada baris sebelumnya."});
        }
        seen[service] = true;
      }
      if (code === "MED-04") {
        var medication = String(row.medication_code || "");
        if (medication && seen[medication]) {
          errors.push({key:"line-" + i + "-medication_code",label:"Item " + (i + 1) + " · Obat",
            message:"Obat yang sama sudah tercantum. Ubah jumlah pada baris sebelumnya."});
        }
        seen[medication] = true;
      }
    });
    return errors;
  }
  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-line-action]");
    if (!button) return;
    event.preventDefault();
    var section = button.closest("[data-line-editor]");
    if (!section || section.getAttribute("data-line-editable") !== "yes") return;
    var code = section.getAttribute("data-line-editor"), rows = readRows(section);
    if (!configs[code]) return;
    if (button.getAttribute("data-line-action") === "add") {
      if (rows.length >= MAX_ITEMS) return;
      rows.push({});
    } else {
      var index = Number(button.getAttribute("data-line-index"));
      if (!Number.isInteger(index) || index < 0 || index >= rows.length) return;
      rows.splice(index, 1);
    }
    section.querySelector(".p0-line-rows").innerHTML = renderRows(code, rows, true);
    section.querySelector(".p0-line-head .p0-pill").textContent = rows.length + " item";
    var focus = section.querySelector('[data-line-row="' + (rows.length - 1) + '"] [data-line-input]');
    if (focus) focus.focus();
    else section.querySelector('[data-line-action="add"]').focus();
  });
  window.SIMRSLineItems = {
    supported:function (code) { return !!configs[code]; },
    skipFields:function (code) { return configs[code] ? configs[code].hidden.slice() : []; },
    itemsFrom:itemsFrom, render:render, collect:collect, validate:validate
  };
})();
