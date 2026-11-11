import {test,expect} from "@playwright/test";
import {mkdirSync} from "node:fs";
const out="test-results/snapshots";
mkdirSync(out,{recursive:true});
const screens=[
 {id:"S02",account:"akun.pendaftaran",role:"Pendaftaran"},
 {id:"S03",account:"akun.dokter-rj",role:"Dokter RJ"},
 {id:"S04",account:"akun.perawat",role:"Perawat"},
 {id:"S05",account:"akun.dokter-igd",role:"Dokter IGD"},
 {id:"S06",account:"akun.bed-manager",role:"Bed Manager"},
 {id:"S07",account:"akun.atlm",role:"ATLM"},
 {id:"S08",account:"akun.farmasis",role:"Farmasis"},
 {id:"S09",account:"akun.kasir",role:"Kasir"},
 {id:"S10",account:"akun.manajemen-rs",role:"Manajemen RS"},
 {id:"S11",account:"akun.admin-sistem",role:"Admin Sistem"},
 {id:"S12",account:"akun.radiografer",role:"Radiografer"},
 {id:"S13",account:"akun.petugas-mcu",role:"Petugas MCU"}
];
async function login(page,account){
 await page.goto("/index.html");
 await page.locator('[data-demo-account="'+account+'"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
}
test("V40 visual-reference S01 login keeps two-column credential/account demo structure",async ({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto("/index.html");
 const login=page.locator("#demo-login");
 await expect(login).toBeVisible();
 await expect(login).toHaveAttribute("data-v40-screen","S01");
 await expect(login.locator(".demo-login-intro")).toBeVisible();
 await expect(login.locator(".demo-login-fields")).toBeVisible();
 await expect(login.locator(".demo-account-scroll")).toBeVisible();
 await expect(login.locator("#demo-login-form button[type='submit']")).toBeVisible();
 await page.screenshot({path:out+"/v42-screen-S01-login-desktop.png",fullPage:true});
});
for(const p of screens){
 test("V40 V42 reference capture "+p.id+" "+p.role,async ({page})=>{
  await page.setViewportSize({width:1440,height:900});
  const errors=[],calls=[];page.on("pageerror",e=>errors.push(e.message));
  page.on("request",r=>{if(/\/api\/v1\//.test(r.url()))calls.push(r.url());});
  await login(page,p.account);
  const root=page.locator('.uxv5[data-v40-screen="'+p.id+'"]');
  await expect(root).toBeVisible();
  await expect(root).toHaveAttribute("data-uxv4-role",p.role);
  await expect(root).toHaveAttribute("data-v40-reference",p.id.slice(1)+"_"+({
   "S02":"front","S03":"doctor","S04":"nurse","S05":"igd",
   "S06":"beds","S07":"lab","S08":"pharmacy","S09":"finance",
   "S10":"management","S11":"admin","S12":"radiology","S13":"mcu"
  }[p.id])+".png");
  await expect(root.locator(".uxv5-summary")).toBeVisible();
  await expect(root.locator(".uxv4-table")).toBeVisible();
  const aside=page.locator("#app>aside");
  await expect(aside).toBeVisible();
  const background=await aside.evaluate(node=>getComputedStyle(node).backgroundImage);
  expect(background).toContain("linear-gradient");
  const width=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  expect(width).toBeLessThanOrEqual(2);
  await page.screenshot({path:out+"/v42-screen-"+p.id+"-"+p.account+".png",fullPage:true});
  expect(errors).toEqual([]);
  expect(calls).toEqual([]);
 });
}
test("V41 no-match state on clinical role has safe reset and no record changes",async ({page})=>{
 await login(page,"akun.dokter-rj");
 const root=page.locator(".uxv5[data-v40-screen='S03']");
 const input=root.locator("#uxv5-search");
 await input.fill("__tidak_ada_pekerjaan__");
 await expect(root).toHaveAttribute("data-v41-result-state","empty");
 await expect(root.locator(".v41-empty-panel")).toBeVisible();
 await expect(root.locator(".v41-empty-panel")).toContainText("Tidak ada pekerjaan");
 await root.locator('[data-v41-reset]').click();
 await expect(input).toHaveValue("");
 await expect(root).toHaveAttribute("data-v41-result-state","results");
 await expect(root.locator(".v41-empty-panel")).toBeHidden();
 await expect(root.locator('tr[data-uxv5-row]')).toHaveCount(4);
});
test("V41 progressive form invalid review links to correct field and recovers focus",async ({page})=>{
 const errors=[],api=[];page.on("pageerror",e=>errors.push(e.message));
 page.on("request",r=>{if(r.url().includes("/api/v1/"))api.push(r.url());});
 await login(page,"akun.pendaftaran");
 await page.locator('#role-nav [data-demo-action="section:m1"]').click();
 await page.locator('.uxv5-detail [data-demo-action="module:CORE-09"]').click();
 const form=page.locator("#p0-editor");
 await expect(form).toBeVisible();
 await expect(form).toHaveAttribute("data-v41-form-state","draft");
 await expect(form.locator('.v41-form-state')).toContainText("Draft simulasi");
 await expect(form.locator('[data-p0-action="blocked"]')).toBeDisabled();
 await form.locator('[data-p0-action="review"]').click();
 await expect(form.locator("#p0-validation-summary")).toBeVisible();
 const navigation=form.locator(".v41-error-navigation");
 await expect(navigation).toBeVisible();
 const jumps=navigation.locator('[data-v41-field]');
 expect(await jumps.count()).toBeGreaterThan(0);
 const first=jumps.first();
 const fieldName=await first.getAttribute("data-v41-field");
 await first.click();
 const field=form.locator("[name='"+fieldName+"']");
 await expect(field).toBeVisible();
 await expect(field).toBeFocused();
 await expect(field).toHaveAttribute("aria-invalid","true");
 const described=await field.getAttribute("aria-describedby");
 expect(described).toContain("v41-error-");
 await page.screenshot({path:out+"/v42-form-validation-recovery.png",fullPage:true});
 expect(errors).toEqual([]);
 expect(api).toEqual([]);
});
for(const [viewport,account,id] of [
 [{width:980,height:800},"akun.pendaftaran","S02"],
 [{width:390,height:844},"akun.perawat","S04"],
 [{width:390,height:844},"akun.farmasis","S08"],
 [{width:390,height:844},"akun.kasir","S09"]
]){
 test("V42 viewport regression "+id+" "+viewport.width+"px",async ({page})=>{
  await page.setViewportSize(viewport);
  await login(page,account);
  const root=page.locator('.uxv5[data-v40-screen="'+id+'"]');
  await expect(root).toBeVisible();
  await expect(root.locator("#uxv5-search")).toBeVisible();
  await root.locator("#uxv5-search").focus();
  await expect(root.locator("#uxv5-search")).toBeFocused();
  const width=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  expect(width).toBeLessThanOrEqual(2);
  await page.screenshot({path:out+"/v42-mobile-"+id+"-"+viewport.width+".png",fullPage:true});
 });
}
test("V42 reviewer keeps unrestricted QA layout and no staff-only visual state",async ({page})=>{
 await login(page,"reviewer.demo");
 await expect(page.locator("#main-content .uxv5[data-v40-screen]")).toHaveCount(0);
 await expect(page.locator(".v41-empty-panel")).toHaveCount(0);
 await expect(page.locator(".v41-form-state")).toHaveCount(0);
});
