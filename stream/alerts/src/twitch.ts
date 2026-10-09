import type { Deps, Env } from './config';

const API = 'https://api.twitch.tv/helix';
const TOKEN_URL = 'https://id.twitch.tv/oauth2/token';
const TOKEN_KEY = 'token:app';
const DAY = 86400;

export interface Subscription {
  id: string;
  status?: string;
  type?: string;
  condition?: { broadcaster_user_id?: string };
  transport?: { callback?: string };
}

export function createTwitch(deps: Deps, env: Env) {
  async function fetchToken(): Promise<string> {
    const res = await deps.fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.TWITCH_CLIENT_ID,
        client_secret: env.TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials',
      }).toString(),
    });
    if (!res.ok) throw new Error(`twitch token request failed: ${res.status}`);
    const body = (await res.json()) as { access_token: string; expires_in: number };
    // Cache slightly short of expiry; KV needs a TTL of at least 60 s.
    await deps.kv.put(TOKEN_KEY, body.access_token, {
      expirationTtl: Math.max(60, body.expires_in - 300),
    });
    return body.access_token;
  }

  async function token(): Promise<string> {
    return (await deps.kv.get(TOKEN_KEY)) ?? (await fetchToken());
  }

  async function helix(
    path: string,
    query: Record<string, string> = {},
    method = 'GET',
    body?: unknown,
  ): Promise<Response> {
    const qs = new URLSearchParams(query).toString();
    const url = `${API}${path}${qs ? `?${qs}` : ''}`;
    const send = async (tok: string) =>
      deps.fetch(url, {
        method,
        headers: {
          'Client-Id': env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${tok}`,
          ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
        },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });
    let res = await send(await token());
    if (res.status === 401) {
      await deps.kv.delete(TOKEN_KEY);
      res = await send(await fetchToken());
    }
    return res;
  }

  async function userId(login: string): Promise<string> {
    const key = `uid:${login}`;
    const cached = await deps.kv.get(key);
    if (cached) return cached;
    const res = await helix('/users', { login });
    if (!res.ok) throw new Error(`twitch users lookup for ${login} failed: ${res.status}`);
    const id = ((await res.json()) as { data: Array<{ id: string }> }).data[0]?.id;
    if (!id) throw new Error(`twitch user not found: ${login}`);
    await deps.kv.put(key, id, { expirationTtl: 7 * DAY });
    return id;
  }

  async function isLive(id: string): Promise<boolean> {
    const res = await helix('/streams', { user_id: id });
    if (!res.ok) throw new Error(`twitch streams lookup failed: ${res.status}`);
    return ((await res.json()) as { data: unknown[] }).data.length > 0;
  }

  async function listSubscriptions(): Promise<Subscription[]> {
    const res = await helix('/eventsub/subscriptions', { type: 'stream.online' });
    if (!res.ok) throw new Error(`twitch list subscriptions failed: ${res.status}`);
    return ((await res.json()) as { data: Subscription[] }).data;
  }

  async function createSubscription(broadcasterId: string, callback: string): Promise<void> {
    const res = await helix('/eventsub/subscriptions', {}, 'POST', {
      type: 'stream.online',
      version: '1',
      condition: { broadcaster_user_id: broadcasterId },
      transport: { method: 'webhook', callback, secret: env.EVENTSUB_SECRET },
    });
    if (!res.ok) throw new Error(`twitch create subscription failed: ${res.status}`);
  }

  async function deleteSubscription(id: string): Promise<void> {
    const res = await helix('/eventsub/subscriptions', { id }, 'DELETE');
    if (!res.ok) throw new Error(`twitch delete subscription failed: ${res.status}`);
  }

  return { helix, userId, isLive, listSubscriptions, createSubscription, deleteSubscription };
}

export type Twitch = ReturnType<typeof createTwitch>;
