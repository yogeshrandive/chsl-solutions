import { redirect } from 'next/navigation';
import { getMember } from '@/models/members';
import { getUserDetails } from '@/lib/dal';

export default async function SocietyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: number; code: string };
}) {
  // validate user details
  const user = await getUserDetails();
  if (!user) {
    redirect('/login');
  }

  const { id, code } = await params;
  const member = await getMember(id);

  if (!member || member == null) {
    redirect(`/${code}/members`);
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              {member.full_name}
            </h2>
            <p className="text-sm text-muted-foreground">{member.code}</p>
          </div>
          <div className="space-y-2 md:text-right">
            <p className="text-sm font-medium">
              Registration No: {member.mobile}
            </p>
            <p className="text-sm font-medium">Email: {member.email}</p>
            <p className="text-sm font-medium">Flat: {member.flat_no}</p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
