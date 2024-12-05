'use client';

import { useCartContext } from '@/hooks/CartContextProvider';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { LoadingScreen } from '../LoadingScreen';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { CheckoutForm } from './CheckoutForm';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

export const CheckoutClient = () => {
  const { cartItems, paymentIntent, handleSetPaymentIntent } = useCartContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Criar um paymentIntent no momento que a página /checkout for carregada e cartItems tiver sido recebido
    if (cartItems && cartItems.length > 0) {
      setIsLoading(true);
      setError(false);

      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          payment_intent_id: paymentIntent,
        }),
      })
        .then((res) => {
          setIsLoading(false);
          if (res.status === 401) {
            return router.push('/login'); // Se o usuário estiver deslogado, redireciona ele para a tela de login
          }
          return res.json();
        })
        .then((data) => {
          setClientSecret(data.paymentIntent.client_secret);
          handleSetPaymentIntent(data.paymentIntent.id);
        })
        .catch((error) => {
          setError(true);
          console.log('Error:', error);
          toast({
            description: 'Alguma coisa deu errado',
            style: { backgroundColor: '#dd1212', color: '#fff' },
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      labels: 'floating',
    },
  };

  const handleSetPaymentSuccess = useCallback((value: boolean) => {
    setPaymentSuccess(value);
  }, []);

  return (
    <main className="flex-grow w-full flex flex-col justify-center items-center mt-16 ">
      {isLoading && <LoadingScreen text="Carregando..." />}

      {error && (
        <div className="text-center text-[#dd1212] mt-4">
          Alguma coisa deu errado
        </div>
      )}

      {clientSecret && cartItems.length > 0 && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            clientSecret={clientSecret}
            handleSetPaymentSuccess={handleSetPaymentSuccess}
          />
        </Elements>
      )}

      {paymentSuccess && (
        <div className="flex flex-col gap-4 items-center">
          <p className="text-green-600 text-xl">Pagamento bem sucedido</p>

          <a
            href="/orders"
            className="bg-slate-700 text-white w-fit px-4 py-2 rounded-md transition-colors duration-300 hover:bg-slate-800"
          >
            Veja seus pedidos
          </a>
        </div>
      )}
    </main>
  );
};
