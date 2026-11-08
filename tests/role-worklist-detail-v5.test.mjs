import assert from "node:assert/strict";
import {test} from "node:test";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const root=new URL("../public/ui-preview/",import.meta.url);
const base=readFileSync(new URL("role-workspace-v4.js",root),"utf8");
const v5=readFileSync(new URL("role-worklist-detail-v5.js",root),"utf8");
const index=readFileSync(new URL("index.html",root),"utf8");
const login=readFileSync(new URL("role-demo-login.js",root),"utf8");
const css=readFileSync(new URL("role-worklist-detail-v5.css",root),"utf8");
const events=[];
const ctx={window:{},document:{addEventListener:(name,cb)=>events.push([name,cb])}};
runInNewContext(base,ctx,{timeout:1500});
runInNewContext(v5,ctx,{timeout:1500});
const api=ctx.window.SIMRSRoleUXV5;
const targetRoles=["Pendaftaran","Dokter RJ","Perawat","Dokter IGD","Farmasis","Kasir","Bed Manager"];

test("V5 is loaded after base profiles and before demo login, including CSS",()=>{
 assert.match(index,/<link rel="stylesheet" href="\.\/role-worklist-detail-v5\.css"/);
 assert.ok(index.indexOf("role-workspace-v4.js")<index.indexOf("role-worklist-detail-v5.js"));
 assert.ok(index.indexOf("role-worklist-detail-v5.js")<index.indexOf("role-demo-login.js"));
 assert.match(login,/SIMRSRoleUXV5\.renderPage/);
 assert.match(login,/currentJob=index/);
 assert.match(css,/max-width:700px/);
});

test("seven target roles have contextual details for every PRD mapped area",()=>{
 assert.deepEqual(Object.keys(api.specs).sort(),targetRoles.slice().sort());
 for(const role of targetRoles){
  const profile=ctx.window.SIMRSRoleUXV4.getProfile(role);
  assert.equal(api.specs[role].stages.length,profile.features.length,role);
  for(const feature of profile.features){
   const list=api.jobRows(role,feature.key);
   assert.equal(list.length,4,role+" "+feature.key);
   assert.ok(list.every(item=>item.feature.code===feature.code),role);
   assert.ok(list.every(item=>item.checks.length>=3),role);
   const html=api.renderPage({role,section:feature.key,username:"demo",selectedJob:0,canOpen:()=>true});
   assert.ok(html.includes(feature.fr),role+" "+feature.key);
   assert.ok(html.includes(feature.wf),role+" "+feature.key);
   assert.ok(html.includes('data-demo-action="job:1"'),role);
   assert.ok(html.includes('data-demo-action="module:'+feature.code+'"'),role);
  }
 }
});

test("different role and task stages show distinct, relevant worklists",()=>{
 const r1=api.renderPage({role:"Farmasis",section:"m1",username:"akun.farmasis",selectedJob:2,canOpen:()=>true});
 assert.match(r1,/Telaah kefarmasian/);
 assert.match(r1,/Riwayat alergi perlu ditelaah/);
 assert.match(r1,/RX-0029/);
 assert.match(r1,/MED-04/);
 assert.doesNotMatch(r1,/data-demo-action="module:OPS-01"/);
 const r2=api.renderPage({role:"Kasir",section:"m1",username:"akun.kasir",selectedJob:3,canOpen:()=>true});
 assert.match(r2,/Alokasi pembayaran belum lengkap/);
 assert.match(r2,/FIN-03/);
 assert.doesNotMatch(r2,/data-demo-action="module:FIN-01"/);
 const r3=api.renderPage({role:"Bed Manager",section:"m2",username:"akun.bed-manager",selectedJob:1,canOpen:()=>true});
 assert.match(r3,/Transfer dan pelepasan/);
 assert.match(r3,/OPS-10/);
});

test("V5 has deny-by-default form navigation and escapes account content",()=>{
 const html=api.renderPage({role:"Dokter IGD",section:"m0",selectedJob:99,username:'"><script>alert(1)</script>',canOpen:()=>false});
 assert.match(html,/Form belum tersedia untuk akun demo ini/);
 assert.doesNotMatch(html,/data-demo-action="module:RME-02"/);
 assert.doesNotMatch(html,/<script>alert/);
 assert.match(html,/&lt;script&gt;/);
 assert.match(html,/data-demo-action="job:0"/);
 assert.match(html,/aria-pressed="true"/);
 assert.match(html,/belum terhubung otomatis ke form/);
});

test("worklist search hides unrelated rows and shows empty state",()=>{
 const listener=events.find(([type])=>type==="input")?.[1];
 assert.ok(listener);
 const rows=[{textContent:"RX-D027 Resep Demo A",hidden:false},{textContent:"RX-D028 Resep Demo B",hidden:false}];
 const empty={hidden:true};
 const table={querySelectorAll:()=>rows};
 const original=ctx.document.querySelector;
 const oldById=ctx.document.getElementById;
 ctx.document.querySelector=()=>table;
 ctx.document.getElementById=()=>empty;
 listener({target:{id:"uxv5-search",value:"zzz"}});
 assert.ok(rows.every(x=>x.hidden));
 assert.equal(empty.hidden,false);
 listener({target:{id:"uxv5-search",value:"RX-D028"}});
 assert.equal(rows[0].hidden,true);
 assert.equal(rows[1].hidden,false);
 assert.equal(empty.hidden,true);
 ctx.document.querySelector=original;
 ctx.document.getElementById=oldById;
});
