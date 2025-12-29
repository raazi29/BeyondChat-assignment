import './globals.css';
import { ReactNode } from 'react';
import { Inter, JetBrains_Mono } from 'next/font/google';
import FloatingNav from '@/components/FloatingNav';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata = {
  title: 'BeyondChats Lab',
  description: 'Content Intelligence System',
  icons: {
    icon: '/beyondchats-logo.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <FloatingNav />
        {children}
      </body>
    </html>
  );
}