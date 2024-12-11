import { getCurrentUser } from '@/actions/getCurrentUser';
import { AdminNav } from '@/components/admin/AdminNav';
import { DataTable } from './data-table';
import { columns } from './columns';

const ManageOrders = async () => {
  const currentUser = await getCurrentUser();

  return (
    <main className="flex-grow lg:py-4">
      <AdminNav />
      <DataTable columns={columns} currentUser={currentUser} />
    </main>
  );
};

export default ManageOrders;
