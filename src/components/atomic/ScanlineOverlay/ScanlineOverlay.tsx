'use client';

import React from 'react';

export interface ScanlineOverlayProps {
  /** Extra classes applied to the overlay element. */
  className?: string;
  /** Override the default 0.05 overlay opacity. */
  opacity?: number;
  /** When true, omit the `.scanline-drift` class so the pattern is static. */
  static?: boolean;
}

/**
 * Decorative CRT scanline overlay for the Nostromo CRT aesthetic. Renders a
 * 4px horizontal stripe pattern tinted via the `--color-primary` token, then
 * drifts the stripes downward via the `scanline-drift` keyframe defined in
 * globals.css. The drift is automatically suppressed by the global
 * `prefers-reduced-motion: reduce` CSS gate — scanlines remain visible, just
 * static.
 *
 * Always `aria-hidden` — purely decorative; screen readers do not need it.
 *
 * @see features/enhancements/047-portfolio-visual-overhaul/spec.md §FR-003
 */
export default function ScanlineOverlay({
  className = '',
  opacity = 0.05,
  static: isStatic = false,
}: ScanlineOverlayProps) {
  const driftClass = isStatic ? '' : 'scanline-drift';
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0${
        driftClass ? ` ${driftClass}` : ''
      }${className ? ` ${className}` : ''}`}
      style={{
        opacity,
        backgroundImage:
          'repeating-linear-gradient(to bottom, var(--color-primary) 0, var(--color-primary) 1px, transparent 1px, transparent 4px)',
        backgroundSize: '100% 8px',
      }}
    />
  );
}
