'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { PlusCircle, Pencil, Trash } from 'lucide-react';
import { type MemberHeading, type SocietyHeading } from './definations';
import {
  updateMemberStep3,
  getMemberHeadings,
  deleteMemberHeading,
} from '@/models/members';

import { Tables } from '@/utils/supabase/database.types';
import { useToast } from '@/hooks/use-toast';
import { AddMemberHeadingDialog } from './add-member-heading-dialog';
import { EditMemberHeadingDialog } from './edit-member-heading-dialog';
import { useRouter } from 'next/navigation';

export default function UpdateMemberStep3Form({
  member,
  societyCode,
  memberHeadings: memberHeadingsInitial,
  societyHeadings,
}: {
  member: Tables<'members'>;
  societyCode: string;
  memberHeadings: MemberHeading[];
  societyHeadings: SocietyHeading[];
}) {
  const { toast } = useToast();
  const router = useRouter();

  const [memberHeadings, setMemberHeadings] = useState<MemberHeading[]>(
    memberHeadingsInitial
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [editingHeading, setEditingHeading] = useState<MemberHeading | null>(
    null
  );

  const fetchHeadings = async () => {
    const data = await getMemberHeadings(member.id);
    setMemberHeadings(data as unknown as MemberHeading[]);
    setEditingHeading(null);
  };

  const handleSaveAndNext = async () => {
    if (memberHeadings.length === 0) {
      toast({
        variant: 'destructive',
        description: 'Please add at least one heading before proceeding',
      });
      return;
    }
    try {
      await updateMemberStep3(member.id);
      toast({
        description: 'Progress saved successfully!',
      });

      router.push(`/${societyCode}/members`);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        description: 'Failed to save progress',
      });
    }
  };

  const handleEdit = (heading: MemberHeading) => {
    setEditingHeading(heading);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    setIsPending(true);
    if (window.confirm('Are you sure you want to delete this heading?')) {
      try {
        await deleteMemberHeading(id);
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
    setIsPending(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Heading
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Current Amount</TableHead>
            <TableHead>Next Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memberHeadings.map((heading) => (
            <TableRow key={heading.id}>
              <TableCell>{heading.code}</TableCell>
              <TableCell>{heading.name}</TableCell>
              <TableCell>{heading.curr_amount}</TableCell>
              <TableCell>{heading.next_amount}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(heading)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(heading.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddMemberHeadingDialog
        open={isAddDialogOpen}
        onOpenChangeAction={setIsAddDialogOpen}
        memberId={member.id}
        memberHeadings={memberHeadings}
        societyHeadings={societyHeadings}
        onSuccessAction={fetchHeadings}
      />

      <EditMemberHeadingDialog
        open={isEditDialogOpen}
        onOpenChangeAction={setIsEditDialogOpen}
        heading={editingHeading}
        onSuccessAction={fetchHeadings}
      />

      <div className="flex justify-end space-x-2">
        <Button onClick={handleSaveAndNext} disabled={isPending}>
          {isPending ? 'Saving...' : 'Save & Next'}
        </Button>
      </div>
    </div>
  );
}
