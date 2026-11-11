import {test,expect} from "@playwright/test";
import {mkdirSync} from "node:fs";
const out="test-results/snapshots";
mkdirSync(out,{recursive:true});
const personas=[
 {username:"akun.kasir",role:"Kasir",screen:"S09",kind:"finance"},
 {username:"akun.petugas-billing",role:"Petugas Billing",screen:"S09",kind:"finance"},
 {username:"akun.casemix",role:"Casemix",screen:"S09",kind:"finance"},
 {username:"akun.manajemen-rs",role:"Manajemen RS",screen:"S10",kind:"management"},
 {username:"akun.tim-mutu",role:"Tim Mutu",screen:"S10",kind:"management"},
 {username:"akun.integrasi",role:"Integrasi",screen:"S10",kind:"management"},
 {username:"akun.admin-sistem",role:"Admin Sistem",screen:"S11",kind:"admin"},
 {username:"akun.hr-admin",role:"HR Admin",screen:"S11",kind:"admin"},
 {username:"akun.petugas-mcu",role:"Petugas MCU",screen:"S13",kind:"mcu"},
 {username:"akun.koordinator-mcu",role:"Koordinator MCU",screen:"S13",kind:"mcu"}
];
async function login(page,username){
 await page.goto("/index.html");
 await page.locator('[data-demo-account="'+username+'"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
}
for(const p of personas){
 test("V31 F3 task-first "+p.role,async ({page})=>{
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  await login(page,p.username);
  const root=page.locator(".uxv5.v31-enterprise");
  await expect(root).toBeVisible();
  await expect(root).toHaveAttribute("data-v31-screen",p.screen);
  await expect(root).toHaveAttribute("data-v31-kind",p.kind);
  await expect(root.locator(".v31-selected")).toBeVisible();
  await expect(root.locator(".v31-hero")).toContainText("DATA SIMULASI");
  await expect(root.locator(".v31-review .v31-checklist li")).toHaveCount(3);
  await expect(root.locator(".v31-review-note")).toContainText("bukan tanda");
  const pos=await page.evaluate(()=>{
   const r=document.querySelector(".v31-enterprise"),children=Array.from(r.children);
   return {
    hero:children.indexOf(r.querySelector(".v31-hero")),
    list:children.indexOf(r.querySelector("[data-v31-worklist]")),
    review:children.indexOf(r.querySelector(".v31-review")),
    other:children.indexOf(r.querySelector(".v31-other-areas"))
   };
  });
  expect(pos.hero).toBeLessThan(pos.list);
  expect(pos.list).toBeLessThan(pos.review);
  if(pos.other>=0)expect(pos.review).toBeLessThan(pos.other);
  if(p.kind==="admin"||p.kind==="management"){
   await expect(root.locator(".v31-patient")).toHaveCount(0);
   await expect(root.locator(".v31-context")).toHaveAttribute("data-v31-context","object");
  }
  await root.locator('[data-v31-focus="list"]').click();
  await expect(root.locator("#uxv5-search")).toBeFocused();
  await root.locator('[data-v31-focus="guide"]').click();
  await expect(root.locator(".v31-hero .v18-workflow-details")).toHaveJSProperty("open",true);
  if(["Kasir","Manajemen RS","Admin Sistem","Petugas MCU"].includes(p.role)){
   await page.screenshot({path:out+"/v31-"+p.username+".png",fullPage:true});
  }
  expect(errors).toEqual([]);
 });
}
test("V32 small-screen finance worklist controls remain usable",async ({page})=>{
 await page.setViewportSize({width:390,height:844});
 await login(page,"akun.kasir");
 const root=page.locator(".v31-enterprise");
 const control=root.locator('[data-v31-focus="list"]');
 await expect(control).toBeVisible();
 const box=await control.boundingBox();
 expect(box.height).toBeGreaterThanOrEqual(44);
 await control.click();
 await expect(root.locator("#uxv5-search")).toBeFocused();
 await expect(root.locator(".v31-review")).toBeVisible();
 await page.screenshot({path:out+"/v32-finance-mobile.png",fullPage:true});
});
test("V33 reviewer stays in QA mode without F3 decorations",async ({page})=>{
 await login(page,"reviewer.demo");
 await expect(page.locator(".v31-enterprise")).toHaveCount(0);
 await expect(page.locator(".v31-action")).toHaveCount(0);
 await expect(page.locator(".v31-review")).toHaveCount(0);
});
