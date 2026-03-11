import type { Metadata } from 'next';
import ServiceCard from '@/components/molecular/ServiceCard';
import CTABanner from '@/components/molecular/CTABanner';

export const metadata: Metadata = {
  title: 'Services | Jonathan Pohlner',
  description:
    'Full-stack web development, PWA development, technical consulting, and legacy system modernization.',
};

export default function ServicesPage() {
  return (
    <main className="bg-base-200 min-h-screen">
      {/* Hero */}
      <section className="px-4 pt-12 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-base-content mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            What I Build
          </h1>
          <p className="text-base-content/70 mx-auto max-w-2xl text-lg leading-relaxed">
            Full-stack solutions from concept to deployment. I specialize in
            modern web applications that are accessible, performant, and built
            to last.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section aria-label="Services" className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ServiceCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              }
              title="Web & Mobile Development"
              description="Custom full-stack applications built with React, Next.js, React Native, and TypeScript. From web apps to cross-platform mobile."
              features={[
                'React & Next.js web apps',
                'React Native cross-platform mobile',
                'REST & real-time APIs',
                'Database design & Supabase',
                'Authentication & authorization',
              ]}
              ctaLabel="Start a Project"
              ctaHref="/contact"
            />
            <ServiceCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                  />
                </svg>
              }
              title="PWA & Offline-First Apps"
              description="Progressive Web Apps that work offline, install on any device, and deliver native-like performance. Service workers, push notifications, and background sync."
              features={[
                'Service worker strategies',
                'Offline data persistence',
                'Push notifications',
                'App installation prompts',
                'Background sync',
              ]}
              ctaLabel="Discuss Your App"
              ctaHref="/contact"
            />
            <ServiceCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              }
              title="Technical Consulting"
              description="Architecture reviews, code audits, performance optimization, and team mentoring. I help teams build better software and adopt modern practices."
              features={[
                'Codebase health assessment',
                'Architecture design',
                'Performance auditing',
                'Accessibility compliance (WCAG)',
                'Developer mentoring',
              ]}
              ctaLabel="Book a Review"
              ctaHref="/contact"
            />
            <ServiceCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.182-3.182"
                  />
                </svg>
              }
              title="Legacy System Modernization"
              description="Migrate from jQuery, PHP, WinForms, or other legacy frameworks to modern React and TypeScript. Incremental migration strategies that minimize risk."
              features={[
                'Incremental migration plans',
                'jQuery to React conversion',
                'PHP to Next.js migration',
                'WinForms to web app',
                'Data migration & testing',
              ]}
              ctaLabel="Plan Your Migration"
              ctaHref="/contact"
            />
          </div>
        </div>
      </section>

      {/* How I Work */}
      <section
        aria-label="Process"
        className="bg-base-100 px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-base-content mb-8 text-center text-2xl font-bold sm:text-3xl">
            How I Work
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Discovery',
                desc: 'Understand your goals, constraints, and users. Define scope and success criteria.',
              },
              {
                step: '02',
                title: 'Design',
                desc: 'Architecture planning, wireframes, and technical specifications. No surprises.',
              },
              {
                step: '03',
                title: 'Build',
                desc: 'Iterative development with regular demos. Test-driven, accessible, documented.',
              },
              {
                step: '04',
                title: 'Deploy',
                desc: 'CI/CD pipelines, monitoring, and handoff. Your team owns the code.',
              },
            ].map((phase) => (
              <div key={phase.step} className="text-center">
                <span className="text-primary font-mono text-4xl font-bold">
                  {phase.step}
                </span>
                <h3 className="text-base-content mt-2 text-lg font-semibold">
                  {phase.title}
                </h3>
                <p className="text-base-content/70 mt-1 text-sm">
                  {phase.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        headline="Ready to build something?"
        description="Tell me about your project and I'll get back to you within 24 hours."
        primaryCTA={{ label: 'Get in Touch', href: '/contact' }}
        secondaryCTA={{ label: 'View My Work', href: '/#projects' }}
      />
    </main>
  );
}
