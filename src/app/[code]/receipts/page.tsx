import {
    getReceiptsBySocietyId,
    ReceiptWithMemberDetails,
} from "@/models/receipt";
import ReceiptPage from "./receipt-page";
import { redirect } from "next/navigation";
import { getUserDetails } from "@/lib/dal";
import { getSocietyByCode } from "@/models/society";
import { getMembers } from "@/models/members";
import { getBooksBySocietyId } from "@/models/bookMaster";

export default async function Receipts({
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

    const [receipts, members, books] = await Promise.all([
        getReceiptsBySocietyId(societyData.id),
        getMembers(societyData.id),
        getBooksBySocietyId(societyData.id, "bank"),
    ]);
    return (
        <ReceiptPage
            receipts={receipts as unknown as ReceiptWithMemberDetails[]}
            members={members}
            books={books}
            societyData={societyData}
        />
    );
}
