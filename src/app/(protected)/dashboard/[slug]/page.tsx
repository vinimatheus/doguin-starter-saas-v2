import { redirect } from 'next/navigation';

interface OverviewPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function OverviewPage({ params }: OverviewPageProps) {
  redirect(`/dashboard/${(await params).slug}/overview`);
}
