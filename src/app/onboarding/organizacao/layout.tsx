import { auth } from '@/auth';
import { Toaster } from '@/components/ui/toaster';
import { db } from '@/lib/db';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Doguin Starter v2',
  description: 'Dashboard básico com Next.js e Shadcn para Doguin Starter v2'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect(`/auth/login`);
  }

  const orgs = await db.organization.findMany({
    where: {
      members: {
        some: {
          userId: session?.user.id
        }
      }
    }
  });

  if (orgs.length > 0) {
    redirect(`/dashboard/overview`);
  }

  return (
    <SessionProvider session={session}>
      <main>
        {children}
        <Toaster />
      </main>
    </SessionProvider>
  );
}
