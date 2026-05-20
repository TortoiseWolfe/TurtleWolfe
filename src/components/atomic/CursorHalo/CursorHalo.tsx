'use client';

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface CursorHaloProps {
  /** Extra classes applied to the halo element. */
  className?: string;
  /** Halo diameter in px. Default 88. */
  size?: number;
  /** Peak opacity of the radial gradient. Default 0.18. */
  opacity?: number;
}

/**
 * Decorative phosphor-green halo that tracks the user's pointer. Renders a
 * radial-gradient circle that softly fades to transparent at the edges,
 * positioned at the cursor via `position: fixed` with `pointer-events: none`
 * so it never intercepts clicks.
 *
 * The halo color resolves from `var(--color-primary)` so it adapts to the
 * active DaisyUI theme (phosphor green in `turtlewolfe-crt`).
 *
 * Three independent disable gates — the halo renders only when ALL pass:
 * 1. NOT `prefers-reduced-motion: reduce` (per FR-009)
 * 2. NOT a coarse pointer (no hover surface — per FR-006 / Edge Cases §80)
 * 3. Component has mounted client-side (SSR returns `null`)
 *
 * Always `aria-hidden` — purely decorative; screen readers do not need it.
 *
 * @see features/enhancements/047-portfolio-visual-overhaul/spec.md §FR-006, §FR-009
 * @see features/enhancements/047-portfolio-visual-overhaul/research.md §R6
 */
export default function CursorHalo({
  className = '',
  size = 88,
  opacity = 0.18,
}: CursorHaloProps) {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Mount + coarse-pointer detection. Runs once on client.
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && window.matchMedia) {
      setCoarsePointer(window.matchMedia('(pointer: coarse)').matches);
    }
  }, []);

  // Attach the mousemove listener only when all gates pass.
  const enabled = mounted && !reducedMotion && !coarsePointer;

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [enabled]);

  if (!enabled) return null;

  const radius = size / 2;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed z-50${
        className ? ` ${className}` : ''
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle at center, var(--color-primary) 0%, transparent ${radius}px)`,
        opacity,
        borderRadius: '50%',
        mixBlendMode: 'screen',
      }}
    />
  );
}
