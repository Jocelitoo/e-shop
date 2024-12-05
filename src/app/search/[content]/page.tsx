import { Container } from '@/components/Container';
import { prisma } from '@/lib/prisma';
import { ClientContainer } from './ClientContainer';

const getProducts = async (content: string) => {
  const decodedContent = decodeURIComponent(content); // À codificação de URL transforma caracteres especiais (como acentos) em sequências percentuais. Então precisamos primeiro decodificar eles pra usarmos sem erro com palavras acentuadas

  // Prisma vai buscar produtos que contenham na sua name, category, description OU brand o texto digitado na barra de pesquisa isso tudo sem usar case sensitive, ou seja, 'Apple' === 'apple'
  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          name: { contains: decodedContent, mode: 'insensitive' },
        },
        {
          category: { contains: decodedContent, mode: 'insensitive' },
        },
        {
          description: { contains: decodedContent, mode: 'insensitive' },
        },
        {
          brand: { contains: decodedContent, mode: 'insensitive' },
        },
      ],
    },
    include: { reviews: true },
  });

  return products;
};

interface SearchParamsProps {
  content: string;
}

const Search = async ({ params }: { params: SearchParamsProps }) => {
  const { content } = params;

  const products = await getProducts(content);

  return (
    <main className="flex-grow mt-8">
      <Container>
        {products.length > 0 ? (
          <ClientContainer products={products} />
        ) : (
          <p className="text-center font-bold text-2xl">
            Nenhum produto encontrado
          </p>
        )}
      </Container>
    </main>
  );
};

export default Search;
