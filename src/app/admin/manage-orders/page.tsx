import { getCurrentUser } from '@/actions/getCurrentUser';
import { AdminNav } from '@/components/admin/AdminNav';
import { prisma } from '@/lib/prisma';
import { DataTable } from './data-table';
import { columns } from './columns';

const getData = async () => {
  const orders = prisma.order.findMany(); // Pega todos os pedidos

  return orders;
};

const ManageOrders = async () => {
  const currentUser = await getCurrentUser();
  const data = await getData();

  return (
    <main className="flex-grow lg:py-4">
      <AdminNav />
      <DataTable columns={columns} data={data} currentUser={currentUser} />
    </main>
  );
};

export default ManageOrders;
