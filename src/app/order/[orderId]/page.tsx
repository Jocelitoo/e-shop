import { Container } from '@/components/Container';
import axios from 'axios';
import { OrderTable } from './OrderTable';
import { getCurrentUser } from '@/actions/getCurrentUser';

interface OrderParamsProps {
  orderId: string;
}

const url = process.env.URL;

// Pega os dados do pedido
const getOrder = async (orderId: string) => {
  const order = await axios
    .get(`${url}/api/order`, { params: { id: orderId } })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return order;
};

// Pega os dados do comprador
const getCustomer = async (userId: string) => {
  const customer = await axios
    .get(`${url}/api/user`, { params: { id: userId } })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return customer;
};

const Order = async ({ params }: { params: OrderParamsProps }) => {
  const currentUser = await getCurrentUser(); // Pegar os dados do usuário logado
  const { orderId } = params;

  const order = await getOrder(orderId); // Pedido
  const customer = await getCustomer(order.userId); // Usuário que fez o pedido

  return (
    <main className="flex-grow py-16">
      {/* Só quem pode ver detalhes de um pedido é um administrador ou o próprio usuário que fez o pedido  */}
      <Container>
        {order ? (
          currentUser?.role === 'ADMIN' || currentUser?.id === order.userId ? (
            <OrderTable
              order={order}
              customerName={customer.name}
              customerEmail={customer.email}
            />
          ) : (
            <h2 className="text-center text-3xl font-bold h-auto">
              Não autorizado
            </h2>
          )
        ) : (
          <h2 className="font-bold text-center text-2xl">
            Pedido não encontrado
          </h2>
        )}
      </Container>
    </main>
  );
};

export default Order;
