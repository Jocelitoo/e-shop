import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { CartItemProps } from '@/utils/props';
import { getCurrentUser } from '@/actions/getCurrentUser';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

const calculateOrderAmount = (items: CartItemProps[]) => {
  const totalPrice = items.reduce((acc, item) => acc + item.total, 0); // Soma o valor de acc com o valor total de cada item, acc começa com valor 0

  return Math.round(totalPrice * 100); // Stripe recebe os valores em centavos, então é preciso multiplicar por 100. 120 centavos * 100 = 1.20
};

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { items, payment_intent_id } = body;
  const total = calculateOrderAmount(items);

  const orderData = {
    user: { connect: { id: currentUser.id } },
    amount: total,
    currency: 'brl', // minúscula
    status: 'Pendente',
    deliveryStatus: 'Pendente',
    paymentIntentId: payment_intent_id,
    products: items,
  };

  if (payment_intent_id) {
    const current_intent =
      await stripe.paymentIntents.retrieve(payment_intent_id);

    if (current_intent) {
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        { amount: total },
      );

      // Verificar se o pedido existe antes de tentar atualizar
      const existing_order = await prisma.order.findFirst({
        where: { paymentIntentId: payment_intent_id },
      });

      if (!existing_order) {
        await prisma.order.create({
          data: orderData,
        });
      } else {
        // Atualizar o pedido
        await prisma.order.update({
          where: { id: existing_order.id }, // usa o id do pedido encontrado
          data: {
            amount: total,
            products: items,
          },
        });
      }

      return NextResponse.json({ paymentIntent: updated_intent });
    }
  } else {
    // Criar o intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'brl',
      automatic_payment_methods: { enabled: true },
    });

    // Criar o pedido
    orderData.paymentIntentId = paymentIntent.id;

    await prisma.order.create({
      data: orderData,
    });

    return NextResponse.json({ paymentIntent });
  }

  return NextResponse.error();
}
