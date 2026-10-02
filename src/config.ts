export interface KV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

export type FetchFn = (url: string, init?: RequestInit) => Promise<Response>;

/** Everything a module may touch from the outside world. Only src/index.ts wires real ones. */
export interface Deps {
  fetch: FetchFn;
  now: () => number;
  kv: KV;
  waitUntil?: (p: Promise<unknown>) => void;
  /** Injectable so tests need not really wait; defaults to setTimeout. */
  sleep?: (ms: number) => Promise<void>;
}

export interface Env {
  TWITCH_CLIENT_ID: string;
  TWITCH_CLIENT_SECRET: string;
  EVENTSUB_SECRET: string;
  DISCORD_ANNOUNCE_WEBHOOK: string;
  DISCORD_OPS_WEBHOOK: string;
  PUBLIC_URL: string;
  ALWAYS_ON_GRACE_MIN?: string;
  BROADCASTERS: string;
  STATE: KV;
}

export type Watchdog = 'none' | 'schedule' | 'always_on';

export interface Broadcaster {
  login: string;
  announce: boolean;
  mention: string;
  watchdog: Watchdog;
}

const WATCHDOGS: readonly string[] = ['none', 'schedule', 'always_on'];

export function parseBroadcasters(raw: string): Broadcaster[] {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error('BROADCASTERS is not valid JSON');
  }
  if (!Array.isArray(data)) throw new Error('BROADCASTERS must be a JSON array');
  return data.map((entry, i) => {
    const e = (entry ?? {}) as Record<string, unknown>;
    const where = `BROADCASTERS[${i}]`;
    if (typeof e.login !== 'string' || e.login.trim() === '') {
      throw new Error(`${where}.login must be a non-empty string`);
    }
    if (typeof e.announce !== 'boolean') throw new Error(`${where}.announce must be a boolean`);
    if (typeof e.mention !== 'string' || !/^(none|everyone|role:\d+)$/.test(e.mention)) {
      throw new Error(`${where}.mention must be "none", "everyone" or "role:<numeric id>"`);
    }
    if (typeof e.watchdog !== 'string' || !WATCHDOGS.includes(e.watchdog)) {
      throw new Error(`${where}.watchdog must be "none", "schedule" or "always_on"`);
    }
    return {
      login: e.login.trim().toLowerCase(),
      announce: e.announce,
      mention: e.mention,
      watchdog: e.watchdog as Watchdog,
    };
  });
}

export function graceMinutes(env: Env): number {
  const n = Number(env.ALWAYS_ON_GRACE_MIN);
  return env.ALWAYS_ON_GRACE_MIN && Number.isFinite(n) && n >= 0 ? n : 15;
}
