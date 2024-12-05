'use client';

import React from 'react';
import { ProductProps, ReviewProps } from '@/utils/props';
import { Rating } from '@/components/Rating';

interface DescriptionProps {
  product: ProductProps;
  reviews: ReviewProps[] | undefined;
}

export const Description: React.FC<DescriptionProps> = ({
  product,
  reviews,
}) => {
  let reviewsQuantity = 0; // Quantidade de reviews
  let stars = 0; // Quantidade total de estrelas

  if (reviews) {
    reviewsQuantity = reviews.length;

    reviews.map((review) => {
      stars += review.rating;
    });
  }

  const ratingValue = Number((stars / reviewsQuantity).toFixed(2)); // Calcula a média da avaliação do produto

  return (
    <>
      <h2 className="text-3xl">{product.name}</h2>

      <p className="font-semibold text-3xl">R$ {product.price?.toFixed(2)}</p>

      <div className="flex items-center gap-4">
        <Rating count={5} value={ratingValue} />

        <p>{reviewsQuantity} Avaliações</p>
      </div>

      <p className="text-justify">{product.description}</p>

      <p>
        <span className="font-semibold uppercase">Categória:</span>{' '}
        {product.category}
      </p>

      <p>
        <span className="font-semibold uppercase">Marca:</span> {product.brand}
      </p>

      {product.inStock > 0 ? (
        <p className="text-green-600">{product.inStock} no estoque</p>
      ) : (
        <p className="text-red-600">Sem estoque</p>
      )}
    </>
  );
};
