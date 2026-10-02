import { describe, expect, it } from 'vitest';
import worker, { handleRequest, runScheduled } from '../src/index';
import { ENV, NOW, OPS_URL, TOKEN_URL, fakeFetch, fakeKV, json, makeDeps, tokenReply } from './helpers';

const H = 'https://api.twitch.tv/helix';
const BROADCASTERS = JSON.stringify([
  { login: 'turtlewolfe', announce: true, mention: 'none', watchdog: 'none' },
  { login: 'scripthammer', announce: false, mention: 'none', watchdog: 'always_on' },
]);
const env = { ...ENV, BROADCASTERS };
const opsMsgs = (f: ReturnType<typeof fakeFetch>) =>
  f.calls.filter((c) => c.url === OPS_URL).map((c) => JSON.parse(c.body!).content as string);

describe('routing', () => {
  const deps = () => makeDeps(fakeFetch(), fakeKV());
  it('unknown path is 404', async () => {
    expect((await handleRequest(new Request('https://w.test/nope'), deps(), env)).status).toBe(404);
  });
  it('GET /eventsub is 404', async () => {
    expect((await handleRequest(new Request('https://w.test/eventsub'), deps(), env)).status).toBe(404);
  });
  it('POST /health is 404', async () => {
    expect((await handleRequest(new Request('https://w.test/health', { method: 'POST' }), deps(), env)).status).toBe(404);
  });
  it('GET /health reaches the health handler', async () => {
    expect((await handleRequest(new Request('https://w.test/health'), deps(), env)).status).toBe(503);
  });
  it('POST /eventsub reaches the receiver (unsigned = 403)', async () => {
    const r = new Request('https://w.test/eventsub', { method: 'POST', body: '{}' });
    expect((await handleRequest(r, deps(), env)).status).toBe(403);
  });
  it('default export wires env.STATE for /health', async () => {
    const kv = fakeKV({ 'cron:last': new Date().toISOString() });
    const res = await worker.fetch(new Request('https://w.test/health'), { ...env, STATE: kv }, {
      waitUntil() {},
      passThroughException() {},
    } as unknown as ExecutionContext);
    expect(res.status).toBe(200);
  });
});

describe('runScheduled', () => {
  function happy() {
    return fakeFetch({
      [`POST ${TOKEN_URL}`]: tokenReply(),
      [`GET ${H}/eventsub/subscriptions?type=stream.online`]: json({
        data: [{ id: 'a', status: 'enabled', condition: { broadcaster_user_id: '42' }, transport: { callback: 'https://worker.test/eventsub' } }],
      }),
      [`GET ${H}/streams?user_id=42`]: json({ data: [{ id: 's' }] }),
      [`POST ${OPS_URL}`]: new Response(null, { status: 204 }),
    });
  }
  const seed = { 'uid:turtlewolfe': '42', 'uid:scripthammer': '42' };

  it('records cron:last as an ISO timestamp and posts nothing when all is well', async () => {
    const f = happy();
    const kv = fakeKV(seed);
    await runScheduled(makeDeps(f, kv), env);
    expect(kv.store.get('cron:last')).toBe(new Date(NOW).toISOString());
    expect(opsMsgs(f)).toHaveLength(0);
  });

  it('a failing step still records cron:last, still runs the other step, and posts one summary', async () => {
    const f = fakeFetch({
      [`POST ${TOKEN_URL}`]: tokenReply(),
      [`GET ${H}/eventsub/subscriptions?type=stream.online`]: new Response('', { status: 500 }),
      [`GET ${H}/streams?user_id=42`]: json({ data: [{ id: 's' }] }),
      [`POST ${OPS_URL}`]: new Response(null, { status: 204 }),
    });
    const kv = fakeKV(seed);
    await runScheduled(makeDeps(f, kv), env);
    expect(kv.store.get('cron:last')).toBe(new Date(NOW).toISOString());
    expect(f.calls.some((c) => c.url === `${H}/streams?user_id=42`)).toBe(true);
    const msgs = opsMsgs(f);
    expect(msgs).toHaveLength(1);
    expect(msgs[0]).toMatch(/^\[afa-stream-alerts\] scheduled run: reconcile failed/);
    expect(msgs[0]).not.toContain('csecret');
  });

  it('a config error is not swallowed', async () => {
    await expect(runScheduled(makeDeps(fakeFetch(), fakeKV()), { ...env, BROADCASTERS: '[{"login":""}]' })).rejects.toThrow(/login/);
  });
});
