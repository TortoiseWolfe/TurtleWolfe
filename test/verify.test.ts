import { describe, expect, it } from 'vitest';
import { verifyEventSub } from '../src/verify';
import { NOW, sign } from './helpers';

const SECRET = 'eventsub-secret-123';
const BODY = '{"hello":"world"}';
const ID = 'abc-123';
const TS = new Date(NOW).toISOString();

function hdrs(over: Record<string, string | null> = {}): Headers {
  const base: Record<string, string> = {
    'Twitch-Eventsub-Message-Id': ID,
    'Twitch-Eventsub-Message-Timestamp': TS,
    'Twitch-Eventsub-Message-Signature': sign(SECRET, ID, TS, BODY),
    'Twitch-Eventsub-Message-Type': 'notification',
  };
  const h = new Headers();
  for (const [k, v] of Object.entries({ ...base, ...over })) if (v !== null) h.set(k, v);
  return h;
}

function resigned(ts: string): Headers {
  return hdrs({
    'Twitch-Eventsub-Message-Timestamp': ts,
    'Twitch-Eventsub-Message-Signature': sign(SECRET, ID, ts, BODY),
  });
}

describe('verifyEventSub', () => {
  it('accepts a valid signature', async () => {
    expect(await verifyEventSub(SECRET, hdrs(), BODY, NOW)).toBe(true);
  });
  it('rejects a tampered body', async () => {
    expect(await verifyEventSub(SECRET, hdrs(), BODY + ' ', NOW)).toBe(false);
  });
  it('rejects the wrong secret', async () => {
    expect(await verifyEventSub('other-secret-xyz', hdrs(), BODY, NOW)).toBe(false);
  });
  it('rejects a timestamp 11 minutes old, even if correctly signed', async () => {
    expect(await verifyEventSub(SECRET, resigned(new Date(NOW - 11 * 60_000).toISOString()), BODY, NOW)).toBe(false);
  });
  it('rejects a timestamp 11 minutes in the future', async () => {
    expect(await verifyEventSub(SECRET, resigned(new Date(NOW + 11 * 60_000).toISOString()), BODY, NOW)).toBe(false);
  });
  it('accepts a timestamp 9 minutes old', async () => {
    expect(await verifyEventSub(SECRET, resigned(new Date(NOW - 9 * 60_000).toISOString()), BODY, NOW)).toBe(true);
  });
  it.each([
    'Twitch-Eventsub-Message-Id',
    'Twitch-Eventsub-Message-Timestamp',
    'Twitch-Eventsub-Message-Signature',
    'Twitch-Eventsub-Message-Type',
  ])('rejects when %s is missing', async (name) => {
    expect(await verifyEventSub(SECRET, hdrs({ [name]: null }), BODY, NOW)).toBe(false);
  });
  it('rejects a malformed signature prefix', async () => {
    const good = sign(SECRET, ID, TS, BODY).slice('sha256='.length);
    expect(await verifyEventSub(SECRET, hdrs({ 'Twitch-Eventsub-Message-Signature': 'sha1=' + good }), BODY, NOW)).toBe(false);
    expect(await verifyEventSub(SECRET, hdrs({ 'Twitch-Eventsub-Message-Signature': good }), BODY, NOW)).toBe(false);
  });
  it('accepts Twitch\'s real nanosecond timestamp format', async () => {
    const ts = '2026-10-03T21:59:12.634234626Z';
    expect(await verifyEventSub(SECRET, resigned(ts), BODY, NOW)).toBe(true);
  });
});
