import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

const useInViewMock = vi.fn<() => boolean>();
vi.mock('motion/react', () => ({
  useInView: (...args: unknown[]) => useInViewMock(...(args as [])),
}));

const useReducedMotionMock = vi.fn<() => boolean>();
vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => useReducedMotionMock(),
}));

import ScrollReveal from './ScrollReveal';

expect.extend(toHaveNoViolations);

describe('ScrollReveal accessibility', () => {
  beforeEach(() => {
    useInViewMock.mockReset();
    useReducedMotionMock.mockReset();
    useInViewMock.mockReturnValue(false);
    useReducedMotionMock.mockReturnValue(false);
  });

  it('has no a11y violations before reveal', async () => {
    useInViewMock.mockReturnValue(false);
    const { container } = render(
      <ScrollReveal>
        <p>Pre-reveal content.</p>
      </ScrollReveal>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations after reveal', async () => {
    useInViewMock.mockReturnValue(true);
    const { container } = render(
      <ScrollReveal>
        <p>Post-reveal content.</p>
      </ScrollReveal>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations when reduced-motion is on', async () => {
    useInViewMock.mockReturnValue(true);
    useReducedMotionMock.mockReturnValue(true);
    const { container } = render(
      <ScrollReveal>
        <p>Reduced-motion content.</p>
      </ScrollReveal>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('adds no extra roles or labels of its own (structural wrapper)', () => {
    useInViewMock.mockReturnValue(false);
    const { container } = render(
      <ScrollReveal>
        <p>child</p>
      </ScrollReveal>
    );

    const wrapper = container.firstElementChild;
    expect(wrapper).not.toBeNull();
    expect(wrapper?.hasAttribute('role')).toBe(false);
    expect(wrapper?.hasAttribute('aria-label')).toBe(false);
    expect(wrapper?.hasAttribute('aria-labelledby')).toBe(false);
  });
});
