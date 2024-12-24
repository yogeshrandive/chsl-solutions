import { getSocieties } from "./actions";
import { getUserDetails } from "@/lib/dal";
import { redirect } from "next/navigation";
import SocietiesClientPage from "./client-page";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function SocietiesPageServer({
  searchParams,
}: PageProps) {
  const user = await getUserDetails();

  if (!user) {
    redirect("/login");
  }

  const { filter } = await searchParams;
  const societies = await getSocieties(user.id_tenant, filter);

  return (
    <div className="flex flex-col flex-1 p-10 w-full max-w-[1400px] mx-auto">
      <SocietiesClientPage societies={societies} filter={filter} />
    </div>
  );
}
