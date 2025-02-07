'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import { usePathname } from 'next/navigation';

interface LastRouteContextType {
  lastRoute: string | null;
}

const LastRouteContext = createContext<LastRouteContextType | undefined>(
  undefined
);

export const LastRouteProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [lastRoute, setLastRoute] = useState<string | null>(null);

  useEffect(() => {
    // Se a rota atual NÃO for de configurações (por exemplo, não contém "organizacao" ou "membros")
    if (!pathname.includes('organizacao') && !pathname.includes('membros')) {
      setLastRoute(pathname);
    }
  }, [pathname]);

  return (
    <LastRouteContext.Provider value={{ lastRoute }}>
      {children}
    </LastRouteContext.Provider>
  );
};

export const useLastRoute = () => {
  const context = useContext(LastRouteContext);
  if (!context) {
    throw new Error('useLastRoute must be used within a LastRouteProvider');
  }
  return context;
};
