import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import HeroStage from './HeroStage';

describe('HeroStage', () => {
  it('renders the default display name', () => {
    render(<HeroStage />);
    expect(screen.getByText('Jonathan Pohlner')).toBeInTheDocument();
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
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.queryByText('Jonathan Pohlner')).not.toBeInTheDocument();
  });

  it('renders the MU/TH/UR status bar with PORT 3000', () => {
    render(<HeroStage />);
    const statusBar = screen.getByTestId('hero-status-bar');
    expect(statusBar.textContent).toContain('MU/TH/UR 6000');
    expect(statusBar.textContent).toContain('PORT 3000');
  });

  it('renders a page-load-frozen status timestamp in YYYY.MM.DD HH:MM:SS form', () => {
    render(<HeroStage />);
    const statusBar = screen.getByTestId('hero-status-bar');
    // Match YYYY.MM.DD HH:MM:SS (zero-padded).
    expect(statusBar.textContent).toMatch(
      /\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}:\d{2}/
    );
  });

  it('renders both halves of the designer-weighted tagline', () => {
    render(<HeroStage />);
    const tagline = screen.getByTestId('hero-tagline');
    expect(within(tagline).getByText('GRAPHIC DESIGNER')).toBeInTheDocument();
    expect(
      within(tagline).getByText(/FULL-STACK DEVELOPER/)
    ).toBeInTheDocument();
  });

  it('accepts a custom headline override', () => {
    render(
      <HeroStage
        headline={{ design: 'ART DIRECTOR', developer: ':: ENGINEER' }}
      />
    );
    const tagline = screen.getByTestId('hero-tagline');
    expect(within(tagline).getByText('ART DIRECTOR')).toBeInTheDocument();
    expect(within(tagline).getByText(/ENGINEER/)).toBeInTheDocument();
  });

  it('renders the credentials body line', () => {
    render(<HeroStage />);
    expect(screen.getByTestId('hero-credentials')).toBeInTheDocument();
  });

  it('renders the ASCII brand-mark frame on both responsive slots', () => {
    render(<HeroStage />);
    // The component mounts the frame in two slots (mobile + desktop) with
    // responsive `hidden` toggles — both should be present in the DOM.
    const frames = screen.getAllByTestId('hero-brand-frame');
    expect(frames.length).toBeGreaterThanOrEqual(1);
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
