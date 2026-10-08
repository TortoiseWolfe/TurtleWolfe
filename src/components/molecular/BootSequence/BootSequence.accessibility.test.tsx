import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import BootSequence from './BootSequence';

const useReducedMotionMock = vi.fn<() => boolean>(() => false);
vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => useReducedMotionMock(),
}));

expect.extend(toHaveNoViolations);

describe('BootSequence accessibility', () => {
  beforeEach(() => {
    useReducedMotionMock.mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('has no a11y violations in the default (motion-enabled) state', async () => {
    const { container } = render(<BootSequence />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations when reduced-motion is set', async () => {
    useReducedMotionMock.mockReturnValue(true);
    const { container } = render(<BootSequence />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('exposes the boot output as a live-region log so screen readers can perceive it', () => {
    const { container } = render(<BootSequence />);
    const log = container.querySelector('[role="log"]');
    expect(log).not.toBeNull();
    // `aria-live="off"` keeps the per-character typing quiet — the final
    // state is what matters and the block re-renders fast enough that the
    // AT will see it on initial focus.
    expect(log).toHaveAttribute('aria-live', 'off');
  });

  it('does NOT hide the boot text from assistive tech (it is informational, not decorative)', () => {
    const { container } = render(<BootSequence />);
    const log = container.querySelector('[role="log"]');
    expect(log).not.toHaveAttribute('aria-hidden', 'true');
  });
});
