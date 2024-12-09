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
import UpdateMemberStep3Form from './update-member-step3-form';
import { getMemberHeadings } from '@/models/members';
import { getSocietyHeadings } from '@/models/society';
import { MemberHeading, SocietyHeading } from './definations';

export default async function MemberStep3Page({
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

  const memberHeadings = await getMemberHeadings(parseInt(id));
  const societyHeadings = await getSocietyHeadings(member.id_society);

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
          <MemberFormTabs currentStep={member.step || 1} formStep={3} />
        </CardHeader>
        <CardContent className="max-w-[1050px] mx-auto">
          <UpdateMemberStep3Form
            member={member}
            societyCode={code}
            memberHeadings={memberHeadings as MemberHeading[]}
            societyHeadings={societyHeadings as SocietyHeading[]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
