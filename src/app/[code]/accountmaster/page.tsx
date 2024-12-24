import { Suspense } from "react";
import { getUserDetails } from "@/lib/dal";
import { getSocietyByCode } from "@/models/society";
import { redirect } from "next/navigation";
import AccountMasterClientPage from "./client-page";
import { getAllAccounts } from "@/models/accountMaster";
import { getAllGroups } from "@/models/societyHeadingGroups";
import AccountMasterLoading from "./loading";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function AccountMaster({
  params,
}: PageProps) {
  const user = await getUserDetails();
  if (!user) {
    redirect("/login");
  }

  const { code } = await params;
  const societyData = await getSocietyByCode(code);
  if (!societyData) redirect("/");

  const [accounts, headGroups] = await Promise.all([
    getAllAccounts(societyData.id),
    getAllGroups(societyData.id),
  ]);

  return (
    <Suspense fallback={<AccountMasterLoading />}>
      <AccountMasterClientPage
        societyData={societyData}
        accounts={accounts}
        headGroups={headGroups}
      />
    </Suspense>
  );
}
