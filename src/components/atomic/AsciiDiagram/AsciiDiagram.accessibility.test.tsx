import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import AsciiDiagram from './AsciiDiagram';

expect.extend(toHaveNoViolations);

const SAMPLE_ART = `  ●─────┐
  │     │
  └─────●`;
const SAMPLE_DESC =
  'Route diagram: two origin nodes connect to a single destination.';

describe('AsciiDiagram accessibility', () => {
  it('has no a11y violations', async () => {
    const { container } = render(
      <AsciiDiagram art={SAMPLE_ART} description={SAMPLE_DESC} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('hides the ASCII glyphs from the accessibility tree', () => {
    const { container } = render(
      <AsciiDiagram art={SAMPLE_ART} description={SAMPLE_DESC} />
    );
    expect(container.querySelector('pre')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('exposes the prose description to screen readers via a sr-only figcaption', () => {
    const { container } = render(
      <AsciiDiagram art={SAMPLE_ART} description={SAMPLE_DESC} />
    );
    const caption = container.querySelector('figcaption');
    expect(caption).not.toBeNull();
    expect(caption?.className).toContain('sr-only');
    expect(caption?.textContent).toBe(SAMPLE_DESC);
  });

  it('keeps the description as the only accessible-name source for the figure', async () => {
    // Render an isolated diagram and verify the only AT-visible text is the
    // description — the aria-hidden <pre> contributes no glyphs to the
    // accessibility tree.
    const { container } = render(
      <AsciiDiagram art={SAMPLE_ART} description={SAMPLE_DESC} />
    );

    const figure = container.querySelector('figure');
    expect(figure).not.toBeNull();

    const pre = figure!.querySelector('pre');
    const caption = figure!.querySelector('figcaption');
    expect(pre).toHaveAttribute('aria-hidden', 'true');
    expect(caption?.getAttribute('aria-hidden')).not.toBe('true');

    // jest-axe re-verifies the composite tree is clean.
    expect(await axe(container)).toHaveNoViolations();
  });

  it('produces no violations across all three tone variants', async () => {
    const tones = ['primary', 'secondary', 'accent'] as const;
    for (const tone of tones) {
      const { container, unmount } = render(
        <AsciiDiagram art={SAMPLE_ART} description={SAMPLE_DESC} tone={tone} />
      );
      expect(await axe(container)).toHaveNoViolations();
      unmount();
    }
  });
});
