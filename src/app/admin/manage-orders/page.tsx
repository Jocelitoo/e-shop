import { getCurrentUser } from '@/actions/getCurrentUser';
import { AdminNav } from '@/components/admin/AdminNav';
import { DataTable } from './data-table';
import { columns } from './columns';

// const getData = async () => {
//   return await fetch('http://localhost:3000/api/order', {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
//     .then(async (response) => {
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           errorData.error ? errorData.error.join(', ') : response.statusText,
//         );
//       }

//       return response.json(); // Converte a resposta para JSON
//     })
//     .then((result) => {
//       return result;
//     })
//     .catch((error) => {
//       alert(error.message);
//       console.error('Erro:', error.message); // Trata erros
//     });
// };

const ManageOrders = async () => {
  const currentUser = await getCurrentUser();
  // const orders = await getData();
  // console.log(orders);

  return (
    <main className="flex-grow lg:py-4">
      <AdminNav />
      {/* <DataTable columns={columns} data={orders} currentUser={currentUser} /> */}
      <DataTable columns={columns} currentUser={currentUser} />
    </main>
  );
};

export default ManageOrders;
