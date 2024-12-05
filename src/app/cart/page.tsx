import { getCurrentUser } from '@/actions/getCurrentUser';
import { CartFunctions } from '@/components/cart/CartFunctions';
import { CartTable } from '@/components/cart/CartTable';
import { Container } from '@/components/Container';
import React from 'react';

const Cart = async () => {
  const currentUser = await getCurrentUser();

  return (
    <main className="flex-grow py-8">
      <Container>
        <h1 className="text-center text-3xl font-bold">Carrinho de compras</h1>

        <CartTable />

        <CartFunctions currentUser={currentUser} />
      </Container>
    </main>
  );
};

export default Cart;
