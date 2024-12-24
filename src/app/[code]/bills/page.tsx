import { redirect } from "next/navigation";
import { getUserDetails } from "@/lib/dal";
import { getSocietyByCode } from "@/models/society";
import { getBillsBySocietyId } from "@/models/societyBills";
import BillsPage from "./bill-page";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function BillsPageServer({
  params,
}: PageProps) {
  const user = await getUserDetails();
  if (!user) {
    redirect("/login");
  }

  const { code } = await params;
  const societyData = await getSocietyByCode(code);
  if (!societyData) redirect("/");

  const bills = await getBillsBySocietyId(societyData.id);

  return <BillsPage societyData={societyData} bills={bills} />;
}
