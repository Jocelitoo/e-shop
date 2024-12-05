import { getCurrentUser } from '@/actions/getCurrentUser';
import { LoginForm } from '../../components/LoginForm';

const Login = async () => {
  const currentUser = await getCurrentUser();

  return (
    <main className="flex-grow pt-8 px-8 flex items-center justify-center">
      <LoginForm currentUser={currentUser} />
    </main>
  );
};

export default Login;
