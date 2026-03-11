import type { Metadata } from 'next';
import ExperienceTimeline from '@/components/molecular/ExperienceTimeline';
import type { TimelineEntry } from '@/components/molecular/ExperienceTimeline';
import CTABanner from '@/components/molecular/CTABanner';

export const metadata: Metadata = {
  title: 'About | Jonathan Pohlner',
  description:
    'Full Stack Developer with 10+ years building accessible web applications and 20+ years in graphic design.',
};

const EXPERIENCE: TimelineEntry[] = [
  {
    yearRange: '2025 – Present',
    company: 'Mercor Intelligence',
    role: 'AI Model Evaluation Specialist',
    description:
      'Building A/B testing frameworks for evaluating AI coding assistants. Python validation tools, multi-track test orchestration, and behavioral analysis across 28+ evaluation sessions.',
    tech: ['Python', 'Docker', 'Bash', 'tmux'],
  },
  {
    yearRange: '2022 – 2023',
    company: 'Trinam Drafting & Design',
    role: 'Software Developer',
    description:
      'Developed C# plugins for Autodesk Revit automating drafting workflows. Reduced repetitive tasks for architects and improved project delivery accuracy.',
    tech: ['C#', 'Revit API', 'WinForms', '.NET'],
  },
  {
    yearRange: '2021 – 2022',
    company: 'Collective Minds',
    role: 'React Native Developer',
    description:
      'Built cross-platform mobile applications with React Native. Implemented real-time features and integrated with backend APIs.',
    tech: ['React Native', 'TypeScript', 'REST APIs'],
  },
  {
    yearRange: '2018 – Present',
    company: 'ScriptHammer (Freelance)',
    role: 'Full Stack Developer',
    description:
      'Building web applications for small businesses and startups. Created the ScriptHammer template framework and SpokeToWork PWA. Active on Twitch streaming development.',
    tech: ['React', 'Next.js', 'TypeScript', 'Docker', 'Supabase'],
  },
  {
    yearRange: '2003 – 2018',
    company: 'Creative Touch',
    role: 'Graphic Designer & Web Developer',
    description:
      '15+ years in graphic design transitioning to web development. Built websites for local businesses, managed print production, and developed brand identities.',
    tech: ['Photoshop', 'Illustrator', 'WordPress', 'HTML/CSS'],
  },
];

const SKILLS = {
  Frontend: [
    'React',
    'React Native',
    'Next.js',
    'TypeScript',
    'Three.js',
    'Tailwind CSS',
    'DaisyUI',
    'Storybook',
    'D3.js',
  ],
  Backend: [
    'Node.js',
    'Express',
    'Supabase',
    'MongoDB',
    'REST APIs',
    'JWT Auth',
  ],
  DevOps: ['Docker', 'GitHub Actions', 'AWS', 'Linux', 'CI/CD', 'PWA'],
  'Design & Tools': [
    'Figma',
    'Photoshop',
    'Illustrator',
    'Accessibility (WCAG AA)',
    'Responsive Design',
  ],
  Languages: [
    'TypeScript',
    'JavaScript',
    'C#',
    'Python',
    'HTML/CSS',
    'SQL',
    'Bash',
  ],
};

const CERTIFICATIONS = [
  {
    title: 'FreeCodeCamp — Front End Libraries',
    description: 'React, Redux, Bootstrap, jQuery, Sass',
    href: 'https://www.freecodecamp.org/certification/turtlewolf/front-end-development-libraries',
    date: '2018 – 2021',
  },
  {
    title: 'Udemy — Node.js API Masterclass',
    description: 'Express, MongoDB, REST, JWT auth, file uploads, geocoding',
    href: 'https://www.udemy.com/certificate/UC-8033cc47-612f-4a7b-afc3-c7a8c9273686/',
    date: '2020',
  },
  {
    title: 'Indeed Assessments',
    description:
      'Software Developer Skills (Proficient), Problem Solving (Expert)',
    href: 'https://indeed.com',
    date: 'Verified',
  },
];

export default function AboutPage() {
  return (
    <main className="bg-base-200 min-h-screen">
      {/* Hero */}
      <section className="px-4 pt-12 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          {/* Headshot placeholder — circular frame ready for photo */}
          <div className="bg-base-300 mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full sm:h-40 sm:w-40">
            <span className="text-base-content/30 text-5xl font-bold">JP</span>
          </div>
          <h1 className="text-base-content mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            About Me
          </h1>
          <p className="text-base-content/70 mx-auto max-w-2xl text-lg leading-relaxed">
            Full Stack Developer with 10+ years building accessible web
            applications and 20+ years in graphic design. I specialize in React,
            TypeScript, and Next.js — turning complex problems into clean,
            maintainable solutions.
          </p>
        </div>
      </section>

      {/* Experience Timeline */}
      <section
        aria-label="Work experience"
        className="bg-base-100 px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-base-content mb-8 text-center text-2xl font-bold sm:text-3xl">
            Experience
          </h2>
          <ExperienceTimeline entries={EXPERIENCE} />
        </div>
      </section>

      {/* Skills */}
      <section
        aria-label="Technical skills"
        className="px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-base-content mb-8 text-center text-2xl font-bold sm:text-3xl">
            Skills
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(SKILLS).map(([category, skills]) => (
              <div key={category} className="card bg-base-100 shadow-md">
                <div className="card-body">
                  <h3 className="card-title text-primary text-base">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="badge badge-outline badge-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section
        aria-label="Certifications"
        className="bg-base-100 px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-base-content mb-8 text-center text-2xl font-bold sm:text-3xl">
            Certifications
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CERTIFICATIONS.map((cert) => (
              <a
                key={cert.title}
                href={cert.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card bg-base-200 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="card-body p-4">
                  <h3 className="card-title text-primary text-base">
                    {cert.title}
                  </h3>
                  <p className="text-base-content/70 text-sm">
                    {cert.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="badge badge-ghost badge-xs">
                      {cert.date}
                    </span>
                    <span className="text-primary text-xs">View &rarr;</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Community */}
      <section aria-label="Community" className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-base-content mb-8 text-center text-2xl font-bold sm:text-3xl">
            Community
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="card bg-base-100 shadow-md">
              <div className="card-body items-center text-center">
                <h3 className="card-title text-base">Dangerous Minds</h3>
                <p className="text-base-content/70 text-sm">
                  Teaching children programming through hands-on projects
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-md">
              <div className="card-body items-center text-center">
                <h3 className="card-title text-base">
                  FreeCodeCamp Chattanooga
                </h3>
                <p className="text-base-content/70 text-sm">
                  Chapter administrator — meetups and mentoring
                </p>
              </div>
            </div>
            <a
              href="https://tortoisewolfe.github.io/The_House_that_Code_Built/"
              target="_blank"
              rel="noopener noreferrer"
              className="card bg-base-100 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="card-body items-center text-center">
                <h3 className="card-title text-primary text-base">
                  The House that Code Built
                </h3>
                <p className="text-base-content/70 text-sm">
                  Published children&apos;s book on programming concepts
                </p>
                <span className="text-primary mt-2 text-xs">
                  Read online &rarr;
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <CTABanner
        headline="Want to work together?"
        description="I'm available for freelance projects and full-time opportunities."
        primaryCTA={{ label: 'Get in Touch', href: '/contact' }}
        secondaryCTA={{
          label: 'View My Resume',
          href: 'https://tortoisewolfe.github.io/Resume/',
          external: true,
        }}
      />
    </main>
  );
}
