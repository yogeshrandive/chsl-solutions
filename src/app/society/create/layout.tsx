import { MainHeader } from "@/components/main-header";
import { getUserDetails } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function CreateSocietyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUserDetails();
    if (!user) {
        redirect("/login");
    }

    return (
        <div className="max-w-[1400px] mx-auto">
            <MainHeader user={user} />
            <div className="">
                {children}
            </div>
        </div>
    );
}
