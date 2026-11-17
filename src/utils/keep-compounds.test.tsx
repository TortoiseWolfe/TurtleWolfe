import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { keepCompounds } from './keep-compounds';

describe('keepCompounds', () => {
  it('returns text without a hyphen unchanged', () => {
    expect(keepCompounds('plain words')).toBe('plain words');
  });

  it('wraps a hyphenated compound in a no-wrap span', () => {
    const { container } = render(
      <p>{keepCompounds('accessible · offline-first · 36 themes')}</p>
    );
    const span = container.querySelector('span.whitespace-nowrap');
    expect(span?.textContent).toBe('offline-first');
    expect(container.textContent).toBe(
      'accessible · offline-first · 36 themes'
    );
  });

  it('keeps each compound in its own span and leaves the hyphen as a plain hyphen', () => {
    const { container } = render(
      <p>{keepCompounds('full-stack and Docker-first')}</p>
    );
    const spans = [...container.querySelectorAll('span.whitespace-nowrap')];
    expect(spans.map((s) => s.textContent)).toEqual([
      'full-stack',
      'Docker-first',
    ]);
  });

  it('does not treat a spaced dash as a compound', () => {
    expect(keepCompounds('one - two')).toBe('one - two');
  });
});
