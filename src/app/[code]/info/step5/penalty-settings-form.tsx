'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Society } from '@/models/societyDefinations';

import {
  penaltySettingsSchema,
  PenaltySettings,
} from '@/models/societyDefinations';
import { updateSocietyStep5, fetchPenaltySettings } from '@/models/society';

export function PenaltySettingsForm({
  societyId,
  societyData,
}: {
  societyId: string;
  societyData: Society;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PenaltySettings>({
    resolver: zodResolver(penaltySettingsSchema),
    defaultValues: {
      penalty_apply: false,
      penalty_charged_on: 'fixed_amount',
      penalty_fixed_amount: 0,
      penalty_percentage: 0,
      penalty_on_bill_exceed: 0,
    },
  });

  const penaltyApply = watch('penalty_apply');
  const penaltyChargedOn = watch('penalty_charged_on');

  useEffect(() => {
    fetchPenaltySettings(societyId).then((data) => {
      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          setValue(key as keyof PenaltySettings, value);
        });
      }
    });
  }, [societyId, setValue]);

  const onSubmit: SubmitHandler<PenaltySettings> = async (data) => {
    setIsSubmitting(true);
    try {
      await updateSocietyStep5(societyId, data);
      toast({
        description: 'Penalty settings updated successfully!',
      });
      router.push(`/${societyData.code}/info/step6`);
    } catch (error) {
      console.error('Error updating penalty settings:', error);
      toast({
        variant: 'destructive',
        description: 'Failed to update penalty settings',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <div className="space-y-4 ">
            <div className="flex items-center space-x-2 p-4 bg-gray-100 rounded-lg">
              <Switch
                id="penalty_apply"
                checked={penaltyApply}
                onCheckedChange={(checked) =>
                  setValue('penalty_apply', checked)
                }
                className="data-[state=checked]:bg-primary"
              />
              <Label htmlFor="penalty_apply" className="text-lg font-medium">
                Apply Penalty
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable penalty charges for late payments
              </p>
            </div>
          </div>

          {penaltyApply && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Penalty Type</Label>
                  <RadioGroup
                    value={penaltyChargedOn}
                    onValueChange={(value) =>
                      setValue(
                        'penalty_charged_on',
                        value as 'fixed_amount' | 'percentage'
                      )
                    }
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="fixed_amount" id="fixed_amount" />
                      <Label htmlFor="fixed_amount" className="flex-grow">
                        Fixed Amount
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="percentage" id="percentage" />
                      <Label htmlFor="percentage" className="flex-grow">
                        Percentage
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="penalty_on_bill_exceed">
                    Apply on Bills Exceeding Amount
                  </Label>
                  <Input
                    id="penalty_on_bill_exceed"
                    type="number"
                    step="0.01"
                    {...register('penalty_on_bill_exceed', {
                      valueAsNumber: true,
                    })}
                    className="w-full"
                  />
                  {errors.penalty_on_bill_exceed && (
                    <p className="text-sm text-destructive">
                      {errors.penalty_on_bill_exceed.message}
                    </p>
                  )}
                </div>
              </div>

              {penaltyChargedOn === 'fixed_amount' ? (
                <div className="space-y-2">
                  <Label htmlFor="penalty_fixed_amount">
                    Fixed Penalty Amount
                  </Label>
                  <Input
                    id="penalty_fixed_amount"
                    type="number"
                    step="0.01"
                    {...register('penalty_fixed_amount', {
                      valueAsNumber: true,
                    })}
                    className="w-full"
                  />
                  {errors.penalty_fixed_amount && (
                    <p className="text-sm text-destructive">
                      {errors.penalty_fixed_amount.message}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="penalty_per">Penalty Percentage</Label>
                  <div className="relative">
                    <Input
                      id="penalty_per"
                      type="number"
                      step="0.01"
                      {...register('penalty_percentage', {
                        valueAsNumber: true,
                      })}
                      className="w-full pr-8"
                    />
                    <span className="absolute right-3 top-2 text-gray-500">
                      %
                    </span>
                  </div>
                  {errors.penalty_percentage && (
                    <p className="text-sm text-destructive">
                      {errors.penalty_percentage.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            onClick={() => router.push(`/society/${societyId}/step4`)}
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
