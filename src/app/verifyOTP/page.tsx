import { getCurrentUser } from '@/actions/getCurrentUser';
import { VerifyOTPForm } from './VerifyOTPForm';
import { Container } from '@/components/Container';

const VerifyOTP = async () => {
  const currentUser = await getCurrentUser();

  return (
    <main className="flex-grow">
      <Container>
        {currentUser && <VerifyOTPForm currentUser={currentUser} />}
      </Container>
    </main>
  );
};

export default VerifyOTP;
