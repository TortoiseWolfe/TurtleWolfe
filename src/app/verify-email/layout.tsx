import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Email - TurtleWolfe',
  description: 'Verify your email address for TurtleWolfe',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
