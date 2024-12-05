'use client';

import { CartItemProps } from '@/utils/props';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface CartContextProps {
  cartItems: CartItemProps[];
  setCartItems: Dispatch<SetStateAction<CartItemProps[]>>;
  paymentIntent: String | null;
  handleSetPaymentIntent: (val: string | null) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartContextProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItemProps[]>([]);
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);

  // Código executado 1 vez quando a página é carregada e toda vez que cartItems sofrer alguma alteração
  useEffect(() => {
    cartItems.map((cartItem) => {
      // Verificar se algum item do carrinho tem quantidade igual a 0 ou menor
      if (cartItem.quantity <= 0) {
        setCartItems((prevCartItems) => {
          // Remover do array o item que tem o mesmo id do item com quantidade 0 ou menor
          const updatedCartItems = prevCartItems.filter(
            (prevCartItem) => prevCartItem.id !== cartItem.id,
          );

          // Salva os dados na session storage que são os dados que ficam salvos enquanto a página estiver aberta. Assim n precisamos gastar requisições ao backend nem salvar por longos períodos de tempo no localStorage
          sessionStorage.setItem(`cartItems`, JSON.stringify(updatedCartItems));
          return updatedCartItems;
        });
      }
    });
  }, [cartItems]);

  // Código executado 1 vez quando a página é carregada
  useEffect(() => {
    // Next.js renderiza no lado do servidor e do cliente. sessionStorage só existe no lado do cliente, como o Next.js começa a renderizar no lado do servidor onde sessionStorage n existe, pode dar erro no programa, por isso o if()
    if (typeof window !== 'undefined') {
      const storedCartItems = sessionStorage.getItem('cartItems');
      setCartItems(storedCartItems ? JSON.parse(storedCartItems) : []);

      const eShopPaymentIntent: any =
        sessionStorage.getItem('eShopPaymentIntent');
      const paymentIntent: string | null = JSON.parse(eShopPaymentIntent);
      setPaymentIntent(paymentIntent);
    }
  }, []);

  const handleSetPaymentIntent = useCallback(
    (val: string | null) => {
      setPaymentIntent(val);
      sessionStorage.setItem('eShopPaymentIntent', JSON.stringify(val));
    },
    [paymentIntent],
  );

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, paymentIntent, handleSetPaymentIntent }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCartContext must be used within a CartContextProvider');
  }

  return context;
};
