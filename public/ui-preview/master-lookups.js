/* SIMRS Baru — synthetic master reference fixtures.
 * Demonstration only: no real identifiers, API lookups, clinical credentials, or approved tariffs.
 */
(function () {
  "use strict";
  var units = [
    {id:"UNIT-DEMO-01",value:"Poli Umum",label:"Poli Umum · Klinik Rawat Jalan"},
    {id:"UNIT-DEMO-02",value:"Penyakit Dalam",label:"Penyakit Dalam · Klinik Rawat Jalan"},
    {id:"UNIT-DEMO-03",value:"Jantung",label:"Jantung · Klinik Rawat Jalan"},
    {id:"UNIT-DEMO-04",value:"IGD",label:"IGD · Instalasi Gawat Darurat"},
    {id:"UNIT-DEMO-05",value:"Rawat Inap",label:"Rawat Inap · Bangsal"},
    {id:"UNIT-DEMO-06",value:"Laboratorium",label:"Laboratorium · Penunjang"},
    {id:"UNIT-DEMO-07",value:"Farmasi",label:"Farmasi · Instalasi"}
  ];
  var doctors = [
    {id:"PRACT-DEMO-01",value:"dr. Demo",label:"dr. Demo · Poli Umum",unit:"Poli Umum"},
    {id:"PRACT-DEMO-02",value:"dr. Ratih Demo",label:"dr. Ratih Demo · Penyakit Dalam",unit:"Penyakit Dalam"},
    {id:"PRACT-DEMO-03",value:"dr. Andi Demo",label:"dr. Andi Demo · Jantung",unit:"Jantung"},
    {id:"PRACT-DEMO-04",value:"dr. IGD Demo",label:"dr. IGD Demo · IGD",unit:"IGD"},
    {id:"PRACT-DEMO-05",value:"dr. Rawat Inap Demo",label:"dr. Rawat Inap Demo · Rawat Inap",unit:"Rawat Inap"}
  ];
  var services = [
    {id:"SRV-DEMO-CBC",value:"CBC — Darah lengkap",label:"CBC · Darah lengkap",category:"Penunjang",orderType:"Laboratorium",price:85000},
    {id:"SRV-DEMO-GLU",value:"GLU — Glukosa",label:"GLU · Glukosa",category:"Penunjang",orderType:"Laboratorium",price:45000},
    {id:"SRV-DEMO-XR",value:"XR-CHEST — Foto thorax",label:"XR-CHEST · Foto thorax",category:"Penunjang",orderType:"Radiologi",price:190000},
    {id:"SRV-DEMO-ECG",value:"ECG — EKG",label:"ECG · EKG",category:"Tindakan",orderType:"Tindakan",price:110000},
    {id:"SRV-DEMO-LAB01",value:"LAB-DEMO-01",label:"LAB-DEMO-01 · Layanan lab sintetis",category:"Penunjang",orderType:"Laboratorium",price:75000}
  ];
  var medications = [
    {id:"MED-DEMO-PARA",value:"PARA-500 — Parasetamol 500 mg",label:"PARA-500 · Parasetamol 500 mg"},
    {id:"MED-DEMO-AMOX",value:"AMOX-500 — Amoksisilin 500 mg",label:"AMOX-500 · Amoksisilin 500 mg"},
    {id:"MED-DEMO-OMEP",value:"OMEP-20 — Omeprazol 20 mg",label:"OMEP-20 · Omeprazol 20 mg"}
  ];
  var doctorKeys = ["CORE-10:practitioner","RME-01:practitioner","RME-04:author",
    "RME-08:orderer","MED-04:prescriber"];
  var unitKeys = ["CORE-04:unit","CORE-09:unit","CORE-10:unit","RME-01:unit"];
  var serviceKeys = ["FIN-01:service_ref","RME-08:service_code"];
  var medicationKeys = ["MED-04:medication_code","MED-05:medication_code"];
  function esc(v) {
    return String(v === undefined || v === null ? "" : v)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }
  function kind(code,key) {
    var name=code+":"+key;
    if(unitKeys.indexOf(name)>=0)return "unit";
    if(doctorKeys.indexOf(name)>=0)return "doctor";
    if(serviceKeys.indexOf(name)>=0)return "service";
    if(medicationKeys.indexOf(name)>=0)return "medication";
    return "";
  }
  function supports(code,key) {return kind(code,key)!=="";}
  function entries(code,key,values) {
    var type=kind(code,key),data=type==="unit"?units:type==="doctor"?doctors:
      type==="service"?services:type==="medication"?medications:[];
    if(type==="doctor" && (code==="CORE-10"||code==="RME-01") && values && values.unit)
      return data.filter(function(r){return r.unit===values.unit;});
    if(type==="service" && code==="RME-08")
      return data.filter(function(r){return r.value!=="LAB-DEMO-01";});
    return data.slice();
  }
  function find(code,key,value,values) {
    return entries(code,key,values).find(function(r){return r.value===value;}) || null;
  }
  function field(f,values,editable,code) {
    var v=String(values[f.key]===undefined?"":values[f.key]);
    var id="p0-f-"+f.key,type=kind(code,f.key);
    var opts=entries(code,f.key,values);
    var hasValue=opts.some(function(x){return x.value===v;});
    return '<div class="field p0-field p0-master-field" data-field="'+esc(f.key)+'">'+
      '<label for="'+esc(id)+'">'+esc(f.label)+(f.required?' <span class="p0-required" aria-label="wajib">*</span>':'')+'</label>'+
      '<select name="'+esc(f.key)+'" id="'+esc(id)+'" class="forminput" data-master-field="'+esc(type)+'"'+
      (editable?'':' disabled')+(f.required?' required':'')+'><option value="">— Pilih dari master demo —</option>'+
      opts.map(function(o){return '<option value="'+esc(o.value)+'"'+(v===o.value?' selected':'')+'>'+esc(o.label)+'</option>';}).join("")+
      (v&&!hasValue?'<option selected value="'+esc(v)+'">Tidak ada pada master: '+esc(v)+'</option>':"")+
      '</select><span class="hint" data-master-meta="'+esc(f.key)+'">'+
      esc(find(code,f.key,v,values)?"Master sintetis: "+find(code,f.key,v,values).id:
        "Master "+type+" sintetis · tanpa API / registri asli")+
      '</span><span class="p0-error" data-error-for="'+esc(f.key)+'" aria-live="polite"></span></div>';
  }
  function validate(module,values,review) {
    if(!module||!values)return [];
    var errors=[];
    module.fields.forEach(function(f){
      if(!supports(module.code,f.key))return;
      var val=String(values[f.key]||"").trim();
      if(!val)return; // Generic required-field validation remains the source of truth.
      if(!find(module.code,f.key,val,values)) {
        errors.push({key:f.key,label:f.label,message:"Pilih nilai yang valid dari master sintetis untuk unit/role terkait."});
      }
    });
    if(module.code==="FIN-01" && values.service_ref) {
      var service=find("FIN-01","service_ref",values.service_ref);
      if(service && String(values.unit_price||"").trim()!==String(service.price))
        errors.push({key:"unit_price",label:"Harga satuan (Rp)",message:"Tarif harus sama dengan tarif master demo; revisi pilihan layanan."});
      if(service && values.charge_category && values.charge_category!==service.category)
        errors.push({key:"charge_category",label:"Kategori charge",message:"Kategori harus sesuai kelompok tarif master demo."});
    }
    return errors;
  }
  function updateDependent(form,code,key) {
    var values={};form.querySelectorAll(".p0-fields [name]").forEach(function(n){values[n.name]=n.value;});
    if(code==="CORE-10"||code==="RME-01") {
      if(key==="unit"){
        var input=form.querySelector('[name="practitioner"]');
        if(input){
          var current=input.value;
          var docOptions=entries(code,"practitioner",values);
          input.innerHTML='<option value="">— Pilih dokter demo pada unit ini —</option>'+
            docOptions.map(function(o){return '<option value="'+esc(o.value)+'"'+(o.value===current?' selected':'')+'>'+esc(o.label)+'</option>';}).join("");
          if(!docOptions.some(function(o){return o.value===current;}))input.value="";
          var doctorMeta=form.querySelector('[data-master-meta="practitioner"]');
          if(doctorMeta)doctorMeta.textContent=input.value?"Master sintetis: "+(find(code,"practitioner",input.value,values)||{}).id:"Pilih dokter sesuai unit dari master demo.";
        }
      }
    }
    if(code==="FIN-01"&&key==="service_ref"){
      var service=find(code,key,values[key]);
      var price=form.querySelector('[name="unit_price"]');
      var category=form.querySelector('[name="charge_category"]');
      if(service){
        if(price)price.value=String(service.price);
        if(category)category.value=service.category;
      }else {
        if(price)price.value="";
        if(category)category.value="";
      }
    }
    var active=form.querySelector('[name="'+key+'"]'),meta=form.querySelector('[data-master-meta="'+key+'"]');
    if(active&&meta) {
      var selected=find(code,key,active.value,values);
      meta.textContent=selected?"Master sintetis: "+selected.id+" · data contoh":"Pilih dari master demo; bukan data RS sebenarnya.";
    }
  }
  document.addEventListener("change",function(event){
    var target=event.target;
    if(!target || !target.matches || !target.matches("[data-master-field]"))return;
    var form=target.closest("#p0-editor");
    if(!form)return;
    var code=form.getAttribute("data-form-module");if(!code)return;
    updateDependent(form,code,target.name);
  });
  window.SIMRSMasterLookups={
    units:units,doctors:doctors,services:services,medications:medications,
    supports:supports,entries:entries,find:find,field:field,validate:validate
  };
})();
