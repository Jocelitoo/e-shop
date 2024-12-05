import { Container } from '@/components/Container';
import { HomeBanner } from '@/components/HomeBanner';
import { CategoryNav } from '@/components/CategoryNav';
import { ProductCard } from '@/components/ProductCard';
import { prisma } from '@/lib/prisma';

const getProducts = async () => {
  const products = await prisma.product.findMany({
    take: 6,
    include: { reviews: true },
    orderBy: { createdDate: 'desc' },
  });

  return products;
};

const Page = async () => {
  const products = await getProducts();

  return (
    <main className="flex-grow">
      <Container>
        <CategoryNav />
        <HomeBanner />
        <ProductCard products={products} />
      </Container>
    </main>
  );
};

export default Page;
