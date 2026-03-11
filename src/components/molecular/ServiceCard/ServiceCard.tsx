import React from 'react';
import Link from 'next/link';

export interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

/**
 * ServiceCard — card displaying a service offering.
 *
 * @category molecular
 */
export default function ServiceCard({
  icon,
  title,
  description,
  features,
  ctaLabel = 'Learn More',
  ctaHref = '/contact',
  className = '',
}: ServiceCardProps) {
  return (
    <article
      className={`card bg-base-100 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg${className ? ` ${className}` : ''}`}
    >
      <div className="card-body">
        <div className="text-primary mb-2 text-3xl">{icon}</div>
        <h3 className="card-title text-lg">{title}</h3>
        <p className="text-base-content/70 text-sm">{description}</p>
        <ul className="mt-3 space-y-1">
          {features.map((f) => (
            <li
              key={f}
              className="text-base-content/80 flex items-start text-sm"
            >
              <span className="text-primary mr-2">&#10003;</span>
              {f}
            </li>
          ))}
        </ul>
        <div className="card-actions mt-4 justify-end">
          <Link
            href={ctaHref}
            className="btn btn-primary btn-sm min-h-11 min-w-11"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
