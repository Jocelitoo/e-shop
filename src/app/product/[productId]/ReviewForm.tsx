'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { CurrentUserProps, ProductProps } from '@/utils/props';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  comment: z
    .string({ required_error: 'É preciso no mínimo 10 letras' })
    .min(10, { message: 'É preciso no mínimo 10 letras' })
    .max(200, { message: 'A avaliação não pode ter mais do que 200 letras' }),
  rating: z.coerce.number({ message: 'Dê uma nota' }).min(1).max(5),
});

interface ReviewFormProps {
  product: ProductProps;
  currentUser: CurrentUserProps | null;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  product,
  currentUser,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newReview = {
      userId: currentUser?.id,
      userName: currentUser?.name,
      productId: product.id,
      rating: values.rating,
      comment: values.comment,
    };

    setIsLoading(true);

    await axios
      .post('/api/review', newReview)
      .then(() => {
        router.refresh(); // Recarrega a página
        form.setValue('comment', '');
        form.setValue('rating', 0);

        toast({
          description: 'Avaliação enviada com sucesso',
          style: { backgroundColor: '#16a34a', color: '#fff' },
        });
      })
      .catch((error) => {
        toast({
          description: error.response.data,
          style: { backgroundColor: '#dd1212', color: '#fff' },
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <textarea
                  placeholder="Digite aqui sua avaliação"
                  {...field}
                  rows={4}
                  className="border border-slate-200 p-4 w-full max-w-2xl rounded-md focus-visible:ring-offset-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex">
                  <Star
                    onClick={() => form.setValue('rating', 1)}
                    className={`cursor-pointer size-6 ${field.value >= 1 && 'fill-orange-400'}`}
                  />
                  <Star
                    onClick={() => form.setValue('rating', 2)}
                    className={`cursor-pointer size-6 ${field.value >= 2 && 'fill-orange-400'}`}
                  />
                  <Star
                    onClick={() => form.setValue('rating', 3)}
                    className={`cursor-pointer size-6 ${field.value >= 3 && 'fill-orange-400'}`}
                  />
                  <Star
                    onClick={() => form.setValue('rating', 4)}
                    className={`cursor-pointer size-6 ${field.value >= 4 && 'fill-orange-400'}`}
                  />
                  <Star
                    onClick={() => form.setValue('rating', 5)}
                    className={`cursor-pointer size-6 ${field.value >= 5 && 'fill-orange-400'}`}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isLoading ? (
          <Button disabled>
            <Loader2 className="animate-spin" />
            Enviando avaliação...
          </Button>
        ) : (
          <Button type="submit">Enviar avaliação</Button>
        )}
      </form>
    </Form>
  );
};
