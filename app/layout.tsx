import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'Jadeon',
  description: 'Gestão financeira inteligente para times modernos.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${spaceGrotesk.variable} font-sans text-foreground`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
