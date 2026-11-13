import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const site = new URL('../public/ui-preview/',import.meta.url);
const spec = JSON.parse(readFileSync(new URL('api-docs/openapi.json',site),'utf8'));
const doc = readFileSync(new URL('api-docs/index.html',site),'utf8');
const app = readFileSync(new URL('api-contract-demo.js',site),'utf8');
test('API explorer source and FE manifest match 106 PRD v3.0 operations',()=>{
 const count=Object.values(spec.paths).reduce((n,verbs)=>n+Object.keys(verbs).filter(x=>['get','post','put','patch','delete'].includes(x)).length,0);
 assert.equal(count,106);
 assert.equal(spec.openapi,'3.1.0');
 assert(doc.includes('const locationSpec="./openapi.json";'));
 assert(app.includes('href="./api-docs/"'));
});
