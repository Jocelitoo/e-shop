import { Container } from '@/components/Container';
import { prisma } from '@/lib/prisma';
import { ClientContainer } from './ClientContainer';
import { CategoryNav } from '@/components/CategoryNav';

const getProducts = async (category: string) => {
  if (category === 'All') {
    const products = await prisma.product.findMany({
      include: { reviews: true },
      orderBy: { createdDate: 'desc' },
    });

    return products;
  } else {
    const products = await prisma.product.findMany({
      where: { category: category },
      include: { reviews: true },
      orderBy: { createdDate: 'desc' },
    });

    return products;
  }
};

interface ProductsParamsProps {
  category: string;
}

const Products = async ({ params }: { params: ProductsParamsProps }) => {
  const { category } = params; // Pega o parâmetro enviado na URL
  const products = await getProducts(category);

  return (
    <main className="flex-grow">
      <Container>
        <CategoryNav category={category} />
        <ClientContainer products={products} />
      </Container>
    </main>
  );
};

export default Products;
