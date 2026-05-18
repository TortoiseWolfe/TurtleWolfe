import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock `motion/react` so `useInView` is controllable from the test.
const useInViewMock = vi.fn<() => boolean>();
vi.mock('motion/react', () => ({
  useInView: (...args: unknown[]) => useInViewMock(...(args as [])),
}));

// Mock `useReducedMotion` so we can toggle the JS gate per test.
const useReducedMotionMock = vi.fn<() => boolean>();
vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => useReducedMotionMock(),
}));

import ScrollReveal from './ScrollReveal';

describe('ScrollReveal', () => {
  beforeEach(() => {
    useInViewMock.mockReset();
    useReducedMotionMock.mockReset();
    useInViewMock.mockReturnValue(false);
    useReducedMotionMock.mockReturnValue(false);
  });

  it('renders its children', () => {
    useInViewMock.mockReturnValue(false);
    render(
      <ScrollReveal>
        <p>hello</p>
        <p>world</p>
      </ScrollReveal>
    );

    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('world')).toBeInTheDocument();
  });

  it('applies the screen-wipe class to children once the wrapper is in view', () => {
    useInViewMock.mockReturnValue(true);
    render(
      <ScrollReveal>
        <p data-testid="child">first</p>
      </ScrollReveal>
    );

    expect(screen.getByTestId('child').className).toContain('screen-wipe');
  });

  it('preserves child-provided classes alongside screen-wipe', () => {
    useInViewMock.mockReturnValue(true);
    render(
      <ScrollReveal>
        <p data-testid="child" className="text-primary">
          first
        </p>
      </ScrollReveal>
    );

    const child = screen.getByTestId('child');
    expect(child.className).toContain('text-primary');
    expect(child.className).toContain('screen-wipe');
  });

  it('omits the screen-wipe class when reduced-motion is requested, even when in view', () => {
    useInViewMock.mockReturnValue(true);
    useReducedMotionMock.mockReturnValue(true);
    render(
      <ScrollReveal>
        <p data-testid="child">first</p>
      </ScrollReveal>
    );

    expect(screen.getByTestId('child').className).not.toContain('screen-wipe');
  });

  it('staggers per-child animation delays via inline style', () => {
    useInViewMock.mockReturnValue(true);
    render(
      <ScrollReveal stagger={120}>
        <span data-testid="c0">a</span>
        <span data-testid="c1">b</span>
        <span data-testid="c2">c</span>
      </ScrollReveal>
    );

    expect(screen.getByTestId('c0').style.animationDelay).toBe('0ms');
    expect(screen.getByTestId('c1').style.animationDelay).toBe('120ms');
    expect(screen.getByTestId('c2').style.animationDelay).toBe('240ms');
  });

  it('uses the default 80ms stagger when none is supplied', () => {
    useInViewMock.mockReturnValue(true);
    render(
      <ScrollReveal>
        <span data-testid="c0">a</span>
        <span data-testid="c1">b</span>
      </ScrollReveal>
    );

    expect(screen.getByTestId('c0').style.animationDelay).toBe('0ms');
    expect(screen.getByTestId('c1').style.animationDelay).toBe('80ms');
  });

  it('does not apply an animation delay when reduced-motion is set', () => {
    useInViewMock.mockReturnValue(true);
    useReducedMotionMock.mockReturnValue(true);
    render(
      <ScrollReveal>
        <span data-testid="c0">a</span>
        <span data-testid="c1">b</span>
      </ScrollReveal>
    );

    expect(screen.getByTestId('c0').style.animationDelay).toBe('');
    expect(screen.getByTestId('c1').style.animationDelay).toBe('');
  });

  it('honours the `as` prop to render a different wrapper element', () => {
    useInViewMock.mockReturnValue(false);
    const { container } = render(
      <ScrollReveal as="section" className="my-wrap">
        <p>content</p>
      </ScrollReveal>
    );

    const wrapper = container.querySelector('section.my-wrap');
    expect(wrapper).not.toBeNull();
  });

  it('passes `once` and `margin` through to useInView', () => {
    useInViewMock.mockReturnValue(false);
    render(
      <ScrollReveal once={false} margin="-50px">
        <p>content</p>
      </ScrollReveal>
    );

    expect(useInViewMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ once: false, margin: '-50px' })
    );
  });

  it('leaves non-element children (e.g. text nodes) untouched', () => {
    useInViewMock.mockReturnValue(true);
    const { container } = render(<ScrollReveal>plain text</ScrollReveal>);

    expect(container.textContent).toBe('plain text');
  });
});
