import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CTABanner from '@/components/molecular/CTABanner';

export interface CaseStudyImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface CaseStudyData {
  title: string;
  tagline: string;
  heroImage?: CaseStudyImage;
  problem: string;
  solution: string;
  solutionImages?: CaseStudyImage[];
  techStack: string[];
  liveUrl?: string;
  sourceUrl?: string;
}

export interface CaseStudyLayoutProps {
  project: CaseStudyData;
  className?: string;
}

/**
 * CaseStudyLayout — full-page template for project case studies.
 *
 * @category templates
 */
export default function CaseStudyLayout({
  project,
  className = '',
}: CaseStudyLayoutProps) {
  return (
    <main
      className={`bg-base-200 min-h-screen${className ? ` ${className}` : ''}`}
    >
      {/* Hero */}
      {project.heroImage && (
        <div className="relative h-64 w-full sm:h-80 md:h-96 lg:h-[28rem]">
          <Image
            src={project.heroImage.src}
            alt={project.heroImage.alt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute right-0 bottom-0 left-0 p-6 sm:p-8 lg:p-12">
            <div className="mx-auto max-w-6xl">
              <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                {project.title}
              </h1>
              <p className="text-lg text-white/80 sm:text-xl">
                {project.tagline}
              </p>
            </div>
          </div>
        </div>
      )}

      {!project.heroImage && (
        <section className="px-4 pt-12 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/#projects"
              className="link link-hover text-base-content/60 mb-4 inline-flex items-center text-sm"
            >
              &larr; Back to projects
            </Link>
            <h1 className="text-base-content mb-2 text-3xl font-bold sm:text-4xl md:text-5xl">
              {project.title}
            </h1>
            <p className="text-base-content/70 text-lg sm:text-xl">
              {project.tagline}
            </p>
          </div>
        </section>
      )}

      {/* Back link (when hero image exists) */}
      {project.heroImage && (
        <div className="px-4 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/#projects"
              className="link link-hover text-base-content/60 inline-flex items-center text-sm"
            >
              &larr; Back to projects
            </Link>
          </div>
        </div>
      )}

      {/* Problem */}
      <section className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-primary mb-4 text-sm font-semibold tracking-wider uppercase">
            The Problem
          </h2>
          <p className="text-base-content/80 max-w-3xl text-lg leading-relaxed">
            {project.problem}
          </p>
        </div>
      </section>

      {/* Solution */}
      <section className="bg-base-100 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-primary mb-4 text-sm font-semibold tracking-wider uppercase">
            The Solution
          </h2>
          <p className="text-base-content/80 mb-8 max-w-3xl text-lg leading-relaxed">
            {project.solution}
          </p>

          {/* Solution screenshots */}
          {project.solutionImages && project.solutionImages.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {project.solutionImages.map((img) => (
                <figure
                  key={img.src}
                  className="overflow-hidden rounded-lg shadow-md"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={600}
                    height={400}
                    className="h-auto w-full object-cover"
                  />
                  {img.caption && (
                    <figcaption className="bg-base-200 text-base-content/70 p-3 text-center text-sm">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-primary mb-4 text-sm font-semibold tracking-wider uppercase">
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-3">
            {project.techStack.map((tech) => (
              <span key={tech} className="badge badge-lg badge-outline">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTAs */}
      <CTABanner
        headline={`Explore ${project.title}`}
        primaryCTA={
          project.liveUrl
            ? { label: 'Visit Live Site', href: project.liveUrl }
            : { label: 'Get in Touch', href: '/contact' }
        }
        secondaryCTA={
          project.sourceUrl
            ? {
                label: 'View Source Code',
                href: project.sourceUrl,
                external: true,
              }
            : undefined
        }
      />
    </main>
  );
}
