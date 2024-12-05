'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { useCartContext } from '@/hooks/CartContextProvider';
import { CurrentUserProps } from '@/utils/props';
import React from 'react';

interface CartFunctionsProps {
  currentUser: CurrentUserProps | null;
}

export const CartFunctions: React.FC<CartFunctionsProps> = ({
  currentUser,
}) => {
  const { cartItems, setCartItems } = useCartContext();
  const isUserLogged = currentUser;

  const subtotal = cartItems.reduce((acc, cartItem) => acc + cartItem.total, 0); // reduce percorre a lista de cartItems, somando o valor total de cada item (cartItem) ao acumulador (acc) que começa em 0

  const clearCartItems = () => {
    sessionStorage.setItem('cartItems', JSON.stringify([])); // Enviar para a sessionStorage o cartItems vazio
    setCartItems([]); // Usamos para vermos a mudança em tempo real
  };

  return cartItems.length !== 0 ? (
    <>
      <div className="flex flex-col gap-12 mt-4 sm:flex-row sm:justify-between">
        <Button
          onClick={() => clearCartItems()}
          className="w-fit bg-slate-700 transition-colors duration-300 hover:bg-[#f31260]"
        >
          Limpar carrinho
        </Button>

        <div className="flex flex-col gap-2 ">
          <div className="flex items-center justify-between w-full font-bold">
            <p>Subtotal</p>

            <p className="text-lg">R${subtotal.toFixed(2)}</p>
          </div>

          <p>Taxas e valor de entrega calculados no checkout</p>

          {isUserLogged ? (
            <Link
              href="/checkout"
              className="bg-slate-700 text-white py-2 text-center rounded-md hover transition-colors duration-300 hover:bg-green-600"
            >
              Checkout
            </Link>
          ) : (
            <Link
              href="/login"
              className="bg-slate-700 text-white py-2 text-center rounded-md hover transition-colors duration-300 hover:bg-slate-800"
            >
              Faça login
            </Link>
          )}

          <Link href="/" className="flex items-center hover:underline">
            <ArrowLeft size={20} /> Continuar comprando
          </Link>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};
