import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CursorHalo from './CursorHalo';

const meta = {
  title: 'Components/Atomic/CursorHalo',
  component: CursorHalo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Phosphor-green pointer halo for the Nostromo CRT aesthetic. Disabled on coarse pointers and when prefers-reduced-motion is set. Color resolves from the active theme via `var(--color-primary)`.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'range', min: 32, max: 240, step: 4 } },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.02 } },
    className: { control: 'text' },
  },
} satisfies Meta<typeof CursorHalo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div
      style={{
        minHeight: '60vh',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--color-base-100)',
        color: 'var(--color-base-content)',
      }}
    >
      <p>Move your pointer across this panel to see the halo.</p>
      <CursorHalo {...args} />
    </div>
  ),
};

export const Large: Story = {
  args: { size: 160, opacity: 0.22 },
  render: (args) => (
    <div
      style={{
        minHeight: '60vh',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--color-base-100)',
        color: 'var(--color-base-content)',
      }}
    >
      <p>Larger halo (160px) with slightly higher opacity.</p>
      <CursorHalo {...args} />
    </div>
  ),
};

export const Subtle: Story = {
  args: { size: 64, opacity: 0.1 },
  render: (args) => (
    <div
      style={{
        minHeight: '60vh',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--color-base-100)',
        color: 'var(--color-base-content)',
      }}
    >
      <p>Subtle halo for less-busy panels.</p>
      <CursorHalo {...args} />
    </div>
  ),
};
