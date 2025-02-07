import { db } from '@/lib/db';
import OrganizationProvider from '@/components/providers/OrganizationProvider';
import { redirect } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{ slug: string }>; // ✅ `params` agora é uma Promise
}

export default async function DashboardLayout({
  children,
  modal,
  params
}: LayoutProps) {
  const resolvedParams = await params; // ✅ Aguarda a Promise ser resolvida
  const { slug } = resolvedParams;

  const organization = await db.organization.findUnique({
    where: { slug },
    include: { members: true }
  });

  if (!organization) {
    redirect('/selecionarorg');
  }

  return (
    <OrganizationProvider organization={organization}>
      <div className="relative min-h-screen">
        {children}
        {modal}
      </div>
    </OrganizationProvider>
  );
}
