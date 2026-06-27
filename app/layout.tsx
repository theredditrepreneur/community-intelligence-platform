import type { Metadata } from 'next';
import './globals.css';
import { platform } from '@/lib/config/platform';

export const metadata: Metadata = {
  title: platform.productName,
  description: platform.tagline,
  icons: { icon: '/redditrepreneur-logo.png', apple: '/redditrepreneur-logo.png' },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
