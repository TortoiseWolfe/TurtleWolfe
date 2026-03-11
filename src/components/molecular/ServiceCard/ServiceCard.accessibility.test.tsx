import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import ServiceCard from './ServiceCard';

describe('ServiceCard Accessibility', () => {
  const defaultProps = {
    icon: <span>🚀</span>,
    title: 'Web Development',
    description: 'Building modern web applications.',
    features: ['React & Next.js', 'TypeScript', 'Responsive Design'],
  };

  it('should have no accessibility violations with basic props', async () => {
    const { container } = render(<ServiceCard {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with custom CTA', async () => {
    const { container } = render(
      <ServiceCard {...defaultProps} ctaLabel="Get a Quote" ctaHref="/quote" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should use article semantic element', () => {
    const { container } = render(<ServiceCard {...defaultProps} />);
    const article = container.querySelector('article');
    expect(article).toBeTruthy();
  });

  it('should have proper heading', () => {
    const { container } = render(<ServiceCard {...defaultProps} />);
    const heading = container.querySelector('h3');
    expect(heading).toBeTruthy();
    expect(heading?.textContent).toBe('Web Development');
  });

  it('should be keyboard navigable', () => {
    const { container } = render(<ServiceCard {...defaultProps} />);
    const focusableElements = container.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    focusableElements.forEach((element) => {
      expect(element).toBeVisible();
    });
  });

  it('should have sufficient color contrast', async () => {
    const { container } = render(<ServiceCard {...defaultProps} />);
    const results = await axe(container, {
      rules: { 'color-contrast': { enabled: true } },
    });
    expect(results).toHaveNoViolations();
  });
});
