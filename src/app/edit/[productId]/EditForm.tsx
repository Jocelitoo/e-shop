'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { CurrentUserProps, ProductProps } from '@/utils/props';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import {
  Keyboard,
  Laptop,
  Loader2,
  Monitor,
  Smartphone,
  Tv2,
  Watch,
} from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
      image: z.string().min(1, { message: 'Escolha uma imagem' }),
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

interface EditFormProps {
  currentUser: CurrentUserProps | null;
  product: ProductProps;
}

export const EditForm: React.FC<EditFormProps> = ({ currentUser, product }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Redirecionar o usuário deslogado ou o usuário que n é ADMIN para a Home
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      router.push('/'); // Redireciona para a Home
      router.refresh(); // Recarrega a página atual
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const colors: string[] = [];

  {
    product.images.map((image) => colors.push(image.color)); // Pega todas as cores escolhidas pro produto
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      price: product.price,
      brand: product.brand,
      inStock: product.inStock,
      description: product.description,
      category: product.category,
      color: colors,
      images: product.images,
    },
  });

  const selectedColors = form.watch('color'); // Monitora as alterações feitas no formField de name 'color'. Se uma cor for marcada, ela será inserida no array selectedColors

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const updatedProduct = {
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
      .put('/api/product', {
        data: {
          id: product.id,
          updatedProduct: updatedProduct,
        },
      })
      .then((callback) => {
        if (callback.statusText === 'OK') {
          router.refresh(); // Recarrega a página

          toast({
            description: 'Produto editado com sucesso',
            style: { backgroundColor: '#16a34a', color: '#fff' },
          });
        }

        if (callback.statusText !== 'OK') {
          toast({
            description: callback.statusText,
            style: { backgroundColor: '#dd1212', color: '#fff' },
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <section className="px-2 sm:px-4">
      {currentUser?.role === 'ADMIN' && (
        <div className="p-4 w-full min-w-60 max-w-xl mx-auto bg-slate-200 rounded-md">
          <h1 className="text-center font-bold mb-4 text-xl">Editar produto</h1>

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

                                          // Atualiza color e colorCode para a nova cor selecionada no checkbox
                                          form.setValue(
                                            `images.${field.value.length}`,
                                            {
                                              color: item.color,
                                              colorCode: item.colorCode,
                                              image: '',
                                            },
                                          );
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

                                          // Remove o campo images (color, colorCode e image) especificado
                                          form.setValue(
                                            'images',
                                            form
                                              .getValues('images')
                                              .filter(
                                                (_, i) => i !== colorIndex,
                                              ),
                                          );

                                          // Remove o link da imagem que ainda permanece
                                          form.setValue(
                                            `images.${colorIndex}.image`,
                                            '',
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
                          <div key={index}>
                            <FormField
                              control={form.control}
                              name={`images.${index}.color`}
                              render={() => (
                                <FormItem className="hidden"></FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`images.${index}.colorCode`}
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
                                    <div>
                                      {field.value ? (
                                        // Quando já existe uma imagem para a cor

                                        <CldUploadWidget
                                          key={index}
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
                                              <div className="flex items-center gap-2">
                                                <div className="aspect-square overflow-hidden relative w-32">
                                                  <Image
                                                    src={field.value}
                                                    alt={product.description}
                                                    fill
                                                    className="w-full h-full object-contain"
                                                  />
                                                </div>

                                                <Button
                                                  type="button"
                                                  onClick={() =>
                                                    handleOnClick()
                                                  }
                                                >
                                                  Trocar imagem (
                                                  {colorItem?.color})
                                                </Button>
                                              </div>
                                            );
                                          }}
                                        </CldUploadWidget>
                                      ) : (
                                        // Quando não existe uma imagem para a cor selecionada (nova cor selecionada na edição)
                                        <CldUploadWidget
                                          key={index}
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
                                                  <div className="flex items-center gap-2">
                                                    <div className="aspect-square overflow-hidden relative w-32">
                                                      <Image
                                                        src={field.value}
                                                        alt={
                                                          product.description
                                                        }
                                                        fill
                                                        className="w-full h-full object-contain"
                                                      />
                                                    </div>

                                                    <Button
                                                      type="button"
                                                      onClick={() =>
                                                        handleOnClick()
                                                      }
                                                    >
                                                      Trocar imagem ({color})
                                                    </Button>
                                                  </div>
                                                ) : (
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      handleOnClick()
                                                    }
                                                    className="border border-black border-dashed rounded-md px-2 py-4"
                                                  >
                                                    Escolher imagem ({color})
                                                  </button>
                                                )}
                                              </>
                                            );
                                          }}
                                        </CldUploadWidget>
                                      )}
                                    </div>
                                  </FormControl>
                                  <FormDescription className="hidden">
                                    Imagem do produto
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        );
                      })}
                    </FormItem>
                  )}
                />
              )}
              {isLoading ? (
                <Button type="submit" disabled>
                  <Loader2 className="animate-spin" />
                  Editando produto...
                </Button>
              ) : (
                <Button type="submit">Editar produto</Button>
              )}
            </form>
          </Form>
        </div>
      )}
    </section>
  );
};
