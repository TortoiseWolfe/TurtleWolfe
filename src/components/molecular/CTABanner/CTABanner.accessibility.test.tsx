import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import CTABanner from './CTABanner';

describe('CTABanner Accessibility', () => {
  const defaultProps = {
    headline: 'Ready to get started?',
    primaryCTA: { label: 'Contact Me', href: '/contact' },
  };

  it('should have no accessibility violations with basic props', async () => {
    const { container } = render(<CTABanner {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with all props', async () => {
    const { container } = render(
      <CTABanner
        {...defaultProps}
        description="Let us build something great."
        secondaryCTA={{ label: 'View Projects', href: '/projects' }}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with external secondary CTA', async () => {
    const { container } = render(
      <CTABanner
        {...defaultProps}
        secondaryCTA={{
          label: 'GitHub',
          href: 'https://github.com',
          external: true,
        }}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper section landmark with aria-label', () => {
    const { container } = render(<CTABanner {...defaultProps} />);
    const section = container.querySelector('section');
    expect(section).toBeTruthy();
    expect(section).toHaveAttribute('aria-label', 'Call to action');
  });

  it('should have proper heading hierarchy', () => {
    const { container } = render(<CTABanner {...defaultProps} />);
    const heading = container.querySelector('h2');
    expect(heading).toBeTruthy();
    expect(heading?.textContent).toBe('Ready to get started?');
  });

  it('should have sufficient color contrast', async () => {
    const { container } = render(<CTABanner {...defaultProps} />);
    const results = await axe(container, {
      rules: { 'color-contrast': { enabled: true } },
    });
    expect(results).toHaveNoViolations();
  });
});
