import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BlinkingCursor from './BlinkingCursor';

const meta = {
  title: 'Components/Atomic/BlinkingCursor',
  component: BlinkingCursor,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    char: { control: 'text' },
    className: { control: 'text' },
  },
} satisfies Meta<typeof BlinkingCursor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const CaretBar: Story = { args: { char: '▮' } };

export const Large: Story = {
  args: { className: 'text-4xl' },
};
