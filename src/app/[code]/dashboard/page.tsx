import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import { DashboardCards } from "./components/dashboard-cards";
import { InfoCards } from "./components/info-cards";
import DashboardLoading from "./loading";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const { data: society } = await supabase
    .from("societies")
    .select("*")
    .eq("id", 9)
    .single();

  return (
    <Suspense fallback={<DashboardLoading />}>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h2>
        </div>

        <DashboardCards />

        <InfoCards user={data.user} society={society!} />
      </div>
    </Suspense>
  );
}
