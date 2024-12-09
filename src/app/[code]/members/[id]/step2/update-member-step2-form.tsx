'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  memberStep2Schema,
  type step2FormDataInterface,
} from '@/models/memberSchema';
import { updateMemberStep2 } from '@/models/members';
import { Tables } from '@/utils/supabase/database.types';
import { useActionState } from 'react';

export default function UpdateMemberStep2Form({
  member,
  societyCode,
}: {
  member: Tables<'members'>;
  societyCode: string;
}) {
  const form = useForm<step2FormDataInterface>({
    resolver: zodResolver(memberStep2Schema),
    defaultValues: {
      principle_op_balance: member.principle_op_balance || 0,
      interest_op_balance: member.interest_op_balance || 0,
      interest_free_arrears: member.interest_free_arrears || 0,
    },
  });

  const [formState, updateMemberAction, isPending] = useActionState(
    updateMemberStep2,
    null
  );

  return (
    <Form {...form}>
      <form action={updateMemberAction} className="space-y-6">
        <input type="hidden" name="id" value={member.id} />
        <input type="hidden" name="society_code" value={societyCode} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="principle_op_balance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Principal Opening Balance</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter principal arrears"
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {formState?.error?.principle_op_balance}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interest_op_balance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Opening Balance</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter interest arrears"
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {formState?.error?.interest_op_balance}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interest_free_arrears"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Free Arrears</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter interest free arrears"
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {formState?.error?.interest_free_arrears}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <FormMessage>{formState?.error_message}</FormMessage>
        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save & Next'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
