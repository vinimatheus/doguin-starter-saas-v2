'use client';
import React from 'react';
import { SessionProvider, SessionProviderProps } from 'next-auth/react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export default function Providers({
  session,
  children
}: {
  session: SessionProviderProps['session'];
  children: React.ReactNode;
}) {
  return (
    <>
      <NuqsAdapter>
          <SessionProvider session={session}>{children}</SessionProvider>
      </NuqsAdapter>
    </>
  );
}
