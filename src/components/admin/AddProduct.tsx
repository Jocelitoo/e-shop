'use client';

import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  Keyboard,
  Laptop,
  Loader2,
  Monitor,
  Smartphone,
  Tv2,
  Watch,
} from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CldUploadWidget } from 'next-cloudinary';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { CurrentUserProps } from '@/utils/props';

const formSchema = z.object({
  name: z.string({ required_error: 'Nome é obrigatório' }),
  price: z.coerce.number({
    required_error: 'Preço é obrigatório',
    invalid_type_error: 'Preço é obrigatório',
  }),
  brand: z.string({
    required_error: 'Marca é obrigatório',
  }),
  inStock: z.coerce
    .number({
      required_error: 'Quantidade no estoque é obrigatório',
      invalid_type_error: 'Quantidade no estoque é obrigatório',
    })
    .min(1, { message: 'Número precisa ser maior ou igual a 1' }),
  description: z.string({ required_error: 'Descrição é obrigatório' }),
  category: z.string({ required_error: 'Escolha uma categória' }),
  color: z
    .array(z.string())
    .min(1, { message: 'Você precisa escolher no mínimo uma cor' }),
  images: z.array(
    z.object({
      color: z.string().min(1, { message: 'Escolha uma cor' }),
      colorCode: z.string(),
      image: z.string({ required_error: 'Escolha uma imagem' }),
    }),
  ),
});

const categoryItems = [
  { value: 'Phone', icon: <Smartphone />, label: 'Celular' },
  { value: 'Laptop', icon: <Laptop />, label: 'Notebook' },
  { value: 'Desktop', icon: <Monitor />, label: 'Computador' },
  { value: 'Watch', icon: <Watch />, label: 'Relógio' },
  { value: 'Tv', icon: <Tv2 />, label: 'Televisão' },
  { value: 'Accessories', icon: <Keyboard />, label: 'Acessórios' },
];

const colorItems = [
  { color: 'Preto', colorCode: '#000000' },
  { color: 'Branco', colorCode: '#FFFFFF' },
  { color: 'Vermelho', colorCode: '#FF0000' },
  { color: 'Azul', colorCode: '#0000FF' },
  { color: 'Prata', colorCode: '#C0C0C0' },
  { color: 'Cinza', colorCode: '#808080' },
  { color: 'Ouro', colorCode: '#e4e011' },
  { color: 'Grafite', colorCode: '#383838' },
];

interface AddProductProps {
  currentUser: CurrentUserProps | null;
}

export const AddProduct: React.FC<AddProductProps> = ({ currentUser }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      color: [],
    },
  });

  // Redirecionar o usuário deslogado ou o usuário que n é ADMIN para a Home
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      router.push('/'); // Redireciona para a Home
      router.refresh(); // Recarrega a página atual
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const selectedColors = form.watch('color'); // Monitora as alterações feitas no formField de name 'color'. Se uma cor for marcada, ela será inserida no array selectedColors
  const { resetField } = form; // Função para resetar campos específicos

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const newProduct = {
      name: data.name,
      description: data.description,
      price: data.price,
      brand: data.brand,
      category: data.category,
      inStock: data.inStock,
      images: data.images,
    };

    setIsLoading(true);

    axios
      .post('/api/product', newProduct)
      .then((response) => {
        router.push('/admin/manage-products'); // Direciona o usuário para a pagina /admin/manage-products
        router.refresh(); // Recarrega a página

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
    <section className="mt-16 px-2 sm:px-4">
      {currentUser?.role === 'ADMIN' && (
        <div className="p-4 w-full min-w-60 max-w-xl mx-auto bg-slate-200 rounded-md">
          <h1 className="text-center font-bold mb-4 text-xl">
            Adicione um produto
          </h1>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Nome:</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        className="focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormDescription className="hidden">
                      Nome do produto
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Preço:</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step={0.01} // Permite números decimais
                        min={1}
                        {...field}
                        className="focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormDescription className="hidden">
                      Preço do produto
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Marca:</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        className="focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormDescription className="hidden">
                      Marca do produto
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inStock"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-black">
                      Quantidade no estoque:
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        className="focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormDescription className="hidden">
                      Quantidade do produto no estoque
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-black">Descrição:</FormLabel>
                    <FormControl>
                      <textarea {...field} rows={8} className="p-2" />
                    </FormControl>
                    <FormDescription className="hidden">
                      Descrição do produto
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-black">
                      Escolha a categoria:
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-3"
                      >
                        {categoryItems.map((item, index) => {
                          return (
                            <FormItem
                              key={index}
                              className="outline outline-1 outline-slate-400 rounded-md space-y-0 hover:outline-slate-700 hover:outline-2 has-[:checked]:outline-slate-700 has-[:checked]:outline-2"
                            >
                              <FormControl>
                                <RadioGroupItem
                                  value={item.value}
                                  className="hidden"
                                />
                              </FormControl>

                              <FormLabel className="flex flex-col items-center gap-2 p-4 cursor-pointer">
                                {item.icon}
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                    <FormDescription className="hidden">
                      Marca do produto
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Responsável pelo checkbox */}
              <FormField
                control={form.control}
                name="color"
                render={() => (
                  <FormItem className="flex flex-col gap-2">
                    <div className="space-y-2">
                      <FormLabel className="text-black">
                        Selecione as cores disponíveis para o produto e adicione
                        sua imagem
                      </FormLabel>
                      <FormDescription>
                        Você precisa adicionar uma imagem para cada cor
                        selecionada, caso não faça isso haverá um erro
                      </FormDescription>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {colorItems.map((item, index) => {
                        return (
                          <FormField
                            key={index}
                            control={form.control}
                            name={`color`}
                            render={({ field }) => (
                              <FormItem
                                key={index}
                                className="flex flex-col gap-1 group"
                              >
                                <div className="flex items-center gap-2">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(
                                        item.color,
                                      )}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          // Adiciona a cor ao array
                                          field.onChange([
                                            ...field.value,
                                            item.color,
                                          ]);
                                        } else {
                                          // Remove a cor e reseta o campo de imagem associado
                                          const newColors = field.value?.filter(
                                            (value) => value !== item.color,
                                          );

                                          field.onChange(newColors);

                                          // Identifica o index da cor que foi desmarcada
                                          const colorIndex =
                                            selectedColors.findIndex(
                                              (selectedColor) =>
                                                selectedColor === item.color,
                                            );

                                          resetField(
                                            `images.${colorIndex}.image`, // Limpa o campo de imagem correto
                                          );
                                        }
                                      }}
                                    />
                                  </FormControl>

                                  <FormLabel className="!mt-0 cursor-pointer">
                                    {item.color}
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Responsável por pegar os dados da imagem com base no checkbox */}
              {selectedColors.length > 0 && (
                <FormField
                  control={form.control}
                  name="images"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-black">Imagens:</FormLabel>

                      {selectedColors.map((color, index) => {
                        const colorItem = colorItems.find(
                          (item) => item.color === color,
                        );

                        return (
                          <>
                            <FormField
                              control={form.control}
                              name={`images.${index}.color`}
                              defaultValue={colorItem?.color}
                              render={() => (
                                <FormItem className="hidden"></FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`images.${index}.colorCode`}
                              defaultValue={colorItem?.colorCode}
                              render={() => (
                                <FormItem className="hidden"></FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`images.${index}.image`}
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormControl>
                                    <CldUploadWidget
                                      signatureEndpoint={
                                        '/api/sign-cloudinary-params'
                                      }
                                      onSuccess={(result) => {
                                        // Mensagem de sucesso
                                        toast({
                                          description: 'Imagem enviada',
                                          style: {
                                            backgroundColor: '#16a34a',
                                            color: '#fff',
                                          },
                                        });

                                        const imageUrl =
                                          result?.info?.secure_url; // Pega a url da imagem no cloudinary
                                        field.onChange(imageUrl); // Adiciona a url da imagem no campo field
                                      }}
                                      options={{
                                        maxFiles: 1, // Só 1 imagem pode ser enviada por vez
                                        sources: ['local', 'google_drive'], // Somente imagens locais (no computador) e imagens do google drive podem ser enviadas
                                        clientAllowedFormats: [
                                          'jpg',
                                          'jpeg',
                                          'webp',
                                          'png',
                                        ], // Formatos aceitáveis
                                        maxImageFileSize: 5000000, // 5MB é o tamanho máximo da imagem
                                        autoMinimize: true, // Minimiza a tela de enviar imagens quando uma imagem sofrer upload, assim evita o usuário enviar múltiplas imagens
                                      }}
                                    >
                                      {({ open }) => {
                                        const handleOnClick = () => {
                                          open(); // Abre a tela pro usuário escolher a imagem
                                        };

                                        return (
                                          <>
                                            {field.value ? (
                                              <button
                                                type="button"
                                                disabled
                                                className="border border-green-600 border-dashed rounded-md px-2 py-4 sm:py-2 text-green-600"
                                              >
                                                Imagem enviada ({color})
                                              </button>
                                            ) : (
                                              <button
                                                type="button"
                                                onClick={() => handleOnClick()}
                                                className="border border-black border-dashed rounded-md px-2 py-4"
                                              >
                                                Escolher imagem ({color})
                                              </button>
                                            )}
                                          </>
                                        );
                                      }}
                                    </CldUploadWidget>
                                  </FormControl>
                                  <FormDescription className="hidden">
                                    Imagem do produto
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        );
                      })}
                    </FormItem>
                  )}
                />
              )}

              {isLoading ? (
                <Button type="submit" disabled>
                  <Loader2 className="animate-spin mr-2" />
                  Criando produto...
                </Button>
              ) : (
                <Button type="submit">Adicionar produto</Button>
              )}
            </form>
          </Form>
        </div>
      )}
    </section>
  );
};
