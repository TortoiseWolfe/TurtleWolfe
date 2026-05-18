import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ScanlineOverlay from './ScanlineOverlay';

const meta = {
  title: 'Components/Atomic/ScanlineOverlay',
  component: ScanlineOverlay,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text' },
    opacity: { control: { type: 'number', min: 0, max: 1, step: 0.01 } },
    static: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div
        className="bg-base-100 text-primary relative h-96 w-full overflow-hidden"
        data-theme="turtlewolfe-crt"
      >
        <Story />
        <div className="text-primary relative z-10 p-6 font-mono">
          MU/TH/UR 6000 :: PORT 3000 :: scanline preview
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof ScanlineOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const Static: Story = { args: { static: true } };

export const StrongOpacity: Story = { args: { opacity: 0.2 } };
