import type { Broadcaster, Deps, Env } from './config';
import { postAnnounce, type DiscordPayload } from './discord';
import { createTwitch } from './twitch';

export interface StreamOnlineEvent {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  type?: string;
}

const COOLDOWN_SECONDS = 30 * 60;
const NO_TITLE = '(title unavailable)';

export function buildAnnouncement(b: Broadcaster, event: StreamOnlineEvent, rawTitle: string): DiscordPayload {
  const title = rawTitle.trim();
  const { broadcaster_user_login: login, broadcaster_user_name: name } = event;
  const isRerun = /^\[rerun\]/i.test(title) || event.type === 'rerun';
  const url = `https://twitch.tv/${login}`;
  if (isRerun) {
    return { content: `**${name}** rerun: ${title}\n${url}`, allowed_mentions: { parse: [] } };
  }
  let prefix = '';
  let allowed: Record<string, unknown> = { parse: [] };
  if (b.mention === 'everyone') {
    prefix = '@everyone ';
    allowed = { parse: ['everyone'] };
  } else if (b.mention.startsWith('role:')) {
    const id = b.mention.slice('role:'.length);
    prefix = `<@&${id}> `;
    allowed = { roles: [id] };
  }
  return { content: `${prefix}**${name} is live:** ${title}\n${url}`, allowed_mentions: allowed };
}

async function fetchTitle(deps: Deps, env: Env, broadcasterId: string): Promise<string> {
  try {
    const res = await createTwitch(deps, env).helix('/channels', { broadcaster_id: broadcasterId });
    if (!res.ok) return NO_TITLE;
    const title = ((await res.json()) as { data?: Array<{ title?: string }> }).data?.[0]?.title;
    return typeof title === 'string' && title !== '' ? title : NO_TITLE;
  } catch {
    return NO_TITLE;
  }
}

export async function handleStreamOnline(
  deps: Deps,
  env: Env,
  broadcasters: Broadcaster[],
  event: StreamOnlineEvent,
): Promise<void> {
  const login = String(event.broadcaster_user_login ?? '').toLowerCase();
  const b = broadcasters.find((x) => x.login === login);
  if (!b || !b.announce) return;

  const cooldownKey = `announced:${login}`;
  if (await deps.kv.get(cooldownKey)) return;
  await deps.kv.put(cooldownKey, String(deps.now()), { expirationTtl: COOLDOWN_SECONDS });

  const title = await fetchTitle(deps, env, event.broadcaster_user_id);
  await postAnnounce(deps, env, buildAnnouncement(b, event, title));
}
