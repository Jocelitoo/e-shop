import { AdminNav } from '@/components/admin/AdminNav';
import { Summary } from './Summary';
import { Container } from '@/components/Container';
import { prisma } from '@/lib/prisma';
import { getChartData } from '@/actions/getGraphData';

const getProducts = () => prisma.product.findMany();
const getOrders = () => prisma.order.findMany();
const getUsers = () => prisma.user.findMany();

const Admin = async () => {
  const products = await getProducts();
  const orders = await getOrders();
  const users = await getUsers();
  const chartData = await getChartData();

  return (
    <main className="flex-grow lg:py-4">
      <Container>
        <AdminNav />
        <Summary
          products={products}
          orders={orders}
          users={users}
          chartData={chartData}
        />
      </Container>
    </main>
  );
};

export default Admin;
