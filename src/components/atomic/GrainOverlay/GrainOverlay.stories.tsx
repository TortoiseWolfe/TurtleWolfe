import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import GrainOverlay from './GrainOverlay';

const meta = {
  title: 'Components/Atomic/GrainOverlay',
  component: GrainOverlay,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    opacity: {
      control: { type: 'range', min: 0, max: 0.5, step: 0.01 },
    },
    baseFrequency: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.05 },
    },
    className: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '320px',
          background:
            'linear-gradient(135deg, var(--color-base-200), var(--color-base-300))',
          color: 'var(--color-base-content)',
          padding: '1.5rem',
          fontFamily: 'var(--font-mono, monospace)',
          overflow: 'hidden',
        }}
      >
        <p style={{ position: 'relative', zIndex: 1 }}>
          Underlying surface — the grain multiplies on top of this content.
        </p>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GrainOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const Subtle: Story = {
  args: { opacity: 0.03, baseFrequency: 0.5 },
};

export const Heavy: Story = {
  args: { opacity: 0.18, baseFrequency: 0.9 },
};

export const FineGrain: Story = {
  args: { opacity: 0.08, baseFrequency: 1.5 },
};
