import type { Deps } from './config';

const FRESH_MS = 30 * 60_000;

export async function handleHealth(deps: Deps): Promise<Response> {
  const lastCron = await deps.kv.get('cron:last');
  const t = lastCron ? Date.parse(lastCron) : NaN;
  const ok = Number.isFinite(t) && deps.now() - t <= FRESH_MS;
  return new Response(JSON.stringify({ ok, lastCron: lastCron ?? null }), {
    status: ok ? 200 : 503,
    headers: { 'content-type': 'application/json' },
  });
}
