import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import CaseStudyLayout from './CaseStudyLayout';
import type { CaseStudyData } from './CaseStudyLayout';

describe('CaseStudyLayout Accessibility', () => {
  const minimalProject: CaseStudyData = {
    title: 'Test Project',
    tagline: 'A project tagline',
    problem: 'The problem we solved.',
    solution: 'How we solved it.',
    techStack: ['React', 'TypeScript'],
  };

  const fullProject: CaseStudyData = {
    title: 'Full Project',
    tagline: 'Complete case study',
    heroImage: { src: '/hero.jpg', alt: 'Hero screenshot' },
    problem: 'A complex problem description.',
    solution: 'A detailed solution description.',
    solutionImages: [
      {
        src: '/sol1.jpg',
        alt: 'Solution screenshot 1',
        caption: 'Caption text',
      },
    ],
    techStack: ['Next.js', 'Supabase'],
    liveUrl: 'https://example.com',
    sourceUrl: 'https://github.com/example',
  };

  it('should have no accessibility violations with minimal props', async () => {
    const { container } = render(<CaseStudyLayout project={minimalProject} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with all props', async () => {
    const { container } = render(<CaseStudyLayout project={fullProject} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should use main landmark', () => {
    const { container } = render(<CaseStudyLayout project={minimalProject} />);
    const main = container.querySelector('main');
    expect(main).toBeTruthy();
  });

  it('should have proper heading hierarchy', () => {
    const { container } = render(<CaseStudyLayout project={minimalProject} />);
    const h1 = container.querySelector('h1');
    expect(h1).toBeTruthy();
    expect(h1?.textContent).toBe('Test Project');

    const h2s = container.querySelectorAll('h2');
    expect(h2s.length).toBeGreaterThanOrEqual(2); // Problem, Solution, Tech Stack
  });

  it('should have alt text on all images', () => {
    const { container } = render(<CaseStudyLayout project={fullProject} />);
    const images = container.querySelectorAll('img');
    images.forEach((img) => {
      expect(img).toHaveAttribute('alt');
      expect(img.getAttribute('alt')).not.toBe('');
    });
  });

  it('should be keyboard navigable', () => {
    const { container } = render(<CaseStudyLayout project={fullProject} />);
    const focusableElements = container.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    focusableElements.forEach((element) => {
      expect(element).toBeVisible();
    });
  });

  it('should have sufficient color contrast', async () => {
    const { container } = render(<CaseStudyLayout project={minimalProject} />);
    const results = await axe(container, {
      rules: { 'color-contrast': { enabled: true } },
    });
    expect(results).toHaveNoViolations();
  });
});
