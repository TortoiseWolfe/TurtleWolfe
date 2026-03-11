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
});
