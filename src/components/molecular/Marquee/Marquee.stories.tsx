import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Marquee from './Marquee';

const meta: Meta<typeof Marquee> = {
  title: 'Components/Molecular/Marquee',
  component: Marquee,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Tech-stack manifest block for the Nostromo CRT hero. Renders a static `[✓] PACKAGE` list in mono; every ~12s a random line briefly re-types itself via the `.manifest-retype` CSS keyframe (the "alive terminal" signal). Despite the name, this is NOT a scrolling marquee — terminology preserved from earlier specs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object' },
    intervalMs: { control: { type: 'number', min: 500, step: 500 } },
    header: { control: 'text' },
    className: { control: 'text' },
  },
} satisfies Meta<typeof Marquee>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const FastInterval: Story = {
  args: { intervalMs: 2000 },
  parameters: {
    docs: {
      description: {
        story:
          'Cadence reduced to 2 seconds for visual inspection of the re-type animation. Production cadence is 12s.',
      },
    },
  },
};

export const CustomItems: Story = {
  args: {
    items: ['VITE', 'PNPM', 'PLAYWRIGHT', 'STORYBOOK'],
    intervalMs: 3000,
  },
};

export const CustomHeader: Story = {
  args: {
    header: '> DEPS.RESOLVE()',
  },
};

export const ShortList: Story = {
  args: {
    items: ['REACT', 'TYPESCRIPT', 'TAILWIND'],
    intervalMs: 4000,
  },
};
