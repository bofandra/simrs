import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const read=name=>readFileSync(new URL('../public/ui-preview/'+name,import.meta.url),'utf8');
function setup(){
 const window={SIMRS_FORM_CATALOG:[]},document={addEventListener(){}};
 const scope={window,document};
 ['p0-form-catalog.js','p1-form-definitions.js','p2-p3-form-definitions.js',
  'role-form-blueprints-v13.js'].forEach(name=>runInNewContext(read(name),scope,{timeout:1000}));
 return window;
}

test('V13 is loaded after field catalog but before render engine, and CSS after V12',()=>{
 const html=read('index.html');
 assert.ok(html.includes('href="./role-form-blueprints-v13.css"'));
 assert.ok(html.includes('src="./role-form-blueprints-v13.js"'));
 assert.ok(html.indexOf('operational-parity-v12.css')<html.indexOf('role-form-blueprints-v13.css'));
 assert.ok(html.indexOf('p2-p3-form-definitions.js')<html.indexOf('role-form-blueprints-v13.js'));
 assert.ok(html.indexOf('role-form-blueprints-v13.js')<html.indexOf('p0-forms.js'));
 const engine=read('p0-forms.js');
 assert.ok(engine.includes('SIMRSFormBlueprintsV13.render(m,visibleFields,values,editable,renderField)'));
 assert.ok(engine.includes('blueprint?blueprint.fields:visibleFields.map'));
});

test('V13 defines explicit sections for every selected clinical and operational form',()=>{
 const w=setup(),specs=w.SIMRSFormBlueprintsV13.specs;
 const codes=Object.keys(specs);
 assert.ok(codes.length>=20);
 const keySet=new Set();
 codes.forEach(code=>{
  assert.ok(!keySet.has(code));keySet.add(code);
  const module=w.SIMRS_FORM_CATALOG.find(m=>m.code===code);
  assert.ok(module,'Unknown PRD module '+code);
  assert.ok(module.fields.length,'No form fields for '+code);
  assert.ok(specs[code].groups.length>=2,code);
  const all=specs[code].groups.flatMap(group=>group[2]);
  const used=new Set();
  all.forEach(k=>{
   assert.ok(!used.has(k),'Duplicate section field '+code+': '+k);used.add(k);
   assert.ok(module.fields.some(f=>f.key===k),'Missing schema field '+code+': '+k);
  });
  assert.deepEqual([...used].sort(),module.fields.map(f=>f.key).sort(),
   'All form fields must be placed in V13 sections: '+code);
 });
 for(const c of ['CORE-09','RME-02','RME-04','RME-05','RME-07','RME-08',
  'MED-01','MED-04','MED-05','FIN-02','FIN-03','MED-02','MED-10'])
   assert.ok(specs[c],'Priority missing '+c);
});

test('V13 render groups each field exactly once and preserves name, required and value',()=>{
 const w=setup(),view=w.SIMRSFormBlueprintsV13;
 for(const code of Object.keys(view.specs)){
  const m=w.SIMRS_FORM_CATALOG.find(x=>x.code===code);
  const values=Object.fromEntries(m.fields.map((f,i)=>[f.key,'contoh-'+i]));
  const result=view.render(m,m.fields,values,true,
    (f,v,editable)=>'<label><input name="'+f.key+'" value="'+v[f.key]+
      '"'+(f.required?' required':'')+(editable?'':' disabled')+'></label>');
  assert.equal(result.code,code);
  assert.equal(result.fieldCount,m.fields.length);
  assert.equal((result.fields.match(/<input name=/g)||[]).length,m.fields.length,code);
  assert.ok(result.fields.includes('v13-form-section'));
  assert.ok(result.intro.includes('Kelengkapan isian wajib'));
  assert.ok(result.intro.includes('belum')||result.intro.includes('tidak')||result.intro.includes('Tidak')||result.intro.includes('bukan'),
    'Blueprint must explain simulation boundary for '+code);
 }
 assert.equal(view.render({code:'OTHER'},[],{},true,()=>''),null);
});

test('V13 omitted fields remain preserved in fallback section and no production actions exist',()=>{
 const w=setup(),view=w.SIMRSFormBlueprintsV13;
 const m=w.SIMRS_FORM_CATALOG.find(m=>m.code==='CORE-09');
 const more={key:'future_field',label:'Future',type:'text',required:true};
 const fields=[...m.fields,more];
 const result=view.render(m,fields,{},true,f=>'<input name="'+f.key+'">');
 assert.ok(result.fields.includes('Informasi tambahan'));
 assert.ok(result.fields.includes('name="future_field"'));
 assert.equal((result.fields.match(/name="future_field"/g)||[]).length,1);
 const js=read('role-form-blueprints-v13.js');
 assert.ok(!js.includes('fetch('));
 assert.ok(!js.includes('localStorage'));
 assert.ok(!js.includes('sessionStorage'));
 assert.ok(!js.includes('SIMRSFormEngine.save'));
});
