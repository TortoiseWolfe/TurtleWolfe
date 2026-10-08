import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import GrainOverlay from './GrainOverlay';

expect.extend(toHaveNoViolations);

describe('GrainOverlay accessibility', () => {
  it('has no a11y violations', async () => {
    const { container } = render(<GrainOverlay />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('omits the decorative overlay from the accessibility tree', () => {
    const { container } = render(<GrainOverlay />);
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not intercept pointer events from underlying content', () => {
    const { container } = render(<GrainOverlay />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('pointer-events-none');
  });
});
