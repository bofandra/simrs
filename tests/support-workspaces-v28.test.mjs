import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const root=new URL("../public/ui-preview/",import.meta.url);
const js=readFileSync(new URL("support-workspaces-v28.js",root),"utf8");
const css=readFileSync(new URL("support-workspaces-v28.css",root),"utf8");
const html=readFileSync(new URL("index.html",root),"utf8");
test("V28 loads after V25 and provides mobile styles and visible focus",()=>{
 assert.ok(html.indexOf("core-care-workspaces-v25.css")<html.indexOf("support-workspaces-v28.css"));
 assert.ok(html.indexOf("core-care-workspaces-v25.js")<html.indexOf("support-workspaces-v28.js"));
 assert.match(css,/@media\(max-width:700px\)/);
 assert.match(css,/focus-visible/);
 assert.match(css,/prefers-reduced-motion/);
});
test("V28 covers only the approved F2 workspaces, not core care or reviewer",()=>{
 const win={
  __SIMRS_PREVIEW__:{state:{active:"forms"},patients:[],render(){}},
  SIMRSRoleDemo:{getAccount(){return null;}},
  SIMRSRoleUXV5:{jobRows(){return[];},selectionContext(){return null;}},
  SIMRSRoleUXV4:{getProfile(){return null;}}
 };
 const doc={querySelector(){return null;},addEventListener(){}};
 runInNewContext(js,{window:win,document:doc,Number},{timeout:1500});
 const roles=Array.from(win.SIMRSSupportUXV28.screens);
 assert.deepEqual(roles.map(x=>x.role).sort(),["Bed Manager","ATLM","Farmasis","Radiografer","Radiolog"].sort());
 assert.deepEqual(roles.map(x=>x.screen).sort(),["S06","S07","S08","S12","S12"].sort());
});
test("V28 does not mutate operational state, navigation permissions, or send network requests",()=>{
 assert.doesNotMatch(js,/\bfetch\s*\(|XMLHttpRequest|sendBeacon|\.openForRole\(|\.allowModule\s*=|\.selectionContext\s*=|localStorage|sessionStorage|\.patients\.push\(/);
 assert.match(js,/root\.setAttribute\("data-v28-kind"/);
 assert.match(js,/if\(spec\.kind==="bed"\)patient=null/);
 assert.match(js,/lists\.selectionContext/);
 assert.match(js,/\.textContent=String\(label\)/);
 assert.match(js,/insertAdjacentElement\("afterend",guide\)/);
 assert.match(js,/aria-live/);
});
