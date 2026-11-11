import {test,expect} from "@playwright/test";
import {mkdirSync} from "node:fs";
const out="test-results/snapshots";
mkdirSync(out,{recursive:true});
const personas=[
 {username:"akun.koordinator-ok",role:"Koordinator OK",kind:"clinical"},
 {username:"akun.dokter-anestesi",role:"Dokter Anestesi",kind:"clinical"},
 {username:"akun.perawat-hd",role:"Perawat HD",kind:"clinical"},
 {username:"akun.terapis-rehabilitasi",role:"Terapis Rehabilitasi",kind:"clinical"},
 {username:"akun.ahli-gizi",role:"Ahli Gizi",kind:"clinical"},
 {username:"akun.petugas-dapur",role:"Petugas Dapur",kind:"operations"},
 {username:"akun.petugas-cssd",role:"Petugas CSSD",kind:"operations"},
 {username:"akun.petugas-laundry",role:"Petugas Laundry",kind:"operations"},
 {username:"akun.pasien-demo",role:"Pasien Demo",kind:"portal"}
];
async function login(page,username){
 await page.goto("/index.html");
 await page.locator('[data-demo-account="'+username+'"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
}
for(const p of personas){
 test("V34 F4 scoped task-first workspace: "+p.role,async ({page})=>{
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  await login(page,p.username);
  const root=page.locator(".uxv5.v34-advanced");
  await expect(root).toBeVisible();
  await expect(root).toHaveAttribute("data-v34-owner",p.role);
  await expect(root).toHaveAttribute("data-v34-role",p.kind);
  await expect(root.locator(".v34-hero")).toBeVisible();
  await expect(root.locator(".v34-selection")).toBeVisible();
  await expect(root.locator(".v34-count strong")).toHaveText("4");
  await expect(root.locator(".v34-worklist")).toBeVisible();
  const order=await page.evaluate(()=>{
   const root=document.querySelector(".v34-advanced");
   const index=sel=>Array.from(root.children).indexOf(root.querySelector(sel));
   return {
    hero:index(".v34-hero"),
    summary:index(".uxv5-summary"),
    context:index(".v34-selection"),
    worklist:index(".v34-worklist"),
    guide:index(".v34-checks"),
    other:index(".v34-other")
   };
  });
  expect(order.hero).toBeLessThan(order.summary);
  expect(order.summary).toBeLessThan(order.context);
  expect(order.context).toBeLessThan(order.worklist);
  expect(order.worklist).toBeLessThan(order.guide);
  if(order.other>=0)expect(order.guide).toBeLessThan(order.other);
  if(p.kind==="operations"){
   await expect(root.locator(".v34-object-only")).toBeVisible();
   await expect(root.locator(".v34-patient")).toHaveCount(0);
  }else{
   await expect(root.locator(".v34-patient")).toBeVisible();
   await expect(root.locator(".v34-missing-context")).toHaveCount(0);
  }
  await root.locator('[data-v34-action="worklist"]').click();
  await expect(root.locator("#uxv5-search")).toBeFocused();
  await root.locator('[data-v34-action="checks"]').click();
  await expect(root.locator(".v34-checks")).toHaveJSProperty("open",true);
  await expect(root.locator(".v34-checklist li")).toHaveCount(3);
  await expect(root.locator(".v34-disclaimer")).toContainText("tidak menyatakan");
  if(["Koordinator OK","Ahli Gizi","Petugas CSSD","Pasien Demo"].includes(p.role)){
   await page.screenshot({path:out+"/v34-"+p.username+".png",fullPage:true});
  }
  expect(errors).toEqual([]);
 });
}
test("V35 patient portal navigation stays scoped to synthetic self account",async ({page})=>{
 await login(page,"akun.pasien-demo");
 let root=page.locator(".v34-advanced[data-v34-role='portal']");
 await expect(root.locator(".v34-portal-nav button")).toHaveCount(2);
 await expect(root.locator(".v34-portal-link[aria-current='page']")).toHaveText("Janji temu saya");
 const mrn=await root.locator(".v34-patient").textContent();
 await root.locator('[data-demo-action="section:m1"]').first().click();
 root=page.locator(".v34-advanced[data-v34-role='portal']");
 await expect(root).toHaveAttribute("data-uxv4-section","m1");
 await expect(root.locator(".v34-portal-link[aria-current='page']")).toHaveText("Dokumen saya");
 await expect(root.locator(".v34-patient")).toHaveText(mrn);
 await expect(root.locator(".v34-selection-id")).toHaveText(/SELF-02/);
 await expect(root.locator(".v34-object-only")).toHaveCount(0);
});
test("V35 390px operations mobile keeps focus and object scope",async ({page})=>{
 await page.setViewportSize({width:390,height:844});
 await login(page,"akun.petugas-laundry");
 const root=page.locator(".v34-advanced");
 const button=root.locator('[data-v34-action="worklist"]');
 const bounds=await button.boundingBox();
 expect(bounds.height).toBeGreaterThanOrEqual(44);
 await button.click();
 await expect(root.locator("#uxv5-search")).toBeFocused();
 await expect(root.locator(".v34-object-only")).toBeVisible();
 await page.screenshot({path:out+"/v35-laundry-mobile.png",fullPage:true});
});
test("V36 reviewer stays in separate QA without advanced clinic or portal UI",async ({page})=>{
 await login(page,"reviewer.demo");
 await expect(page.locator(".v34-advanced")).toHaveCount(0);
 await expect(page.locator(".v34-portal-nav")).toHaveCount(0);
 await expect(page.locator(".v34-action")).toHaveCount(0);
});
