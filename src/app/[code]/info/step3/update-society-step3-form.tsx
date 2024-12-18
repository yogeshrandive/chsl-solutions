/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { updateSocietyStep3, deleteHeading } from '@/models/society';
import { getSocietyHeadings } from '@/models/societyHeadings';
import { SocietyHeading, Society } from '@/models/societyDefinations';
import { Button } from '@/components/ui/button';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { PencilIcon, TrashIcon, PlusIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { AddSocietyHeadingForm } from './add-society-heading-form';
import { EditSocietyHeadingForm } from './edit-society-heading-form';

export function UpdateSocietyStep3Form({
  societyId,
  societyData,
  accountHeadings,
}: {
  societyId: number;
  societyData: Society;
  accountHeadings: any;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [headings, setHeadings] = useState<SocietyHeading[]>([]);

  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [editingHeading, setEditingHeading] = useState<SocietyHeading | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchHeadings(societyId);
  }, [societyId]);

  const fetchHeadings = async (societyId: number) => {
    const headings = await getSocietyHeadings(societyId);

    setHeadings(headings as unknown as SocietyHeading[]);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this heading?')) {
      try {
        await deleteHeading(id);
        toast({
          description: 'Heading deleted successfully!',
        });
        fetchHeadings(societyId);
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
        router.push(`/${societyData.code}/info/step4`);
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Create New Heading
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Heading</DialogTitle>
            <DialogDescription>
              Create a new heading to your society by filling out the details
              below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <AddSocietyHeadingForm
              societyId={Number(societyId)}
              societyCode={societyData.code}
              accountMasters={accountHeadings}
              onSuccess={() => {
                setOpen(false);
                fetchHeadings(societyId);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Heading</DialogTitle>
            <DialogDescription>
              Update the heading details below.
            </DialogDescription>
          </DialogHeader>
          {editingHeading && (
            <EditSocietyHeadingForm
              heading={editingHeading}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                fetchHeadings(societyId);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
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
              <TableCell>{heading.society_account_master?.code}</TableCell>
              <TableCell>{heading.society_account_master?.name}</TableCell>
              <TableCell>{heading.amount.toFixed(2)}</TableCell>
              <TableCell>{heading.is_interest ? 'Yes' : 'No'}</TableCell>
              <TableCell>{heading.is_gst ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingHeading(heading);
                      setIsEditDialogOpen(true);
                    }}
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
