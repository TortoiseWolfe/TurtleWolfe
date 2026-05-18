import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import Marquee, { DEFAULT_MANIFEST_ITEMS } from './Marquee';

const reducedMotionMock = vi.hoisted(() => ({ value: false }));

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => reducedMotionMock.value,
}));

describe('Marquee (manifest block)', () => {
  beforeEach(() => {
    reducedMotionMock.value = false;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders all 12 default manifest items on mount', () => {
    render(<Marquee />);
    DEFAULT_MANIFEST_ITEMS.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('renders custom items when the items prop is provided', () => {
    render(<Marquee items={['ALPHA', 'BETA', 'GAMMA']} />);
    expect(screen.getByText('ALPHA')).toBeInTheDocument();
    expect(screen.getByText('BETA')).toBeInTheDocument();
    expect(screen.getByText('GAMMA')).toBeInTheDocument();
  });

  it('renders the header text', () => {
    render(<Marquee />);
    expect(screen.getByText('> MANIFEST.LOAD()')).toBeInTheDocument();
  });

  it('accepts a custom header', () => {
    render(<Marquee header="> CUSTOM.HEADER()" />);
    expect(screen.getByText('> CUSTOM.HEADER()')).toBeInTheDocument();
  });

  it('renders a [✓] checkmark for every item', () => {
    render(<Marquee items={['ONE', 'TWO', 'THREE']} />);
    expect(screen.getAllByText('[✓]')).toHaveLength(3);
  });

  it('triggers the .manifest-retype class on exactly one item after the interval', () => {
    // Force the random pick to index 3 so we can assert deterministically.
    vi.spyOn(Math, 'random').mockReturnValue(3 / DEFAULT_MANIFEST_ITEMS.length);

    const { container } = render(<Marquee />);

    expect(container.querySelectorAll('.manifest-retype')).toHaveLength(0);

    act(() => {
      vi.advanceTimersByTime(12000);
    });

    const retyping = container.querySelectorAll('.manifest-retype');
    expect(retyping).toHaveLength(1);
  });

  it('clears the .manifest-retype class 600ms after the animation fires', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const { container } = render(<Marquee />);

    act(() => {
      vi.advanceTimersByTime(12000);
    });
    expect(container.querySelectorAll('.manifest-retype')).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(container.querySelectorAll('.manifest-retype')).toHaveLength(0);
  });

  it('honors a custom intervalMs', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const { container } = render(<Marquee intervalMs={5000} />);

    act(() => {
      vi.advanceTimersByTime(4999);
    });
    expect(container.querySelectorAll('.manifest-retype')).toHaveLength(0);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(container.querySelectorAll('.manifest-retype')).toHaveLength(1);
  });

  it('NEVER installs setInterval when prefers-reduced-motion is set', () => {
    reducedMotionMock.value = true;
    const intervalSpy = vi.spyOn(global, 'setInterval');

    render(<Marquee />);

    expect(intervalSpy).not.toHaveBeenCalled();
  });

  it('renders all items statically and visible under reduced motion', () => {
    reducedMotionMock.value = true;

    const { container } = render(<Marquee />);

    DEFAULT_MANIFEST_ITEMS.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
    expect(container.querySelectorAll('.manifest-retype')).toHaveLength(0);

    // Even if a timer somehow advanced, nothing should fire.
    act(() => {
      vi.advanceTimersByTime(60000);
    });
    expect(container.querySelectorAll('.manifest-retype')).toHaveLength(0);
  });

  it('appends a passed className alongside the defaults', () => {
    render(<Marquee className="text-lg" />);
    const block = screen.getByTestId('manifest-block');
    expect(block.className).toContain('font-mono');
    expect(block.className).toContain('text-lg');
  });

  it('handles an empty items array without errors', () => {
    expect(() => render(<Marquee items={[]} />)).not.toThrow();
    expect(screen.getByText('> MANIFEST.LOAD()')).toBeInTheDocument();
  });
});
