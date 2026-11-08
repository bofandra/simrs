/* One-click all-synthetic outpatient journey. Never use for real patients.
 * The records created by this generator are DRAFT only and no API is called.
 */
(function () {
  "use strict";
  var steps=[
    ["CORE-10",{
      unit:"Poli Umum",practitioner:"dr. Demo",start_at:"2026-11-08T09:00",
      end_at:"2026-11-08T09:30",appointment_state:"Dipesan",
      visit_reason:"Kontrol pasien sintetis"
    }],
    ["CORE-09",{
      visit_type:"Rawat Jalan",unit:"Poli Umum",payer:"Umum",
      visit_date:"2026-11-08",checkin_state:"Terdaftar",referral_reference:""
    }],
    ["RME-01",{
      recorded_at:"2026-11-08T09:10",unit:"Poli Umum",practitioner:"dr. Demo",
      chief_complaint:"Demam dua hari (data sintetis)",encounter_state:"In-progress",
      follow_up:"Evaluasi setelah hasil penunjang demo"
    }],
    ["RME-04",{
      note_at:"2026-11-08T09:20",note_type:"SOAP Dokter",
      subjective:"Pasien demo melaporkan demam 2 hari.",
      objective:"Pemeriksaan fisik simulasi, tanpa nilai klinis nyata.",
      assessment:"Keluhan demam, perlu tinjauan lebih lanjut (demo).",
      plan:"Rencanakan pemeriksaan darah lengkap (demo).",
      author:"dr. Demo"
    }],
    ["RME-08",{
      order_type:"Laboratorium",service_code:"CBC — Darah lengkap",
      priority:"Rutin",ordered_at:"2026-11-08T09:25",
      indication:"Evaluasi keluhan demam (demo)",orderer:"dr. Demo"
    }],
    ["MED-01",{
      accession:"ACC-DEMO-0001",specimen_type:"Darah EDTA",
      collected_at:"2026-11-08T09:50",test_code:"CBC",
      result_value:"7.8",unit_symbol:"10^3/uL",lab_state:"Diterima"
    }],
    ["MED-04",{
      medication_code:"PARA-500 — Parasetamol 500 mg",
      dose:"500 mg",route:"Oral",frequency:"3x sehari (demo)",
      quantity:"9",allergy_checked:"Belum ditinjau",prescriber:"dr. Demo"
    }],
    ["FIN-01",{
      service_ref:"CBC — Darah lengkap",performed_at:"2026-11-08T10:00",
      quantity:"1",unit_price:"85000",charge_category:"Penunjang",
      source_order:""
    }],
    ["FIN-02",{
      invoice_no:"INV-DEMO-0001",payer:"Umum",
      subtotal:"85000",discount:"0",due_date:"2026-11-08",invoice_state:"Draft"
    }],
    ["FIN-03",{
      invoice_ref:"",payment_method:"Tunai (demo)",amount:"85000",
      payment_at:"2026-11-08T10:20",payment_reference:"",
      verification:"Belum diverifikasi"
    }]
  ];
  var from={
    "CORE-09":"CORE-10",
    "RME-01":"CORE-09",
    "RME-04":"RME-01",
    "RME-08":"RME-04",
    "MED-01":"RME-08",
    "MED-04":"RME-04",
    "FIN-01":"MED-01",
    "FIN-02":"FIN-01",
    "FIN-03":"FIN-02"
  };
  function make(patient,now,tag) {
    if(!patient || !patient.id || !patient.visit) throw new Error("Synthetic patient + encounter required");
    var prefix=tag || ("RJ-DEMO-"+patient.id+"-"+patient.visit);
    var stamp=now || "2026-11-08T08:00:00.000Z";
    var visitSuffix=String(patient.visit).replace(/[^A-Za-z0-9]/g,"").toUpperCase();
    var byCode={}, result=[];
    steps.forEach(function(s,i){
      var code=s[0],values=Object.assign({},s[1]);
      var parent=byCode[from[code]];
      if(code==="FIN-01")values.source_order=byCode["RME-08"].id;
      if(code==="FIN-03")values.invoice_ref=byCode["FIN-02"].id;
      if(code==="FIN-02")values.invoice_no="INV-DEMO-"+patient.id.toUpperCase();
      if(code==="MED-01")values.accession="ACC-DEMO-"+patient.id.toUpperCase();
      var r={
        id:"SAMPLE-"+code+"-"+patient.id.toUpperCase()+"-"+visitSuffix,
        patient_id:patient.id,
        encounter_id:patient.visit,
        status:"Draft",
        scenario_tag:prefix,
        created_at:stamp,
        updated_at:stamp,
        linked_source:parent?{module:from[code],record_id:parent.id}:null,
        history:[{at:stamp,event:"Draft sintetis dari skenario rawat jalan (tidak ada persetujuan/transaction)",actor:"Generator demo"}],
        values:values
      };
      byCode[code]=r;result.push({code:code,record:r});
    });
    return result;
  }
  window.SIMRSSyntheticJourney={make:make,steps:steps.map(function(x){return x[0]})};
})();
