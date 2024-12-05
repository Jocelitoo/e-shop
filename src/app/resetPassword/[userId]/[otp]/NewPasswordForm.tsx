'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z
  .object({
    password: z
      .string({ required_error: 'A senha precisa ter no mínimo 6 digitos' })
      .min(6, { message: 'A senha precisa ter no mínimo 6 digitos' }),
    confirmPassword: z
      .string({
        required_error: 'Confirmar senha precisa ter no mínimo 6 digitos',
      })
      .min(6, { message: 'Confirmar senha precisa ter no mínimo 6 digitos' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'], // Indica onde o erro será mostrado
  });

interface NewPasswordFormProps {
  userId: string;
  otp: string;
}

export const NewPasswordForm: React.FC<NewPasswordFormProps> = ({
  userId,
  otp,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    axios
      .put('/api/user', {
        password: values.password,
        userId: userId,
        otp: otp,
      })
      .then((response) => {
        router.push('/login'); // Redireciona o usuário para a tela de login

        toast({
          description: response.data,
          style: { backgroundColor: '#16a34a', color: '#fff' },
        });
      })
      .catch((error) => {
        toast({
          description: error.response.data.message,
          style: { backgroundColor: '#dd1212', color: '#fff' },
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Form {...form}>
      <div className="p-4 w-full max-w-lg mx-auto mt-8 rounded-md space-y-4 bg-slate-50 shadow-xl">
        <p className="text-center">Digite sua nova senha</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova senha:</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar nova senha:</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isLoading ? (
            <Button type="button" disabled className="w-full bg-slate-700">
              <Loader2Icon className="animate-spin" /> Atualizando senha...
            </Button>
          ) : (
            <Button type="submit" className="w-full bg-slate-700">
              Atualizar senha
            </Button>
          )}
        </form>
      </div>
    </Form>
  );
};
