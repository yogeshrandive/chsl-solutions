import { redirect } from "next/navigation";
import { getUserDetails } from "@/lib/dal";
import { getSocietyByCode } from "@/models/society";
import {
    getBillById,
    getBillRegisterByBillId,
    // getMemberBillsByBillId,
} from "@/models/societyBills";
import BillDetailsPage from "./bill-details-page";
import { BillRegister } from "./member-bills-table";

interface PageProps {
    params: Promise<{
        code: string;
        id: string;
    }>;
}

export default async function BillDetailsPageServer({
    params,
}: PageProps) {
    const user = await getUserDetails();
    if (!user) {
        redirect("/login");
    }

    const { code, id } = await params;
    const societyData = await getSocietyByCode(code);
    if (!societyData) redirect("/");

    const billDetails = await getBillById(parseInt(id));
    if (!billDetails) redirect(`/${code}/bills`);

    // const memberBills = await getMemberBillsByBillId(parseInt(id));
    const billRegister = await getBillRegisterByBillId(parseInt(id));

    return (
        <BillDetailsPage
            societyData={societyData}
            billDetails={billDetails}
            billRegister={billRegister as unknown as BillRegister[]}
        />
    );
}
