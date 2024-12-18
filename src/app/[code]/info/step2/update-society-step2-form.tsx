'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState } from 'react';
import { updateSocietyStep2 } from '@/models/society';
import {
  step2FormSchema,
  Step2FormDataInterface,
  periodOfCalculationOptions,
  interestTypeOptions,
  creditAdjFirstOptions,
} from '@/models/societyDefinations';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tables } from '@/utils/supabase/database.types';
import { billFrequency } from '@/lib/constants';

export function UpdateSocietyStep2Form({
  societyData,
}: {
  societyData: Tables<'societies'>;
}) {
  const form = useForm<Step2FormDataInterface>({
    resolver: zodResolver(step2FormSchema),
    defaultValues: {
      payment_due_date: societyData.payment_due_date || 30,
      grace_period: societyData.grace_period || 0,
      interest_rate: societyData.interest_rate || 21,
      interest_period:
        (societyData.interest_period as 'daily' | 'as_per_bill_type') ||
        'daily',
      interest_type:
        (societyData.interest_type as 'simple' | 'compound') || 'simple',
      interest_min_rs: societyData.interest_min_rs || 0,
      round_off_amount: societyData.round_off_amount || true,
      credit_adj_first:
        (societyData.credit_adj_first as 'interest' | 'principle') ||
        'principle',
    },
  });

  const [formState, updateSocietyAction, isPending] = useActionState(
    updateSocietyStep2,
    null
  );

  const { watch } = form;
  const interestPeriod = watch('interest_period');

  return (
    <Form {...form}>
      <form action={updateSocietyAction}>
        <input type="hidden" name="id" value={societyData.id} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="payment_due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Due Date</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage>
                  {formState?.error?.payment_due_date
                    ? formState?.error?.payment_due_date
                    : ''}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="grace_period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grace Period (days)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage>
                  {formState?.error?.grace_period
                    ? formState?.error?.grace_period
                    : ''}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="interest_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Rate (% per annum)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage>
                  {formState?.error?.interest_rate
                    ? formState?.error?.interest_rate
                    : ''}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="interest_period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Period of Calculation</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  name="interest_period"
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period of calculation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {periodOfCalculationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                    {
                      <SelectItem value={societyData.bill_frequency}>
                        {
                          billFrequency.find(
                            (b) => b.value === societyData.bill_frequency
                          )?.label
                        }
                      </SelectItem>
                    }
                  </SelectContent>
                </Select>
                <FormMessage>
                  {formState?.error?.interest_period
                    ? formState?.error?.interest_period
                    : ''}
                </FormMessage>
                <FormMessage />
                {interestPeriod === 'as_per_bill_type' && (
                  <FormDescription>
                    Will be saved as:{' '}
                    {
                      billFrequency.find(
                        (b) => b.value === societyData.bill_frequency
                      )?.label
                    }
                  </FormDescription>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="interest_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  name="interest_type"
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select interest type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {interestTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage>
                  {formState?.error?.interest_type
                    ? formState?.error?.interest_type
                    : ''}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="interest_min_rs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Interest (Rs)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="10"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage>
                  {formState?.error?.interest_min_rs
                    ? formState?.error?.interest_min_rs
                    : ''}
                </FormMessage>
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
                  defaultValue={field.value}
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
                <FormMessage>
                  {formState?.error?.credit_adj_first
                    ? formState?.error?.credit_adj_first
                    : ''}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="round_off_amount"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Round Off Amount</FormLabel>
                  <FormDescription>
                    Whether to round off the final amount
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage>
                  {formState?.error?.round_off_amount
                    ? formState?.error?.round_off_amount
                    : ''}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <FormMessage>
          {formState?.error_message ? formState?.error_message : ''}
        </FormMessage>
        <Button type="submit" disabled={isPending} className="flex float-right">
          {isPending ? 'Updating...' : 'Update & Next'}
        </Button>
      </form>
    </Form>
  );
}
