import Link from 'next/link';
import { LayeredTurtleWolfeLogo } from '@/components/atomic/SpinningLogo';
import { AnimatedLogo } from '@/components/atomic/AnimatedLogo';
import TemplateStats, {
  type TemplateStat,
  type TemplateDemo,
} from '@/components/molecular/TemplateStats';

// ── Portfolio landing — audience is potential employers and collaborators.
//     Visual hierarchy: spinning logo + animated name draw the eye,
//     social links, project showcase, and built-in demos below. ──

const STATS: readonly TemplateStat[] = [
  {
    value: '10+',
    label: 'Years Experience',
    detail: 'Web development & design',
    href: '/contact',
  },
  {
    value: '20+',
    label: 'Web Apps Built',
    detail: 'Small business & enterprise',
    href: '/blog',
  },
  {
    value: 'WCAG AA',
    label: 'Accessible',
    detail: 'Skip links · font scaling',
    href: '/accessibility',
  },
  {
    value: 'PWA',
    label: 'Offline-First',
    detail: 'Service worker · installable',
    href: '/docs',
  },
];

const DEMOS: readonly TemplateDemo[] = [
  { label: 'Blog', href: '/blog' },
  { label: 'Wireframes', href: '/wireframes' },
  { label: 'Contact', href: '/contact' },
  { label: 'Themes', href: '/themes' },
  { label: 'Status', href: '/status' },
  {
    label: 'Storybook',
    href: 'https://tortoisewolfe.github.io/TurtleWolfe/storybook/',
    external: true,
  },
];

const PROJECTS = [
  {
    name: 'SpokeToWork',
    desc: 'Job-hunting-by-bicycle PWA with route planning & encrypted messaging',
    href: 'https://SpokeToWork.com',
    stack: 'Next.js · MapLibre · Supabase',
    ariaLabel: 'SpokeToWork project',
  },
  {
    name: 'ScriptHammer',
    desc: 'Production Next.js template with 32 themes, PWA, and full testing',
    href: 'https://ScriptHammer.com',
    stack: 'Next.js · DaisyUI · Docker',
    ariaLabel: 'ScriptHammer project',
  },
  {
    name: 'KDG',
    desc: 'Full-stack interview project — C# API + React frontend + PostgreSQL',
    href: 'https://github.com/TortoiseWolfe/KDG',
    stack: 'ASP.NET Core · React · Docker',
    ariaLabel: 'KDG project',
  },
  {
    name: 'GrimGlow',
    desc: 'Multimedia IP design bible — comic, Three.js, and Unity',
    href: 'https://github.com/TortoiseWolfe/GrimGlow_planning',
    stack: 'Three.js · Unity · Design',
    ariaLabel: 'GrimGlow project',
  },
  {
    name: 'Template-Library',
    desc: 'WCAG AAA atomic component library with Storybook documentation',
    href: 'https://github.com/TortoiseWolfe/Template-Library',
    stack: 'Next.js 16 · Storybook 10',
    ariaLabel: 'Template-Library project',
  },
] as const;

const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/TortoiseWolfe',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/pohlner',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Twitch',
    href: 'https://twitch.tv/turtlewolfe',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@JonathanPohlner',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
] as const;

export default function Home() {
  return (
    <main className="bg-base-200 flex min-h-full flex-col">
      {/* Skip link — load-bearing a11y, do not remove (PRP-017 T036). */}
      <a
        href="#main-content"
        className="btn btn-sm btn-primary sr-only min-h-11 min-w-11 focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
      >
        Skip to main content
      </a>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        id="main-content"
        aria-labelledby="hero-heading"
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="h-48 w-48 sm:h-52 sm:w-52 md:h-56 md:w-56 lg:h-[350px] lg:w-[350px]">
              <LayeredTurtleWolfeLogo speed="slow" pauseOnHover />
            </div>
          </div>

          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 id="hero-heading" className="mb-2 sm:mb-4">
              <AnimatedLogo
                text="Jonathan Pohlner"
                className="!text-2xl font-bold sm:!text-3xl md:!text-5xl lg:!text-6xl"
                animationSpeed="normal"
              />
            </h1>

            <p className="text-primary mb-4 text-lg font-semibold sm:text-xl">
              Full Stack Developer
            </p>

            <p className="text-base-content/80 mb-6 max-w-2xl text-lg leading-relaxed sm:text-xl">
              10+ years building accessible web applications with React,
              TypeScript, and Next.js. 20+ years in graphic design. I build
              tools that help people get to work.
            </p>

            {/* Tech stack badges */}
            <div
              className="mb-6 flex flex-wrap justify-center gap-2 lg:justify-start"
              role="list"
              aria-label="Technology stack"
            >
              {[
                'React',
                'TypeScript',
                'Next.js',
                'Node.js',
                'C#',
                'Docker',
                'Supabase',
                'Tailwind',
              ].map((tech) => (
                <span
                  key={tech}
                  role="listitem"
                  className="badge badge-outline badge-sm sm:badge-md"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Social links */}
            <div className="mb-8 flex justify-center gap-3 lg:justify-start">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-circle min-h-11 min-w-11"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>

            <nav
              aria-label="Primary actions"
              className="flex flex-col items-center gap-4 lg:items-start"
            >
              <Link
                href="/contact"
                className="btn btn-primary btn-lg min-h-11 min-w-11"
              >
                Get in Touch
              </Link>
              <a
                href="https://github.com/TortoiseWolfe"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-hover text-base-content/70 hover:text-base-content inline-flex min-h-11 items-center gap-2 text-sm"
              >
                or explore my work on GitHub
                <span aria-hidden="true">&rarr;</span>
              </a>
            </nav>
          </div>
        </div>
      </section>

      {/* ── Stats + Demos ────────────────────────────────────────────── */}
      <TemplateStats stats={STATS} demos={DEMOS} />

      {/* ── Gradient transition */}
      <div
        aria-hidden="true"
        className="h-16 sm:h-24"
        style={{
          background:
            'linear-gradient(to bottom, var(--color-base-100), var(--color-base-200))',
        }}
      />

      {/* ── Featured Projects ────────────────────────────────────────── */}
      <section
        aria-label="Featured projects"
        className="px-4 pt-4 pb-12 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-base-content mb-8 text-center text-2xl font-bold sm:text-3xl">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 gap-4 min-[500px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {PROJECTS.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card bg-base-100 focus-within:ring-primary shadow-md transition-all focus-within:ring-2 hover:-translate-y-1 hover:shadow-lg"
                aria-label={p.ariaLabel}
              >
                <div className="card-body p-4">
                  <h3 className="card-title text-primary text-base">
                    {p.name}
                  </h3>
                  <p className="text-base-content/85 text-xs">{p.desc}</p>
                  <div className="mt-2">
                    <span className="badge badge-ghost badge-xs">
                      {p.stack}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
