'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { CurrentUserProps } from '@/utils/props';

const formSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Nome precisa ter no mínimo 2 digitos' })
      .max(20, { message: 'Nome só pode ter no máximo 20 caracteres' }),

    email: z.string().email({
      message: 'Email invalido',
    }),

    password: z
      .string()
      .min(6, { message: 'A senha precisa ter no mínimo 6 digitos' }),

    confirmPassword: z
      .string()
      .min(6, { message: 'A senha precisa ter no mínimo 6 digitos' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'], // Indica onde o erro será mostrado
  });

interface RegisterFormProps {
  currentUser: CurrentUserProps | null;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ currentUser }) => {
  const { toast } = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Redirecionar o usuário logado para fora do /login
  useEffect(() => {
    if (currentUser) {
      router.push('/cart'); // Redireciona para o cart
      router.refresh(); // Recarrega a página atual
    }
  }, [currentUser, router]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    axios
      .post('/api/user', values) // Executa o POST presente no arquivo /api/user que vai ser responsável por criar uma nova conta na base de dados
      .then(() => {
        toast({
          description: 'Conta criada',
          style: { backgroundColor: '#16a34a', color: '#fff' },
        });

        // Fazer login na conta que acabou de ser criada
        signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        }).then((callback) => {
          if (callback?.ok) {
            router.push('/verifyOTP'); // Redireciona para a página de verificação de OTP
            router.refresh();

            toast({
              description: 'Usuário logado',
              style: { backgroundColor: '#16a34a', color: '#fff' },
            });
          }

          if (callback?.error) {
            toast({
              description: callback.error,
              style: { backgroundColor: '#dd1212', color: '#fff' },
            });
          }
        });
      })
      .catch((error) => {
        error.response.data.errors.map((error: string) => {
          toast({
            description: error,
            style: { backgroundColor: '#dd1212', color: '#fff' },
          });
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (currentUser) {
    return <p>Usuário logado, redirecionando...</p>;
  }

  return (
    <Form {...form}>
      <div className="flex flex-col gap-4 p-4 rounded-sm w-full min-w-[250px] max-w-[500px] bg-slate-50 shadow-xl">
        <h1 className="font-bold text-xl text-center">Registrar-se</h1>

        {/* <Button
          type="button"
          variant={'outline'}
          onClick={() => signIn('google')}
          className="transition-colors duration-300 hover:bg-slate-200"
        >
          Registrar-se com o Google
        </Button> */}

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Nome:</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    className="focus-visible:ring-offset-0 transition-all duration-200"
                  />
                </FormControl>
                <FormDescription className="hidden">Nome</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    className="focus-visible:ring-offset-0 transition-all duration-200"
                  />
                </FormControl>
                <FormDescription className="hidden">Email</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Senha:</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    className="focus-visible:ring-offset-0 transition-all duration-200"
                  />
                </FormControl>
                <FormDescription className="hidden">Senha</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Confirmar senha:</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    className="focus-visible:ring-offset-0 transition-all duration-200"
                  />
                </FormControl>
                <FormDescription className="hidden">
                  Confirmar senha
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {isLoading ? (
            <Button disabled>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Carregando
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full bg-slate-700 transition-colors duration-300"
            >
              Registrar-se
            </Button>
          )}
        </form>

        <p className="text-center text-sm">
          Já tem uma conta ?{' '}
          <Link href="/login" className="underline">
            Login
          </Link>
        </p>
      </div>
    </Form>
  );
};
