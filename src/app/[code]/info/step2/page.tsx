import { Suspense } from "react";
import InfoStep2Loading from "./loading";
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
import { UpdateSocietyStep2Form } from "./update-society-step2-form";
import { getUserDetails } from "@/lib/dal";
import { getSocietyByCode } from "@/models/society";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function InfoStep2Page({
  params,
}: PageProps) {
  return (
    <Suspense fallback={<InfoStep2Loading />}>
      <InfoStep2Content params={await params} />
    </Suspense>
  );
}

async function InfoStep2Content({ params }: { params: { code: string } }) {
  const user = await getUserDetails();
  if (!user) {
    redirect("/login");
  }

  const { code } = await params;
  const society = await getSocietyByCode(code);
  if (!society) {
    redirect("/society");
  }

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
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Card>
        <CardHeader className="pt-1">
          <SocietyFormTabs currentStep={society.step} formStep={2} />
        </CardHeader>
        <CardContent className="max-w-[1050px] mx-auto items-center justify-center">
          <div className="grid w-full gap-4">
            <UpdateSocietyStep2Form societyData={society} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
