'use client';

import { useEffect, useState } from 'react';
import { Eye, Loader2 } from 'lucide-react';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSociety } from '@/contexts/society-context';
import { getBills } from './actions';
import type { Bill } from './schema';

export function BillsTable() {
  const { societyId } = useSociety();
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (societyId) {
      getBills(societyId)
        .then(setBills)
        .finally(() => setIsLoading(false));
    }
  }, [societyId]);

  const formatDate = (date: string | null): string => {
    return date ? moment(date).format('DD MMM YYYY') : '-';
  };

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin" />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Bill Lot</TableHead>
          <TableHead>Start Bill Number</TableHead>
          <TableHead>Bill Date</TableHead>
          <TableHead>Bill Period</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bills.map((bill) => (
          <TableRow key={bill.id}>
            <TableCell>{bill.bill_lot}</TableCell>
            <TableCell>{bill.start_bill_no}</TableCell>
            <TableCell>{formatDate(bill.bill_date)}</TableCell>
            <TableCell>
              {formatDate(bill.bill_period_from)} -{' '}
              {formatDate(bill.bill_period_to)}
            </TableCell>
            <TableCell>
              {bill.status === 'pending' ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing
                </span>
              ) : (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    bill.status === 'success'
                      ? 'bg-green-100 text-green-800'
                      : bill.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {bill.status}
                </span>
              )}
            </TableCell>
            <TableCell>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {bills.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-center py-4 text-muted-foreground"
            >
              No bills generated yet
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
