'use client';

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Default tech-stack manifest items, verbatim from spec §UI Mockup.
 *
 * @see features/enhancements/047-portfolio-visual-overhaul/spec.md
 */
export const DEFAULT_MANIFEST_ITEMS = [
  'REACT',
  'NEXT',
  'TS',
  'NODE',
  'THREE',
  'C#',
  'PYTHON',
  'DOCKER',
  'AWS',
  'LINUX',
  'SUPABASE',
  'TAILWIND',
] as const;

export interface MarqueeProps {
  /** Extra classes applied to the root wrapper. */
  className?: string;
  /** Manifest items to render. Defaults to the 12-item tech stack. */
  items?: readonly string[];
  /** Re-type cadence in ms. Defaults to 12000 (12 seconds). */
  intervalMs?: number;
  /** Decorative header line. Defaults to `> MANIFEST.LOAD()`. */
  header?: string;
}

/**
 * Tech-stack manifest block for the Nostromo CRT hero. Renders a header line
 * plus a list of `[✓] PACKAGE` items in mono. At rest the block is static;
 * every `intervalMs` (default 12s), a random line briefly applies the
 * `.manifest-retype` CSS class to fire a 600ms `width: 0 → 100%` keyframe —
 * the "alive terminal" signal. Content never changes, only the animation.
 *
 * Despite the file name, this is NOT a scrolling marquee — terminology
 * preserved from the original task spec.
 *
 * Reduced motion: when `prefers-reduced-motion: reduce` is set, the
 * setInterval is never installed; the manifest renders static and fully
 * visible. Defense in depth — the global CSS gate in `globals.css` also
 * disables the keyframe.
 *
 * @see features/enhancements/047-portfolio-visual-overhaul/spec.md §FR-008
 * @see features/enhancements/047-portfolio-visual-overhaul/research.md §R3
 */
export default function Marquee({
  className = '',
  items = DEFAULT_MANIFEST_ITEMS,
  intervalMs = 12000,
  header = '> MANIFEST.LOAD()',
}: MarqueeProps) {
  const reducedMotion = useReducedMotion();
  const [retypingIdx, setRetypingIdx] = useState<number | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    if (items.length === 0) return;

    let clearTimer: ReturnType<typeof setTimeout> | null = null;

    const tick = setInterval(() => {
      const idx = Math.floor(Math.random() * items.length);
      setRetypingIdx(idx);
      clearTimer = setTimeout(() => {
        setRetypingIdx(null);
      }, 600);
    }, intervalMs);

    return () => {
      clearInterval(tick);
      if (clearTimer) clearTimeout(clearTimer);
    };
  }, [reducedMotion, items.length, intervalMs]);

  return (
    <div
      className={`font-mono text-sm${className ? ` ${className}` : ''}`}
      data-testid="manifest-block"
    >
      <div
        aria-hidden="true"
        className="text-secondary mb-2"
        data-testid="manifest-header"
      >
        {header}
      </div>
      {/* Inline-wrapping pill row per spec §UI Mockup. NOT a vertical list —
          the manifest reads as a single "stack.run()" output line that wraps
          across the column width. */}
      <ul
        className="m-0 flex list-none flex-wrap gap-x-3 gap-y-1 p-0"
        aria-label="Technology stack"
      >
        {items.map((item, idx) => (
          <li
            key={`${item}-${idx}`}
            className="text-primary inline-flex items-baseline whitespace-nowrap"
            data-testid={`manifest-item-${idx}`}
          >
            <span className="text-accent mr-1" aria-hidden="true">
              [✓]
            </span>
            <span
              className={
                retypingIdx === idx
                  ? 'manifest-retype inline-block overflow-hidden whitespace-nowrap'
                  : 'inline-block'
              }
              data-testid={`manifest-item-text-${idx}`}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
