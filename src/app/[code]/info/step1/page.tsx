"use server";
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
import { UpdateSocietyForm } from "./update-society-form";
import { getSocietyByCode } from "@/models/society";
import { getUserDetails } from "@/lib/dal";
import { Suspense } from "react";
import InfoStep1Loading from "./loading";
import { getStates } from "@/app/society/create/actions";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function InfoStep1Page({
  params,
}: PageProps) {
  return (
    <Suspense fallback={<InfoStep1Loading />}>
      <InfoStep1Content params={params} />
    </Suspense>
  );
}

async function InfoStep1Content({ params }: PageProps) {
  const user = await getUserDetails();
  if (!user) {
    redirect("/login");
  }

  const { code } = await params;
  const society = await getSocietyByCode(code);
  if (!society) {
    redirect("/society");
  }

  const states = await getStates();

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
          <SocietyFormTabs currentStep={society.step} formStep={1} />
        </CardHeader>
        <CardContent className="max-w-[1050px] mx-auto items-center justify-center">
          <div className="grid w-full gap-4">
            <UpdateSocietyForm
              userData={user}
              societyData={society}
              states={states}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
