import { describe, expect, it } from 'vitest';
import type { Broadcaster } from '../src/config';
import { runWatchdogs } from '../src/watchdog';
import { ENV, NOW, OPS_URL, TOKEN_URL, fakeFetch, fakeKV, json, makeDeps, tokenReply } from './helpers';

const H = 'https://api.twitch.tv/helix';
const iso = (ms: number) => new Date(ms).toISOString();
const min = (n: number) => n * 60_000;
const SCHED_URL = `${H}/schedule?broadcaster_id=42&start_time=${encodeURIComponent(iso(NOW - min(30)))}&first=10`;
const STREAMS = `${H}/streams?user_id=42`;

const sched: Broadcaster = { login: 'turtlewolfe', announce: true, mention: 'none', watchdog: 'schedule' };
const always: Broadcaster = { login: 'scripthammer', announce: false, mention: 'none', watchdog: 'always_on' };

const seg = (over: Record<string, unknown> = {}) => ({
  id: 'seg1', start_time: iso(NOW - min(10)), end_time: iso(NOW + min(50)),
  title: 'Drupal night', canceled_until: null, ...over,
});

function setup(
  b: Broadcaster,
  routes: Record<string, Response | Response[]>,
  kvInit: Record<string, string> = {},
) {
  const f = fakeFetch({
    [`POST ${TOKEN_URL}`]: tokenReply(),
    [`POST ${OPS_URL}`]: new Response(null, { status: 204 }),
    ...routes,
  });
  const kv = fakeKV({ [`uid:${b.login}`]: '42', ...kvInit });
  return { f, kv, deps: makeDeps(f, kv) };
}
const ops = (f: ReturnType<typeof fakeFetch>) =>
  f.calls.filter((c) => c.url === OPS_URL).map((c) => JSON.parse(c.body!).content as string);
const live = json({ data: [{ id: 's' }] });
const offline = json({ data: [] });
const schedule = (segments: unknown[], vacation: unknown = null) =>
  json({ data: { segments, vacation, broadcaster_id: '42' } });

describe('watchdog: schedule', () => {
  it('a due segment that is not live alerts once; a second run does not', async () => {
    const { f, kv, deps } = setup(sched, { [`GET ${SCHED_URL}`]: schedule([seg()]), [`GET ${STREAMS}`]: offline });
    await runWatchdogs(deps, ENV, [sched]);
    await runWatchdogs(deps, ENV, [sched]);
    expect(ops(f)).toEqual([
      `[afa-stream-alerts] turtlewolfe: scheduled 'Drupal night' at ${iso(NOW - min(10))} hasn't started`,
    ]);
    expect(kv.puts).toContainEqual({
      key: `alert:sched:seg1:${iso(NOW - min(10))}`, value: '1', ttl: 2 * 86400,
    });
  });

  it('live: no alert', async () => {
    const { f, deps } = setup(sched, { [`GET ${SCHED_URL}`]: schedule([seg()]), [`GET ${STREAMS}`]: live });
    await runWatchdogs(deps, ENV, [sched]);
    expect(ops(f)).toHaveLength(0);
  });

  it('canceled segment: no alert', async () => {
    const { f, deps } = setup(sched, {
      [`GET ${SCHED_URL}`]: schedule([seg({ canceled_until: iso(NOW + min(60)) })]),
      [`GET ${STREAMS}`]: offline,
    });
    await runWatchdogs(deps, ENV, [sched]);
    expect(ops(f)).toHaveLength(0);
  });

  // Window is inclusive at both ends: 5 <= age <= 20 minutes.
  it.each([
    ['exactly 5 min ago', NOW - min(5)],
    ['exactly 20 min ago', NOW - min(20)],
  ])('segment %s (boundary, inclusive): alerts', async (_n, start) => {
    const { f, deps } = setup(sched, {
      [`GET ${SCHED_URL}`]: schedule([seg({ start_time: iso(start) })]),
      [`GET ${STREAMS}`]: offline,
    });
    await runWatchdogs(deps, ENV, [sched]);
    expect(ops(f)).toHaveLength(1);
  });

  it.each([
    ['future', NOW + min(30)],
    ['too recent (4 min ago)', NOW - min(4)],
    ['too old (21 min ago)', NOW - min(21)],
    ['too old (25 min ago)', NOW - min(25)],
  ])('segment %s: no alert', async (_n, start) => {
    const { f, deps } = setup(sched, {
      [`GET ${SCHED_URL}`]: schedule([seg({ start_time: iso(start) })]),
      [`GET ${STREAMS}`]: offline,
    });
    await runWatchdogs(deps, ENV, [sched]);
    expect(ops(f)).toHaveLength(0);
  });

  it('404 means no schedule: no alert, no error', async () => {
    const { f, deps } = setup(sched, { [`GET ${SCHED_URL}`]: new Response('', { status: 404 }) });
    await runWatchdogs(deps, ENV, [sched]);
    expect(ops(f)).toHaveLength(0);
  });

  it('inside a vacation: skipped', async () => {
    const { f, deps } = setup(sched, {
      [`GET ${SCHED_URL}`]: schedule([seg()], { start_time: iso(NOW - 86400_000), end_time: iso(NOW + 86400_000) }),
      [`GET ${STREAMS}`]: offline,
    });
    await runWatchdogs(deps, ENV, [sched]);
    expect(ops(f)).toHaveLength(0);
  });

  it('a vacation that already ended does not suppress alerts', async () => {
    const { f, deps } = setup(sched, {
      [`GET ${SCHED_URL}`]: schedule([seg()], { start_time: iso(NOW - 9 * 86400_000), end_time: iso(NOW - 2 * 86400_000) }),
      [`GET ${STREAMS}`]: offline,
    });
    await runWatchdogs(deps, ENV, [sched]);
    expect(ops(f)).toHaveLength(1);
  });
});

describe('watchdog: always_on', () => {
  it('offline with no record: records since, no alert yet', async () => {
    const { f, kv, deps } = setup(always, { [`GET ${STREAMS}`]: offline });
    await runWatchdogs(deps, ENV, [always]);
    expect(JSON.parse(kv.store.get('offline:scripthammer')!)).toMatchObject({ since: NOW });
    expect(ops(f)).toHaveLength(0);
  });

  it('grace is honoured: 10 min offline does not alert', async () => {
    const { f, deps } = setup(always, { [`GET ${STREAMS}`]: offline }, {
      'offline:scripthammer': JSON.stringify({ since: NOW - min(10) }),
    });
    await runWatchdogs(deps, ENV, [always]);
    expect(ops(f)).toHaveLength(0);
  });

  it('past grace alerts exactly once', async () => {
    const { f, kv, deps } = setup(always, { [`GET ${STREAMS}`]: offline }, {
      'offline:scripthammer': JSON.stringify({ since: NOW - min(16) }),
    });
    await runWatchdogs(deps, ENV, [always]);
    await runWatchdogs(deps, ENV, [always]);
    expect(ops(f)).toEqual(['[afa-stream-alerts] scripthammer has been offline for 16 min']);
    expect(JSON.parse(kv.store.get('offline:scripthammer')!).alerted).toBe(true);
  });

  it('honours ALWAYS_ON_GRACE_MIN', async () => {
    const { f, deps } = setup(always, { [`GET ${STREAMS}`]: offline }, {
      'offline:scripthammer': JSON.stringify({ since: NOW - min(16) }),
    });
    await runWatchdogs(deps, { ...ENV, ALWAYS_ON_GRACE_MIN: '30' }, [always]);
    expect(ops(f)).toHaveLength(0);
  });

  it('back live after an alert: says so and clears the key', async () => {
    const { f, kv, deps } = setup(always, { [`GET ${STREAMS}`]: live }, {
      'offline:scripthammer': JSON.stringify({ since: NOW - min(40), alerted: true }),
    });
    await runWatchdogs(deps, ENV, [always]);
    expect(ops(f)).toEqual(['[afa-stream-alerts] scripthammer is back live']);
    expect(kv.store.has('offline:scripthammer')).toBe(false);
  });

  it('back live before any alert: clears the key silently', async () => {
    const { f, kv, deps } = setup(always, { [`GET ${STREAMS}`]: live }, {
      'offline:scripthammer': JSON.stringify({ since: NOW - min(5) }),
    });
    await runWatchdogs(deps, ENV, [always]);
    expect(ops(f)).toHaveLength(0);
    expect(kv.store.has('offline:scripthammer')).toBe(false);
  });

  it('live with no record: nothing happens', async () => {
    const { f, kv, deps } = setup(always, { [`GET ${STREAMS}`]: live });
    await runWatchdogs(deps, ENV, [always]);
    expect(ops(f)).toHaveLength(0);
    expect(kv.puts.filter((p) => p.key.startsWith('offline:'))).toHaveLength(0);
  });
});

describe('watchdog: isolation', () => {
  it('one broadcaster failing does not stop the next, and the error is rethrown', async () => {
    const { f, deps } = setup(always, {
      [`GET ${SCHED_URL}`]: new Response('', { status: 500 }),
      [`GET ${STREAMS}`]: offline,
    }, { 'uid:turtlewolfe': '42', 'offline:scripthammer': JSON.stringify({ since: NOW - min(20) }) });
    await expect(runWatchdogs(deps, ENV, [sched, always])).rejects.toThrow(/turtlewolfe/);
    expect(ops(f)).toEqual(['[afa-stream-alerts] scripthammer has been offline for 20 min']);
  });

  it('watchdog "none" makes no calls', async () => {
    const { f, deps } = setup(sched, {});
    await runWatchdogs(deps, ENV, [{ ...sched, watchdog: 'none' }]);
    expect(f.calls).toHaveLength(0);
  });
});
