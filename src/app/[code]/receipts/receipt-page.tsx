/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ReceiptsTable from "./receipts-table";
import { Tables } from "@/utils/supabase/database.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReceiptEntryForm from "./receipt-entry-form";
import { ReceiptWithMemberDetails } from "@/models/receipt";

export default function ReceiptPage({
    receipts,
    members,
    books,
    societyData,
}: {
    receipts: ReceiptWithMemberDetails[];
    members: Tables<"members">[];
    books: Tables<"society_book_master">[];
    societyData: Tables<"societies">;
}) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Receipts</h1>
            </div>

            <Tabs defaultValue="generate" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="generate">Receipt Entry</TabsTrigger>
                    <TabsTrigger value="all">All Receipts</TabsTrigger>
                </TabsList>

                <TabsContent value="generate" className="space-y-4">
                    <ReceiptEntryForm
                        members={members as any}
                        books={books as any}
                        societyData={societyData}
                    />
                </TabsContent>

                <TabsContent value="all">
                    <ReceiptsTable
                        receipts={receipts as ReceiptWithMemberDetails[]}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
