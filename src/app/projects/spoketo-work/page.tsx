import type { Metadata } from 'next';
import CaseStudyLayout from '@/components/templates/CaseStudyLayout';
import type { CaseStudyData } from '@/components/templates/CaseStudyLayout';

export const metadata: Metadata = {
  title: 'SpokeToWork | Jonathan Pohlner',
  description:
    'Case study: Job-hunting-by-bicycle PWA with route planning and encrypted messaging.',
};

const project: CaseStudyData = {
  title: 'SpokeToWork',
  tagline:
    'Job-hunting by bicycle — route planning, company tracking, and encrypted messaging',
  heroImage: {
    src: '/portfolio/spoketo-work/hero.png',
    alt: 'SpokeToWork desktop view showing the map interface with cycling routes',
  },
  problem:
    'Job seekers who commute by bicycle need to plan efficient routes between potential employers, track their applications, and communicate securely. Existing job platforms ignore the logistics of physically visiting companies, and none offer route optimization for cyclists.',
  solution:
    'SpokeToWork is a Progressive Web App built with Next.js and MapLibre GL that lets users plot companies on an interactive map, generate optimized cycling routes between them, manage job applications, and exchange end-to-end encrypted messages using ECDH shared-secret cryptography — all while working offline.',
  solutionImages: [
    {
      src: '/portfolio/spoketo-work/map-view.png',
      alt: 'Interactive map with company markers and cycling routes',
      caption: 'MapLibre GL map with route optimization',
    },
    {
      src: '/portfolio/spoketo-work/companies.png',
      alt: 'Company management list with application status',
      caption: 'Company tracking and application management',
    },
    {
      src: '/portfolio/spoketo-work/route-sidebar.png',
      alt: 'Route planning sidebar with distance and time estimates',
      caption: 'Cycling route planning sidebar',
    },
  ],
  techStack: [
    'Next.js',
    'React 19',
    'TypeScript',
    'MapLibre GL',
    'Supabase',
    'ECDH Encryption',
    'PWA',
    'Docker',
    'Tailwind CSS',
    'DaisyUI',
  ],
  liveUrl: 'https://SpokeToWork.com',
  sourceUrl: 'https://github.com/TortoiseWolfe/SpokeToWork',
};

export default function SpokeToWorkPage() {
  return <CaseStudyLayout project={project} />;
}
