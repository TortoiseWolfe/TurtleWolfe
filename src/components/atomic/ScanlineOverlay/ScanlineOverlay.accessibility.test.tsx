import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import ScanlineOverlay from './ScanlineOverlay';

expect.extend(toHaveNoViolations);

describe('ScanlineOverlay accessibility', () => {
  it('has no a11y violations', async () => {
    const { container } = render(<ScanlineOverlay />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('omits the decorative overlay from the accessibility tree', () => {
    const { container } = render(<ScanlineOverlay />);
    expect(container.querySelector('div')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('remains aria-hidden when rendered static', () => {
    const { container } = render(<ScanlineOverlay static />);
    expect(container.querySelector('div')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });
});
