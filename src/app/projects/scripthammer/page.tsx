import type { Metadata } from 'next';
import CaseStudyLayout from '@/components/templates/CaseStudyLayout';
import type { CaseStudyData } from '@/components/templates/CaseStudyLayout';

export const metadata: Metadata = {
  title: 'ScriptHammer | Jonathan Pohlner',
  description:
    'Case study: Production-ready Next.js template with 32 themes, Docker, Storybook, and full CI/CD.',
};

const project: CaseStudyData = {
  title: 'ScriptHammer',
  tagline:
    'Production-ready Next.js template — 32 themes, Docker-first, full CI/CD pipeline',
  heroImage: {
    src: '/portfolio/scripthammer/hero.png',
    alt: 'ScriptHammer template showing the component library and theme switcher',
  },
  problem:
    'Starting a new Next.js project means spending weeks on boilerplate: authentication, theming, component libraries, Docker configuration, CI/CD pipelines, accessibility compliance, and PWA support. Most templates cover one or two of these — none cover all of them in a production-ready package.',
  solution:
    'ScriptHammer is a comprehensive Next.js 15 template that ships with 32 DaisyUI themes, a Docker-first development workflow, Storybook component library, full GitHub Actions CI/CD, WCAG AA accessibility, PWA offline support, and an admin dashboard — all tested with Vitest, Playwright, and Pa11y.',
  solutionImages: [
    {
      src: '/portfolio/scripthammer/admin-overview.png',
      alt: 'Admin dashboard with user management and analytics',
      caption: 'Built-in admin dashboard',
    },
    {
      src: '/portfolio/scripthammer/mobile.png',
      alt: 'Mobile responsive view of ScriptHammer',
      caption: 'Mobile-first responsive design',
    },
  ],
  techStack: [
    'Next.js 15',
    'React 19',
    'TypeScript',
    'Tailwind CSS 4',
    'DaisyUI',
    'Docker',
    'Storybook',
    'Vitest',
    'Playwright',
    'GitHub Actions',
    'PWA',
  ],
  liveUrl: 'https://ScriptHammer.com',
  sourceUrl: 'https://github.com/TortoiseWolfe/ScriptHammer',
};

export default function ScriptHammerPage() {
  return <CaseStudyLayout project={project} />;
}
