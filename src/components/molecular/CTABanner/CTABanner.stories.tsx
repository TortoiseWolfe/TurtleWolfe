import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CTABanner from './CTABanner';

const meta: Meta<typeof CTABanner> = {
  title: 'Components/Molecular/CTABanner',
  component: CTABanner,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Reusable call-to-action banner section with primary and optional secondary CTA buttons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    headline: { control: 'text', description: 'Banner headline' },
    description: { control: 'text', description: 'Optional description text' },
    className: { control: 'text', description: 'Additional CSS classes' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    headline: 'Ready to get started?',
    description:
      'Let us build something great together. I am available for freelance projects and full-time opportunities.',
    primaryCTA: { label: 'Contact Me', href: '/contact' },
  },
};

export const WithSecondaryCTA: Story = {
  args: {
    headline: 'Interested in working together?',
    description: 'Check out my work or get in touch directly.',
    primaryCTA: { label: 'Get in Touch', href: '/contact' },
    secondaryCTA: { label: 'View Projects', href: '/projects' },
  },
};

export const WithExternalSecondaryCTA: Story = {
  args: {
    headline: 'Explore the Code',
    primaryCTA: { label: 'Live Demo', href: '/demo' },
    secondaryCTA: {
      label: 'View Source on GitHub',
      href: 'https://github.com/TurtleWolfe',
      external: true,
    },
  },
};

export const HeadlineOnly: Story = {
  args: {
    headline: 'Start your project today',
    primaryCTA: { label: 'Get Started', href: '/contact' },
  },
};

export const ThemeShowcase: Story = {
  args: {
    headline: 'CTA Banner',
    primaryCTA: { label: 'Primary', href: '#' },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <CTABanner
        headline="Default Style"
        description="Standard CTA banner with primary button."
        primaryCTA={{ label: 'Contact Me', href: '/contact' }}
      />
      <CTABanner
        headline="Dual CTA Style"
        description="Banner with both primary and secondary actions."
        primaryCTA={{ label: 'Get Started', href: '/contact' }}
        secondaryCTA={{
          label: 'View GitHub',
          href: 'https://github.com',
          external: true,
        }}
      />
    </div>
  ),
  parameters: { layout: 'fullscreen' },
};
