'use client';

import { LoadingScreen } from '@/components/LoadingScreen';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { CurrentUserProps } from '@/utils/props';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
  otp: z.string({ required_error: 'Campo obrigatório' }).min(4, {
    message: 'O código precisar ter 4 digitos',
  }),
});

interface VerifyOTPFormProps {
  currentUser: CurrentUserProps | null;
}

export const VerifyOTPForm: React.FC<VerifyOTPFormProps> = ({
  currentUser,
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Redireciona o usuário para home se ele não estiver logado ou se seu email já for verificado
  useEffect(() => {
    if (!currentUser || currentUser.emailVerified !== null) {
      router.push('/'); // Redireciona para a home
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);

    axios
      .get('/api/otp', {
        params: {
          userId: currentUser?.id,
          otp: data.otp,
        },
      })
      .then((response) => {
        router.push('/'); // Redireciona para a home
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

  const newEmail = () => {
    setIsLoading(true);

    axios
      .delete('/api/otp', {
        data: {
          userId: currentUser?.id,
          userEmail: currentUser?.email,
          optId: currentUser?.UserOTPVerification?.id,
        },
      })
      .then((response) => {
        router.refresh(); // Recarrega a página atual
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
    <>
      {isLoading && <LoadingScreen text="Aguarde..." />}

      <div className="mx-auto mt-8 p-4 rounded-md flex flex-col justify-center gap-4 max-w-lg bg-slate-200">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-4"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center gap-4">
                  <FormLabel>
                    Verifique seu email e digite abaixo o código recebido
                  </FormLabel>
                  <FormControl>
                    <InputOTP maxLength={4} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="border-black" />
                        <InputOTPSlot index={1} className="border-black" />
                        <InputOTPSlot index={2} className="border-black" />
                        <InputOTPSlot index={3} className="border-black" />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="bg-slate-700">
              Verificar
            </Button>
          </form>
        </Form>

        <Button type="button" variant={'link'} onClick={() => newEmail()}>
          Não recebeu o código ? Enviar novo email
        </Button>
      </div>
    </>
  );
};
