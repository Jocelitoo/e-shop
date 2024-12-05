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

export const sendOTPResetPassword = async (
  id: string,
  email: string,
  otpId: string | undefined,
) => {
  try {
    const otp = crypto.randomUUID(); // Gera uma string de 36 caracteres em formato hexadecimal
    const timestamp = Date.now() + 3600000; // Hora atual + 1 hora
    const formatedDate = dayjs(timestamp)
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'); // Formata a data pro formato que o MongoDB aceita

    const mailOptions = {
      from: user,
      to: email,
      subject: 'Alterar senha',
      html: `<p>Clique no botão abaixo para alterar sua senha</p><a href='${process.env.URL + '/resetPassword/' + id + '/' + otp}' style='background-color:#0af573;padding-left:1rem;padding-right:1rem;padding-top:0.5rem;padding-bottom:0.5rem;text-decoration:none;color:black;border-radius:0.375rem;margin-top:1rem;margin-bottom: 1rem;'>Alterar senha</a><p>Esse link <b>expira em 1 hora</b>.</p>`,
    };

    // Verificar se já existe um otp de resetPassword pro usuário, se houve delete
    if (otpId) {
      await prisma.resetPasswordOTPVerification.delete({
        where: { id: otpId },
      });
    }

    // Hash o otp
    const hashedOTP = await bcrypt.hash(otp, 10);

    // criar o otp na base de dados
    await prisma.resetPasswordOTPVerification.create({
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
