import { redirect } from 'next/navigation';
import { getUserDetails } from '@/lib/dal';
import { getSocietyById } from '@/models/society';

export default async function SocietyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: number };
}) {
  // validate user details
  const user = await getUserDetails();
  if (!user) {
    redirect('/login');
  }

  const { id } = await params;
  const society = await getSocietyById(Number(id));

  if (!society) {
    redirect('/society');
  }

  if (user.id_tenant != society?.id_tenant)
    throw new Error('Invalid society details.');

  if (!society || society == null) {
    redirect('/society');
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              {society.name}
            </h2>
            <p className="text-sm text-muted-foreground">{society.address}</p>
          </div>
          <div className="space-y-2 md:text-right">
            <p className="text-sm font-medium">
              Registration No: {society.regi_no}
            </p>
            <p className="text-sm font-medium">Email: {society.email}</p>
            <p className="text-sm font-medium">Code: {society.code}</p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
