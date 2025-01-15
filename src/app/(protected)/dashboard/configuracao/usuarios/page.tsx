// pages/(protected)/dashboard/configuracao/usuarios/page.tsx

import { DataTable } from '@/components/DataTable/DataTable';
import { db } from '@/lib/db';

const Home = async () => {
  // Buscando os dados dos usuários usando o Prisma
  const users = await db.user.findMany();

  // Mapeando os dados no formato esperado pela tabela
  const data = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email ?? '',
    image: user.image ?? '',
    role: user.role,
    createdAt: user.createdAt
  }));

  // Função para deletar um usuário

  return (
    <div className="container mx-auto">
      <h1 className="mb-4 text-2xl font-bold">User Management</h1>
      <DataTable data={data} />
    </div>
  );
};

export default Home;
