'use client';

import React, { useEffect, useState } from 'react';
import BootSequence from '@/components/molecular/BootSequence';
import Marquee from '@/components/molecular/Marquee';
import CursorHalo from '@/components/atomic/CursorHalo';
import GrainOverlay from '@/components/atomic/GrainOverlay';
import ScanlineOverlay from '@/components/atomic/ScanlineOverlay';
import { LayeredTurtleWolfeLogo } from '@/components/atomic/SpinningLogo';

export interface HeroStageHeadline {
  /** Brighter, larger "designer" half of the tagline. */
  design: string;
  /** Dimmer, smaller "developer" half of the tagline. */
  developer: string;
}

export interface HeroStageCta {
  /** Visible label text. */
  label: string;
  /** Anchor href. */
  href: string;
  /** When true, renders with `target="_blank" rel="noopener noreferrer"`. */
  external?: boolean;
}

export interface HeroStageProps {
  /** Extra classes applied to the outer `<section>` wrapper. */
  className?: string;
  /** Display name rendered in the italic serif. Default: 'Jonathan Pohlner'. */
  name?: string;
  /** Two-part tagline. Default matches the FR-001 designer-weighted copy. */
  headline?: HeroStageHeadline;
  /** Single-line credentials body rendered in mono under the tagline. */
  credentials?: string;
  /** Primary CTA (terminal-command button). Defaults to `> ./contact.sh`. */
  primaryCta?: HeroStageCta;
  /** Secondary CTA (outline terminal-command button). Defaults to the external resume. */
  secondaryCta?: HeroStageCta;
  /** Manifest items passed straight to the `<Marquee>` molecular. */
  manifestItems?: readonly string[];
}

const DEFAULT_HEADLINE: HeroStageHeadline = {
  design: 'GRAPHIC DESIGNER',
  developer: ':: FULL-STACK DEVELOPER',
};

const DEFAULT_CREDENTIALS =
  '20+ yrs design  ·  15+ yrs code  ·  accessible  ·  offline-first  ·  36 themes';

const DEFAULT_PRIMARY_CTA: HeroStageCta = {
  label: '> ./contact.sh',
  href: '/contact',
};

const DEFAULT_SECONDARY_CTA: HeroStageCta = {
  label: '> ./resume.pdf',
  href: 'https://tortoisewolfe.github.io/Resume/',
  external: true,
};

/**
 * ASCII bezel frame for the brand mark. Decorative — rendered via `<pre
 * aria-hidden="true">` so screen readers ignore it; the `LayeredTurtleWolfeLogo`
 * inside carries its own descriptive image alt text. Width is calibrated so the
 * inner space fits a square logo at ~80% of the frame's height without the box
 * lines overlapping the gear teeth.
 */
const BRAND_FRAME_ASCII = `┌─────────────────────────┐
│                         │
│                         │
│                         │
│                         │
│                         │
│                         │
│                         │
│                         │
│                         │
│                         │
└─────────────────────────┘`;

/**
 * Format a `Date` as `YYYY.MM.DD HH:MM:SS` for the MU/TH/UR status bar.
 * Zero-padded so the bar width is stable.
 */
function formatStatusTimestamp(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Compose the Nostromo CRT hero per the signed-off wireframe
 * `wireframes/06-nostromo-crt.svg`. Assembles the existing
 * `LayeredTurtleWolfeLogo` brand mark with the eight new atomic + molecular
 * pieces (`ScanlineOverlay`, `GrainOverlay`, `CursorHalo`, `BlinkingCursor`,
 * `BootSequence`, `Marquee`, plus this organism's status bar and CTAs) into
 * the first viewport of the home page.
 *
 * Layout strategy:
 * - Desktop (lg+): two-column grid — text stack on the left, ASCII-framed
 *   brand mark on the right.
 * - Mobile: single column stacked top-to-bottom; brand mark slips in between
 *   the body copy and the manifest block at a smaller size.
 *
 * Skip-link contract: the `<section>` carries `id="main-content"` and the
 * skip link is the first focusable element inside it, matching the existing
 * `src/app/page.tsx` pattern so the global a11y affordance survives.
 *
 * Color contract: no hardcoded colors — every fill / text / border resolves
 * via a DaisyUI theme token (`text-primary`, `text-secondary`,
 * `text-base-content`, `btn-primary`, `btn-outline btn-secondary`,
 * `bg-base-100`). The Nostromo phosphor palette only shows up because
 * `turtlewolfe-crt` is the active theme; switching themes recolors the
 * whole composition automatically (FR-010).
 *
 * @see features/enhancements/047-portfolio-visual-overhaul/spec.md §UI Mockup
 */
export default function HeroStage({
  className = '',
  name = 'Jonathan Pohlner',
  headline = DEFAULT_HEADLINE,
  credentials = DEFAULT_CREDENTIALS,
  primaryCta = DEFAULT_PRIMARY_CTA,
  secondaryCta = DEFAULT_SECONDARY_CTA,
  manifestItems,
}: HeroStageProps) {
  // Page-load-frozen timestamp per spec §UI Mockup status bar. Captured ONCE
  // on client mount (not server-side) to avoid a hydration mismatch — the
  // server's `Date` is in UTC and ms-later than the client's wall clock.
  // SSR renders a placeholder; the timestamp pops in on hydration. By design,
  // no `setInterval` ticks it — a constantly-updating timestamp is distracting
  // and signals "loading" when the page is actually idle.
  const [statusTimestamp, setStatusTimestamp] = useState('');
  useEffect(() => {
    setStatusTimestamp(formatStatusTimestamp(new Date()));
  }, []);

  return (
    <section
      id="main-content"
      aria-labelledby="hero-heading"
      className={`bg-base-100 relative w-full overflow-hidden px-4 py-16 sm:px-6 lg:py-24${
        className ? ` ${className}` : ''
      }`}
    >
      {/* Skip link — first focusable element in the section so keyboard users
          can jump past the decorative overlays straight to the content.
          Mirrors the pattern at src/app/page.tsx:270-275. */}
      <a
        href="#main-content"
        className="btn btn-sm btn-primary sr-only min-h-11 min-w-11 focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
      >
        Skip to main content
      </a>

      {/* Atmospheric overlays — full-bleed, decorative. Scanlines first (drift
          background), grain on top (subtle noise multiply). Both are
          `pointer-events-none` and `aria-hidden`. */}
      <ScanlineOverlay />
      <GrainOverlay />

      {/* Cursor halo only renders client-side on fine pointers + no
          reduced-motion. Self-gated, returns `null` when ineligible. */}
      <CursorHalo />

      {/* Inner content container. `relative z-10` so it sits above the
          decorative overlays. */}
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {/* Status bar — single mono line, page-load-frozen timestamp. The
            timestamp slot is empty on SSR and filled by useEffect on mount;
            a non-breaking space holds the row height so there's no layout
            shift when the time pops in. */}
        <div
          data-testid="hero-status-bar"
          className="text-primary font-mono text-sm tracking-wider"
        >
          MU/TH/UR 6000 :: PORT 3000 ::{' '}
          <span suppressHydrationWarning>{statusTimestamp || ' '}</span>
        </div>

        {/* Boot sequence sits immediately under the status bar so the typing
            animation reads as a single "terminal output" group. */}
        <div className="mt-4">
          <BootSequence />
        </div>

        {/* Two-column layout from lg+; single-column stack on mobile. */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:mt-12 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
          {/* LEFT COLUMN — name, tagline, body, manifest, CTAs. */}
          <div className="flex flex-col gap-6">
            {/* Hero name — the single italic-serif element on the page
                (spec §Resolved 1). Carries the entire "designer" visual
                weight against the otherwise-uniform mono. */}
            <h1
              id="hero-heading"
              className="font-display text-primary text-6xl leading-tight italic md:text-7xl lg:text-8xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {name}
            </h1>

            {/* Tagline — designer half brighter & ~2x; developer half dimmer.
                FR-001 designer-weighting requirement. */}
            <p data-testid="hero-tagline" className="font-mono">
              <span className="text-primary text-2xl font-bold tracking-widest md:text-3xl">
                {headline.design}
              </span>
              <span className="text-secondary ml-4 text-base tracking-widest opacity-70 md:text-lg">
                {headline.developer}
              </span>
            </p>

            {/* Credentials body — small mono, dimmed. */}
            <p
              data-testid="hero-credentials"
              className="text-base-content/70 font-mono text-sm md:text-base"
            >
              {credentials}
            </p>

            {/* Brand mark — shown here on MOBILE only. On lg+ it moves to the
                right column. The same component is mounted in both spots
                under responsive `hidden` toggles so we never duplicate the
                animation state — only one is visible at a time. */}
            <div className="lg:hidden">
              <BrandMarkFrame logoSizeClass="h-32 w-32 sm:h-40 sm:w-40" />
            </div>

            {/* Manifest block — `> MANIFEST.LOAD()` + 12-item wrapping list. */}
            <div className="mt-2">
              <Marquee items={manifestItems} />
            </div>

            {/* CTAs — terminal-command buttons. Both meet the 44px touch
                target via `min-h-11 min-w-11` (FR-013). */}
            <div
              data-testid="hero-ctas"
              className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-4"
            >
              <a
                href={primaryCta.href}
                data-testid="hero-primary-cta"
                className="btn btn-primary min-h-11 min-w-11 font-mono normal-case"
                {...(primaryCta.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {primaryCta.label}
              </a>
              <a
                href={secondaryCta.href}
                data-testid="hero-secondary-cta"
                className="btn btn-outline btn-secondary min-h-11 min-w-11 font-mono normal-case"
                style={{ borderStyle: 'dashed' }}
                {...(secondaryCta.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {secondaryCta.label}
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN — ASCII-framed brand mark, lg+ only. */}
          <div className="hidden lg:block">
            <BrandMarkFrame logoSizeClass="h-56 w-56 xl:h-64 xl:w-64" />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * ASCII box frame that surrounds the spinning brand mark. Rendered as
 * `<pre aria-hidden="true">` (decorative) with the `LayeredTurtleWolfeLogo`
 * absolutely positioned inside it. The logo's existing alt text on its
 * underlying images carries the meaning for assistive tech.
 */
function BrandMarkFrame({ logoSizeClass }: { logoSizeClass: string }) {
  return (
    <div
      data-testid="hero-brand-frame"
      className="relative inline-flex items-center justify-center"
    >
      {/* ASCII bezel — small enough that the gear inside dominates, not the
          frame. Tracking-tight collapses character spacing so the box looks
          like a CRT bezel, not a sparse outline. */}
      <pre
        aria-hidden="true"
        className="text-primary font-mono text-xs leading-[1.1] tracking-tight whitespace-pre opacity-80 sm:text-sm md:text-base"
      >
        {BRAND_FRAME_ASCII}
      </pre>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center ${logoSizeClass}`}
      >
        <LayeredTurtleWolfeLogo speed="slow" pauseOnHover />
      </div>
    </div>
  );
}
