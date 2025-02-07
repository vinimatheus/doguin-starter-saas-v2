import { OrganizationContent } from '@/components/organization-content';
import { db } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';

interface OrganizationPageProps {
  params: Promise<{ slug?: string }>; // ✅ `params` agora é uma Promise
}

export default async function OrganizationPage({
  params
}: OrganizationPageProps) {
  const resolvedParams = await params; // ✅ Aguarda a Promise ser resolvida
  const slug = resolvedParams?.slug;

  if (!slug) {
    return notFound(); // ✅ Retorna erro 404 se `slug` for inválido
  }

  const organization = await db.organization.findUnique({
    where: { slug }
  });

  if (!organization) {
    redirect('/select-organization');
  }

  return <OrganizationContent organization={organization} />;
}
