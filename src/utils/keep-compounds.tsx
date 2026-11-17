import React from 'react';

const COMPOUND = /([A-Za-z0-9]+(?:-[A-Za-z0-9]+)+)/g;

/**
 * Keep hyphenated compounds ("offline-first", "full-stack") on one line.
 *
 * A browser may break a line after any hyphen. Wrapping the whole compound in
 * a span with `white-space: nowrap` stops that, and the text stays ordinary
 * characters (a Unicode non-breaking hyphen would read as a different
 * character to screen readers and search). Text with no compound comes back
 * unchanged, as the same string.
 */
export function keepCompounds(text: string): React.ReactNode {
  if (!text.includes('-')) return text;
  const parts = text.split(COMPOUND);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default keepCompounds;
