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
import { createHeadGroupAction } from './actions';

interface AddHeadFormProps {
  societyData: any;
  onSuccess?: () => void;
  headGroups: any[];
}

export function AddHeadForm({
  societyData,
  headGroups,
  onSuccess,
}: AddHeadFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    headType: '',
    parentId: 'main',
    groupName: '',
    description: '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createHeadGroupAction({
        ...formData,
        societyCode: societyData.code,
        idSociety: societyData.id,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: 'Success',
        description: 'Head group added successfully',
      });

      setFormData({
        headType: '',
        parentId: 'main',
        groupName: '',
        description: '',
      });
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to add head group',
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
            {headGroups?.map((group) => (
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
        {loading ? 'Adding...' : 'Add Group'}
      </Button>
    </form>
  );
}
