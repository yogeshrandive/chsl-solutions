/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatDateRange } from "@/lib/utils";
import { Tables } from "@/utils/supabase/database.types";
import { MemberBillsTable } from "./member-bills-table";
import { Badge } from "@/components/ui/badge";

interface BillDetailsPageProps {
    societyData: Tables<"societies">;
    billDetails: Tables<"society_bills">;
    memberBills: Tables<"member_bills">[];
}

export default function BillDetailsPage({
    societyData,
    billDetails,
    memberBills,
}: BillDetailsPageProps) {
    const getBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case "published":
                return "default";
            case "draft":
                return "secondary";
            case "cancelled":
                return "destructive";
            default:
                return "outline";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Bill Details</h1>
                <Badge variant={getBadgeVariant(billDetails.status)}>
                    {billDetails.status}
                </Badge>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <h3 className="font-medium text-sm text-muted-foreground">
                                Bill Information
                            </h3>
                            <div className="space-y-1">
                                <p>
                                    <span className="text-muted-foreground">
                                        Bill Lot:
                                    </span>{" "}
                                    {billDetails.bill_lot}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">
                                        Bill Date:
                                    </span>{" "}
                                    {formatDate(billDetails.bill_date)}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">
                                        Due Date:
                                    </span>{" "}
                                    {formatDate(billDetails.due_date)}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-medium text-sm text-muted-foreground">
                                Bill Period
                            </h3>
                            <p className="text-lg">
                                {formatDateRange(
                                    billDetails.bill_period_from,
                                    billDetails.bill_period_to,
                                )}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-medium text-sm text-muted-foreground">
                                Bill Summary
                            </h3>
                            <div className="space-y-1">
                                <p>
                                    <span className="text-muted-foreground">
                                        Starting Bill No:
                                    </span>{" "}
                                    {billDetails.start_bill_no}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">
                                        Interest Rate:
                                    </span>{" "}
                                    {billDetails.interest_rate}%
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Member Bills</h2>
                <MemberBillsTable
                    memberBills={memberBills as any}
                    societyCode={societyData.code}
                />
            </div>
        </div>
    );
}
