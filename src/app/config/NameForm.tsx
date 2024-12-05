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

const formSchema = z.object({
  name: z
    .string({ required_error: 'Campo NOME não pode estar vazio' })
    .min(2, { message: 'Nome precisa ter no mínimo 2 digitos' })
    .max(20, { message: 'Nome só pode ter no máximo 20 caracteres' }),
});

interface NameFormProps {
  userId: string;
}

export const NameForm: React.FC<NameFormProps> = ({ userId }) => {
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
      name: values.name,
      userId: userId,
    };

    // Fazer a requisição
    axios
      .put('api/config/update-name', data)
      .then((response) => {
        form.setValue('name', '');
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
        <h1 className="text-center font-bold text-2xl">Atualizar nome</h1>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Novo nome:</FormLabel>

              <FormControl>
                <Input
                  type="text"
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
            <Loader2 className="animate-spin" /> Atualizando nome...
          </Button>
        ) : (
          <Button type="submit" className="w-full bg-slate-700">
            Atualizar nome
          </Button>
        )}
      </form>
    </Form>
  );
};
