import React from 'react';

export interface TimelineEntry {
  yearRange: string;
  company: string;
  role: string;
  description: string;
  tech: string[];
}

export interface ExperienceTimelineProps {
  entries: TimelineEntry[];
  className?: string;
}

/**
 * ExperienceTimeline — vertical timeline for career history.
 * Uses DaisyUI timeline classes.
 *
 * @category molecular
 */
export default function ExperienceTimeline({
  entries,
  className = '',
}: ExperienceTimelineProps) {
  return (
    <ul
      className={`timeline timeline-vertical timeline-snap-icon${className ? ` ${className}` : ''}`}
    >
      {entries.map((entry, i) => (
        <li key={entry.company}>
          {i > 0 && <hr className="bg-primary" />}
          <div className="timeline-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="text-primary h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div
            className={`${i % 2 === 0 ? 'timeline-start md:text-end' : 'timeline-end'} mb-10`}
          >
            <time className="font-mono text-sm italic">{entry.yearRange}</time>
            <h3 className="text-primary text-lg font-bold">{entry.company}</h3>
            <p className="text-base-content/80 font-semibold">{entry.role}</p>
            <p className="text-base-content/70 mt-1 text-sm">
              {entry.description}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {entry.tech.map((t) => (
                <span key={t} className="badge badge-outline badge-sm">
                  {t}
                </span>
              ))}
            </div>
          </div>
          {i < entries.length - 1 && <hr className="bg-primary" />}
        </li>
      ))}
    </ul>
  );
}
