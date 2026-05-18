import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AsciiDiagram from './AsciiDiagram';

const SAMPLE_ART = `  ●─────┐
  │     │
  └─────●`;
const SAMPLE_DESC = 'Two nodes connected by a path.';

describe('AsciiDiagram', () => {
  it('renders the ASCII art content inside the document', () => {
    const { container } = render(
      <AsciiDiagram art={SAMPLE_ART} description={SAMPLE_DESC} />
    );
    const pre = container.querySelector('pre');
    expect(pre).not.toBeNull();
    expect(pre?.textContent).toBe(SAMPLE_ART);
  });

  it('marks the <pre> as aria-hidden so AT skips the glyphs', () => {
    const { container } = render(
      <AsciiDiagram art={SAMPLE_ART} description={SAMPLE_DESC} />
    );
    expect(container.querySelector('pre')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('renders the description inside a sr-only <figcaption>', () => {
    const { container } = render(
      <AsciiDiagram art={SAMPLE_ART} description={SAMPLE_DESC} />
    );
    const caption = container.querySelector('figcaption');
    expect(caption).not.toBeNull();
    expect(caption?.className).toContain('sr-only');
    expect(caption?.textContent).toBe(SAMPLE_DESC);
  });

  it('exposes the description in the DOM so screen readers and SEO pick it up', () => {
    render(<AsciiDiagram art={SAMPLE_ART} description={SAMPLE_DESC} />);
    expect(screen.getByText(SAMPLE_DESC)).toBeInTheDocument();
  });

  it('wraps everything in a single <figure> element', () => {
    const { container } = render(
      <AsciiDiagram art={SAMPLE_ART} description={SAMPLE_DESC} />
    );
    const figures = container.querySelectorAll('figure');
    expect(figures.length).toBe(1);
    expect(figures[0].querySelector('pre')).not.toBeNull();
    expect(figures[0].querySelector('figcaption')).not.toBeNull();
  });

  it('defaults to the primary theme token for tint', () => {
    const { container } = render(
      <AsciiDiagram art={SAMPLE_ART} description={SAMPLE_DESC} />
    );
    expect(container.querySelector('pre')?.className).toContain('text-primary');
  });

  it('tints to text-secondary when tone="secondary"', () => {
    const { container } = render(
      <AsciiDiagram
        art={SAMPLE_ART}
        description={SAMPLE_DESC}
        tone="secondary"
      />
    );
    const pre = container.querySelector('pre');
    expect(pre?.className).toContain('text-secondary');
    expect(pre?.className).not.toContain('text-primary');
  });

  it('tints to text-accent when tone="accent"', () => {
    const { container } = render(
      <AsciiDiagram art={SAMPLE_ART} description={SAMPLE_DESC} tone="accent" />
    );
    const pre = container.querySelector('pre');
    expect(pre?.className).toContain('text-accent');
    expect(pre?.className).not.toContain('text-primary');
  });

  it('appends a passed className alongside the defaults', () => {
    const { container } = render(
      <AsciiDiagram
        art={SAMPLE_ART}
        description={SAMPLE_DESC}
        className="border-primary border"
      />
    );
    const figure = container.querySelector('figure');
    expect(figure?.className).toContain('ascii-diagram');
    expect(figure?.className).toContain('border');
    expect(figure?.className).toContain('border-primary');
  });

  it('uses the monospace font and preserves whitespace', () => {
    const { container } = render(
      <AsciiDiagram art={SAMPLE_ART} description={SAMPLE_DESC} />
    );
    const pre = container.querySelector('pre');
    expect(pre?.className).toContain('font-mono');
    expect(pre?.className).toContain('whitespace-pre');
  });
});
