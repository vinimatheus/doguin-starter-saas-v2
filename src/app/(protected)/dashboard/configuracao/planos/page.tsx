import { currentUser } from '@/lib/auth';
import PlanPro from './_components/plan';
import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Info, RefreshCcw } from 'lucide-react';
import Subscription from './_components/subscription';

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
    status: 'all'
  });

  const activeSubscription = subscriptions.data.find(
    (sub) => sub.status === 'active'
  );
  const canceledSubscriptions = subscriptions.data.filter(
    (sub) => sub.status === 'canceled'
  );

  const invoices = await stripe.invoices.list({
    customer: customer.id
  });

  const activePlan = activeSubscription?.items.data[0]?.price;
  const product = activePlan
    ? await stripe.products.retrieve(activePlan.product as string)
    : null;

  return (
    <div className="mx-auto mt-10 max-w-4xl space-y-8 p-4">
      {activePlan ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-bold">
              <Info className="mr-2" /> Detalhes da Assinatura
            </CardTitle>
            <div className="flex w-full justify-start">
              <Subscription />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Produto:</p>
                <p>{product?.name || 'Produto não identificado'}</p>
              </div>
              <div>
                <p className="font-semibold">Preço:</p>
                <p>
                  {activePlan.unit_amount
                    ? `R$ ${(activePlan.unit_amount / 100).toFixed(2)} por ${
                        activePlan.recurring?.interval === 'month'
                          ? 'mês'
                          : 'ano'
                      }`
                    : 'Preço não disponível'}
                </p>
              </div>
              <div>
                <p className="font-semibold">Data de Início:</p>
                <p>
                  {new Date(
                    activeSubscription.start_date * 1000
                  ).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  {activeSubscription.cancel_at_period_end
                    ? 'Vencimento da Licença:'
                    : 'Próximo pagamento:'}
                </p>
                <p>
                  {new Date(
                    activeSubscription.current_period_end * 1000
                  ).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div>
                <p className="font-semibold">Status do Plano:</p>
                <p>
                  {activeSubscription.cancel_at_period_end
                    ? `Cancelado, válido até ${new Date(
                        activeSubscription.current_period_end * 1000
                      ).toLocaleDateString('pt-BR')}`
                    : 'Ativo'}
                </p>
              </div>
              <div>
                <p className="font-semibold">Renovação Automática:</p>
                <p>{activeSubscription.cancel_at_period_end ? 'Não' : 'Sim'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <PlanPro />
      )}

      {canceledSubscriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-bold">
              <AlertCircle className="mr-2" /> Histórico de Cancelamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {canceledSubscriptions.map((sub) => (
                <li key={sub.id} className="mb-2">
                  Plano {sub.items.data[0]?.price.nickname || 'desconhecido'} -
                  Cancelado em{' '}
                  {sub.ended_at
                    ? new Date(sub.ended_at * 1000).toLocaleDateString('pt-BR')
                    : 'Data não disponível'}
                  .
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {invoices.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-bold">
              <RefreshCcw className="mr-2" /> Histórico de Pagamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recibo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.data.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      {new Date(invoice.created * 1000).toLocaleDateString(
                        'pt-BR'
                      )}
                    </TableCell>
                    <TableCell>
                      {invoice.amount_paid
                        ? `R$ ${(invoice.amount_paid / 100).toFixed(2)}`
                        : 'Não pago'}
                    </TableCell>
                    <TableCell>
                      {invoice.status === 'paid' && (
                        <Badge
                          variant="default"
                          className="bg-green-500 text-white"
                        >
                          <CheckCircle className="mr-1" size={16} /> Pago
                        </Badge>
                      )}
                      {invoice.status === 'open' && (
                        <Badge
                          variant="secondary"
                          className="bg-yellow-500 text-white"
                        >
                          Em Aberto
                        </Badge>
                      )}
                      {invoice.status === 'uncollectible' && (
                        <Badge
                          variant="destructive"
                          className="bg-red-500 text-white"
                        >
                          Pendente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {invoice.invoice_pdf ? (
                        <a
                          href={invoice.invoice_pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Visualizar Recibo
                        </a>
                      ) : (
                        'Indisponível'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
