'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import {
  updateSocietyStep3,
  addHeading,
  updateHeading,
  deleteHeading,
  getSocietyHeadings,
} from '@/models/society';
import {
  headingSchema,
  HeadingFormData,
  SocietyHeading,
} from '@/models/societyDefinations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
import { PencilIcon, TrashIcon, PlusIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GlobalHeading } from '@/models/globalHeading';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectTrigger,
} from '@/components/ui/select';

export function UpdateSocietyStep3Form({
  societyId,
  globalHeadings,
}: {
  societyId: string;
  globalHeadings: GlobalHeading[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [headings, setHeadings] = useState<SocietyHeading[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingHeading, setEditingHeading] = useState<SocietyHeading | null>(
    null
  );

  const form = useForm<HeadingFormData>({
    resolver: zodResolver(headingSchema),
    defaultValues: {
      code: '',
      name: '',
      amount: 0,
      is_interest: false,
      is_gst: false,
    },
  });

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchHeadings();
  }, []);

  const fetchHeadings = async () => {
    const headings = await getSocietyHeadings(societyId);
    setHeadings(
      headings.map((h) => ({
        ...h,
        rebate_percentage: h.rebate_percentage ?? null,
      }))
    );
    setEditingHeading(null);
  };
  const onSubmit = async (data: HeadingFormData) => {
    startTransition(async () => {
      try {
        if (editingHeading) {
          await updateHeading(editingHeading.id, data);
          toast({
            description: 'Heading updated successfully!',
          });
          setIsEditDialogOpen(false);
        } else {
          await addHeading(societyId, data);
          toast({
            description: 'Heading added successfully!',
          });
          setIsAddDialogOpen(false);
        }
        await fetchHeadings();
        form.reset();
        setEditingHeading(null);
      } catch (error) {
        console.error('Error saving heading:', error);
        toast({
          variant: 'destructive',
          description: 'Failed to save heading',
        });
      }
    });
  };

  const handleEdit = (heading: SocietyHeading) => {
    setEditingHeading(heading);
    form.reset({
      code: heading.code,
      name: heading.name,
      amount: heading.amount,
      is_interest: heading.is_interest,
      is_gst: heading.is_gst,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this heading?')) {
      try {
        await deleteHeading(id);
        toast({
          description: 'Heading deleted successfully!',
        });
        fetchHeadings();
      } catch (error) {
        console.error('Error deleting heading:', error);
        toast({
          variant: 'destructive',
          description: 'Failed to delete heading',
        });
      }
    }
  };

  const handleSaveAndNext = async () => {
    startTransition(async () => {
      try {
        await updateSocietyStep3(null, { id: societyId, step: 4 });
        toast({
          description: 'Progress saved successfully!',
        });
        router.push(`/society/${societyId}/step4`);
      } catch (error) {
        console.error('Error updating society step:', error);
        toast({
          variant: 'destructive',
          description: 'Failed to save progress1111',
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          onClick={() => {
            if (isAddDialogOpen) form.reset();
            setIsAddDialogOpen(true);
            form.reset();
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add Heading
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Interest Apply</TableHead>
            <TableHead>GST Apply</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {headings.map((heading, index) => (
            <TableRow key={heading.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{heading.code}</TableCell>
              <TableCell>{heading.name}</TableCell>
              <TableCell>{heading.amount.toFixed(2)}</TableCell>
              <TableCell>{heading.is_interest ? 'Yes' : 'No'}</TableCell>
              <TableCell>{heading.is_gst ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(heading)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(heading.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Dialog */}
      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            form.reset();
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            setEditingHeading(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingHeading ? 'Edit Heading' : 'Add New Heading'}
            </DialogTitle>
            <DialogDescription>
              {editingHeading
                ? 'Update the details of the selected heading.'
                : 'Add a new heading to the society.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="heading">Select Global Heading</Label>
              <Select
                onValueChange={(value) => {
                  const selectedHeading = globalHeadings.find(
                    (h) => h.id.toString() === value
                  );
                  if (selectedHeading) {
                    form.setValue('name', selectedHeading.name);
                    form.setValue('code', selectedHeading.code);
                    form.setValue('is_interest', selectedHeading.is_interest);
                    form.setValue('is_gst', selectedHeading.is_gst);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Search heading..." />
                </SelectTrigger>
                <SelectContent>
                  {globalHeadings.map((heading) => (
                    <SelectItem key={heading.id} value={heading.id.toString()}>
                      {heading.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...form.register('name')} />
              {form.formState.errors.name && (
                <span className="text-red-500 text-sm">
                  {form.formState.errors.name.message}
                </span>
              )}
            </div>

            <div>
              <Label htmlFor="code">Code</Label>
              <Input id="code" {...form.register('code')} />
              {form.formState.errors.code && (
                <span className="text-red-500 text-sm">
                  {form.formState.errors.code.message}
                </span>
              )}
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...form.register('amount', { valueAsNumber: true })}
              />
              {form.formState.errors.amount && (
                <span className="text-red-500 text-sm">
                  {form.formState.errors.amount.message}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_interest"
                {...form.register('is_interest')}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="is_interest">Apply Interest</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_gst"
                {...form.register('is_gst')}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="is_gst">Apply GST</Label>
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending
                ? 'Saving...'
                : editingHeading
                  ? 'Update Heading'
                  : 'Save Heading'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between">
        <Button
          onClick={() => router.push(`/society/${societyId}/step2`)}
          variant="outline"
        >
          Previous
        </Button>
        <Button
          onClick={handleSaveAndNext}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isPending || headings.length === 0}
        >
          {isPending ? 'Saving...' : 'Save & Next'}
        </Button>
      </div>
    </div>
  );
}
