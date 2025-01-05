'use client';

import Link from 'next/link';
import { Button } from './ui/button';

const UsersPage = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r p-6">
        <nav className="space-y-1">
          <Link href="/dashboard/configuracao/perfil">
            <Button variant="ghost" className="w-full justify-start">
              Perfil
            </Button>
          </Link>
          <Button variant="secondary" className="w-full justify-start">
            Usuários
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="mb-6 text-2xl font-semibold">Usuarios</h1>
      </div>
    </div>
  );
};

export default UsersPage;
