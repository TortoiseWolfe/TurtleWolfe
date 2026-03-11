import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CaseStudyLayout from './CaseStudyLayout';
import type { CaseStudyData } from './CaseStudyLayout';

describe('CaseStudyLayout', () => {
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
        caption: 'Dashboard view',
      },
      { src: '/sol2.jpg', alt: 'Solution screenshot 2' },
    ],
    techStack: ['Next.js', 'Supabase', 'Docker'],
    liveUrl: 'https://example.com',
    sourceUrl: 'https://github.com/example/project',
  };

  it('renders without crashing', () => {
    const { container } = render(<CaseStudyLayout project={minimalProject} />);
    expect(container).toBeInTheDocument();
  });

  it('displays the project title', () => {
    render(<CaseStudyLayout project={minimalProject} />);
    expect(
      screen.getByRole('heading', { name: 'Test Project' })
    ).toBeInTheDocument();
  });

  it('displays the tagline', () => {
    render(<CaseStudyLayout project={minimalProject} />);
    expect(screen.getByText('A project tagline')).toBeInTheDocument();
  });

  it('displays the problem section', () => {
    render(<CaseStudyLayout project={minimalProject} />);
    expect(screen.getByText('The Problem')).toBeInTheDocument();
    expect(screen.getByText('The problem we solved.')).toBeInTheDocument();
  });

  it('displays the solution section', () => {
    render(<CaseStudyLayout project={minimalProject} />);
    expect(screen.getByText('The Solution')).toBeInTheDocument();
    expect(screen.getByText('How we solved it.')).toBeInTheDocument();
  });

  it('renders tech stack badges', () => {
    render(<CaseStudyLayout project={minimalProject} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('renders hero image when provided', () => {
    render(<CaseStudyLayout project={fullProject} />);
    const heroImg = screen.getByAltText('Hero screenshot');
    expect(heroImg).toBeInTheDocument();
  });

  it('does not render hero image when not provided', () => {
    render(<CaseStudyLayout project={minimalProject} />);
    expect(screen.queryByAltText('Hero screenshot')).not.toBeInTheDocument();
  });

  it('renders solution images when provided', () => {
    render(<CaseStudyLayout project={fullProject} />);
    expect(screen.getByAltText('Solution screenshot 1')).toBeInTheDocument();
    expect(screen.getByAltText('Solution screenshot 2')).toBeInTheDocument();
  });

  it('renders image captions when provided', () => {
    render(<CaseStudyLayout project={fullProject} />);
    expect(screen.getByText('Dashboard view')).toBeInTheDocument();
  });

  it('renders the CTA banner with live URL', () => {
    render(<CaseStudyLayout project={fullProject} />);
    expect(
      screen.getByRole('link', { name: 'Visit Live Site' })
    ).toBeInTheDocument();
  });

  it('renders the CTA banner with source URL', () => {
    render(<CaseStudyLayout project={fullProject} />);
    expect(
      screen.getByRole('link', { name: 'View Source Code' })
    ).toBeInTheDocument();
  });

  it('renders fallback CTA when no live URL', () => {
    render(<CaseStudyLayout project={minimalProject} />);
    expect(
      screen.getByRole('link', { name: 'Get in Touch' })
    ).toBeInTheDocument();
  });

  it('renders back-to-projects link', () => {
    render(<CaseStudyLayout project={minimalProject} />);
    const backLink = screen.getByRole('link', { name: /Back to projects/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/#projects');
  });

  it('applies custom className', () => {
    const { container } = render(
      <CaseStudyLayout project={minimalProject} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders as a main element', () => {
    const { container } = render(<CaseStudyLayout project={minimalProject} />);
    const main = container.querySelector('main');
    expect(main).toBeTruthy();
  });
});
