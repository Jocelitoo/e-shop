import { Container } from '@/components/Container';
import { NewPasswordForm } from './NewPasswordForm';

interface TParamsProps {
  userId: string;
  otp: string;
}

const NewPassword = ({ params }: { params: TParamsProps }) => {
  const { userId, otp } = params; // Pega o userId e o otp enviados na url

  return (
    <main className="flex-grow">
      <Container>
        <NewPasswordForm userId={userId} otp={otp} />
      </Container>
    </main>
  );
};

export default NewPassword;
