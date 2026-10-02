import type { Deps, Env } from './config';

export interface DiscordResult {
  ok: boolean;
  status: number;
  /** True when the webhook no longer exists (404/401). */
  gone: boolean;
}

export interface DiscordPayload {
  content: string;
  allowed_mentions: Record<string, unknown>;
}

const MAX_WAIT_S = 5;

function sleepOf(deps: Deps): (ms: number) => Promise<void> {
  return deps.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
}

async function retryAfterSeconds(res: Response): Promise<number> {
  let secs = NaN;
  try {
    const body = (await res.json()) as { retry_after?: unknown };
    if (typeof body.retry_after === 'number') secs = body.retry_after;
  } catch {
    /* fall through to the header */
  }
  if (!Number.isFinite(secs)) {
    const h = res.headers.get('Retry-After');
    secs = h === null || h.trim() === '' ? NaN : Number(h); // Number(null) would be 0
  }
  if (!Number.isFinite(secs) || secs < 0) secs = 1;
  return Math.min(secs, MAX_WAIT_S);
}

/** Never throws, never logs the URL. */
export async function postDiscord(
  deps: Deps,
  url: string,
  payload: DiscordPayload,
): Promise<DiscordResult> {
  const send = () =>
    deps.fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
  try {
    let res = await send();
    if (res.status === 429) {
      await sleepOf(deps)((await retryAfterSeconds(res)) * 1000);
      res = await send();
    }
    const gone = res.status === 404 || res.status === 401;
    return { ok: res.status >= 200 && res.status < 300, status: res.status, gone };
  } catch {
    return { ok: false, status: 0, gone: false };
  }
}

export async function postOps(deps: Deps, env: Env, message: string): Promise<DiscordResult> {
  return postDiscord(deps, env.DISCORD_OPS_WEBHOOK, {
    content: `[afa-stream-alerts] ${message}`,
    allowed_mentions: { parse: [] },
  });
}

export async function postAnnounce(deps: Deps, env: Env, payload: DiscordPayload): Promise<DiscordResult> {
  const r = await postDiscord(deps, env.DISCORD_ANNOUNCE_WEBHOOK, payload);
  if (r.gone) await postOps(deps, env, `announce webhook returned ${r.status}`);
  return r;
}
