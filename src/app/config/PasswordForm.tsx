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
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z
  .object({
    password: z
      .string({ required_error: 'Campo SENHA não pode estar vazio' })
      .min(6, { message: 'Senha precisa ter no mínimo 6 digitos' }),
    newPassword: z
      .string({ required_error: 'Campo NOVA SENHA não pode estar vazio' })
      .min(6, { message: 'Nova senha precisa ter no mínimo 6 digitos' }),
    confirmNewPassword: z
      .string({ required_error: 'Campo CONFIRMAR SENHA não pode estar vazio' })
      .min(6, { message: 'Confirmar Senha precisa ter no mínimo 6 digitos' }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmNewPassword'], // Indica onde o erro será mostrado
  });

interface PasswordFormProps {
  userId: string;
}

export const PasswordForm: React.FC<PasswordFormProps> = ({ userId }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Ativar o carregamento
    setIsLoading(true);

    // Organizar dados
    const data = {
      password: values.password,
      newPassword: values.newPassword,
      confirmNewPassword: values.confirmNewPassword,
      userId: userId,
    };

    // Fazer a requisição
    axios
      .put('api/config/update-password', data)
      .then((response) => {
        form.setValue('password', '');
        form.setValue('newPassword', '');
        form.setValue('confirmNewPassword', '');
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
      .finally(() => setIsLoading(false));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 p-4 rounded-md border bg-slate-50 shadow-xl"
      >
        <h1 className="text-center font-bold text-2xl">Atualizar senha</h1>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha atual:</FormLabel>

              <FormControl>
                <Input
                  type="password"
                  {...field}
                  className="focus-visible:ring-offset-0"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova senha:</FormLabel>

              <FormControl>
                <Input
                  type="password"
                  {...field}
                  className="focus-visible:ring-offset-0"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar senha:</FormLabel>

              <FormControl>
                <Input
                  type="password"
                  {...field}
                  className="focus-visible:ring-offset-0"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {isLoading ? (
          <Button type="button" disabled className="w-full bg-slate-700">
            <Loader2 className="animate-spin" /> Atualizando senha...
          </Button>
        ) : (
          <Button type="submit" className="w-full bg-slate-700">
            Atualizar senha
          </Button>
        )}
      </form>
    </Form>
  );
};
