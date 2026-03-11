import React from 'react';
import Link from 'next/link';

export interface CTABannerProps {
  headline: string;
  description?: string;
  primaryCTA: { label: string; href: string };
  secondaryCTA?: { label: string; href: string; external?: boolean };
  className?: string;
}

/**
 * CTABanner — reusable call-to-action section.
 *
 * @category molecular
 */
export default function CTABanner({
  headline,
  description,
  primaryCTA,
  secondaryCTA,
  className = '',
}: CTABannerProps) {
  return (
    <section
      aria-label="Call to action"
      className={`bg-primary/5 px-4 py-12 sm:px-6 sm:py-16 lg:px-8${className ? ` ${className}` : ''}`}
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-base-content mb-4 text-2xl font-bold sm:text-3xl">
          {headline}
        </h2>
        {description && (
          <p className="text-base-content/70 mb-8 text-lg">{description}</p>
        )}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={primaryCTA.href}
            className="btn btn-primary btn-lg min-h-11 min-w-11"
          >
            {primaryCTA.label}
          </Link>
          {secondaryCTA &&
            (secondaryCTA.external ? (
              <a
                href={secondaryCTA.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-lg min-h-11 min-w-11"
              >
                {secondaryCTA.label}
              </a>
            ) : (
              <Link
                href={secondaryCTA.href}
                className="btn btn-outline btn-lg min-h-11 min-w-11"
              >
                {secondaryCTA.label}
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
