'use client';

import { useCartContext } from '@/hooks/CartContextProvider';
import { useToast } from '@/hooks/use-toast';
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

interface CheckoutFormProps {
  clientSecret: string;
  // eslint-disable-next-line no-unused-vars
  handleSetPaymentSuccess: (value: boolean) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  clientSecret,
  handleSetPaymentSuccess,
}) => {
  const { cartItems, setCartItems, handleSetPaymentIntent } = useCartContext();
  const [isLoading, setIsloading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }

    handleSetPaymentSuccess(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripe, clientSecret]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsloading(true);

    stripe
      .confirmPayment({
        elements,
        redirect: 'if_required',
      })
      .then((result) => {
        if (!result.error) {
          toast({
            description: 'Sucesso',
            style: { backgroundColor: '#16a34a', color: '#fff' },
          });

          // Limpar o carrinho
          sessionStorage.setItem('cartItems', JSON.stringify([]));
          setCartItems([]);

          handleSetPaymentSuccess(true);
          handleSetPaymentIntent(null);
        }

        setIsloading(false);
      });
  };

  const total = cartItems.reduce((acc, cartItem) => acc + cartItem.total, 0); // reduce percorre a lista de cartItems, somando o valor total de cada item (cartItem) ao acumulador (acc) que começa em 0

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl border border-slate-200 rounded-md p-4 space-y-4"
    >
      <h1 className="font-bold text-xl text-center">Insira seus dados</h1>

      <div>
        <h2 className="font-semibold mb-2">Endereço</h2>
        <AddressElement
          options={{
            mode: 'shipping',
            allowedCountries: ['BR'],
          }}
        />
      </div>

      <div>
        <h2 className="font-semibold mb-2">Informações de pagamento</h2>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      <p className="text-center text-xl font-bold">
        Total: R${total.toFixed(2)}
      </p>

      {isLoading ? (
        <Button disabled className="w-full space-x-1">
          <Loader2 className="animate-spin" />
          <span>Processando...</span>
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={!stripe || !elements || cartItems.length === 0}
          className="w-full hover:bg-green-600"
        >
          Pagar
        </Button>
      )}
    </form>
  );
};
