/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { DialogTrigger } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { AddHeadForm } from './add-head-form';
import { EditHeadForm } from './edit-head-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { deleteHeadGroupAction } from './actions';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HeadGroupClientPageProps {
  societyData: any;
  headGroups: any[];
}

export default function HeadGroupClientPage({
  societyData,
  headGroups,
}: HeadGroupClientPageProps) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<any>(null);
  const [selectedHead, setSelectedHead] = useState<string>('all');

  const getParentName = (parentId: number | null) => {
    if (!parentId) return 'Main';
    const parent = headGroups.find((group) => group.id === parentId);
    return parent ? parent.name : 'Main';
  };

  const handleEditClick = (group: any) => {
    setSelectedGroup(group);
    setEditOpen(true);
  };

  const handleDeleteClick = (group: any) => {
    setGroupToDelete(group);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!groupToDelete) return;

    const result = await deleteHeadGroupAction(
      groupToDelete.id,
      societyData.code
    );

    if (result.success) {
      toast({
        title: 'Success',
        description: 'Head group deleted successfully',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }

    setDeleteDialogOpen(false);
    setGroupToDelete(null);
  };

  // Get unique heads for filter
  const heads = ['assets', 'liabilities', 'incomes', 'expenses'];

  // Filter groups based on selected head
  const filteredGroups = headGroups.filter((group: any) =>
    selectedHead === 'all' ? true : group.head === selectedHead
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Account Head Group</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add New Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Head Group</DialogTitle>
              <DialogDescription>
                Create a new account head group for your society. Fill in the
                details below.
              </DialogDescription>
            </DialogHeader>
            <AddHeadForm
              societyData={societyData}
              headGroups={headGroups}
              onSuccess={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-[250px]">
          <Select value={selectedHead} onValueChange={setSelectedHead}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by head" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Heads</SelectItem>
              {heads.map((head) => (
                <SelectItem key={head} value={head} className="capitalize">
                  {head}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Head Type</TableHead>
              <TableHead>Parent Group</TableHead>
              <TableHead>Group Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.map((group, index) => (
              <TableRow key={group.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="capitalize">{group.head}</TableCell>
                <TableCell>{getParentName(group.id_parent)}</TableCell>
                <TableCell>{group.name}</TableCell>
                <TableCell>{group.description || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(group)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(group)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Head Group</DialogTitle>
            <DialogDescription>
              Update the head group details below.
            </DialogDescription>
          </DialogHeader>
          {selectedGroup && (
            <EditHeadForm
              societyData={societyData}
              headGroups={headGroups}
              groupData={selectedGroup}
              onSuccess={() => setEditOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              head group
              {groupToDelete?.id_parent === null &&
                ' and all its sub-groups'}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
