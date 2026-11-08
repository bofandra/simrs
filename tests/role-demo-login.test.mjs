import assert from "node:assert/strict";
import {test} from "node:test";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const loginSource=readFileSync(new URL("../public/ui-preview/role-demo-login.js",import.meta.url),"utf8");
const html=readFileSync(new URL("../public/ui-preview/index.html",import.meta.url),"utf8");
const inlineRoles=html.match(/const roles=(\[[^\n]+\]);/);
if(!inlineRoles)throw new Error("Role list missing");
const roles=JSON.parse(inlineRoles[1].replace(/'/g,'"'));

function harness(){
 const node={innerHTML:"",hidden:false};
 const labels={innerHTML:"",textContent:""};
 const nodes={"demo-login":node,"modal-root":{innerHTML:""},"demo-current-role":labels};
 const storage=new Map(),session=new Map(),events={},classes=new Set();
 const state={role:"Pendaftaran",active:"front",clinicalTab:"soap",labTab:"lis"};
 const shell={roles,state,patients:[],render(){},toast(){}};
 const body={dataset:{},classList:{
  add(...x){x.forEach(v=>classes.add(v));},
  remove(...x){x.forEach(v=>classes.delete(v));},
  toggle(name,on){if(on)classes.add(name);else classes.delete(name);}
 }};
 const document={body,
  getElementById(id){return nodes[id]||null;},
  querySelectorAll(){return [];},
  querySelector(){return null;},
  addEventListener(name,fn){events[name]=fn;}
 };
 const window={__SIMRS_PREVIEW__:shell,SIMRSWorkspacesV2:{shortcuts(role){
   return role==="Petugas Laundry"?[["Laundry & Linen","module:OPS-04"]]:
     role==="Dokter RJ"?[["SOAP","route:clinical:soap"],["CPOE","module:RME-08"]]:
     [["Beranda","route:front:registration"]];
 }} ,SIMRSFormEngine:{getCatalog(){return [
  {code:"OPS-04",roles:["Petugas Laundry"],description:"Laundry demo"},
  {code:"RME-08",roles:["Dokter RJ"],description:"Order demo"},
  {code:"CORE-09",roles:["Pendaftaran"],description:"Registrasi demo"}
 ];}}};
 const host={window,document,sessionStorage:{
  getItem(k){return session.get(k)||null;},setItem(k,v){session.set(k,v);},removeItem(k){session.delete(k);}
 },localStorage:{
  getItem(k){return storage.get(k)||null;},setItem(k,v){storage.set(k,v);},removeItem(k){storage.delete(k);}
 },location:{hash:"",pathname:"/simrs/",search:""},history:{replaceState(){}},Event:function(){}};
 runInNewContext(loginSource,host,{timeout:1000});
 return {api:window.SIMRSRoleDemo,node,roles,state,body,classes,labels,session,events};
}

test("login first: page includes role login surface before app and demo artifacts",()=>{
 assert.ok(html.indexOf('id="demo-login"')<html.indexOf('id="app"'));
 assert.match(html,/\.\/role-demo-login\.css/);
 assert.match(html,/\.\/role-demo-login\.js/);
 assert.match(html,/\.\/uiux-v3\.css/);
 assert.match(html,/id="demo-logout"/);
 assert.match(html,/rolehome/);
});

test("every one of 42 roles has a unique demo account, plus isolated QA reviewer",()=>{
 const h=harness();
 assert.equal(h.roles.length,42);
 assert.equal(h.api.accounts.length,43);
 assert.equal(new Set(h.api.accounts.map(a=>a.username)).size,43);
 for(const role of h.roles){
  const account=h.api.accounts.find(a=>a.role===role);
  assert.ok(account,role);
  assert.ok(account.username.startsWith("akun."),role);
 }
 assert.ok(h.api.accounts.some(a=>a.username==="reviewer.demo"&&a.reviewer));
 assert.match(h.node.innerHTML,/Login Demo SIMRS/);
});

test("bad password denied; login assigns correct role and default workspace",()=>{
 const h=harness();
 assert.equal(h.api.isAuthenticated(),false);
 assert.equal(h.api.login("akun.dokter-rj","incorrect"),false);
 assert.equal(h.api.isAuthenticated(),false);
 assert.equal(h.api.login("akun.dokter-rj","demo123"),true);
 assert.equal(h.state.role,"Dokter RJ");
 assert.equal(h.state.active,"clinical");
 assert.equal(h.api.allowArea("clinical"),true);
 assert.equal(h.api.allowArea("front"),false);
 assert.equal(h.api.allowModule("CORE-09"),false);
 assert.equal(h.api.allowModule("RME-08"),true);
 assert.equal(h.body.dataset.demoRole,"dokter-rj");
});

test("support role opens own task home, not arbitrary clinical workspace",()=>{
 const h=harness();
 assert.equal(h.api.login("akun.petugas-laundry","demo123"),true);
 assert.equal(h.state.role,"Petugas Laundry");
 assert.equal(h.state.active,"rolehome");
 assert.equal(h.api.allowArea("clinical"),false);
 assert.equal(h.api.allowModule("OPS-04"),true);
 assert.equal(h.api.allowModule("RME-08"),false);
 assert.match(h.api.renderHome(),/Laundry &amp; Linen/); // UI must HTML-escape the module label
 assert.doesNotMatch(h.api.renderHome(),/Katalog 68/);
});

test("logout removes demo session and hides application",()=>{
 const h=harness();
 h.api.login("akun.pendaftaran","demo123");
 assert.equal(h.api.isAuthenticated(),true);
 h.api.logout();
 assert.equal(h.api.isAuthenticated(),false);
 assert.equal(h.node.hidden,false);
 assert.equal(h.classes.has("demo-authenticated"),false);
 assert.ok(h.node.innerHTML.includes("Login Demo SIMRS"));
 assert.equal(h.session.size,0);
});

test("reviewer only can browse any area and module",()=>{
 const h=harness();
 h.api.login("reviewer.demo","demo123");
 assert.equal(h.api.isReviewer(),true);
 assert.equal(h.api.allowArea("system"),true);
 assert.equal(h.api.allowModule("FIN-11"),true);
 assert.equal(h.state.active,"front");
 assert.equal(h.state.role,"Pendaftaran");
});
