'use client';

import { OrderProps } from '@/utils/props';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { Bike, Check, Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import dayjs from 'dayjs';
import { useToast } from '@/hooks/use-toast';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'em %s',
    past: '%s atrás',
    s: 'alguns segundos',
    m: '1 minuto',
    mm: '%d minutos',
    h: '1 hora',
    hh: '%d horas',
    d: '1 dia',
    dd: '%d dias',
    M: '1 mês',
    MM: '%d meses',
    y: '1 ano',
    yy: '%d anos',
  },
});

export const columns: ColumnDef<OrderProps>[] = [
  {
    accessorKey: 'amount',
    header: 'Total',
    cell: ({ row }) => {
      const amount = (parseFloat(row.getValue('amount')) / 100).toFixed(2);
      const formatted = `R$ ${amount}`;

      return <div className="font-bold">{formatted}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status de pagamento',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;

      if (status === 'Pago') {
        return (
          <div className="flex items-center gap-2 bg-teal-300 w-fit p-1 rounded-md">
            {status} <Check className="size-4" />
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-2 bg-neutral-300 w-fit p-1 rounded-md">
            {status}
            <Clock className="size-4" />
          </div>
        );
      }
    },
  },
  {
    accessorKey: 'deliveryStatus',
    header: 'Status de entrega',
    cell: ({ row }) => {
      const status = row.getValue('deliveryStatus') as string;

      if (status === 'Pendente') {
        return (
          <div className="flex items-center gap-2 w-fit p-1 rounded-md bg-neutral-300">
            {status}
            <Clock className="size-4" />
          </div>
        );
      } else if (status === 'Enviado') {
        return (
          <div className="flex items-center gap-2 w-fit p-1 rounded-md bg-purple-300">
            {status}
            <Bike className="size-4" />
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-2 w-fit p-1 rounded-md bg-green-300">
            {status}
            <Check className="size-4" />
          </div>
        );
      }
    },
  },
  {
    accessorKey: 'createdDate',
    header: 'Data',
    cell: ({ row }) => {
      const date = String(row.getValue('createdDate'));
      const formatedDate = dayjs(date).fromNow();

      return <div>{formatedDate}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const order = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { toast } = useToast();

      const manualDispatch = () => {
        if (order.status === 'Pago') {
          axios
            .patch('/api/order', { id: order.id, deliveryStatus: 'Enviado' })
            .then((callback) => {
              if (callback.statusText === 'OK') {
                window.location.reload(); // Recarrega a página para o item removido desaparecer

                toast({
                  description: 'Status de entrega atualizado',
                  style: { backgroundColor: '#16a34a', color: '#fff' },
                });
              }

              if (callback.statusText !== 'OK') {
                console.log(callback.statusText);
              }
            });
        }
      };

      const manualDelivery = () => {
        if (order.status === 'Pago') {
          axios
            .patch('/api/order', { id: order.id, deliveryStatus: 'Entregue' })
            .then((callback) => {
              if (callback.statusText === 'OK') {
                window.location.reload(); // Recarrega a página para o item removido desaparecer

                toast({
                  description: 'Status de entrega atualizado',
                  style: { backgroundColor: '#16a34a', color: '#fff' },
                });
              }

              if (callback.statusText !== 'OK') {
                console.log(callback.statusText);
              }
            });
        }
      };

      return (
        <div className="flex gap-4">
          <button
            disabled={order.status === 'Pendente'}
            onClick={() => manualDispatch()}
            className={`flex items-center outline outline-1 outline-gray-400 rounded-md px-4 py-2 transition-colors duration-300 hover:bg-gray-300 ${order.status === 'Pendente' && 'hover:cursor-not-allowed'}`}
          >
            <span className="sr-only">Enviado</span>
            <Bike className="size-5" />
          </button>

          <button
            disabled={order.status === 'Pendente'}
            onClick={() => manualDelivery()}
            className={`flex items-center outline outline-1 outline-gray-400 rounded-md px-4 py-2 transition-colors duration-300 hover:bg-gray-300 ${order.status === 'Pendente' && 'hover:cursor-not-allowed'}`}
          >
            <span className="sr-only">Entregue</span>
            <Check className="size-5" />
          </button>

          <Link
            href={`/order/${order.id}`}
            className="flex items-center outline outline-1 outline-gray-400 rounded-md px-4 py-2 transition-colors duration-300 hover:bg-gray-300"
          >
            <span className="sr-only">Ver pedido</span>
            <Eye className="size-5" />
          </Link>
        </div>
      );
    },
  },
];
