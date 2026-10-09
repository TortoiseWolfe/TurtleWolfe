import { graceMinutes, type Broadcaster, type Deps, type Env } from './config';
import { postOps } from './discord';
import { createTwitch, type Twitch } from './twitch';

const MIN = 60_000;
const ALERT_TTL_SECONDS = 2 * 24 * 60 * 60;

interface Segment {
  id: string;
  start_time: string;
  title?: string;
  canceled_until: string | null;
}

interface OfflineRecord {
  since: number;
  alerted?: boolean;
}

async function scheduleWatchdog(deps: Deps, env: Env, twitch: Twitch, b: Broadcaster): Promise<void> {
  const now = deps.now();
  const id = await twitch.userId(b.login);
  const res = await twitch.helix('/schedule', {
    broadcaster_id: id,
    start_time: new Date(now - 30 * MIN).toISOString(),
    first: '10',
  });
  if (res.status === 404) return; // no schedule set
  if (!res.ok) throw new Error(`schedule lookup failed: ${res.status}`);
  const data = ((await res.json()) as {
    data?: { segments?: Segment[] | null; vacation?: { start_time: string; end_time: string } | null };
  }).data;
  const vacation = data?.vacation;
  if (vacation && now >= Date.parse(vacation.start_time) && now <= Date.parse(vacation.end_time)) return;

  let liveNow: boolean | undefined;
  for (const s of data?.segments ?? []) {
    if (s.canceled_until !== null) continue;
    const age = now - Date.parse(s.start_time);
    if (!(age >= 5 * MIN && age <= 20 * MIN)) continue;
    const key = `alert:sched:${s.id}:${s.start_time}`;
    if (await deps.kv.get(key)) continue;
    liveNow ??= await twitch.isLive(id);
    if (liveNow) continue;
    await postOps(deps, env, `${b.login}: scheduled '${s.title ?? ''}' at ${s.start_time} hasn't started`);
    await deps.kv.put(key, '1', { expirationTtl: ALERT_TTL_SECONDS });
  }
}

async function alwaysOnWatchdog(deps: Deps, env: Env, twitch: Twitch, b: Broadcaster): Promise<void> {
  const now = deps.now();
  const key = `offline:${b.login}`;
  const raw = await deps.kv.get(key);
  const rec: OfflineRecord | null = raw ? (JSON.parse(raw) as OfflineRecord) : null;
  const live = await twitch.isLive(await twitch.userId(b.login));

  if (live) {
    if (!rec) return;
    if (rec.alerted) await postOps(deps, env, `${b.login} is back live`);
    await deps.kv.delete(key);
    return;
  }
  if (!rec) {
    await deps.kv.put(key, JSON.stringify({ since: now }));
    return;
  }
  const offlineMin = Math.floor((now - rec.since) / MIN);
  if (!rec.alerted && offlineMin >= graceMinutes(env)) {
    await postOps(deps, env, `${b.login} has been offline for ${offlineMin} min`);
    await deps.kv.put(key, JSON.stringify({ ...rec, alerted: true }));
  }
}

/** Runs each broadcaster's watchdog in isolation; rethrows a summary if any failed. */
export async function runWatchdogs(deps: Deps, env: Env, broadcasters: Broadcaster[]): Promise<void> {
  const twitch = createTwitch(deps, env);
  const errors: string[] = [];
  for (const b of broadcasters) {
    try {
      if (b.watchdog === 'schedule') await scheduleWatchdog(deps, env, twitch, b);
      else if (b.watchdog === 'always_on') await alwaysOnWatchdog(deps, env, twitch, b);
    } catch (e) {
      errors.push(`${b.login}: ${e instanceof Error ? e.message : 'unknown error'}`);
    }
  }
  if (errors.length > 0) throw new Error(`watchdog failed: ${errors.join('; ')}`);
}
