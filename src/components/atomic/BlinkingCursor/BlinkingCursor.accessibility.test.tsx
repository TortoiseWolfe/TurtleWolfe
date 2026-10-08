import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import BlinkingCursor from './BlinkingCursor';

expect.extend(toHaveNoViolations);

describe('BlinkingCursor accessibility', () => {
  it('has no a11y violations', async () => {
    const { container } = render(<BlinkingCursor />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('omits the decorative cursor from the accessibility tree', () => {
    const { container } = render(<BlinkingCursor char="▮" />);
    const cursor = container.querySelector('span');
    expect(cursor).toHaveAttribute('aria-hidden', 'true');
  });
});
