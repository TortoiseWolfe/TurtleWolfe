import { describe, expect, it } from 'vitest';
import { postAnnounce, postDiscord, postOps } from '../src/discord';
import { ANNOUNCE_URL, ENV, OPS_URL, fakeFetch, json, makeDeps } from './helpers';

const payload = { content: 'hi', allowed_mentions: { parse: [] } };

describe('postDiscord', () => {
  it('posts JSON and treats 2xx as success', async () => {
    const f = fakeFetch({ [`POST ${ANNOUNCE_URL}`]: new Response(null, { status: 204 }) });
    const r = await postDiscord(makeDeps(f), ANNOUNCE_URL, payload);
    expect(r).toEqual({ ok: true, status: 204, gone: false });
    expect(f.calls).toHaveLength(1);
    expect(f.calls[0]!.method).toBe('POST');
    expect(f.calls[0]!.headers['content-type']).toBe('application/json');
    expect(JSON.parse(f.calls[0]!.body!)).toEqual(payload);
  });

  it('429 then 200 makes two calls and waits retry_after seconds', async () => {
    const f = fakeFetch({
      [`POST ${ANNOUNCE_URL}`]: [json({ retry_after: 2 }, 429), new Response(null, { status: 204 })],
    });
    const deps = makeDeps(f);
    const r = await postDiscord(deps, ANNOUNCE_URL, payload);
    expect(f.calls).toHaveLength(2);
    expect(deps.sleeps).toEqual([2000]);
    expect(r.ok).toBe(true);
  });

  it('caps the wait at 5 s and falls back to the Retry-After header', async () => {
    const f = fakeFetch({
      [`POST ${ANNOUNCE_URL}`]: [
        new Response('', { status: 429, headers: { 'Retry-After': '30' } }),
        new Response(null, { status: 204 }),
      ],
    });
    const deps = makeDeps(f);
    await postDiscord(deps, ANNOUNCE_URL, payload);
    expect(deps.sleeps).toEqual([5000]);
  });

  it('429 with no retry_after and no Retry-After header: one retry after the default 1 s wait', async () => {
    const f = fakeFetch({
      [`POST ${ANNOUNCE_URL}`]: [new Response('', { status: 429 }), new Response(null, { status: 204 })],
    });
    const deps = makeDeps(f);
    const r = await postDiscord(deps, ANNOUNCE_URL, payload);
    expect(deps.sleeps).toEqual([1000]);
    expect(f.calls).toHaveLength(2);
    expect(r.ok).toBe(true);
  });

  it('retries only once on repeated 429', async () => {
    const f = fakeFetch({ [`POST ${ANNOUNCE_URL}`]: json({ retry_after: 1 }, 429) });
    const r = await postDiscord(makeDeps(f), ANNOUNCE_URL, payload);
    expect(f.calls).toHaveLength(2);
    expect(r.ok).toBe(false);
  });

  it.each([404, 401])('%i means gone: no retry', async (status) => {
    const f = fakeFetch({ [`POST ${ANNOUNCE_URL}`]: new Response('', { status }) });
    const r = await postDiscord(makeDeps(f), ANNOUNCE_URL, payload);
    expect(f.calls).toHaveLength(1);
    expect(r).toEqual({ ok: false, status, gone: true });
  });

  it('never throws when fetch rejects', async () => {
    const deps = makeDeps(fakeFetch());
    const r = await postDiscord(deps, ANNOUNCE_URL, payload);
    expect(r.ok).toBe(false);
  });
});

describe('postOps', () => {
  it('prefixes the message and suppresses mentions', async () => {
    const f = fakeFetch({ [`POST ${OPS_URL}`]: new Response(null, { status: 204 }) });
    await postOps(makeDeps(f), ENV, 'something broke');
    expect(JSON.parse(f.calls[0]!.body!)).toEqual({
      content: '[afa-stream-alerts] something broke',
      allowed_mentions: { parse: [] },
    });
  });
});

describe('postAnnounce', () => {
  it('on 404 posts exactly one ops alert and does not retry', async () => {
    const f = fakeFetch({
      [`POST ${ANNOUNCE_URL}`]: new Response('', { status: 404 }),
      [`POST ${OPS_URL}`]: new Response(null, { status: 204 }),
    });
    await postAnnounce(makeDeps(f), ENV, payload);
    expect(f.calls.map((c) => `${c.method} ${c.url}`)).toEqual([`POST ${ANNOUNCE_URL}`, `POST ${OPS_URL}`]);
    expect(JSON.parse(f.calls[1]!.body!).content).toBe('[afa-stream-alerts] announce webhook returned 404');
  });

  it('does not alert on success', async () => {
    const f = fakeFetch({ [`POST ${ANNOUNCE_URL}`]: new Response(null, { status: 204 }) });
    await postAnnounce(makeDeps(f), ENV, payload);
    expect(f.calls).toHaveLength(1);
  });
});
