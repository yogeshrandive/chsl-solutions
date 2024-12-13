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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PencilIcon } from 'lucide-react';
import {
  rebateSettingsSchema,
  RebateSettings,
  SocietyHeading,
  Society,
} from '@/models/societyDefinations';
import {
  updateSocietyStep4,
  fetchRebateSettings,
  getSocietyHeadings,
  updateHeadingRebate,
} from '@/models/society';

export function RebateSettingsForm({
  societyId,
  societyData,
}: {
  societyId: string;
  societyData: Society;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [societyHeadings, setSocietyHeadings] = useState<SocietyHeading[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingHeading, setEditingHeading] = useState<SocietyHeading | null>(
    null
  );

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
    getSocietyHeadings(societyData.id).then((headings) => {
      setSocietyHeadings(
        headings.map((h) => ({
          id: h.id,
          id_society: h.id_society,
          code: h.code,
          name: h.name,
          amount: h.amount,
          created_at: h.created_at,
          is_interest: h.is_interest,
          is_gst: h.is_gst,
          rebate_amount: h.rebate_amount || 0,
          rebate_percentage: h.rebate_percentage || 0,
        }))
      );
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

  const handleEditHeading = (heading: SocietyHeading) => {
    setEditingHeading(heading);
    setIsEditDialogOpen(true);
  };

  const handleUpdateHeading = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHeading) return;

    try {
      await updateHeadingRebate(editingHeading.id, {
        rebate_amount: editingHeading.rebate_amount || 0,
        rebate_percentage: editingHeading.rebate_percentage || 0,
      });
      toast({
        title: 'Heading updated successfully!',
        description: 'You can now proceed to the next step.',
      });
      setIsEditDialogOpen(false);
      getSocietyHeadings(societyData.id).then((headings) => {
        setSocietyHeadings(
          headings.map((h) => ({
            id: h.id,
            id_society: h.id_society,
            code: h.code,
            name: h.name,
            amount: h.amount,
            created_at: h.created_at,
            is_interest: h.is_interest,
            is_gst: h.is_gst,
            rebate_amount: h.rebate_amount || 0,
            rebate_percentage: h.rebate_percentage || 0,
          }))
        );
      });
    } catch (error) {
      console.error('Error updating heading:', error);
      toast({
        title: 'Failed to update heading',
        description: 'Please try again.',
      });
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
                      value as 'fixed_amount' | 'fixed_per' | 'manual'
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
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manual" id="manual" />
                    <Label htmlFor="manual">Manual</Label>
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

              {rebateType === 'manual' && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Rebate Amount</TableHead>
                      <TableHead>Rebate Percentage</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {societyHeadings.map((heading) => (
                      <TableRow key={heading.id}>
                        <TableCell>{heading.code}</TableCell>
                        <TableCell>{heading.name}</TableCell>
                        <TableCell>{heading.rebate_amount}</TableCell>
                        <TableCell>{heading.rebate_percentage}%</TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditHeading(heading)}
                          >
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            onClick={() => router.push(`/society/${societyId}/step3`)}
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Heading Rebate</DialogTitle>
            <DialogDescription>
              Update the rebate amount and percentage for this heading.
            </DialogDescription>
          </DialogHeader>
          {editingHeading && (
            <form onSubmit={handleUpdateHeading} className="space-y-4">
              <div>
                <Label htmlFor="edit-rebate-amount">Rebate Amount</Label>
                <Input
                  id="edit-rebate-amount"
                  type="number"
                  step="0.01"
                  value={editingHeading.rebate_amount || ''}
                  onChange={(e) =>
                    setEditingHeading({
                      ...editingHeading,
                      rebate_amount: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-rebate-per">Rebate Percentage</Label>
                <Input
                  id="edit-rebate-per"
                  type="number"
                  step="0.01"
                  value={editingHeading.rebate_percentage || ''}
                  onChange={(e) =>
                    setEditingHeading({
                      ...editingHeading,
                      rebate_percentage: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Update Heading
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
