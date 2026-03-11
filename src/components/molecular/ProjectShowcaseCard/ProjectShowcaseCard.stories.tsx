import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ProjectShowcaseCard from './ProjectShowcaseCard';

const meta: Meta<typeof ProjectShowcaseCard> = {
  title: 'Components/Molecular/ProjectShowcaseCard',
  component: ProjectShowcaseCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Large image-driven card for the project showcase grid. Links to external sites or internal case-study pages.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Project name' },
    description: { control: 'text', description: 'Short project description' },
    stack: { control: 'object', description: 'Array of technology names' },
    href: { control: 'text', description: 'Link URL' },
    hasDetailPage: {
      control: 'boolean',
      description: 'Render as internal Link (case study) vs. external anchor',
    },
    className: { control: 'text', description: 'Additional CSS classes' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'SpokeToWork',
    description:
      'Job-hunting-by-bicycle PWA with MapLibre GL, route optimization, and E2E encrypted messaging.',
    stack: ['Next.js', 'TypeScript', 'MapLibre', 'Supabase'],
    href: 'https://spoketowork.com',
  },
};

export const WithImage: Story = {
  args: {
    title: 'ScriptHammer',
    description:
      'Modern PWA template with component library, Storybook, and SpecKit workflow.',
    stack: ['Next.js 15', 'React 19', 'Tailwind 4', 'DaisyUI'],
    href: 'https://scripthammer.dev',
    image: {
      src: 'https://picsum.photos/800/450',
      alt: 'ScriptHammer dashboard screenshot',
    },
  },
};

export const WithDetailPage: Story = {
  args: {
    title: 'KDG Interview Project',
    description:
      'Full-stack C# ASP.NET Core 8 + React 19/Vite + PostgreSQL 16 application.',
    stack: ['C#', 'ASP.NET Core', 'React', 'PostgreSQL', 'Docker'],
    href: '/projects/kdg',
    hasDetailPage: true,
  },
};

export const MinimalStack: Story = {
  args: {
    title: 'Portfolio Site',
    description: 'A simple portfolio site built with static export.',
    stack: ['Next.js'],
    href: 'https://example.com',
  },
};

export const ThemeShowcase: Story = {
  args: {
    title: 'Project',
    description: 'Description',
    stack: ['React'],
    href: '#',
  },
  render: () => (
    <div className="grid max-w-3xl grid-cols-1 gap-4 p-4 md:grid-cols-2">
      <ProjectShowcaseCard
        title="SpokeToWork"
        description="Job-hunting-by-bicycle PWA with route optimization."
        stack={['Next.js', 'MapLibre', 'Supabase']}
        href="https://spoketowork.com"
      />
      <ProjectShowcaseCard
        title="ScriptHammer"
        description="Modern PWA template with Storybook and SpecKit."
        stack={['Next.js 15', 'React 19', 'DaisyUI']}
        href="/projects/scripthammer"
        hasDetailPage
        image={{
          src: 'https://picsum.photos/800/450',
          alt: 'ScriptHammer screenshot',
        }}
      />
    </div>
  ),
  parameters: { layout: 'padded' },
};
