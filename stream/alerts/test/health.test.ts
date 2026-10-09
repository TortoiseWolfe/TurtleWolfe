import { describe, expect, it } from 'vitest';
import { handleHealth } from '../src/health';
import { NOW, fakeFetch, fakeKV, makeDeps } from './helpers';

const iso = (ms: number) => new Date(ms).toISOString();
const run = (init: Record<string, string>) => handleHealth(makeDeps(fakeFetch(), fakeKV(init)));

describe('health', () => {
  it('fresh cron: 200 with lastCron', async () => {
    const res = await run({ 'cron:last': iso(NOW - 29 * 60_000) });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, lastCron: iso(NOW - 29 * 60_000) });
  });
  it('stale cron: 503 with lastCron', async () => {
    const res = await run({ 'cron:last': iso(NOW - 31 * 60_000) });
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, lastCron: iso(NOW - 31 * 60_000) });
  });
  it('missing cron: 503 with null', async () => {
    const res = await run({});
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, lastCron: null });
  });
  it('unparseable cron value counts as stale', async () => {
    expect((await run({ 'cron:last': 'garbage' })).status).toBe(503);
  });
  it('sends JSON content type', async () => {
    expect((await run({})).headers.get('content-type')).toMatch(/application\/json/);
  });
});
