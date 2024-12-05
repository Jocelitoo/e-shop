'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { OrderProps } from '@/utils/props';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { Bike, Check, Clock } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

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

interface OrderTableProps {
  order: OrderProps;
  customerName: string;
  customerEmail: string;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  order,
  customerName,
  customerEmail,
}) => {
  const total = (Number(order.amount) / 100).toFixed(2);
  const formatedData = dayjs(order.createdDate).fromNow();

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h1 className="font-bold text-2xl">Detalhes do pedido</h1>

        <div className="space-y-2">
          <p>Id do pedido: {order.id}</p>
          <p>Nome do comprador: {customerName}</p>
          <p>Email do comprador: {customerEmail}</p>
          <p>Data: {formatedData}</p>

          <p>
            Endereço:{' '}
            {order.address ? (
              <>
                {order.address.line1} - {order.address.city} -{' '}
                {order.address.state} - CEP: {order.address.postal_code}
              </>
            ) : (
              <span className="text-red-500">Não especificado</span>
            )}
          </p>

          <p>
            Total: <span className="font-bold">R${total}</span>
          </p>

          <p className="flex items-center gap-2">
            Status de pagamento:
            {order.status === 'Pago' ? (
              <span className="flex items-center gap-2 bg-teal-300 w-fit p-1 rounded-md">
                {order.status} <Check className="size-4" />
              </span>
            ) : (
              <span className="flex items-center gap-2 bg-neutral-300 w-fit p-1 rounded-md">
                {order.status} <Clock className="size-4" />
              </span>
            )}
          </p>

          <p className="flex items-center gap-2">
            Status de entrega:
            {order.deliveryStatus === 'Pendente' ? (
              <span className="flex items-center gap-2 w-fit p-1 rounded-md bg-neutral-300">
                {order.deliveryStatus}
                <Clock className="size-4" />
              </span>
            ) : order.deliveryStatus === 'Enviado' ? (
              <span className="flex items-center gap-2 w-fit p-1 rounded-md bg-purple-300">
                {order.deliveryStatus}
                <Bike className="size-4" />
              </span>
            ) : (
              <span className="flex items-center gap-2 w-fit p-1 rounded-md bg-green-300">
                {order.deliveryStatus}
                <Check className="size-4" />
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="font-bold">Produtos comprados:</h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-center">Quantidade</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {order.products.map((product, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className="flex items-center gap-2">
                    <div className="aspect-square overflow-hidden relative w-20">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex flex-col gap-4">
                      <p className="line-clamp-1 max-w-[150px] md:max-w-[200px] lg:max-w-[450px]">
                        {product.name}
                      </p>
                      <p>{product.color}</p>
                    </div>
                  </TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell className="text-center">
                    {product.quantity}
                  </TableCell>
                  <TableCell className="text-right">{product.total}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
