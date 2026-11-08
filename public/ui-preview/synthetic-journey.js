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

  /* Additional independent, synthetic demo tracks. NO clinical/financial operations. */
  var igd = [
    ["CORE-09",{visit_type:"IGD",unit:"IGD",payer:"Umum",visit_date:"2026-11-08",checkin_state:"Terdaftar",referral_reference:""}],
    ["RME-02",{triage_at:"2026-11-08T13:00",acuity:"Kuning",systolic:"120",diastolic:"80",respiratory_rate:"18",
      triage_note:"Keluhan sintetis untuk latihan alur triase, bukan asesmen medis nyata."}],
    ["RME-04",{note_at:"2026-11-08T13:10",note_type:"SOAP Dokter",subjective:"Keluhan sintetis IGD.",
      objective:"Pemeriksaan simulasi; tidak dapat dipakai untuk pelayanan.",
      assessment:"Perlu pemeriksaan penunjang (demo).",plan:"Rencana pemeriksaan lab sintetis.",author:"dr. IGD Demo"}],
    ["RME-08",{order_type:"Laboratorium",service_code:"CBC — Darah lengkap",priority:"Segera",
      ordered_at:"2026-11-08T13:15",indication:"Pengkajian IGD sintetis",orderer:"dr. IGD Demo"}],
    ["MED-01",{accession:"ACC-IGD-DEMO",specimen_type:"Darah EDTA",collected_at:"2026-11-08T13:45",
      test_code:"CBC",result_value:"7.8",unit_symbol:"10^3/uL",lab_state:"Diterima"}],
    ["FIN-01",{service_ref:"CBC — Darah lengkap",performed_at:"2026-11-08T14:00",
      quantity:"1",unit_price:"85000",charge_category:"Penunjang",source_order:""}],
    ["FIN-02",{invoice_no:"INV-IGD-DEMO",payer:"Umum",subtotal:"85000",discount:"0",due_date:"2026-11-08",invoice_state:"Draft"}]
  ];
  var inpatient = [
    ["CORE-09",{visit_type:"Rawat Inap",unit:"Rawat Inap",payer:"Umum",visit_date:"2026-11-08",checkin_state:"Terdaftar",referral_reference:""}],
    ["OPS-10",{ward:"Bangsal Demo Mawar",room_code:"R-01",bed_code:"BED-DEMO-01",availability:"Kosong",
      checked_at:"2026-11-08T08:15",reason:"Pemeriksaan bed sintetis; tidak melakukan reservasi/penempatan."}],
    ["RME-03",{admission_at:"2026-11-08T09:00",ward:"Bangsal Demo Mawar",bed_code:"BED-DEMO-01",
      admission_state:"Masuk",discharge_at:"",discharge_plan:"Evaluasi sebelum rencana pulang (demo)."}],
    ["RME-04",{note_at:"2026-11-08T09:30",note_type:"SOAP Dokter",subjective:"Keluhan sintetis pasien rawat inap.",
      objective:"Pemeriksaan simulasi tanpa parameter klinis nyata.",assessment:"Rencana observasi rawat inap (demo).",
      plan:"Monitor keadaan umum, telaah diet dan pemeriksaan (demo).",author:"dr. Rawat Inap Demo"}],
    ["RME-05",{measured_at:"2026-11-08T10:00",systolic:"120",diastolic:"80",heart_rate:"76",
      temperature:"36.8",weight:"65",height:"165"}],
    ["MED-11",{nutrition_assessor:"Ahli Gizi Demo",assessed_at:"2026-11-08T11:00",nutrition_risk:"Rendah",
      diet_type:"Biasa",calorie_target:"2000",allergy_diet_review:"Belum ditinjau",
      diet_instruction:"Diet sesuai asesmen lanjutan (simulasi)."}],
    ["OPS-05",{kitchen_batch:"TRAY-DEMO-01",diet_order_reference:"",meal_time:"Siang",
      diet_type:"Biasa",tray_count:"1",production_date:"2026-11-08",kitchen_state:"Direncanakan",
      handover_note:"Rencana saja; tidak ada distribusi makanan."}],
    ["FIN-01",{service_ref:"CBC — Darah lengkap",performed_at:"2026-11-08T12:00",
      quantity:"1",unit_price:"85000",charge_category:"Penunjang",source_order:""}],
    ["FIN-02",{invoice_no:"INV-RI-DEMO",payer:"Umum",subtotal:"85000",
      discount:"0",due_date:"2026-11-08",invoice_state:"Draft"}]
  ];
  var tracks = {
    RJ:{label:"Rawat Jalan",steps:steps.map(function(x){return x[0];})},
    IGD:{label:"IGD",steps:igd.map(function(x){return x[0];})},
    RI:{label:"Rawat Inap",steps:inpatient.map(function(x){return x[0];})}
  };
  function makeFor(flow,patient,now,tag) {
    if(!tracks[flow])throw new Error("Unknown synthetic track");
    if(flow==="RJ")return make(patient,now,tag);
    if(!patient||!patient.id||!patient.visit)throw new Error("Synthetic patient + encounter required");
    var planned=flow==="IGD"?igd:inpatient;
    var prefix=tag||(flow+"-DEMO-"+patient.id+"-"+patient.visit);
    var stamp=now||"2026-11-08T08:00:00.000Z";
    var visitSuffix=String(patient.visit).replace(/[^A-Za-z0-9]/g,"").toUpperCase();
    var byCode={},result=[];
    planned.forEach(function(step){
      var code=step[0],values=Object.assign({},step[1]);
      var parentCode=code==="RME-02"?"CORE-09":code==="RME-03"?"OPS-10":
        code==="OPS-10"?"CORE-09":code==="RME-04"?(flow==="IGD"?"RME-02":"RME-03"):
        code==="RME-05"?"RME-04":code==="RME-08"?"RME-04":code==="MED-01"?"RME-08":
        code==="MED-11"?"RME-03":code==="OPS-05"?"MED-11":
        code==="FIN-01"?(flow==="IGD"?"MED-01":"RME-03"):code==="FIN-02"?"FIN-01":null;
      var parent=parentCode&&byCode[parentCode];
      if(code==="FIN-01" && flow==="IGD")values.source_order=byCode["RME-08"].id;
      if(code==="OPS-05")values.diet_order_reference=byCode["MED-11"].id;
      if(code==="FIN-02"){
        values.invoice_no="INV-"+flow+"-DEMO-"+patient.id.toUpperCase();
        values.charge_lines=[{charge_ref:byCode["FIN-01"].id}];
        values.charge_ids=[byCode["FIN-01"].id];
      }
      if(code==="MED-01")values.accession="ACC-IGD-DEMO-"+patient.id.toUpperCase();
      var record={
        id:"SAMPLE-"+flow+"-"+code+"-"+patient.id.toUpperCase()+"-"+visitSuffix,
        patient_id:patient.id,encounter_id:patient.visit,status:"Draft",scenario_tag:prefix,
        created_at:stamp,updated_at:stamp,
        linked_source:parent?{module:parentCode,record_id:parent.id}:null,
        history:[{at:stamp,event:"Draft "+flow+" sintetis; tidak ada sign, pelayanan, atau transaksi",actor:"Generator demo"}],
        values:values
      };
      byCode[code]=record;
      result.push({code:code,record:record});
    });
    return result;
  }
  window.SIMRSSyntheticJourney={make:make,makeFor:makeFor,flows:tracks,steps:tracks.RJ.steps};
})();
