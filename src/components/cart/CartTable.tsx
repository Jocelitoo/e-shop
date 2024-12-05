'use client';

import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useCartContext } from '@/hooks/CartContextProvider';
import { CartItemProps } from '@/utils/props';

export const CartTable = () => {
  const { cartItems, setCartItems } = useCartContext();

  const removeCartItem = (removeCartItemId: string) => {
    setCartItems((prevCartItems) => {
      // Remover do array o item que tem o mesmo id enviado no parâmetro através do método filter()
      const updatedCartItems = prevCartItems.filter(
        (cartItem) => cartItem.id !== removeCartItemId,
      );

      // Salva os dados na session storage que são os dados que ficam salvos enquanto a página estiver aberta. Assim n precisamos gastar requisições ao backend nem salvar por longos períodos de tempo no localStorage
      sessionStorage.setItem(`cartItems`, JSON.stringify(updatedCartItems));

      return updatedCartItems;
    });
  };

  const addQuantity = (itemId: string) => {
    const updatedCartItems = cartItems.map((cartItem) => {
      // Verificar se o item que está sofrendo map tem o mesmo id do item que vai receber aumento
      if (cartItem.id === itemId) {
        // Clonar o item e atualizar seus dados que sofreram alteração
        const updatedItem = {
          ...cartItem,
          quantity: cartItem.quantity + 1,
          total: (cartItem.quantity + 1) * cartItem.price,
        };

        return updatedItem;
      }

      return cartItem;
    });

    sessionStorage.setItem('cartItems', JSON.stringify(updatedCartItems)); // Enviar para a sessionStorage a nova versão de cartItems com a quantidade do item alterado
    setCartItems(updatedCartItems); // Usamos para vermos a mudança em tempo real
  };

  const decreaseQuantity = (itemId: string) => {
    const updatedCartItems = cartItems.map((cartItem) => {
      // Verificar se o item que está sofrendo map tem o mesmo id do item que vai diminuir
      if (cartItem.id === itemId) {
        // Clonar o item e atualizar seus dados que sofreram alteração
        const updatedItem = {
          ...cartItem,
          quantity: cartItem.quantity - 1,
          total: (cartItem.quantity - 1) * cartItem.price,
        };

        return updatedItem;
      }

      return cartItem;
    });

    sessionStorage.setItem('cartItems', JSON.stringify(updatedCartItems)); // Enviar para a sessionStorage a nova versão de cartItems com a quantidade do item alterado
    setCartItems(updatedCartItems); // Usamos para vermos a mudança em tempo real
  };

  // Corrigir, caso a quantidade do item supere a quantidade em estoque
  const fixOut = (item: CartItemProps) => {
    const updatedCartItems = cartItems.map((cartItem) => {
      if (cartItem === item) {
        const updatedItem = {
          ...cartItem,
          quantity: cartItem.inStock,
          total: cartItem.inStock * cartItem.price,
        };

        return updatedItem;
      }

      return cartItem;
    });

    sessionStorage.setItem('cartItems', JSON.stringify(updatedCartItems)); // Enviar para a sessionStorage a nova versão de cartItems com a quantidade do item alterado
    setCartItems(updatedCartItems); // Usamos para vermos a mudança em tempo real

    return item.inStock;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Produto</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>Quantidade</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {cartItems.length !== 0 ? (
          cartItems.map((item, index) => {
            return (
              <TableRow key={index}>
                <TableCell className="flex gap-2">
                  <div className="aspect-square overflow-hidden relative w-[100px]">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex flex-col justify-between gap-1">
                    <p className="line-clamp-1 max-w-[150px] md:max-w-[200px] lg:max-w-[250px]">
                      {item.name}
                    </p>
                    <p>{item.color}</p>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeCartItem(item.id)}
                      className="border-[#f31260]"
                    >
                      <Trash2 className="text-[#f31260]" />
                    </Button>
                  </div>
                </TableCell>

                <TableCell>R$ {item.price.toFixed(2)}</TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={item.quantity === 1}
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      -
                    </Button>

                    <p>
                      {item.quantity > item.inStock
                        ? fixOut(item)
                        : item.quantity}
                    </p>

                    <Button
                      variant="outline"
                      size="icon"
                      disabled={item.quantity >= item.inStock}
                      onClick={() => addQuantity(item.id)}
                    >
                      +
                    </Button>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  R$ {item.total.toFixed(2)}
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center space-y-4">
              <p className="text-xl">Nenhum produto encontrado</p>

              <Link href="/" className="flex justify-center hover:underline">
                <ArrowLeft size={20} /> Ir às compras
              </Link>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
