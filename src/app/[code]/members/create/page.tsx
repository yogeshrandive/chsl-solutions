import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getUserDetails } from "@/lib/dal";
import { Slash } from "lucide-react";
import CreateMemberForm from "./create-member-form";
import { getSocietyByCode } from "@/models/society";
import { getMemberTypes } from "@/models/memberTypes";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function CreateMemberPage({
  params,
}: PageProps) {
  const user = await getUserDetails();
  if (!user) {
    redirect("/login");
  }

  const { code } = await params;

  const societyData = await getSocietyByCode(code);
  if (!societyData) redirect("/");

  const memberTypes = await getMemberTypes();

  return (
    <div>
      <div className="pb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${code}/members`}>
                All Members
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Create</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create Member</CardTitle>
        </CardHeader>
        <CardContent className="max-w-[1050px] mx-auto">
          <CreateMemberForm memberTypes={memberTypes} society={societyData} />
        </CardContent>
      </Card>
    </div>
  );
}
