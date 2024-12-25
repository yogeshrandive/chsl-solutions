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

  const { data } = await searchParams;
  const filter = typeof data === "string" ? data : undefined;
  const societies = await getSocieties(user.id_tenant, filter);

  return <SocietiesClientPage societies={societies} filter={filter} />;
}
