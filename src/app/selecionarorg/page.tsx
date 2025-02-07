import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Dog } from 'lucide-react';

export default async function OrganizationDashboardPage() {
  const session = await currentUser();

  if (!session) {
    redirect('/login');
    return null;
  }

  // Busca organizações associadas ao usuário atual
  const organizations = await db.organization.findMany({
    where: {
      members: {
        some: {
          userId: session.id
        }
      }
    }
  });

  // Redireciona se o usuário não pertence a nenhuma organização
  if (organizations.length === 0) {
    redirect('/onboarding/organizacao');
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center justify-center gap-2 self-center font-medium">
          <Dog className="size-7" />
          Doguin Inc.
        </div>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Selecione a organização</CardTitle>
              <CardDescription>
                Selecione a organização que deseja acessar
              </CardDescription>
            </CardHeader>
            <CardContent className="flex w-full flex-col gap-2">
              {organizations.map((org) => (
                <Link
                  key={org.id}
                  href={`/dashboard/${org.slug}/overview`}
                  passHref
                >
                  <Button className="w-full">{org.name}</Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
