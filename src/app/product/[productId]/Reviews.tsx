'use client';

import React, { useState } from 'react';
import { UserRound } from 'lucide-react';
import { CurrentUserProps, ProductProps, ReviewProps } from '@/utils/props';
import { Rating } from '@/components/Rating';
import { ReviewForm } from './ReviewForm';
import dayjs from 'dayjs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface ReviewsProps {
  product: ProductProps;
  currentUser: CurrentUserProps | null;
  reviews: ReviewProps[] | undefined;
  userAbleToReview: boolean;
}

export const Reviews: React.FC<ReviewsProps> = ({
  product,
  currentUser,
  reviews,
  userAbleToReview,
}) => {
  const [reviewCount, setReviewCount] = useState(5); // Quantidade de reviews que vai aparecer

  // Verificar se o usuário já fez uma review para esse produto
  const currentUserHaveReview = reviews?.find((review) => {
    return review.userId === currentUser?.id;
  });

  const reviewsQuantity = reviews?.length || 0;
  const formatedReview = reviews?.slice(0, reviewCount) || []; // Controla a quantidade de reviews que vai aparecer

  return (
    <div className="mt-16 space-y-4">
      <h2 className="text-2xl font-bold">Avaliações do produto</h2>

      {/* Pra fazer uma review é preciso um usuário logado, que comprou e já recebeu o produto à ser avaliado e ainda não ter feito uma review para esse produto*/}
      {currentUser && userAbleToReview && !currentUserHaveReview && (
        <ReviewForm product={product} currentUser={currentUser} />
      )}

      <div className="space-y-4">
        {/* Verificar se existe algum review ou não */}
        {reviews && reviewsQuantity > 0 ? (
          formatedReview.map((review, index) => {
            return (
              <div key={index} className="flex flex-col gap-2 sm:w-1/2">
                <div className="flex items-center gap-4">
                  <UserRound />
                  <p className="font-semibold">{review.userName}</p>
                  <p>{dayjs(review.createdDate).format('DD/MM/YYYY')}</p>
                </div>

                <Rating count={5} value={review.rating} />
                <p>{review.comment}</p>
                <Separator />
              </div>
            );
          })
        ) : (
          <p>0 avaliações</p>
        )}
      </div>

      {reviewCount < reviewsQuantity && (
        <Button
          onClick={() => setReviewCount((previousValue) => previousValue + 5)}
          className="bg-slate-700"
        >
          Veja mais avaliações
        </Button>
      )}
    </div>
  );
};
