import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const out = 'test-results/snapshots';
mkdirSync(out,{recursive:true});
const start = async (page) => {
  await page.goto('/index.html');
  await expect(page.locator('#main-content')).not.toBeEmpty();
};
const forms = async (page) => {
  await page.locator('[data-nav="forms"]').click();
  await expect(page.getByText('Katalog Form & Workflow SIMRS')).toBeVisible();
};
const selectModule = async (page, code) => {
  await page.locator('#p0-priority').selectOption('all');
  await page.locator('#p0-search').fill(code);
  await page.locator('[data-p0-action="choose"][data-code="'+code+'"]').click();
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
  await expect(page.locator('[data-p0-action="choose"][data-code]')).toHaveCount(30);
  await page.locator('#p0-priority').selectOption('all');
  await expect(page.locator('[data-p0-action="choose"][data-code]')).toHaveCount(68);
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
  await expect(page.locator('.p0-contract')).toContainText('Belum ada daftar charge_ids');
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
