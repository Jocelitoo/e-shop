import dayjs from 'dayjs';
import nodemailer from 'nodemailer';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

dayjs.extend(utc);
dayjs.extend(timezone);

const user = process.env.MAILERSEND_USER;
const pass = process.env.MAILERSEND_PASS;

const transporter = nodemailer.createTransport({
  host: 'smtp.mailersend.net',
  port: 587,
  auth: { user: user, pass: pass },
});

export const sendOTPVerificationEmail = async (id: string, email: string) => {
  try {
    const otp = `${(1000 + Math.random() * 9000).toFixed(0)}`; // Gera 4 números aleatórios, a lógica aplicada aqui evita o número passar de 9999
    const timestamp = Date.now() + 3600000; // Hora atual + 1 hora
    const formatedDate = dayjs(timestamp)
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'); // Formata a data pro formato que o MongoDB aceita

    const mailOptions = {
      from: user,
      to: email,
      subject: 'Verifique seu Email',
      html: `<p>Digite <b>${otp}</b> no app para verificar seu endereço de email e completar o registro</p><p>Esse código <b>expira em 1 hora</b>.</p>`,
    };

    // Hash o otp
    const hashedOTP = await bcrypt.hash(otp, 10);

    // criar o otp na base de dados
    await prisma.userOTPVerification.create({
      data: {
        user: { connect: { id: id } },
        otp: hashedOTP,
        expiresAt: formatedDate,
      },
    });

    // Enviar email de confirmação pro usuário
    await transporter.sendMail(mailOptions);
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao enviar novo email' },
      { status: 500 },
    );
  }
};
