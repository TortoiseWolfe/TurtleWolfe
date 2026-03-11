import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ServiceCard from './ServiceCard';

const meta: Meta<typeof ServiceCard> = {
  title: 'Components/Molecular/ServiceCard',
  component: ServiceCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Card displaying a service offering with icon, features list, and CTA button.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Service name' },
    description: { control: 'text', description: 'Brief description' },
    features: { control: 'object', description: 'Array of feature strings' },
    ctaLabel: { control: 'text', description: 'CTA button label' },
    ctaHref: { control: 'text', description: 'CTA link destination' },
    className: { control: 'text', description: 'Additional CSS classes' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <span className="text-3xl">🚀</span>,
    title: 'Web Development',
    description:
      'Building modern, performant web applications with cutting-edge frameworks.',
    features: [
      'Next.js & React',
      'TypeScript strict mode',
      'Responsive & mobile-first',
      'PWA capable',
    ],
  },
};

export const WithCustomCTA: Story = {
  args: {
    icon: <span className="text-3xl">🎨</span>,
    title: 'UI/UX Design',
    description:
      'Creating intuitive, accessible interfaces that delight users.',
    features: [
      'Component libraries',
      'WCAG AAA compliance',
      'Design systems',
      'Prototyping',
    ],
    ctaLabel: 'See My Work',
    ctaHref: '/projects',
  },
};

export const DevOps: Story = {
  args: {
    icon: <span className="text-3xl">🐳</span>,
    title: 'DevOps & Infrastructure',
    description: 'Docker-first development with automated CI/CD pipelines.',
    features: [
      'Docker Compose workflows',
      'GitHub Actions CI/CD',
      'Cloud deployment',
      'Monitoring & alerts',
    ],
    ctaLabel: 'Discuss Infrastructure',
    ctaHref: '/contact',
  },
};

export const ThemeShowcase: Story = {
  args: {
    icon: <span className="text-3xl">🚀</span>,
    title: 'Service',
    description: 'Description',
    features: ['Feature'],
  },
  render: () => (
    <div className="grid max-w-4xl grid-cols-1 gap-4 p-4 md:grid-cols-3">
      <ServiceCard
        icon={<span className="text-3xl">🚀</span>}
        title="Web Dev"
        description="Modern web applications."
        features={['Next.js', 'TypeScript', 'Tailwind']}
      />
      <ServiceCard
        icon={<span className="text-3xl">🎨</span>}
        title="UI/UX"
        description="Accessible interfaces."
        features={['Design systems', 'WCAG AAA', 'Prototyping']}
        ctaLabel="See Work"
        ctaHref="/projects"
      />
      <ServiceCard
        icon={<span className="text-3xl">🐳</span>}
        title="DevOps"
        description="Automated pipelines."
        features={['Docker', 'CI/CD', 'Cloud']}
        ctaLabel="Discuss"
        ctaHref="/contact"
      />
    </div>
  ),
  parameters: { layout: 'padded' },
};
