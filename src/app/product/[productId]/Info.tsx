'use client';

import { useCartContext } from '@/hooks/CartContextProvider';
import { useToast } from '@/hooks/use-toast';
import { CurrentUserProps, ProductProps, ReviewProps } from '@/utils/props';
import Image from 'next/image';
import React, { useState } from 'react';
import { Description } from './Description';
import { Separator } from '@/components/ui/separator';
import { ChooseColor } from './ChooseColor';
import { ProductQuantity } from './ProductQuantity';
import { Button } from '@/components/ui/button';
import { Reviews } from './Reviews';

interface InfoProps {
  product: ProductProps;
  currentUser: CurrentUserProps | null;
  reviews: ReviewProps[] | undefined;
  userAbleToReview: boolean;
}

export const Info: React.FC<InfoProps> = ({
  product,
  currentUser,
  reviews,
  userAbleToReview,
}) => {
  const { cartItems, setCartItems } = useCartContext();
  const { toast } = useToast();

  const [productQuantity, setProductQuantity] = useState(1);

  const [pickedImageUrl, setPickedImageUrl] = useState(() =>
    product ? product.images[0].image : '',
  );
  const [pickedImageColor, setPickedImageColor] = useState(() =>
    product ? product?.images[0].color : '',
  );

  const shuffleString = (str: string) => {
    let arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  };

  const createId = () => {
    const i1 = Date.now().toString();
    const i2 = Date.now().toString();

    const id = i1 + i2;
    const idEmbaralhado = shuffleString(id);

    return idEmbaralhado;
  };

  const addToCart = () => {
    // Dados do produto à ser adicionado no carrinho
    const newCartItem = {
      id: createId(),
      name: product.name,
      price: product.price,
      quantity: productQuantity,
      total: product.price * productQuantity,
      color: pickedImageColor,
      imageUrl: pickedImageUrl,
      inStock: product.inStock,
    };

    let updatedCartItems = cartItems.map((cartItem) => {
      // Se o item já estiver no carrinho, atualiza a quantidade e o total
      if (
        cartItem.name === newCartItem.name &&
        cartItem.color === newCartItem.color
      ) {
        const updatedQuantity = Math.min(
          cartItem.quantity + newCartItem.quantity, // Math.min garante que a quantidade não supere a inStock --> Ex: Math.min(8 + 8, 12) = retorna 12 pq 8 + 8 é 16 mas 12 é o 'teto máximo'
          cartItem.inStock,
        );

        return {
          ...cartItem,
          quantity: updatedQuantity,
          total: updatedQuantity * cartItem.price,
        };
      }

      return cartItem;
    });

    // Adiciona o novo item caso ele ainda não exista no carrinho
    if (
      !updatedCartItems.some(
        (item) =>
          item.name === newCartItem.name && item.color === newCartItem.color,
      )
    ) {
      updatedCartItems = [
        ...updatedCartItems,
        {
          ...newCartItem,
          quantity: Math.min(newCartItem.quantity, newCartItem.inStock), // Math.min garante que a quantidade não supere a inStock --> Ex: Math.min(8 + 8, 12) = retorna 12 pq 8 + 8 é 16 mas 12 é o 'teto máximo'
          total:
            Math.min(newCartItem.quantity, newCartItem.inStock) *
            newCartItem.price,
        },
      ];
    }

    sessionStorage.setItem('cartItems', JSON.stringify(updatedCartItems)); // Armazena os itens do carrinho de compras no sessionStorage para que permaneçam mesmo após a página ser recarregada
    setCartItems(updatedCartItems); // Armazena os itens do carrinho de compras

    toast({
      description: 'Produto adicionado ao carrinho',
      style: { backgroundColor: '#16a34a', color: '#fff' },
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:gap-8">
        <div className="aspect-square overflow-hidden relative w-full sm:w-1/2 sm:mx-auto lg:p-8">
          <Image
            src={pickedImageUrl}
            alt={product.name}
            fill
            className="w-full h-full object-contain lg:p-6"
          />
        </div>

        <div className="flex flex-col gap-2 w-full text-sm">
          <Description product={product} reviews={reviews} />

          <ChooseColor
            pickedImageColor={pickedImageColor}
            setPickedImageColor={setPickedImageColor}
            setPickedImageUrl={setPickedImageUrl}
            product={product}
          />

          <Separator className="my-1" />

          <ProductQuantity
            productQuantity={productQuantity}
            setProductQuantity={setProductQuantity}
            inStock={product.inStock}
          />

          <Separator className="my-1" />

          <Button
            type="button"
            className="w-fit bg-slate-700"
            disabled={
              productQuantity === 0 || productQuantity > product.inStock
            }
            onClick={() => addToCart()}
          >
            Adicionar ao carrinho
          </Button>
        </div>
      </div>

      <Reviews
        product={product}
        currentUser={currentUser}
        reviews={reviews}
        userAbleToReview={userAbleToReview}
      />
    </div>
  );
};
