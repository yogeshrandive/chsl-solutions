'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import {
  rebateSettingsSchema,
  RebateSettings,
  Society,
} from '@/models/societyDefinations';
import { updateSocietyStep4, fetchRebateSettings } from '@/models/society';

export function RebateSettingsForm({
  societyId,
  societyData,
}: {
  societyId: number;
  societyData: Society;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RebateSettings>({
    resolver: zodResolver(rebateSettingsSchema),
    defaultValues: {
      rebate_apply: false,
      rebate_type: 'fixed_amount',
      rebate_due_date: 1,
      rebate_fixed_amount: 0,
      rebate_percentage: 0,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const rebateApply = watch('rebate_apply');
  const rebateType = watch('rebate_type');

  useEffect(() => {
    fetchRebateSettings(societyId).then((data) => {
      if (data) {
        setValue('rebate_apply', data.rebate_apply);
        setValue('rebate_type', data.rebate_type);
        setValue('rebate_due_date', data.rebate_due_date);
        setValue('rebate_fixed_amount', data.rebate_fixed_amount);
        setValue('rebate_percentage', data.rebate_percentage);
      }
    });
  }, [societyId, setValue]);

  const onSubmit = async (data: RebateSettings) => {
    setIsSubmitting(true);
    try {
      const formData = {
        ...data,
        rebate_due_date: Number(data.rebate_due_date),
        rebate_fixed_amount: Number(data.rebate_fixed_amount),
        rebate_percentage: Number(data.rebate_percentage),
      };

      await updateSocietyStep4(societyId, formData);
      toast({
        title: 'Success',
        description: 'Rebate settings updated successfully!',
      });

      router.push(`/${societyData.code}/info/step5`);
    } catch (error) {
      console.error('Error updating rebate settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update rebate settings',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 p-4 bg-gray-100 rounded-lg">
            <Switch
              id="rebate_apply"
              checked={rebateApply}
              onCheckedChange={(checked) => setValue('rebate_apply', checked)}
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor="rebate_apply" className="text-lg font-medium">
              Apply Rebate
            </Label>
          </div>

          {rebateApply && (
            <>
              <div>
                <Label htmlFor="rebate_due_date">Rebate Due Date (1-30)</Label>
                <Input
                  id="rebate_due_date"
                  type="number"
                  min="1"
                  max="30"
                  {...register('rebate_due_date', { valueAsNumber: true })}
                />
                {errors.rebate_due_date && (
                  <span className="text-red-500 text-sm">
                    {errors.rebate_due_date.message}
                  </span>
                )}
              </div>

              <div>
                <Label>Rebate Type</Label>
                <RadioGroup
                  value={rebateType}
                  onValueChange={(value) =>
                    setValue(
                      'rebate_type',
                      value as 'fixed_amount' | 'fixed_per'
                    )
                  }
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed_amount" id="fixed_amount" />
                    <Label htmlFor="fixed_amount">Fixed Amount</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed_per" id="fixed_per" />
                    <Label htmlFor="fixed_per">Fixed Percentage</Label>
                  </div>
                </RadioGroup>
              </div>

              {rebateType === 'fixed_amount' && (
                <div>
                  <Label htmlFor="rebate_fixed_amount">Fixed Amount</Label>
                  <Input
                    id="rebate_fixed_amount"
                    type="number"
                    step="0.01"
                    {...register('rebate_fixed_amount', {
                      valueAsNumber: true,
                      setValueAs: (value) => (value === '' ? 0 : Number(value)),
                    })}
                  />
                  {errors.rebate_fixed_amount && (
                    <span className="text-red-500 text-sm">
                      {errors.rebate_fixed_amount.message}
                    </span>
                  )}
                </div>
              )}

              {rebateType === 'fixed_per' && (
                <div>
                  <Label htmlFor="rebate_fixed_per">Fixed Percentage</Label>
                  <Input
                    id="rebate_fixed_per"
                    type="number"
                    step="0.01"
                    {...register('rebate_percentage', {
                      valueAsNumber: true,
                      setValueAs: (value) => (value === '' ? 0 : Number(value)),
                    })}
                  />
                  {errors.rebate_percentage && (
                    <span className="text-red-500 text-sm">
                      {errors.rebate_percentage.message}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            onClick={() => router.push(`/${societyData.code}/info/step3`)}
            variant="outline"
          >
            Previous
          </Button>
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save & Next'}
          </Button>
        </div>
      </form>
    </div>
  );
}
