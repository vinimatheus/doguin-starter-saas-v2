import { currentUser } from '@/lib/auth';
import PlanPro from './_components/plan';
import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe';

export default async function Page() {
  const user = await currentUser();

  if (!user?.email) {
    return redirect('/auth/login');
  }
  const customers = await stripe.customers.list({ email: user.email });
  const customer = customers.data[0];

  if (!customer) {
    return <PlanPro />;
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: customer.id,
    status: 'active'
  });

  if (!subscriptions.data.length) {
    return <PlanPro />;
  }

  // Assinatura ativa encontrada
  const subscription = subscriptions.data[0];

  return (
    <div>
      <p>
        Assinatura ativa até:{' '}
        {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
      </p>
    </div>
  );
}
