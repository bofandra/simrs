import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (name) => readFileSync(new URL('../public/ui-preview/' + name, import.meta.url), 'utf8');

test('V8 visual layer is loaded after the existing V6 mobile styles', () => {
  const home = read('index.html');
  assert.ok(home.includes('href="./visual-blueprint-v8.css"'));
  assert.ok(home.indexOf('role-operational-mobile-v6.css') < home.indexOf('visual-blueprint-v8.css'));
  assert.ok(home.includes('id="design-gallery-link"'));
  assert.ok(home.includes('href="./design-gallery.html"'));
  assert.ok(home.includes('id="demo-login"'));
  assert.ok(home.includes('role-demo-login.js'));
});

test('Gallery contains 13 role-first reference pages with safe demo-only actions', () => {
  const page = read('design-gallery.html');
  const ids = ['login','front','doctor','nurse','igd','beds','lab','pharmacy','finance','management','admin','radiology','mcu'];
  ids.forEach((id) => assert.ok(page.includes('id:"' + id + '"'), 'Missing design screen: ' + id));
  assert.equal((page.match(/\{id:"(?:login|front|doctor|nurse|igd|beds|lab|pharmacy|finance|management|admin|radiology|mcu)"/g) || []).length, 13);
  assert.ok(page.includes('Simpan draft simulasi'));
  assert.ok(page.includes('Tidak ada data pasien/keuangan yang disimpan'));
  assert.ok(page.includes('Tidak ada pilihan role atau profesi'));
  assert.ok(page.includes('Semua data dan aksi di halaman ini adalah simulasi'));
});

test('V8 design tokens and mobile layout remain present', () => {
  const css = read('visual-blueprint-v8.css');
  assert.ok(css.includes('--navy:#122a47'));
  assert.ok(css.includes('--teal:#078d88'));
  assert.ok(css.includes('@media(max-width:560px)'));
  assert.ok(css.includes('body.demo-authenticated #design-gallery-link{display:none}'));
});
