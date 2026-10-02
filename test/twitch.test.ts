import { describe, expect, it } from 'vitest';
import { createTwitch } from '../src/twitch';
import { ENV, TOKEN_URL, fakeFetch, fakeKV, json, makeDeps, tokenReply } from './helpers';

const USERS = 'https://api.twitch.tv/helix/users?login=turtlewolfe';

describe('twitch token', () => {
  it('fetches an app token with the right form and caches it for expires_in-300', async () => {
    const f = fakeFetch({
      [`POST ${TOKEN_URL}`]: tokenReply('tok1', 3600),
      [`GET ${USERS}`]: json({ data: [{ id: '42' }] }),
    });
    const kv = fakeKV();
    const t = createTwitch(makeDeps(f, kv), ENV);
    await t.helix('/users', { login: 'turtlewolfe' });
    const tokenCall = f.calls[0]!;
    expect(tokenCall.method).toBe('POST');
    expect(tokenCall.url).toBe(TOKEN_URL);
    expect(Object.fromEntries(new URLSearchParams(tokenCall.body))).toEqual({
      client_id: 'cid',
      client_secret: 'csecret',
      grant_type: 'client_credentials',
    });
    expect(kv.puts).toEqual([{ key: 'token:app', value: 'tok1', ttl: 3300 }]);
    expect(f.calls[1]!.headers['client-id']).toBe('cid');
    expect(f.calls[1]!.headers['authorization']).toBe('Bearer tok1');
  });

  it('reuses the cached token across calls (one token request)', async () => {
    const f = fakeFetch({
      [`POST ${TOKEN_URL}`]: tokenReply('tok1'),
      [`GET ${USERS}`]: json({ data: [{ id: '42' }] }),
      'GET https://api.twitch.tv/helix/streams?user_id=42': json({ data: [] }),
    });
    const t = createTwitch(makeDeps(f), ENV);
    await t.userId('turtlewolfe');
    await t.isLive('42');
    expect(f.calls.filter((c) => c.url === TOKEN_URL)).toHaveLength(1);
  });

  it('a 401 clears the token, refreshes and retries once', async () => {
    const f = fakeFetch({
      [`POST ${TOKEN_URL}`]: [tokenReply('old'), tokenReply('new')],
      [`GET ${USERS}`]: [new Response('', { status: 401 }), json({ data: [{ id: '42' }] })],
    });
    const kv = fakeKV();
    const t = createTwitch(makeDeps(f, kv), ENV);
    const res = await t.helix('/users', { login: 'turtlewolfe' });
    expect(res.status).toBe(200);
    expect(f.calls.map((c) => c.method + ' ' + c.url)).toEqual([
      `POST ${TOKEN_URL}`,
      `GET ${USERS}`,
      `POST ${TOKEN_URL}`,
      `GET ${USERS}`,
    ]);
    expect(f.calls[3]!.headers['authorization']).toBe('Bearer new');
    expect(kv.deletes).toContain('token:app');
  });

  it('does not retry a second time on a repeated 401', async () => {
    const f = fakeFetch({
      [`POST ${TOKEN_URL}`]: tokenReply(),
      [`GET ${USERS}`]: new Response('', { status: 401 }),
    });
    const res = await createTwitch(makeDeps(f), ENV).helix('/users', { login: 'turtlewolfe' });
    expect(res.status).toBe(401);
    expect(f.calls.filter((c) => c.url === USERS)).toHaveLength(2);
  });
});

describe('twitch helpers', () => {
  it('userId caches in KV for 7 days and serves from cache', async () => {
    const f = fakeFetch({
      [`POST ${TOKEN_URL}`]: tokenReply(),
      [`GET ${USERS}`]: json({ data: [{ id: '42' }] }),
    });
    const kv = fakeKV();
    const t = createTwitch(makeDeps(f, kv), ENV);
    expect(await t.userId('turtlewolfe')).toBe('42');
    expect(kv.puts).toContainEqual({ key: 'uid:turtlewolfe', value: '42', ttl: 7 * 86400 });
    const before = f.calls.length;
    expect(await t.userId('turtlewolfe')).toBe('42');
    expect(f.calls.length).toBe(before);
  });

  it('userId throws when the login is unknown', async () => {
    const f = fakeFetch({ [`POST ${TOKEN_URL}`]: tokenReply(), [`GET ${USERS}`]: json({ data: [] }) });
    await expect(createTwitch(makeDeps(f), ENV).userId('turtlewolfe')).rejects.toThrow(/turtlewolfe/);
  });

  it('isLive reflects data length', async () => {
    const f = fakeFetch({
      [`POST ${TOKEN_URL}`]: tokenReply(),
      'GET https://api.twitch.tv/helix/streams?user_id=1': json({ data: [{ id: 's' }] }),
      'GET https://api.twitch.tv/helix/streams?user_id=2': json({ data: [] }),
    });
    const t = createTwitch(makeDeps(f), ENV);
    expect(await t.isLive('1')).toBe(true);
    expect(await t.isLive('2')).toBe(false);
  });

  it('subscription helpers send the exact requests', async () => {
    const f = fakeFetch({
      [`POST ${TOKEN_URL}`]: tokenReply(),
      'GET https://api.twitch.tv/helix/eventsub/subscriptions?type=stream.online': json({ data: [{ id: 'a' }] }),
      'POST https://api.twitch.tv/helix/eventsub/subscriptions': json({ data: [{ id: 'n' }] }, 202),
      'DELETE https://api.twitch.tv/helix/eventsub/subscriptions?id=a': new Response(null, { status: 204 }),
    });
    const t = createTwitch(makeDeps(f), ENV);
    expect(await t.listSubscriptions()).toEqual([{ id: 'a' }]);
    await t.createSubscription('42', 'https://worker.test/eventsub');
    await t.deleteSubscription('a');
    const post = f.calls.find((c) => c.method === 'POST' && c.url.endsWith('/subscriptions'))!;
    expect(JSON.parse(post.body!)).toEqual({
      type: 'stream.online',
      version: '1',
      condition: { broadcaster_user_id: '42' },
      transport: { method: 'webhook', callback: 'https://worker.test/eventsub', secret: 'eventsub-secret-123' },
    });
    expect(f.calls.at(-1)!.method).toBe('DELETE');
  });

  it('createSubscription throws on a non-2xx without leaking the secret', async () => {
    const f = fakeFetch({
      [`POST ${TOKEN_URL}`]: tokenReply(),
      'POST https://api.twitch.tv/helix/eventsub/subscriptions': new Response('no', { status: 400 }),
    });
    const err = await createTwitch(makeDeps(f), ENV)
      .createSubscription('42', 'https://worker.test/eventsub')
      .catch((e: Error) => e);
    expect((err as Error).message).toMatch(/400/);
    expect((err as Error).message).not.toContain('eventsub-secret-123');
  });
});
