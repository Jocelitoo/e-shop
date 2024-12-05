'use client';

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { OrderProps, ProductProps, UserProps } from '@/utils/props';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

const chartConfig = {
  sale: {
    label: 'Lucro',
    color: '#2563eb',
  },
} satisfies ChartConfig;

interface SummaryProps {
  products: ProductProps[];
  orders: OrderProps[];
  users: UserProps[];
  chartData: chartDataProps[] | undefined;
}

type chartDataProps = {
  date: string;
  sale: number;
};

type SummaryDataType = {
  [key: string]: {
    label: string;
    digit: number;
  };
};

export const Summary: React.FC<SummaryProps> = ({
  products,
  orders,
  users,
  chartData,
}) => {
  const [summaryData, setSummaryData] = useState<SummaryDataType>({
    sale: {
      label: 'Lucro total',
      digit: 0,
    },
    products: {
      label: 'Produtos',
      digit: 0,
    },
    orders: {
      label: 'Pedidos feitos',
      digit: 0,
    },
    paidOrders: {
      label: 'Pedidos pagos',
      digit: 0,
    },
    unpaidOrders: {
      label: 'Pedidos não pagos',
      digit: 0,
    },
    users: {
      label: 'Usuários',
      digit: 0,
    },
  });

  useEffect(() => {
    setSummaryData((prev) => {
      let tempData = { ...prev };

      const totalSale = orders.reduce((acc, item) => {
        if (item.status === 'Pago') {
          const itemAmount = Number(item.amount);
          return acc + itemAmount;
        } else {
          return acc;
        }
      }, 0);

      const paidOrders = orders.filter((order) => {
        return order.status === 'Pago';
      });

      const unpaidOrders = orders.filter((order) => {
        return order.status === 'Pendente';
      });

      tempData.sale.digit = totalSale;
      tempData.orders.digit = orders.length;
      tempData.paidOrders.digit = paidOrders.length;
      tempData.unpaidOrders.digit = unpaidOrders.length;
      tempData.products.digit = products.length;
      tempData.users.digit = users.length;

      return tempData;
    });
  }, [products, orders, users]);

  const summaryKeys = Object.keys(summaryData);

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <h1 className="font-bold text-xl">Status</h1>

      <div className="grid gap-4 w-full sm:grid-cols-2">
        {summaryKeys &&
          summaryKeys.map((key, index) => {
            return (
              <div key={index} className="border rounded-md p-4">
                <p className="text-center text-2xl font-bold sm:text-3xl">
                  {summaryData[key].label === 'Lucro total' ? (
                    <>
                      R$ {parseFloat((summaryData[key].digit / 100).toFixed(2))}
                    </>
                  ) : (
                    <>{summaryData[key].digit}</>
                  )}
                </p>

                <p className="text-center">{summaryData[key].label}</p>
              </div>
            );
          })}
      </div>

      <ChartContainer config={chartConfig} className="min-h-28 w-full md:w-2/3">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />

          <Bar dataKey={'sale'} fill="var(--color-sale)" radius={4}>
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
};
