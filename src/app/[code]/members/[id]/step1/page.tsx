"use server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { MemberFormTabs } from "../../member-form-tab";
import { getUserDetails } from "@/lib/dal";
import { getMember } from "@/models/members";
import UpdateMemberStep1Form from "./update-member-step1-form";
import { getMemberTypes } from "@/models/memberTypes";

interface PageProps {
  params: Promise<{ id: string; code: string }>;
}

export default async function MemberStep1Page({
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

  const memberTypes = await getMemberTypes();

  return (
    <div>
      <Card>
        <CardHeader className="pt-1">
          <MemberFormTabs currentStep={member.step || 1} formStep={1} />
        </CardHeader>
        <CardContent className="max-w-[1050px] mx-auto items-center justify-center">
          <div className="grid w-full gap-4">
            <UpdateMemberStep1Form
              member={member}
              memberTypes={memberTypes}
              societyCode={code}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
