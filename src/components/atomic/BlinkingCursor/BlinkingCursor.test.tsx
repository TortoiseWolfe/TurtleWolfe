import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BlinkingCursor from './BlinkingCursor';

describe('BlinkingCursor', () => {
  it('renders the default block character', () => {
    render(<BlinkingCursor />);
    expect(screen.getByText('█')).toBeInTheDocument();
  });

  it('accepts a custom character', () => {
    render(<BlinkingCursor char="▮" />);
    expect(screen.getByText('▮')).toBeInTheDocument();
  });

  it('applies the cursor-blink class so the CSS animation engages', () => {
    const { container } = render(<BlinkingCursor />);
    const cursor = container.querySelector('span');
    expect(cursor?.className).toContain('cursor-blink');
  });

  it('is aria-hidden so screen readers ignore the decorative cursor', () => {
    const { container } = render(<BlinkingCursor />);
    expect(container.querySelector('span')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('appends a passed className alongside the defaults', () => {
    const { container } = render(<BlinkingCursor className="text-2xl" />);
    const cursor = container.querySelector('span');
    expect(cursor?.className).toContain('cursor-blink');
    expect(cursor?.className).toContain('text-2xl');
  });
});
