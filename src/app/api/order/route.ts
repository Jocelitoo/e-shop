import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl; // Pega os parâmetros
    const orderId = searchParams.get('id'); // Pega o parâmetro de nome 'id'

    if (orderId) {
      // Pegar apenas 1 order
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      return NextResponse.json(order);
    } else {
      // Pegar todas as orders
      const orders = await prisma.order.findMany();
      return NextResponse.json(orders);
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao retornar os pedido' },
      { status: 500 },
    );
  }
}

// Database --> {name: 'joão', idade: 20}
// put --> Atualizar um dado inteiro. Exemplo: {name: 'Carlos', age: 21} --> Atualizou o 'name' e 'age'
// patch --> Atualizar apenas uma parte do dado. Exemplo: {name: 'joão', age: 23} --> Atualizou apenas o 'age'

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, deliveryStatus } = body;

    await prisma.order.update({
      where: { id: id },
      data: { deliveryStatus: deliveryStatus },
    });

    return NextResponse.json('Pedido atualizado');
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao atualizar pedido' },
      { status: 500 },
    );
  }
}
