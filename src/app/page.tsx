import { MainHeader } from "@/components/main-header";
import { getUserDetails } from "@/lib/dal";
import { redirect } from "next/navigation";
import { getSocieties } from "./society/actions";
import SocietiesClientPage from "./society/client-page";

interface PageProps {
    searchParams: { [key: string]: string | undefined };
}

export default async function HomePage({ searchParams }: PageProps) {
    const user = await getUserDetails();

    if (!user) {
        redirect("/login");
    }

    const { filter } = await searchParams;
    const societies = await getSocieties(user.id_tenant, filter);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="max-w-[1400px] mx-auto w-full">
                <MainHeader user={user} />
                <div className="flex-1">
                    <div className="p-8">
                        <SocietiesClientPage
                            societies={societies}
                            filter={filter}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
