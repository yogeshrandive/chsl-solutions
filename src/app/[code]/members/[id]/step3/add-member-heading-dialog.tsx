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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type MemberHeading, type SocietyHeading } from './definations';
import {
  memberHeadingInterface,
  memberHeadingSchema,
} from '@/models/memberSchema';
import { createMemberHeading } from '@/models/members';
import { useToast } from '@/hooks/use-toast';

interface AddMemberHeadingDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  memberId: number;
  memberHeadings: MemberHeading[];
  societyHeadings: SocietyHeading[];
  onSuccessAction: () => void;
}

export function AddMemberHeadingDialog({
  open,
  onOpenChangeAction,
  memberId,
  memberHeadings,
  societyHeadings,
  onSuccessAction,
}: AddMemberHeadingDialogProps) {
  const { toast } = useToast();
  const form = useForm<memberHeadingInterface>({
    resolver: zodResolver(memberHeadingSchema),
    defaultValues: {
      id_society_heading: 0,
      curr_amount: 0,
      next_amount: 0,
    },
  });

  const handleSocietyHeadingChange = (value: string) => {
    const heading = societyHeadings.find((h) => h.id === parseInt(value));
    if (heading) {
      form.setValue('curr_amount', heading.amount);
      form.setValue('next_amount', heading.amount);
    }
  };

  const onSubmit = async (data: memberHeadingInterface) => {
    try {
      await createMemberHeading({
        id_member: memberId,
        id_society_heading: data.id_society_heading,
        curr_amount: data.curr_amount,
        next_amount: data.next_amount,
      });
      toast({
        description: 'Heading added successfully!',
      });
      onOpenChangeAction(false);
      form.reset();
      onSuccessAction();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        description: 'Failed to add heading',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Heading</DialogTitle>
          <DialogDescription>
            Add a new heading from society headings.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id_society_heading"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Society Heading</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(parseInt(value));
                      handleSocietyHeadingChange(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select heading" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {societyHeadings
                        .filter(
                          (sh) =>
                            !memberHeadings.some(
                              (mh) => mh.id_society_heading === sh.id
                            )
                        )
                        .map((heading) => (
                          <SelectItem
                            key={heading.id}
                            value={heading.id.toString()}
                          >
                            {heading.code} - {heading.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              <Button type="submit">Add Heading</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
