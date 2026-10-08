import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AsciiDiagram from './AsciiDiagram';

const ROUTE_MAP_ART = `  ●─────┐
  │     │     ●───┐
  │     └──●──┤   │
  ●─┐         │   ●
    └────●────┘
                  ◆ DEST`;

const SWATCH_GRID_ART = `▓▓▓▒▒▒░░░ ▓▓▓▒▒▒░░░ ▓▓▓▒▒▒░░░
▓▓▓▒▒▒░░░ ▓▓▓▒▒▒░░░ ▓▓▓▒▒▒░░░
▓▓▓▒▒▒░░░ ▓▓▓▒▒▒░░░ ▓▓▓▒▒▒░░░
▓▓▓▒▒▒░░░ ▓▓▓▒▒▒░░░ ▓▓▓▒▒▒░░░
▓▓▓▒▒▒░░░ ▓▓▓▒▒▒░░░ ▓▓▓▒▒▒░░░`;

const FLOORPLAN_ART = `  ┌─────────┬───────────┐
  │ KITCHEN │  LIVING   │
  │   12'   │    18'    │
  ├────┬────┴───────────┤
  │ WC │     BEDROOM    │
  └────┴────────────────┘`;

const meta = {
  title: 'Components/Atomic/AsciiDiagram',
  component: AsciiDiagram,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    art: { control: 'text' },
    description: { control: 'text' },
    className: { control: 'text' },
    tone: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'accent'],
    },
  },
} satisfies Meta<typeof AsciiDiagram>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RouteMap: Story = {
  args: {
    art: ROUTE_MAP_ART,
    description:
      'Route diagram for SpokeToWork: four origin nodes connect to one destination via bicycle paths.',
    tone: 'primary',
  },
};

export const SwatchGrid: Story = {
  args: {
    art: SWATCH_GRID_ART,
    description:
      'Component swatch grid for ScriptHammer: 32 DaisyUI theme palette samples.',
    tone: 'primary',
  },
};

export const Floorplan: Story = {
  args: {
    art: FLOORPLAN_ART,
    description:
      'Architectural floorplan for Revit Plugins: four-room layout demonstrating automated dimensioning.',
    tone: 'primary',
  },
};
