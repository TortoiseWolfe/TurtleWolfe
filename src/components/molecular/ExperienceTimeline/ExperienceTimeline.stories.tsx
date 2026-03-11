import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ExperienceTimeline from './ExperienceTimeline';
import type { TimelineEntry } from './ExperienceTimeline';

const sampleEntries: TimelineEntry[] = [
  {
    yearRange: '2023 - Present',
    company: 'TurtleWolfe Studios',
    role: 'Lead Full-Stack Developer',
    description:
      'Designing and building production-grade PWA templates with Next.js 15, React 19, and Supabase.',
    tech: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Docker'],
  },
  {
    yearRange: '2021 - 2023',
    company: 'SpokeToWork',
    role: 'Co-Founder & Developer',
    description:
      'Built a job-hunting-by-bicycle PWA with MapLibre GL, route optimization, and E2E encrypted messaging.',
    tech: ['MapLibre', 'React', 'Node.js', 'PostgreSQL'],
  },
  {
    yearRange: '2019 - 2021',
    company: 'Freelance',
    role: 'Full-Stack Developer',
    description:
      'Delivered web applications for small businesses and startups, focusing on performance and accessibility.',
    tech: ['React', 'Express', 'MongoDB', 'AWS'],
  },
];

const meta: Meta<typeof ExperienceTimeline> = {
  title: 'Components/Molecular/ExperienceTimeline',
  component: ExperienceTimeline,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Vertical timeline for career history using DaisyUI timeline classes. Alternates entries left and right.',
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
    entries: sampleEntries,
  },
};

export const SingleEntry: Story = {
  args: {
    entries: [sampleEntries[0]],
  },
};

export const ManyEntries: Story = {
  args: {
    entries: [
      ...sampleEntries,
      {
        yearRange: '2017 - 2019',
        company: 'Tech Academy',
        role: 'Junior Developer',
        description: 'Started career building internal tools and dashboards.',
        tech: ['JavaScript', 'HTML', 'CSS', 'jQuery'],
      },
      {
        yearRange: '2015 - 2017',
        company: 'University Project Lab',
        role: 'Research Assistant',
        description:
          'Assisted with data visualization and web-based research tools.',
        tech: ['Python', 'D3.js', 'Flask'],
      },
    ],
  },
};

export const ThemeShowcase: Story = {
  args: {
    entries: sampleEntries,
  },
  render: (args) => (
    <div className="flex flex-col gap-6">
      <h3 className="text-base-content text-lg font-semibold">
        On base-200 surface
      </h3>
      <div className="bg-base-200 rounded-lg p-6">
        <ExperienceTimeline {...args} />
      </div>
      <h3 className="text-base-content text-lg font-semibold">
        On base-100 surface
      </h3>
      <div className="bg-base-100 rounded-lg p-6">
        <ExperienceTimeline {...args} />
      </div>
    </div>
  ),
  parameters: { layout: 'padded' },
};
