import { redirect } from 'next/navigation';
import { getUserDetails } from '@/lib/dal';
import LoginForm from './login-form';

export default async function LoginPage() {
  const userData = await getUserDetails();

  if (userData != null) {
    redirect('/dashboard');
  }

  return <LoginForm />;
}
