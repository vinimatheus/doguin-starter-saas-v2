import { auth } from '@/auth';
import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  const session = await auth();
  return (
    <SessionProvider session={session}>

    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen} >
        <AppSidebar />
        <SidebarInset>
          <Header />
          {/* page main content */}
            {children}
          {/* page main content ends */}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
    </ThemeProvider>
    </SessionProvider>
  );
}
