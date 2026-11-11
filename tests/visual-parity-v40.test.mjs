import assert from "node:assert/strict";
import {test} from "node:test";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const read=file=>readFileSync(new URL("../public/ui-preview/"+file,import.meta.url),"utf8");
const source=read("visual-parity-v41.js"),styles=read("visual-parity-v40.css"),html=read("index.html");
test("V40 active stylesheet follows all role layers and restores reference navy shell",()=>{
 assert.ok(html.indexOf("longtail-workspaces-v37.css")<html.indexOf("visual-parity-v40.css"));
 assert.ok(html.indexOf("longtail-workspaces-v37.js")<html.indexOf("visual-parity-v41.js"));
 assert.match(styles,/#122a47/);
 assert.match(styles,/#078d88/);
 assert.match(styles,/body\.demo-authenticated:not\(\.demo-reviewer\) #app>aside/);
 assert.match(styles,/#role-nav \.ux-role-menu\.active/);
 assert.match(styles,/@media\(max-width:980px\)/);
 assert.match(styles,/@media\(max-width:700px\)/);
 assert.match(styles,/focus-visible/);
 assert.match(styles,/min-height:44px/);
 assert.match(styles,/prefers-reduced-motion/);
});
test("V41 registry covers exactly the 13 source files without changing 44 role grants",()=>{
 const account={role:"reviewer"};
 const login={setAttribute(){}};
 const win={
  __SIMRS_PREVIEW__:{state:{active:"forms"},render(){}},
  SIMRSRoleDemo:{getAccount(){return account;}}
 };
 const doc={getElementById(){return login;},querySelector(){return null;},addEventListener(){}};
 runInNewContext(source,{window:win,document:doc,MutationObserver:class{},Number},{timeout:3000});
 const refs=Array.from(win.SIMRSVisualParityV41.references);
 assert.equal(refs.length,13);
 assert.deepEqual(refs.map(r=>r.screen),Array.from({length:13},(_,i)=>"S"+String(i+1).padStart(2,"0")));
 assert.equal(new Set(refs.map(r=>r.role).filter(Boolean)).size,12);
 for(const ref of refs){
  assert.match(ref.file,/^\d\d_[a-z]+\.png$/);
  assert.equal(ref.file.slice(0,2),ref.screen.slice(1));
 }
 const aliases=Object.fromEntries(Object.entries(win.SIMRSVisualParityV41.aliases));
 assert.deepEqual(aliases,{
  "Petugas Billing":"S09","Casemix":"S09","Tim Mutu":"S10",
  "Integrasi":"S10","Radiolog":"S12","Koordinator MCU":"S13"
 });
});
test("V41 renders only form guidance, never grants permissions or submits records",()=>{
 assert.match(source,/data-v41-form-state/);
 assert.match(source,/data-v41-result-state/);
 assert.match(source,/data-v41-reset/);
 assert.match(source,/data-v41-field/);
 assert.match(source,/setAttribute\("aria-describedby"/);
 assert.match(source,/MutationObserver/);
 assert.match(source,/SIMRSProgressiveFormsV15/);
 assert.match(source,/summaryObserver\.disconnect/);
 assert.match(source,/account\.reviewer/);
 assert.doesNotMatch(source,/\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|\.allowModule\s*=|\.patients\.push\(/);
});
