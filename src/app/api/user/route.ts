import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { sendOTPVerificationEmail } from '@/actions/emailSender';

dayjs.extend(utc);
dayjs.extend(timezone);

// Function usada para pegar dados dos usuários
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl; // Pega os parâmetros
  const userId = searchParams.get('id'); // Pega o parâmetro de nome 'id'

  if (userId) {
    // Pegar apenas 1 user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return NextResponse.json(user);
  } else {
    // Pegar todos os users
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  }
}

// Function usada para criar novos usuários na base de dados
export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;

  const formErrorMsg = [];

  // Verificar se existe alguém com o mesmo email e name na base de dados
  const emailExists = await prisma.user.findUnique({ where: { email: email } }); // Prisma vai acessar o model(tabela) "user" e vai procurar se existe nessa tabela algum usuário com o mesmo email enviado na requisição
  const nameExists = await prisma.user.findUnique({ where: { name: name } });

  if (emailExists) formErrorMsg.push('Esse EMAIL já está em uso');
  if (nameExists) formErrorMsg.push('Esse NOME já está em uso');

  if (formErrorMsg.length > 0) {
    // Se houver algum erro, esse IF será TRUE
    return NextResponse.json(
      {
        // return terminará aqui a function mostrando a msg de erro
        errors: formErrorMsg,
      },
      { status: 500 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
      emailVerified: null,
    },
  });

  await sendOTPVerificationEmail(user.id, email);

  return NextResponse.json({
    status: 'Pendente',
    mensagem: 'Email de verificação enviado',
    data: {
      email: email,
    },
  });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, userId, otp } = body;

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { ResetPasswordOTPVerification: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 },
      );
    }

    // Verificar se o código otp expirou
    const timestamp = Date.now(); // Hora atual
    const expiringOtpDate = dayjs(
      user.ResetPasswordOTPVerification?.expiresAt,
    ).valueOf(); // Hora que o código otp vai expirar no formato de milisegundos

    const isOtpExpired = timestamp > expiringOtpDate; // Se a hora atual for maior que a hora que o otp vai expirar é pq ele já expirou

    if (isOtpExpired) {
      return NextResponse.json({ message: 'Código expirado' }, { status: 404 });
    }

    // Verificar se o código otp é o mesmo salvo na base de dados
    const hashedOtp = user.ResetPasswordOTPVerification?.otp as string;
    const validOtp = await bcrypt.compare(otp, hashedOtp);

    if (!validOtp) {
      return NextResponse.json(
        { message: 'Código incorreto' },
        { status: 404 },
      );
    }

    // Fazer o hash da nova senha
    const newPassword = await bcrypt.hash(password, 10);

    // Atualizar a senha do usuário
    await prisma.user.update({
      where: { id: userId },
      data: { hashedPassword: newPassword },
    });

    // Deletar o código otp da base de dados
    const otpId = user.ResetPasswordOTPVerification?.id as string;
    await prisma.resetPasswordOTPVerification.delete({ where: { id: otpId } });

    return NextResponse.json('Senha atualizada');
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao alterar senha' },
      { status: 500 },
    );
  }
}
