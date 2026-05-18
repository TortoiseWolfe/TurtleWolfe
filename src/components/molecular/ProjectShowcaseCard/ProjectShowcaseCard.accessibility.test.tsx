import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import ProjectShowcaseCard from './ProjectShowcaseCard';

describe('ProjectShowcaseCard Accessibility', () => {
  const defaultProps = {
    title: 'My Project',
    description: 'A great project description',
    stack: ['React', 'TypeScript'],
    href: 'https://example.com',
  };

  const SAMPLE_ART = `  ●─────┐
  │     │
  └─────●`;
  const SAMPLE_DESC = 'Two route nodes connected by a path.';

  it('should have no accessibility violations with basic props', async () => {
    const { container } = render(<ProjectShowcaseCard {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with image', async () => {
    const { container } = render(
      <ProjectShowcaseCard
        {...defaultProps}
        image={{ src: '/test.jpg', alt: 'Project screenshot' }}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations as internal link', async () => {
    const { container } = render(
      <ProjectShowcaseCard
        {...defaultProps}
        href="/projects/test"
        hasDetailPage
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper aria-label on links', () => {
    const { container } = render(<ProjectShowcaseCard {...defaultProps} />);
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('aria-label', 'My Project project');
  });

  it('should be keyboard navigable', () => {
    const { container } = render(<ProjectShowcaseCard {...defaultProps} />);
    const focusableElements = container.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    focusableElements.forEach((element) => {
      expect(element).toBeVisible();
    });
  });

  it('should have sufficient color contrast', async () => {
    const { container } = render(<ProjectShowcaseCard {...defaultProps} />);
    const results = await axe(container, {
      rules: { 'color-contrast': { enabled: true } },
    });
    expect(results).toHaveNoViolations();
  });

  // ── CRT variant — feature 047 a11y parity. ──
  it('should have no violations in CRT variant with ASCII art', async () => {
    const { container } = render(
      <ProjectShowcaseCard
        {...defaultProps}
        variant="crt"
        asciiArt={{ art: SAMPLE_ART, description: SAMPLE_DESC }}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations in CRT variant with image fallback', async () => {
    const { container } = render(
      <ProjectShowcaseCard
        {...defaultProps}
        variant="crt"
        image={{ src: '/test.jpg', alt: 'CRT-mode screenshot' }}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations in CRT variant as internal link', async () => {
    const { container } = render(
      <ProjectShowcaseCard
        {...defaultProps}
        variant="crt"
        href="/projects/test"
        hasDetailPage
        asciiArt={{ art: SAMPLE_ART, description: SAMPLE_DESC }}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should keep proper aria-label on CRT-variant external link', () => {
    const { container } = render(
      <ProjectShowcaseCard {...defaultProps} variant="crt" />
    );
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('aria-label', 'My Project project');
  });
});
