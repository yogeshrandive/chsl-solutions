'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { headingSchema, HeadingFormData } from '@/models/societyDefinations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { updateSocietyHeading } from '@/models/societyHeadings';

interface EditSocietyHeadingFormProps {
  heading: {
    id: number;
    amount: number;
    is_interest: boolean;
    is_gst: boolean;
    society_account_master?: {
      code: string;
      name: string;
    };
  };
  onSuccess?: () => void;
}

export function EditSocietyHeadingForm({
  heading,
  onSuccess,
}: EditSocietyHeadingFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<HeadingFormData>({
    resolver: zodResolver(headingSchema),
    defaultValues: {
      amount: heading.amount,
      is_interest: heading.is_interest,
      is_gst: heading.is_gst,
      id_account_master: heading.id,
    },
  });

  const onSubmit = async (data: HeadingFormData) => {
    setIsSubmitting(true);
    try {
      const success = await updateSocietyHeading(heading.id, {
        amount: data.amount,
        is_interest: data.is_interest,
        is_gst: data.is_gst,
      });

      if (success) {
        toast({ description: 'Heading updated successfully!' });
        onSuccess?.();
      } else {
        throw new Error('Failed to update heading');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: (error as Error).message ?? 'Failed to update heading',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <p>
            <strong>Code:</strong> {heading.society_account_master?.code}
          </p>
          <p>
            <strong>Name:</strong> {heading.society_account_master?.name}
          </p>
        </div>

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
            checked={form.watch('is_interest')}
            onCheckedChange={(checked) => {
              form.setValue('is_interest', checked as boolean);
            }}
          />
          <Label htmlFor="is_interest">Apply Interest</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_gst"
            checked={form.watch('is_gst')}
            onCheckedChange={(checked) => {
              form.setValue('is_gst', checked as boolean);
            }}
          />
          <Label htmlFor="is_gst">Apply GST</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSubmitting ? 'Saving...' : 'Update Heading'}
        </Button>
      </div>
    </form>
  );
}
