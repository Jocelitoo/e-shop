'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ProductProps } from '@/utils/props';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import {
  AlertTriangle,
  ArrowUpDown,
  Eye,
  SquarePen,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';

export const columns: ColumnDef<ProductProps>[] = [
  {
    accessorKey: 'name',
    header: 'Produto',
    cell: ({ row }) => {
      const name = String(row.getValue('name'));

      return <div className="line-clamp-1 max-w-52">{name}</div>;
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Preço
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('price')).toFixed(2);
      const formatted = `R$ ${amount}`;

      return <div className="font-bold">{formatted}</div>;
    },
  },
  {
    accessorKey: 'category',
    header: 'Categória',
  },
  {
    accessorKey: 'brand',
    header: 'Marca',
  },
  {
    accessorKey: 'inStock',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Estoque
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const inStock: number = row.getValue('inStock');

      return (
        <div
          className={`flex items-center gap-1 ${inStock > 20 ? 'text-green-500' : inStock > 10 ? 'text-orange-600' : 'text-red-600'}`}
        >
          {inStock}
          {inStock < 10 && <AlertTriangle className="size-4" />}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const product = row.original;

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { toast } = useToast();

      const deleteProduct = () => {
        axios
          .delete('/api/product', {
            data: {
              id: product.id,
              images: product.images,
            },
          })
          .then((response) => {
            window.location.reload(); // Recarrega a página para o item removido desaparecer

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
          });
      };

      return (
        <div className="flex gap-4">
          <Link
            href={`/edit/${product.id}`}
            className="flex items-center outline outline-1 outline-gray-400 rounded-md px-4 py-2 transition-colors duration-300 hover:bg-gray-300"
          >
            <span className="sr-only">Editar</span>
            <SquarePen className="size-5" />
          </Link>

          <Link
            href={`/product/${product.id}`}
            className="flex items-center outline outline-1 outline-gray-400 rounded-md px-4 py-2 transition-colors duration-300 hover:bg-gray-300"
          >
            <span className="sr-only">Ver produto</span>
            <Eye className="size-5" />
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex items-center outline outline-1 outline-gray-400 rounded-md px-4 py-2 transition-colors duration-300 hover:bg-gray-300">
                <span className="sr-only">Deletar</span>
                <Trash2 className="size-5" />
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não poderá ser desfeita
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="transition-colors duration-300">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 transition-colors duration-300 hover:bg-red-800 "
                  onClick={() => deleteProduct()}
                >
                  Deletar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
