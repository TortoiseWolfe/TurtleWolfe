import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ExperienceTimeline from './ExperienceTimeline';
import type { TimelineEntry } from './ExperienceTimeline';

describe('ExperienceTimeline', () => {
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

  it('renders without crashing', () => {
    const { container } = render(<ExperienceTimeline entries={mockEntries} />);
    expect(container).toBeInTheDocument();
  });

  it('renders all timeline entries', () => {
    render(<ExperienceTimeline entries={mockEntries} />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('StartupCo')).toBeInTheDocument();
  });

  it('displays year ranges', () => {
    render(<ExperienceTimeline entries={mockEntries} />);
    expect(screen.getByText('2022 - Present')).toBeInTheDocument();
    expect(screen.getByText('2020 - 2022')).toBeInTheDocument();
  });

  it('displays roles', () => {
    render(<ExperienceTimeline entries={mockEntries} />);
    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    expect(screen.getByText('Full-Stack Developer')).toBeInTheDocument();
  });

  it('displays descriptions', () => {
    render(<ExperienceTimeline entries={mockEntries} />);
    expect(
      screen.getByText('Led frontend architecture modernization.')
    ).toBeInTheDocument();
  });

  it('renders tech badges', () => {
    render(<ExperienceTimeline entries={mockEntries} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('Vue')).toBeInTheDocument();
  });

  it('renders as a list', () => {
    const { container } = render(<ExperienceTimeline entries={mockEntries} />);
    const list = container.querySelector('ul');
    expect(list).toBeTruthy();
    expect(list).toHaveClass('timeline');
  });

  it('renders correct number of list items', () => {
    const { container } = render(<ExperienceTimeline entries={mockEntries} />);
    const items = container.querySelectorAll('li');
    expect(items).toHaveLength(2);
  });

  it('applies custom className', () => {
    const { container } = render(
      <ExperienceTimeline entries={mockEntries} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders a single entry', () => {
    render(<ExperienceTimeline entries={[mockEntries[0]]} />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.queryByText('StartupCo')).not.toBeInTheDocument();
  });
});
