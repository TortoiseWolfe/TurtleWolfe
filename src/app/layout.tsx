import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import ThemeScript from '@/components/ThemeScript';
import { GlobalNav } from '@/components/GlobalNav';
import { Footer } from '@/components/Footer';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { ColorblindFilters } from '@/components/atomic/ColorblindFilters';
import { ConsentProvider } from '@/contexts/ConsentContext';
import { CookieConsent } from '@/components/privacy/CookieConsent';
import { ConsentModal } from '@/components/privacy/ConsentModal';
import GoogleAnalytics from '@/lib/analytics/GoogleAnalytics';
import ErrorBoundary from '@/components/ErrorBoundary';
// import { AuthProvider } from '@/contexts/AuthContext'; // Supabase disabled — portfolio site
import { projectConfig } from '@/config/project.config';
import {
  generateMetadata,
  generateJsonLd,
  JsonLdScript,
} from '@/utils/metadata';
// import PWAInstall from '@/components/PWAInstall'; // PWA disabled — portfolio doesn't need install prompts
import { CountdownBanner } from '@/components/atomic/CountdownBanner';
// import { SetupBanner } from '@/components/SetupBanner'; // Supabase disabled — portfolio site

// Display face — the one serif on the page, used for the hero name and
// project-card titles. The Nostromo CRT aesthetic is intentionally mono-heavy;
// this italic serif carries enormous visual weight against the otherwise-uniform
// monospace. See spec 047 §Resolved decision 1.
const instrumentSerif = Instrument_Serif({
  variable: '--font-display',
  weight: '400',
  style: 'italic',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
});

// Mono face — used for status bar, manifest, CTAs, project card labels, ASCII
// diagrams, and ALL body copy. `--font-body` is aliased to `--font-mono` in
// globals.css :root. See spec 047 §Resolved decision 2.
const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: [
    '"SF Mono"',
    'Menlo',
    'Monaco',
    'Consolas',
    '"Courier New"',
    'monospace',
  ],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f0eb' },
    { media: '(prefers-color-scheme: dark)', color: '#050907' },
  ],
};

// Generate comprehensive metadata using the utility function
export const metadata: Metadata = {
  ...generateMetadata({
    title: projectConfig.projectName,
    description: projectConfig.projectDescription,
    path: '/',
    tags: ['Next.js', 'React', 'TypeScript', 'PWA', 'DaisyUI', 'TailwindCSS'],
  }),
  // manifest: projectConfig.manifestPath, // PWA disabled — portfolio site
  icons: {
    icon: ['/favicon.ico', '/icon.svg'],
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: projectConfig.projectName,
  },
  other: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
    // Content Security Policy via meta tag (for static export compatibility)
    // Note: HTTP headers are preferred but not available with static export
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://unpkg.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://www.googleapis.com https://*.google-analytics.com https://tile.openstreetmap.org https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com https://api.web3forms.com",
      "frame-src 'self' https://www.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://api.web3forms.com",
      'upgrade-insecure-requests',
    ].join('; '),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${instrumentSerif.variable} ${jetbrainsMono.variable} flex min-h-screen flex-col antialiased`}
        suppressHydrationWarning
      >
        <ThemeScript />
        <JsonLdScript data={generateJsonLd()} />
        <ColorblindFilters />
        <ConsentProvider>
          <GoogleAnalytics />
          {/* AuthProvider removed — no Supabase backend for portfolio site */}
          <AccessibilityProvider>
            <GlobalNav />
            <CountdownBanner />
            {/* SetupBanner removed — no Supabase backend for portfolio site */}
            <ErrorBoundary level="page">
              <div className="bg-base-200 min-h-0 flex-1 overflow-hidden pb-14">
                {children}
              </div>
            </ErrorBoundary>
            <Footer />
            <CookieConsent />
            <ConsentModal />
            {/* <PWAInstall /> — PWA disabled for portfolio site */}
          </AccessibilityProvider>
        </ConsentProvider>
      </body>
    </html>
  );
}
