import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const root=new URL("../public/ui-preview/",import.meta.url);
const js=readFileSync(new URL("enterprise-workspaces-v31.js",root),"utf8");
const css=readFileSync(new URL("enterprise-workspaces-v31.css",root),"utf8");
const html=readFileSync(new URL("index.html",root),"utf8");
test("V31 assets follow V28 with accessible mobile and motion settings",()=>{
 assert.ok(html.indexOf("support-workspaces-v28.js")<html.indexOf("enterprise-workspaces-v31.js"));
 assert.ok(html.indexOf("support-workspaces-v28.css")<html.indexOf("enterprise-workspaces-v31.css"));
 assert.match(css,/@media\(max-width:700px\)/);
 assert.match(css,/focus-visible/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/min-height:44px/);
});
test("F3 only decorates the approved S09 S10 S11 S13 professions",()=>{
 const win={
  __SIMRS_PREVIEW__:{state:{active:"forms"},patients:[],render(){}},
  SIMRSRoleDemo:{getAccount(){return null;}},
  SIMRSRoleUXV5:{jobRows(){return [];},selectionContext(){return null;}},
  SIMRSRoleUXV4:{getProfile(){return null;}}
 };
 const doc={querySelector(){return null;},addEventListener(){}};
 runInNewContext(js,{window:win,document:doc,Number},{timeout:1500});
 const targets=Array.from(win.SIMRSEnterpriseUXV31.screens);
 assert.equal(targets.length,10);
 assert.deepEqual(targets.map(x=>x.role).sort(),[
  "Kasir","Petugas Billing","Casemix","Manajemen RS","Tim Mutu",
  "Integrasi","Admin Sistem","HR Admin","Petugas MCU","Koordinator MCU"
 ].sort());
 assert.equal(targets.filter(x=>x.screen==="S09").length,3);
 assert.equal(targets.filter(x=>x.screen==="S10").length,3);
 assert.equal(targets.filter(x=>x.screen==="S11").length,2);
 assert.equal(targets.filter(x=>x.screen==="S13").length,2);
});
test("V31 uses selected job data and does not introduce privilege or transaction actions",()=>{
 assert.match(js,/lists\.selectionContext/);
 assert.match(js,/binding\.kind==="patient"/);
 assert.match(js,/spec\.kind==="admin"\|\|spec\.kind==="management"/);
 assert.match(js,/\.textContent=String\(value\)/);
 assert.match(js,/account\.reviewer/);
 assert.match(js,/shell\.state\.active!=="rolehome"/);
 assert.match(js,/Tidak ada transaksi atau approval nyata/);
 assert.doesNotMatch(js,/\bfetch\s*\(|XMLHttpRequest|sendBeacon|\.openForRole\(|\.allowModule\s*=|\.selectionContext\s*=|localStorage|sessionStorage|\.patients\.push\(/);
});
