import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CTABanner from './CTABanner';

describe('CTABanner', () => {
  const defaultProps = {
    headline: 'Ready to get started?',
    primaryCTA: { label: 'Contact Me', href: '/contact' },
  };

  it('renders without crashing', () => {
    const { container } = render(<CTABanner {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('displays the headline', () => {
    render(<CTABanner {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Ready to get started?' })
    ).toBeInTheDocument();
  });

  it('renders the primary CTA link', () => {
    render(<CTABanner {...defaultProps} />);
    const link = screen.getByRole('link', { name: 'Contact Me' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/contact');
  });

  it('renders the description when provided', () => {
    render(
      <CTABanner
        {...defaultProps}
        description="Let us build something great together."
      />
    );
    expect(
      screen.getByText('Let us build something great together.')
    ).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const { container } = render(<CTABanner {...defaultProps} />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(0);
  });

  it('renders a secondary CTA as internal link', () => {
    render(
      <CTABanner
        {...defaultProps}
        secondaryCTA={{ label: 'View Projects', href: '/projects' }}
      />
    );
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'View Projects' })).toHaveAttribute(
      'href',
      '/projects'
    );
  });

  it('renders a secondary CTA as external link', () => {
    render(
      <CTABanner
        {...defaultProps}
        secondaryCTA={{
          label: 'GitHub',
          href: 'https://github.com',
          external: true,
        }}
      />
    );
    const githubLink = screen.getByRole('link', { name: 'GitHub' });
    expect(githubLink).toHaveAttribute('href', 'https://github.com');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render secondary CTA when not provided', () => {
    render(<CTABanner {...defaultProps} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
  });

  it('applies custom className', () => {
    const { container } = render(
      <CTABanner {...defaultProps} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has a call-to-action aria-label on the section', () => {
    render(<CTABanner {...defaultProps} />);
    expect(
      screen.getByRole('region', { name: 'Call to action' })
    ).toBeInTheDocument();
  });
});
