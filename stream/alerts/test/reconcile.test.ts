import { describe, expect, it } from 'vitest';
import type { Broadcaster } from '../src/config';
import { reconcile } from '../src/reconcile';
import { ENV, NOW, OPS_URL, TOKEN_URL, fakeFetch, fakeKV, json, makeDeps, tokenReply } from './helpers';

const SUBS = 'https://api.twitch.tv/helix/eventsub/subscriptions';
const LIST = `${SUBS}?type=stream.online`;
const CALLBACK = 'https://worker.test/eventsub';
const BCS: Broadcaster[] = [
  { login: 'turtlewolfe', announce: true, mention: 'none', watchdog: 'none' },
  { login: 'scripthammer', announce: false, mention: 'none', watchdog: 'none' },
];
const sub = (id: string, status: string, over: Record<string, unknown> = {}) => ({
  id, status, type: 'stream.online',
  condition: { broadcaster_user_id: '42' },
  transport: { method: 'webhook', callback: CALLBACK },
  ...over,
});

function setup(subs: unknown[], kvInit: Record<string, string> = {}) {
  const f = fakeFetch({
    [`POST ${TOKEN_URL}`]: tokenReply(),
    [`GET ${LIST}`]: json({ data: subs }),
    [`POST ${SUBS}`]: json({ data: [{ id: 'new' }] }, 202),
    [`DELETE ${SUBS}?id=bad1`]: new Response(null, { status: 204 }),
    [`DELETE ${SUBS}?id=bad2`]: new Response(null, { status: 204 }),
    [`POST ${OPS_URL}`]: new Response(null, { status: 204 }),
  });
  const kv = fakeKV({ 'uid:turtlewolfe': '42', ...kvInit });
  return { f, kv, deps: makeDeps(f, kv) };
}
const writes = (f: ReturnType<typeof fakeFetch>) =>
  f.calls.filter((c) => c.url.startsWith(SUBS) && c.method !== 'GET');
const opsMsgs = (f: ReturnType<typeof fakeFetch>) =>
  f.calls.filter((c) => c.url === OPS_URL).map((c) => JSON.parse(c.body!).content as string);

describe('reconcile', () => {
  it('enabled: no subscription writes and no ops post; records reconcile:last', async () => {
    const { f, kv, deps } = setup([sub('ok', 'enabled')]);
    await reconcile(deps, ENV, BCS);
    expect(writes(f)).toHaveLength(0);
    expect(opsMsgs(f)).toHaveLength(0);
    expect(kv.store.get('reconcile:last')).toBe(String(NOW));
  });

  it('failed: DELETE then POST, plus an ops post naming the old status', async () => {
    const { f, deps } = setup([sub('bad1', 'notification_failures_exceeded')]);
    await reconcile(deps, ENV, BCS);
    expect(writes(f).map((c) => `${c.method} ${c.url}`)).toEqual([`DELETE ${SUBS}?id=bad1`, `POST ${SUBS}`]);
    expect(JSON.parse(writes(f)[1]!.body!).condition).toEqual({ broadcaster_user_id: '42' });
    expect(opsMsgs(f)).toEqual([
      '[afa-stream-alerts] repaired stream.online subscription for turtlewolfe (was notification_failures_exceeded)',
    ]);
  });

  it('enabled alongside a failed sub: no writes at all and no ops post', async () => {
    const { f, deps } = setup([sub('ok', 'enabled'), sub('bad1', 'notification_failures_exceeded')]);
    await reconcile(deps, ENV, BCS);
    expect(writes(f)).toHaveLength(0);
    expect(opsMsgs(f)).toHaveLength(0);
  });

  it('failed with several broken subs deletes them all', async () => {
    const { f, deps } = setup([sub('bad1', 'authorization_revoked'), sub('bad2', 'webhook_callback_verification_failed')]);
    await reconcile(deps, ENV, BCS);
    expect(writes(f).map((c) => c.method)).toEqual(['DELETE', 'DELETE', 'POST']);
    expect(opsMsgs(f)).toHaveLength(1);
  });

  it('none: POST and an ops post', async () => {
    const { f, deps } = setup([]);
    await reconcile(deps, ENV, BCS);
    expect(writes(f).map((c) => `${c.method} ${c.url}`)).toEqual([`POST ${SUBS}`]);
    expect(opsMsgs(f)).toEqual(['[afa-stream-alerts] created stream.online subscription for turtlewolfe']);
  });

  it('pending only: leave it alone', async () => {
    const { f, deps } = setup([sub('p', 'webhook_callback_verification_pending')]);
    await reconcile(deps, ENV, BCS);
    expect(writes(f)).toHaveLength(0);
    expect(opsMsgs(f)).toHaveLength(0);
  });

  it('a sub with another callback is untouched (and ours is still created)', async () => {
    const other = sub('bad1', 'notification_failures_exceeded', {
      transport: { method: 'webhook', callback: 'https://elsewhere.test/eventsub' },
    });
    const { f, deps } = setup([other]);
    await reconcile(deps, ENV, BCS);
    expect(writes(f).map((c) => `${c.method} ${c.url}`)).toEqual([`POST ${SUBS}`]);
  });

  it('a sub for another broadcaster is not ours to judge', async () => {
    const { f, deps } = setup([sub('x', 'enabled', { condition: { broadcaster_user_id: '99' } })]);
    await reconcile(deps, ENV, BCS);
    expect(writes(f).map((c) => c.method)).toEqual(['POST']);
  });

  it('skipped entirely when reconcile:last is under 24 h old', async () => {
    const { f, deps } = setup([], { 'reconcile:last': String(NOW - 23 * 3600_000) });
    await reconcile(deps, ENV, BCS);
    expect(f.calls).toHaveLength(0);
  });

  it('runs when reconcile:last is over 24 h old', async () => {
    const { f, deps } = setup([sub('ok', 'enabled')], { 'reconcile:last': String(NOW - 25 * 3600_000) });
    await reconcile(deps, ENV, BCS);
    expect(f.calls.some((c) => c.url === LIST)).toBe(true);
  });

  it('only announce:true broadcasters get a subscription', async () => {
    const { f, deps } = setup([sub('ok', 'enabled')]);
    await reconcile(deps, ENV, BCS);
    expect(f.calls.some((c) => c.url.includes('scripthammer'))).toBe(false);
  });

  it('does not record reconcile:last when a step fails, and rethrows', async () => {
    const f = fakeFetch({
      [`POST ${TOKEN_URL}`]: tokenReply(),
      [`GET ${LIST}`]: new Response('', { status: 500 }),
    });
    const kv = fakeKV({ 'uid:turtlewolfe': '42' });
    await expect(reconcile(makeDeps(f, kv), ENV, BCS)).rejects.toThrow(/500/);
    expect(kv.store.has('reconcile:last')).toBe(false);
  });
});
