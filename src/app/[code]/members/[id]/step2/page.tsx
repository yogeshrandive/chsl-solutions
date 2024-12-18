import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { MemberFormTabs } from '../../member-form-tab';
import { getUserDetails } from '@/lib/dal';
import { getMember } from '@/models/members';
import UpdateMemberStep2Form from './update-member-step2-form';

export default async function MemberStep2Page({
  params,
}: {
  params: { id: string; code: string };
}) {
  const user = await getUserDetails();
  if (!user) {
    redirect('/login');
  }
  const { id, code } = await params;

  const member = await getMember(parseInt(id));
  if (!member) {
    redirect(`/${code}/members`);
  }

  return (
    <div>
      <Card>
        <CardHeader className="pt-1">
          <MemberFormTabs currentStep={member.step || 1} formStep={2} />
        </CardHeader>
        <CardContent className="max-w-[1050px] mx-auto">
          <UpdateMemberStep2Form member={member} societyCode={code} />
        </CardContent>
      </Card>
    </div>
  );
}
