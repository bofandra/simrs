import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=name=>readFileSync(new URL('../public/ui-preview/'+name,import.meta.url),'utf8');

test('V15 is loaded only after role demo and preserves the original field renderer',()=>{
 const html=read('index.html'),script=read('progressive-forms-v15.js');
 assert.ok(html.includes('href="./progressive-forms-v15.css"'));
 assert.ok(html.includes('src="./progressive-forms-v15.js"'));
 assert.ok(html.indexOf('worklist-focus-v14.css')<html.indexOf('progressive-forms-v15.css'));
 assert.ok(html.indexOf('role-demo-login.js')<html.indexOf('progressive-forms-v15.js'));
 assert.ok(script.includes('form.dataset.v15Ready'));
 assert.ok(script.includes('activeSteps[keyOf(form)]'));
 assert.ok(script.includes('section.hidden=i!==current'));
 assert.ok(script.includes('parts.slice(start,end).forEach'));
 assert.ok(script.includes('section.querySelector(".v15-grid").appendChild(node)'));
 assert.ok(script.includes('new MutationObserver(decorate)'));
});
test('V15 keeps review and draft workflow in original form and does not send operations',()=>{
 const script=read('progressive-forms-v15.js'),css=read('progressive-forms-v15.css');
 assert.ok(script.includes('data-p0-action="review"'));
 assert.ok(script.includes('invalid.closest(".v13-form-section, .v15-generated-section")'));
 assert.ok(css.includes('.v13-form-section[hidden]'));
 assert.ok(css.includes('.v15-generated-section[hidden]'));
 assert.ok(css.includes('@media print'));
 for(const forbidden of ['fetch(','XMLHttpRequest','navigator.sendBeacon','SIMRSFormEngine.save','localStorage.setItem'])
  assert.ok(!script.includes(forbidden),'Unexpected data operation: '+forbidden);
});
