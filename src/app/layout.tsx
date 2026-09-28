import type { Metadata } from 'next';
import { Bricolage_Grotesque, IBM_Plex_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import { AuthProvider } from '@/providers/AuthProvider';
import './globals.css';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Our Event',
  description: 'Temukan event seru di kotamu dan amankan tiketmu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body
        className={`${display.variable} ${sans.variable} ${mono.variable} min-h-screen bg-kertas font-sans text-tinta antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
