import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const root=new URL("../public/ui-preview/",import.meta.url);
const js=readFileSync(new URL("advanced-workspaces-v34.js",root),"utf8");
const css=readFileSync(new URL("advanced-workspaces-v34.css",root),"utf8");
const html=readFileSync(new URL("index.html",root),"utf8");

test("F4 scripts load after previous workspaces without replacing the 44-role worklist",()=>{
 assert.ok(html.indexOf("enterprise-workspaces-v31.css")<html.indexOf("advanced-workspaces-v34.css"));
 assert.ok(html.indexOf("enterprise-workspaces-v31.js")<html.indexOf("advanced-workspaces-v34.js"));
 assert.ok(html.indexOf("role-worklists-v11.js")<html.indexOf("advanced-workspaces-v34.js"));
 assert.match(css,/@media\(max-width:700px\)/);
 assert.match(css,/focus-visible/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/min-height:44px/);
});
test("F4 exactly covers nine long-tail and portal roles, no reviewer or legacy area",()=>{
 const win={
  __SIMRS_PREVIEW__:{patients:[],state:{active:"forms"},render(){}},
  SIMRSRoleDemo:{getAccount(){return null;}},
  SIMRSRoleUXV4:{getProfile(){return null;}},
  SIMRSRoleUXV5:{jobRows(){return [];},selectionContext(){return null;}}
 };
 const doc={addEventListener(){},querySelector(){return null;}};
 runInNewContext(js,{window:win,document:doc,Number},{timeout:1500});
 const roles=Array.from(win.SIMRSAdvancedUXV34.roles);
 assert.equal(roles.length,9);
 assert.deepEqual(roles.map(x=>x.role).sort(),[
  "Koordinator OK","Dokter Anestesi","Perawat HD","Terapis Rehabilitasi",
  "Ahli Gizi","Petugas Dapur","Petugas CSSD","Petugas Laundry","Pasien Demo"
 ].sort());
 assert.equal(roles.filter(x=>x.kind==="clinical").length,5);
 assert.equal(roles.filter(x=>x.kind==="operations").length,3);
 assert.equal(roles.filter(x=>x.kind==="portal").length,1);
});
test("F4 selection uses existing role worklist and denies foreign-patient portal or transaction actions",()=>{
 assert.match(js,/lists\.jobRows\(account\.role,section\)/);
 assert.match(js,/lists\.selectionContext\(role,section,index,shell\.patients\)/);
 assert.match(js,/patient\.id!==self\.id/);
 assert.match(js,/account\.reviewer/);
 assert.match(js,/shell\.state\.active!=="rolehome"/);
 assert.match(js,/data-demo-action","section:m"/);
 assert.match(js,/\.textContent=String\(value\)/);
 assert.doesNotMatch(js,/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage|\.allowModule\s*=|\.patients\.push\(|\.selectionContext\s*=/);
});
