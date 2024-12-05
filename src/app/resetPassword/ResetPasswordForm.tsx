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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string({ required_error: 'Digite seu email' }).email({
    message: 'Email inválido',
  }),
});

export const ResetPasswordForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    axios
      .post('/api/resetPassword', {
        data: {
          email: values.email,
        },
      })
      .then((response) => {
        console.log(response);

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
        form.setValue('email', '');
        setIsLoading(false);
      });
  };

  return (
    <Form {...form}>
      <div className="p-4 w-full max-w-lg mx-auto mt-8 rounded-md space-y-4 bg-slate-50 shadow-xl">
        <p className="text-center">
          Digite o email da conta para ser enviado um email de alteração de
          senha
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input
                    type="email"
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
              <Loader2Icon className="animate-spin" /> Carregando...
            </Button>
          ) : (
            <Button type="submit" className="w-full bg-slate-700">
              Enviar email
            </Button>
          )}
        </form>
      </div>
    </Form>
  );
};
