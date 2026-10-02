import { handleStreamOnline, type StreamOnlineEvent } from './announce';
import type { Broadcaster, Deps, Env } from './config';
import { postOps } from './discord';
import { verifyEventSub } from './verify';

const DEDUPE_TTL_SECONDS = 24 * 60 * 60;

interface EventSubBody {
  challenge?: string;
  subscription?: {
    type?: string;
    status?: string;
    condition?: { broadcaster_user_id?: string };
  };
  event?: StreamOnlineEvent;
}

const noContent = () => new Response(null, { status: 204 });

export async function handleEventSub(
  request: Request,
  deps: Deps,
  env: Env,
  broadcasters: Broadcaster[],
): Promise<Response> {
  // Verify against the raw text before anything parses it.
  const raw = await request.text();
  if (!(await verifyEventSub(env.EVENTSUB_SECRET, request.headers, raw, deps.now()))) {
    return new Response('forbidden', { status: 403 });
  }

  let body: EventSubBody;
  try {
    body = JSON.parse(raw) as EventSubBody;
  } catch {
    return noContent();
  }

  const type = request.headers.get('Twitch-Eventsub-Message-Type');
  // Verification bypasses dedupe on purpose: Twitch retries a challenge with the same id and needs the answer again.
  if (type === 'webhook_callback_verification') {
    return new Response(String(body.challenge ?? ''), {
      status: 200,
      headers: { 'content-type': 'text/plain' },
    });
  }

  const id = request.headers.get('Twitch-Eventsub-Message-Id')!;
  const dedupeKey = `msg:${id}`;
  if (await deps.kv.get(dedupeKey)) return noContent();
  await deps.kv.put(dedupeKey, '1', { expirationTtl: DEDUPE_TTL_SECONDS });

  let work: Promise<unknown> | undefined;
  if (type === 'revocation') {
    const s = body.subscription ?? {};
    work = postOps(
      deps,
      env,
      `subscription revoked: ${s.type ?? 'unknown'} for broadcaster ${s.condition?.broadcaster_user_id ?? 'unknown'} (status ${s.status ?? 'unknown'})`,
    );
  } else if (type === 'notification' && body.subscription?.type === 'stream.online' && body.event) {
    work = handleStreamOnline(deps, env, broadcasters, body.event);
  }

  if (work) {
    // Twitch gives up after a few seconds, so answer first and let Discord finish in the background.
    const safe = work.catch(() => undefined);
    if (deps.waitUntil) deps.waitUntil(safe);
    else await safe;
  }
  return noContent();
}
