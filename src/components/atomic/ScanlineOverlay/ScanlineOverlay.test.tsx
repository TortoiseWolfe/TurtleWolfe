import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ScanlineOverlay from './ScanlineOverlay';

describe('ScanlineOverlay', () => {
  it('renders an overlay div in the DOM', () => {
    const { container } = render(<ScanlineOverlay />);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('applies the scanline-drift class so the CSS animation engages by default', () => {
    const { container } = render(<ScanlineOverlay />);
    const overlay = container.querySelector('div');
    expect(overlay?.className).toContain('scanline-drift');
  });

  it('omits the scanline-drift class when static is true', () => {
    const { container } = render(<ScanlineOverlay static />);
    const overlay = container.querySelector('div');
    expect(overlay?.className).not.toContain('scanline-drift');
  });

  it('is aria-hidden so screen readers ignore the decorative overlay', () => {
    const { container } = render(<ScanlineOverlay />);
    expect(container.querySelector('div')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('positions the overlay as a non-interactive absolute layer', () => {
    const { container } = render(<ScanlineOverlay />);
    const overlay = container.querySelector('div');
    expect(overlay?.className).toContain('pointer-events-none');
    expect(overlay?.className).toContain('absolute');
    expect(overlay?.className).toContain('inset-0');
  });

  it('uses the default 0.05 opacity when no override is provided', () => {
    const { container } = render(<ScanlineOverlay />);
    const overlay = container.querySelector('div');
    expect(overlay?.getAttribute('style')).toContain('opacity: 0.05');
  });

  it('honors a custom opacity override', () => {
    const { container } = render(<ScanlineOverlay opacity={0.2} />);
    const overlay = container.querySelector('div');
    expect(overlay?.getAttribute('style')).toContain('opacity: 0.2');
  });

  it('tints the stripes via the --color-primary token (no hardcoded color)', () => {
    const { container } = render(<ScanlineOverlay />);
    const overlay = container.querySelector('div');
    expect(overlay?.getAttribute('style')).toContain('var(--color-primary)');
  });

  it('appends a passed className alongside the defaults', () => {
    const { container } = render(<ScanlineOverlay className="z-10" />);
    const overlay = container.querySelector('div');
    expect(overlay?.className).toContain('scanline-drift');
    expect(overlay?.className).toContain('z-10');
  });
});
