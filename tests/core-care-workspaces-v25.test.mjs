import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const js=readFileSync(new URL("../public/ui-preview/core-care-workspaces-v25.js",import.meta.url),"utf8");
const css=readFileSync(new URL("../public/ui-preview/core-care-workspaces-v25.css",import.meta.url),"utf8");
const html=readFileSync(new URL("../public/ui-preview/index.html",import.meta.url),"utf8");

test("V25 CSS and JS run after V23 in GitHub Pages",()=>{
 assert.ok(html.indexOf("form-continuity-v23.css")<html.indexOf("core-care-workspaces-v25.css"));
 assert.ok(html.indexOf("form-continuity-v23.js")<html.indexOf("core-care-workspaces-v25.js"));
 assert.match(css,/\[data-v25-role="emergency"\]/);
 assert.match(css,/@media\(max-width:700px\)/);
 assert.match(css,/focus-visible/);
 assert.match(css,/prefers-reduced-motion/);
});

test("V25 only targets four approved role-first workspaces",()=>{
 const window={
  __SIMRS_PREVIEW__:{state:{active:"forms"},patients:[],render(){}},
  SIMRSRoleDemo:{getAccount(){return null;}},
  SIMRSRoleUXV5:{jobRows(){return [];},selectionContext(){return null;}},
  SIMRSRoleUXV4:{getProfile(){return null;}}
 };
 const document={querySelector(){return null;},addEventListener(){}};
 runInNewContext(js,{window,document,Number});
 const roles=window.SIMRSCoreCareV25.screens;
 assert.equal(roles.length,4);
 assert.deepEqual(Array.from(roles,x=>x.role).sort(),["Dokter IGD","Dokter RJ","Pendaftaran","Perawat"].sort());
 assert.equal(new Set(Array.from(roles,x=>x.screen)).size,4);
});

test("V25 neither changes RBAC nor adds any API or operational state write",()=>{
 assert.doesNotMatch(js,/\bfetch\s*\(|XMLHttpRequest|sendBeacon|\.openForRole\(|\.allowModule\s*=|\.selectedJob\s*=|\.patients\.push\(/);
 assert.match(js,/getCurrentJobIndex/);
 assert.match(js,/worklists\.selectionContext/);
 assert.match(js,/\.textContent\s*=/);
 assert.match(js,/insertAdjacentElement\("afterend",guide\)/);
 assert.match(js,/v25-related-areas/);
 assert.match(js,/aria-live/);
});
