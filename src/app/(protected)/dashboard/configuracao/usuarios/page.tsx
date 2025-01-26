import { DataTable } from '@/components/DataTable/DataTable';
import { db } from '@/lib/db';

const Home = async () => {
  const users = await db.user.findMany();

  const data = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email ?? '',
    image: user.image ?? '',
    role: user.role,
    createdAt: user.createdAt
  }));

  return (
    <div className="container mx-auto">
      <h1 className="mb-4 text-2xl font-bold">User Management</h1>
      <DataTable data={data} />
    </div>
  );
};

export default Home;
