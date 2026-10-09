import { describe, expect, it } from 'vitest';
import { buildAnnouncement, handleStreamOnline } from '../src/announce';
import type { Broadcaster } from '../src/config';
import {
  ANNOUNCE_URL, ENV, NOW, OPS_URL, TOKEN_URL, fakeFetch, fakeKV, json, makeDeps, tokenReply,
} from './helpers';

const CHANNELS = 'https://api.twitch.tv/helix/channels?broadcaster_id=42';
const bc = (over: Partial<Broadcaster> = {}): Broadcaster => ({
  login: 'turtlewolfe', announce: true, mention: 'none', watchdog: 'none', ...over,
});
const ev = (over: Record<string, string> = {}) => ({
  broadcaster_user_id: '42',
  broadcaster_user_login: 'turtlewolfe',
  broadcaster_user_name: 'TurtleWolfe',
  type: 'live',
  ...over,
});

function routes(title: unknown = 'Building a Worker') {
  return {
    [`POST ${TOKEN_URL}`]: tokenReply(),
    [`GET ${CHANNELS}`]: title === null ? new Response('', { status: 500 }) : json({ data: [{ title }] }),
    [`POST ${ANNOUNCE_URL}`]: new Response(null, { status: 204 }),
    [`POST ${OPS_URL}`]: new Response(null, { status: 204 }),
  };
}
const posts = (f: ReturnType<typeof fakeFetch>) => f.calls.filter((c) => c.url === ANNOUNCE_URL);

describe('buildAnnouncement', () => {
  it('live, no mention', () => {
    expect(buildAnnouncement(bc(), ev(), 'Hello')).toEqual({
      content: '**TurtleWolfe is live:** Hello\nhttps://twitch.tv/turtlewolfe',
      allowed_mentions: { parse: [] },
    });
  });
  it('live, everyone', () => {
    expect(buildAnnouncement(bc({ mention: 'everyone' }), ev(), 'Hello')).toEqual({
      content: '@everyone **TurtleWolfe is live:** Hello\nhttps://twitch.tv/turtlewolfe',
      allowed_mentions: { parse: ['everyone'] },
    });
  });
  it('live, role', () => {
    expect(buildAnnouncement(bc({ mention: 'role:999' }), ev(), 'Hello')).toEqual({
      content: '<@&999> **TurtleWolfe is live:** Hello\nhttps://twitch.tv/turtlewolfe',
      allowed_mentions: { roles: ['999'] },
    });
  });
  it.each(['everyone', 'role:999'])('rerun by title never mentions (%s)', (mention) => {
    expect(buildAnnouncement(bc({ mention }), ev(), '  [rerun] Old show')).toEqual({
      content: '**TurtleWolfe** rerun: [rerun] Old show\nhttps://twitch.tv/turtlewolfe',
      allowed_mentions: { parse: [] },
    });
  });
  it('rerun by event type never mentions', () => {
    expect(buildAnnouncement(bc({ mention: 'everyone' }), ev({ type: 'rerun' }), 'Plain title')).toEqual({
      content: '**TurtleWolfe** rerun: Plain title\nhttps://twitch.tv/turtlewolfe',
      allowed_mentions: { parse: [] },
    });
  });
});

describe('handleStreamOnline', () => {
  it('posts the exact payload to the announce webhook', async () => {
    const f = fakeFetch(routes());
    await handleStreamOnline(makeDeps(f), ENV, [bc({ mention: 'everyone' })], ev());
    expect(posts(f)).toHaveLength(1);
    expect(JSON.parse(posts(f)[0]!.body!)).toEqual({
      content: '@everyone **TurtleWolfe is live:** Building a Worker\nhttps://twitch.tv/turtlewolfe',
      allowed_mentions: { parse: ['everyone'] },
    });
  });

  it('matches the login case-insensitively', async () => {
    const f = fakeFetch(routes());
    await handleStreamOnline(makeDeps(f), ENV, [bc()], ev({ broadcaster_user_login: 'TURTLEWOLFE' }));
    expect(posts(f)).toHaveLength(1);
  });

  it('announce:false posts nothing', async () => {
    const f = fakeFetch(routes());
    await handleStreamOnline(makeDeps(f), ENV, [bc({ announce: false })], ev());
    expect(f.calls).toHaveLength(0);
  });

  it('unknown broadcaster posts nothing', async () => {
    const f = fakeFetch(routes());
    await handleStreamOnline(makeDeps(f), ENV, [bc({ login: 'someoneelse' })], ev());
    expect(f.calls).toHaveLength(0);
  });

  it('cooldown suppresses a second go-live within 30 min and sets a 30 min TTL', async () => {
    const f = fakeFetch(routes());
    const kv = fakeKV();
    const deps = makeDeps(f, kv);
    await handleStreamOnline(deps, ENV, [bc()], ev());
    await handleStreamOnline(deps, ENV, [bc()], ev());
    expect(posts(f)).toHaveLength(1);
    expect(kv.puts).toContainEqual({ key: 'announced:turtlewolfe', value: String(NOW), ttl: 1800 });
  });

  it('title fetch failure still posts "(title unavailable)"', async () => {
    const f = fakeFetch(routes(null));
    await handleStreamOnline(makeDeps(f), ENV, [bc()], ev());
    expect(JSON.parse(posts(f)[0]!.body!).content).toBe(
      '**TurtleWolfe is live:** (title unavailable)\nhttps://twitch.tv/turtlewolfe',
    );
  });
});
