/* Demo-only traceability between source and destination form records.
 * Never creates clinical transactions or posts to a backend.
 * A "Reviewed (Demo)" record is NOT a signed, released, or authorized source.
 */
(function(){
  "use strict";
  var edges=[
    {from:"CORE-08",to:"CORE-09",label:"Registrasi kunjungan"},
    {from:"CORE-10",to:"CORE-09",label:"Check-in pasien"},
    {from:"CORE-09",to:"RME-01",label:"Kunjungan rawat jalan"},
    {from:"CORE-09",to:"RME-02",label:"Triase IGD"},
    {from:"RME-02",to:"RME-03",label:"Admission (draft)"},
    {from:"RME-01",to:"RME-04",label:"Catatan SOAP / CPPT"},
    {from:"RME-01",to:"RME-05",label:"Asesmen & TTV"},
    {from:"RME-04",to:"RME-06",label:"Diagnosis"},
    {from:"RME-04",to:"RME-08",label:"CPOE Order"},
    {from:"RME-04",to:"MED-04",label:"Rencana resep"},
    {from:"RME-04",to:"RME-10",label:"Rujukan demo"},
    {from:"RME-08",to:"MED-01",label:"Pemeriksaan lab",only:"Laboratorium"},
    {from:"RME-08",to:"MED-02",label:"Pemeriksaan radiologi",only:"Radiologi"},
    {from:"RME-08",to:"FIN-01",label:"Rencana charge"},
    {from:"MED-01",to:"FIN-01",label:"Rencana charge lab"},
    {from:"MED-02",to:"MED-03",label:"Studi PACS demo"},
    {from:"MED-04",to:"MED-05",label:"Persiapan dispensing (bukan release)"},
    {from:"FIN-01",to:"FIN-02",label:"Draft invoice"},
    {from:"FIN-02",to:"FIN-03",label:"Draft alokasi pembayaran (tanpa settlement)"},
    {from:"FIN-02",to:"FIN-07",label:"Dossier klaim (draft)"},
    {from:"RME-03",to:"MED-11",label:"Asesmen gizi"},
    {from:"MED-11",to:"OPS-05",label:"Rencana tray gizi"},
    {from:"MED-06",to:"MED-07",label:"Rencana anestesi"}
  ];
  function safeValues(v){return v&&typeof v==="object"&&!Array.isArray(v)?v:{};}
  function edgesFrom(code,values){
    return edges.filter(function(x){
      if(x.from!==code)return false;
      if(!x.only)return true;
      return safeValues(values).order_type===x.only;
    });
  }
  function targetValue(fields,key,value){
    if(value === undefined || value === null || value === "")return undefined;
    var f=fields.find(function(x){return x.key===key;});
    if(!f)return undefined;
    var str=String(value);
    if(f.type==="select" && f.options.indexOf(str)<0)return undefined;
    return str;
  }
  function suggest(sourceModule,sourceRecord,targetModule) {
    var values=safeValues(sourceRecord.values),result={};
    function copy(destKey,srcKey) {
      var proposed=targetValue(targetModule.fields,destKey,values[srcKey]);
      if(proposed!==undefined)result[destKey]=proposed;
    }
    var k=sourceModule.code+">"+targetModule.code;
    if(k==="CORE-10>CORE-09")copy("unit","unit");
    if(k==="CORE-09>RME-01")copy("unit","unit");
    if(k==="RME-08>MED-01"){copy("test_code","service_code");result.accession="ACC-DEMO-"+sourceRecord.id;}
    if(k==="RME-08>MED-02"){copy("priority","priority");copy("exam_code","service_code");result.order_reference=sourceRecord.id;}
    if(k==="MED-02>MED-03"){result.order_reference=sourceRecord.id;}
    if(k==="MED-04>MED-05"){result.prescription_ref=sourceRecord.id;copy("medication_code","medication_code");}
    if(k==="MED-01>FIN-01"){result.source_order=sourceRecord.id;copy("service_ref","test_code");}
    if(k==="RME-08>FIN-01"){result.source_order=sourceRecord.id;copy("service_ref","service_code");}
    if(k==="FIN-01>FIN-02"){
      var count=Number(values.quantity),unitPrice=Number(values.unit_price);
      if(Number.isFinite(count)&&Number.isFinite(unitPrice)&&count>=0&&unitPrice>=0)
        result.subtotal=String(count*unitPrice);
      result.invoice_no="INV-DEMO-"+sourceRecord.id;
    }
    if(k==="FIN-02>FIN-03"){
      result.invoice_ref=sourceRecord.id;
      var subtotal=Number(values.subtotal),discount=Number(values.discount||0);
      if(Number.isFinite(subtotal)&&Number.isFinite(discount)&&subtotal>=discount)
        result.amount=String(subtotal-discount);
    }
    if(k==="FIN-02>FIN-07"){result.invoice_reference=sourceRecord.id;var amt=targetValue(targetModule.fields,"claim_amount",values.subtotal);if(amt!==undefined)result.claim_amount=amt;}
    if(k==="RME-03>MED-11")result.assessed_at="";
    if(k==="MED-11>OPS-05"){result.diet_order_reference=sourceRecord.id;copy("diet_type","diet_type");}
    if(k==="MED-06>MED-07")result.surgery_case_ref=sourceRecord.id;
    return result;
  }
  window.SIMRSDemoLinks={edges:edges,edgesFrom:edgesFrom,suggest:suggest};
})();
