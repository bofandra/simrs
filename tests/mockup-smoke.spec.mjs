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



test('login-first entry exposes 42 demo roles and opens Front Office for Pendaftaran',async ({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/index.html');
  await expect(page.locator('#demo-login-form')).toBeVisible();
  await expect(page.locator('#app')).toBeHidden();
  await expect(page.locator('[data-demo-account]')).toHaveCount(43);
  await expect(page.locator('[data-demo-quick], .demo-quick-head, .demo-quick-roles')).toHaveCount(0);
  await expect(page.locator('.demo-account-title')).toContainText('Pilih akun berdasarkan role');
  await page.locator('[data-demo-account="akun.pendaftaran"]').click();
  await expect(page.locator('#demo-username')).toHaveValue('akun.pendaftaran');
  await page.locator('#demo-login-form button[type="submit"]').click();
  await expect(page.locator('#ux-registration')).toBeVisible();
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
  await expect(page.locator('#main-content h1')).toHaveText('Petugas Laundry');
  await expect(page.locator('#role-nav [data-demo-action="module:OPS-04"]')).toBeVisible();
  await expect(page.locator('[data-nav="clinical"]')).toBeHidden();
  await page.locator('#role-nav [data-demo-action="module:OPS-04"]').click();
  await expect(page.locator('.p0-editor .card-h h2')).toContainText('Laundry');
  await expect(page.locator('.p0-catalog')).not.toContainText('Katalog 68 Modul');
  await expect(page.locator('#p0-catalog-list [data-code="RME-08"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('Nurse role login shows nursing tabs, not doctor prescribing worklist',async ({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/index.html');
  await page.locator('[data-demo-account="akun.perawat"]').click();
  await page.locator('#demo-login-form button[type="submit"]').click();
  await expect(page.locator('#main-content h1')).toHaveText('Workspace Keperawatan');
  await expect(page.getByRole('tab',{name:'CPPT Keperawatan'})).toBeVisible();
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
