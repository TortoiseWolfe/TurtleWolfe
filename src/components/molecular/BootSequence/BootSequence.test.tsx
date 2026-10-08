import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import BootSequence from './BootSequence';

// Mock the reduced-motion hook so each test can dictate its return value.
const useReducedMotionMock = vi.fn<() => boolean>(() => false);
vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => useReducedMotionMock(),
}));

const DEFAULT_LINES = [
  '> initiating uplink...',
  '> authenticated.',
  '> rendering portfolio...',
  '> done.',
  '>',
] as const;

describe('BootSequence', () => {
  beforeEach(() => {
    useReducedMotionMock.mockReturnValue(false);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('SSR renders all 5 lines fully (no useEffect, no client-only timers)', async () => {
    // Use react-dom/server to render WITHOUT effects firing — this simulates
    // what the server sends on first paint. Client-side, the mount effect
    // resets and starts typing; this test specifically guards the SSR output.
    // renderToString escapes `>` to `&gt;`, so assert against the escaped form.
    const { renderToString } = await import('react-dom/server');
    const html = renderToString(<BootSequence />);
    DEFAULT_LINES.forEach((line) => {
      const escaped = line.replace(/>/g, '&gt;');
      expect(html).toContain(escaped);
    });
  });

  it('renders the role="log" wrapper with aria-live="off"', () => {
    render(<BootSequence />);
    const log = screen.getByRole('log');
    expect(log).toHaveAttribute('aria-live', 'off');
  });

  it('renders the BlinkingCursor at the end of the final line in the static state', () => {
    const { container } = render(<BootSequence />);
    const cursors = container.querySelectorAll('.cursor-blink');
    expect(cursors).toHaveLength(1);
  });

  it('after advancing fake timers past ~1200ms, all 5 lines are visible and the cursor is parked at the end', () => {
    const { container } = render(<BootSequence />);

    // Drive the mount effect + the typing interval.
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    const lines = container.querySelectorAll('div[role="log"] > div');
    expect(lines).toHaveLength(5);
    DEFAULT_LINES.forEach((line, idx) => {
      expect(lines[idx]?.textContent).toContain(line);
    });

    // Exactly one cursor, parked at the end of the final line.
    const cursors = container.querySelectorAll('.cursor-blink');
    expect(cursors).toHaveLength(1);
    expect(lines[4]?.querySelector('.cursor-blink')).not.toBeNull();
  });

  it('renders all 5 lines immediately when reduced-motion is set, and never starts the interval', () => {
    useReducedMotionMock.mockReturnValue(true);
    const { container } = render(<BootSequence />);

    // Flush the mount effect.
    act(() => {
      vi.advanceTimersByTime(0);
    });

    const lines = container.querySelectorAll('div[role="log"] > div');
    expect(lines).toHaveLength(5);
    DEFAULT_LINES.forEach((line, idx) => {
      expect(lines[idx]?.textContent).toContain(line);
    });

    // Even after a long timer advance, content is stable (no animation ran).
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    const linesAfter = container.querySelectorAll('div[role="log"] > div');
    DEFAULT_LINES.forEach((line, idx) => {
      expect(linesAfter[idx]?.textContent).toContain(line);
    });
  });

  it('respects custom lines, charDelayMs, and lineDelayMs', () => {
    const customLines = ['> a', '> bc'] as const;
    const { container } = render(
      <BootSequence lines={customLines} charDelayMs={5} lineDelayMs={10} />
    );

    act(() => {
      vi.advanceTimersByTime(500);
    });

    const lines = container.querySelectorAll('div[role="log"] > div');
    expect(lines).toHaveLength(2);
    expect(lines[0]?.textContent).toContain('> a');
    expect(lines[1]?.textContent).toContain('> bc');
  });

  it('appends a passed className alongside the defaults', () => {
    render(<BootSequence className="my-extra" />);
    const log = screen.getByRole('log');
    expect(log.className).toContain('font-mono');
    expect(log.className).toContain('text-primary');
    expect(log.className).toContain('my-extra');
  });

  it('shows only the active line being typed (lines below are full, lines above are empty) mid-animation', () => {
    const customLines = ['> ab', '> cd', '> ef'] as const;
    const { container } = render(
      <BootSequence lines={customLines} charDelayMs={10} lineDelayMs={30} />
    );

    // Mount runs, then a single tick types one character of line 0.
    act(() => {
      vi.advanceTimersByTime(10);
    });

    const lines = container.querySelectorAll('div[role="log"] > div');
    expect(lines).toHaveLength(3);
    // Line 0 has at least the first char; lines 1 and 2 are still empty.
    expect(lines[0]?.textContent?.length ?? 0).toBeGreaterThan(0);
    expect(lines[1]?.textContent).toBe('');
    expect(lines[2]?.textContent).toBe('');
  });
});
