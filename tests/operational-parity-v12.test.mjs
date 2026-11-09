import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const read = (name) => readFileSync(new URL('../public/ui-preview/' + name, import.meta.url), 'utf8');

test('V12 assets load in primary Pages after worklists and before demo login', () => {
  const html = read('index.html');
  const css = 'href="./operational-parity-v12.css"';
  const js = 'src="./operational-parity-v12.js"';
  assert.ok(html.includes(css));
  assert.ok(html.includes(js));
  assert.ok(html.indexOf('role-worklists-v11.js') < html.indexOf(js));
  assert.ok(html.indexOf(js) < html.indexOf('role-demo-login.js'));
  assert.ok(html.indexOf('visual-blueprint-v8.css') < html.indexOf(css));
});

test('V12 style has desktop/mobile parity and does not remove role auth safeguards', () => {
  const css = read('operational-parity-v12.css');
  const js = read('operational-parity-v12.js');
  assert.match(css, /\.v12-context\s*\{/);
  assert.match(css, /\.v12-filterbar\s*\{/);
  assert.match(css, /\.p0-operational/);
  assert.match(css, /@media \(max-width: 560px\)/);
  assert.match(css, /body\.demo-authenticated:not\(\.demo-reviewer\)/);
  assert.ok(!js.includes('fetch('));
  assert.ok(!js.includes('localStorage'));
  assert.ok(!js.includes('allowModule ='));
});

test('V12 enhancer adds patient context, numerical summary and status filter without touching other roles', () => {
  const calls = {};
  const originalMarkup =
    '<div class="uxv4 uxv5" data-uxv4-role="Pendaftaran" data-uxv4-section="home">' +
    '<header class="uxv4-head"><h1>Beranda Pendaftaran</h1></header>' +
    '<section class="uxv5-summary" aria-label="Ringkasan pekerjaan"><div><span>Daftar kerja</span>' +
    '<strong>Check-in dan kunjungan</strong><small>Loket</small></div></section>' +
    '<section class="uxv4-panel"><div class="uxv5-layout"><input id="uxv5-search" type="search" />' +
    '<table><tr class="uxv5-selected" data-uxv5-row="0"><td>REG-D001</td></tr>' +
    '<tr class="" data-uxv5-row="1"><td>REG-D002</td></tr></table>' +
    '<p id="uxv5-empty" class="uxv5-empty" hidden>Empty</p></div></section></div>';
  const jobs=[
    {id:'REG-D001',title:'Pasien A',scope:'Poli Dalam',kind:'patient',status:'Perlu ditinjau',reason:'Verifikasi',queue:'Check-in dan kunjungan'},
    {id:'REG-D002',title:'Pasien B',scope:'Poli Anak',kind:'patient',status:'Menunggu',reason:'Menunggu',queue:'Check-in dan kunjungan'}
  ];
  const window = {
    SIMRSRoleUXV5:{
      renderPage:() => originalMarkup,
      jobRows:() => jobs,
      selectionContext:() => ({patient:{name:'Pasien Demo A',mrn:'RM-DEMO-01',visit:'ENC-DEMO-01'}})
    },
    __SIMRS_PREVIEW__:{patients:[]}
  };
  const document = {addEventListener:(name,fn)=>{calls[name]=fn;}};
  runInNewContext(read('operational-parity-v12.js'),{window,document});
  const result=window.SIMRSRoleUXV5.renderPage({
    role:'Pendaftaran',section:'home',username:'akun.pendaftaran',selectedJob:0
  });
  assert.match(result,/class="uxv4 uxv5 v12-parity"/);
  assert.match(result,/Konteks pekerjaan yang dipilih/);
  assert.match(result,/RM-DEMO-01/);
  assert.match(result,/ENC-DEMO-01/);
  assert.match(result,/Pekerjaan aktif<\/span><strong>2<\/strong>/);
  assert.match(result,/data-v12-filter="Menunggu"/);
  assert.match(result,/data-v12-status="Perlu ditinjau"/);
  assert.match(result,/data-v12-status="Menunggu"/);
  assert.equal(typeof calls.click,'function');
  assert.equal(typeof calls.input,'function');
  assert.ok(window.SIMRSOperationalParityV12.roles.includes('Dokter RJ'));
  assert.ok(window.SIMRSOperationalParityV12.roles.includes('Radiolog'));
  assert.ok(window.SIMRSOperationalParityV12.roles.includes('Petugas MCU'));
  const untouched=window.SIMRSRoleUXV5.renderPage({role:'Ahli Gizi',section:'home',username:'akun.ahli-gizi'});
  assert.equal(untouched,originalMarkup);
});

test('V12 filtering respects both status and free-text and never mutates source jobs', () => {
  const sample={id:'REG-D002',title:'Pasien Demo B',scope:'Poli Anak',status:'Menunggu',reason:'Cek unit',progress:{label:'Draft tersimpan'}};
  const window={SIMRSRoleUXV5:{
    renderPage:()=>'',jobRows:()=>[sample],selectionContext:()=>null
  }};
  runInNewContext(read('operational-parity-v12.js'),
    {window,document:{addEventListener:()=>{}}});
  const match=window.SIMRSOperationalParityV12.matches;
  assert.equal(match(sample,'Semua','poli'),true);
  assert.equal(match(sample,'Menunggu','REG-D002'),true);
  assert.equal(match(sample,'Menunggu','draft tersimpan'),true);
  assert.equal(match(sample,'Dalam proses','REG-D002'),false);
  assert.equal(match(sample,'Menunggu','tidak-ada'),false);
  assert.equal(sample.status,'Menunggu');
});
