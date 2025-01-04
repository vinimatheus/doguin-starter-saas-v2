import { auth } from '@/auth';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
  title: 'Next Shadcn',
  description: 'Painel básico com Next.js e Shadcn'
};

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap'
});

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="pt-BR" className={`${lato.className}`} suppressHydrationWarning>
        <body className={'overflow-hidden'}>
          <NextTopLoader showSpinner={false} />
          <Toaster />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
