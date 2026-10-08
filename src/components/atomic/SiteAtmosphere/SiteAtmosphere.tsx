'use client';

/**
 * Six depth orbs distributed across the viewport. Lower density than the
 * 9 in HeroStage so inner pages don't feel busier than the home hero.
 */
const SITE_ORBS = [
  {
    top: '12%',
    left: '8%',
    size: 3,
    color: 'var(--color-base-content)',
    opacity: 0.4,
    dx: 5,
    dy: -4,
    duration: 22,
  },
  {
    top: '28%',
    left: '72%',
    size: 4,
    color: 'var(--color-accent)',
    opacity: 0.35,
    dx: -4,
    dy: 6,
    duration: 26,
  },
  {
    top: '48%',
    left: '18%',
    size: 2,
    color: 'var(--color-primary)',
    opacity: 0.35,
    dx: 6,
    dy: 4,
    duration: 20,
  },
  {
    top: '62%',
    left: '88%',
    size: 3,
    color: 'var(--color-secondary)',
    opacity: 0.3,
    dx: -5,
    dy: -5,
    duration: 24,
  },
  {
    top: '78%',
    left: '38%',
    size: 2,
    color: 'var(--color-primary)',
    opacity: 0.4,
    dx: 4,
    dy: -3,
    duration: 18,
  },
  {
    top: '90%',
    left: '64%',
    size: 3,
    color: 'var(--color-base-content)',
    opacity: 0.3,
    dx: -3,
    dy: 5,
    duration: 28,
  },
];

/**
 * Site-wide CRT atmosphere — fixed-position decorative overlays that show on
 * every page WHEN the `turtlewolfe-crt` theme is active. Renders nothing
 * (display: none) on any other theme.
 *
 * Layers (bottom→top):
 *   1. Aurora bloom (single off-center radial gradient)
 *   2. Scanlines (low-opacity phosphor stripe pattern)
 *   3. Grain (currently disabled — was reading as snow)
 *   4. CRT vignette (corner darkening)
 *   5. 6 depth orbs (gentle drift, three opacity tiers)
 *
 * Each layer is `position: fixed`, `pointer-events: none`, `aria-hidden`.
 * Theme scoping via `[data-theme='turtlewolfe-crt']` selectors in globals.css.
 *
 * @see features/enhancements/047-portfolio-visual-overhaul/wireframes/08-nostromo-rev3.svg
 */
export default function SiteAtmosphere() {
  return (
    <div className="crt-atmosphere" aria-hidden="true">
      <div className="crt-atmosphere-bloom" />
      <div className="crt-atmosphere-scanlines" />
      <div className="crt-atmosphere-grain">
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          focusable="false"
        >
          <filter id="site-grain-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="2"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#site-grain-noise)" />
        </svg>
      </div>
      <div className="crt-atmosphere-vignette" />

      {/* Depth orbs — fixed-position so they float over the page as you
          scroll. Lower density than the hero's 9 to keep content-heavy
          pages from feeling busy. */}
      {SITE_ORBS.map((orb, idx) => (
        <span
          key={idx}
          className="crt-orb"
          style={{
            top: orb.top,
            left: orb.left,
            width: orb.size,
            height: orb.size,
            backgroundColor: orb.color,
            opacity: orb.opacity,
            position: 'fixed',
            ['--orb-dx' as string]: `${orb.dx}px`,
            ['--orb-dy' as string]: `${orb.dy}px`,
            ['--orb-duration' as string]: `${orb.duration}s`,
            boxShadow: `0 0 ${orb.size * 3}px ${orb.color}`,
          }}
        />
      ))}
    </div>
  );
}
