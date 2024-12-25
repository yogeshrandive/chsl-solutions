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
    <div className="flex-col bg-gray-50">
      {children}
    </div>
  );
}
// <div className="min-h-screen flex flex-col bg-gray-50">
//   <div className="max-w-[1400px] mx-auto w-full">
//     <MainHeader user={user} />
//     <div className="flex-1">
//       {children}
//     </div>
//   </div>
// </div>
// );
// }
