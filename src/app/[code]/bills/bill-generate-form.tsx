/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tables } from '@/utils/supabase/database.types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DateInput } from '@/components/date-input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { generateBill } from '@/models/societyBills';
import { billGenerateSchema } from '@/models/societyBillsSchema';
import moment from 'moment';
import { billFrequency } from '@/lib/constants';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDate } from '@/lib/utils';
import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { creditAdjFirstOptions } from '@/models/societyDefinations';
import { useState } from 'react';

interface BillGenerateFormProps {
  societyData: Tables<'societies'>;
  onSuccess?: () => void;
}

export function BillGenerateForm({
  societyData,
  onSuccess,
}: BillGenerateFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(billGenerateSchema),
    defaultValues: {
      bill_lot: societyData.bill_lot,
      bill_date: moment().format('YYYY-MM-DD'),
      bill_period_from: societyData.cur_period_from,
      bill_period_to: societyData.cur_period_to,
      due_date: moment()
        .add(societyData.payment_due_date, 'days')
        .format('YYYY-MM-DD'),
      start_bill_no: societyData.bill_no,
      interest_rate: societyData.interest_rate,
      credit_adj_first: societyData.credit_adj_first,
      comments: societyData.comments || [],
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await generateBill({
        ...data,
        id_society: societyData.id,
      });

      toast({ description: 'Bill generated successfully' });
      onSuccess?.();
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        description:
          error instanceof Error ? error.message : 'Failed to generate bill',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBillFrequencyLabel = (value: string) => {
    return billFrequency.find((f) => f.value === value)?.label || value;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ScrollArea className="h-[calc(100vh-200px)] md:h-[80vh] pr-4 ">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Bill Frequency
                  </Label>
                  <p className="font-medium">
                    {getBillFrequencyLabel(societyData.bill_frequency)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Bill Period
                  </Label>
                  <p className="font-medium">
                    {formatDate(societyData.cur_period_from)} -{' '}
                    {formatDate(societyData.cur_period_to)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Due Date
                  </Label>
                  <p className="font-medium">
                    {formatDate(
                      moment()
                        .add(societyData.payment_due_date, 'days')
                        .format('YYYY-MM-DD')
                    )}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Bill Lot Number
                  </Label>
                  <p className="font-medium">{societyData.bill_lot}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Starting Bill Number
                  </Label>
                  <p className="font-medium">{societyData.bill_no}</p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-6">
              <Label>Bill Settings</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="bill_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bill Date</FormLabel>
                      <FormControl>
                        <DateInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="interest_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="credit_adj_first"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Adjusted First</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || 'principle'}
                        name="credit_adj_first"
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select credit adjusted first" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {creditAdjFirstOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="my-4" />

            {/* Comments Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Bill Comments</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    form.setValue('comments', [...form.watch('comments'), ''])
                  }
                >
                  Add Comment
                </Button>
              </div>
              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2">
                      {field.value.map((comment, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={comment}
                            onChange={(e) => {
                              const newComments = [...field.value];
                              newComments[index] = e.target.value;
                              field.onChange(newComments);
                            }}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="shrink-0"
                            onClick={() => {
                              const newComments = field.value.filter(
                                (_, i) => i !== index
                              );
                              field.onChange(newComments);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </ScrollArea>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:space-x-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSuccess?.()}
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Generating...' : 'Generate Bill'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
