import { sendOTPResetPassword } from '@/actions/resetPasswordEmailSender';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body.data; // Pega o email no body da requisição

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email: email },
      include: { ResetPasswordOTPVerification: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 },
      );
    }

    // Enviar o email com o link pra alterar senha
    const otpId = user.ResetPasswordOTPVerification?.id; // Retornará o id do otp caso o usuário já tenha um (será usado para deletar o otp existente) ou undefined caso o usuário n tenha

    await sendOTPResetPassword(user.id, email, otpId);

    return NextResponse.json('Email enviado');
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao enviar email' },
      { status: 500 },
    );
  }
}
