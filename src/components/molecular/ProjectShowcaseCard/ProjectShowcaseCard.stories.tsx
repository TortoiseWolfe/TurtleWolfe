import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ProjectShowcaseCard from './ProjectShowcaseCard';

// ASCII art payloads mirror the AsciiDiagram stories — same source-of-truth
// shapes used in the Nostromo CRT wireframe (06-nostromo-crt.svg) and in
// `src/components/atomic/AsciiDiagram/AsciiDiagram.stories.tsx`.
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

const meta: Meta<typeof ProjectShowcaseCard> = {
  title: 'Components/Molecular/ProjectShowcaseCard',
  component: ProjectShowcaseCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Large image-driven card for the project showcase grid. Links to external sites or internal case-study pages. Two visual variants: `default` (DaisyUI card) and `crt` (Nostromo CRT — feature 047).',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Project name' },
    description: { control: 'text', description: 'Short project description' },
    stack: { control: 'object', description: 'Array of technology names' },
    href: { control: 'text', description: 'Link URL' },
    hasDetailPage: {
      control: 'boolean',
      description: 'Render as internal Link (case study) vs. external anchor',
    },
    variant: {
      control: 'inline-radio',
      options: ['default', 'crt'],
      description: 'Visual variant — default DaisyUI or Nostromo CRT (047)',
    },
    asciiArt: {
      control: 'object',
      description:
        'CRT-variant only: ASCII art payload that replaces the image area',
    },
    tabLabel: {
      control: 'text',
      description: 'CRT-variant only: monitor-window tab label override',
    },
    className: { control: 'text', description: 'Additional CSS classes' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'SpokeToWork',
    description:
      'Job-hunting-by-bicycle PWA with MapLibre GL, route optimization, and E2E encrypted messaging.',
    stack: ['Next.js', 'TypeScript', 'MapLibre', 'Supabase'],
    href: 'https://spoketowork.com',
  },
};

export const WithImage: Story = {
  args: {
    title: 'ScriptHammer',
    description:
      'Modern PWA template with component library, Storybook, and SpecKit workflow.',
    stack: ['Next.js 15', 'React 19', 'Tailwind 4', 'DaisyUI'],
    href: 'https://scripthammer.dev',
    image: {
      src: 'https://picsum.photos/800/450',
      alt: 'ScriptHammer dashboard screenshot',
    },
  },
};

export const WithDetailPage: Story = {
  args: {
    title: 'KDG Interview Project',
    description:
      'Full-stack C# ASP.NET Core 8 + React 19/Vite + PostgreSQL 16 application.',
    stack: ['C#', 'ASP.NET Core', 'React', 'PostgreSQL', 'Docker'],
    href: '/projects/kdg',
    hasDetailPage: true,
  },
};

export const MinimalStack: Story = {
  args: {
    title: 'Portfolio Site',
    description: 'A simple portfolio site built with static export.',
    stack: ['Next.js'],
    href: 'https://example.com',
  },
};

export const ThemeShowcase: Story = {
  args: {
    title: 'Project',
    description: 'Description',
    stack: ['React'],
    href: '#',
  },
  render: () => (
    <div className="grid max-w-3xl grid-cols-1 gap-4 p-4 md:grid-cols-2">
      <ProjectShowcaseCard
        title="SpokeToWork"
        description="Job-hunting-by-bicycle PWA with route optimization."
        stack={['Next.js', 'MapLibre', 'Supabase']}
        href="https://spoketowork.com"
      />
      <ProjectShowcaseCard
        title="ScriptHammer"
        description="Modern PWA template with Storybook and SpecKit."
        stack={['Next.js 15', 'React 19', 'DaisyUI']}
        href="/projects/scripthammer"
        hasDetailPage
        image={{
          src: 'https://picsum.photos/800/450',
          alt: 'ScriptHammer screenshot',
        }}
      />
    </div>
  ),
  parameters: { layout: 'padded' },
};

// ── CRT variant stories (feature 047 — Nostromo CRT). ──
// Copy mirrors the actual `FEATURED_PROJECTS` array in `src/app/page.tsx:55-92`
// so what Storybook shows is what the home page will render once we wire the
// CRT variant in at the page level.

export const CrtVariantSpokeToWork: Story = {
  args: {
    variant: 'crt',
    title: 'SpokeToWork',
    description:
      'Job-hunting-by-bicycle PWA with MapLibre GL route planning, company management, and end-to-end encrypted messaging.',
    stack: ['Next.js', 'MapLibre', 'Supabase', 'ECDH'],
    href: '/projects/spoketo-work',
    hasDetailPage: true,
    asciiArt: {
      art: ROUTE_MAP_ART,
      description:
        'Route diagram for SpokeToWork: four origin nodes connect to one destination via bicycle paths.',
    },
    tabLabel: '01 · MAP',
  },
  parameters: {
    docs: {
      description: {
        story:
          'CRT variant rendering the SpokeToWork featured card — ASCII route map replaces the PNG, italic-serif title, mono bracket-style stack chips, amber-on-hover border with phosphor bloom.',
      },
    },
  },
};

export const CrtVariantScriptHammer: Story = {
  args: {
    variant: 'crt',
    title: 'ScriptHammer',
    description:
      'Production-ready Next.js template with 32 DaisyUI themes, Docker-first workflow, Storybook, full CI/CD, and tech blog.',
    stack: ['Next.js 15', 'DaisyUI', 'Docker', 'Storybook'],
    href: '/projects/scripthammer',
    hasDetailPage: true,
    asciiArt: {
      art: SWATCH_GRID_ART,
      description:
        'Component swatch grid for ScriptHammer: rows of theme palette samples representing the 32 DaisyUI themes.',
    },
    tabLabel: '02 · COMP',
  },
  parameters: {
    docs: {
      description: {
        story:
          'CRT variant for ScriptHammer — ASCII swatch grid replaces the PNG. Shows how a denser block-character diagram reads inside the monitor frame.',
      },
    },
  },
};

export const CrtVariantRevit: Story = {
  args: {
    variant: 'crt',
    title: 'Revit Plugins',
    description:
      'C# plugins for Autodesk Revit automating drafting workflows at Trinam Design — reducing repetitive tasks for architects.',
    stack: ['C#', 'Revit API', 'WinForms', '.NET'],
    href: '/projects/revit-plugins',
    hasDetailPage: true,
    asciiArt: {
      art: FLOORPLAN_ART,
      description:
        'Architectural floorplan for the Revit plugins: a four-room layout (Kitchen, Living, WC, Bedroom) demonstrating automated dimensioning output.',
    },
    tabLabel: '03 · CAD',
  },
  parameters: {
    docs: {
      description: {
        story:
          'CRT variant for the Revit Plugins case study — ASCII floorplan replaces the PNG. Demonstrates a line-art diagram with labels inside the box-drawing grid.',
      },
    },
  },
};

// Full row composition — what the Featured Projects section will look like
// after the CRT variant is wired in on the home page.
export const CrtVariantFeaturedRow: Story = {
  args: {
    title: '',
    description: '',
    stack: [],
    href: '#',
  },
  render: () => (
    <div data-theme="turtlewolfe-crt" className="bg-base-100 p-8">
      <div className="grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProjectShowcaseCard
          variant="crt"
          title="SpokeToWork"
          description="Job-hunting-by-bicycle PWA with MapLibre GL route planning, company management, and end-to-end encrypted messaging."
          stack={['Next.js', 'MapLibre', 'Supabase', 'ECDH']}
          href="/projects/spoketo-work"
          hasDetailPage
          asciiArt={{
            art: ROUTE_MAP_ART,
            description:
              'Route diagram for SpokeToWork: four origin nodes connect to one destination via bicycle paths.',
          }}
          tabLabel="01 · MAP"
        />
        <ProjectShowcaseCard
          variant="crt"
          title="ScriptHammer"
          description="Production-ready Next.js template with 32 DaisyUI themes, Docker-first workflow, Storybook, full CI/CD, and tech blog."
          stack={['Next.js 15', 'DaisyUI', 'Docker', 'Storybook']}
          href="/projects/scripthammer"
          hasDetailPage
          asciiArt={{
            art: SWATCH_GRID_ART,
            description:
              'Component swatch grid for ScriptHammer: rows of theme palette samples representing the 32 DaisyUI themes.',
          }}
          tabLabel="02 · COMP"
        />
        <ProjectShowcaseCard
          variant="crt"
          title="Revit Plugins"
          description="C# plugins for Autodesk Revit automating drafting workflows at Trinam Design — reducing repetitive tasks for architects."
          stack={['C#', 'Revit API', 'WinForms', '.NET']}
          href="/projects/revit-plugins"
          hasDetailPage
          asciiArt={{
            art: FLOORPLAN_ART,
            description:
              'Architectural floorplan for the Revit plugins: a four-room layout demonstrating automated dimensioning output.',
          }}
          tabLabel="03 · CAD"
        />
      </div>
    </div>
  ),
  parameters: { layout: 'fullscreen' },
};
