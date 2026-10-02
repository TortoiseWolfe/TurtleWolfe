import { describe, expect, it } from 'vitest';
import type { Broadcaster } from '../src/config';
import { handleEventSub } from '../src/eventsub';
import {
  ANNOUNCE_URL, ENV, OPS_URL, TOKEN_URL, fakeFetch, fakeKV, json, makeDeps, signedHeaders, sign, tokenReply,
} from './helpers';

const SECRET = ENV.EVENTSUB_SECRET;
const BCS: Broadcaster[] = [{ login: 'turtlewolfe', announce: true, mention: 'none', watchdog: 'none' }];

function req(type: string, body: unknown, over: { id?: string; headers?: Record<string, string> } = {}) {
  const raw = typeof body === 'string' ? body : JSON.stringify(body);
  return new Request('https://worker.test/eventsub', {
    method: 'POST',
    body: raw,
    headers: { ...signedHeaders(SECRET, type, raw, { id: over.id }), ...over.headers },
  });
}

const routes = () => ({
  [`POST ${TOKEN_URL}`]: tokenReply(),
  'GET https://api.twitch.tv/helix/channels?broadcaster_id=42': json({ data: [{ title: 'T' }] }),
  [`POST ${ANNOUNCE_URL}`]: new Response(null, { status: 204 }),
  [`POST ${OPS_URL}`]: new Response(null, { status: 204 }),
});

const online = {
  subscription: { type: 'stream.online', status: 'enabled' },
  event: {
    broadcaster_user_id: '42', broadcaster_user_login: 'turtlewolfe',
    broadcaster_user_name: 'TurtleWolfe', type: 'live',
  },
};

describe('handleEventSub', () => {
  it('returns the exact challenge text as text/plain', async () => {
    const f = fakeFetch();
    const res = await handleEventSub(req('webhook_callback_verification', { challenge: 'pogchamp-kappa-360' }), makeDeps(f), ENV, BCS);
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('pogchamp-kappa-360');
    expect(res.headers.get('content-type')).toMatch(/^text\/plain/);
  });

  it('403 on a bad signature, before touching KV or the network', async () => {
    const f = fakeFetch();
    const kv = fakeKV();
    const bad = req('notification', online, { headers: { 'Twitch-Eventsub-Message-Signature': sign('wrong-secret-abc', 'msg-1', 'x', '') } });
    const res = await handleEventSub(bad, makeDeps(f, kv), ENV, BCS);
    expect(res.status).toBe(403);
    expect(kv.puts).toHaveLength(0);
    expect(f.calls).toHaveLength(0);
  });

  it('403 on a missing header', async () => {
    const r = new Request('https://worker.test/eventsub', { method: 'POST', body: '{}' });
    expect((await handleEventSub(r, makeDeps(fakeFetch()), ENV, BCS)).status).toBe(403);
  });

  it('403 on a stale timestamp', async () => {
    const raw = JSON.stringify(online);
    const ts = new Date(Date.parse('2026-10-03T22:00:00Z') - 11 * 60_000).toISOString();
    const r = new Request('https://worker.test/eventsub', {
      method: 'POST', body: raw, headers: signedHeaders(SECRET, 'notification', raw, { ts }),
    });
    expect((await handleEventSub(r, makeDeps(fakeFetch()), ENV, BCS)).status).toBe(403);
  });

  it('dedupe alone: the same revocation id twice gives one ops post and one msg: write', async () => {
    const f = fakeFetch(routes());
    const kv = fakeKV();
    const deps = makeDeps(f, kv);
    const body = { subscription: { type: 'stream.online', status: 'user_removed', condition: { broadcaster_user_id: '42' } } };
    const first = await handleEventSub(req('revocation', body, { id: 'dup-r' }), deps, ENV, BCS);
    const second = await handleEventSub(req('revocation', body, { id: 'dup-r' }), deps, ENV, BCS);
    expect([first.status, second.status]).toEqual([204, 204]);
    expect(f.calls.filter((c) => c.url === OPS_URL)).toHaveLength(1);
    expect(kv.puts.filter((p) => p.key === 'msg:dup-r')).toEqual([{ key: 'msg:dup-r', value: '1', ttl: 86400 }]);
  });

  it('a duplicate stream.online id posts once even with the cooldown cleared between calls', async () => {
    const f = fakeFetch(routes());
    const kv = fakeKV();
    const deps = makeDeps(f, kv);
    await handleEventSub(req('notification', online, { id: 'dup-1' }), deps, ENV, BCS);
    await kv.delete('announced:turtlewolfe');
    const second = await handleEventSub(req('notification', online, { id: 'dup-1' }), deps, ENV, BCS);
    expect(second.status).toBe(204);
    expect(f.calls.filter((c) => c.url === ANNOUNCE_URL)).toHaveLength(1);
  });

  it('a retried verification with the same id still gets the challenge back', async () => {
    const f = fakeFetch();
    const deps = makeDeps(f);
    const r1 = await handleEventSub(req('webhook_callback_verification', { challenge: 'abc' }, { id: 'v-1' }), deps, ENV, BCS);
    const r2 = await handleEventSub(req('webhook_callback_verification', { challenge: 'abc' }, { id: 'v-1' }), deps, ENV, BCS);
    expect([r1.status, r2.status]).toEqual([200, 200]);
    expect([await r1.text(), await r2.text()]).toEqual(['abc', 'abc']);
  });

  it('a revocation posts exactly one ops alert naming type, broadcaster and status', async () => {
    const f = fakeFetch(routes());
    const body = {
      subscription: { type: 'stream.online', status: 'authorization_revoked', condition: { broadcaster_user_id: '42' } },
    };
    const res = await handleEventSub(req('revocation', body), makeDeps(f), ENV, BCS);
    expect(res.status).toBe(204);
    expect(f.calls).toHaveLength(1);
    expect(f.calls[0]!.url).toBe(OPS_URL);
    expect(JSON.parse(f.calls[0]!.body!).content).toBe(
      '[afa-stream-alerts] subscription revoked: stream.online for broadcaster 42 (status authorization_revoked)',
    );
  });

  it('a stream.online notification announces and returns 204', async () => {
    const f = fakeFetch(routes());
    const res = await handleEventSub(req('notification', online), makeDeps(f), ENV, BCS);
    expect(res.status).toBe(204);
    expect(f.calls.filter((c) => c.url === ANNOUNCE_URL)).toHaveLength(1);
  });

  it('uses waitUntil for the Discord work when provided', async () => {
    const f = fakeFetch(routes());
    const pending: Promise<unknown>[] = [];
    const deps = { ...makeDeps(f), waitUntil: (p: Promise<unknown>) => void pending.push(p) };
    const res = await handleEventSub(req('notification', online), deps, ENV, BCS);
    expect(res.status).toBe(204);
    expect(pending).toHaveLength(1);
    await Promise.all(pending);
    expect(f.calls.filter((c) => c.url === ANNOUNCE_URL)).toHaveLength(1);
  });

  it('an unknown type returns 204 and does nothing', async () => {
    const f = fakeFetch();
    const res = await handleEventSub(req('something_new', {}), makeDeps(f), ENV, BCS);
    expect(res.status).toBe(204);
    expect(f.calls).toHaveLength(0);
  });

  it('a notification of another subscription type is ignored', async () => {
    const f = fakeFetch();
    const res = await handleEventSub(req('notification', { subscription: { type: 'channel.update' }, event: {} }), makeDeps(f), ENV, BCS);
    expect(res.status).toBe(204);
    expect(f.calls).toHaveLength(0);
  });
});
