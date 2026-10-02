import { parseBroadcasters, type Deps, type Env } from './config';
import { postOps } from './discord';
import { handleEventSub } from './eventsub';
import { handleHealth } from './health';
import { reconcile } from './reconcile';
import { runWatchdogs } from './watchdog';

export async function handleRequest(request: Request, deps: Deps, env: Env): Promise<Response> {
  const { pathname } = new URL(request.url);
  if (pathname === '/eventsub' && request.method === 'POST') {
    return handleEventSub(request, deps, env, parseBroadcasters(env.BROADCASTERS));
  }
  if (pathname === '/health' && request.method === 'GET') return handleHealth(deps);
  return new Response('not found', { status: 404 });
}

/** Each step is isolated; cron:last is written last, even when steps failed. */
export async function runScheduled(deps: Deps, env: Env): Promise<void> {
  const broadcasters = parseBroadcasters(env.BROADCASTERS); // a config error must surface
  const failures: string[] = [];
  const steps: Array<[string, () => Promise<void>]> = [
    ['reconcile', () => reconcile(deps, env, broadcasters)],
    ['watchdog', () => runWatchdogs(deps, env, broadcasters)],
  ];
  for (const [name, step] of steps) {
    try {
      await step();
    } catch (e) {
      failures.push(e instanceof Error ? e.message : `${name} failed`);
    }
  }
  await deps.kv.put('cron:last', new Date(deps.now()).toISOString());
  if (failures.length > 0) await postOps(deps, env, `scheduled run: ${failures.join(' | ')}`);
}

function realDeps(env: Env, ctx?: ExecutionContext): Deps {
  return {
    fetch: (url, init) => globalThis.fetch(url, init),
    now: () => Date.now(),
    kv: env.STATE,
    waitUntil: ctx ? (p) => ctx.waitUntil(p) : undefined,
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return handleRequest(request, realDeps(env, ctx), env);
  },
  async scheduled(_event: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(runScheduled(realDeps(env), env));
  },
};
