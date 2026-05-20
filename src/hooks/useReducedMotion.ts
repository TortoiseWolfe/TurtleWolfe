'use client';

import { useEffect, useState } from 'react';

/**
 * Returns `true` when the user has `prefers-reduced-motion: reduce` set.
 *
 * SSR-safe: returns `false` during server render (no `window`), then updates
 * on hydration via `useEffect`. Reactive: re-renders if the user toggles the
 * OS-level setting mid-session.
 *
 * Used by feature 047 (Portfolio Visual Overhaul — Nostromo CRT) as the JS
 * gate complementing the global CSS `@media (prefers-reduced-motion: reduce)`
 * block in `globals.css`. Defense in depth — both gates ensure no motion
 * sneaks through.
 *
 * @see features/enhancements/047-portfolio-visual-overhaul/research.md §R6
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setReduced(event.matches);
    };

    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
