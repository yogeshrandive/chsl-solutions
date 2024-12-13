import { redirect } from 'next/navigation';
import { getUserDetails } from '@/lib/dal';

export default async function SocietyLayout({
  children,
}: {
  children: React.ReactNode;
  params: { code: string };
}) {
  // validate user details
  const user = await getUserDetails();
  if (!user) {
    redirect('/login');
  }

  return <div className="space-y-4">{children}</div>;
}
