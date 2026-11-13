import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const base=new URL('../public/ui-preview/',import.meta.url);
const catalog=JSON.parse(readFileSync(new URL('api-contract-operations.json',base),'utf8'));
const html=readFileSync(new URL('index.html',base),'utf8');
const adapter=readFileSync(new URL('api-contract-demo.js',base),'utf8');
test('PRD v3.0: FE manifest covers all 106 operation IDs and 22 module/portal tags',()=>{
 assert.equal(catalog.operations.length,106);
 assert.equal(new Set(catalog.operations.map(x=>x.operationId)).size,106);
 assert.equal(new Set(catalog.operations.map(x=>x.module)).size,22);
 assert(catalog.operations.every(x=>/^\/api\/v1\//.test(x.path)));
});
test('Published FE includes isolated synthetic API adapter after role login',()=>{
 assert(html.includes('<script src="./api-contract-demo.js"></script>'));
 assert(html.lastIndexOf('api-contract-demo.js')>html.lastIndexOf('role-demo-login.js'));
 assert(adapter.includes('SIMRSApiContract'));
 assert(adapter.includes('X-SIMRS-Mock'));
 assert(adapter.includes('idempotencyKey'));
 assert(adapter.includes('SIMRSApiContract'));
 assert(adapter.includes('simulated:true'));
 assert(adapter.includes('SIMRSRoleDemo'));
});
