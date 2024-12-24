import { redirect } from "next/navigation";
import { getUserDetails } from "@/lib/dal";
import { getSocietyByCode } from "@/models/society";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ code: string }>;
}

export default async function InfoLayout({
  children,
  params,
}: LayoutProps) {
  const user = await getUserDetails();
  if (!user) {
    redirect("/login");
  }

  const { code } = await params;
  const societyData = await getSocietyByCode(code);
  if (!societyData) redirect("/");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Society Information
        </h2>
      </div>
      <div className="flex-1 space-y-4">
        {children}
      </div>
    </div>
  );
}
