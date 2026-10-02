import { describe, expect, it } from 'vitest';
import { parseBroadcasters } from '../src/config';

const ok = { login: 'TurtleWolfe', announce: true, mention: 'role:123', watchdog: 'schedule' };

describe('parseBroadcasters', () => {
  it('parses a valid list and lowercases logins', () => {
    expect(parseBroadcasters(JSON.stringify([ok]))).toEqual([{ ...ok, login: 'turtlewolfe' }]);
  });
  it('throws on bad JSON', () => {
    expect(() => parseBroadcasters('{nope')).toThrow(/BROADCASTERS/);
  });
  it('throws when not an array', () => {
    expect(() => parseBroadcasters('{}')).toThrow(/array/);
  });
  it.each([
    ['login', { ...ok, login: '' }],
    ['announce', { ...ok, announce: 'yes' }],
    ['mention', { ...ok, mention: 'role:abc' }],
    ['mention', { ...ok, mention: 'here' }],
    ['watchdog', { ...ok, watchdog: 'sometimes' }],
  ])('names the bad field %s', (field, entry) => {
    expect(() => parseBroadcasters(JSON.stringify([entry]))).toThrow(new RegExp(field));
  });
  it('accepts none and everyone', () => {
    const r = parseBroadcasters(
      JSON.stringify([{ ...ok, mention: 'everyone' }, { ...ok, login: 'b', mention: 'none' }]),
    );
    expect(r.map((b) => b.mention)).toEqual(['everyone', 'none']);
  });
});
