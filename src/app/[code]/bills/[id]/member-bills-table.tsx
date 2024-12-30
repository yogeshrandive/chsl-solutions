"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Tables } from "@/utils/supabase/database.types";
import moment from "moment";

export interface BillRegister extends Tables<"member_bills"> {
    members: {
        flat_no: string;
        full_name: string;
    };
    receipts: Array<{
        id: number;
        receipt_date: string;
        amount: number;
    }>;
    member_bill_headings: Array<{
        id: number;
        amount: number;
        society_account_master: {
            code: string;
            name: string;
        };
    }>;
}

export function MemberBillsTable(
    { billRegisters }: { billRegisters: BillRegister[] },
) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Bill No.</TableHead>
                        <TableHead>Member Details</TableHead>
                        {billRegisters[0]?.member_bill_headings.map((
                            heading,
                        ) => (
                            <TableHead
                                key={heading.id}
                                className="text-right"
                            >
                                {heading.society_account_master.name}
                            </TableHead>
                        ))}
                        <TableHead className="text-right">Interest</TableHead>
                        <TableHead className="text-right">
                            Bill Amount
                        </TableHead>
                        <TableHead className="text-right">
                            Principal Arrears
                        </TableHead>
                        <TableHead className="text-right">
                            Interest Arrears
                        </TableHead>
                        <TableHead className="text-right">
                            Total Amount
                        </TableHead>
                        <TableHead className="text-center">
                            Receipts
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {billRegisters.map((register) => (
                        <TableRow key={register.id}>
                            <TableCell>
                                <div className="space-y-1">
                                    <div className="font-medium">
                                        {register.bill_no}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Lot: {register.bill_lot}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    <div className="font-medium">
                                        {register.members.full_name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {register.members.flat_no}
                                    </div>
                                </div>
                            </TableCell>
                            {register.member_bill_headings.map((heading) => (
                                <TableCell
                                    key={heading.id}
                                    className="text-right"
                                >
                                    {formatCurrency(heading.amount)}
                                </TableCell>
                            ))}
                            <TableCell className="text-right">
                                {formatCurrency(register.interest_amount)}
                            </TableCell>
                            <TableCell className="text-right">
                                {formatCurrency(register.bill_amount)}
                            </TableCell>
                            <TableCell className="text-right">
                                {formatCurrency(register.principle_arrears)}
                            </TableCell>
                            <TableCell className="text-right">
                                {formatCurrency(register.interest_arrears)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                                {formatCurrency(register.total_bill_amount)}
                            </TableCell>
                            <TableCell className="text-right">
                                {register.receipts.map((receipt) => (
                                    <div
                                        key={receipt.id}
                                        className="flex items-center justify-center space-x-2 text-sm"
                                    >
                                        <span className="text-muted-foreground">
                                            {moment(receipt.receipt_date)
                                                .format("DD,MMM")}
                                        </span>
                                        <span className="font-medium">
                                            {formatCurrency(receipt.amount)}
                                        </span>
                                    </div>
                                ))}
                            </TableCell>
                        </TableRow>
                    ))}
                    {billRegisters.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center">
                                No bill registers found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
