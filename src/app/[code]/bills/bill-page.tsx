/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { BillsTable } from './bills-table';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate, formatDateRange } from '@/lib/utils';
import moment from 'moment';
import { billFrequency } from '@/lib/constants';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { BillGenerateForm } from './bill-generate-form';

export default function BillsPage({
  params,
  societyData,
  bills,
}: {
  params: { code: string };
  societyData: any;
  bills: any;
}) {
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const { code } = params;

  const currentDate = moment();
  const nextBillDate = moment(societyData.cur_period_to).add(1, 'day');
  const canGenerateBill = currentDate.isSameOrAfter(nextBillDate, 'day');

  const getBillFrequencyLabel = (value: string) => {
    return billFrequency.find((f) => f.value === value)?.label || value;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Society Bills</h1>
        {canGenerateBill && (
          <Button onClick={() => setIsGenerateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Generate Bill
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">
                Current Bill Period
              </h3>
              <p className="text-lg">
                {formatDateRange(
                  societyData.cur_period_from,
                  societyData.cur_period_to
                )}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">
                Bill Frequency
              </h3>
              <p className="text-lg capitalize">
                {getBillFrequencyLabel(societyData.bill_frequency)}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">
                Next Bill Date
              </h3>
              <p className="text-lg">
                {formatDate(nextBillDate.format('YYYY-MM-DD'))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <BillsTable bills={bills} societyCode={code} societyData={societyData} />

      <Dialog
        open={isGenerateDialogOpen}
        onOpenChange={setIsGenerateDialogOpen}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Generate New Bill</DialogTitle>
          </DialogHeader>
          <BillGenerateForm
            societyData={societyData}
            onSuccess={() => {
              setIsGenerateDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
