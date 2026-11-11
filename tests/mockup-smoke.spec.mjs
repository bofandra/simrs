import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const out = 'test-results/snapshots';
mkdirSync(out,{recursive:true});
const start = async (page) => {
  await page.goto('/index.html');
  await expect(page.locator('#demo-login-form')).toBeVisible();
  await page.locator('[data-demo-account="reviewer.demo"]').click();
  await page.locator('#demo-login-form button[type="submit"]').click();
  await expect(page.locator('#main-content')).not.toBeEmpty();
};
const forms = async (page) => {
  await page.locator('[data-nav="forms"]').click();
  await expect(page.getByText('Katalog Form & Workflow SIMRS')).toBeVisible();
};
const selectModule = async (page, code) => {
  await page.locator('#p0-priority').selectOption('all');
  await page.locator('#p0-search').fill(code);
  await page.locator('#p0-catalog-list [data-p0-action="choose"][data-code="'+code+'"]').click();
};
test('7 workspaces and 68 form catalog render with no browser errors',async ({page}) => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await start(page);
  for (const area of ['front','clinical','acute','lab','pharmacy','finance','management']) {
    await page.locator('[data-nav="'+area+'"]').click();
    await expect(page.locator('#main-content h1')).toBeVisible();
    await page.screenshot({path:out+'/'+area+'.png',fullPage:true});
  }
  await forms(page);
  await expect(page.getByText('68/68 modul memiliki form demo')).toBeVisible();
  await expect(page.locator('#p0-catalog-list [data-p0-action="choose"][data-code]')).toHaveCount(30);
  await page.locator('#p0-priority').selectOption('all');
  await expect(page.locator('#p0-catalog-list [data-p0-action="choose"][data-code]')).toHaveCount(68);
  expect(errors).toEqual([]);
});
test('registration draft validates and creates only a related simulated form',async ({page}) => {
  const errors=[],apiRequests=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if (/\/api\/v1\//.test(r.url()))apiRequests.push(r.url());});
  await start(page);
  await forms(page);
  await selectModule(page,'CORE-09');
  await page.locator('[data-p0-action="new"]').click();
  await page.locator('[data-p0-action="save"]').click();
  await page.locator('[data-p0-action="review"]').click();
  await expect(page.locator('#p0-validation-summary')).toBeVisible();
  await expect(page.locator('#p0-editor [name="visit_type"]')).toHaveAttribute('aria-invalid','true');
  await page.locator('#p0-editor [name="visit_type"]').selectOption('Rawat Jalan');
  await page.locator('#p0-editor [name="unit"]').selectOption('Poli Umum');
  await page.locator('#p0-editor [name="payer"]').selectOption('Umum');
  await page.locator('#p0-editor [name="visit_date"]').fill('2026-11-08');
  await page.locator('#p0-editor [name="checkin_state"]').selectOption('Terdaftar');
  await page.locator('[data-p0-action="review"]').click();
  await expect(page.locator('#p0-editor [name="visit_type"]')).toBeDisabled();
  await expect(page.locator('[data-p0-action="blocked"]')).toBeDisabled();
  await expect(page.locator('[data-p0-action="link"][data-target="RME-01"]')).toBeVisible();
  await page.screenshot({path:out+'/registration-reviewed.png',fullPage:true});
  await page.locator('[data-p0-action="link"][data-target="RME-01"]').click();
  await expect(page.locator('.p0-editor .card-h h2')).toHaveText('Form RME-01');
  await expect(page.locator('.p0-provenance')).toContainText('CORE-09');
  await expect(page.locator('#p0-editor [name="unit"]')).toHaveValue('Poli Umum');
  await expect(page.locator('#p0-editor [name="unit"]')).toBeDisabled();
  await page.locator('#role').selectOption('Dokter RJ');
  await expect(page.locator('.p0-editor .card-h h2')).toHaveText('Form RME-01');
  await expect(page.locator('#p0-editor [name="unit"]')).toBeEnabled();
  expect(errors).toEqual([]);
  expect(apiRequests).toEqual([]);
});
test('contract inspector explicitly shows the missing API and database mapping',async ({page}) => {
  await start(page);await forms(page);
  await selectModule(page,'RME-08');
  await expect(page.locator('.p0-contract summary')).toBeVisible();
  await page.locator('.p0-contract summary').click();
  await expect(page.locator('.p0-contract')).toContainText('/api/v1/orders');
  await expect(page.locator('.p0-contract')).toContainText('items');
  await expect(page.locator('.p0-contract')).toContainText('Belum ada item-level CPOE');
  await selectModule(page,'FIN-02');
  await page.locator('.p0-contract summary').click();
  await expect(page.locator('.p0-contract')).toContainText('charge_ids');
  await expect(page.locator('.p0-contract')).toContainText('Komposer charge_ids[] ada di mockup');
});
test('mobile form navigates with visible required fields and no script errors',async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await start(page);
  await forms(page);
  await selectModule(page,'CORE-08');
  await expect(page.locator('#p0-editor [name="patient_name"]')).toBeVisible();
  await expect(page.locator('[data-p0-action="blocked"]')).toBeDisabled();
  await page.screenshot({path:out+'/mobile-form.png',fullPage:true});
  expect(errors).toEqual([]);
});


test('one-click outpatient scenario produces ten drafts without transactions',async ({page}) => {
  await start(page);await forms(page);
  await page.locator('[data-p0-action="seedScenario"][data-flow="RJ"]').click();
  await expect(page.locator('.p0-editor .card-h h2')).toHaveText('Form CORE-09');
  const before=await page.evaluate(()=>Object.values(window.SIMRSFormEngine.getRecords()).flat().filter(x=>x.scenario_tag).map(x=>({status:x.status,patient_id:x.patient_id,encounter_id:x.encounter_id})));
  expect(before).toHaveLength(10);
  expect(before.every(x=>x.status==='Draft'&&x.patient_id==='p1'&&x.encounter_id==='ENC-DEMO-247')).toBeTruthy();
  await page.locator('[data-p0-action="seedScenario"][data-flow="RJ"]').click();
  const after=await page.evaluate(()=>Object.values(window.SIMRSFormEngine.getRecords()).flat().filter(x=>x.scenario_tag).length);
  expect(after).toBe(10);
  await page.screenshot({path:out+'/sample-outpatient.png',fullPage:true});
});

test('item-level CPOE composer saves two draft services and reviews without API requests',async ({page}) => {
  const errors=[],apiRequests=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if (r.url().includes('/api/v1/')) apiRequests.push(r.url());});
  await start(page);await forms(page);await selectModule(page,'RME-08');
  await page.locator('#role').selectOption('Dokter RJ');
  await page.locator('[data-p0-action="new"]').click();
  await page.locator('#p0-editor [name="order_type"]').selectOption('Laboratorium');
  await page.locator('#p0-editor [name="priority"]').selectOption('Rutin');
  await page.locator('#p0-editor [name="ordered_at"]').fill('2026-11-08T09:15');
  await page.locator('#p0-editor [name="indication"]').fill('Demonstrasi indikasi pemeriksaan sintetis');
  await page.locator('#p0-editor [name="orderer"]').selectOption('dr. Demo');
  await page.locator('#p0-editor [name="line-0-service_code"]').selectOption('CBC — Darah lengkap');
  await page.locator('#p0-editor [name="line-0-quantity"]').fill('1');
  await page.locator('[data-line-action="add"]').click();
  await page.locator('#p0-editor [name="line-1-service_code"]').selectOption('GLU — Glukosa');
  await page.locator('#p0-editor [name="line-1-quantity"]').fill('2');
  await page.locator('[data-p0-action="save"]').click();
  const record=await page.evaluate(()=>window.SIMRSFormEngine.getRecords()['RME-08'][0]);
  expect(record.values.items).toHaveLength(2);
  expect(record.values.service_code).toBe('CBC — Darah lengkap');
  expect(record.values.items[1].quantity).toBe('2');
  await page.locator('[data-p0-action="review"]').click();
  await expect(page.locator('.p0-editor .card-h')).toContainText('Reviewed (Demo)');
  await expect(page.locator('[data-line-action="add"]')).toHaveCount(0);
  await expect(page.locator('#p0-editor [name="line-0-quantity"]')).toBeDisabled();
  expect(apiRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test('FIN-01 to FIN-02 charge refs to FIN-03 allocation stays local and checked',async ({page}) => {
  const errors=[], apiRequests=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(r.url().includes('/api/v1/'))apiRequests.push(r.url());});
  await start(page);await forms(page);await selectModule(page,'FIN-01');
  await page.locator('#role').selectOption('Kasir');
  await page.locator('#p0-editor [name="service_ref"]').selectOption('LAB-DEMO-01');
  await page.locator('#p0-editor [name="performed_at"]').fill('2026-11-08T09:50');
  await page.locator('#p0-editor [name="quantity"]').fill('2');
  await page.locator('#p0-editor [name="unit_price"]').fill('75000');
  await page.locator('#p0-editor [name="charge_category"]').selectOption('Penunjang');
  await page.locator('[data-p0-action="save"]').click();
  await page.locator('[data-p0-action="review"]').click();
  const charge=await page.evaluate(()=>window.SIMRSFormEngine.getRecords()['FIN-01'][0]);
  expect(charge.status).toBe('Reviewed (Demo)');
  await page.locator('[data-p0-action="link"][data-target="FIN-02"]').first().click();
  await expect(page.locator('#p0-editor [name="finance-0-charge_ref"]')).toHaveValue(charge.id);
  await expect(page.locator('[data-finance-summary]')).toContainText('150.000');
  await page.locator('#p0-editor [name="payer"]').selectOption('Umum');
  await page.locator('#p0-editor [name="discount"]').fill('10000');
  await page.locator('#p0-editor [name="due_date"]').fill('2026-11-08');
  await page.locator('#p0-editor [name="invoice_state"]').selectOption('Draft');
  await page.locator('[data-p0-action="save"]').click();
  const invoice=await page.evaluate(()=>window.SIMRSFormEngine.getRecords()['FIN-02'][0]);
  expect(invoice.values.charge_ids).toEqual([charge.id]);
  expect(invoice.values.subtotal).toBe('150000');
  await page.locator('[data-p0-action="review"]').click();
  await expect(page.locator('.p0-editor .card-h')).toContainText('Reviewed (Demo)');
  await page.locator('[data-p0-action="link"][data-target="FIN-03"]').first().click();
  await expect(page.locator('#p0-editor [name="finance-0-invoice_ref"]')).toHaveValue(invoice.id);
  await expect(page.locator('#p0-editor [name="finance-0-amount"]')).toHaveValue('140000');
  await page.locator('#p0-editor [name="finance-0-amount"]').fill('999999');
  await page.locator('[data-p0-action="save"]').click();
  await expect(page.locator('#p0-editor [name="finance-0-amount"]')).toHaveAttribute('aria-invalid','true');
  await page.locator('#p0-editor [name="finance-0-amount"]').fill('140000');
  await page.locator('#p0-editor [name="payment_method"]').selectOption('Tunai (demo)');
  await page.locator('#p0-editor [name="payment_at"]').fill('2026-11-08T11:00');
  await page.locator('#p0-editor [name="verification"]').selectOption('Belum diverifikasi');
  await page.locator('[data-p0-action="save"]').click();
  const payment=await page.evaluate(()=>window.SIMRSFormEngine.getRecords()['FIN-03'][0]);
  expect(payment.values.allocations).toHaveLength(1);
  expect(payment.values.allocations[0].invoice_ref).toBe(invoice.id);
  expect(payment.values.amount).toBe('140000');
  await page.locator('[data-p0-action="review"]').click();
  await expect(page.locator('.p0-editor .card-h')).toContainText('Reviewed (Demo)');
  await expect(page.locator('[data-p0-action="blocked"]')).toBeDisabled();
  expect(errors).toEqual([]);
  expect(apiRequests).toEqual([]);
});

test('master reference lookup and guided outpatient steps maintain demo context',async ({page})=>{
  const errors=[],apiRequests=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(r.url().includes('/api/v1/'))apiRequests.push(r.url());});
  await start(page);await forms(page);
  await expect(page.locator('.p0-guide-steps [data-p0-action="guide"]')).toHaveCount(10);
  await page.locator('[data-p0-action="seedScenario"][data-flow="RJ"]').click();
  await page.locator('.p0-guide-steps [data-code="RME-01"]').click();
  await expect(page.locator('#role')).toHaveValue('Dokter RJ');
  await expect(page.locator('.p0-editor .card-h h2')).toHaveText('Form RME-01');
  await expect(page.locator('.p0-patient-banner')).toContainText('ENC-DEMO-247');
  await page.locator('#p0-editor [name="unit"]').selectOption('Jantung');
  await expect(page.locator('#p0-editor [name="practitioner"] option[value="dr. Demo"]')).toHaveCount(0);
  await expect(page.locator('#p0-editor [name="practitioner"] option[value="dr. Andi Demo"]')).toHaveCount(1);
  await page.locator('#p0-editor [name="practitioner"]').selectOption('dr. Andi Demo');
  await expect(page.locator('#p0-editor [data-master-meta="practitioner"]')).toContainText('PRACT-DEMO-03');
  await page.locator('.p0-guide-steps [data-code="FIN-01"]').click();
  await expect(page.locator('#role')).toHaveValue('Kasir');
  await expect(page.locator('.p0-editor .card-h h2')).toHaveText('Form FIN-01');
  await page.locator('[data-p0-action="new"]').click();
  await page.locator('#p0-editor [name="service_ref"]').selectOption('GLU — Glukosa');
  await expect(page.locator('#p0-editor [name="unit_price"]')).toHaveValue('45000');
  await expect(page.locator('#p0-editor [name="charge_category"]')).toHaveValue('Penunjang');
  await page.locator('#p0-editor [name="unit_price"]').fill('999');
  await page.locator('[data-p0-action="save"]').click();
  await expect(page.locator('#p0-editor [name="unit_price"]')).toHaveAttribute('aria-invalid','true');
  await page.locator('#p0-editor [name="service_ref"]').selectOption('CBC — Darah lengkap');
  await page.locator('#p0-editor [name="service_ref"]').selectOption('GLU — Glukosa');
  await page.locator('#p0-editor [name="performed_at"]').fill('2026-11-08T11:30');
  await page.locator('#p0-editor [name="quantity"]').fill('1');
  await page.locator('[data-p0-action="save"]').click();
  await page.locator('[data-p0-action="review"]').click();
  await expect(page.locator('.p0-editor .card-h')).toContainText('Reviewed (Demo)');
  expect(errors).toEqual([]);
  expect(apiRequests).toEqual([]);
});


test('IGD and inpatient guided tracks stay separate with idempotent draft seeding',async ({page})=>{
  const errors=[],api=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(r.url().includes('/api/v1/'))api.push(r.url());});
  await start(page);await forms(page);
  await page.locator('[data-p0-action="seedScenario"][data-flow="IGD"]').click();
  await expect(page.locator('.p0-guide h2')).toContainText('IGD');
  await expect(page.locator('.p0-guide-steps [data-p0-action="guide"]')).toHaveCount(7);
  const first=await page.evaluate(()=>Object.values(window.SIMRSFormEngine.getRecords()).flat()
    .filter(r=>r.scenario_tag==='IGD-DEMO-p1-ENC-DEMO-247'));
  expect(first).toHaveLength(7);
  expect(first.every(r=>r.status==='Draft'&&r.encounter_id==='ENC-DEMO-247')).toBeTruthy();
  await page.locator('[data-p0-action="seedScenario"][data-flow="IGD"]').click();
  const count=await page.evaluate(()=>Object.values(window.SIMRSFormEngine.getRecords()).flat()
    .filter(r=>r.scenario_tag==='IGD-DEMO-p1-ENC-DEMO-247').length);
  expect(count).toBe(7);
  await page.locator('.p0-guide-steps [data-code="RME-02"]').click();
  await expect(page.locator('#role')).toHaveValue('Dokter IGD');
  await expect(page.locator('#p0-editor [name="acuity"]')).toHaveValue('Kuning');
  await page.locator('[data-p0-action="seedScenario"][data-flow="RI"]').click();
  await expect(page.locator('.p0-guide h2')).toContainText('Rawat Inap');
  await expect(page.locator('.p0-guide-steps [data-p0-action="guide"]')).toHaveCount(9);
  const values=await page.evaluate(()=>Object.values(window.SIMRSFormEngine.getRecords()).flat()
    .filter(r=>r.scenario_tag==='RI-DEMO-p1-ENC-DEMO-247'));
  expect(values).toHaveLength(9);
  await page.locator('.p0-guide-steps [data-code="OPS-10"]').click();
  await expect(page.locator('#role')).toHaveValue('DPJP Rawat Inap');
  await expect(page.locator('#p0-editor [name="availability"]')).toHaveValue('Kosong');
  await page.locator('.p0-guide-tabs [data-flow="IGD"]').click();
  await expect(page.locator('.p0-guide h2')).toContainText('IGD');
  await page.locator('.p0-guide-steps [data-code="RME-02"]').click();
  await expect(page.locator('#p0-editor [name="acuity"]')).toHaveValue('Kuning');
  expect(errors).toEqual([]);
  expect(api).toEqual([]);
});

test('mobile IGD/RI tabs, forward/back navigation and synthetic patient context',async ({page})=>{
  await page.setViewportSize({width:390,height:844});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await start(page);await forms(page);
  await expect(page.locator('.p0-guide-tabs [data-p0-action="guideFlow"]')).toHaveCount(3);
  await page.locator('.p0-guide-tabs [data-flow="IGD"]').click();
  await expect(page.locator('.p0-guide-steps [data-p0-action="guide"]')).toHaveCount(7);
  await expect(page.locator('.p0-editor .card-h h2')).toHaveText('Form CORE-09');
  await page.locator('.p0-guide-nav [data-code="RME-02"]').click();
  await expect(page.locator('.p0-editor .card-h h2')).toHaveText('Form RME-02');
  await expect(page.locator('#role')).toHaveValue('Dokter IGD');
  await expect(page.locator('.p0-patient-banner')).toContainText('ENC-DEMO-247');
  await page.locator('.p0-guide-nav [data-code="CORE-09"]').click();
  await expect(page.locator('.p0-editor .card-h h2')).toHaveText('Form CORE-09');
  await page.locator('.p0-guide-tabs [data-flow="RI"]').click();
  await expect(page.locator('.p0-guide-steps [data-p0-action="guide"]')).toHaveCount(9);
  const dims=await page.locator('.p0-guide').evaluate(el=>{
    const a=el.getBoundingClientRect(),b=el.querySelector('.p0-guide-steps');
    return {w:a.width,viewport:window.innerWidth,scrollable:b.scrollWidth>=b.clientWidth};
  });
  expect(dims.w).toBeLessThanOrEqual(dims.viewport+1);
  expect(dims.scrollable).toBeTruthy();
  await page.screenshot({path:out+'/mobile-acute-guide.png',fullPage:true});
  expect(errors).toEqual([]);
});


test('Front Office v2 prevents premature check-in and opens P1 antrean from role shortcuts',async ({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await start(page);
  await expect(page.locator('#ux-registration')).toBeVisible();
  await expect(page.locator('#role-nav [data-ux-action="route:front:registration"]')).toBeVisible();
  await page.locator('[data-ux-action="checkin-front"]').click();
  await expect(page.locator('#ux-reg-error')).toContainText('MPI');
  await page.locator('[data-ux-action="mpi"]').click();
  await page.locator('[data-ux-action="save-front"]').click();
  await page.locator('[data-ux-action="checkin-front"]').click();
  await expect(page.locator('.ux-patient-banner')).toContainText('Check-in (Demo)');
  await page.locator('#role-nav [data-ux-action="module:CORE-11"]').click();
  await expect(page.locator('.p0-editor .card-h h2')).toHaveText('Form CORE-11');
  expect(errors).toEqual([]);
});

test('Dokter RJ v2 stores reviewed SOAP per patient and creates an addendum draft',async ({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await start(page);
  await page.locator('#role').selectOption('Dokter RJ');
  await expect(page.locator('#ux-soap-s')).toBeVisible();
  await page.locator('#ux-soap-s').fill('Keluhan demo sejak kemarin');
  await page.locator('#ux-soap-o').fill('TTV contoh normal');
  await page.locator('#ux-soap-a').fill('Asesmen contoh');
  await page.locator('#ux-soap-p').fill('Rencana observasi demo');
  await page.locator('[data-ux-action="doctor-review"]').click();
  await expect(page.locator('#ux-soap-error')).toContainText('alergi');
  await page.locator('#ux-allergy').check();
  await page.locator('[data-ux-action="doctor-review"]').click();
  await expect(page.locator('.ux-positive')).toBeVisible();
  await expect(page.locator('#ux-soap-s')).toBeDisabled();
  await page.locator('[data-ux-action="doctor-addendum"]').click();
  await expect(page.locator('#ux-soap-s')).toBeEnabled();
  await expect(page.locator('.ux-subhead')).toContainText('versi 2');
  await page.locator('[data-ux-action="tab:order"]').click();
  await expect(page.locator('.ux-module-panel [data-ux-action="module:RME-08"]')).toBeVisible();
  expect(errors).toEqual([]);
});



test('V22 login-first entry exposes 44 roles and opens Pendaftaran native worklist',async ({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/index.html');
  await expect(page.locator('#demo-login-form')).toBeVisible();
  await expect(page.locator('#app')).toBeHidden();
  await expect(page.locator('[data-demo-account]')).toHaveCount(45);
  await expect(page.locator('[data-demo-quick], .demo-quick-head, .demo-quick-roles')).toHaveCount(0);
  await expect(page.locator('.demo-account-title')).toContainText('Akun demo untuk pengujian');
  await page.locator('[data-demo-account="akun.pendaftaran"]').click();
  await expect(page.locator('#demo-username')).toHaveValue('akun.pendaftaran');
  await page.locator('#demo-login-form button[type="submit"]').click();
  await expect(page.locator('.uxv5 h1')).toHaveText('Beranda Pendaftaran');
  await expect(page.locator('[data-v18-screen="S02"]')).toBeVisible();
  await expect(page.locator('#ux-registration')).toHaveCount(0);
  await expect(page.locator('#demo-current-role')).toHaveText('Pendaftaran');
  await expect(page.locator('#navlist')).toBeHidden();
  await expect(page.locator('#role')).toBeHidden();
  await page.locator('#demo-logout').click();
  await expect(page.locator('#demo-login-form')).toBeVisible();
  await expect(page.locator('#app')).toBeHidden();
  expect(errors).toEqual([]);
});

test('specialist role login opens only their work area with role task navigation',async ({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/index.html');
  await page.locator('[data-demo-account="akun.petugas-laundry"]').click();
  await page.locator('#demo-login-form button[type="submit"]').click();
  await expect(page.locator('#main-content h1')).toHaveText('Beranda Petugas Laundry');
  await expect(page.locator('#role-nav [data-demo-action="section:m0"]')).toBeVisible();
  await expect(page.locator('[data-nav="clinical"]')).toBeHidden();
  await page.locator('#role-nav [data-demo-action="section:m0"]').click();
  await expect(page.locator('.uxv4 h1')).toHaveText('Penerimaan linen');
  await expect(page.locator('.uxv4 [data-demo-action="module:OPS-04"]').first()).toBeVisible();
  await page.locator('.uxv4 [data-demo-action="module:OPS-04"]').first().click();
  await expect(page.locator('.p0-editor .card-h h2')).toHaveText('Penerimaan linen');
  await expect(page.locator('.p0-catalog')).toHaveCount(0);
  await expect(page.locator('#p0-catalog-list [data-code="RME-08"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('V22 nurse role login opens dedicated nursing worklist, not physician prescribing',async ({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/index.html');
  await page.locator('[data-demo-account="akun.perawat"]').click();
  await page.locator('#demo-login-form button[type="submit"]').click();
  await expect(page.locator('#main-content h1')).toHaveText('Beranda Perawat');
  await expect(page.locator('#role-nav')).toContainText('CPPT dan serah terima');
  await expect(page.locator('[data-v18-screen="S04"]')).toBeVisible();
  await expect(page.getByRole('tab',{name:'E-Resep'})).toHaveCount(0);
  await expect(page.getByRole('tab',{name:'CPOE'})).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('Reviewer account retains previous 7-workspace test catalog for QA',async ({page})=>{
  await start(page);
  await expect(page.locator('[data-nav="clinical"]')).toBeVisible();
  await forms(page);
  await expect(page.getByText('68/68 modul memiliki form demo')).toBeVisible();
  await expect(page.locator('#role')).toBeVisible();
});

test('cashier has only billing worklists, no claim submission or tariff admin menu',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.kasir"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await expect(page.locator('#demo-current-role')).toHaveText('Kasir');
 await expect(page.locator('.uxv4 h1')).toHaveText('Beranda Kasir');
 await expect(page.locator('#main-content')).not.toContainText('Casemix INA-CBG');
 await expect(page.locator('#role-nav [data-demo-action="section:m0"]')).toContainText('Daftar tagihan');
 await expect(page.locator('#role-nav [data-demo-action="section:m1"]')).toContainText('Terima pembayaran');
 await expect(page.locator('#role-nav')).not.toContainText('Klaim');
 await expect(page.locator('#role-nav')).not.toContainText('Piutang');
 await expect(page.locator('#role-nav')).not.toContainText('Tarif');
 await page.locator('#role-nav [data-demo-action="section:m1"]').click();
 await expect(page.locator('.uxv4 h1')).toHaveText('Terima pembayaran');
 await expect(page.locator('.uxv4-trace')).toContainText('FIN-03');
 await expect(page.locator('.uxv4-trace')).toContainText('WF-08');
 await page.screenshot({path:out+'/role-kasir-worklist-v4.png',fullPage:true});
 expect(errors).toEqual([]);
});
test('doctor sidebar uses role worklists and tracks PRD clinical forms',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.dokter-rj"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await expect(page.locator('#role-nav [data-demo-action="section:m1"]')).toContainText('Asesmen dan SOAP');
 await expect(page.locator('#role-nav')).not.toContainText('Pembayaran');
 await page.locator('#role-nav [data-demo-action="section:m1"]').click();
 await expect(page.locator('.uxv4 h1')).toHaveText('Asesmen dan SOAP');
 await expect(page.locator('.uxv4-trace')).toContainText('RME-04');
 await expect(page.locator('.uxv4-trace')).toContainText('WF-02');
 expect(errors).toEqual([]);
});
test('nurse-specific menu excludes prescribing and includes handover',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.perawat"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await expect(page.locator('#role-nav')).toContainText('CPPT dan serah terima');
 await expect(page.locator('#role-nav')).not.toContainText('Resep elektronik');
 await expect(page.locator('#role-nav')).not.toContainText('Invoice');
 await page.locator('#role-nav [data-demo-action="section:m0"]').click();
 await expect(page.locator('.uxv4 h1')).toHaveText('Pasien shift ini');
 await page.screenshot({path:out+'/role-perawat-worklist-v4.png',fullPage:true});
 expect(errors).toEqual([]);
});

test('pharmacist starts in prescription queue without warehouse management controls',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.farmasis"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await expect(page.locator('.uxv4 h1')).toHaveText('Beranda Farmasis');
 await expect(page.locator('#role-nav')).toContainText('Verifikasi resep');
 await expect(page.locator('#role-nav')).not.toContainText('Gudang');
 await page.locator('#role-nav [data-demo-action="section:m0"]').click();
 await expect(page.locator('.uxv4 h1')).toHaveText('Antrean resep');
 await expect(page.locator('.uxv4-table tbody tr')).toHaveCount(4);
 await expect(page.locator('.uxv4-table')).toContainText('RX-0027');
 await page.screenshot({path:out+'/role-farmasi-worklist-v4.png',fullPage:true});
 expect(errors).toEqual([]);
});

test('bed manager and billing user get distinct specialized menus',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.bed-manager"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await expect(page.locator('.uxv4 h1')).toHaveText('Beranda Bed Manager');
 await expect(page.locator('#role-nav')).toContainText('Permintaan alokasi');
 await expect(page.locator('#role-nav')).not.toContainText('Resep elektronik');
 await page.locator('#demo-logout').click();
 await page.locator('[data-demo-account="akun.petugas-billing"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await expect(page.locator('.uxv4 h1')).toHaveText('Beranda Petugas Billing');
 await expect(page.locator('#role-nav')).toContainText('Charge capture');
 await expect(page.locator('#role-nav')).not.toContainText('Terima pembayaran');
 expect(errors).toEqual([]);
});


test('V5 clinical and cashier worklist details select the correct task without exposing unrelated modules',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.kasir"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await page.locator('#role-nav [data-demo-action="section:m1"]').click();
 await expect(page.locator('.uxv5 h1')).toHaveText('Terima pembayaran');
 await expect(page.locator('.uxv5-detail')).toContainText('INV-D081');
 await page.locator('.uxv5 [data-demo-action="job:2"]').click();
 await expect(page.locator('.uxv5-detail')).toContainText('INV-D083');
 await expect(page.locator('.uxv5-detail')).toContainText('Sisa tagihan perlu ditinjau');
 await expect(page.locator('.uxv5-detail')).toContainText('FIN-03');
 await expect(page.locator('.uxv5-detail')).not.toContainText('FIN-01');
 await expect(page.locator('.uxv5 [data-demo-action="job:2"]')).toHaveAttribute('aria-pressed','true');
 await page.locator('#uxv5-search').fill('tidak ada');
 await expect(page.locator('#uxv5-empty')).toBeVisible();
 await expect(page.locator('.uxv5 .uxv4-table tbody tr:visible')).toHaveCount(0);
 await page.locator('#uxv5-search').fill('INV-D082');
 await expect(page.locator('#uxv5-empty')).toBeHidden();
 await expect(page.locator('.uxv5 .uxv4-table tbody tr:visible')).toHaveCount(1);
 await page.screenshot({path:out+'/role-kasir-contextual-v5.png',fullPage:true});
 expect(errors).toEqual([]);
});

test('V5 registration and emergency role worklists show contextual checks',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.pendaftaran"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await page.locator('#role-nav [data-demo-action="home"]').click();
 await expect(page.locator('.uxv5 h1')).toHaveText('Beranda Pendaftaran');
 await page.locator('#role-nav [data-demo-action="section:m0"]').click();
 await expect(page.locator('.uxv5-detail')).toContainText('Cek nomor RM dan data identitas');
 await expect(page.locator('.uxv5 .uxv4-table tbody tr')).toHaveCount(4);
 await page.locator('#demo-logout').click();
 await page.locator('[data-demo-account="akun.dokter-igd"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await page.locator('#role-nav [data-demo-action="section:m3"]').click();
 await expect(page.locator('.uxv5 h1')).toHaveText('Keputusan disposisi');
 await page.locator('.uxv5 [data-demo-action="job:3"]').click();
 await expect(page.locator('.uxv5-detail')).toContainText('Rencana rujukan perlu konfirmasi');
 await expect(page.locator('.uxv5-detail')).toContainText('RME-02');
 await expect(page.locator('#role-nav')).not.toContainText('Invoice');
 expect(errors).toEqual([]);
});


test('mobile role navigation opens a focused registration form, not a three-column module catalog',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width:390,height:844});
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.pendaftaran"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await expect(page.locator('#demo-mobile-nav-toggle')).toBeVisible();
 await expect(page.locator('#app > aside')).toBeHidden();
 await page.locator('#demo-mobile-nav-toggle').click();
 await expect(page.locator('#demo-mobile-nav-toggle')).toHaveAttribute('aria-expanded','true');
 await expect(page.locator('#app > aside')).toBeVisible();
 await page.locator('#role-nav [data-demo-action="section:m1"]').click();
 await expect(page.locator('#app > aside')).toBeHidden();
 await expect(page.locator('.uxv5 h1')).toHaveText('Registrasi kunjungan');
 await expect(page.locator('.uxv5 .uxv4-table tbody tr')).toHaveCount(4);
 await page.locator('.uxv5 [data-demo-action="job:1"]').click();
 await expect(page.locator('.uxv5-detail')).toContainText('REG-D002');
 await page.locator('.uxv5-detail [data-demo-action="module:CORE-09"]').click();
 await expect(page.locator('#main-content h1')).toHaveText('Registrasi kunjungan');
 await expect(page.locator('#p0-editor')).toBeVisible();
 await expect(page.locator('#p0-editor [name="visit_type"]')).toBeVisible();
 await expect(page.locator('.p0-operational .p0-catalog')).toHaveCount(0);
 await expect(page.locator('#p0-catalog-list')).toHaveCount(0);
 await expect(page.locator('.p0-operational-history')).toBeVisible();
 await expect(page.locator('#main-content')).not.toContainText('Katalog 68 Modul');
 const dimensions=await page.evaluate(()=>({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,form:document.querySelector('#p0-editor').getBoundingClientRect().width}));
 expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.viewport+2);
 expect(dimensions.form).toBeGreaterThan(290);
 await page.screenshot({path:out+'/role-registration-native-mobile-v6.png',fullPage:true});
 expect(errors).toEqual([]);
});

test('tablet-size role workspace uses collapsed nav, and reviewer still has catalog',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width:980,height:800});
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.farmasis"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await expect(page.locator('#demo-mobile-nav-toggle')).toBeVisible();
 await expect(page.locator('#app > aside')).toBeHidden();
 await page.locator('#demo-mobile-nav-toggle').click();
 await page.locator('#role-nav [data-demo-action="section:m2"]').click();
 await page.locator('.uxv5-detail [data-demo-action="module:MED-05"]').click();
 await expect(page.locator('#main-content h1')).toHaveText('Penyiapan obat');
 await expect(page.locator('#p0-catalog-list')).toHaveCount(0);
 await expect(page.locator('#p0-editor')).toBeVisible();
 await page.locator('#demo-logout').click();
 await page.locator('[data-demo-account="reviewer.demo"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await page.locator('[data-nav="forms"]').click();
 await expect(page.locator('#p0-catalog-list [data-code]')).toHaveCount(68);
 await expect(page.getByText('Katalog Form & Workflow SIMRS')).toBeVisible();
 expect(errors).toEqual([]);
});

test('V7 registration work item opens the matching synthetic patient encounter and isolates drafts',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.pendaftaran"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await page.locator('#role-nav [data-demo-action="section:m1"]').click();
 await page.locator('.uxv5 [data-demo-action="job:1"]').click();
 await expect(page.locator('.uxv5-detail')).toContainText('Bima Rahman');
 await expect(page.locator('.uxv5-detail')).toContainText('ENC-DEMO-248');
 await page.locator('.uxv5-detail [data-demo-action="module:CORE-09"]').click();
 await expect(page.locator('#p0-editor')).toHaveAttribute('data-work-item','REG-D002');
 await expect(page.locator('.p0-patient-banner')).toContainText('Bima Rahman');
 await expect(page.locator('.p0-patient-banner')).toContainText('ENC-DEMO-248');
 await expect(page.locator('#p0-editor [name="unit"]')).toHaveValue('Jantung');
 await expect(page.locator('#p0-editor [name="payer"]')).toHaveValue('Umum');
 await expect(page.locator('#p0-editor [name="visit_type"]')).toHaveValue('Rawat Jalan');
 await page.locator('#p0-editor [name="visit_date"]').fill('2026-11-09');
 const checkin=page.locator('#p0-editor [name="checkin_state"]');
 const checkinStep=await checkin.evaluate(el=>Array.from(el.closest('.v13-form-section').parentElement.children).indexOf(el.closest('.v13-form-section')));
 await page.locator('#p0-editor [data-v15-go="'+checkinStep+'"]').click();
 await checkin.selectOption('Terdaftar');
 await page.locator('[data-p0-action="save"]').click();
 const records=await page.evaluate(()=>window.SIMRSFormEngine.getRecords()['CORE-09']||[]);
 expect(records.some(r=>r.patient_id==='p2'&&r.encounter_id==='ENC-DEMO-248'&&r.work_item_id==='REG-D002')).toBeTruthy();
 await page.locator('.p0-operational [data-demo-action="section:m1"]').click();
 await page.locator('.uxv5 [data-demo-action="job:0"]').click();
 await page.locator('.uxv5-detail [data-demo-action="module:CORE-09"]').click();
 await expect(page.locator('#p0-editor')).toHaveAttribute('data-work-item','REG-D001');
 await expect(page.locator('.p0-patient-banner')).toContainText('Sari Amelia');
 await expect(page.locator('.p0-patient-banner')).toContainText('ENC-DEMO-247');
 await expect(page.locator('#p0-editor [name="visit_date"]')).toHaveValue('');
 expect(errors).toEqual([]);
});

test('V7 preserves patient episode boundaries for emergency and avoids false bed-patient linking',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.dokter-igd"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await page.locator('#role-nav [data-demo-action="section:m0"]').click();
 await page.locator('.uxv5 [data-demo-action="job:2"]').click();
 await page.locator('.uxv5-detail [data-demo-action="module:RME-02"]').click();
 await expect(page.locator('#p0-editor')).toHaveAttribute('data-work-item','IGD-D03');
 await expect(page.locator('.p0-patient-banner')).toContainText('Nadia Laras');
 await expect(page.locator('.p0-patient-banner')).toContainText('ENC-IGD-DEMO-03');
 await page.locator('#demo-logout').click();
 await page.locator('[data-demo-account="akun.bed-manager"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await page.locator('#role-nav [data-demo-action="section:m1"]').click();
 await expect(page.locator('.uxv5-detail')).toContainText('Objek kerja adalah tempat tidur');
 await expect(page.locator('.uxv5-detail [data-demo-action="module:OPS-10"]')).toHaveCount(0);
 expect(errors).toEqual([]);
});

test('V8 design gallery exposes 13 screens, context, search and simulated draft',async ({page}) => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/design-gallery.html');
  await expect(page.locator('#gallery-nav button[data-view]')).toHaveCount(13);
  await page.locator('#gallery-nav [data-view="2"]').click();
  await expect(page.locator('#screen-host h2')).toHaveText('Konsultasi & Rekam Medis');
  await page.locator('#gallery-search').fill('Siti Rahma');
  await expect(page.locator('#gallery-table tbody tr').nth(0)).toBeHidden();
  await expect(page.locator('#gallery-table tbody tr').nth(1)).toBeVisible();
  await page.locator('#gallery-search').fill('');
  await page.locator('#gallery-table tbody tr').nth(0).click();
  await page.locator('[data-tab="1"]').click();
  await expect(page.locator('.tabs button.active')).toHaveText('Diagnosis');
  await page.locator('[data-action="draft"]').click();
  await expect(page.locator('#gallery-toast')).toContainText('Tidak ada data pasien/keuangan yang disimpan');
  await page.setViewportSize({width:390,height:844});
  await page.locator('#gallery-nav [data-view="6"]').click();
  await expect(page.locator('#screen-host h2')).toHaveText('Laboratorium & LIS');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
  expect(overflow).toBe(false);
  expect(errors).toEqual([]);
});

test('V10 ATLM worklist opens correct specimen and patient-context demo form',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.atlm"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await expect(page.locator('#main-content h1')).toHaveText('Beranda ATLM');
 await page.locator('#role-nav [data-demo-action="section:m1"]').click();
 await expect(page.locator('.uxv5')).toBeVisible();
 await page.locator('.uxv5 [data-demo-action="job:1"]').click();
 await expect(page.locator('.uxv5-detail')).toContainText('LAB-002');
 await page.locator('.uxv5-detail [data-demo-action="module:MED-01"]').click();
 await expect(page.locator('#p0-editor')).toHaveAttribute('data-work-item','LAB-002');
 await expect(page.locator('.p0-patient-banner')).toContainText('Bima Rahman');
 expect(errors).toEqual([]);
});

test('V10 radiologist opens permitted report form with synthetic study and patient context',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.radiolog"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await page.locator('#role-nav [data-demo-action="section:m2"]').click();
 await expect(page.locator('.uxv5-detail')).toContainText('Konteks pasien');
 await expect(page.locator('.uxv5-detail')).toContainText('Draft simulasi tersedia');
 await page.locator('.uxv5-detail [data-demo-action="module:MED-02"]').click();
 await expect(page.locator('#p0-editor')).toHaveAttribute('data-work-item','RAD-REP-001');
 await expect(page.locator('.p0-patient-banner')).toContainText('Sari Amelia');
 await expect(page.locator('.p0-patient-banner')).toContainText('ENC-IGD-DEMO-01');
 expect(errors).toEqual([]);
});

test('V10 admin distinguishes access request objects and patient-specific consent',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.admin-sistem"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await page.locator('#role-nav [data-demo-action="section:m0"]').click();
 await expect(page.locator('.uxv5-detail')).toContainText('Objek kerja nonpasien');
 await page.locator('.uxv5-detail [data-demo-action="module:CORE-02"]').click();
 await expect(page.locator('#p0-editor')).toHaveAttribute('data-work-item','ADM-001');
 await expect(page.locator('.p0-patient-banner')).toContainText('Data administrasi / master');
 await page.locator('#role-nav [data-demo-action="section:m5"]').click();
 await expect(page.locator('.uxv5-detail')).toContainText('Konteks pasien');
 await page.locator('.uxv5-detail [data-demo-action="module:CORE-12"]').click();
 await expect(page.locator('.p0-patient-banner')).toContainText('ENC-DEMO-247');
 expect(errors).toEqual([]);
});

test('V10 MCU links authorized checkup form to a synthetic participant encounter',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.petugas-mcu"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await expect(page.locator('#main-content h1')).toHaveText('Beranda Petugas MCU');
 await page.locator('#role-nav [data-demo-action="section:m0"]').click();
 await expect(page.locator('.uxv5-detail')).toContainText('Konteks pasien');
 await page.locator('.uxv5-detail [data-demo-action="module:MED-10"]').click();
 await expect(page.locator('#p0-editor')).toHaveAttribute('data-work-item','MCU-001');
 await expect(page.locator('.p0-patient-banner')).toContainText('Sari Amelia');
 expect(errors).toEqual([]);
});


test('V11 nutritionist uses a scoped clinical worklist and authorized patient draft',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.ahli-gizi"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await expect(page.locator('#main-content h1')).toHaveText('Beranda Ahli Gizi');
 await page.locator('#role-nav [data-demo-action="section:m1"]').click();
 await expect(page.locator('.uxv5')).toBeVisible();
 await expect(page.locator('.uxv5-detail')).toContainText('GIZ-0201');
 await expect(page.locator('.uxv5-detail')).toContainText('Konteks pasien');
 await page.locator('.uxv5 [data-demo-action="job:1"]').click();
 await expect(page.locator('.uxv5-detail')).toContainText('GIZ-0202');
 expect(errors).toEqual([]);
});

test('V11 CSSD worklist is object-scoped and never infers a patient encounter',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.petugas-cssd"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await expect(page.locator('#main-content h1')).toHaveText('Beranda Petugas CSSD');
 await page.locator('#role-nav [data-demo-action="section:m1"]').click();
 await expect(page.locator('.uxv5-detail')).toContainText('CSS-0201');
 await expect(page.locator('.uxv5-detail')).toContainText('Objek kerja nonpasien');
 await expect(page.locator('.uxv5-detail')).not.toContainText('Konteks pasien');
 expect(errors).toEqual([]);
});

test('V11 demo patient portal remains bound to one synthetic patient through all its work items',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.pasien-demo"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await expect(page.locator('#main-content h1')).toHaveText('Beranda Pasien Demo');
 await page.locator('#role-nav [data-demo-action="section:m1"]').click();
 await expect(page.locator('.uxv5-detail')).toContainText('SELF-0201');
 await expect(page.locator('.uxv5-detail')).toContainText('ENC-DEMO-247');
 await page.locator('.uxv5 [data-demo-action="job:3"]').click();
 await expect(page.locator('.uxv5-detail')).toContainText('SELF-0204');
 await expect(page.locator('.uxv5-detail')).toContainText('ENC-DEMO-247');
 expect(errors).toEqual([]);
});


test('V12 role-first worklist has patient context, numeric summary, and combined filters',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.pendaftaran"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await page.locator('#role-nav [data-demo-action="home"]').click();
 const view=page.locator('.uxv5.v12-parity');
 await expect(view).toBeVisible();
 await expect(view.locator('.v12-context')).toContainText('ENC-DEMO');
 await expect(view.locator('.v12-context')).toContainText('RM-');
 await expect(view.locator('.uxv5-summary')).toContainText('Pekerjaan aktif');
 await expect(view.locator('[data-v12-filter="Semua"]')).toHaveAttribute('aria-pressed','true');
 await view.locator('[data-v12-filter="Menunggu"]').click();
 await expect(view.locator('[data-v12-filter="Menunggu"]')).toHaveAttribute('aria-pressed','true');
 await expect(view.locator('tbody tr:not([data-v12-hidden])')).toHaveCount(2);
 await view.locator('#uxv5-search').fill('REG-D002');
 await expect(view.locator('tbody tr:not([data-v12-hidden])')).toHaveCount(1);
 await expect(view.locator('tbody tr:not([data-v12-hidden])')).toContainText('REG-D002');
 await view.locator('#uxv5-search').fill('tidak-ditemukan-987');
 await expect(view.locator('#uxv5-empty')).toBeVisible();
 await view.locator('#uxv5-search').fill('');
 await view.locator('[data-v12-filter="Semua"]').click();
 await expect(view.locator('tbody tr:not([data-v12-hidden])')).toHaveCount(4);
 expect(errors).toEqual([]);
});

test('V12 doctor, lab and cashier keep distinct contexts without unauthorized actions',async ({page})=>{
 for(const [username,expected] of [
  ['akun.dokter-rj','Konsultasi dan catatan klinis'],
  ['akun.atlm','Spesimen dan hasil laboratorium'],
  ['akun.kasir','Tagihan dan pembayaran']
 ]){
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/index.html');
  await page.evaluate(()=>sessionStorage.removeItem('simrs-demo-login-session-v1'));
  await page.reload();
  await page.locator('[data-demo-account="'+username+'"]').click();
  await page.locator('#demo-login-form button[type="submit"]').click();
  await page.locator('#role-nav [data-demo-action="home"]').click();
  await expect(page.locator('.uxv5.v12-parity .v12-context-eyebrow')).toContainText(expected);
  await expect(page.locator('.uxv5.v12-parity .v12-filterbar')).toBeVisible();
  await expect(page.locator('.uxv5.v12-parity .uxv5-detail')).toBeVisible();
  expect(errors).toEqual([]);
 }
});

test('V12 mobile worklist stays within viewport and opens only authorized contextual form',async ({page})=>{
 await page.setViewportSize({width:390,height:844});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.dokter-rj"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await page.locator('#demo-mobile-nav-toggle').click();
 await page.locator('#role-nav [data-demo-action="home"]').click();
 await expect(page.locator('.uxv5.v12-parity .v12-context')).toBeVisible();
 await expect(page.locator('.uxv5.v12-parity .v12-filterbar')).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 expect(overflow).toBeLessThanOrEqual(2);
 await page.locator('.uxv5-detail [data-demo-action="module:RME-01"]').click();
 await expect(page.locator('.p0-operational #p0-editor')).toBeVisible();
 await expect(page.locator('.p0-patient-banner')).toContainText('ENC-DEMO');
 expect(errors).toEqual([]);
});


const openV13RoleForm=async (page,account,section,code)=>{
 await page.goto('/index.html');
 if(!(await page.locator('#demo-login-form').isVisible())){
   await page.evaluate(()=>sessionStorage.removeItem('simrs-demo-login-session-v1'));
   await page.reload();
 }
 await page.locator('[data-demo-account="'+account+'"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 const mobileToggle=page.locator('#demo-mobile-nav-toggle');
 if(await mobileToggle.isVisible())await mobileToggle.click();
 await page.locator('#role-nav [data-demo-action="section:'+section+'"]').click();
 await page.locator('.uxv5-detail [data-demo-action="module:'+code+'"]').click();
 await expect(page.locator('.p0-operational[data-module="'+code+'"]')).toBeVisible();
 await expect(page.locator('#p0-editor .v13-form-intro')).toBeVisible();
 await expect(page.locator('#p0-editor .p0-fields.v13-form-fields')).toBeVisible();
};

test('V13 clinical SOAP sections preserve draft values and reactively track required inputs',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await openV13RoleForm(page,'akun.dokter-rj','m1','RME-04');
 const form=page.locator('#p0-editor');
 await expect(form.locator('.v13-form-section').first()).toBeVisible();
 await expect(form.locator('.v13-form-section[data-v13-type="subjective"]')).toBeHidden();
 await expect(form.locator('.v13-form-section[data-v13-type="objective"]')).toBeHidden();
 await expect(form.locator('.v13-form-section[data-v13-type="assessment"]')).toBeHidden();
 await expect(form.locator('.v13-form-section[data-v13-type="plan"]')).toBeHidden();
 await expect(form.locator('.v15-tab')).toHaveCount(5);
 await form.locator('[data-v15-go="1"]').click();
 const before=await form.locator('#v13-progress').evaluate(el=>Number(el.value));
 await form.locator('[name="subjective"]').fill('Contoh keluhan sintetis untuk latihan');
 await expect(form.locator('#v13-progress')).toHaveJSProperty('value',before+1);
 await form.locator('[data-p0-action="save"]').click();
 await expect(page.locator('.p0-editor .card-h')).toContainText('Draft');
 await expect(page.locator('#p0-editor [name="subjective"]')).toHaveValue('Contoh keluhan sintetis untuk latihan');
 await expect(page.locator('.p0-patient-banner')).toContainText('ENC-DEMO');
 expect(errors).toEqual([]);
});

test('V13 operational forms display distinct clinical and administrative workflows with unchanged fields',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const scenarios=[
  ['akun.pendaftaran','m1','CORE-09','visit_type','Registrasi kunjungan'],
  ['akun.perawat','m1','RME-05','systolic','Pencatatan tanda vital'],
  ['akun.dokter-igd','m0','RME-02','acuity','Triase dan asesmen IGD'],
  ['akun.atlm','m1','MED-01','accession','Penerimaan spesimen'],
  ['akun.farmasis','m2','MED-05','lot_number','Telaah dan penyiapan obat'],
  ['akun.kasir','m1','FIN-03','payment_method','Pencatatan pembayaran'],
  ['akun.radiografer','m1','MED-02','exam_code','Pelaksanaan radiologi'],
  ['akun.petugas-mcu','m1','MED-10','package_code','Medical Check Up']
 ];
 for(const [account,section,code,field,label] of scenarios){
  await openV13RoleForm(page,account,section,code);
  await expect(page.locator('.v13-form-intro')).toContainText(label);
  expect(await page.locator('#p0-editor .v13-form-section').count()).toBeGreaterThanOrEqual(2);
  const input=page.locator('#p0-editor [name="'+field+'"]');
  const idx=await input.evaluate(el=>Array.from(el.closest('.v13-form-section').parentElement.children).indexOf(el.closest('.v13-form-section')));
  const form=page.locator('#p0-editor');
  await form.locator('[data-v15-go="'+idx+'"]').click();
  await expect(input).toBeVisible();
  await expect(form.locator('.v13-form-section:visible')).toHaveCount(1);
  await expect(page.locator('#p0-editor [data-p0-action="blocked"]')).toBeDisabled();
 }
 expect(errors).toEqual([]);
});

test('V13 mobile form is one column and reviewer keeps the original 68-module catalog',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width:390,height:844});
 await openV13RoleForm(page,'akun.perawat','m1','RME-05');
 await expect(page.locator('#p0-editor .v13-form-intro')).toBeVisible();
 const cols=await page.locator('.v13-field-grid').first().evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length);
 expect(cols).toBe(1);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 expect(overflow).toBeLessThanOrEqual(2);
 await page.locator('#demo-logout').click();
 await page.locator('[data-demo-account="reviewer.demo"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await page.locator('[data-nav="forms"]').click();
 await expect(page.locator('#p0-catalog-list')).toBeVisible();
 await expect(page.locator('.v13-form-intro')).toHaveCount(0);
 expect(errors).toEqual([]);
});


test('V14 radiographer screenshot: action is visible above detail metadata and opens V13 study form', async ({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.setViewportSize({width:1654,height:928});
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.radiografer"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await page.locator('#role-nav [data-demo-action="section:m2"]').click();
 const detail=page.locator('.uxv5.v12-parity .uxv5-detail');
 await expect(detail).toContainText('Rontgen thoraks');
 const cta=detail.locator('.uxv14-primary-action [data-demo-action="module:MED-02"]');
 await expect(cta).toBeVisible();
 await expect(cta).toContainText('Buka form');
 const order=await detail.evaluate(el=>{
  const c=el.querySelector('.uxv14-primary-action');
  const d=el.querySelector('dl');
  return {cta:(c&&c.getBoundingClientRect().top),meta:(d&&d.getBoundingClientRect().top),bottom:c&&c.getBoundingClientRect().bottom};
 });
 expect(order.cta).toBeLessThan(order.meta);
 expect(order.bottom).toBeLessThan(928);
 await cta.click();
 await expect(page.locator('.p0-operational[data-module="MED-02"]')).toBeVisible();
 await expect(page.locator('#p0-editor')).toHaveAttribute('data-work-item','RAD-EX-001');
 await expect(page.locator('.v13-form-intro')).toContainText('Pelaksanaan radiologi');
 await expect(page.locator('.p0-patient-banner')).toContainText('Sari Amelia');
 expect(errors).toEqual([]);
});

test('V15 keeps one task form section visible while preserving values across steps',async ({page})=>{
 const errors=[],apiRequests=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('request',request=>{if(request.url().includes('/api/v1/'))apiRequests.push(request.url());});
 await openV13RoleForm(page,'akun.dokter-rj','m1','RME-04');
 const form=page.locator('#p0-editor');
 await expect(form.locator('.v15-section-tabs')).toBeVisible();
 await expect(form.locator('.v13-form-section:visible')).toHaveCount(1);
 await form.locator('[data-v15-go="1"]').click();
 await form.locator('[name="subjective"]').fill('Nyeri perut demo sejak kemarin');
 await form.locator('[data-v15-move="next"]').click();
 await expect(form.locator('.v13-form-section[data-v13-type="objective"]')).toBeVisible();
 await expect(form.locator('[name="subjective"]')).toBeHidden();
 await form.locator('[data-v15-go="1"]').click();
 await expect(form.locator('[name="subjective"]')).toHaveValue('Nyeri perut demo sejak kemarin');
 await form.locator('[data-p0-action="save"]').click();
 await expect(page.locator('.p0-editor .card-h')).toContainText('Draft');
 await expect(form.locator('.v13-form-section:visible')).toHaveCount(1);
 expect(errors).toEqual([]);expect(apiRequests).toEqual([]);
});


test('V16 IGD clinical benchmark opens only one subform section, saves scoped demo draft and shows read-only history',async ({page})=>{
 const errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(r.url().includes('/api/v1/'))requests.push(r.url());});
 await openV13RoleForm(page,'akun.dokter-igd','m0','RME-02');
 const panel=page.locator('#benchmark-v16');
 await expect(panel).toBeVisible();
 await expect(page.locator('#p0-editor')).toBeVisible();
 await panel.locator('summary').click();
 await expect(page.locator('#p0-editor')).toBeHidden();
 await panel.locator('[data-v16-action="choose"][data-id="CF-01"]').click();
 await expect(panel.locator('#v16-active')).toContainText('Triase terstruktur ABCDE');
 await expect(panel.locator('.v16-fields')).toBeVisible();
 await expect(panel.locator('[data-v16-field="chief_complaint"]')).toBeVisible();
 await panel.locator('[data-v16-field="chief_complaint"]').fill('Keluhan pasien demo saja');
 await panel.locator('[data-v16-action="next"]').click();
 await expect(panel.locator('[data-v16-field="airway"]')).toBeVisible();
 await expect(panel.locator('[data-v16-field="chief_complaint"]')).toHaveCount(0);
 await panel.locator('[data-v16-action="back"]').click();
 await expect(panel.locator('[data-v16-field="chief_complaint"]')).toHaveValue('Keluhan pasien demo saja');
 await panel.locator('[data-v16-action="save"]').click();
 await expect(panel.locator('#v16-feedback')).toContainText('Draft simulasi tersimpan');
 await panel.locator('[data-v16-action="history"]').click();
 await expect(panel.locator('.v16-history')).toBeVisible();
 await expect(panel.locator('.v16-history')).toContainText('CF-01');
 await expect(panel.locator('.v16-history')).toContainText('Draft (demo)');
 await panel.locator('.v16-details > summary').click();
 await expect(page.locator('#p0-editor')).toBeVisible();
 expect(requests).toEqual([]);expect(errors).toEqual([]);
});
test('V16 nursing assessment and NCP are accessible, while PRMRJ and partograph remain gated',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await openV13RoleForm(page,'akun.perawat','m2','RME-07');
 const panel=page.locator('#benchmark-v16');
 await panel.locator('summary').click();
 await expect(panel.locator('[data-v16-action="choose"][data-id="CF-02"]')).toBeVisible();
 await expect(panel.locator('[data-v16-action="choose"][data-id="CF-03"]')).toBeVisible();
 await panel.locator('[data-v16-action="choose"][data-id="CF-02"]').click();
 await expect(panel.locator('[data-v16-field="assessment_type"]')).toBeVisible();
 await panel.locator('[data-v16-field="assessment_type"]').selectOption('ulang');
 await panel.locator('[data-v16-action="save"]').click();
 await expect(panel.locator('#v16-feedback')).toContainText('Draft simulasi tersimpan');
 await openV13RoleForm(page,'akun.perawat','m1','RME-05');
 const risks=page.locator('#benchmark-v16');
 await risks.locator('summary').click();
 await risks.locator('[data-v16-action="choose"][data-id="CF-06"]').click();
 await expect(risks.locator('.v16-gated')).toContainText('Belum diaktifkan');
 await expect(risks.locator('[data-v16-action="save"]')).toHaveCount(0);
 await openV13RoleForm(page,'akun.dpjp-rawat-inap','m0','RME-03');
 const inpatient=page.locator('#benchmark-v16');
 await inpatient.locator('summary').click();
 await inpatient.locator('[data-v16-action="choose"][data-id="CF-13"]').click();
 await expect(inpatient.locator('.v16-gated')).toContainText('Belum diaktifkan');
 await expect(inpatient.locator('[data-v16-field]')).toHaveCount(0);
 await expect(inpatient.locator('[data-v16-action="save"]')).toHaveCount(0);
 expect(errors).toEqual([]);
});

test('V17 reference-inspired role worklist cards and HR directory remain contextual',async ({page}) => {
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/index.html');
  await page.locator('[data-demo-account="akun.hr-admin"]').click();
  await page.locator('#demo-login-form button[type="submit"]').click();
  await expect(page.locator('.v17-staff-card')).toHaveCount(6);
  await expect(page.locator('.v17-job-card')).toHaveCount(4);
  await expect(page.locator('.v17-job-grid')).toBeHidden();
  await page.locator('[data-v17-view="grid"]').click();
  await expect(page.locator('.v17-job-grid')).toBeVisible();
  await page.locator('.v17-job-card').nth(1).click();
  await expect(page.locator('.v17-job-card').nth(1)).toHaveAttribute('aria-pressed','true');
  await page.locator('#uxv5-search').fill('tidak ada hasil yang cocok');
  await expect(page.locator('.v17-grid-empty')).toBeVisible();
  await page.locator('#uxv5-search').fill('');
  await expect(page.locator('.v17-grid-empty')).toBeHidden();
  await page.locator('[data-v17-view="table"]').click();
  await expect(page.locator('.uxv4-table-scroller')).toBeVisible();
  await page.setViewportSize({width:390,height:844});
  await expect(page.locator('#main-content .uxv4-head')).toBeVisible();
  expect(errors).toEqual([]);
});

test('V19 clinical workflow guidance respects selected patient work context',async ({page})=>{
 const errors=[],apiRequests=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(r.url().includes('/api/v1/'))apiRequests.push(r.url());});
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.dokter-rj"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await page.locator('#role-nav [data-demo-action="home"]').click();
 const guide=page.locator('[data-v18-screen="S03"]');
 await expect(guide).toBeVisible();
 await expect(guide).toContainText('Periksa dua identitas');
 await guide.locator('summary').click();
 await expect(guide.locator('.v18-flow-steps li')).toHaveCount(5);
 await expect(guide).toContainText('Urutan ini adalah panduan desain');
 await page.locator('.uxv4-table [data-demo-action="job:1"]').click();
 await expect(page.locator('.v18-workflow-overview')).toContainText('ENC-RJ02');
 await expect(page.locator('.uxv5-detail')).toContainText('ENC-RJ02');
 expect(errors).toEqual([]);expect(apiRequests).toEqual([]);
});

test('V20 operational workspace has read-only stage guidance and fits mobile viewport',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width:390,height:844});
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.farmasis"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 const guide=page.locator('[data-v18-screen="S08"]');
 await expect(guide).toBeVisible();
 await expect(guide).toContainText('tidak ada dispensing atau mutasi stok aktual');
 await guide.locator('summary').click();
 await expect(guide.locator('.v18-flow-steps li')).toHaveCount(5);
 const viewport=await page.evaluate(()=>({
  body:document.documentElement.scrollWidth,
  viewport:window.innerWidth,
  cards:document.querySelector('.v18-workflow').getBoundingClientRect().width
 }));
 expect(viewport.body).toBeLessThanOrEqual(viewport.viewport+2);
 expect(viewport.cards).toBeLessThanOrEqual(viewport.viewport);
 expect(errors).toEqual([]);
});

test('V21 reviewer retains original QA catalog without role-specific workflow strip',async ({page})=>{
 await page.goto('/index.html');
 await page.locator('[data-demo-account="reviewer.demo"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await expect(page.locator('.v18-workflow')).toHaveCount(0);
 await page.locator('[data-nav="forms"]').click();
 await expect(page.getByText('68/68 modul memiliki form demo')).toBeVisible();
 await expect(page.locator('.v18-workflow')).toHaveCount(0);
});


test('V23 doctor returns from scoped SOAP form to the same selected work item',async ({page})=>{
 const errors=[],apiCalls=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(r.url().includes('/api/v1/'))apiCalls.push(r.url());});
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.dokter-rj"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await expect(page.locator('.uxv5 h1')).toHaveText('Beranda Dokter RJ');
 await page.locator('#role-nav [data-demo-action="section:m1"]').click();
 await page.locator('.uxv4-table [data-demo-action="job:1"]').click();
 await expect(page.locator('.uxv5-detail')).toContainText('ENC-RJ02');
 await page.locator('.uxv5-detail [data-demo-action="module:RME-04"]').click();
 const bar=page.locator('.v23-returnbar');
 await expect(bar).toBeVisible();
 await expect(bar).toHaveAttribute('data-v23-role','Dokter RJ');
 await expect(bar).toHaveAttribute('data-v23-module','RME-04');
 await expect(bar).toHaveAttribute('data-v23-workitem','ENC-RJ02');
 await bar.locator('[data-v23-focus-form]').click();
 await expect(page.locator('#p0-editor')).toBeVisible();
 await bar.locator('[data-demo-action="backToWorklist"]').click();
 await expect(page.locator('.uxv5 h1')).toHaveText('Asesmen dan SOAP');
 await expect(page.locator('.uxv5-detail')).toContainText('ENC-RJ02');
 await expect(page.locator('.uxv4-table [data-demo-action="job:1"]')).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('.v23-returnbar')).toHaveCount(0);
 expect(errors).toEqual([]);expect(apiCalls).toEqual([]);
});

test('V24 pharmacy mobile preserves work item and reviewer sees no role-form return bar',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width:390,height:844});
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.farmasis"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await page.locator('#demo-mobile-nav-toggle').click();
 await page.locator('#role-nav [data-demo-action="section:m2"]').click();
 await page.locator('.uxv4-table [data-demo-action="job:1"]').click();
 await page.locator('.uxv5-detail [data-demo-action="module:MED-05"]').click();
 await expect(page.locator('.v23-returnbar')).toBeVisible();
 await expect(page.locator('.v23-returnbar')).toHaveAttribute('data-v23-module','MED-05');
 const width=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 expect(width).toBeLessThanOrEqual(2);
 await page.locator('.v23-returnbar [data-demo-action="backToWorklist"]').click();
 await expect(page.locator('.uxv5 h1')).toHaveText('Penyiapan obat');
 await expect(page.locator('.uxv4-table [data-demo-action="job:1"]')).toHaveAttribute('aria-pressed','true');
 await page.locator('#demo-logout').click();
 await page.locator('[data-demo-account="reviewer.demo"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await page.locator('[data-nav="forms"]').click();
 await expect(page.locator('.v23-returnbar')).toHaveCount(0);
 expect(errors).toEqual([]);
});


test('V25 registration prioritizes worklist above module shortcuts and supports keyboard search',async ({page})=>{
 const errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(r.url().includes('/api/v1/'))requests.push(r.url());});
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.pendaftaran"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 const root=page.locator('.uxv5.v25-core[data-v25-screen="S02"]');
 await expect(root).toBeVisible();
 await expect(root.locator('.v25-hero')).toContainText('Meja pendaftaran');
 await expect(root.locator('.v25-current-id')).toHaveText('REG-D001');
 await expect(root.locator('.v25-active-context')).toHaveAttribute('aria-live','polite');
 const positions=await root.evaluate(el=>{
  const top=selector=>el.querySelector(selector).getBoundingClientRect().top;
  return {hero:top('.v25-hero'),worklist:top('[data-v25-main-worklist]'),related:top('.v25-related-areas')};
 });
 expect(positions.hero).toBeLessThan(positions.worklist);
 expect(positions.worklist).toBeLessThan(positions.related);
 await root.locator('[data-v25-focus="worklist"]').click();
 await expect(root.locator('#uxv5-search')).toBeFocused();
 await root.locator('#uxv5-search').fill('REG-D002');
 await expect(root.locator('.uxv4-table tbody tr:not([data-v12-hidden])')).toHaveCount(1);
 await page.screenshot({path:out+'/v25-registration-desktop.png',fullPage:true});
 expect(errors).toEqual([]);expect(requests).toEqual([]);
});

test('V25 doctor shows scoped demo context and accessible workflow without approving care',async ({page})=>{
 const errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(r.url().includes('/api/v1/'))requests.push(r.url());});
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.dokter-rj"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await page.locator('#role-nav [data-demo-action="section:m1"]').click();
 const root=page.locator('.uxv5.v25-core[data-v25-screen="S03"]');
 await expect(root).toBeVisible();
 await root.locator('.uxv4-table [data-demo-action="job:1"]').click();
 await expect(root.locator('.v25-current-id')).toHaveText('ENC-RJ02');
 await expect(root.locator('.v25-active-context')).toHaveAttribute('data-v25-context','patient');
 await expect(root.locator('.v25-active-context .v25-context-age')).toBeVisible();
 await expect(root.locator('.v25-active-context .v25-context-payer')).toBeVisible();
 await root.locator('[data-v25-focus="guidance"]').click();
 await expect(root.locator('.v25-hero .v18-workflow-details')).toHaveAttribute('open','');
 await expect(root.locator('.v25-hero')).toContainText('Baca alergi');
 await expect(root.locator('.v25-hero .v18-flow-steps li')).toHaveCount(5);
 await page.screenshot({path:out+'/v25-doctor-workspace.png',fullPage:true});
 expect(errors).toEqual([]);expect(requests).toEqual([]);
});

test('V26 nursing worklist at 390px remains readable and does not overflow screen',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width:390,height:844});
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.perawat"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 const root=page.locator('.uxv5.v25-core[data-v25-screen="S04"]');
 await expect(root).toBeVisible();
 await expect(root.locator('.v25-hero')).toContainText('Ruang keperawatan');
 await expect(root.locator('.v25-related-areas')).toBeVisible();
 const dimensions=await page.evaluate(()=>({
  viewport:innerWidth,htmlWidth:document.documentElement.scrollWidth,
  heroWidth:document.querySelector('.v25-hero').getBoundingClientRect().width
 }));
 expect(dimensions.htmlWidth).toBeLessThanOrEqual(dimensions.viewport+2);
 expect(dimensions.heroWidth).toBeLessThanOrEqual(dimensions.viewport);
 await root.locator('[data-v25-focus="worklist"]').click();
 await expect(root.locator('#uxv5-search')).toBeFocused();
 await page.screenshot({path:out+'/v26-nursing-mobile.png',fullPage:true});
 expect(errors).toEqual([]);
});

test('V26 emergency context emphasizes simulated triage and reviewer is isolated',async ({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/index.html');
 await page.locator('[data-demo-account="akun.dokter-igd"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 const root=page.locator('.uxv5.v25-core[data-v25-screen="S05"]');
 await expect(root).toBeVisible();
 await expect(root).toHaveAttribute('data-v25-role','emergency');
 await expect(root.locator('.v25-hero')).toContainText('Ruang pelayanan IGD');
 await expect(root.locator('.v25-extra-safety')).toContainText('tidak menentukan kegawatan');
 await page.locator('#role-nav [data-demo-action="section:m0"]').click();
 await expect(page.locator('.v25-core .v25-current-id')).toHaveText('IGD-D01');
 await page.screenshot({path:out+'/v26-emergency-workspace.png',fullPage:true});
 await page.locator('#demo-logout').click();
 await page.locator('[data-demo-account="reviewer.demo"]').click();
 await page.locator('#demo-login-form button[type="submit"]').click();
 await expect(page.locator('.v25-core')).toHaveCount(0);
 expect(errors).toEqual([]);
});

test('V16 shares the operational encounter in RJ, IGD and RI and isolates another patient task',async ({page})=>{
 const errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(r.url().includes('/api/'))requests.push(r.url());});
 for(const [account,section,module,form] of [
  ['akun.dokter-rj','m1','RME-04',null],
  ['akun.dokter-igd','m0','RME-02','CF-01'],
  ['akun.perawat','m2','RME-07','CF-02']
 ]){
  await openV13RoleForm(page,account,section,module);
  const selected=await page.evaluate(()=>window.SIMRSFormEngine.getWorkItemContext());
  const panel=page.locator('#benchmark-v16');
  await expect(page.locator('.p0-patient-banner')).toContainText(selected.patient.visit);
  await expect(panel.locator('.v16-h')).toContainText('encounter '+selected.patient.visit+' · pekerjaan '+selected.workItem.id);
  if(form){
   await panel.locator('summary').click();
   await panel.locator('[data-id="'+form+'"]').click();
   await panel.locator('[data-v16-action="save"]').click();
   const saved=await page.evaluate(form=>Object.values(JSON.parse(localStorage.getItem('simrs-benchmark-clinical-v16-drafts'))).find(r=>r.id===form),form);
   expect(saved.encounterId).toBe(selected.patient.visit);
   expect(saved.patientId).toBe(selected.patient.id);
   expect(saved.workItem).toBe(selected.workItem.id);
  }
 }
 await page.locator('[data-demo-action="section:m2"]').first().click();
 await page.locator('[data-uxv5-row="1"] [data-demo-action="job:1"]').click();
 await page.locator('.uxv5-detail [data-demo-action="module:RME-07"]').click();
 const panel=page.locator('#benchmark-v16');
 await panel.locator('summary').click();
 await panel.locator('[data-id="CF-02"]').click();
 await expect(panel.locator('.v16-state')).toContainText('Belum ada draft');
 await panel.locator('[data-v16-action="history"]').click();
 await expect(panel.locator('.v16-history')).toContainText('Belum ada catatan sintetis');
 await page.evaluate(()=>{window.SIMRSFormEngine.clearWorkItemContext();window.SIMRSBenchmarkV16.mount();});
 await expect(page.locator('#benchmark-v16')).toHaveCount(0);
 expect(errors).toEqual([]);expect(requests).toEqual([]);
});

test('V16 preserves saved assessment versions through reload and opens historical values read-only',async ({page})=>{
 await openV13RoleForm(page,'akun.perawat','m2','RME-07');
 const panel=page.locator('#benchmark-v16');
 await panel.locator('summary').click();
 await panel.locator('[data-id="CF-02"]').click();
 await panel.locator('[data-v16-field="assessment_type"]').selectOption('awal');
 await panel.locator('[data-v16-field="complaint"]').fill('Keluhan AWAL sintetis');
 await panel.locator('[data-v16-action="save"]').click();
 await panel.locator('[data-v16-field="assessment_type"]').selectOption('ulang');
 await panel.locator('[data-v16-field="complaint"]').fill('Evaluasi ULANG sintetis');
 await panel.locator('[data-v16-action="save"]').click();
 await panel.locator('[data-v16-action="save"]').click();
 await panel.locator('[data-v16-action="step"][data-step="1"]').click();
 await panel.locator('[data-v16-action="step"][data-step="2"]').click();
 await panel.locator('[data-v16-action="step"][data-step="0"]').click();
 await panel.locator('[data-v16-action="save"]').click();
 const saved=await page.evaluate(()=>Object.values(JSON.parse(localStorage.getItem('simrs-benchmark-clinical-v16-drafts'))).find(r=>r.id==='CF-02'));
 expect(saved.revisions).toHaveLength(2);
 expect(saved.revisions[0].values.assessment_type).toBe('awal');
 expect(saved.revisions[0].values.complaint).toBe('Keluhan AWAL sintetis');
 expect(saved.revisions[1].values.assessment_type).toBe('ulang');
 await panel.locator('[data-v16-field="complaint"]').fill('Perubahan yang belum disimpan');
 await panel.locator('[data-id="CF-03"]').click();
 await panel.locator('[data-v16-action="history"]').click();
 await expect(panel.locator('tbody tr')).toHaveCount(2);
 await expect(panel.locator('tbody')).not.toContainText('CF-03');
 expect(await page.evaluate(()=>Object.values(JSON.parse(localStorage.getItem('simrs-benchmark-clinical-v16-drafts'))).find(r=>r.id==='CF-02').values.complaint)).toBe('Evaluasi ULANG sintetis');
 await openV13RoleForm(page,'akun.perawat','m2','RME-07');
 await panel.locator('summary').click();
 await panel.locator('[data-id="CF-02"]').click();
 await expect(panel.locator('[data-v16-field="assessment_type"]')).toHaveValue('ulang');
 await panel.locator('[data-v16-action="history"]').click();
 await expect(panel.locator('tbody tr')).toHaveCount(2);
 await panel.locator('tr').filter({hasText:'CF-02 · awal'}).getByRole('button',{name:'Lihat versi 1'}).click();
 await panel.locator('.v16-version summary').first().click();
 await expect(panel.locator('.v16-version')).toContainText('Keluhan AWAL sintetis');
 await expect(panel.locator('.v16-version')).not.toContainText('Evaluasi ULANG sintetis');
 await expect(panel.locator('.v16-version input, .v16-version textarea, .v16-version select')).toHaveCount(0);
 await page.screenshot({path:out+'/v16-history-version.png',fullPage:true});
});

test('V16 blocks invalid numeric draft/review and reveals errors in hidden form steps on mobile',async ({page})=>{
 const requests=[];page.on('request',r=>{if(r.url().includes('/api/'))requests.push(r.url());});
 await page.setViewportSize({width:390,height:844});
 await openV13RoleForm(page,'akun.dokter-igd','m0','RME-02');
 const panel=page.locator('#benchmark-v16');
 await panel.locator('summary').click();
 await panel.locator('[data-id="CF-01"]').click();
 const groups=await page.evaluate(()=>window.SIMRSBenchmarkV16.defs.find(d=>d.id==='CF-01').groups);
 for(let index=0;index<groups.length;index++){
  await panel.locator('[data-v16-action="step"][data-step="'+index+'"]').click();
  for(const spec of groups[index][1]){
   const [key,,type,required]=spec.split('|');
   if(required==='1')await panel.locator('[data-v16-field="'+key+'"]').fill(type==='datetime-local'?'2026-11-10T10:00':'Data sintetis');
  }
  if(index===1)await panel.locator('[data-v16-field="pain_score"]').fill('99');
  if(index===2)await panel.locator('[data-v16-field="heart_rate"]').fill('-10');
 }
 await panel.locator('[data-v16-action="review"]').click();
 await expect(panel.locator('[data-v16-field="pain_score"]')).toBeVisible();
 await expect(panel.locator('[data-v16-field="pain_score"]')).toHaveAttribute('aria-invalid','true');
 await expect(panel.locator('#v16-feedback')).toContainText('Review belum dapat dilanjutkan');
 await panel.locator('[data-v16-action="save"]').click();
 await expect(panel.locator('#v16-feedback')).toContainText('Draft belum disimpan');
 expect(await page.evaluate(()=>localStorage.getItem('simrs-benchmark-clinical-v16-drafts'))).toBeNull();
 await page.screenshot({path:out+'/v16-invalid-numeric-mobile.png',fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await panel.locator('[data-v16-field="pain_score"]').fill('5');
 await panel.locator('[data-v16-action="save"]').click();
 await expect(panel.locator('[data-v16-field="heart_rate"]')).toBeVisible();
 await expect(panel.locator('[data-v16-field="heart_rate"]')).toHaveAttribute('aria-invalid','true');
 await panel.locator('[data-v16-field="heart_rate"]').fill('80');
 await panel.locator('[data-v16-action="review"]').click();
 await expect(panel.locator('#v16-feedback')).toContainText('format data lengkap');
 await panel.locator('[data-v16-action="save"]').click();
 await expect(panel.locator('#v16-feedback')).toContainText('Draft simulasi tersimpan');
 expect(requests).toEqual([]);
});

test('V16 does not reassign legacy notes to a new encounter or report storage failure as success',async ({page})=>{
 await page.addInitScript(()=>{
  if(localStorage.getItem('simrs-benchmark-clinical-v16-drafts'))return;
  localStorage.setItem('simrs-benchmark-clinical-v16-drafts',JSON.stringify({
   'Perawat|p1|ENC-DEMO-247|RI-N01|RME-07|CF-02':{id:'CF-02',role:'Perawat',module:'RME-07',patientId:'p1',encounterId:'ENC-DEMO-247',workItem:'RI-N01',status:'Draft (demo)',updatedAt:'2026-11-10T01:00:00Z',values:{assessment_type:'awal',complaint:'Catatan lama sintetis'}}
  }));
 });
 await openV13RoleForm(page,'akun.perawat','m2','RME-07');
 const panel=page.locator('#benchmark-v16');
 await panel.locator('summary').click();
 await panel.locator('[data-id="CF-02"]').click();
 await expect(panel.locator('[data-v16-field="complaint"]')).toHaveValue('');
 await panel.locator('[data-v16-field="complaint"]').fill('Catatan RI baru sintetis');
 await page.evaluate(()=>{
  window.__v16OriginalSetItem=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){if(key==='simrs-benchmark-clinical-v16-drafts')throw new DOMException('Full','QuotaExceededError');return window.__v16OriginalSetItem.call(this,key,value);};
 });
 await panel.locator('[data-v16-action="save"]').click();
 await expect(panel.locator('#v16-feedback')).toContainText('Penyimpanan browser gagal');
 await panel.locator('[data-v16-action="history"]').click();
 await expect(panel.locator('tbody tr')).toHaveCount(1);
 await expect(panel.locator('tbody')).toContainText('ENC-DEMO-247');
 await expect(panel.locator('tbody')).toContainText('konteks belum diverifikasi');
 await page.evaluate(()=>Storage.prototype.setItem=window.__v16OriginalSetItem);
 await panel.locator('[data-id="CF-02"]').click();
 await expect(panel.locator('[data-v16-field="complaint"]')).toHaveValue('Catatan RI baru sintetis');
 await panel.locator('[data-v16-action="save"]').click();
 await expect(panel.locator('#v16-feedback')).toContainText('ENC-RI-DEMO-01');
 await panel.locator('[data-v16-action="history"]').click();
 await expect(panel.locator('tbody tr')).toHaveCount(2);
 const records=await page.evaluate(()=>Object.values(JSON.parse(localStorage.getItem('simrs-benchmark-clinical-v16-drafts'))));
 expect(records.map(r=>r.encounterId).sort()).toEqual(['ENC-DEMO-247','ENC-RI-DEMO-01']);
});

test('V16 retains the original snapshot when revising a legacy note with the correct work context',async ({page})=>{
 await page.addInitScript(()=>{
  if(localStorage.getItem('simrs-benchmark-clinical-v16-drafts'))return;
  localStorage.setItem('simrs-benchmark-clinical-v16-drafts',JSON.stringify({
   'Perawat|p1|ENC-RI-DEMO-01|RI-N01|RME-07|CF-02':{id:'CF-02',role:'Perawat',module:'RME-07',patientId:'p1',encounterId:'ENC-RI-DEMO-01',workItem:'RI-N01',status:'Draft (demo)',updatedAt:'2026-11-10T01:00:00Z',values:{assessment_type:'awal',complaint:'Isi versi lama sintetis'}}
  }));
 });
 await openV13RoleForm(page,'akun.perawat','m2','RME-07');
 const panel=page.locator('#benchmark-v16');
 await panel.locator('summary').click();
 await panel.locator('[data-id="CF-02"]').click();
 await expect(panel.locator('[data-v16-field="complaint"]')).toHaveValue('Isi versi lama sintetis');
 await panel.locator('[data-v16-field="assessment_type"]').selectOption('ulang');
 await panel.locator('[data-v16-field="complaint"]').fill('Isi revisi baru sintetis');
 await panel.locator('[data-v16-action="save"]').click();
 const saved=await page.evaluate(()=>Object.values(JSON.parse(localStorage.getItem('simrs-benchmark-clinical-v16-drafts')))[0]);
 expect(saved.revisions).toHaveLength(2);
 expect(saved.revisions[0].legacy).toBe(true);
 expect(saved.revisions[0].values.complaint).toBe('Isi versi lama sintetis');
 expect(saved.revisions[1].values.complaint).toBe('Isi revisi baru sintetis');
 await panel.locator('[data-v16-action="history"]').click();
 await expect(panel.locator('tbody tr')).toHaveCount(2);
});

test('V16 preserves both revisions when two tabs save the same draft',async ({page,context})=>{
 const secondPage=await context.newPage();
 const tabs=[page,secondPage];
 await Promise.all(tabs.map(tab=>openV13RoleForm(tab,'akun.perawat','m2','RME-07')));
 const panels=tabs.map(tab=>tab.locator('#benchmark-v16'));
 const complaints=['Asesmen tab pertama','Asesmen tab kedua'];
 await Promise.all(panels.map(async (panel,index)=>{
  await panel.locator('.v16-details > summary').click();
  await panel.locator('[data-id="CF-02"]').click();
  await panel.locator('[data-v16-field="complaint"]').fill(complaints[index]);
 }));
 await Promise.all(panels.map(async panel=>{
  await panel.locator('[data-v16-action="save"]').click();
  await expect(panel.locator('#v16-feedback')).toContainText('Draft simulasi tersimpan');
 }));
 await panels[0].locator('[data-v16-action="history"]').click();
 await expect(panels[0].locator('tbody tr')).toHaveCount(2);
 const saved=await page.evaluate(()=>Object.values(JSON.parse(localStorage.getItem('simrs-benchmark-clinical-v16-drafts')))[0]);
 expect(saved.revisions.map(revision=>revision.version)).toEqual([1,2]);
 expect(saved.revisions.map(revision=>revision.values.complaint).sort()).toEqual(complaints);
});
