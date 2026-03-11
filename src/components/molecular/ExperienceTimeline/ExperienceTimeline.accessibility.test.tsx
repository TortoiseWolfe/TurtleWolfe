import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import ExperienceTimeline from './ExperienceTimeline';
import type { TimelineEntry } from './ExperienceTimeline';

describe('ExperienceTimeline Accessibility', () => {
  const mockEntries: TimelineEntry[] = [
    {
      yearRange: '2022 - Present',
      company: 'Acme Corp',
      role: 'Senior Developer',
      description: 'Led frontend architecture modernization.',
      tech: ['React', 'TypeScript'],
    },
    {
      yearRange: '2020 - 2022',
      company: 'StartupCo',
      role: 'Full-Stack Developer',
      description: 'Built MVPs for early-stage products.',
      tech: ['Node.js', 'Vue'],
    },
  ];

  it('should have no accessibility violations', async () => {
    const { container } = render(<ExperienceTimeline entries={mockEntries} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should render as a list for proper semantics', () => {
    const { container } = render(<ExperienceTimeline entries={mockEntries} />);
    const list = container.querySelector('ul');
    expect(list).toBeTruthy();
    const items = container.querySelectorAll('li');
    expect(items).toHaveLength(2);
  });

  it('should use time elements for year ranges', () => {
    const { container } = render(<ExperienceTimeline entries={mockEntries} />);
    const timeElements = container.querySelectorAll('time');
    expect(timeElements).toHaveLength(2);
    expect(timeElements[0].textContent).toBe('2022 - Present');
  });

  it('should have no violations with a single entry', async () => {
    const { container } = render(
      <ExperienceTimeline entries={[mockEntries[0]]} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have sufficient color contrast', async () => {
    const { container } = render(<ExperienceTimeline entries={mockEntries} />);
    const results = await axe(container, {
      rules: { 'color-contrast': { enabled: true } },
    });
    expect(results).toHaveNoViolations();
  });
});
