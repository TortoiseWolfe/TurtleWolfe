import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ScrollReveal, { type ScrollRevealProps } from './ScrollReveal';

const meta = {
  title: 'Components/Molecular/ScrollReveal',
  component: ScrollReveal,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    stagger: { control: { type: 'number', min: 0, max: 500, step: 20 } },
    once: { control: 'boolean' },
    margin: { control: 'text' },
    as: { control: false },
  },
} satisfies Meta<typeof ScrollReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Single-child reveal — the most common use case. The whole block animates
 * in with the screen-wipe clip-path once it enters the viewport.
 */
export const SingleChild: Story = {
  args: { stagger: 80, once: true, margin: '-100px', children: null },
  render: (args: ScrollRevealProps) => (
    <div style={{ padding: '60vh 2rem' }}>
      <ScrollReveal {...args}>
        <div
          style={{
            padding: '4rem 2rem',
            border: '1px solid currentColor',
            fontFamily: 'monospace',
            fontSize: '1.25rem',
          }}
        >
          Scroll until this block enters the viewport. It will wipe in from left
          to right over 600ms.
        </div>
      </ScrollReveal>
      <div style={{ height: '60vh' }} />
    </div>
  ),
};

/**
 * Staggered grid — three cards reveal sequentially, ~80ms apart by default.
 * Tweak the `stagger` arg to see the spacing change.
 */
export const StaggeredGrid: Story = {
  args: { stagger: 80, once: true, margin: '-100px', children: null },
  render: (args: ScrollRevealProps) => (
    <div style={{ padding: '60vh 2rem' }}>
      <ScrollReveal {...args} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          style={{
            padding: '2rem',
            background: 'oklch(0.25 0.05 80)',
            color: 'oklch(0.95 0.05 80)',
            fontFamily: 'monospace',
          }}
        >
          Card 1
        </div>
        <div
          style={{
            padding: '2rem',
            background: 'oklch(0.35 0.05 140)',
            color: 'oklch(0.95 0.05 140)',
            fontFamily: 'monospace',
          }}
        >
          Card 2
        </div>
        <div
          style={{
            padding: '2rem',
            background: 'oklch(0.30 0.05 250)',
            color: 'oklch(0.95 0.05 250)',
            fontFamily: 'monospace',
          }}
        >
          Card 3
        </div>
      </ScrollReveal>
      <div style={{ height: '60vh' }} />
    </div>
  ),
};
