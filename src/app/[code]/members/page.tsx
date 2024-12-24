import { redirect } from "next/navigation";
import { getUserDetails } from "@/lib/dal";
import MembersClientPage from "./client-page";
import { getSocietyHeadings } from "@/models/societyHeadings";
import { getMembers } from "@/models/members";
import { getSocietyByCode } from "@/models/society";
import { SocietyHeading } from "./[id]/step3/definations";

export default async function MembersPage({
  params,
}: {
  params: { code: string };
}) {
  const user = await getUserDetails();
  if (!user) {
    redirect("/login");
  }

  const { code } = await params;

  const societyData = await getSocietyByCode(code);
  if (!societyData) redirect("/");

  const members = await getMembers(societyData.id);
  const headings = await getSocietyHeadings(societyData.id);

  return (
    <MembersClientPage
      members={members}
      headings={headings as unknown as SocietyHeading[]}
      societyCode={code}
      societyData={societyData}
    />
  );
}
