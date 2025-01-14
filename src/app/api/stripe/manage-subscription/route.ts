import { currentUser } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await currentUser();
  const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const email = user?.email;
  const userId = user?.id;

  if (!email || !userId) {
    return NextResponse.json(
      { error: 'User not authenticated' },
      { status: 401 }
    );
  }

  const customers = await stripe.customers.list({ email });
  const customer = customers.data[0];

  if (!customer) {
    throw Error('Could not get customer');
  }

  // 3. Create portal link and redirect user
  const { url } = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: `${appUrl}/dashboard/configuracao/planos`
  });

  return NextResponse.json({ redirectUrl: url });
}
