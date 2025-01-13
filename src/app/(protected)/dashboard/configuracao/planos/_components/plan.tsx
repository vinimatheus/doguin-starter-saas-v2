'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import PageContainer from '@/components/layout/page-container';

const PLAN = {
  name: process.env.NEXT_PUBLIC_PLAN_NAME || 'Pro',
  description:
    process.env.NEXT_PUBLIC_PLAN_DESCRIPTION ||
    'Tenha acesso a todos os recursos, suporte prioritário e projetos ilimitados.',
  priceIds: {
    monthly: process.env.NEXT_PUBLIC_PLAN_PRICE_ID_MONTHLY,
    yearly: process.env.NEXT_PUBLIC_PLAN_PRICE_ID_YEARLY
  },
  priceMonthly: 300,
  priceYearly: 3000
};

export default function PlanPro() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priceId: isAnnual ? PLAN.priceIds.yearly : PLAN.priceIds.monthly
        })
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Ocorreu um erro ao criar a sessão de checkout.');
      }
    } catch (error) {
      alert('Erro inesperado ao processar o checkout. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="mx-auto mt-12 max-w-md rounded-lg p-6">
        <h2 className="text-center text-3xl font-bold">Assine o Plano Pro</h2>
        <>
          <p className="mt-4 text-center text-sm">
            Escolha a melhor opção para você: mensal ou anual!
          </p>

          <div className="mt-6 flex items-center justify-center space-x-4">
            <Label htmlFor="billing-cycle" className="text-sm font-medium">
              Mensal
            </Label>
            <Switch
              id="billing-cycle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <Label htmlFor="billing-cycle" className="text-sm font-medium">
              Anual
            </Label>
          </div>

          <Card className="mt-8 rounded-lg border transition-shadow hover:shadow-xl">
            <CardHeader className="p-6 text-center">
              <h3 className="text-lg font-semibold">{PLAN.name}</h3>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <p className="text-sm leading-relaxed">{PLAN.description}</p>
              <div className="mt-6">
                <h4 className="text-2xl font-bold">
                  {isAnnual
                    ? `R$ ${PLAN.priceYearly.toFixed(2)}/ano`
                    : `R$ ${PLAN.priceMonthly.toFixed(2)}/mês`}
                </h4>
                {isAnnual && (
                  <p className="mt-1 text-sm font-semibold text-green-600">
                    Economize 2 meses! Pague somente por 10 meses.
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-6">
              <Button
                className="w-full text-sm font-medium"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading
                  ? 'Processando...'
                  : `Escolher ${isAnnual ? 'Anual' : 'Mensal'}`}
              </Button>
            </CardFooter>
          </Card>
        </>
      </div>
    </PageContainer>
  );
}
