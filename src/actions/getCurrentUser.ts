import { handler } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getServerSession, Session } from 'next-auth';

export const getSession = async () => {
  return await getServerSession(handler);
};

export const getCurrentUser = async () => {
  try {
    const session = (await getSession()) as Session;

    if (!session?.user?.email) return null;

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session?.user?.email,
      },
      include: { orders: true, UserOTPVerification: true },
    });

    if (!currentUser) return null;

    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toString() || null,
    };
  } catch (error) {
    return null;
  }
};
