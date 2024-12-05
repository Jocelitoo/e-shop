import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

interface PutBodyProps {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
  userId: string;
}

export async function PUT(request: NextRequest) {
  try {
    // Pegar os dados vindo no body da requisição
    const body: PutBodyProps = await request.json();
    const { userId, password, newPassword, confirmNewPassword } = body;

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 },
      );
    }

    // Verificar o tamanho das senhas
    if (
      password.length < 6 ||
      newPassword.length < 6 ||
      confirmNewPassword.length < 6
    ) {
      return NextResponse.json(
        { message: 'Senha precisa ter no mínimo 6 caracteres' },
        { status: 404 },
      );
    }

    // Verificar se o password atual está correto
    const correctPassword = await bcrypt.compare(
      password,
      user.hashedPassword as string,
    );

    if (!correctPassword) {
      return NextResponse.json(
        { message: 'Senha atual inválida' },
        { status: 404 },
      );
    }

    // Verificar se newPassword e confirmNewPassword são iguais
    if (newPassword !== confirmNewPassword) {
      return NextResponse.json(
        { message: 'Nova senha e Confirmar senha precisam ser iguais' },
        { status: 404 },
      );
    }

    // Criptografar a nova senha
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar a nova senha
    await prisma.user.update({
      where: { id: userId },
      data: { hashedPassword: hashedNewPassword },
    });

    return NextResponse.json('Senha atualizada com sucesso');
  } catch {
    return NextResponse.json(
      { message: 'Erro ao atualizar senha' },
      { status: 500 },
    );
  }
}
