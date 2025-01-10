import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navigation } from '@/components/navigation';
import { Toaster } from '@/components/ui/toaster';
import { ParticleBackground } from '@/components/ui/particle-background';
import { BackButton } from '@/components/ui/back-button';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CodeVault - Programming Challenges Repository',
  description: 'Explore and learn from a curated collection of coding problems and challenges',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gradient-to-b from-black to-gray-900 text-white min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ParticleBackground />
          <div className="relative flex min-h-screen flex-col">
            <BackButton />
            <Navigation />
            <main className="flex-1 w-full">{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}