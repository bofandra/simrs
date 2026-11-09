import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=name=>readFileSync(new URL('../public/ui-preview/'+name,import.meta.url),'utf8');

test('V14 screenshot-review stylesheet follows V12 and V13',()=>{
 const home=read('index.html');
 assert.ok(home.includes('href="./worklist-focus-v14.css"'));
 assert.ok(home.indexOf('operational-parity-v12.css')<home.indexOf('worklist-focus-v14.css'));
 assert.ok(home.indexOf('role-form-blueprints-v13.css')<home.indexOf('worklist-focus-v14.css'));
 const css=read('worklist-focus-v14.css');
 assert.ok(css.includes('.uxv14-primary-action'));
 assert.ok(css.includes('@media(max-width:560px)'));
 assert.ok(css.includes('min-height:46px'));
});

test('V14 primary form action appears before long detail and checklist',()=>{
 const js=read('role-worklist-detail-v5.js');
 const start=js.indexOf('function renderPage(ctx)');
 const end=js.indexOf('document.addEventListener("input"',start);
 const render=js.slice(start,end);
 assert.ok(render.includes('data-demo-action="module:'));
 assert.ok(render.includes('canOpen?'));
 assert.ok(render.includes('uxv14-primary-action'));
 assert.ok(render.indexOf('uxv14-primary-action')<render.indexOf("'<dl><div><dt>Status"));
 assert.ok(render.indexOf('uxv14-primary-action')<render.indexOf('Checklist sebelum melanjutkan'));
 assert.equal((render.match(/\+moduleAction\+/g)||[]).length,1,'A form CTA must not be duplicated');
 assert.ok(render.includes('"Lanjutkan draft"'));
 assert.ok(render.includes('Buka form '+String.raw`"`)); 
});

test('V14 does not change role authorization, local draft context or server behaviour',()=>{
 const source=read('role-worklist-detail-v5.js');
 assert.ok(source.includes('ctx.canOpen&&ctx.canOpen(active.code)'));
 assert.ok(source.includes('data-demo-action="job:'));
 assert.ok(source.includes('Konteks pasien dan encounter sintetis'));
 assert.ok(!read('worklist-focus-v14.css').includes('display:none!important'));
});
