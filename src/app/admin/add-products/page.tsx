import { getCurrentUser } from '@/actions/getCurrentUser';
import { AddProduct } from '@/components/admin/AddProduct';
import { AdminNav } from '@/components/admin/AdminNav';

const AddProducts = async () => {
  const currentUser = await getCurrentUser(); // Pega os dados do usuário logado

  return (
    <main className="flex-grow lg:py-4">
      <AdminNav />
      <AddProduct currentUser={currentUser} />
    </main>
  );
};

export default AddProducts;
