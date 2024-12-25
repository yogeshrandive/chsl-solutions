import { MainHeader } from "@/components/main-header";
import { getUserDetails } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function SocietyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserDetails();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader user={user} />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
