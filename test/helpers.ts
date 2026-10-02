import { createHmac } from 'node:crypto';
import type { Deps, Env } from '../src/config';

export interface PutRecord {
  key: string;
  value: string;
  ttl?: number;
}

export function fakeKV(initial: Record<string, string> = {}) {
  const store = new Map<string, string>(Object.entries(initial));
  const puts: PutRecord[] = [];
  const deletes: string[] = [];
  return {
    store,
    puts,
    deletes,
    async get(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    async put(key: string, value: string, opts?: { expirationTtl?: number }) {
      store.set(key, value);
      puts.push({ key, value, ttl: opts?.expirationTtl });
    },
    async delete(key: string) {
      store.delete(key);
      deletes.push(key);
    },
  };
}
export type FakeKV = ReturnType<typeof fakeKV>;

export interface Call {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string | undefined;
}

type One = Response | ((call: Call) => Response);
export type Reply = One | One[];

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  });
}

/** Route table keyed "METHOD url". An array reply is consumed in order (last one repeats). */
export function fakeFetch(routes: Record<string, Reply> = {}) {
  const calls: Call[] = [];
  const counters = new Map<string, number>();
  const fn = async (url: string, init?: RequestInit): Promise<Response> => {
    const method = (init?.method ?? 'GET').toUpperCase();
    const headers: Record<string, string> = {};
    new Headers(init?.headers).forEach((v, k) => (headers[k] = v));
    const call: Call = { method, url, headers, body: init?.body as string | undefined };
    calls.push(call);
    const key = `${method} ${url}`;
    let reply = routes[key];
    if (reply === undefined) throw new Error(`fakeFetch: no route for ${key}`);
    if (Array.isArray(reply)) {
      const n = counters.get(key) ?? 0;
      counters.set(key, n + 1);
      reply = reply[Math.min(n, reply.length - 1)]!;
    }
    return typeof reply === 'function' ? reply(call) : reply.clone();
  };
  return { fn, calls, routes };
}
export type FakeFetch = ReturnType<typeof fakeFetch>;

export const NOW = Date.parse('2026-10-03T22:00:00Z');

export function makeDeps(
  f: FakeFetch,
  kv: FakeKV = fakeKV(),
  now: number = NOW,
): Deps & { sleeps: number[] } {
  const sleeps: number[] = [];
  return {
    fetch: f.fn,
    now: () => now,
    kv,
    sleep: async (ms: number) => {
      sleeps.push(ms);
    },
    sleeps,
  };
}

export const ANNOUNCE_URL = 'https://discord.test/webhook/announce';
export const OPS_URL = 'https://discord.test/webhook/ops';

export const ENV: Env = {
  TWITCH_CLIENT_ID: 'cid',
  TWITCH_CLIENT_SECRET: 'csecret',
  EVENTSUB_SECRET: 'eventsub-secret-123',
  DISCORD_ANNOUNCE_WEBHOOK: ANNOUNCE_URL,
  DISCORD_OPS_WEBHOOK: OPS_URL,
  PUBLIC_URL: 'https://worker.test',
  ALWAYS_ON_GRACE_MIN: '15',
  BROADCASTERS: '[]',
  STATE: undefined as never,
};

export function sign(secret: string, id: string, ts: string, body: string): string {
  return 'sha256=' + createHmac('sha256', secret).update(id + ts + body).digest('hex');
}

export function signedHeaders(
  secret: string,
  type: string,
  body: string,
  opts: { id?: string; ts?: string } = {},
): Record<string, string> {
  const id = opts.id ?? 'msg-1';
  const ts = opts.ts ?? new Date(NOW).toISOString();
  return {
    'Twitch-Eventsub-Message-Id': id,
    'Twitch-Eventsub-Message-Timestamp': ts,
    'Twitch-Eventsub-Message-Signature': sign(secret, id, ts, body),
    'Twitch-Eventsub-Message-Type': type,
  };
}

export const TOKEN_URL = 'https://id.twitch.tv/oauth2/token';
export function tokenReply(token = 'tok', expires = 3600): Response {
  return json({ access_token: token, expires_in: expires });
}
