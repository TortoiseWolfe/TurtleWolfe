'use client';

import React, { useEffect, useRef, useState } from 'react';
import BlinkingCursor from '@/components/atomic/BlinkingCursor';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Default 5-line MU/TH/UR 6000 boot sequence. Verbatim from spec §Resolved 4.
 * The final line is intentionally just `>` so the blinking cursor sits after
 * the prompt once typing completes.
 */
const DEFAULT_LINES: readonly string[] = [
  '> initiating uplink...',
  '> authenticated.',
  '> rendering portfolio...',
  '> done.',
  '>',
] as const;

export interface BootSequenceProps {
  /** Extra classes applied to the wrapper element. */
  className?: string;
  /** Override the default 5 boot lines (for stories or testing). */
  lines?: readonly string[];
  /** Per-character delay in milliseconds. Defaults to 10ms. */
  charDelayMs?: number;
  /** Inter-line pause in milliseconds. Defaults to 30ms. */
  lineDelayMs?: number;
}

/**
 * Five-line "MU/TH/UR 6000 boot sequence" typewriter that types in over
 * ~700ms (typical) / ~1.2s (worst case) at ~10ms/char + ~30ms/line. The
 * BlinkingCursor trails the last-typed character on the active line; after
 * all 5 lines complete, the cursor stays at the position after the final `>`.
 *
 * SSR / hydration strategy: server render shows all 5 lines fully so the
 * initial paint never flashes empty. On mount, if reduced-motion is NOT set,
 * the effect resets the buffer to empty and replays the typing.
 *
 * Reduced-motion fallback: when `prefers-reduced-motion: reduce` is set,
 * skip the typing entirely — render all 5 lines on mount. The BlinkingCursor
 * still renders; its own blink animation is suppressed by the global CSS
 * `prefers-reduced-motion` gate in `globals.css`.
 *
 * Accessibility: `role="log"` with `aria-live="off"` — the content is
 * informational (not decorative) so screen readers see the final state,
 * but we suppress per-character announcements which would be noise.
 *
 * @see features/enhancements/047-portfolio-visual-overhaul/spec.md §Resolved 4
 * @see features/enhancements/047-portfolio-visual-overhaul/research.md §R2
 */
export default function BootSequence({
  className = '',
  lines = DEFAULT_LINES,
  charDelayMs = 10,
  lineDelayMs = 30,
}: BootSequenceProps) {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [currentLineIdx, setCurrentLineIdx] = useState(lines.length);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Mark mounted so we know we are past the SSR / first-paint frame.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Drive the typing animation. Skipped entirely when reduced-motion is set.
  useEffect(() => {
    if (!mounted) return;
    if (reducedMotion) {
      // Reduced motion: jump straight to the fully-typed final state.
      setCurrentLineIdx(lines.length);
      setCurrentCharIdx(0);
      return;
    }

    // Reset to empty and start typing from line 0, char 0.
    setCurrentLineIdx(0);
    setCurrentCharIdx(0);

    let lineIdx = 0;
    let charIdx = 0;
    let pausing = false;

    const tick = () => {
      if (pausing) return;

      const activeLine = lines[lineIdx] ?? '';

      if (charIdx < activeLine.length) {
        charIdx += 1;
        setCurrentCharIdx(charIdx);
        return;
      }

      // Active line finished. Advance to the next line after `lineDelayMs`.
      if (lineIdx < lines.length - 1) {
        pausing = true;
        window.setTimeout(() => {
          lineIdx += 1;
          charIdx = 0;
          setCurrentLineIdx(lineIdx);
          setCurrentCharIdx(0);
          pausing = false;
        }, lineDelayMs);
        return;
      }

      // All lines fully typed. Park the state and stop the interval.
      setCurrentLineIdx(lines.length);
      setCurrentCharIdx(0);
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    intervalRef.current = setInterval(tick, charDelayMs);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [mounted, reducedMotion, lines, charDelayMs, lineDelayMs]);

  // What to render on each line.
  //   - Before mount: fully-typed final state (SSR-safe, no hydration mismatch).
  //   - Reduced motion: fully-typed final state.
  //   - Typing in progress: lines below `currentLineIdx` render full text;
  //     the active line renders a `slice(0, currentCharIdx)`; lines above
  //     render nothing yet.
  const showFullyTyped = !mounted || reducedMotion;
  const done = currentLineIdx >= lines.length;

  return (
    <div
      role="log"
      aria-live="off"
      className={`font-mono text-primary${className ? ` ${className}` : ''}`}
    >
      {lines.map((line, idx) => {
        let displayed: string;
        let showCursorHere = false;

        if (showFullyTyped) {
          displayed = line;
          // Cursor sits at the end of the final line in the static state.
          showCursorHere = idx === lines.length - 1;
        } else if (done) {
          displayed = line;
          showCursorHere = idx === lines.length - 1;
        } else if (idx < currentLineIdx) {
          displayed = line;
        } else if (idx === currentLineIdx) {
          displayed = line.slice(0, currentCharIdx);
          showCursorHere = true;
        } else {
          displayed = '';
        }

        return (
          <div key={idx}>
            {displayed}
            {showCursorHere ? <BlinkingCursor /> : null}
          </div>
        );
      })}
    </div>
  );
}
