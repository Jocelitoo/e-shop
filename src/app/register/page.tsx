import { getCurrentUser } from '@/actions/getCurrentUser';
import { RegisterForm } from '@/components/RegisterForm';

const Register = async () => {
  const currentUser = await getCurrentUser();

  return (
    <main className="flex-grow pt-8 px-8 flex items-center justify-center">
      <RegisterForm currentUser={currentUser} />
    </main>
  );
};

export default Register;
