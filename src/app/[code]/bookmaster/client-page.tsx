/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
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
  DialogFooter,
} from '@/components/ui/dialog';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddBookForm } from './add-book-form';
import { EditBookForm } from './edit-book-form';
import { Book } from '@/models/bookMaster';
import { deleteBookAction } from './actions';
import { useToast } from '@/hooks/use-toast';

interface SocietyData {
  id: number;
  code: string;
}

// interface HeadGroup {
//   id: number;
//   name: string;
//   id_parent: number | null;
//   head: 'assets' | 'liabilities' | 'incomes' | 'expenses';
//   description: string | null;
// }

interface BookMasterClientPageProps {
  societyData: SocietyData;
  books: any;
  headGroups: any;
}

export default function BookMasterClientPage({
  societyData,
  books,
  headGroups,
}: BookMasterClientPageProps) {
  const [open, setOpen] = useState(false);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');
  const [editOpen, setEditOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const { toast } = useToast();

  // Get unique parent groups for filter
  const parentGroups = headGroups.filter(
    (group: { id_parent: number | null }) => !group.id_parent
  );

  // Filter books based on selected group
  const filteredBooks = books.filter(
    (book: { group: { id: number } | null }) =>
      selectedGroupFilter === 'all'
        ? true
        : (book.group?.id ?? '').toString() === selectedGroupFilter
  );

  const handleEditClick = (book: Book) => {
    setSelectedBook(book);
    setEditOpen(true);
  };

  const handleDeleteClick = (book: Book) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!bookToDelete) return;

    const result = await deleteBookAction(
      { societyCode: societyData.code },
      bookToDelete.id
    );

    if (result.message === 'success') {
      toast({
        title: 'Success',
        description: 'Book deleted successfully',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete book',
        variant: 'destructive',
      });
    }
    setDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Book Master</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add New Book
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
              <DialogDescription>
                Create a new book account for your society.
              </DialogDescription>
            </DialogHeader>
            <AddBookForm
              societyData={societyData}
              headGroups={headGroups}
              onSuccess={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-[250px]">
          <Select
            value={selectedGroupFilter}
            onValueChange={setSelectedGroupFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {parentGroups.map((group: { id: number; name: string }) => (
                <SelectItem key={group.id} value={group.id.toString()}>
                  {group.name}
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
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Group Name</TableHead>
              <TableHead>Sub Group</TableHead>
              <TableHead>Opening Balance</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBooks.map((book: Book, index: number) => (
              <TableRow key={book.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{book.code}</TableCell>
                <TableCell>{book.name}</TableCell>
                <TableCell className="capitalize">{book.type}</TableCell>
                <TableCell>{book.group?.name}</TableCell>
                <TableCell>{book.sub_group?.name || '-'}</TableCell>
                <TableCell>{book.op_balance.toFixed(2)}</TableCell>
                <TableCell className="capitalize">{book.op_type}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditClick(book)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteClick(book)}
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
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>
              Update the book details below.
            </DialogDescription>
          </DialogHeader>
          {selectedBook && (
            <EditBookForm
              societyData={societyData}
              book={selectedBook}
              headGroups={headGroups}
              onSuccess={() => setEditOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              book
              {bookToDelete && ` "${bookToDelete.name}"`}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
