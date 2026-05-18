import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import HeroStage from './HeroStage';

expect.extend(toHaveNoViolations);

describe('HeroStage accessibility', () => {
  it('has no a11y violations with default props', async () => {
    const { container } = render(<HeroStage />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations with a custom name', async () => {
    const { container } = render(<HeroStage name="Ada Lovelace" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('exposes the section with id="main-content" for the skip link target', () => {
    const { container } = render(<HeroStage />);
    const section = container.querySelector('section#main-content');
    expect(section).not.toBeNull();
  });

  it('uses aria-hidden on the decorative ASCII brand frame', () => {
    const { container } = render(<HeroStage />);
    const pre = container.querySelector('pre');
    expect(pre).not.toBeNull();
    expect(pre).toHaveAttribute('aria-hidden', 'true');
  });
});
