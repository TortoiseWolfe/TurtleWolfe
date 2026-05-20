import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, render } from '@testing-library/react';
import CursorHalo from './CursorHalo';

/**
 * Helper: configure `window.matchMedia` for this test.
 *
 * @param matches map of media query → matches boolean. Any unlisted query
 *   defaults to `false`.
 */
function mockMatchMedia(matches: Record<string, boolean>) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: matches[query] ?? false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('CursorHalo', () => {
  beforeEach(() => {
    // Default: neither reduced-motion nor coarse pointer.
    mockMatchMedia({});
  });

  it('renders a halo div once mounted on a fine-pointer, full-motion device', () => {
    const { container } = render(<CursorHalo />);
    const halo = container.querySelector('div');
    expect(halo).not.toBeNull();
    expect(halo).toHaveAttribute('aria-hidden', 'true');
  });

  it('returns null when the user prefers reduced motion', () => {
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': true });
    const { container } = render(<CursorHalo />);
    expect(container.querySelector('div')).toBeNull();
  });

  it('returns null on coarse pointers (touch devices)', () => {
    mockMatchMedia({ '(pointer: coarse)': true });
    const { container } = render(<CursorHalo />);
    expect(container.querySelector('div')).toBeNull();
  });

  it('updates its position when the pointer moves', () => {
    const { container } = render(<CursorHalo />);

    act(() => {
      window.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 250, clientY: 480 })
      );
    });

    const halo = container.querySelector('div') as HTMLDivElement;
    expect(halo).not.toBeNull();
    expect(halo.style.left).toBe('250px');
    expect(halo.style.top).toBe('480px');
  });

  it('applies the size prop to the rendered width/height', () => {
    const { container } = render(<CursorHalo size={120} />);
    const halo = container.querySelector('div') as HTMLDivElement;
    expect(halo.style.width).toBe('120px');
    expect(halo.style.height).toBe('120px');
  });

  it('applies the opacity prop', () => {
    const { container } = render(<CursorHalo opacity={0.42} />);
    const halo = container.querySelector('div') as HTMLDivElement;
    expect(halo.style.opacity).toBe('0.42');
  });

  it('uses the theme primary color via CSS variable', () => {
    const { container } = render(<CursorHalo />);
    const halo = container.querySelector('div') as HTMLDivElement;
    expect(halo.style.background).toContain('var(--color-primary)');
  });

  it('appends a passed className alongside the defaults', () => {
    const { container } = render(<CursorHalo className="opacity-50" />);
    const halo = container.querySelector('div') as HTMLDivElement;
    expect(halo.className).toContain('pointer-events-none');
    expect(halo.className).toContain('fixed');
    expect(halo.className).toContain('opacity-50');
  });

  it('removes the mousemove listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<CursorHalo />);
    unmount();
    const mousemoveCalls = removeSpy.mock.calls.filter(
      ([eventName]) => eventName === 'mousemove'
    );
    expect(mousemoveCalls.length).toBeGreaterThan(0);
  });
});
