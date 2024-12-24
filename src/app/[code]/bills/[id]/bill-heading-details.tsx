"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { getBillHeadingsById } from "@/models/societyBills";

interface BillHeadingDetailsProps {
    billId: number;
    isOpen: boolean;
    onClose: () => void;
}

export function BillHeadingDetails({
    billId,
    isOpen,
    onClose,
}: BillHeadingDetailsProps) {
    const [billHeadings, setBillHeadings] = useState<
        { id: number; code: string; name: string; amount: number }[]
    >([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        async function fetchBillHeadings() {
            if (!billId) return;

            try {
                const memberBillHeadings: {
                    id: number;
                    amount: number;
                    code: string;
                    name: string;
                }[] = await getBillHeadingsById(billId);

                if (memberBillHeadings) {
                    const headings = memberBillHeadings.map((
                        heading,
                    ) => ({
                        id: heading.id,
                        code: heading.code,
                        name: heading.name,
                        amount: heading.amount,
                    }));

                    setBillHeadings(headings);
                    setTotalAmount(
                        headings.reduce(
                            (sum, heading) => sum + heading.amount,
                            0,
                        ),
                    );
                }
            } catch (error) {
                console.error("Error fetching bill headings:", error);
            }
        }

        fetchBillHeadings();
    }, [billId]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Bill Heading Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Head Name</TableHead>
                                <TableHead className="text-right">
                                    Amount
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {billHeadings.map((heading) => (
                                <TableRow key={heading.id}>
                                    <TableCell className="font-medium">
                                        {heading.code}
                                    </TableCell>
                                    <TableCell>{heading.name}</TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(heading.amount)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={2}>Total Amount</TableCell>
                                <TableCell className="text-right">
                                    {formatCurrency(totalAmount)}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
}
