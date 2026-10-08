'use client';

import React, { useId } from 'react';

export interface GrainOverlayProps {
  /** Extra classes applied to the overlay wrapper. */
  className?: string;
  /** Overlay opacity. Defaults to 0.06 — subtle enough not to wash out content. */
  opacity?: number;
  /**
   * `feTurbulence` base frequency. Higher values produce finer, denser grain.
   * Defaults to 0.65.
   */
  baseFrequency?: number;
}

/**
 * Decorative grain/noise overlay for the Nostromo CRT aesthetic. Renders an
 * inline SVG `feTurbulence` filter (fractal noise) over a full-bleed rectangle
 * and multiplies it onto the layer below at low opacity.
 *
 * Positioned `absolute inset-0` with `pointer-events: none`, so the parent
 * controls placement and the overlay never intercepts clicks. Always
 * `aria-hidden` — purely decorative.
 *
 * The grain is static; no animation is applied. The filter id is generated via
 * React's `useId` so multiple instances on the same page do not collide.
 *
 * @see features/enhancements/047-portfolio-visual-overhaul/spec.md §FR-003
 */
export default function GrainOverlay({
  className = '',
  opacity = 0.06,
  baseFrequency = 0.65,
}: GrainOverlayProps) {
  const reactId = useId();
  // useId returns a string with ':' which is invalid in some CSS/URL contexts.
  // Normalize to a filter-id-safe slug.
  const filterId = `grain-${reactId.replace(/:/g, '')}`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0${
        className ? ` ${className}` : ''
      }`}
      style={{ opacity, mixBlendMode: 'multiply' }}
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
      >
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={baseFrequency}
            numOctaves={2}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>
    </div>
  );
}
