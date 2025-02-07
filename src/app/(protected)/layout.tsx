import { auth } from '@/auth';
import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { db } from '@/lib/db';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Doguin Starter v2',
  description: 'Dashboard básico com Next.js e Shadcn para Doguin Starter v2'
};

export default async function DashboardLayout({
  children,
  modal
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  const session = await auth();

  const orgs = await db.organization.findMany({
    where: {
      members: {
        some: {
          userId: session?.user.id
        }
      }
    }
  });

  if (orgs.length === 0) {
    redirect(`/onboarding/organizacao`);
  }

  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <KBar>
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar teams={orgs} />
            <SidebarInset>
              <Header />
              <main>
                {children}
                {modal}
                <Toaster />
              </main>
            </SidebarInset>
          </SidebarProvider>
        </KBar>
      </ThemeProvider>
    </SessionProvider>
  );
}
