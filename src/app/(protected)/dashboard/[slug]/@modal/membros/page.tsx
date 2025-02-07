import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { MemberContent } from '@/components/member-content';

interface OrganizationPageProps {
  params: Promise<{ slug?: string }>; // ✅ `params` agora é uma Promise
}

export default async function MemberPage({ params }: OrganizationPageProps) {
  const resolvedParams = await params; // ✅ Aguarda a Promise ser resolvida
  const slug = resolvedParams?.slug;

  // Busca a organização e seus membros
  const organization = await db.organization.findUnique({
    where: { slug },
    include: {
      members: {
        include: {
          user: true
        }
      }
    }
  });

  if (!organization) {
    redirect('/selecionarorg');
  }

  return (
    <MemberContent
      organization={{
        ...organization,
        members: organization.members.map((member) => ({
          id: member.id,
          role: member.role,
          createdAt: member.createdAt,
          user: {
            name: member.user.name || '',
            email: member.user.email || ''
          }
        }))
      }}
    />
  );
}
