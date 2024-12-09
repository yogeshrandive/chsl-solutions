/* eslint-disable no-unused-vars */
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  memberHeadingSchema,
  type memberHeadingInterface,
} from '@/models/memberSchema';
import { updateMemberHeading } from '@/models/members';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { MemberHeading } from './definations';

interface EditMemberHeadingDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  heading: MemberHeading | null;
  onSuccessAction: () => void;
}

export function EditMemberHeadingDialog({
  open,
  onOpenChangeAction,
  heading,
  onSuccessAction,
}: EditMemberHeadingDialogProps) {
  const { toast } = useToast();
  const form = useForm<memberHeadingInterface>({
    resolver: zodResolver(memberHeadingSchema),
    values: {
      id_society_heading: heading?.id_society_heading || 0,
      curr_amount: heading?.curr_amount || 0,
      next_amount: heading?.next_amount || 0,
    },
  });

  useEffect(() => {
    if (heading) {
      form.reset({
        id_society_heading: heading.id_society_heading,
        curr_amount: heading.curr_amount,
        next_amount: heading.next_amount,
      });
    }
  }, [heading, form]);

  const onSubmit = async (data: memberHeadingInterface) => {
    if (!heading) return;

    try {
      await updateMemberHeading(heading.id, {
        curr_amount: data.curr_amount,
        next_amount: data.next_amount,
      });
      toast({
        description: 'Heading updated successfully!',
      });
      onOpenChangeAction(false);
      form.reset();
      onSuccessAction();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        description: 'Failed to update heading',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Heading</DialogTitle>
          <DialogDescription>
            Update amounts for {heading?.code} - {heading?.name}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="curr_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="next_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="submit">Update Heading</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
