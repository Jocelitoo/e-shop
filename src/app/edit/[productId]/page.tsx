import { Container } from '@/components/Container';
import React from 'react';
import { EditForm } from './EditForm';
import { getCurrentUser } from '@/actions/getCurrentUser';
import axios from 'axios';

interface ParamsProps {
  productId?: string;
}

const url = process.env.URL; // URL do projeto, quando axios é usado em server side é precisa especificar a url antes da rota da api

const getProduct = async (productId: string | undefined) => {
  const product = await axios
    .get(`${url}/api/product`, { params: { id: productId } })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return product;
};

const Edit = async ({ params }: { params: ParamsProps }) => {
  const { productId } = params;

  const currentUser = await getCurrentUser(); // Pega os dados do usuário logado
  const product = await getProduct(productId); // Pega os dados do produto

  return (
    <main className="flex-grow py-16">
      {currentUser?.role === 'ADMIN' &&
        (product ? (
          <Container>
            <EditForm currentUser={currentUser} product={product} />
          </Container>
        ) : (
          <p className="text-center">Produto não encontrado</p>
        ))}
    </main>
  );
};

export default Edit;
