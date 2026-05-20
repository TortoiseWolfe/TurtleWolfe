'use client';

import React, { useEffect, useState } from 'react';
import Marquee from '@/components/molecular/Marquee';
import CursorHalo from '@/components/atomic/CursorHalo';
import GrainOverlay from '@/components/atomic/GrainOverlay';
import ScanlineOverlay from '@/components/atomic/ScanlineOverlay';
import { LayeredTurtleWolfeLogo } from '@/components/atomic/SpinningLogo';

export interface HeroStageHeadline {
  /** Italic-serif "Graphic Designer" half. */
  design: string;
  /** Mono caps ":: FULL-STACK DEVELOPER" half. */
  developer: string;
}

export interface HeroStageCta {
  label: string;
  href: string;
  external?: boolean;
}

export interface HeroStageProps {
  className?: string;
  name?: string;
  headline?: HeroStageHeadline;
  credentials?: string;
  primaryCta?: HeroStageCta;
  secondaryCta?: HeroStageCta;
  manifestItems?: readonly string[];
}

const DEFAULT_HEADLINE: HeroStageHeadline = {
  design: 'Graphic Designer',
  developer: ':: FULL-STACK DEVELOPER',
};

const DEFAULT_CREDENTIALS =
  '20+ yrs design · 15+ yrs code · accessible · offline-first · 36 themes';

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
 * 9 depth orbs distributed across the deck at three opacity tiers.
 * Front (brighter, larger) / mid / back. Each orb gently drifts via the
 * `.crt-orb` animation. See V08 wireframe + issues file §11.
 */
const DEPTH_ORBS = [
  {
    top: '14%',
    left: '12%',
    size: 5,
    color: 'var(--color-base-content)',
    opacity: 0.55,
    dx: 6,
    dy: -4,
    duration: 18,
  },
  {
    top: '24%',
    left: '22%',
    size: 3,
    color: 'var(--color-base-content)',
    opacity: 0.3,
    dx: -4,
    dy: 6,
    duration: 22,
  },
  {
    top: '10%',
    left: '58%',
    size: 4,
    color: 'var(--color-accent)',
    opacity: 0.45,
    dx: 5,
    dy: -3,
    duration: 16,
  },
  {
    top: '20%',
    left: '72%',
    size: 3,
    color: 'var(--color-accent)',
    opacity: 0.25,
    dx: -3,
    dy: 5,
    duration: 20,
  },
  {
    top: '68%',
    left: '78%',
    size: 4,
    color: 'var(--color-secondary)',
    opacity: 0.4,
    dx: 4,
    dy: 6,
    duration: 24,
  },
  {
    top: '52%',
    left: '8%',
    size: 3,
    color: 'var(--color-accent)',
    opacity: 0.35,
    dx: -5,
    dy: -4,
    duration: 19,
  },
  {
    top: '78%',
    left: '46%',
    size: 3,
    color: 'var(--color-primary)',
    opacity: 0.45,
    dx: 6,
    dy: 4,
    duration: 21,
  },
  {
    top: '30%',
    left: '88%',
    size: 2,
    color: 'var(--color-base-content)',
    opacity: 0.25,
    dx: -4,
    dy: 4,
    duration: 23,
  },
  {
    top: '88%',
    left: '30%',
    size: 3,
    color: 'var(--color-primary)',
    opacity: 0.4,
    dx: 5,
    dy: -5,
    duration: 17,
  },
];

/**
 * Compose the Nostromo CRT hero per the V08 signed-off wireframe
 * `wireframes/08-nostromo-rev3.svg` + binding spec at
 * `docs/design/wireframes/047-portfolio-visual-overhaul/08-nostromo-rev3.issues.md`.
 *
 * Adds six editorial moves + six atmospheric layers on top of V06:
 *
 *   Editorial (V07):  vertical edge marker, project monitor in right column,
 *                     red WARN/REC accent, off-axis display name,
 *                     italic-serif designer half, diagonal section divider
 *   Atmospheric (V08): phosphor halation glow, single off-center aurora bloom,
 *                     glass treatment on monitor + CTAs, depth orbs,
 *                     strong CRT vignette, glowing rule lines
 *
 * Color contract: no hardcoded values — every fill / text / border resolves
 * via DaisyUI theme tokens. Switching themes recolors the entire composition.
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
  // No live timestamp — replaced with the static "Q3 2026" availability
  // signal. Hook left here so future variants can re-enable a real-time
  // status line without restructuring.
  const [statusTimestamp] = useState('Q3 2026');
  useEffect(() => {
    // intentionally no-op for now
  }, []);

  return (
    <section
      id="main-content"
      aria-labelledby="hero-heading"
      className={`crt-hero crt-vignette bg-base-100 relative w-full overflow-hidden px-4 py-12 sm:px-6 lg:py-20${
        className ? ` ${className}` : ''
      }`}
    >
      {/* Skip link */}
      <a
        href="#main-content"
        className="btn btn-sm btn-primary sr-only min-h-11 min-w-11 focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
      >
        Skip to main content
      </a>

      {/* LAYER B — single off-center aurora bloom (cyan/green upper-left,
          subtle amber lower-right). NOT three racing stripes. */}
      <div className="crt-aurora-bloom" aria-hidden="true" />

      {/* LAYER D — depth orbs at three opacity tiers, gentle drift. */}
      {DEPTH_ORBS.map((orb, idx) => (
        <span
          key={idx}
          aria-hidden="true"
          className="crt-orb"
          style={{
            top: orb.top,
            left: orb.left,
            width: orb.size,
            height: orb.size,
            backgroundColor: orb.color,
            opacity: orb.opacity,
            ['--orb-dx' as string]: `${orb.dx}px`,
            ['--orb-dy' as string]: `${orb.dy}px`,
            ['--orb-duration' as string]: `${orb.duration}s`,
            boxShadow: `0 0 ${orb.size * 3}px ${orb.color}`,
          }}
        />
      ))}

      {/* Scanlines + grain (layered phosphor texture). */}
      <ScanlineOverlay />
      <GrainOverlay />

      {/* Cursor halo — fine-pointer only, reduced-motion-safe. */}
      <CursorHalo />

      {/* Vertical edge marker — real bio line. Editorial chrome that ALSO
          carries information. */}
      <div
        className="text-primary pointer-events-none absolute top-1/2 right-4 z-10 hidden -translate-y-1/2 rotate-180 font-mono text-xs tracking-[0.5em] opacity-40 md:block"
        style={{ writingMode: 'vertical-rl' }}
      >
        SCROLL FOR SELECTED WORK / CASE STUDIES / SERVICES
      </div>

      {/* Inner content container. */}
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {/* Status row — replaces fictional MU/TH/UR with actual availability +
            location info. Real client signal, same visual rhythm. */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div
            data-testid="hero-status-bar"
            className="crt-halation text-primary font-mono text-xs tracking-wider sm:text-sm"
          >
            STATUS :: OPEN TO ENGAGEMENTS ::{' '}
            <span suppressHydrationWarning>{statusTimestamp || 'Q3 2026'}</span>
          </div>

          {/* Available-for chromatic accent. Tells hiring managers what
              services Jonathan offers, in a single glance. */}
          <div className="flex items-center gap-2" data-testid="hero-warn">
            <span
              className="crt-halation-error text-error inline-flex items-center gap-2 border border-dashed px-2 py-1 font-mono text-[10px] font-bold tracking-[0.2em] sm:text-xs"
              style={{ borderColor: 'var(--color-error)' }}
            >
              ◆ AVAILABLE FOR HIRE
            </span>
            <span className="relative inline-flex items-center gap-1">
              <span
                aria-hidden="true"
                className="bg-error absolute inline-block h-3 w-3 animate-ping rounded-full opacity-50"
              />
              <span className="bg-error crt-halation-error relative inline-block h-2 w-2 rounded-full" />
              <span className="text-error crt-halation-error font-mono text-[10px] tracking-widest">
                LIVE
              </span>
            </span>
          </div>
        </div>

        {/* Services list — replaces decorative boot sequence with actual
            client offerings. Same visual block (terminal output), real info. */}
        <div
          className="crt-halation text-primary mt-3 font-mono text-sm leading-relaxed opacity-90"
          data-testid="hero-services"
        >
          <div>
            <span className="opacity-60">&gt;</span> available for:
          </div>
          <div className="pl-4">
            <span className="opacity-60">·</span> design systems &amp; component
            libraries
          </div>
          <div className="pl-4">
            <span className="opacity-60">·</span> full-stack web applications
            (React, Next.js, TypeScript)
          </div>
          <div className="pl-4">
            <span className="opacity-60">·</span> accessibility audits &amp;
            WCAG remediation
          </div>
          <div className="pl-4">
            <span className="opacity-60">·</span> technical writing &amp;
            documentation
          </div>
        </div>

        {/* Two-column layout from lg+; single-column stack on mobile. */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:mt-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
          {/* LEFT COLUMN — name, tagline, manifest, CTAs. */}
          <div className="flex flex-col gap-5">
            {/* Display name (move 4: pushed off-axis on lg+ so it crosses
                column gutter). LAYER A halation-strong for "phosphor burn". */}
            <h1
              id="hero-heading"
              className="font-display crt-halation-strong text-primary text-5xl leading-[0.95] italic sm:text-6xl md:text-7xl lg:translate-x-8 lg:text-8xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {name}
            </h1>

            {/* LAYER F — glowing rule under the name (cyan + amber stack). */}
            <div className="crt-rule mt-1 w-3/4 max-w-md" aria-hidden="true" />

            {/* Tagline — designer half in italic SERIF (move 5),
                developer half in mono caps. */}
            <p data-testid="hero-tagline" className="leading-tight">
              <span
                className="font-display crt-halation text-primary block text-3xl italic sm:text-4xl md:text-5xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {headline.design}
              </span>
              <span className="crt-halation-amber text-secondary mt-1 block font-mono text-xs tracking-[0.3em] opacity-80 sm:text-sm">
                {headline.developer}
              </span>
            </p>

            {/* Credentials body */}
            <p
              data-testid="hero-credentials"
              className="text-base-content/65 font-mono text-xs sm:text-sm"
            >
              {credentials}
            </p>

            {/* Mobile-only: project monitor sits inline. lg+ shows it in
                right column. */}
            <div className="lg:hidden">
              <ProjectMonitor compact />
            </div>

            {/* Manifest */}
            <div className="mt-1">
              <Marquee items={manifestItems} />
            </div>

            {/* CTAs with glass treatment. */}
            <div
              data-testid="hero-ctas"
              className="mt-2 flex flex-col gap-3 sm:flex-row sm:gap-4"
            >
              {/* Primary — filled phosphor + glass top + outer halation. */}
              <a
                href={primaryCta.href}
                data-testid="hero-primary-cta"
                className="btn btn-primary crt-glass relative min-h-11 min-w-11 font-mono normal-case"
                style={{
                  boxShadow:
                    '0 0 24px color-mix(in oklch, var(--color-primary) 45%, transparent), 0 0 8px color-mix(in oklch, var(--color-primary) 60%, transparent)',
                }}
                {...(primaryCta.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {primaryCta.label}
              </a>

              {/* Secondary — dashed amber outline + frosted glass interior + halation text. */}
              <a
                href={secondaryCta.href}
                data-testid="hero-secondary-cta"
                className="btn btn-outline btn-secondary crt-glass crt-glass-fill crt-halation-amber min-h-11 min-w-11 font-mono normal-case"
                style={{ borderStyle: 'dashed' }}
                {...(secondaryCta.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {secondaryCta.label}
              </a>
            </div>

            {/* Small corner brand mark — real bio in the subtitle, not
                fictional version numbers. */}
            <div className="mt-4 flex items-center gap-3">
              <BrandMarkBadge />
              <div className="font-mono text-xs">
                <span
                  className="font-display crt-halation text-primary italic"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Jonathan Pohlner
                </span>
                <span className="text-base-content/55 ml-2">
                  · Chattanooga, TN · remote-friendly
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — project monitor (replaces standalone brand mark). */}
          <div className="hidden lg:block">
            <ProjectMonitor />
          </div>
        </div>
      </div>

      {/* LAYER F + move 6 — diagonal section divider at hero bottom. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-2 left-0 z-10 mx-auto max-w-6xl px-4 sm:px-6"
      >
        <div
          className="bg-primary h-px w-full opacity-40"
          style={{
            transform: 'skewY(-0.4deg)',
            boxShadow:
              '0 0 12px var(--color-primary), 0 0 24px color-mix(in oklch, var(--color-primary) 50%, transparent)',
          }}
        />
        <div className="text-primary crt-halation mt-2 font-mono text-[10px] tracking-[0.2em] opacity-65 sm:text-xs">
          ━━ SECTION_01 · FEATURED_WORK
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ↓
        </div>
      </div>
    </section>
  );
}

/**
 * Small corner brand mark with phosphor halo bloom. Replaces the V06
 * "logo in a column" placement; this is a finishing-touch byline next to
 * the CTAs, not a column-anchoring hero element.
 */
function BrandMarkBadge() {
  return (
    <div
      data-testid="hero-brand-frame"
      className="relative inline-flex h-11 w-11 items-center justify-center"
      style={{
        filter:
          'drop-shadow(0 0 12px color-mix(in oklch, var(--color-primary) 50%, transparent))',
      }}
    >
      <LayeredTurtleWolfeLogo speed="slow" pauseOnHover />
    </div>
  );
}

/**
 * Project monitor for the hero's right column (or stacked inline on mobile
 * when `compact`). Renders a CRT-bezel framed mini-preview of SpokeToWork:
 * label strip, mini route map, status strip. Implementation honors V08
 * issues file §5.
 */
function ProjectMonitor({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href="/projects/spoketo-work"
      data-testid="hero-project-monitor"
      className={`crt-glass crt-shimmer group border-base-300/50 bg-base-200 relative block overflow-hidden rounded-md border transition-transform hover:-translate-y-1 ${
        compact ? 'max-w-full' : ''
      }`}
      style={{
        boxShadow:
          '0 0 32px color-mix(in oklch, var(--color-primary) 25%, transparent), 0 0 8px color-mix(in oklch, var(--color-primary) 40%, transparent), inset 0 0 0 1px color-mix(in oklch, var(--color-primary) 12%, transparent)',
      }}
    >
      {/* Top label strip (amber) */}
      <div className="bg-secondary text-secondary-content relative flex items-center justify-between px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.15em] sm:text-xs">
        <span>CH.01 · SPOKETO.WORK · MAP_VIEW.PNG</span>
        <span className="opacity-70">▸ ◆</span>
      </div>

      {/* Mini map screen */}
      <div
        className="bg-base-300 relative aspect-video"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0',
        }}
      >
        {/* Aurora bloom inside the screen */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background:
              'radial-gradient(ellipse 60% 70% at 30% 30%, color-mix(in oklch, var(--color-primary) 20%, transparent) 0%, transparent 70%)',
          }}
        />

        {/* Inline SVG route */}
        <svg
          viewBox="0 0 400 200"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M 30 170 L 90 110 L 160 130 L 240 70 L 320 100 L 380 50"
            stroke="var(--color-primary)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
            style={{
              filter:
                'drop-shadow(0 0 8px var(--color-primary)) drop-shadow(0 0 16px color-mix(in oklch, var(--color-primary) 60%, transparent))',
            }}
          />
          <path
            d="M 30 170 L 90 110 L 160 130 L 240 70 L 320 100 L 380 50"
            stroke="var(--color-primary)"
            strokeWidth="1"
            fill="none"
            opacity="0.4"
            strokeDasharray="3 3"
          />
          {/* Nodes */}
          {[
            { cx: 30, cy: 170, r: 4, color: 'var(--color-primary)' },
            { cx: 90, cy: 110, r: 3, color: 'var(--color-primary)' },
            { cx: 160, cy: 130, r: 3, color: 'var(--color-primary)' },
            { cx: 240, cy: 70, r: 3, color: 'var(--color-secondary)' },
            { cx: 320, cy: 100, r: 3, color: 'var(--color-primary)' },
            { cx: 380, cy: 50, r: 5, color: 'var(--color-error)' },
          ].map((node, i) => (
            <circle
              key={i}
              {...node}
              fill={node.color}
              style={{ filter: `drop-shadow(0 0 6px ${node.color})` }}
            />
          ))}
          <text
            x="370"
            y="40"
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize="10"
            fontWeight="700"
            fill="var(--color-error)"
            style={{ filter: 'drop-shadow(0 0 6px var(--color-error))' }}
          >
            ◆ JOB
          </text>
        </svg>

        {/* Scanline overlay scoped to the monitor screen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(transparent 0px, transparent 2px, color-mix(in oklch, var(--color-primary) 8%, transparent) 2px, color-mix(in oklch, var(--color-primary) 8%, transparent) 3px)',
            backgroundSize: '100% 4px',
          }}
        />

        {/* Inner CRT vignette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.4) 90%, rgba(0,0,0,0.7) 100%)',
          }}
        />
      </div>

      {/* Bottom status strip */}
      <div className="bg-base-300/60 text-primary border-base-300/60 flex items-center justify-between border-t px-3 py-1.5 font-mono text-[10px] sm:text-xs">
        <span className="opacity-90">▸ ROUTE 14.2KM · 47MIN · ENCRYPTED</span>
        <span className="text-secondary opacity-80">SIG: -67dB</span>
      </div>

      {/* Caption */}
      <div className="bg-base-100 text-primary border-base-300/40 border-t px-3 py-1 text-center font-mono text-[10px] opacity-70">
        CASE_STUDY/01
      </div>
    </a>
  );
}
