import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import HeroStage from './HeroStage';

describe('HeroStage', () => {
  it('renders the default display name', () => {
    render(<HeroStage />);
    // V08: the name renders in the h1 plus a "Jonathan Pohlner ·
    // Chattanooga, TN" byline near the BrandMarkBadge. Use heading role to
    // target the h1 specifically — getByText errors on multiple matches.
    expect(
      screen.getByRole('heading', { level: 1, name: 'Jonathan Pohlner' })
    ).toBeInTheDocument();
  });

  it('renders a skip link with href="#main-content" and sr-only class', () => {
    render(<HeroStage />);
    const skipLink = screen.getByRole('link', {
      name: /skip to main content/i,
    });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
    expect(skipLink.className).toContain('sr-only');
  });

  it('places id="main-content" on the section so the skip link resolves', () => {
    const { container } = render(<HeroStage />);
    const section = container.querySelector('section');
    expect(section).not.toBeNull();
    expect(section).toHaveAttribute('id', 'main-content');
  });

  it('renders the primary CTA with the default href and label', () => {
    render(<HeroStage />);
    const primary = screen.getByTestId('hero-primary-cta');
    expect(primary).toHaveAttribute('href', '/contact');
    expect(primary).toHaveTextContent('> ./contact.sh');
  });

  it('renders the secondary CTA with target="_blank" and rel="noopener noreferrer"', () => {
    render(<HeroStage />);
    const secondary = screen.getByTestId('hero-secondary-cta');
    expect(secondary).toHaveAttribute('target', '_blank');
    expect(secondary).toHaveAttribute('rel', 'noopener noreferrer');
    expect(secondary).toHaveAttribute(
      'href',
      'https://tortoisewolfe.github.io/Resume/'
    );
  });

  it('overrides the default name via the `name` prop', () => {
    render(<HeroStage name="Test User" />);
    // V08 only swaps the h1; the BrandMarkBadge byline is hard-coded to
    // "Jonathan Pohlner · Chattanooga, TN" since it's a literal credit, not
    // the same data as the hero display name. Assert against the h1 only.
    expect(
      screen.getByRole('heading', { level: 1, name: 'Test User' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { level: 1, name: 'Jonathan Pohlner' })
    ).not.toBeInTheDocument();
  });

  it('renders the status row with OPEN TO ENGAGEMENTS availability signal', () => {
    // V08 replaced the fictional MU/TH/UR 6000 :: PORT 3000 :: <timestamp>
    // line with real client signal: "STATUS :: OPEN TO ENGAGEMENTS :: Q3 2026".
    // The change is intentional — see HeroStage.tsx §"Status row" comment.
    render(<HeroStage />);
    const statusBar = screen.getByTestId('hero-status-bar');
    expect(statusBar.textContent).toContain('OPEN TO ENGAGEMENTS');
  });

  it('renders the availability availability cycle (Q3 2026) instead of a live timestamp', () => {
    // V08 dropped the live YYYY.MM.DD HH:MM:SS timestamp in favor of a
    // static "Q3 2026" availability signal. Hook scaffolding is kept in
    // HeroStage so a future variant can re-enable a real-time status line.
    render(<HeroStage />);
    const statusBar = screen.getByTestId('hero-status-bar');
    expect(statusBar.textContent).toContain('Q3 2026');
  });

  it('renders both halves of the designer-weighted tagline', () => {
    // V08 promoted the designer half from mono caps to italic serif. The
    // text is now title-case "Graphic Designer" (was "GRAPHIC DESIGNER").
    render(<HeroStage />);
    const tagline = screen.getByTestId('hero-tagline');
    expect(within(tagline).getByText('Graphic Designer')).toBeInTheDocument();
    expect(
      within(tagline).getByText(/FULL-STACK DEVELOPER/)
    ).toBeInTheDocument();
  });

  it('accepts a custom headline override', () => {
    render(
      <HeroStage
        headline={{ design: 'Art Director', developer: ':: ENGINEER' }}
      />
    );
    const tagline = screen.getByTestId('hero-tagline');
    expect(within(tagline).getByText('Art Director')).toBeInTheDocument();
    expect(within(tagline).getByText(/ENGINEER/)).toBeInTheDocument();
  });

  it('renders the credentials body line', () => {
    render(<HeroStage />);
    expect(screen.getByTestId('hero-credentials')).toBeInTheDocument();
  });

  it('renders the brand-mark badge with the spinning logo inside', () => {
    // V08 simplified the brand mark to a single inline BrandMarkBadge near
    // the byline (no more ASCII frame, no responsive twin mounts).
    render(<HeroStage />);
    const frame = screen.getByTestId('hero-brand-frame');
    expect(frame).toBeInTheDocument();
  });

  it('gives CTAs the 44px touch-target classes (FR-013)', () => {
    render(<HeroStage />);
    const primary = screen.getByTestId('hero-primary-cta');
    const secondary = screen.getByTestId('hero-secondary-cta');
    expect(primary.className).toContain('min-h-11');
    expect(primary.className).toContain('min-w-11');
    expect(secondary.className).toContain('min-h-11');
    expect(secondary.className).toContain('min-w-11');
  });

  it('honors a custom primary CTA prop', () => {
    render(
      <HeroStage primaryCta={{ label: '> ./hire.sh', href: '/hire-me' }} />
    );
    const primary = screen.getByTestId('hero-primary-cta');
    expect(primary).toHaveAttribute('href', '/hire-me');
    expect(primary).toHaveTextContent('> ./hire.sh');
  });

  it('omits target/rel on a non-external secondary CTA', () => {
    render(
      <HeroStage secondaryCta={{ label: '> ./about.sh', href: '/about' }} />
    );
    const secondary = screen.getByTestId('hero-secondary-cta');
    expect(secondary).not.toHaveAttribute('target');
    expect(secondary).not.toHaveAttribute('rel');
  });
});
