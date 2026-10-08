import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SiteAtmosphere from './SiteAtmosphere';

const meta = {
  title: 'Components/Atomic/SiteAtmosphere',
  component: SiteAtmosphere,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div
        className="bg-base-100 text-primary relative h-96 w-full overflow-hidden"
        data-theme="turtlewolfe-crt"
      >
        <Story />
        <div className="text-primary relative z-10 p-6 font-mono">
          MU/TH/UR 6000 :: PORT 3000 :: site atmosphere preview
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof SiteAtmosphere>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
