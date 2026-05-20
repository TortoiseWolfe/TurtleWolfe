'use client';

import React, { useRef } from 'react';
import { useInView } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface ScrollRevealProps {
  /** Elements to reveal once the wrapper enters the viewport. */
  children: React.ReactNode;
  /** Extra classes applied to the wrapper. */
  className?: string;
  /** Milliseconds between successive child reveals. Defaults to `80`. */
  stagger?: number;
  /** Wrapper element. Defaults to `'div'`. */
  as?: React.ElementType;
  /** Reveal only on first viewport entry. Defaults to `true`. */
  once?: boolean;
  /** Root margin passed to `useInView`; negative values pull the trigger
   * earlier. Defaults to `'-100px'`. */
  margin?: string;
}

/**
 * Wraps content in a "screen wipe" clip-path reveal triggered when the wrapper
 * enters the viewport. Each direct child receives the `.screen-wipe` class
 * (keyframe defined in `globals.css`) plus a staggered `animationDelay` so the
 * children pour in one after another.
 *
 * Honours `prefers-reduced-motion`: when set, children render in place without
 * any animation class — both this JS gate and the global CSS gate in
 * `globals.css` cooperate to keep motion fully suppressed.
 *
 * Structural-only: no roles, labels, or visual styling of its own. Drop it
 * around any content that should fade in on scroll.
 *
 * @see features/enhancements/047-portfolio-visual-overhaul/spec.md §FR-005
 * @see features/enhancements/047-portfolio-visual-overhaul/research.md §R6
 */
export default function ScrollReveal({
  children,
  className = '',
  stagger = 80,
  as: Wrapper = 'div',
  once = true,
  margin = '-100px',
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  // `motion/react`'s `useInView` types `margin` as a `MarginType` template
  // literal; the cast keeps the prop ergonomically typed as `string` for
  // consumers while still satisfying the library at the call site.
  const inView = useInView(ref, {
    once,
    margin: margin as Parameters<typeof useInView>[1] extends infer O
      ? O extends { margin?: infer M }
        ? M
        : never
      : never,
  });
  const reduced = useReducedMotion();

  const animate = inView && !reduced;

  const decoratedChildren = React.Children.map(children, (child, i) => {
    if (!React.isValidElement(child)) return child;

    const childProps = child.props as {
      className?: string;
      style?: React.CSSProperties;
    };

    const nextClassName = animate
      ? `${childProps.className ?? ''} screen-wipe`.trim()
      : childProps.className;

    const nextStyle: React.CSSProperties = {
      ...(childProps.style ?? {}),
      ...(animate ? { animationDelay: `${i * stagger}ms` } : {}),
    };

    return React.cloneElement(child, {
      className: nextClassName,
      style: nextStyle,
    } as Partial<unknown>);
  });

  return (
    <Wrapper ref={ref} className={className || undefined}>
      {decoratedChildren}
    </Wrapper>
  );
}
