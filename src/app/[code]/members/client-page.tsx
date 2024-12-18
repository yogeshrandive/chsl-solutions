'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Edit, Upload } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Tables } from '@/utils/supabase/database.types';
import { UploadDialog } from './upload-dialog';
import { SocietyHeading } from './[id]/step3/definations';
import { useRouter } from 'next/dist/client/components/navigation';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { updateMemberStatus } from '@/models/members';
import { useToast } from '@/hooks/use-toast';

export default function MembersClientPage({
  members,
  headings,
  societyCode,
  societyData,
}: {
  members: Tables<'members'>[];
  headings: SocietyHeading[];
  societyCode: string;
  societyData: Tables<'societies'>;
}) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  const handleStatusUpdate = async (memberId: number, newStatus: string) => {
    setIsUpdating(memberId);
    try {
      await updateMemberStatus(memberId, newStatus);
      toast({ description: 'Status updated successfully' });
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        description: (error as Error).message ?? 'Failed to update status',
      });
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Member Lists</h1>
        <div className="space-x-2">
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" /> Upload Members
          </Button>
          <Button asChild>
            <Link href={`/${societyCode}/members/create`}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Member
            </Link>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Flat No</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member, index) => (
              <TableRow key={member.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{member.code}</TableCell>
                <TableCell>{member.full_name}</TableCell>
                <TableCell>{member.flat_no}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.mobile}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        disabled={isUpdating === member.id}
                      >
                        <Badge
                          variant={
                            member.status === 'active'
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {isUpdating === member.id
                            ? 'Updating...'
                            : member.status}
                        </Badge>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(member.id, 'active')}
                        disabled={member.status === 'active'}
                      >
                        Set as Active
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusUpdate(member.id, 'inactive')
                        }
                        disabled={member.status === 'inactive'}
                      >
                        Set as Inactive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/${societyCode}/members/${member.id}/step1`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UploadDialog
        open={isUploadDialogOpen}
        onOpenChangeAction={setIsUploadDialogOpen}
        societyHeadings={headings}
        societyData={societyData}
        onSuccessAction={() => {
          setIsUploadDialogOpen(false);
          router.refresh();
        }}
        memberCodes={members.map((member) => member.code)}
      />
    </div>
  );
}
