/* SIMRS PRD v3.1 — browser-only API contract adapter.
 * QA/demo only; no patient PHI, financial transactions or national integrations.
 * API calls are Promise based so FE components can swap transport in a future PR.
 */
(function () {
  'use strict';
  const PATIENT='d2f8ba55-b1d0-4fd3-a95e-3bfca006b7f1';
  const ENCOUNTER='85ba4e38-9d86-41ce-9b6e-7f8af4d19768';
  const ORG='DEMO-RS-001';
  let counter=0;
  const uuid=()=> '11111111-1111-4111-8111-'+String(++counter).padStart(12,'0');
  const clone=x=>JSON.parse(JSON.stringify(x));
  const runtime={ patients:[{patientId:PATIENT,mrn:'DEMO-MRN-001',fullName:'Pasien Simulasi A',
      matchScore:1,identifiers:[{system:'MRN',value:'DEMO-MRN-001'}]}],
    encounters:[{id:ENCOUNTER,patientId:PATIENT,status:'in-progress'}],
    orders:[],notes:[],prescriptions:[],replays:new Map() };
  let operations=[],openapi=null;
  const ready=Promise.all([
    fetch('./api-contract-operations.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Catalog HTTP '+r.status);return r.json()}),
    fetch('./api-docs/openapi.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('OpenAPI HTTP '+r.status);return r.json()})
  ]).then(([catalog,contract])=>{
    if(!Array.isArray(catalog.operations)||catalog.operations.length!==180)throw new Error('Expected 180 operations v3.1');
    if(contract.info?.version!=='3.1.0-candidate.1')throw new Error('OpenAPI version mismatch');
    operations=catalog.operations;openapi=contract;return operations;
  });
  function definition(op){return openapi?.paths?.[op.path]?.[op.method.toLowerCase()]}
  function requestExample(op){return clone(definition(op)?.requestBody?.content?.['application/json']?.example??{})}
  function shape(op,value){
    const d=definition(op),status=Object.keys(d?.responses||{}).find(k=>/^2\d\d$/.test(k));
    const schema=d?.responses?.[status]?.content?.['application/json']?.schema;
    if(schema?.properties?.items && Array.isArray(value))return {items:value,pageInfo:{nextCursor:null,pageSize:20,hasMore:false}};
    return value;
  }
  function splitFields(str){
    const result=[];let depth=0,token='';
    for(const char of str){if(char==='['||char==='{')depth++;if(char===']'||char==='}')depth--;
      if(char===','&&depth===0){if(token.trim())result.push(token.trim());token='';}
      else token+=char;}
    if(token.trim())result.push(token.trim());return result;
  }
  function fields(spec){
    const result={};for(const part of splitFields(spec||'')){
      const m=part.match(/^([a-zA-Z]\w*)(\?)?(?:\s*[:=]\s*(.+))?$/);if(!m)continue;
      const name=m[1],value=m[3];
      if(value?.startsWith('['))result[name]=[];
      else if(value?.startsWith('{'))result[name]={};
      else if(value?.includes('|'))result[name]=value.split('|')[0];
      else if(value&&/^[a-z-]+$/.test(value))result[name]=value;
      else if(/(patientId)/i.test(name))result[name]=PATIENT;
      else if(/(encounterId)/i.test(name))result[name]=ENCOUNTER;
      else if(/(^id$|id$)/i.test(name))result[name]=uuid();
      else if(/(count|quantity|qty|version|number|amount|balance|score|numerator|denominator)/i.test(name))result[name]=1;
      else if(/(at$|date$|from$|to$)/i.test(name))result[name]='2026-11-13T08:00:00+07:00';
      else if(name==='status')result[name]='draft';else result[name]='DEMO';
    }return result;
  }
  function responseExample(op){
    const d=definition(op),status=Object.keys(d?.responses||{}).find(k=>/^2\d\d$/.test(k));
    return clone(d?.responses?.[status]?.content?.['application/json']?.example??{});
  }
  function failure(status,code,message,details=[]){
    return {status,headers:{'X-SIMRS-Mock':'true'},simulated:true,
      data:{code,message,details,correlationId:uuid(),retryable:false}};
  }
  function fixture(op,body,pathParams){
    const id=uuid();
    if(op==='searchPatients')return clone(runtime.patients);
    if(op==='createPatient'){
      const p={patientId:id,mrn:'DEMO-MRN-'+String(runtime.patients.length+1).padStart(3,'0'),
        fullName:body.name,identifiers:body.identifiers||[],matchScore:1};runtime.patients.push(p);
      return {patientId:p.patientId,mrn:p.mrn,possibleMatches:[]};
    }
    if(op==='listOutpatientWorklist')return runtime.encounters.map(e=>({encounterId:e.id,patientId:e.patientId,status:e.status}));
    if(op==='createRegistration'){
      const encounterId=uuid();runtime.encounters.push({id:encounterId,patientId:body.patientId,status:'arrived'});
      return {registrationId:id,encounterId,queueTicketId:uuid(),status:'ACTIVE',correlationId:uuid()};
    }
    if(op==='getEncounterChart'){
      const e=runtime.encounters.find(x=>x.id===(pathParams?.id||ENCOUNTER));
      if(!e)return null;
      return {encounter:{id:e.id,class:'outpatient',status:e.status,period:{},unitVisits:[]},
        patient:{id:e.patientId,mrn:'DEMO-MRN-001',fullName:'Pasien Simulasi A',allergies:[],risks:[]},
        notes:runtime.notes.filter(n=>n.encounterId===e.id),observations:[],diagnoses:[],
        orders:runtime.orders.filter(o=>o.encounterId===e.id),
        prescriptions:runtime.prescriptions.filter(p=>p.encounterId===e.id),careTeam:[]};
    }
    if(op==='createClinicalNote'){
      runtime.notes.push({id,encounterId:body.encounterId,status:'draft',version:1});
      return {id,status:'draft',version:1};
    }
    if(op==='signClinicalNote'){
      const note=runtime.notes.find(n=>n.id===pathParams?.id);
      if(!note)return {error:failure(404,'NOTE_NOT_FOUND','Catatan belum dibuat dalam sandbox FE')};
      if(note.status==='signed')return {error:failure(409,'ALREADY_SIGNED','Catatan demo sudah signed')};
      note.status='signed';return {id:note.id,status:'signed',signedAt:new Date().toISOString()};
    }
    if(op==='createServiceOrder'){
      runtime.orders.push({id,encounterId:body.encounterId,category:body.category||'LAB',status:'placed'});
      return {id,status:'placed'};
    }
    if(op==='listLabOrders')return runtime.orders.filter(o=>o.category==='LAB');
    if(op==='createPrescription'){runtime.prescriptions.push({id,encounterId:body.encounterId,items:body.items||[],status:'ordered'});return {id,status:'ordered'}}
    return undefined;
  }
  async function call(operationId,opts={}){
    await ready;
    const op=operations.find(o=>o.operationId===operationId);
    if(!op)return failure(404,'UNKNOWN_OPERATION','operationId tidak dikenal');
    if(opts.scenario&&opts.scenario!=='success'){
      const statuses={forbidden:403,conflict:409,invalid:422,error:500};
      const status=statuses[opts.scenario]||400;
      return failure(status,'DEMO_'+opts.scenario.toUpperCase(),'Simulasi skenario '+opts.scenario);
    }
    const payload=opts.body||{},pathParams=opts.pathParams||{};
    const detail=definition(op);
    if(op.method!=='GET'){
      const key=opts.idempotencyKey||uuid();
      if(String(key).length<8)return failure(400,'IDEMPOTENCY_KEY_REQUIRED','Key minimal delapan karakter');
      const unique=op.operationId+':'+key;
      if(runtime.replays.has(unique)){
        const saved=runtime.replays.get(unique);
        if(saved.input!==JSON.stringify(payload))return failure(409,'IDEMPOTENCY_CONFLICT','Key sudah digunakan untuk payload berbeda');
        return clone(saved.result);
      }
      const request=detail?.requestBody?.content?.['application/json'];
      const rawSchema=request?.schema||{},schema=rawSchema.$ref?openapi.components.schemas[rawSchema.$ref.split('/').pop()]:rawSchema;
      const missing=(schema?.required||[]).filter(k=>payload[k]===undefined||payload[k]===null||payload[k]==='');
      if(missing.length)return failure(422,'VALIDATION_ERROR','Field wajib belum ada',missing.map(k=>({field:k,reason:'REQUIRED'})));
      const generated=fixture(operationId,payload,pathParams);
      if(generated?.error)return generated.error;
      const status=Object.keys(detail.responses).find(k=>/^2\d\d$/.test(k));
      const result={status:Number(status),headers:{'X-SIMRS-Mock':'true'},
        simulated:true,data:shape(op,generated??responseExample(op))};
      runtime.replays.set(unique,{input:JSON.stringify(payload),result:clone(result)});
      return result;
    }
    const generated=fixture(operationId,payload,pathParams);
    if(generated===null)return failure(404,'NOT_FOUND','Objek demo tidak tersedia');
    const status=Object.keys(detail.responses).find(k=>/^2\d\d$/.test(k));
    return {status:Number(status),headers:{'X-SIMRS-Mock':'true'},simulated:true,
      data:shape(op,generated??responseExample(op))};
  }
  window.SIMRSApiContract={ready,list:()=>ready.then(()=>clone(operations)),call,mode:'synthetic-browser',source:'PRD v3.0 + v3.1 proposal'};
  const css=document.createElement('style');
  css.textContent='#simrs-api-lab-open{position:fixed;z-index:5500;right:17px;bottom:15px;background:#103e59;color:white;border:1px solid #246b85;border-radius:40px;padding:10px 15px;font-size:12px;font-weight:800;box-shadow:0 6px 20px #082c4660}#simrs-api-lab{position:fixed;z-index:5600;right:16px;bottom:65px;width:min(540px,calc(100vw - 32px));max-height:min(83vh,780px);overflow:auto;background:white;border:1px solid #b9d1df;border-radius:14px;padding:16px;box-shadow:0 16px 60px #142d4b55;font-size:12px}#simrs-api-lab h2{margin:0;color:#18334f;font-size:17px}#simrs-api-lab label{display:block;margin:11px 0 4px;color:#39546a;font-weight:750}#simrs-api-lab select,#simrs-api-lab textarea{width:100%;background:#f8fbfd;border:1px solid #ccdae6;border-radius:7px;padding:9px;font:12px/1.4 ui-monospace,monospace}#simrs-api-lab textarea{min-height:95px}#simrs-api-lab pre{white-space:pre-wrap;word-break:break-word;background:#f2f6fa;padding:11px;border-radius:8px;max-height:220px;overflow:auto;font-size:11px}#simrs-api-lab .lab-row{display:flex;align-items:center;justify-content:space-between;gap:8px}#simrs-api-lab .lab-warn{background:#fff6df;padding:9px;border:1px solid #f1da9a;border-radius:8px;color:#805b12;margin:11px 0}#simrs-api-lab button{background:#087f80;color:white;border:0;border-radius:7px;padding:8px 12px;cursor:pointer}#simrs-api-lab-close{background:#eaf0f4!important;color:#28495e!important}';
  document.head.appendChild(css);
  const toggle=document.createElement('button');toggle.id='simrs-api-lab-open';toggle.type='button';toggle.textContent='API Sandbox';toggle.hidden=true;document.body.appendChild(toggle);
  const root=document.createElement('section');root.id='simrs-api-lab';root.hidden=true;
  root.setAttribute('aria-label','SIMRS API Sandbox PRD v3.1');
  root.innerHTML='<div class="lab-row"><h2>API Sandbox • PRD v3.1</h2><button id="simrs-api-lab-close" type="button">Tutup</button></div>'+
    '<p class="lab-warn">QA saja. 180 operasi kandidat, termasuk 74 proposal baru. Respons adalah contoh kontrak/dummy browser, bukan HTTP, bukan validasi klinis atau transaksi keuangan.</p>'+
    '<label for="simrs-api-module">Modul</label><select id="simrs-api-module"></select>'+
    '<label for="simrs-api-operation">Operation ID</label><select id="simrs-api-operation"></select>'+
    '<p id="simrs-api-route" style="overflow-wrap:anywhere"></p>'+
    '<label for="simrs-api-payload">Request JSON (dummy)</label><textarea id="simrs-api-payload" spellcheck="false"></textarea>'+
    '<div class="lab-row"><button id="simrs-api-trigger" type="button">Trigger API demo</button><a href="./api-docs/" target="_blank" rel="noopener">Explorer OpenAPI</a></div>'+
    '<p id="simrs-api-result-status" aria-live="polite"></p><pre id="simrs-api-result" aria-live="polite">{}</pre>';
  document.body.appendChild(root);
  const mod=root.querySelector('#simrs-api-module'),operation=root.querySelector('#simrs-api-operation');
  function selectOperation(){const o=operations.find(x=>x.operationId===operation.value);if(!o)return;
    root.querySelector('#simrs-api-route').textContent=o.method+' '+o.path+' • '+o.permission;
    root.querySelector('#simrs-api-payload').value=JSON.stringify(o.method==='GET'?{}:requestExample(o),null,2);
  }
  function selectModule(){operation.replaceChildren();for(const o of operations.filter(x=>x.module===mod.value)){
    const e=document.createElement('option');e.value=o.operationId;e.textContent=o.operationId;operation.appendChild(e)}selectOperation()}
  ready.then(()=>{for(const id of [...new Set(operations.map(o=>o.module))]){const e=document.createElement('option');e.value=id;
    e.textContent=id+' • '+operations.find(o=>o.module===id).moduleName;mod.appendChild(e)}selectModule()})
    .catch(err=>{root.querySelector('#simrs-api-result').textContent=String(err.message)});
  mod.addEventListener('change',selectModule);operation.addEventListener('change',selectOperation);
  toggle.onclick=()=>{root.hidden=!root.hidden;if(!root.hidden)root.querySelector('#simrs-api-operation').focus()};
  root.querySelector('#simrs-api-lab-close').onclick=()=>{root.hidden=true;toggle.focus()};
  root.querySelector('#simrs-api-trigger').onclick=async()=>{
    const o=operations.find(x=>x.operationId===operation.value);
    try{const body=JSON.parse(root.querySelector('#simrs-api-payload').value||'{}');
      const result=await call(o.operationId,{body,pathParams:{id:ENCOUNTER}});
      root.querySelector('#simrs-api-result-status').textContent='HTTP '+result.status+' • '+(result.simulated?'SIMULASI':'');
      root.querySelector('#simrs-api-result').textContent=JSON.stringify(result.data,null,2);
    }catch(err){root.querySelector('#simrs-api-result-status').textContent='Input JSON tidak valid';
      root.querySelector('#simrs-api-result').textContent=String(err.message)}
  };
  function updateVisibility(){const x=window.SIMRSRoleDemo;
    const account=x?.getAccount?.();
    const allowed=x?.isAuthenticated?.()&&(x.isReviewer?.()||['Integrasi','Admin Sistem'].includes(account?.role));
    toggle.hidden=!allowed;if(!allowed)root.hidden=true;
  }
  document.addEventListener('click',()=>setTimeout(updateVisibility,0),true);
  document.addEventListener('submit',()=>setTimeout(updateVisibility,0),true);
  updateVisibility();
})();
