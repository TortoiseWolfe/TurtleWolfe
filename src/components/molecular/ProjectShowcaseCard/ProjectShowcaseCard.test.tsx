import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectShowcaseCard from './ProjectShowcaseCard';

describe('ProjectShowcaseCard', () => {
  const defaultProps = {
    title: 'My Project',
    description: 'A great project description',
    stack: ['React', 'TypeScript', 'Tailwind'],
    href: 'https://example.com',
  };

  it('renders without crashing', () => {
    const { container } = render(<ProjectShowcaseCard {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('displays the project title', () => {
    render(<ProjectShowcaseCard {...defaultProps} />);
    expect(screen.getByText('My Project')).toBeInTheDocument();
  });

  it('displays the project description', () => {
    render(<ProjectShowcaseCard {...defaultProps} />);
    expect(screen.getByText('A great project description')).toBeInTheDocument();
  });

  it('renders stack badges', () => {
    render(<ProjectShowcaseCard {...defaultProps} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Tailwind')).toBeInTheDocument();
  });

  it('renders as an external link by default', () => {
    render(<ProjectShowcaseCard {...defaultProps} />);
    const link = screen.getByRole('link', { name: 'My Project project' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders as a Next.js Link when hasDetailPage is true', () => {
    render(
      <ProjectShowcaseCard
        {...defaultProps}
        href="/projects/my-project"
        hasDetailPage
      />
    );
    const link = screen.getByRole('link', {
      name: 'My Project case study',
    });
    expect(link).toHaveAttribute('href', '/projects/my-project');
    expect(link).not.toHaveAttribute('target');
  });

  it('renders the image when provided', () => {
    render(
      <ProjectShowcaseCard
        {...defaultProps}
        image={{ src: '/test.jpg', alt: 'Project screenshot' }}
      />
    );
    const image = screen.getByAltText('Project screenshot');
    expect(image).toBeInTheDocument();
  });

  it('renders a placeholder when no image is provided', () => {
    render(<ProjectShowcaseCard {...defaultProps} />);
    // First letter of title is used as placeholder
    expect(screen.getByText('M')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ProjectShowcaseCard {...defaultProps} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders with an empty stack array', () => {
    render(<ProjectShowcaseCard {...defaultProps} stack={[]} />);
    expect(screen.getByText('My Project')).toBeInTheDocument();
  });
});
