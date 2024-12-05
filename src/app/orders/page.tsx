import { Container } from '@/components/Container';
import { DataTable } from './data-table';
import { columns } from './columns';
import { getCurrentUser } from '@/actions/getCurrentUser';

const Orders = async () => {
  const currentUser = await getCurrentUser();

  return (
    <main className="flex-grow py-16">
      <Container>
        {currentUser &&
          (currentUser.orders ? (
            <DataTable columns={columns} data={currentUser.orders} />
          ) : (
            <h2 className="text-center font-bold text-2xl">
              Você ainda não fez nenhum pedido
            </h2>
          ))}
      </Container>
    </main>
  );
};

export default Orders;
