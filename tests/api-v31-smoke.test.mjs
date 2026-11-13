import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const dir=new URL('../public/ui-preview/',import.meta.url);
const manifest=JSON.parse(readFileSync(new URL('api-contract-operations.json',dir),'utf8'));
const schema=JSON.parse(readFileSync(new URL('api-docs/openapi.json',dir),'utf8'));
test('FE operations have matching canonical HTTP method and path in OpenAPI v3.1',()=>{
 for(const o of manifest.operations){const api=schema.paths[o.path]?.[o.method.toLowerCase()];assert(api,'API spec missing '+o.operationId);assert.equal(api.operationId,o.operationId);assert.equal(api['x-permission'],o.permission)}
});
test('typed success examples reflect clinical lifecycle, rather than generic draft',()=>{
 for(const [p,m,expected] of [
 ['/api/v1/laboratory/reports/{id}/verify','post','verified'],
 ['/api/v1/pharmacy/prescriptions','post','ordered'],
 ['/api/v1/orders','post','placed']]){
  const operation=schema.paths[p][m];
  const status=Object.keys(operation.responses).find(k=>/^2\d\d$/.test(k));
  assert.equal(operation.responses[status].content['application/json'].example.status,expected);
 }
});
test('public viewer and adapter do not call production integrations',()=>{
 const js=readFileSync(new URL('api-contract-demo.js',dir),'utf8');
 assert(js.includes("mode:'synthetic-browser'"));
 assert(js.includes("'X-SIMRS-Mock':'true'"));
 assert(js.includes("fetch('./api-docs/openapi.json'"));
 assert(!js.includes('https://api-satusehat.kemkes.go.id'));
});
