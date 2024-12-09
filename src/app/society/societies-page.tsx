import { getSocieties } from './actions';
import { getUserDetails } from '@/lib/dal';
import { redirect } from 'next/navigation';
import SocietiesClientPage from './client-page';

export default async function SocietiesPageServer({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await getUserDetails();

  if (!user) {
    redirect('/login');
  }

  const { filter } = await searchParams;
  const societies = await getSocieties(user.id_tenant, filter);

  return (
    <div className="flex flex-col flex-1 p-10 w-full">
      <SocietiesClientPage societies={societies} filter={filter} />
    </div>
  );
}
