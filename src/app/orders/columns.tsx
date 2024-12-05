'use client';

import { OrderProps } from '@/utils/props';
import { ColumnDef } from '@tanstack/react-table';
import { Bike, Check, Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import dayjs from 'dayjs';

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

      return (
        <Link
          href={`/order/${order.id}`}
          className="w-fit flex items-center outline outline-1 outline-gray-400 rounded-md px-4 py-2 transition-colors duration-300 hover:bg-gray-300"
        >
          <span className="sr-only">Ver pedido</span>
          <Eye className="size-5" />
        </Link>
      );
    },
  },
];
