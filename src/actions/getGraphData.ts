import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface ChartDataProps {
  date: string;
  sale: number;
}

export const getChartData = async () => {
  try {
    // Configurar o espaço de tempo que os pedidos precisam ter (pedidos feitos nos últimos 7 dias, sem contar o dia atual)
    // const startDate = dayjs().subtract(7, 'd').toISOString();
    const startDate = dayjs().subtract(7, 'd').startOf('d').toISOString();
    const endDate = dayjs().subtract(1, 'd').endOf('d').toISOString();

    // Pegar os pedidos
    const orders = await prisma.order.groupBy({
      by: ['createdDate'],
      where: {
        createdDate: {
          gte: startDate,
          lte: endDate,
        },
        status: 'Pago',
      },
      _sum: {
        amount: true,
      },
      orderBy: { createdDate: 'asc' },
    });

    // Verificar se existe algum pedido
    if (!orders) return;

    // Criar array que vai armazenar os dados da tabela
    const chartData: ChartDataProps[] = [];

    // Organizar os dados
    orders.map((order) => {
      // Formatar o formato da data para (DD/MM) e o valor
      const formatedDate = dayjs(order.createdDate).format('DD/MM');
      const amout = order._sum.amount as number;
      const formatedAmount = amout / 100;

      // Verificar se já existe a data no array
      const found = chartData.find((element) => element.date === formatedDate);

      if (!found) {
        // Enviar a data pro array
        const dados = {
          date: formatedDate,
          sale: 0,
        };

        chartData.push(dados);
      }

      // Adicionar o valor das vendas de cada dia ao array
      chartData.map((data) => {
        if (data.date === formatedDate) {
          data.sale += formatedAmount;
        }
      });
    });

    return chartData;
  } catch (error) {
    console.log(error);
  }
};
