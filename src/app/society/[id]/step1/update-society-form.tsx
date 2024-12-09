'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState } from 'react';
import { updateSocietyStep1 } from '@/models/society';
import {
  step1FormSchema,
  Step1FormDataInterface,
} from '@/models/societyDefinations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DateInput } from '@/components/date-input';
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
import moment from 'moment';
import { Tables } from '@/utils/supabase/database.types';
import { billTypes } from '@/lib/constants';
import { AppUser } from '@/lib/constants';
import { getStates, getCitiesByState } from '@/app/society/create/actions';

export function UpdateSocietyForm({
  societyData,
}: {
  userData: AppUser;
  societyData: Tables<'societies'>;
}) {
  const [states, setStates] = useState<{ id: number; name: string }[]>([]);
  const [cities, setCities] = useState<
    { id: number; name: string; id_state: number }[]
  >([]);

  const form = useForm<Step1FormDataInterface>({
    resolver: zodResolver(step1FormSchema),
    defaultValues: {
      ...(societyData as Step1FormDataInterface),
    },
  });

  const [formState, updateSocietyAction, isPending] = useActionState(
    updateSocietyStep1,
    null
  );

  const { watch, setValue, getValues } = form;

  useEffect(() => {
    getStates().then(setStates);
  }, []);

  useEffect(() => {
    if (form.watch('id_state')) {
      getCitiesByState(form.watch('id_state')).then(setCities);
    }
  }, [form.watch('id_state')]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'bill_type' || name === 'cur_period_from') {
        const curPeriodFrom = getValues('cur_period_from');
        const watchBillType = getValues('bill_type');

        const curPeriodDate = moment(curPeriodFrom, 'YYYY-MM-DD');
        let curPeriodTo = '';
        let nextBillDate = '';

        switch (watchBillType) {
          case 'monthly':
            curPeriodTo = curPeriodDate
              .clone()
              .add(1, 'month')
              .subtract(1, 'day')
              .format('YYYY-MM-DD');
            nextBillDate = curPeriodDate
              .clone()
              .add(1, 'month')
              .format('YYYY-MM-DD');
            break;
          case 'bi-monthly':
            curPeriodTo = curPeriodDate
              .clone()
              .add(2, 'month')
              .subtract(1, 'day')
              .format('YYYY-MM-DD');
            nextBillDate = curPeriodDate
              .clone()
              .add(2, 'month')
              .format('YYYY-MM-DD');
            break;
          case 'quarterly':
            curPeriodTo = curPeriodDate
              .clone()
              .add(3, 'month')
              .subtract(1, 'day')
              .format('YYYY-MM-DD');
            nextBillDate = curPeriodDate
              .clone()
              .add(3, 'month')
              .format('YYYY-MM-DD');
            break;
          case 'half-yearly':
            curPeriodTo = curPeriodDate
              .clone()
              .add(6, 'month')
              .subtract(1, 'day')
              .format('YYYY-MM-DD');
            nextBillDate = curPeriodDate
              .clone()
              .add(6, 'month')
              .format('YYYY-MM-DD');
            break;
          case 'yearly':
            curPeriodTo = curPeriodDate
              .clone()
              .add(12, 'month')
              .subtract(1, 'day')
              .format('YYYY-MM-DD');
            nextBillDate = curPeriodDate
              .clone()
              .add(12, 'month')
              .format('YYYY-MM-DD');
            break;
        }

        setValue('cur_period_to', curPeriodTo);
        setValue('next_bill_date', nextBillDate);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, getValues]);

  return (
    <Form {...form}>
      <form action={updateSocietyAction} className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input type="hidden" name="id" value={societyData.id} />

          <FormItem>
            <FormLabel>Society Code</FormLabel>
            <FormControl>
              <Input disabled value={societyData.code} />
            </FormControl>
            <FormDescription>This is your unique society code.</FormDescription>
          </FormItem>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Society Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter society name" {...field} />
                </FormControl>
                <FormMessage>
                  {formState?.error?.name ? formState?.error?.name : ''}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="regi_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter registration number" {...field} />
                </FormControl>{' '}
                <FormMessage>
                  {formState?.error?.regi_no ? formState?.error?.regi_no : ''}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email" {...field} />
                </FormControl>{' '}
                <FormMessage>
                  {formState?.error?.email ? formState?.error?.email : ''}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage>
                  {formState?.error?.phone_number
                    ? formState?.error?.phone_number
                    : ''}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>{' '}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Address Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="id_state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(Number(value));
                      // Reset city when state changes
                      setValue('id_city', 0);
                    }}
                    value={field.value?.toString()}
                    name="id_state"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.id} value={state.id.toString()}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage>
                    {formState?.error?.id_state
                      ? formState?.error?.id_state
                      : ''}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="id_city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                    name="id_city"
                    disabled={!form.watch('id_state')}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities
                        .filter(
                          (city) => city.id_state === form.watch('id_state')
                        )
                        .map((city) => (
                          <SelectItem key={city.id} value={city.id.toString()}>
                            {city.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage>
                    {formState?.error?.id_city ? formState?.error?.id_city : ''}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pin_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PIN Code</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter PIN code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {formState?.error?.pin_code
                      ? formState?.error?.pin_code
                      : ''}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter address" {...field} />
                  </FormControl>{' '}
                  <FormMessage>
                    {formState?.error?.address ? formState?.error?.address : ''}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      type="string"
                      placeholder="Enter Location"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {formState?.error?.location
                      ? formState?.error?.location
                      : ''}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
        </div>{' '}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Other Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="gst_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GST Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter GST number" {...field} />
                  </FormControl>{' '}
                  <FormMessage>
                    {formState?.error?.gst_no ? formState?.error?.gst_no : ''}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pan_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PAN Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter PAN number" {...field} />
                  </FormControl>{' '}
                  <FormMessage>
                    {formState?.error?.pan_no ? formState?.error?.pan_no : ''}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tan_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TAN Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter TAN number" {...field} />
                  </FormControl>{' '}
                  <FormMessage>
                    {formState?.error?.tan_no ? formState?.error?.tan_no : ''}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sac_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SAC Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter SAC code" {...field} />
                  </FormControl>{' '}
                  <FormMessage>
                    {formState?.error?.sac_code
                      ? formState?.error?.sac_code
                      : ''}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bill_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Bill Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                    />
                  </FormControl>{' '}
                  <FormMessage>
                    {formState?.error?.bill_no ? formState?.error?.bill_no : ''}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="receipt_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Receipt Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                    />
                  </FormControl>
                  <FormMessage>
                    {formState?.error?.receipt_no
                      ? formState?.error?.receipt_no
                      : ''}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6 ">
          <FormField
            control={form.control}
            name="period_from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Period From</FormLabel>
                <FormControl>
                  <DateInput {...field} />
                </FormControl>
                <FormMessage>
                  {formState?.error?.period_from
                    ? formState?.error?.period_from
                    : ''}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="period_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Period To</FormLabel>
                <FormControl>
                  <DateInput {...field} />
                </FormControl>
                <FormMessage>
                  {formState?.error?.period_to
                    ? formState?.error?.period_to
                    : ''}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bill_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bill Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  name="bill_type"
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bill type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {billTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage>
                  {formState?.error?.bill_type
                    ? formState?.error?.bill_type
                    : ''}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6 ">
          <FormField
            control={form.control}
            name="cur_period_from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Period From</FormLabel>
                <FormControl>
                  <DateInput {...field} />
                </FormControl>
                <FormMessage>
                  {formState?.error?.cur_period_from
                    ? formState?.error?.cur_period_from
                    : ''}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cur_period_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Period To</FormLabel>
                <FormControl>
                  <DateInput {...field} />
                </FormControl>
                <FormMessage>
                  {formState?.error?.cur_period_to
                    ? formState?.error?.cur_period_to
                    : ''}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="next_bill_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next Bill Date</FormLabel>
                <FormControl>
                  <DateInput {...field} />
                </FormControl>
                <FormMessage>
                  {formState?.error?.next_bill_date
                    ? formState?.error?.next_bill_date
                    : ''}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isPending} className="flex float-right">
          {isPending ? 'Updating...' : 'Update Society'}
        </Button>
      </form>
    </Form>
  );
}
