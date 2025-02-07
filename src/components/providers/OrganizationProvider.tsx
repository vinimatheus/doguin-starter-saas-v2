// src/components/providers/OrganizationProvider.tsx
'use client';

import { createContext, ReactNode, useContext } from 'react';

interface Organization {
  id: string;
  name: string;
  slug: string;
  // outros campos necessários...
  members: Array<{ userId: string }>;
}

interface OrganizationContextType {
  organization: Organization;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error(
      'useOrganization deve ser usado dentro do OrganizationProvider'
    );
  }
  return context;
}

interface OrganizationProviderProps {
  children: ReactNode;
  organization: Organization;
}

export default function OrganizationProvider({
  children,
  organization
}: OrganizationProviderProps) {
  return (
    <OrganizationContext.Provider value={{ organization }}>
      {children}
    </OrganizationContext.Provider>
  );
}
