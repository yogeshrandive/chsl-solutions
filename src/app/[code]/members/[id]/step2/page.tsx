import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { MemberFormTabs } from '../../member-form-tab';
import { getUserDetails } from '@/lib/dal';
import { getMember } from '@/models/members';
import { Slash } from 'lucide-react';
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
      <div className="pb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/members">All Members</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
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
