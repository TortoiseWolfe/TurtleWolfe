import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ServiceCard from './ServiceCard';

describe('ServiceCard', () => {
  const defaultProps = {
    icon: <span data-testid="icon">🚀</span>,
    title: 'Web Development',
    description: 'Building modern, performant web applications.',
    features: ['React & Next.js', 'TypeScript', 'Responsive Design'],
  };

  it('renders without crashing', () => {
    const { container } = render(<ServiceCard {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('displays the title', () => {
    render(<ServiceCard {...defaultProps} />);
    expect(screen.getByText('Web Development')).toBeInTheDocument();
  });

  it('displays the description', () => {
    render(<ServiceCard {...defaultProps} />);
    expect(
      screen.getByText('Building modern, performant web applications.')
    ).toBeInTheDocument();
  });

  it('renders the icon', () => {
    render(<ServiceCard {...defaultProps} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders all feature items', () => {
    render(<ServiceCard {...defaultProps} />);
    expect(screen.getByText('React & Next.js')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Responsive Design')).toBeInTheDocument();
  });

  it('renders the default CTA label', () => {
    render(<ServiceCard {...defaultProps} />);
    const link = screen.getByRole('link', { name: 'Learn More' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/contact');
  });

  it('renders a custom CTA label and href', () => {
    render(
      <ServiceCard {...defaultProps} ctaLabel="Get a Quote" ctaHref="/quote" />
    );
    const link = screen.getByRole('link', { name: 'Get a Quote' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/quote');
  });

  it('renders as an article', () => {
    const { container } = render(<ServiceCard {...defaultProps} />);
    const article = container.querySelector('article');
    expect(article).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ServiceCard {...defaultProps} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders features as list items', () => {
    const { container } = render(<ServiceCard {...defaultProps} />);
    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(3);
  });
});
