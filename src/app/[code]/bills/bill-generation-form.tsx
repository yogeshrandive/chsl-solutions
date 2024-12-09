'use client';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Loader2 } from 'lucide-react';
import moment from 'moment';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { billGenerationSchema, type BillGenerationFormData } from './schema';
import { generateBill } from './actions';
import { Tables } from '@/utils/supabase/database.types';

export function BillGenerationForm({
  societyData,
}: {
  societyData: Tables<'societies'>;
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<BillGenerationFormData>({
    resolver: zodResolver(billGenerationSchema),
    defaultValues: {
      billDate: moment().format('YYYY-MM-DD'),
      societyId: societyData.id || undefined,
      billPeriodFrom: societyData?.cur_period_from,
      billPeriodTo: societyData?.cur_period_to,
      billLot: societyData?.bill_lot,
      startBillNo: (societyData?.bill_no || 0) + 1,
    },
  });

  const onSubmit = (data: BillGenerationFormData) => {
    startTransition(async () => {
      try {
        await generateBill(data);
        toast({
          description: 'Bill generated successfully',
        });
        form.reset();
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          description: 'Failed to generate bill',
        });
      }
    });
  };

  const canGenerateBill =
    societyData &&
    moment(societyData.next_bill_date).isSameOrBefore(moment(), 'day');

  if (!societyData) return <Loader2 className="h-8 w-8 animate-spin" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate New Bill</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Current Bill Period</Label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      {moment(societyData?.cur_period_from).format(
                        'DD MMM YYYY'
                      )}{' '}
                      -
                      {moment(societyData?.cur_period_to).format('DD MMM YYYY')}
                    </span>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="billDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bill Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          max={moment().format('YYYY-MM-DD')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {canGenerateBill ? (
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Bills'
                )}
              </Button>
            ) : (
              <p className="text-yellow-600">
                All bills are up to date. The next bill can be generated on{' '}
                {moment(societyData?.next_bill_date).format('DD MMM YYYY')}.
              </p>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
