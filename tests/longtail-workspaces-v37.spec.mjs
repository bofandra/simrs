import {test,expect} from "@playwright/test";
import {mkdirSync} from "node:fs";
const out="test-results/snapshots";mkdirSync(out,{recursive:true});
const personas=[
 ["akun.dpjp-rawat-inap","DPJP Rawat Inap","clinical","patient"],
 ["akun.petugas-bank-darah","Petugas Bank Darah","clinical","patient"],
 ["akun.gudang","Gudang","operations","object"],
 ["akun.pengadaan","Pengadaan","operations","object"],
 ["akun.petugas-aset","Petugas Aset","operations","object"],
 ["akun.teknisi","Teknisi","operations","object"],
 ["akun.petugas-fasilitas","Petugas Fasilitas","operations","object"],
 ["akun.koordinator-transport","Koordinator Transport","operations","patient"],
 ["akun.petugas-bpjs","Petugas BPJS","finance","patient"],
 ["akun.coder","Coder","finance","patient"],
 ["akun.akuntan","Akuntan","finance","object"],
 ["akun.budget-owner","Budget Owner","finance","object"],
 ["akun.analis-biaya","Analis Biaya","finance","object"],
 ["akun.payroll-admin","Payroll Admin","people","object"],
 ["akun.rekruter","Rekruter","people","object"],
 ["akun.tim-ppi","Tim PPI","quality","patient"]
];
async function login(page,username){
 await page.goto("/index.html");
 await page.locator('[data-demo-account="'+username+'"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
}
for(const [username,role,group,kind] of personas){
 test("V37 role-native worklist and safe context: "+role,async ({page})=>{
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  await login(page,username);
  const root=page.locator(".uxv5.v37-workspace");
  await expect(root).toBeVisible();
  await expect(root).toHaveAttribute("data-v37-role",role);
  await expect(root).toHaveAttribute("data-v37-group",group);
  await expect(root).toHaveAttribute("data-v37-kind",kind);
  await expect(root.locator(".v37-hero")).toBeVisible();
  await expect(root.locator(".v37-context")).toBeVisible();
  await expect(root.locator(".v37-worklist")).toBeVisible();
  await expect(root.locator(".v37-trace")).toContainText("PRD final");
  await expect(root.locator(".v37-totals .v37-stat")).toHaveCount(3);
  const totals=await root.locator(".v37-stat strong").allTextContents();
  expect(totals.map(Number).reduce((a,b)=>a+b,0)).toBe(4);
  const position=await page.evaluate(()=>{
   const node=document.querySelector(".v37-workspace");
   const i=selector=>Array.from(node.children).indexOf(node.querySelector(selector));
   return {hero:i(".v37-hero"),summary:i(".uxv5-summary"),
    context:i(".v37-context"),worklist:i(".v37-worklist"),guide:i(".v37-guide"),other:i(".v37-other")};
  });
  expect(position.hero).toBeLessThan(position.summary);
  expect(position.summary).toBeLessThan(position.context);
  expect(position.context).toBeLessThan(position.worklist);
  expect(position.worklist).toBeLessThan(position.guide);
  if(position.other>=0)expect(position.guide).toBeLessThan(position.other);
  if(kind==="patient"){
   await expect(root.locator(".v37-patient")).toBeVisible();
   await expect(root.locator(".v37-object")).toHaveCount(0);
  }else{
   await expect(root.locator(".v37-object")).toBeVisible();
   await expect(root.locator(".v37-patient")).toHaveCount(0);
  }
  const access=await root.getAttribute("data-v37-state");
  expect(["draft-only","denied"]).toContain(access);
  const cta=root.locator('.v37-worklist .uxv5-detail-actions [data-demo-action^="module:"]');
  if(access==="denied")await expect(cta).toHaveCount(0);
  else await expect(cta).toHaveCount(1);
  await root.locator('[data-v37-action="search"]').click();
  await expect(root.locator("#uxv5-search")).toBeFocused();
  await root.locator('[data-v37-action="guide"]').click();
  await expect(root.locator(".v37-guide")).toHaveJSProperty("open",true);
  await expect(root.locator(".v37-checks li")).toHaveCount(3);
  if(["DPJP Rawat Inap","Gudang","Petugas Bank Darah","Petugas BPJS","Payroll Admin","Tim PPI"].includes(role))
   await page.screenshot({path:out+"/v37-"+username+".png",fullPage:true});
  expect(errors).toEqual([]);
 });
}
test("V38 empty search shows useful state and can safely reset",async ({page})=>{
 await login(page,"akun.gudang");
 const root=page.locator(".v37-workspace");
 const search=root.locator("#uxv5-search");
 await search.fill("__tidak_ada_pekerjaan__");
 await expect(root).toHaveAttribute("data-v37-filter-state","empty");
 await expect(root.locator(".v37-zero")).toBeVisible();
 await expect(root.locator(".v37-zero")).toContainText("Tidak ada pekerjaan");
 await root.locator('[data-v37-action="reset"]').click();
 await expect(search).toHaveValue("");
 await expect(root).toHaveAttribute("data-v37-filter-state","results");
 await expect(root.locator(".v37-zero")).toBeHidden();
 await expect(root.locator(".uxv4-table tr[data-uxv5-row]")).toHaveCount(4);
});
test("V38 mixed transport scope changes from patient to object without identity leak",async ({page})=>{
 await login(page,"akun.koordinator-transport");
 let root=page.locator(".v37-workspace");
 await expect(root).toHaveAttribute("data-v37-kind","patient");
 await expect(root.locator(".v37-patient")).toBeVisible();
 await page.locator('.v37-workspace [data-demo-action="section:m1"]').first().click();
 root=page.locator(".v37-workspace");
 await expect(root).toHaveAttribute("data-uxv4-section","m1");
 await expect(root).toHaveAttribute("data-v37-kind","object");
 await expect(root.locator(".v37-patient")).toHaveCount(0);
 await expect(root.locator(".v37-object")).toBeVisible();
 await expect(root.locator(".v37-context")).not.toContainText("RM-DEMO");
});
test("V38 PPI case surveillance does not link a patient to audit indicator",async ({page})=>{
 await login(page,"akun.tim-ppi");
 let root=page.locator(".v37-workspace");
 await expect(root).toHaveAttribute("data-v37-kind","patient");
 await root.locator('[data-demo-action="section:m1"]').first().click();
 root=page.locator(".v37-workspace");
 await expect(root).toHaveAttribute("data-v37-kind","object");
 await expect(root.locator(".v37-patient")).toHaveCount(0);
 await expect(root.locator(".v37-object")).toBeVisible();
});
test("V38 mobile 390px retains 44px action, search and object context",async ({page})=>{
 await page.setViewportSize({width:390,height:844});
 await login(page,"akun.pengadaan");
 const root=page.locator(".v37-workspace"),button=root.locator('[data-v37-action="search"]');
 const b=await button.boundingBox();expect(b.height).toBeGreaterThanOrEqual(44);
 await button.click();
 await expect(root.locator("#uxv5-search")).toBeFocused();
 await expect(root.locator(".v37-object")).toBeVisible();
 await page.screenshot({path:out+"/v38-procurement-mobile.png",fullPage:true});
});
test("V39 reviewer does not inherit staff workspaces or finance shortcut",async ({page})=>{
 await login(page,"reviewer.demo");
 await expect(page.locator(".v37-workspace")).toHaveCount(0);
 await expect(page.locator(".v37-action")).toHaveCount(0);
 await expect(page.locator(".v37-context")).toHaveCount(0);
});
