'use client';
import { useEffect, useActionState, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { formSchema, FormDataInterface } from './definations';
import { billTypes } from '@/lib/constants';
import { createSociety, getStates, getCitiesByState } from './actions';
import { Textarea } from '@/components/ui/textarea';
import { DateInput } from '@/components/date-input';
import moment from 'moment';
import { getFinancialYearEndDate } from '@/lib/utils';

export function CreateSocietyForm({ tenantId }: { tenantId: number }) {
  const [states, setStates] = useState<{ id: number; name: string }[]>([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    getStates().then(setStates);
  }, []);

  const handleStateChange = async (stateId: string) => {
    form.setValue('id_state', parseInt(stateId));
    form.setValue('id_city', 0); // Reset city when state changes
    const citiesData = await getCitiesByState(parseInt(stateId));
    setCities(citiesData);
  };

  const form = useForm<FormDataInterface>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      name: '',
      regi_no: '',
      email: '',
      phone_number: '',
      address: '',
      location: '',
      pin_code: 0,
      id_state: 0,
      id_city: 0,
      bill_no: 1,
      receipt_no: 1,
      gst_no: '',
      pan_no: '',
      tan_no: '',
      sac_code: '',
      bill_type: billTypes[0].value,
      period_from: moment().format('YYYY-MM-DD'),
      period_to: getFinancialYearEndDate().format('YYYY-MM-DD'),
      cur_period_from: moment().format('YYYY-MM-DD'),
      cur_period_to: moment()
        .add(1, 'month')
        .subtract(1, 'day')
        .format('YYYY-MM-DD'),
      next_bill_date: moment().add(1, 'month').format('YYYY-MM-DD'),
      bill_lot: 2,
      id_tenant: tenantId,
      status: 'pending',
      step: 1,
    },
  });

  const [formState, createSocietyAction, isPending] = useActionState(
    createSociety,
    null
  );

  const { watch, setValue, getValues } = form;

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'bill_type' || name === 'cur_period_from') {
        const cuPrtiodFrom = getValues('cur_period_from');
        const watchBillType = getValues('bill_type');

        const curPeriodDate = moment(cuPrtiodFrom, 'YYYY-MM-DD');
        let curPeriodTo = '';
        let nextBillDate = '';

        switch (watchBillType) {
          case 'monthly':
            curPeriodTo = curPeriodDate
              .add(1, 'month')
              .subtract(1, 'day')
              .format('YYYY-MM-DD');
            nextBillDate = curPeriodDate.add(1, 'day').format('YYYY-MM-DD');
            break;
          case 'bi-monthly':
            curPeriodTo = curPeriodDate
              .add(2, 'month')
              .subtract(1, 'day')
              .format('YYYY-MM-DD');
            nextBillDate = curPeriodDate.add(1, 'day').format('YYYY-MM-DD');
            break;
          case 'quarterly':
            curPeriodTo = curPeriodDate
              .add(3, 'month')
              .subtract(1, 'day')
              .format('YYYY-MM-DD');
            nextBillDate = curPeriodDate.add(1, 'day').format('YYYY-MM-DD');
            break;
          case 'half-yearly':
            curPeriodTo = curPeriodDate
              .add(6, 'month')
              .subtract(1, 'day')
              .format('YYYY-MM-DD');
            nextBillDate = curPeriodDate.add(1, 'day').format('YYYY-MM-DD');
            break;
          case 'yearly':
            curPeriodTo = curPeriodDate
              .add(12, 'month')
              .subtract(1, 'day')
              .format('YYYY-MM-DD');
            nextBillDate = curPeriodDate.add(1, 'day').format('YYYY-MM-DD');
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
      <form action={createSocietyAction} className="space-y-6 w-full">
        <input type="hidden" {...form.register('id_tenant')} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Society Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription className="text-sm">
                  This is your unique society code.
                </FormDescription>
                <FormMessage>
                  {formState?.error?.code ? formState?.error?.code : ''}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Society Name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Registration No</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
                <FormLabel>Society Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
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
                  <Input {...field} />
                </FormControl>
                <FormMessage>
                  {formState?.error?.phone_number
                    ? formState?.error?.phone_number
                    : ''}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Address Details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            <FormField
              control={form.control}
              name="id_state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select
                    onValueChange={(value) => handleStateChange(value)}
                    defaultValue={field.value?.toString()}
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
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                    disabled={!form.getValues('id_state')}
                    name="id_city"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities.map((city) => (
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
                    <Input maxLength={6} {...field} />
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
                <FormItem className="md:col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
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
                    <Input {...field} />
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
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Other Details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            <FormField
              control={form.control}
              name="gst_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GST No</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                  <FormLabel>PAN No</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                  <FormLabel>TAN No</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                    <Input {...field} />
                  </FormControl>
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
                  <FormLabel>Bill Number</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
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
                  <FormLabel>Receipt Number</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 py-6">
          <FormField
            control={form.control}
            name="period_from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year Period From</FormLabel>
                <FormControl>
                  <DateInput
                    name={field.name}
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(moment(date).format('YYYY-MM-DD'))
                    }
                    disabled={field.disabled}
                  />
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
                <FormLabel>Year Period To</FormLabel>
                <FormControl>
                  <DateInput
                    name={field.name}
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(moment(date).format('YYYY-MM-DD'))
                    }
                    disabled={field.disabled}
                  />
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
                      <SelectValue placeholder="Select Bill Type" />
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 py-4">
          <FormField
            control={form.control}
            name="cur_period_from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Bill Period From</FormLabel>
                <FormControl>
                  <DateInput
                    name={field.name}
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(moment(date).format('YYYY-MM-DD'))
                    }
                    disabled={field.disabled}
                  />
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
                <FormLabel>Current Bill Period To</FormLabel>
                <FormControl>
                  <DateInput
                    name={field.name}
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(moment(date).format('YYYY-MM-DD'))
                    }
                    disabled={field.disabled}
                  />
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
                  <DateInput
                    name={field.name}
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(moment(date).format('YYYY-MM-DD'))
                    }
                    disabled={field.disabled}
                  />
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

        <FormMessage className="mt-4">
          {formState?.error_message ? formState?.error_message : ''}
        </FormMessage>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creating...' : 'Create Society'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
