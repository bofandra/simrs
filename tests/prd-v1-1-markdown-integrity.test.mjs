import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('../docs/simrs-baru/', import.meta.url));
const src = fileURLToPath(new URL('../docs/simrs-baru/PRD_SIMRS_Baru_v1.1_Ekstensi_Form_Klinis_2026-11-10.md', import.meta.url));
const doc = readFileSync(src, 'utf8');

test('full PRD v1.1 is preserved as Markdown, including complete chapter 13', () => {
  assert.ok(statSync(src).size > 240_000, 'Full PRD must not be replaced by a short summary');
  const headings = doc.match(/^#{1,4}\s+.+/gm) || [];
  assert.ok(headings.length >= 200, 'All source headings should survive conversion');
  for (let c=1;c<=13;c++) assert.match(doc,new RegExp('^# '+c+'\\.', 'm'), 'Missing chapter '+c);
  for (let c=1;c<=13;c++) assert.ok(doc.includes('CF-'+String(c).padStart(2,'0')), 'Missing CF-'+c);
  assert.ok(doc.includes('CF-14'), 'Longitudinal clinical history must remain documented');
  for (const marker of ['FR-001','FR-066','US-RME-02','US-RME-07','UST-FR-047','UST-FR-066','USX-CLN-06','13.9 Open decisions']) {
    assert.ok(doc.includes(marker), 'Missing required PRD marker: '+marker);
  }
  assert.ok(doc.includes('211 tabel'),'Database dictionary must remain present');
  assert.ok(doc.includes('23 schema'),'Schema coverage must remain present');
  assert.ok(doc.includes('SOP'),'Release safeguards must remain present');
});
test('PRD Markdown preserves source tables and original architecture figure', () => {
  const tableSeparators=(doc.match(/^\|[-: |]+\|$/gm)||[]).length;
  assert.equal(tableSeparators,43,'Expected all 43 original DOCX tables');
  assert.equal((doc.match(/assets\/diagram-arsitektur-simrs-baru-v1\.1\.png/g)||[]).length,2,'Both source diagram placements remain');
  assert.ok(existsSync(dir+'assets/diagram-arsitektur-simrs-baru-v1.1.png'),'Missing original diagram asset');
  assert.ok(!doc.includes('/mnt/data/'),'No runtime paths in published Markdown');
});
test('developer-facing entry points link the full PRD and guidance', () => {
  const root=readFileSync(new URL('../README.md',import.meta.url),'utf8');
  const index=readFileSync(new URL('../docs/simrs-baru/README.md',import.meta.url),'utf8');
  const agent=readFileSync(new URL('../AGENTS.md',import.meta.url),'utf8');
  const guide=readFileSync(new URL('../docs/simrs-baru/PANDUAN_PENGEMBANGAN_MOCKUP_BERDASARKAN_PRD.md',import.meta.url),'utf8');
  const filename='PRD_SIMRS_Baru_v1.1_Ekstensi_Form_Klinis_2026-11-10.md';
  for (const text of [root,index,agent,guide]) assert.ok(text.includes(filename),'Guide not linked');
  for (const text of [agent,guide]) {
    assert.ok(text.includes('worklist') || text.includes('daftar pekerjaan'));
    assert.ok(text.includes('CF-14'));
    assert.ok(text.includes('SOP'));
  }
});
