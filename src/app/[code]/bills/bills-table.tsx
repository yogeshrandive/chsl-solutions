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
import { Badge } from "@/components/ui/badge";
import { Eye, FileEdit } from "lucide-react";
import Link from "next/link";
import { formatDate, formatDateRange } from "@/lib/utils";
import { Tables } from "@/utils/supabase/database.types";

interface BillsTableProps {
  bills: Tables<"society_bills">[];
  societyCode: string;
  societyData: Tables<"societies">;
}

export function BillsTable({ bills, societyCode }: BillsTableProps) {
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
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Bill Lot</TableHead>
              <TableHead>Starting Bill No</TableHead>
              <TableHead>Bill Date</TableHead>
              <TableHead>Bill Period</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bills.map((bill, index) => (
              <TableRow key={bill.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{bill.bill_lot}</TableCell>
                <TableCell>{bill.start_bill_no}</TableCell>
                <TableCell>{formatDate(bill.bill_date)}</TableCell>
                <TableCell>
                  {formatDateRange(bill.bill_period_from, bill.bill_period_to)}
                </TableCell>
                <TableCell>{formatDate(bill.due_date)}</TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(bill.status)}>
                    {bill.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/${societyCode}/bills/${bill.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    {bill.status === "draft" && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/${societyCode}/bills/${bill.id}/edit`}>
                          <FileEdit className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {bills.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No bills found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
