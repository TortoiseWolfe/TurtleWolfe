import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import GrainOverlay from './GrainOverlay';

describe('GrainOverlay', () => {
  it('renders an SVG containing a feTurbulence filter and a filtered rect', () => {
    const { container } = render(<GrainOverlay />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();

    const turbulence = container.querySelector('feTurbulence');
    expect(turbulence).not.toBeNull();
    expect(turbulence?.getAttribute('type')).toBe('fractalNoise');

    const filter = container.querySelector('filter');
    const rect = container.querySelector('rect');
    expect(filter).not.toBeNull();
    expect(rect).not.toBeNull();
    expect(rect?.getAttribute('filter')).toBe(`url(#${filter?.id})`);
  });

  it('generates a unique filter id per instance to avoid SVG id collisions', () => {
    const { container } = render(
      <>
        <GrainOverlay />
        <GrainOverlay />
      </>
    );
    const filters = container.querySelectorAll('filter');
    expect(filters.length).toBe(2);
    expect(filters[0].id).not.toBe('');
    expect(filters[0].id).not.toBe(filters[1].id);
  });

  it('is aria-hidden so screen readers ignore the decorative grain', () => {
    const { container } = render(<GrainOverlay />);
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });

  it('uses the default opacity (0.06) and multiply blend mode', () => {
    const { container } = render(<GrainOverlay />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.opacity).toBe('0.06');
    expect(wrapper.style.mixBlendMode).toBe('multiply');
  });

  it('uses the default baseFrequency (0.65) on feTurbulence', () => {
    const { container } = render(<GrainOverlay />);
    const turbulence = container.querySelector('feTurbulence');
    expect(turbulence?.getAttribute('baseFrequency')).toBe('0.65');
  });

  it('respects custom opacity and baseFrequency props', () => {
    const { container } = render(
      <GrainOverlay opacity={0.12} baseFrequency={0.9} />
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.opacity).toBe('0.12');
    const turbulence = container.querySelector('feTurbulence');
    expect(turbulence?.getAttribute('baseFrequency')).toBe('0.9');
  });

  it('positions absolutely with pointer-events disabled', () => {
    const { container } = render(<GrainOverlay />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('absolute');
    expect(wrapper.className).toContain('inset-0');
    expect(wrapper.className).toContain('pointer-events-none');
  });

  it('appends a passed className alongside the defaults', () => {
    const { container } = render(<GrainOverlay className="z-10" />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('absolute');
    expect(wrapper.className).toContain('z-10');
  });

  it('does not apply any drift / scanline / motion animation class', () => {
    const { container } = render(<GrainOverlay />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).not.toMatch(/scanline-drift|animate-|motion-/);
  });
});
