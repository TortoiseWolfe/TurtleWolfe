import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { detectedConfig } from '@/config/project-detected';
import AsciiDiagram from '@/components/atomic/AsciiDiagram';

export interface ProjectShowcaseCardProps {
  title: string;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
  stack: string[];
  href: string;
  hasDetailPage?: boolean;
  className?: string;
  /**
   * Visual variant. `'default'` (the original) renders the DaisyUI-themed card
   * exactly as before; `'crt'` re-skins it in the Nostromo CRT aesthetic
   * (feature 047) — dark surface, phosphor-green border, monitor-window tab,
   * italic-serif title, mono bracket-style stack labels, and ASCII diagram in
   * place of the image when {@link asciiArt} is provided.
   *
   * @default 'default'
   * @see features/enhancements/047-portfolio-visual-overhaul/spec.md §FR-006, §UI Mockup
   */
  variant?: 'default' | 'crt';
  /**
   * Optional ASCII art payload used only when {@link variant} is `'crt'`.
   * When provided, an `AsciiDiagram` replaces the image area. When omitted
   * in CRT variant, the card falls back to the regular image rendering so
   * cards without bespoke ASCII art (e.g. the More Work grid) still look
   * correct in CRT mode rather than collapsing to a bare placeholder.
   */
  asciiArt?: {
    art: string;
    description: string;
  };
  /**
   * Optional override for the CRT card's top-strip label
   * (e.g. `[ 01 ] SPOKETOWORK.EXE` / `MAP`). When omitted, the label is
   * derived from the first 4 uppercase characters of {@link title}.
   * Only rendered when {@link variant} is `'crt'`.
   */
  tabLabel?: string;
}

/**
 * ProjectShowcaseCard — large image-driven card for the project grid.
 *
 * When `hasDetailPage` is true, renders as a Next.js Link to an internal
 * case-study page. Otherwise, renders as an external anchor.
 *
 * Two visual variants:
 * - `'default'` (unchanged): DaisyUI card with image, ghost badges, sans title.
 * - `'crt'` (feature 047): dark phosphor card with optional ASCII art,
 *   italic-serif title, mono bracket-style stack chips, and hover treatment
 *   that combines an amber border lift, phosphor bloom shadow, and a +4px
 *   magnetic offset. The magnetic offset is automatically disabled on coarse
 *   pointers and when prefers-reduced-motion is set (see spec §FR-006).
 *
 * @category molecular
 */
export default function ProjectShowcaseCard({
  title,
  description,
  image,
  stack,
  href,
  hasDetailPage = false,
  className = '',
  variant = 'default',
  asciiArt,
  tabLabel,
}: ProjectShowcaseCardProps) {
  // ── Default variant — preserved exactly as before. ──
  if (variant !== 'crt') {
    const defaultContent = (
      <>
        {image ? (
          <figure className="relative aspect-video w-full overflow-hidden">
            <Image
              src={`${detectedConfig.basePath}${image.src}`}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </figure>
        ) : (
          <div className="bg-base-300 flex aspect-video w-full items-center justify-center">
            <span className="text-base-content/40 text-4xl font-bold">
              {title[0]}
            </span>
          </div>
        )}
        <div className="card-body p-4">
          <h3 className="card-title text-primary text-lg">{title}</h3>
          <p className="text-base-content/80 text-sm leading-relaxed">
            {description}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {stack.map((tech) => (
              <span key={tech} className="badge badge-ghost badge-sm">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </>
    );

    const defaultCardClasses = `card bg-base-100 shadow-md group transition-all hover:-translate-y-1 hover:shadow-lg focus-within:ring-primary focus-within:ring-2 overflow-hidden${className ? ` ${className}` : ''}`;

    if (hasDetailPage) {
      return (
        <Link
          href={href}
          className={defaultCardClasses}
          aria-label={`${title} case study`}
        >
          {defaultContent}
        </Link>
      );
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={defaultCardClasses}
        aria-label={`${title} project`}
      >
        {defaultContent}
      </a>
    );
  }

  // ── CRT variant — feature 047 Nostromo CRT aesthetic. ──
  //
  // Tab label: derive from title (first 4 chars uppercased) when not provided.
  // The wireframe uses labels like `[ 01 ] SPOKETOWORK.EXE` / `MAP`; the
  // simpler 4-char default keeps unit tests deterministic. Callers that want
  // the full numbered label should pass it via `tabLabel`.
  const derivedTab = title.slice(0, 4).toUpperCase();
  const topLabel = tabLabel ?? derivedTab;

  // Hover treatment per spec §FR-006:
  //   - amber border lift → border color transitions to secondary token
  //   - phosphor bloom    → CSS box-shadow (the rgba phosphor color is
  //                         documented in spec §FR-010 as the ONE place
  //                         outside the CRT theme block where the phosphor
  //                         green may appear hardcoded, because the shadow
  //                         is purely decorative bloom, not a fill/text color
  //                         that would carry contrast meaning).
  //   - magnetic offset   → -translate-y-1, scoped to `@media (hover:hover)`
  //                         and `(pointer:fine)` via the `crt-magnetic` class
  //                         in globals.css so coarse pointers / reduced-motion
  //                         users get no translate.
  //
  // ALL color hooks except the bloom shadow are theme tokens (border-primary
  // → border-secondary on hover, text-primary, text-secondary, bg-base-200).
  // Switching themes recolors the card; the phosphor bloom remains green by
  // design (it is the "screen glow" — atmospheric, not chromatic identity).
  const crtCardClasses = [
    'group block overflow-hidden rounded-sm',
    'bg-base-200 border border-primary/40',
    'shadow-md transition-all duration-200',
    'hover:border-secondary',
    'hover:shadow-[0_0_24px_rgba(74,222,128,0.4)]',
    'crt-magnetic',
    'focus-within:ring-primary focus-within:ring-2 focus-within:ring-offset-2',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const crtContent = (
    <>
      {/* Monitor-window tab strip — `[ 01 ] SPOKETOWORK.EXE` style label
          on the left, optional badge slot (project type) on the right. */}
      <div className="border-primary/30 bg-base-300 flex items-center justify-between border-b px-3 py-1.5 font-mono text-xs">
        <span className="text-primary tracking-widest">
          <code className="text-primary">[ {topLabel} ]</code>
        </span>
        <span className="text-secondary tracking-widest">CASE</span>
      </div>

      {/* Visual area — ASCII diagram when provided, otherwise fall back to
          the existing image rendering so More Work cards still show PNGs
          inside CRT styling. Neither path uses a hardcoded color. */}
      {asciiArt ? (
        <div className="bg-base-100 flex aspect-video w-full items-center justify-center overflow-hidden p-3">
          <AsciiDiagram
            art={asciiArt.art}
            description={asciiArt.description}
            tone="primary"
            className="text-sm"
          />
        </div>
      ) : image ? (
        <figure className="relative aspect-video w-full overflow-hidden">
          <Image
            src={`${detectedConfig.basePath}${image.src}`}
            alt={image.alt}
            fill
            className="object-cover opacity-90 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </figure>
      ) : (
        <div className="bg-base-300 flex aspect-video w-full items-center justify-center">
          <span className="text-primary/40 font-display text-4xl italic">
            {title[0]}
          </span>
        </div>
      )}

      <div className="space-y-3 p-4">
        {/* Title in Instrument Serif italic — the one serif element on the
            page per spec §Resolved 1. Inline style mirrors HeroStage to
            guarantee var(--font-display) wins even if the `font-display`
            utility isn't generated by Tailwind. */}
        <h3
          className="font-display text-primary text-2xl leading-tight italic"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h3>

        {/* Description — inherits the mono body alias from globals.css
            (--font-body → --font-mono). Phosphor-green at 80% opacity for
            readable body weight against the dark deck. */}
        <p className="text-base-content/80 text-sm leading-relaxed">
          {description}
        </p>

        {/* Stack chips — mono bracket style `[REACT][NEXT][TS]`. Brackets
            are dimmer (primary/60) than the label (primary) so the label
            reads first; no DaisyUI badge, no background fill. */}
        {stack.length > 0 && (
          <div className="flex flex-wrap gap-x-1 gap-y-1 pt-1 font-mono text-xs">
            {stack.map((tech) => (
              <span key={tech} className="inline-flex items-center">
                <span className="text-primary/60" aria-hidden="true">
                  [
                </span>
                <span className="text-primary tracking-wider uppercase">
                  {tech}
                </span>
                <span className="text-primary/60" aria-hidden="true">
                  ]
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );

  if (hasDetailPage) {
    return (
      <Link
        href={href}
        className={crtCardClasses}
        aria-label={`${title} case study`}
      >
        {crtContent}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={crtCardClasses}
      aria-label={`${title} project`}
    >
      {crtContent}
    </a>
  );
}
