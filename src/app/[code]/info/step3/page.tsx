import { Suspense } from "react";
import InfoStep3Loading from "./loading";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import { SocietyFormTabs } from "../society-form-tab";
import { UpdateSocietyStep3Form } from "./update-society-step3-form";
import { getSocietyByCode } from "@/models/society";
import { getUserDetails } from "@/lib/dal";
import { Society } from "@/models/societyDefinations";
import { getAllAccounts } from "@/models/accountMaster";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function InfoStep3Page({
  params,
}: PageProps) {
  return (
    <Suspense fallback={<InfoStep3Loading />}>
      <InfoStep3Content params={await params} />
    </Suspense>
  );
}

async function InfoStep3Content({ params }: { params: { code: string } }) {
  const user = await getUserDetails();
  if (!user) {
    redirect("/login");
  }

  const { code } = await params;
  const society = await getSocietyByCode(code);

  if (!society) {
    redirect("/society");
  }

  const accountHeadings = await getAllAccounts(society.id);

  return (
    <div>
      <div className="pb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${code}/dashboard`}>
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator></BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Headings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Card>
        <CardHeader className="pt-1">
          <SocietyFormTabs currentStep={society.step} formStep={3} />
        </CardHeader>
        <CardContent className="max-w-[1050px] mx-auto items-center justify-center">
          <div className="grid w-full gap-4">
            <UpdateSocietyStep3Form
              societyId={society.id}
              societyData={society as unknown as Society}
              accountHeadings={accountHeadings}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
