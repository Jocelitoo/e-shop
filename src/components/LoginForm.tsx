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
import { useToast } from '@/hooks/use-toast';
import { CurrentUserProps } from '@/utils/props';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email({
    message: 'Email invalido',
  }),

  password: z
    .string()
    .min(6, { message: 'A senha precisa ter no mínimo 6 digitos' }),
});

interface LoginFormProps {
  currentUser: CurrentUserProps | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ currentUser }) => {
  const router = useRouter();
  const { toast } = useToast();

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

    // Fazer login
    signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    })
      .then((callback) => {
        if (callback?.ok) {
          router.push(
            `${currentUser?.emailVerified !== null ? '/cart' : '/verifyOTP'}`,
          ); // Redireciona para o cart se o email for verificado ou redireciona pra página de verificação opt se o email n for verificado

          router.refresh(); // Recarrega a página atual

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
        <h1 className="font-bold text-xl text-center">Login</h1>

        <Button
          type="button"
          variant={'outline'}
          onClick={() => signIn('google')}
          className="transition-colors duration-300 hover:bg-slate-200"
        >
          Login com o Google
        </Button>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
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

          <Link href="/resetPassword" className="underline text-sm text-end">
            Esqueceu a senha?
          </Link>

          {isLoading ? (
            <Button
              type="submit"
              disabled
              className="w-full bg-slate-700 transition-colors duration-300"
            >
              <Loader2Icon className="mr-2 size-4 animate-spin" /> Carregando
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full bg-slate-700 transition-colors duration-300"
            >
              Login
            </Button>
          )}
        </form>

        <p className="text-center text-sm">
          Não tem uma conta ?{' '}
          <Link href="/register" className="underline">
            registrar-se
          </Link>
        </p>
      </div>
    </Form>
  );
};
