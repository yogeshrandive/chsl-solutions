'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { headingSchema, HeadingFormData } from '@/models/societyDefinations';
import { Tables } from '@/utils/supabase/database.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addSocietyHeading } from '@/models/societyHeadings';
import Link from 'next/link';

type AccountMaster = Tables<'society_account_master'> & {
  sub_group?: { id: number; name: string };
  group?: { id: number; name: string };
};

interface AddSocietyHeadingFormProps {
  societyId: number;
  societyCode: string;
  accountMasters: AccountMaster[];
  onSuccess?: () => void;
}

export function AddSocietyHeadingForm({
  societyId,
  societyCode,
  accountMasters,
  onSuccess,
}: AddSocietyHeadingFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedAccount, setSelectedAccount] = useState<AccountMaster | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<HeadingFormData>({
    resolver: zodResolver(headingSchema),
    defaultValues: {
      amount: 0,
      is_interest: false,
      is_gst: false,
      id_account_master: 0,
    },
  });

  const onSubmit = async (data: HeadingFormData) => {
    console.log(data);
    if (!selectedAccount) {
      toast({
        variant: 'destructive',
        description: 'Please select an account',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await addSocietyHeading({
        amount: data.amount,
        is_interest: data.is_interest,
        is_gst: data.is_gst,
        id_account_master: selectedAccount.id,
        id_society: societyId,
      });

      if (success) {
        toast({ description: 'Heading added successfully!' });
        onSuccess?.();
        router.refresh();
      } else {
        throw new Error('Failed to add heading');
      }
    } catch (error) {
      // console.error('Error saving heading:', error);
      toast({
        variant: 'destructive',
        description: (error as Error).message ?? 'Failed to add heading',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="account">Select Account</Label>

            <Button type="button" variant="link" asChild className="p-0">
              <Link href={`/${societyCode}/accountmaster`}>
                Create Account Master
              </Link>
            </Button>
          </div>
          <Select
            required
            onValueChange={(value) => {
              const selected = accountMasters.find(
                (acc) => acc.id.toString() === value
              );
              setSelectedAccount(selected || null);
              form.setValue('id_account_master', selected?.id || 0);
            }}
            name="id_account_master"
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  accountMasters.length === 0
                    ? 'No accounts available'
                    : 'Select account...'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {accountMasters.map((account) => (
                <SelectItem key={account.id} value={account.id.toString()}>
                  {`${account.code} - ${account.name} ${
                    account.sub_group?.name ? `(${account.sub_group.name})` : ''
                  }`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedAccount && (
          <div className="p-4 bg-muted rounded-lg">
            <p>
              <strong>Code:</strong> {selectedAccount.code}
            </p>
            <p>
              <strong>Name:</strong> {selectedAccount.name}
            </p>
            <p>
              <strong>Group:</strong> {selectedAccount.group?.name}
            </p>
          </div>
        )}

        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            required
            {...form.register('amount', { valueAsNumber: true })}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_interest"
            name="is_interest"
            onCheckedChange={(checked) => {
              form.setValue('is_interest', checked as boolean);
            }}
          />
          <Label htmlFor="is_interest">Apply Interest</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_gst"
            name="is_gst"
            onCheckedChange={(checked) => {
              form.setValue('is_gst', checked as boolean);
            }}
          />
          <Label htmlFor="is_gst">Apply GST</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${societyCode}/info/step3`)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !selectedAccount}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSubmitting ? 'Saving...' : 'Save Heading'}
        </Button>
      </div>
    </form>
  );
}
