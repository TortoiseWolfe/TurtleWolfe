import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import SiteAtmosphere from './SiteAtmosphere';

expect.extend(toHaveNoViolations);

describe('SiteAtmosphere accessibility', () => {
  it('has no a11y violations', async () => {
    const { container } = render(<SiteAtmosphere />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('omits the decorative atmosphere from the accessibility tree', () => {
    const { container } = render(<SiteAtmosphere />);
    expect(container.querySelector('.crt-atmosphere')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('exposes no focusable or interactive elements', () => {
    const { container } = render(<SiteAtmosphere />);
    expect(
      container.querySelectorAll('a, button, input, [tabindex]')
    ).toHaveLength(0);
  });
});
