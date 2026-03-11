import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CaseStudyLayout from './CaseStudyLayout';
import type { CaseStudyData } from './CaseStudyLayout';

const minimalProject: CaseStudyData = {
  title: 'Portfolio Template',
  tagline: 'A modern developer portfolio built with Next.js 15',
  problem:
    'Developers need a professional portfolio that showcases their work, but building one from scratch is time-consuming and often lacks polish.',
  solution:
    'TurtleWolfe provides a production-ready portfolio template with component library, Storybook documentation, and SpecKit workflow. Fork, customize, and deploy in under an hour.',
  techStack: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind 4', 'DaisyUI'],
};

const fullProject: CaseStudyData = {
  title: 'SpokeToWork',
  tagline: 'Job-hunting by bicycle with real-time route optimization',
  heroImage: {
    src: 'https://picsum.photos/1920/600',
    alt: 'SpokeToWork map interface showing optimized cycling routes',
  },
  problem:
    'Job seekers who rely on cycling need a way to plan efficient multi-stop routes to potential employers while managing application status and scheduling interviews.',
  solution:
    'SpokeToWork combines MapLibre GL for interactive mapping, TSP-based route optimization for multi-stop efficiency, and E2E encrypted messaging for secure communication with employers.',
  solutionImages: [
    {
      src: 'https://picsum.photos/600/400?random=1',
      alt: 'Route optimization interface',
      caption: 'Multi-stop route optimization with drag-and-drop reordering',
    },
    {
      src: 'https://picsum.photos/600/400?random=2',
      alt: 'Encrypted messaging interface',
      caption: 'End-to-end encrypted employer messaging',
    },
    {
      src: 'https://picsum.photos/600/400?random=3',
      alt: 'Application tracking dashboard',
      caption: 'Visual application status tracking',
    },
  ],
  techStack: [
    'Next.js',
    'React',
    'TypeScript',
    'MapLibre GL',
    'Supabase',
    'PostgreSQL',
    'Docker',
  ],
  liveUrl: 'https://spoketowork.com',
  sourceUrl: 'https://github.com/TurtleWolfe/SpokeToWork',
};

const meta: Meta<typeof CaseStudyLayout> = {
  title: 'Components/Templates/CaseStudyLayout',
  component: CaseStudyLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full-page template for project case studies. Includes hero image, problem/solution sections, tech stack, and CTAs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text', description: 'Additional CSS classes' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    project: minimalProject,
  },
};

export const WithHeroImage: Story = {
  args: {
    project: fullProject,
  },
};

export const WithoutSourceUrl: Story = {
  args: {
    project: {
      ...fullProject,
      sourceUrl: undefined,
    },
  },
};

export const WithoutLiveUrl: Story = {
  args: {
    project: {
      ...minimalProject,
      liveUrl: undefined,
    },
  },
};

export const WithSolutionImages: Story = {
  args: {
    project: {
      ...minimalProject,
      solutionImages: [
        {
          src: 'https://picsum.photos/600/400?random=4',
          alt: 'Dashboard screenshot',
          caption: 'Admin dashboard with analytics',
        },
        {
          src: 'https://picsum.photos/600/400?random=5',
          alt: 'Component library',
        },
      ],
    },
  },
};
