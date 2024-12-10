import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { extractPublicId } from 'cloudinary-build-url';
import { deleteImage } from '../sign-cloudinary-params/route';
import { ImageProps } from '@/utils/props';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, description, price, brand, category, inStock, images } = body;

    await prisma.product.create({
      data: {
        name,
        description,
        price,
        brand,
        category,
        inStock,
        images,
      },
    });

    return NextResponse.json('Produto criado com sucesso');
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao criar produto' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl; // Pega os parâmetros
  const productId = searchParams.get('id'); // Pega o parâmetro de nome 'id'

  if (productId) {
    // Retorna 1 produto
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    return NextResponse.json(product);
  } else {
    // Retorna todo os produtos
    const products = await prisma.product.findMany();

    return NextResponse.json(products);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, updatedProduct } = body.data;

    await prisma.product.update({
      where: { id: id },
      data: updatedProduct,
    });

    return NextResponse.json('Produto editado com sucesso');
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao atualizar produto' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id, images } = body;

  // Deleta o produto do banco de dados através do seu id
  const deletedProduct = await prisma.product.delete({
    where: { id: id },
  });

  // Faz o map das imagens para deletar uma por uma do cloudinary
  images.map((image: ImageProps) => {
    const imageId = extractPublicId(image.image); // Pega o id da imagem através da sua URL
    deleteImage(imageId); // Deleta a imagem
  });

  return NextResponse.json(deletedProduct);
}
