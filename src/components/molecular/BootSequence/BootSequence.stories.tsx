import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BootSequence from './BootSequence';

const meta = {
  title: 'Components/Molecular/BootSequence',
  component: BootSequence,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text' },
    charDelayMs: { control: { type: 'number', min: 1, max: 200, step: 1 } },
    lineDelayMs: { control: { type: 'number', min: 0, max: 1000, step: 10 } },
  },
} satisfies Meta<typeof BootSequence>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default 5-line MU/TH/UR 6000 boot sequence at spec timing (~10ms/char, ~30ms/line). */
export const Default: Story = { args: {} };

/** Slower playback so the typing is easier to inspect in the Storybook viewport. */
export const Slow: Story = { args: { charDelayMs: 60, lineDelayMs: 200 } };

/** Custom shorter sequence for snapshot tests and design iteration. */
export const CustomLines: Story = {
  args: {
    lines: ['> connecting...', '> handshake ok.', '> ready.', '>'],
  },
};

/** Larger font scale to preview the cursor + typing at hero size. */
export const Large: Story = { args: { className: 'text-2xl' } };
