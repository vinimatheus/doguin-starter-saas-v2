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

  const subscription = subscriptions.data[0];
  const plan = subscription.items.data[0]?.price;
  const product = subscription.items.data[0]?.price.product;

  // Obtém o histórico de pagamentos
  const invoices = await stripe.invoices.list({
    customer: customer.id,
    limit: 5 // Limita ao histórico mais recente
  });

  return (
    <div className="mx-auto mt-10 max-w-4xl space-y-8">
      {/* Detalhes da Assinatura */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            Detalhes da Assinatura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Produto:</p>
              <p>
                {typeof product !== 'string' && 'name' in product
                  ? product.name
                  : 'Produto não identificado'}
              </p>
            </div>
            <div>
              <p className="font-semibold">Plano:</p>
              <p>{plan?.nickname || 'Plano não identificado'}</p>
            </div>
            <div>
              <p className="font-semibold">Preço:</p>
              <p>
                {plan?.unit_amount
                  ? `R$ ${(plan.unit_amount / 100).toFixed(2)} por ${
                      plan?.recurring?.interval === 'month' ? 'mês' : 'ano'
                    }`
                  : 'Preço não disponível'}
              </p>
            </div>
            <div>
              <p className="font-semibold">Moeda:</p>
              <p>{plan?.currency.toUpperCase() || 'Moeda não disponível'}</p>
            </div>
            <div>
              <p className="font-semibold">Data de Início:</p>
              <p>
                {new Date(subscription.start_date * 1000).toLocaleDateString(
                  'pt-BR'
                )}
              </p>
            </div>
            <div>
              <p className="font-semibold">Próximo pagamento:</p>
              <p>
                {new Date(
                  subscription.current_period_end * 1000
                ).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="font-semibold">Quantidade de itens:</p>
              <p>{subscription.items.data[0]?.quantity || 1}</p>
            </div>
            <div>
              <p className="font-semibold">Método de Pagamento:</p>
              <p>
                {customer.invoice_settings.default_payment_method
                  ? 'Cartão de Crédito'
                  : 'Método de pagamento não disponível'}
              </p>
            </div>
            <div>
              <p className="font-semibold">ID da Assinatura:</p>
              <p>{subscription.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            Histórico de Pagamentos
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
              {invoices.data.length > 0 ? (
                invoices.data.map((invoice) => (
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
                          Pago
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Nenhum pagamento encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
