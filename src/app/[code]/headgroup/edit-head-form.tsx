/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { HEAD_TYPES } from '@/lib/constants';
import { updateHeadGroupAction } from './actions';

interface EditHeadFormProps {
  societyData: any;
  headGroups: any[];
  groupData: any;
  onSuccess?: () => void;
}

export function EditHeadForm({
  societyData,
  headGroups,
  groupData,
  onSuccess,
}: EditHeadFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    headType: groupData.head,
    parentId: groupData.id_parent ? groupData.id_parent.toString() : 'main',
    groupName: groupData.name,
    description: groupData.description || '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateHeadGroupAction({
        ...formData,
        id: groupData.id,
        societyCode: societyData.code,
        idSociety: societyData.id,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: 'Success',
        description: 'Head group updated successfully',
      });

      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to update head group',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="headType">Head Type</Label>
        <Select
          value={formData.headType}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, headType: value }))
          }
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select head type" />
          </SelectTrigger>
          <SelectContent>
            {HEAD_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="parentId">Parent Group</Label>
        <Select
          value={formData.parentId}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, parentId: value }))
          }
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select parent group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="main">Main</SelectItem>
            {headGroups
              ?.filter((group) => group.id !== groupData.id)
              .map((group) => (
                <SelectItem key={group.id} value={group.id.toString()}>
                  {group.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="groupName">Group Name</Label>
        <Input
          id="groupName"
          value={formData.groupName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, groupName: e.target.value }))
          }
          placeholder="Enter group name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Enter group description"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Updating...' : 'Update Group'}
      </Button>
    </form>
  );
}
