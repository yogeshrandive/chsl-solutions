import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { MemberFormTabs } from "../../member-form-tab";
import { getUserDetails } from "@/lib/dal";
import { getMember } from "@/models/members";
import UpdateMemberStep3Form from "./update-member-step3-form";
import { getMemberHeadings } from "@/models/members";
import { getSocietyHeadings } from "@/models/society";
import { MemberHeading, SocietyHeading } from "./definations";

interface PageProps {
  params: Promise<{ id: string; code: string }>;
}

export default async function MemberStep3Page({
  params,
}: PageProps) {
  const user = await getUserDetails();
  if (!user) {
    redirect("/login");
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
      <Card>
        <CardHeader className="pt-1">
          <MemberFormTabs currentStep={member.step || 1} formStep={3} />
        </CardHeader>
        <CardContent className="max-w-[1050px] mx-auto">
          <UpdateMemberStep3Form
            member={member}
            societyCode={code}
            memberHeadings={memberHeadings as MemberHeading[]}
            societyHeadings={societyHeadings as unknown as SocietyHeading[]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
