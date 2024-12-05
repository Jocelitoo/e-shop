import { Container } from '@/components/Container';
import { Info } from './Info';
import { getCurrentUser } from '@/actions/getCurrentUser';
import { prisma } from '@/lib/prisma';

interface ProductParamsProps {
  productId?: string;
}

const getProduct = async (productId: string | undefined) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { reviews: true },
  });

  return product;
};

const Product = async ({ params }: { params: ProductParamsProps }) => {
  const { productId } = params;

  const currentUser = await getCurrentUser();
  const product = await getProduct(productId);

  const reviews = product?.reviews;
  let userAbleToReview = false;

  if (currentUser) {
    const currentUserOrders = currentUser.orders; // Pega os pedidos do usuário logado

    // Pega individualmente cada pedido do usuário logado
    currentUserOrders.map((currentUserOrder) => {
      // Verifica os pedidos que tem o deliveryStatus como 'Entregue'
      if (currentUserOrder.deliveryStatus === 'Entregue') {
        // Pega os produtos dos pedidos que tem o deliveryStatus como 'Entregue'
        currentUserOrder.products.map((orderProduct) => {
          // Verifica se algum dos produtos do pedido tem o mesmo nome do produto que está aberto na página
          if (orderProduct.name === product?.name) {
            // Se o usuário for alguém que já tiver comprado e recebido o produto, então ele está apto para avaliar
            userAbleToReview = true;
          }
        });
      }
    });
  }

  return (
    <main className="flex-grow py-16">
      <Container>
        {product ? (
          <Info
            product={product}
            currentUser={currentUser}
            reviews={reviews}
            userAbleToReview={userAbleToReview}
          />
        ) : (
          <h2 className="text-center text-3xl font-bold h-auto">
            Produto não encontrado
          </h2>
        )}
      </Container>
    </main>
  );
};

export default Product;
