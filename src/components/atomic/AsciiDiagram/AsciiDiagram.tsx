import React from 'react';

export type AsciiDiagramTone = 'primary' | 'secondary' | 'accent';

export interface AsciiDiagramProps {
  /** The ASCII art body. Whitespace and newlines are preserved by the `<pre>`. */
  art: string;
  /** Prose description rendered into a visually hidden `<figcaption>` for screen readers. */
  description: string;
  /** Extra classes applied to the outer `<figure>`. */
  className?: string;
  /** Theme token that tints the ASCII glyphs. Defaults to `primary`. */
  tone?: AsciiDiagramTone;
}

const TONE_CLASS: Record<AsciiDiagramTone, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
};

/**
 * Renders ASCII box-drawing / block / dot art inside a `<figure>` with a
 * screen-reader-only prose `<figcaption>`. The `<pre>` is `aria-hidden`
 * because box-drawing glyphs are non-text content — assistive tech would
 * otherwise announce each character one-by-one. The `<figcaption>` carries
 * the semantic equivalent so screen-reader users get the diagram's meaning
 * in one accessible sentence.
 *
 * The glyphs inherit `font-family: var(--font-mono)` from globals.css (the
 * body alias) and are tinted via the `text-primary` / `text-secondary` /
 * `text-accent` utilities so the diagram recolors with the active theme —
 * no hardcoded colors anywhere.
 *
 * @see features/enhancements/047-portfolio-visual-overhaul/research.md §R7
 */
export default function AsciiDiagram({
  art,
  description,
  className = '',
  tone = 'primary',
}: AsciiDiagramProps) {
  return (
    <figure className={`ascii-diagram${className ? ` ${className}` : ''}`}>
      <pre
        aria-hidden="true"
        className={`m-0 font-mono leading-tight whitespace-pre ${TONE_CLASS[tone]}`}
      >
        {art}
      </pre>
      <figcaption className="sr-only">{description}</figcaption>
    </figure>
  );
}
