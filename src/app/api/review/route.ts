import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, userName, productId, rating, comment } = body;

  const review = await prisma.review.create({
    data: {
      user: { connect: { id: userId } },
      product: { connect: { id: productId } },
      userName: userName,
      rating: rating,
      comment: comment,
    },
  });

  return NextResponse.json(review);
}
