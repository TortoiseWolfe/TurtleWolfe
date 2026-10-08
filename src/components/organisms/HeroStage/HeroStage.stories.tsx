import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import HeroStage from './HeroStage';

const meta = {
  title: 'Components/Organisms/HeroStage',
  component: HeroStage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'First-viewport hero composer for the Nostromo CRT aesthetic (feature 047). Assembles the existing `LayeredTurtleWolfeLogo` brand mark with `ScanlineOverlay`, `GrainOverlay`, `CursorHalo`, `BootSequence`, `Marquee`, plus a status bar, italic-serif display name, designer-weighted tagline, credentials line, and two terminal-command CTAs. Layout flips between two-column (lg+) and single-column (mobile) per the signed-off wireframe `wireframes/06-nostromo-crt.svg`.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    credentials: { control: 'text' },
    className: { control: 'text' },
    headline: { control: 'object' },
    primaryCta: { control: 'object' },
    secondaryCta: { control: 'object' },
    manifestItems: { control: 'object' },
  },
} satisfies Meta<typeof HeroStage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default full hero — all defaults from the spec. */
export const Default: Story = { args: {} };

/** Demonstrates the `name` prop override. */
export const WithCustomName: Story = {
  args: { name: 'Test User' },
  parameters: {
    docs: {
      description: {
        story:
          'Replaces the default "Jonathan Pohlner" display with an arbitrary name. Confirms the serif typeface and color tokens hold for any string.',
      },
    },
  },
};

/** Forces the single-column mobile layout for visual review. */
export const MobileLayout: Story = {
  args: {},
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story:
          'Renders at a 375px mobile viewport so the single-column stack (status bar → boot sequence → name → tagline → body → brand mark → manifest → CTAs) is exercised. The desktop two-column grid is suppressed via the `lg:` breakpoint.',
      },
    },
  },
};

/**
 * Reduced-motion is an OS-level preference, not a story prop. To verify the
 * reduced-motion fallback (no boot-sequence typing, no scanline drift, no
 * manifest re-type, no cursor halo): open DevTools → Rendering → set
 * "Emulate CSS media feature prefers-reduced-motion" → "reduce". The static
 * composition must remain visually coherent per FR-009.
 */
export const ReducedMotion: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'To verify the reduced-motion fallback, toggle DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce". The boot sequence should render fully typed, the cursor halo should be absent, the manifest should not re-type, and the scanline drift should freeze — yet the composition must still read as designed-first per FR-009.',
      },
    },
  },
};

/** Custom manifest items pass-through to the embedded `<Marquee>`. */
export const CustomManifest: Story = {
  args: {
    manifestItems: ['VITE', 'PNPM', 'PLAYWRIGHT', 'STORYBOOK', 'PA11Y'],
  },
};

/** Custom CTAs — both internal, both with custom labels. */
export const InternalCtas: Story = {
  args: {
    primaryCta: { label: '> ./contact.sh', href: '/contact' },
    secondaryCta: { label: '> ./about.sh', href: '/about' },
  },
};
