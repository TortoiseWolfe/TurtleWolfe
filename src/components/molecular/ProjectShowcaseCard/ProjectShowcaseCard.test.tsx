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

  // ── CRT variant — feature 047 Nostromo CRT aesthetic. ──
  describe('variant="crt"', () => {
    const SAMPLE_ART = `  ●─────┐
  │     │
  └─────●`;
    const SAMPLE_DESC =
      'Two route nodes connected by a bicycle path for SpokeToWork.';

    it('renders an AsciiDiagram when asciiArt is provided and omits the image', () => {
      const { container } = render(
        <ProjectShowcaseCard
          {...defaultProps}
          variant="crt"
          asciiArt={{ art: SAMPLE_ART, description: SAMPLE_DESC }}
          image={{ src: '/test.jpg', alt: 'Should not render' }}
        />
      );

      // ASCII diagram present (figure + sr-only figcaption with the desc).
      const figure = container.querySelector('figure.ascii-diagram');
      expect(figure).not.toBeNull();
      expect(figure?.querySelector('pre')?.textContent).toBe(SAMPLE_ART);
      expect(screen.getByText(SAMPLE_DESC)).toBeInTheDocument();

      // No <img> rendered — ASCII art replaces the image entirely.
      expect(
        container.querySelector('img[alt="Should not render"]')
      ).toBeNull();
    });

    it('exposes the ASCII description in the DOM for screen readers', () => {
      render(
        <ProjectShowcaseCard
          {...defaultProps}
          variant="crt"
          asciiArt={{ art: SAMPLE_ART, description: SAMPLE_DESC }}
        />
      );
      // The figcaption uses sr-only so it's not visually rendered but is
      // present in the DOM — getByText finds it.
      expect(screen.getByText(SAMPLE_DESC)).toBeInTheDocument();
    });

    it('falls back to the existing image when asciiArt is not provided', () => {
      // Decision: in CRT variant without asciiArt, fall back to the image so
      // that More Work cards (which have PNGs, no ASCII art) still render
      // correctly in CRT mode rather than collapsing to a bare placeholder.
      render(
        <ProjectShowcaseCard
          {...defaultProps}
          variant="crt"
          image={{ src: '/test.jpg', alt: 'Project fallback screenshot' }}
        />
      );
      expect(
        screen.getByAltText('Project fallback screenshot')
      ).toBeInTheDocument();
    });

    it('renders a title-initial placeholder when CRT variant has no image and no asciiArt', () => {
      render(<ProjectShowcaseCard {...defaultProps} variant="crt" />);
      // 'M' from 'My Project' renders in the placeholder block.
      expect(screen.getByText('M')).toBeInTheDocument();
    });

    it('renders the derived tab label (first 4 chars upper-cased) by default', () => {
      render(
        <ProjectShowcaseCard
          {...defaultProps}
          title="SpokeToWork"
          variant="crt"
        />
      );
      // `[ SPOK ]` — brackets/label are part of the same <code>.
      expect(screen.getByText(/\[\s*SPOK\s*\]/)).toBeInTheDocument();
    });

    it('renders a custom tabLabel when provided', () => {
      render(
        <ProjectShowcaseCard
          {...defaultProps}
          variant="crt"
          tabLabel="01 · MAP"
        />
      );
      expect(screen.getByText(/\[\s*01 · MAP\s*\]/)).toBeInTheDocument();
    });

    it('renders stack chips as mono bracket pairs', () => {
      const { container } = render(
        <ProjectShowcaseCard {...defaultProps} variant="crt" />
      );
      // Each tech name is wrapped in [ ] decorations marked aria-hidden so
      // screen readers hear "React TypeScript Tailwind" — not punctuation.
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Tailwind')).toBeInTheDocument();
      const brackets = container.querySelectorAll('span[aria-hidden="true"]');
      // 3 tech names × 2 brackets each = 6.
      expect(brackets.length).toBe(6);
    });

    it('applies the crt-magnetic hover class for the +4px lift', () => {
      const { container } = render(
        <ProjectShowcaseCard {...defaultProps} variant="crt" />
      );
      expect(container.firstChild).toHaveClass('crt-magnetic');
    });

    it('renders as an external link by default in CRT variant', () => {
      render(<ProjectShowcaseCard {...defaultProps} variant="crt" />);
      const link = screen.getByRole('link', { name: 'My Project project' });
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('renders as a Next.js Link in CRT variant when hasDetailPage is true', () => {
      render(
        <ProjectShowcaseCard
          {...defaultProps}
          variant="crt"
          href="/projects/my-project"
          hasDetailPage
        />
      );
      const link = screen.getByRole('link', { name: 'My Project case study' });
      expect(link).toHaveAttribute('href', '/projects/my-project');
      expect(link).not.toHaveAttribute('target');
    });

    it('applies custom className alongside CRT-variant defaults', () => {
      const { container } = render(
        <ProjectShowcaseCard
          {...defaultProps}
          variant="crt"
          className="custom-crt-class"
        />
      );
      expect(container.firstChild).toHaveClass('custom-crt-class');
      expect(container.firstChild).toHaveClass('crt-magnetic');
    });
  });

  // Regression: variant="default" (explicit) must still render the original
  // image+badge composition unchanged from the legacy code path.
  describe('variant="default" (explicit) regression', () => {
    it('still renders the original DaisyUI badge styling', () => {
      const { container } = render(
        <ProjectShowcaseCard
          title="Legacy Card"
          description="Legacy description"
          stack={['React']}
          href="https://example.com"
          variant="default"
          image={{ src: '/legacy.jpg', alt: 'Legacy screenshot' }}
        />
      );
      // Original badge classes still present (no migration to bracket chips).
      expect(container.querySelector('.badge-ghost')).not.toBeNull();
      expect(screen.getByAltText('Legacy screenshot')).toBeInTheDocument();
    });
  });
});
