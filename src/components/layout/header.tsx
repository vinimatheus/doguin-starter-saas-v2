import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { Breadcrumbs } from '../breadcrumbs';
import SearchInput from '../search-input';
import { UserNav } from './user-nav';
import { Badge } from '../ui/badge';
import { stripe } from '@/lib/stripe';
import { currentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Header() {
  const user = await currentUser();

  if (!user?.email) {
    return redirect('/auth/login');
  }
  const customers = await stripe.customers.list({ email: user.email });
  const customer = customers.data[0];

  const subscriptions = await stripe.subscriptions.list({
    customer: customer.id,
    status: 'active'
  });

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-2 px-4">
        <div className="hidden md:flex">
          <SearchInput />
        </div>
        {subscriptions.data.length ? (
          <Link href="/dashboard/configuracao/planos">
            <Badge variant="default" className="hidden md:flex">
              Pro
            </Badge>
          </Link>
        ) : null}
        <UserNav />
      </div>
    </header>
  );
}
