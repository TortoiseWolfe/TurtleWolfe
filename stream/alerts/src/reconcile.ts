import type { Broadcaster, Deps, Env } from './config';
import { postOps } from './discord';
import { createTwitch, type Subscription } from './twitch';

const DAY_MS = 24 * 60 * 60 * 1000;
const FAILED = new Set([
  'webhook_callback_verification_failed',
  'notification_failures_exceeded',
  'authorization_revoked',
  'user_removed',
  'version_removed',
]);

/** Re-checks our stream.online subscriptions at most once a day. Rethrows if any broadcaster failed. */
export async function reconcile(deps: Deps, env: Env, broadcasters: Broadcaster[]): Promise<void> {
  const last = Number(await deps.kv.get('reconcile:last'));
  if (Number.isFinite(last) && last > 0 && deps.now() - last < DAY_MS) return;

  const twitch = createTwitch(deps, env);
  const callback = `${env.PUBLIC_URL}/eventsub`;
  const errors: string[] = [];
  let subs: Subscription[] | undefined;

  for (const b of broadcasters.filter((x) => x.announce)) {
    try {
      subs ??= await twitch.listSubscriptions();
      const id = await twitch.userId(b.login);
      const ours = subs.filter(
        (s) => s.transport?.callback === callback && s.condition?.broadcaster_user_id === id,
      );
      if (ours.some((s) => s.status === 'enabled')) continue;
      const failed = ours.filter((s) => s.status !== undefined && FAILED.has(s.status));
      if (failed.length > 0) {
        for (const s of failed) await twitch.deleteSubscription(s.id);
        await twitch.createSubscription(id, callback);
        await postOps(deps, env, `repaired stream.online subscription for ${b.login} (was ${failed[0]!.status})`);
      } else if (ours.length === 0) {
        await twitch.createSubscription(id, callback);
        await postOps(deps, env, `created stream.online subscription for ${b.login}`);
      }
      // otherwise: only pending (or an unknown status) - leave it alone.
    } catch (e) {
      errors.push(`${b.login}: ${e instanceof Error ? e.message : 'unknown error'}`);
    }
  }

  if (errors.length > 0) throw new Error(`reconcile failed: ${errors.join('; ')}`);
  await deps.kv.put('reconcile:last', String(deps.now()));
}
