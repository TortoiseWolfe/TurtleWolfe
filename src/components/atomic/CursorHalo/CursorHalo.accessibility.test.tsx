import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import CursorHalo from './CursorHalo';

expect.extend(toHaveNoViolations);

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

describe('CursorHalo accessibility', () => {
  beforeEach(() => {
    mockMatchMedia({});
  });

  it('has no a11y violations when rendered', async () => {
    const { container } = render(<CursorHalo />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('is aria-hidden so the decorative halo is omitted from the a11y tree', () => {
    const { container } = render(<CursorHalo />);
    const halo = container.querySelector('div');
    expect(halo).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no a11y violations when disabled by reduced-motion (renders nothing)', async () => {
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': true });
    const { container } = render(<CursorHalo />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations when disabled by coarse pointer (renders nothing)', async () => {
    mockMatchMedia({ '(pointer: coarse)': true });
    const { container } = render(<CursorHalo />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
