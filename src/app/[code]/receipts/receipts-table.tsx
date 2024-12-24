"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ReceiptWithMemberDetails } from "@/models/receipt";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ReceiptsTable({
    receipts,
}: {
    receipts: ReceiptWithMemberDetails[];
}) {
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        memberName: "",
        receiptNo: "",
        minAmount: "",
        maxAmount: "",
    });

    // Filter receipts based on all criteria
    const filteredReceipts = receipts.filter((receipt) => {
        const receiptDate = new Date(receipt.receipt_date);
        const startDate = filters.startDate
            ? new Date(filters.startDate)
            : null;
        const endDate = filters.endDate ? new Date(filters.endDate) : null;
        const amount = receipt.amount;

        return (
            // Date range filter
            (!startDate || receiptDate >= startDate) &&
            (!endDate || receiptDate <= endDate) &&
            // Member name filter
            (!filters.memberName ||
                receipt.member_bills.members.full_name
                    .toLowerCase()
                    .includes(filters.memberName.toLowerCase())) &&
            // Receipt number filter
            (!filters.receiptNo ||
                receipt.receipt_number
                    .toString()
                    .includes(filters.receiptNo)) &&
            // Amount range filter
            (!filters.minAmount || amount >= Number(filters.minAmount)) &&
            (!filters.maxAmount || amount <= Number(filters.maxAmount))
        );
    });

    return (
        <div className="space-y-4">
            {/* Filter Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/50 p-4 rounded-lg">
                <div className="space-y-2">
                    <Label>Date Range</Label>
                    <div className="flex gap-2">
                        <Input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    startDate: e.target.value,
                                })}
                            placeholder="Start Date"
                        />
                        <Input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    endDate: e.target.value,
                                })}
                            placeholder="End Date"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Search</Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Member Name"
                            value={filters.memberName}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    memberName: e.target.value,
                                })}
                        />
                        <Input
                            placeholder="Receipt No"
                            value={filters.receiptNo}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    receiptNo: e.target.value,
                                })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Amount Range</Label>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder="Min Amount"
                            value={filters.minAmount}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    minAmount: e.target.value,
                                })}
                        />
                        <Input
                            type="number"
                            placeholder="Max Amount"
                            value={filters.maxAmount}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    maxAmount: e.target.value,
                                })}
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Receipt No</TableHead>
                        <TableHead>Flat No</TableHead>
                        <TableHead>Member</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">
                            Total Bill Amount
                        </TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Payment Mode</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredReceipts.length === 0
                        ? (
                            <TableRow>
                                <TableCell
                                    colSpan={9}
                                    className="text-center py-4"
                                >
                                    No receipts found
                                </TableCell>
                            </TableRow>
                        )
                        : (
                            filteredReceipts.map((receipt, index) => (
                                <TableRow key={receipt.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        {receipt.receipt_number}
                                    </TableCell>
                                    <TableCell>
                                        {receipt.member_bills.members.flat_no}
                                    </TableCell>
                                    <TableCell>
                                        {receipt.member_bills.members.full_name}
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(receipt.receipt_date)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(
                                            receipt.member_bills
                                                .total_bill_amount,
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(receipt.amount)}
                                    </TableCell>
                                    <TableCell>
                                        {receipt.mode_of_payment}
                                    </TableCell>
                                    <TableCell>edit</TableCell>
                                </TableRow>
                            ))
                        )}
                </TableBody>
            </Table>
        </div>
    );
}
