import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface PutBodyProps {
  name: string;
  userId: string;
}

export async function PUT(request: NextRequest) {
  try {
    // Pegar os dados enviados na requisição
    const body: PutBodyProps = await request.json();
    const { name, userId } = body;

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 },
      );
    }

    // Verificar se o nome já está em uso
    const nameAlreadyInUse = await prisma.user.findUnique({
      where: { name: name },
    });

    if (nameAlreadyInUse) {
      return NextResponse.json(
        { message: 'Esse nome já está em uso' },
        { status: 404 },
      );
    }

    // Verificar se o name tem o tamanho correto
    if (name.length < 2 || name.length > 20) {
      return NextResponse.json(
        { message: 'Nome precisa ter entre 2 e 20 caracteres' },
        { status: 404 },
      );
    }

    // Atualizar o nome do usuário
    await prisma.user.update({ where: { id: userId }, data: { name: name } });

    return NextResponse.json('Nome atualizado com sucesso');
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao atualizar nome' },
      { status: 500 },
    );
  }
}
