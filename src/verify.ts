const MAX_SKEW_MS = 10 * 60_000;

function header(h: Headers, name: string): string | null {
  const v = h.get(name);
  return v === null || v === '' ? null : v;
}

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> | null {
  if (!/^[0-9a-f]{64}$/i.test(hex)) return null;
  const out = new Uint8Array(new ArrayBuffer(32));
  for (let i = 0; i < 32; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

/** Verifies a Twitch EventSub signature over the raw body. Never throws on bad input. */
export async function verifyEventSub(
  secret: string,
  headers: Headers,
  rawBody: string,
  nowMs: number,
): Promise<boolean> {
  const id = header(headers, 'Twitch-Eventsub-Message-Id');
  const ts = header(headers, 'Twitch-Eventsub-Message-Timestamp');
  const sig = header(headers, 'Twitch-Eventsub-Message-Signature');
  const type = header(headers, 'Twitch-Eventsub-Message-Type');
  if (!id || !ts || !sig || !type) return false;
  if (!sig.startsWith('sha256=')) return false;
  const given = hexToBytes(sig.slice('sha256='.length));
  if (!given) return false;
  const sent = Date.parse(ts);
  if (!Number.isFinite(sent) || Math.abs(nowMs - sent) > MAX_SKEW_MS) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
  // subtle.verify compares in constant time.
  return crypto.subtle.verify('HMAC', key, given, enc.encode(id + ts + rawBody));
}
