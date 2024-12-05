import { getCurrentUser } from '@/actions/getCurrentUser';
import { AdminNav } from '@/components/admin/AdminNav';
import { prisma } from '@/lib/prisma';
import { DataTable } from './data-table';
import { columns } from './columns';

const getData = async () => {
  const products = await prisma.product.findMany({
    orderBy: { createdDate: 'desc' },
  });

  return products;
};

const ManageProducts = async () => {
  const currentUser = await getCurrentUser(); // Pega os dados do usuário logado
  const data = await getData(); // Pega todos os produtos da base de dados

  return (
    <main className="flex-grow lg:py-4">
      <AdminNav />
      <DataTable columns={columns} data={data} currentUser={currentUser} />
    </main>
  );
};

export default ManageProducts;
