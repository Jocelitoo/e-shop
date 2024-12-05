import { Container } from '@/components/Container';
import { ConfigForm } from './ConfigForm';
import { getCurrentUser } from '@/actions/getCurrentUser';

const Config = async () => {
  const currentUser = await getCurrentUser(); // Pega os dados do usuário logado

  return (
    <main className="flex-grow">
      <Container>
        <ConfigForm currentUser={currentUser} />
      </Container>
    </main>
  );
};

export default Config;
