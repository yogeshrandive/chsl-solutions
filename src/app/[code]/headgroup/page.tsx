/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from "react";
import { getUserDetails } from "@/lib/dal";
import { getSocietyByCode } from "@/models/society";
import { redirect } from "next/navigation";
import HeadGroupClientPage from "./client-page";
import { getAllGroups } from "@/models/societyHeadingGroups";
import HeadGroupLoading from "./loading";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function HeadGroupPage({
  params,
}: PageProps) {
  const user = await getUserDetails();
  if (!user) {
    redirect("/login");
  }

  const { code } = await params;
  const societyData = await getSocietyByCode(code);
  if (!societyData) redirect("/");

  return (
    <Suspense fallback={<HeadGroupLoading />}>
      <HeadGroupContent societyId={societyData.id} societyData={societyData} />
    </Suspense>
  );
}

async function HeadGroupContent({
  societyId,
  societyData,
}: {
  societyId: number;
  societyData: any;
}) {
  const headGroups = await getAllGroups(societyId);

  return (
    <HeadGroupClientPage societyData={societyData} headGroups={headGroups} />
  );
}
