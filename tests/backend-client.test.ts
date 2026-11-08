import { test } from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';
import { createApiClient, ApiError } from '../src/lib/backend/client.ts';
import { normalizeApiBaseUrl } from '../src/lib/backend/config.ts';
const response = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
test('API configuration accepts relative paths, HTTPS, and localhost only', () => {
  assert.equal(normalizeApiBaseUrl(' /api/v1/ '), '/api/v1');
  assert.equal(normalizeApiBaseUrl('https://api.example.com/api/v1/'), 'https://api.example.com/api/v1');
  assert.equal(normalizeApiBaseUrl('http://localhost:3001/api/v1'), 'http://localhost:3001/api/v1');
  for (const invalid of ['//evil.example/api', 'http://evil.example/api', 'https://user:pass@api.example/api', '/api/../admin', '/api?key=secret']) assert.throws(() => normalizeApiBaseUrl(invalid));
});
test('requests include cookies, JSON, CSRF, and idempotency without exposing tokens in URLs', async () => {
  let seenUrl = ''; let seen: RequestInit | undefined;
  const api = createApiClient({baseUrl:'/api/v1',getCsrfToken:()=> 'csrf-token',fetch:async (url, init)=> {seenUrl=String(url);seen=init;return response({data:{id:'project'}});}});
  assert.deepEqual(await api.request('/projects',{method:'POST',json:{name:'Nova'},idempotencyKey:'unique-operation',schema:z.object({id:z.string()})}),{id:'project'});
  assert.equal(seenUrl,'/api/v1/projects');assert.equal(seen?.credentials,'include');assert.equal(seen?.body,JSON.stringify({name:'Nova'}));
  const headers=new Headers(seen?.headers);assert.equal(headers.get('X-CSRF-Token'),'csrf-token');assert.equal(headers.get('Idempotency-Key'),'unique-operation');
});
test('server errors preserve status, code, and request ID', async () => {
  const api=createApiClient({baseUrl:'/api/v1',fetch:async()=>response({error:{code:'UNAUTHORIZED',message:'Sign in again.'},requestId:'r1'},401)});
  await assert.rejects(api.request('/projects'),(error: unknown)=>error instanceof ApiError && error.status===401 && error.code==='UNAUTHORIZED' && error.requestId==='r1');
});
test('malformed JSON, missing envelope, and invalid response schemas fail explicitly', async () => {
  for(const fetcher of [async()=>new Response('<html>error</html>'),async()=>response({items:[]}),async()=>response({data:{id:42}})]){
    const api=createApiClient({baseUrl:'/api/v1',fetch:fetcher});
    await assert.rejects(api.request('/projects',{schema:z.object({id:z.string()})}),(error: unknown)=>error instanceof ApiError && error.code==='INVALID_RESPONSE');
  }
});
test('204 responses do not require JSON bodies', async () => {
  const api=createApiClient({baseUrl:'/api/v1',fetch:async()=>new Response(null,{status:204})});
  assert.equal(await api.request('/projects/one',{method:'DELETE'}),undefined);
});
test('network failures are distinguished from server failures', async () => {
  const api=createApiClient({baseUrl:'/api/v1',fetch:async()=>{throw new TypeError('fetch failed');}});
  await assert.rejects(api.request('/health'),(error: unknown)=>error instanceof ApiError && error.code==='NETWORK_ERROR');
});
test('external cancellation is propagated and timeout is reported separately', async () => {
  const fetcher: typeof fetch=async(_url,init)=>new Promise((_resolve,reject)=>{
    const cancel=()=>reject(new DOMException('Aborted','AbortError'));
    if(init?.signal?.aborted) cancel();else init?.signal?.addEventListener('abort',cancel,{once:true});
  });
  const api=createApiClient({baseUrl:'/api/v1',fetch:fetcher,timeoutMs:10});
  await assert.rejects(api.request('/health'),(error: unknown)=>error instanceof ApiError && error.code==='TIMEOUT');
  const controller=new AbortController();controller.abort();
  await assert.rejects(api.request('/health',{signal:controller.signal}),(error: unknown)=>error instanceof DOMException && error.name==='AbortError');
});
test('endpoint paths cannot escape the API prefix', async () => {
  let calls=0;const api=createApiClient({baseUrl:'/api/v1',fetch:async()=>{calls++;return response({data:null});}});
  for(const path of ['https://evil.example','//evil.example','/../auth','/projects#hash','/%2e%2e/admin']) await assert.rejects(api.request(path));
  assert.equal(calls,0);
});
