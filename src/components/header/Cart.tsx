'use client';

import { useCartContext } from '@/hooks/CartContextProvider';
import { ShoppingCartIcon } from 'lucide-react';
import Link from 'next/link';

export const Cart = () => {
  const { cartItems } = useCartContext();

  const count = cartItems.reduce((acc, cartItem) => acc + cartItem.quantity, 0); // reduce percorre a lista de cartItems, somando a quantidade de cada item (cartItem) ao acumulador (acc) que começa em 0

  return (
    <Link
      href="/cart"
      className="py-2 px-4 rounded-md relative group transition-colors duration-300 hover:bg-slate-700"
    >
      <span className="sr-only">Carrinho de compras</span>
      <ShoppingCartIcon className="text-slate-700 transition-colors duration-300 group-hover:text-slate-200" />

      {count > 0 && (
        <span className="text-slate-200 bg-slate-700 size-6 rounded-full flex items-center justify-center absolute -top-1 right-0">
          {count}
        </span>
      )}
    </Link>
  );
};
