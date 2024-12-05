'use client';

import { Rating } from '@/components/Rating';
import Image from 'next/image';
import Link from 'next/link';
import { ProductProps } from '@/utils/props';
import React from 'react';

interface ProductCardProps {
  products: ProductProps[];
}

export const ProductCard: React.FC<ProductCardProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 gap-8 min-[350px]:grid-cols-2 min-[550px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {products.map((product, index) => {
        const reviewsQuantity = product.reviews?.length || 0;

        const stars =
          product.reviews?.reduce((ac, review) => {
            ac += review.rating;
            return ac;
          }, 0) || 0;

        const ratingValue = stars / reviewsQuantity;

        return (
          <Link
            href={`/product/${product.id}`}
            key={index}
            className="bg-slate-50 border border-slate-200 p-2 rounded-sm transition-transform hover:scale-105"
          >
            <div className="aspect-square overflow-hidden relative w-full">
              <Image
                src={product.images[0].image}
                alt={product.name}
                fill
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-center text-sm mt-4 space-y-1">
              <p className="line-clamp-1">{product.name}</p>

              <div className="flex justify-center">
                <Rating count={5} value={ratingValue} />
              </div>

              <p>Avaliações: {reviewsQuantity} </p>
              <p className="font-semibold">R$ {product.price.toFixed(2)}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
