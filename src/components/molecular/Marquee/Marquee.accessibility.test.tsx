import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Marquee from './Marquee';

expect.extend(toHaveNoViolations);

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Marquee accessibility', () => {
  it('has no a11y violations with the default 12-item manifest', async () => {
    const { container } = render(<Marquee />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations with a custom item list', async () => {
    const { container } = render(
      <Marquee items={['ALPHA', 'BETA', 'GAMMA']} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('exposes manifest items to assistive tech (no aria-hidden on the list)', () => {
    const { container } = render(<Marquee items={['REACT', 'NEXT']} />);
    const list = container.querySelector('ul');
    expect(list).not.toHaveAttribute('aria-hidden');
    container.querySelectorAll('li').forEach((li) => {
      expect(li).not.toHaveAttribute('aria-hidden');
    });
  });

  it('marks the decorative header as aria-hidden', () => {
    const { getByTestId } = render(<Marquee />);
    expect(getByTestId('manifest-header')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('marks the decorative [✓] glyphs as aria-hidden', () => {
    const { container } = render(<Marquee items={['REACT']} />);
    const checkmarkSpans = Array.from(
      container.querySelectorAll('span')
    ).filter((s) => s.textContent === '[✓]');
    expect(checkmarkSpans.length).toBeGreaterThan(0);
    checkmarkSpans.forEach((span) => {
      expect(span).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
