'use client';

import { Button } from '@/components/ui/button';

export default function Subscription() {
  const handleRedirect = async () => {
    const response = await fetch('/api/stripe/manage-subscription');
    const { redirectUrl } = await response.json();

    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
    }
  };

  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={handleRedirect}
      className="ml-auto"
    >
      Gerenciar sua assinatura
    </Button>
  );
}
