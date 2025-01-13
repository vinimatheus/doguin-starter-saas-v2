import { currentUser } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
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

    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json(
        { error: 'Missing required parameter: priceId' },
        { status: 400 }
      );
    }

    const customers = await stripe.customers.list({ email });
    const customer = customers.data[0];

    if (customer) {
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active'
      });

      if (subscriptions.data.length > 0) {
        return NextResponse.json(
          { error: 'You already have an active subscription.' },
          { status: 400 }
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      metadata: {
        userId
      },
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${appUrl}/dashboard/configuracao/planos`,
      cancel_url: `${appUrl}/dashboard/configuracao/planos`
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
