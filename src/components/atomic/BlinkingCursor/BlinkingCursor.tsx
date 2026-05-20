'use client';

import React from 'react';

export interface BlinkingCursorProps {
  /** Override the cursor character. Defaults to a full block. */
  char?: string;
  /** Extra classes applied to the cursor element. */
  className?: string;
}

/**
 * Decorative blinking cursor for the Nostromo CRT aesthetic. Blinks at 1Hz via
 * the `cursor-blink` keyframe defined in globals.css. The blink animation is
 * automatically suppressed by the global `prefers-reduced-motion: reduce`
 * CSS gate — the character remains visible, just static.
 *
 * Always `aria-hidden` — purely decorative; screen readers do not need it.
 *
 * @see features/enhancements/047-portfolio-visual-overhaul/spec.md §UI Mockup
 */
export default function BlinkingCursor({
  char = '█',
  className = '',
}: BlinkingCursorProps) {
  return (
    <span
      aria-hidden="true"
      className={`cursor-blink inline-block text-primary${
        className ? ` ${className}` : ''
      }`}
    >
      {char}
    </span>
  );
}
