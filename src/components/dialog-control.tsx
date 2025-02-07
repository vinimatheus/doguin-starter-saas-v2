'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Dialog } from '@/components/ui/dialog';

interface DialogControlProps {
  children: React.ReactNode;
}

export function DialogControl({ children }: DialogControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fromRoute = searchParams.get('from');

    if (fromRoute) {
      sessionStorage.setItem('lastNonDialogRoute', fromRoute);
      setIsOpen(true);
    } else {
      setIsOpen(false); // 🔹 Garante que o estado do diálogo é atualizado corretamente ao navegar
    }
  }, [searchParams]);

  const handleClose = () => {
    setIsOpen(false);
    const previousRoute =
      sessionStorage.getItem('lastNonDialogRoute') || '/dashboard';
    sessionStorage.removeItem('lastNonDialogRoute');

    // 🔹 Usa `replace` para evitar duplicação no histórico de navegação
    router.replace(previousRoute);
  };

  return (
    <>
      {children}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        {/* Conteúdo do diálogo */}
        <div className="p-6">
          <h2 className="text-lg font-semibold">Configurações</h2>
          <p className="text-gray-600">
            Gerencie as configurações da sua organização.
          </p>
        </div>
      </Dialog>
    </>
  );
}
