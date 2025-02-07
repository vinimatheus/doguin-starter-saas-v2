import PageContainer from '@/components/layout/page-container';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import Content from './_components/content';

interface OverviewPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function OverviewPage({ params }: OverviewPageProps) {
  // Await params to get the resolved values
  const { slug } = await params;

  const organization = await db.organization.findUnique({
    where: {
      slug
    }
  });

  if (!organization) {
    redirect('/selecionarorg');
  }

  return (
    <PageContainer>
      <main className="flex-1 overflow-auto bg-white p-6 dark:bg-[#0F0F12]">
        <Content />
      </main>
    </PageContainer>
  );
}
