import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SiteAtmosphere from './SiteAtmosphere';

describe('SiteAtmosphere', () => {
  it('renders the crt-atmosphere wrapper', () => {
    const { container } = render(<SiteAtmosphere />);
    expect(container.querySelector('.crt-atmosphere')).toBeInTheDocument();
  });

  it('is aria-hidden so screen readers ignore the decorative layers', () => {
    const { container } = render(<SiteAtmosphere />);
    expect(container.querySelector('.crt-atmosphere')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('renders the bloom, scanline, grain and vignette layers', () => {
    const { container } = render(<SiteAtmosphere />);
    expect(
      container.querySelector('.crt-atmosphere-bloom')
    ).toBeInTheDocument();
    expect(
      container.querySelector('.crt-atmosphere-scanlines')
    ).toBeInTheDocument();
    expect(
      container.querySelector('.crt-atmosphere-grain')
    ).toBeInTheDocument();
    expect(
      container.querySelector('.crt-atmosphere-vignette')
    ).toBeInTheDocument();
  });

  it('renders six fixed-position depth orbs', () => {
    const { container } = render(<SiteAtmosphere />);
    const orbs = container.querySelectorAll('.crt-orb');
    expect(orbs).toHaveLength(6);
    orbs.forEach((orb) => {
      expect(orb.getAttribute('style')).toContain('position: fixed');
    });
  });
});
