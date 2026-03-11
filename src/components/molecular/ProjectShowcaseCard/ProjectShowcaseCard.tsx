import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { detectedConfig } from '@/config/project-detected';

export interface ProjectShowcaseCardProps {
  title: string;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
  stack: string[];
  href: string;
  hasDetailPage?: boolean;
  className?: string;
}

/**
 * ProjectShowcaseCard — large image-driven card for the project grid.
 *
 * When `hasDetailPage` is true, renders as a Next.js Link to an internal
 * case-study page. Otherwise, renders as an external anchor.
 *
 * @category molecular
 */
export default function ProjectShowcaseCard({
  title,
  description,
  image,
  stack,
  href,
  hasDetailPage = false,
  className = '',
}: ProjectShowcaseCardProps) {
  const cardContent = (
    <>
      {image ? (
        <figure className="relative aspect-video w-full overflow-hidden">
          <Image
            src={`${detectedConfig.basePath}${image.src}`}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </figure>
      ) : (
        <div className="bg-base-300 flex aspect-video w-full items-center justify-center">
          <span className="text-base-content/40 text-4xl font-bold">
            {title[0]}
          </span>
        </div>
      )}
      <div className="card-body p-4">
        <h3 className="card-title text-primary text-lg">{title}</h3>
        <p className="text-base-content/80 text-sm leading-relaxed">
          {description}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {stack.map((tech) => (
            <span key={tech} className="badge badge-ghost badge-sm">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </>
  );

  const cardClasses = `card bg-base-100 shadow-md group transition-all hover:-translate-y-1 hover:shadow-lg focus-within:ring-primary focus-within:ring-2 overflow-hidden${className ? ` ${className}` : ''}`;

  if (hasDetailPage) {
    return (
      <Link
        href={href}
        className={cardClasses}
        aria-label={`${title} case study`}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClasses}
      aria-label={`${title} project`}
    >
      {cardContent}
    </a>
  );
}
