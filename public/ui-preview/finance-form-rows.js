/* SIMRS Baru — finance line-item UI; demo references only.
 * No ledger, cash movement, API/claim submissions or actual settlement.
 */
(function () {
  "use strict";
  var MAX = 12;
  var refs = {records:{},ctx:null};
  function esc(value) {
    return String(value === undefined || value === null ? "" : value)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }
  function integer(v) {
    if (v === "" || v === null || v === undefined || !/^\d+$/.test(String(v))) return null;
    var num=Number(v);
    return Number.isSafeInteger(num) ? num : null;
  }
  function money(value) { return "Rp " + Number(value||0).toLocaleString("id-ID"); }
  function chargeTotal(record) {
    if (!record || !record.values) return null;
    var quantity=integer(record.values.quantity);
    var unitPrice=integer(record.values.unit_price);
    var result=quantity!==null && unitPrice!==null ? quantity*unitPrice : null;
    return quantity>0 && unitPrice>=0 && Number.isSafeInteger(result) ? result : null;
  }
  function invoiceTotal(record) {
    if (!record || !record.values) return null;
    var sub=integer(record.values.subtotal),disc=integer(record.values.discount||"0");
    if (sub===null || disc===null || disc>sub) return null;
    return sub-disc;
  }
  function eligible(records, code,ctx) {
    if (!ctx || !ctx.patient || !ctx.patient.id || !ctx.patient.visit) return [];
    return (Array.isArray(records && records[code]) ? records[code] : []).filter(function(r){
      return r && r.status==="Reviewed (Demo)" && r.patient_id===ctx.patient.id &&
        r.encounter_id===ctx.patient.visit &&
        (code==="FIN-01" ? chargeTotal(r)!==null : invoiceTotal(r)!==null);
    });
  }
  function skipFields(code) {
    return code==="FIN-02"?["subtotal"]:code==="FIN-03"?["invoice_ref","amount"]:[];
  }
  function itemsFrom(code,values) {
    values=values||{};
    if(code==="FIN-02") {
      if(Array.isArray(values.charge_lines))return values.charge_lines.slice(0,MAX).map(function(x){return {charge_ref:String(x.charge_ref||"")};});
      if(Array.isArray(values.charge_ids))return values.charge_ids.slice(0,MAX).map(function(x){return {charge_ref:String(x||"")};});
      return [{charge_ref:""}];
    }
    if(code==="FIN-03") {
      if(Array.isArray(values.allocations))return values.allocations.slice(0,MAX).map(function(x){return {invoice_ref:String(x.invoice_ref||""),amount:String(x.amount||"")};});
      return [{invoice_ref:String(values.invoice_ref||""),amount:String(values.amount||"")}];
    }
    return [];
  }
  function options(records,code,ctx,selected) {
    var list=eligible(records,code,ctx);
    var html='<option value="">— Pilih catatan Reviewed (Demo) —</option>';
    list.forEach(function(r){
      var amount=code==="FIN-01"?chargeTotal(r):invoiceTotal(r);
      var name=code==="FIN-01"?String(r.values.service_ref||"Charge"):String(r.values.invoice_no||"Invoice");
      html+='<option value="'+esc(r.id)+'"'+(r.id===selected?' selected':'')+'>'+esc(r.id+" · "+name+" · "+money(amount))+'</option>';
    });
    if(selected && !list.some(function(r){return r.id===selected;})){
      html+='<option value="'+esc(selected)+'" selected>Referensi tidak tersedia/invalid: '+esc(selected)+'</option>';
    }
    return html;
  }
  function line(code,row,index,records,ctx,editable) {
    var invoice=code==="FIN-02";
    var source=invoice?"FIN-01":"FIN-02";
    var key=invoice?"charge_ref":"invoice_ref";
    var id="finance-"+index+"-"+key;
    var record=eligible(records,source,ctx).find(function(r){return r.id===row[key];});
    var amount=record?(invoice?chargeTotal(record):invoiceTotal(record)):null;
    return '<fieldset class="p0-line-row" data-finance-row="'+index+'"><legend>'+esc(invoice?"Charge":"Alokasi")+" "+(index+1)+'</legend>'+
      '<div class="p0-finance-fields"><div class="field p0-field" data-field="'+esc(id)+'"><label for="'+esc(id)+'">'+(invoice?"Referensi charge":"Invoice tujuan")+' <span class="p0-required">*</span></label>'+
      '<select class="forminput" id="'+esc(id)+'" name="'+esc(id)+'" data-finance-ref="'+esc(key)+'"'+(editable?'':' disabled')+' required>'+
      options(records,source,ctx,row[key])+'</select><span class="p0-error" data-error-for="'+esc(id)+'" aria-live="polite"></span></div>'+
      (invoice?'<div class="p0-finance-amount"><span>Nilai charge read-only</span><strong data-finance-line-value="'+index+'">'+(amount!==null?esc(money(amount)):"—")+'</strong></div>':
        '<div class="field p0-field" data-field="finance-'+index+'-amount"><label for="finance-'+index+'-amount">Rencana alokasi (Rp) <span class="p0-required">*</span></label>'+
        '<input class="forminput" id="finance-'+index+'-amount" name="finance-'+index+'-amount" type="number" min="1" step="1" data-finance-amount value="'+esc(row.amount||"")+'"'+(editable?'':' disabled')+' />'+
        '<span class="p0-error" data-error-for="finance-'+index+'-amount" aria-live="polite"></span></div>'+
        '<div class="p0-finance-amount"><span>Nilai invoice yang dapat dialokasikan</span><strong data-finance-line-value="'+index+'">'+(amount!==null?esc(money(amount)):"—")+'</strong></div>')+
      '</div>'+(editable?'<button class="btn btn-sm" type="button" data-finance-action="remove" data-index="'+index+'">Hapus baris</button>':'')+'</fieldset>';
  }
  function drawLines(code,rows,records,ctx,editable) {
    return rows.map(function(row,i){return line(code,row,i,records,ctx,editable);}).join("");
  }
  function totals(code,rows,records,ctx) {
    var source=code==="FIN-02"?"FIN-01":"FIN-02";
    var key=code==="FIN-02"?"charge_ref":"invoice_ref";
    var found=eligible(records,source,ctx);
    if(code==="FIN-02") {
      var sum=rows.reduce(function(n,row){
        var rec=found.find(function(r){return r.id===row[key];});
        return n+(rec?chargeTotal(rec):0);
      },0);
      return Number.isSafeInteger(sum)?sum:null;
    }
    var sumPayment=rows.reduce(function(n,row){return n+(integer(row.amount)||0);},0);
    return Number.isSafeInteger(sumPayment)?sumPayment:null;
  }
  function summaryText(code,rows,records,ctx,discount) {
    var sum=totals(code,rows,records,ctx),disc=integer(discount||"0");
    if(sum===null)return "Nominal melebihi batas angka yang aman.";
    if(code==="FIN-03")return "Total rencana alokasi: "+money(sum)+" · Belum ada penerimaan kas atau settlement.";
    return "Subtotal: "+money(sum)+" · Diskon: "+(disc===null?"tidak valid":money(disc))+
      " · Total invoice demo: "+(disc===null||disc>sum?"perlu koreksi":money(sum-disc));
  }
  function render(code,values,editable,records,ctx) {
    if(code!=="FIN-02"&&code!=="FIN-03")return "";
    refs={records:records||{},ctx:ctx};
    var rows=itemsFrom(code,values);
    var source=code==="FIN-02"?"FIN-01":"FIN-02";
    var available=eligible(records,source,ctx);
    return '<section class="p0-line-editor p0-finance-editor" data-finance-editor="'+code+'" data-finance-editable="'+(editable?"yes":"no")+'">'+
      '<div class="p0-line-head"><div><h3>'+(code==="FIN-02"?"Rincian charge untuk invoice":"Rencana alokasi ke invoice")+'</h3>'+
      '<p>'+(code==="FIN-02"?
      "Pilih charge yang sudah Reviewed (Demo) dalam encounter ini. Subtotal dihitung otomatis dari jumlah × harga satuan yang terkunci pada charge.":
      "Pilih invoice Reviewed (Demo) untuk encounter yang sama dan isi nominal rencana. Belum ada penerimaan pembayaran.")+
      '</p></div><span class="p0-pill" data-finance-count>'+rows.length+' baris</span></div>'+
      (!available.length?'<div class="p0-warning" role="note">Belum ada '+(code==="FIN-02"?"charge FIN-01":"invoice FIN-02")+
      ' yang Reviewed (Demo) pada encounter ini. Buat dan tinjau sumbernya terlebih dahulu.</div>':'')+
      '<div class="p0-line-rows">'+drawLines(code,rows,records,ctx,editable)+'</div>'+
      (editable?'<button class="btn" type="button" data-finance-action="add">+ Tambah '+(code==="FIN-02"?"charge":"alokasi")+'</button>':'')+
      '<output class="p0-finance-summary" data-finance-summary aria-live="polite">'+
      esc(summaryText(code,rows,records,ctx,values&&values.discount))+'</output>'+
      '<p class="hint">Maksimal 12 baris. ID adalah referensi lokal, bukan UUID database. Aksi faktur, payment gateway dan ledger tetap nonaktif.</p></section>';
  }
  function readRows(section) {
    return Array.from(section.querySelectorAll("[data-finance-row]")).map(function(el){
      var input=el.querySelector("[data-finance-ref]");
      var ref=input?String(input.value||"").trim():"";
      if(section.getAttribute("data-finance-editor")==="FIN-02")return {charge_ref:ref};
      var field=el.querySelector("[data-finance-amount]");
      return {invoice_ref:ref,amount:field?String(field.value||"").trim():""};
    });
  }
  function collect(code,form,records,ctx) {
    var section=form&&form.querySelector('[data-finance-editor="'+code+'"]');
    if(!section)return null;
    var rows=readRows(section),sum=totals(code,rows,records,ctx);
    if(code==="FIN-02") {
      return {charge_lines:rows,charge_ids:rows.map(function(x){return x.charge_ref;}).filter(Boolean),
        subtotal:sum===null?"":String(sum)};
    }
    return {allocations:rows,invoice_ref:rows.length?rows[0].invoice_ref:"",amount:sum===null?"":String(sum)};
  }
  function validate(code,values,review,records,ctx) {
    var invoice=code==="FIN-02",key=invoice?"charge_lines":"allocations";
    if((code!=="FIN-02"&&code!=="FIN-03") || !Array.isArray(values&&values[key]))return [];
    var errors=[], rows=values[key],seen={};
    function add(k,label,msg){errors.push({key:k,label:label,message:msg});}
    if(review&&!rows.length)add("finance-add","Daftar baris","Tambahkan paling sedikit satu baris.");
    if(rows.length>MAX)add("finance-add","Daftar baris","Maksimal 12 baris.");
    var allowed=eligible(records,invoice?"FIN-01":"FIN-02",ctx);
    var computed=0,selected=0;
    rows.forEach(function(row,i){
      var refKey=invoice?"charge_ref":"invoice_ref";
      var ref=String(row&&row[refKey]||"").trim();
      var field="finance-"+i+"-"+refKey;
      if(!ref){if(review)add(field,"Baris "+(i+1),"Pilih referensi yang sudah ditinjau.");return;}
      var target=allowed.find(function(r){return r.id===ref;});
      if(!target){add(field,"Baris "+(i+1),"Referensi harus Reviewed (Demo) dan berada dalam pasien/encounter yang sama.");return;}
      if(seen[ref])add(field,"Baris "+(i+1),"Referensi ganda tidak diizinkan.");
      seen[ref]=true;selected++;
      var limit=invoice?chargeTotal(target):invoiceTotal(target);
      if(invoice) {
        computed+=limit;
      } else {
        var value=integer(row.amount);
        if(value===null || value<=0)add("finance-"+i+"-amount","Baris "+(i+1),"Alokasi harus bilangan bulat positif.");
        else {
          if(value>limit)add("finance-"+i+"-amount","Baris "+(i+1),"Alokasi tidak boleh melebihi nilai invoice demo.");
          computed+=value;
        }
      }
    });
    if(review&&!selected)add("finance-add","Daftar baris","Belum ada referensi valid untuk ditinjau.");
    if(!Number.isSafeInteger(computed))add("finance-add","Total","Total melebihi batas bilangan aman.");
    var expected=invoice?values.subtotal:values.amount;
    if(selected && integer(expected)!==computed)add("finance-add","Total","Total harus sama dengan perhitungan setiap baris.");
    if(invoice && Array.isArray(values.charge_ids)) {
      var selectedIds=rows.map(function(x){return x.charge_ref;}).filter(Boolean);
      if(JSON.stringify(selectedIds)!==JSON.stringify(values.charge_ids))add("finance-add","Rincian charge","Daftar charge_ids harus sesuai baris.");
    }
    return errors;
  }
  function updateSummary(section) {
    var rows=readRows(section),code=section.getAttribute("data-finance-editor");
    var sum=summaryText(code,rows,refs.records,refs.ctx,document.querySelector('#p0-editor [name="discount"]')?.value||"0");
    section.querySelector("[data-finance-summary]").textContent=sum;
    var source=code==="FIN-02"?"FIN-01":"FIN-02",key=code==="FIN-02"?"charge_ref":"invoice_ref";
    var list=eligible(refs.records,source,refs.ctx);
    rows.forEach(function(row,i){
      var target=list.find(function(r){return r.id===row[key];});
      var value=target?(code==="FIN-02"?chargeTotal(target):invoiceTotal(target)):null;
      var targetNode=section.querySelector('[data-finance-line-value="'+i+'"]');
      if(targetNode)targetNode.textContent=value===null?"—":money(value);
    });
  }
  document.addEventListener("click",function(e){
    var btn=e.target.closest("[data-finance-action]");if(!btn)return;
    e.preventDefault();
    var section=btn.closest("[data-finance-editor]");
    if(!section||section.getAttribute("data-finance-editable")!=="yes")return;
    var code=section.getAttribute("data-finance-editor"),rows=readRows(section);
    if(btn.getAttribute("data-finance-action")==="add") {
      if(rows.length>=MAX)return;
      rows.push(code==="FIN-02"?{charge_ref:""}:{invoice_ref:"",amount:""});
    } else {
      var ix=Number(btn.getAttribute("data-index"));
      if(!Number.isInteger(ix)||ix<0||ix>=rows.length)return;
      rows.splice(ix,1);
    }
    section.querySelector(".p0-line-rows").innerHTML=drawLines(code,rows,refs.records,refs.ctx,true);
    section.querySelector("[data-finance-count]").textContent=rows.length+" baris";
    updateSummary(section);
    var focus=section.querySelector('[data-finance-row="'+(rows.length-1)+'"] select')||
      section.querySelector('[data-finance-action="add"]');
    if(focus)focus.focus();
  });
  function handleChange(e){
    if(!e.target.matches("[data-finance-ref],[data-finance-amount],#p0-editor [name=discount]"))return;
    var section=e.target.closest("[data-finance-editor]")||document.querySelector("[data-finance-editor]");
    if(section)updateSummary(section);
  }
  document.addEventListener("input",handleChange);
  document.addEventListener("change",handleChange);
  window.SIMRSFinanceLines={
    supported:function(code){return code==="FIN-02"||code==="FIN-03";},
    skipFields:skipFields,eligible:eligible,chargeTotal:chargeTotal,invoiceTotal:invoiceTotal,
    itemsFrom:itemsFrom,render:render,collect:collect,validate:validate
  };
})();
