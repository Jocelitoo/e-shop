import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { sendOTPVerificationEmail } from '@/actions/emailSender';

dayjs.extend(utc);
dayjs.extend(timezone);

// Verifica se o código otp enviado é correto
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get('userId') as string; // Pega o valor chamado userId enviado como parâmetro na url
    const otp = searchParams.get('otp') as string; // Pega o valor chamado otp enviado como parâmetro na url

    // Verificar se o usuário existe na base de dados e incluir o UserOTPVerification
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { UserOTPVerification: true },
    });

    if (!user || !user.UserOTPVerification) {
      return NextResponse.json(
        { message: 'Usuário ou verificação de OTP não encontrado' },
        { status: 404 },
      );
    }

    // Verificar se o código expirou
    const timestamp = Date.now(); // Hora atual
    const expiringOtpDate = dayjs(user.UserOTPVerification.expiresAt).valueOf(); // Hora que o código otp vai expirar no formato de milisegundos

    const isOtpExpired = timestamp > expiringOtpDate; // Se a hora atual for maior que a hora que o otp vai expirar é pq ele já expirou

    if (isOtpExpired) {
      return NextResponse.json({ message: 'Código expirado' }, { status: 404 });
    }

    // Verificar se o código otp enviado tem o mesmo valor que o hashedOtp salvo na base de dados
    const HashedOtp = user.UserOTPVerification.otp; // Pega o hashedOtp salvo na base de dados que está relacionado ao usuário
    const validOtp = await bcrypt.compare(otp, HashedOtp);

    if (!validOtp) {
      return NextResponse.json(
        { message: 'Código incorreto' },
        { status: 404 },
      );
    }

    // Atualizar o usuário na base de dados
    const formatedDate = dayjs(timestamp)
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'); // Formata a data pro formato que o MongoDB aceita

    await prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: formatedDate,
      },
    });

    // Deletar o otp salvo na base de dados
    const otpId = user.UserOTPVerification.id;
    await prisma.userOTPVerification.delete({
      where: { id: otpId },
    });

    return NextResponse.json('Usuário validado');
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao validar usuário' },
      { status: 500 },
    );
  }
}

// Deleta o antigo otp e cria um novo
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userEmail, optId } = body; // Pegao userId, userEmail e optId enviado no body da requisição

    // Verificar se o usuário existe na base de dados
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { UserOTPVerification: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 },
      );
    }

    // Deletar a antiga otp salva na base de dados
    await prisma.userOTPVerification.delete({ where: { id: optId } });

    // Enviar email com o novo código otp
    await sendOTPVerificationEmail(userId, userEmail);

    return NextResponse.json('Novo código enviado');
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao enviar novo email' },
      { status: 500 },
    );
  }
}
