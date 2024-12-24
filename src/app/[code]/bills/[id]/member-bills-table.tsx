"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Tables } from "@/utils/supabase/database.types";
import { useState } from "react";
import { BillHeadingDetails } from "./bill-heading-details";

interface MemberBillsTableProps {
    memberBills: (Tables<"member_bills"> & {
        member_name: string;
        flat_no: string;
    })[];
    societyCode: string;
}

export function MemberBillsTable(
    { memberBills }: MemberBillsTableProps,
) {
    const [selectedBillId, setSelectedBillId] = useState<number | null>(null);
    const [isHeadingDialogOpen, setIsHeadingDialogOpen] = useState(false);

    const handleViewHeadings = (bill: typeof memberBills[0]) => {
        if (bill.id) {
            setSelectedBillId(bill.id);
            setIsHeadingDialogOpen(true);
        }
    };

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Bill No.</TableHead>
                            <TableHead>Member Name</TableHead>
                            <TableHead>Flat ID</TableHead>
                            <TableHead className="text-right">
                                Principle Arrears
                            </TableHead>
                            <TableHead className="text-right">
                                Interest Arrears
                            </TableHead>
                            <TableHead className="text-right">
                                Interest Amount
                            </TableHead>
                            <TableHead className="text-right">
                                Bill Amount
                            </TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead>
                                <div className="text-right">
                                    Payment Made
                                    <div className="text-xs text-muted-foreground font-normal">
                                        Before Due / After Due
                                    </div>
                                </div>
                            </TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {memberBills.map((bill) => (
                            <TableRow key={bill.id}>
                                <TableCell>{bill.bill_no}</TableCell>
                                <TableCell>{bill.member_name}</TableCell>
                                <TableCell>{bill.flat_no}</TableCell>
                                <TableCell className="text-right">
                                    {formatCurrency(bill.principle_arrears)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatCurrency(bill.interest_arrears)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatCurrency(bill.interest_amount)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatCurrency(bill.bill_amount)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatCurrency(bill.total_bill_amount)}
                                </TableCell>
                                <TableCell>
                                    <div className="text-right space-y-1">
                                        <div>
                                            Before Due: {formatCurrency(
                                                bill.payment_made
                                                    ?.before_due_date || 0,
                                            )}
                                        </div>
                                        <div className="text-muted-foreground">
                                            After Due: {formatCurrency(
                                                bill.payment_made
                                                    ?.after_due_date ||
                                                    0,
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewHeadings(bill)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {memberBills.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center">
                                    No member bills found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <BillHeadingDetails
                billId={selectedBillId || 0}
                isOpen={isHeadingDialogOpen}
                onClose={() => setIsHeadingDialogOpen(false)}
            />
        </>
    );
}
