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
import { useActionState } from 'react';
import { createAccountAction } from './actions';
import { HeadGroup } from '@/lib/types';
import { useEffect, useRef, useState } from 'react';

interface SocietyData {
  id: number;
  code: string;
}

interface AddAccountFormProps {
  societyData: SocietyData;
  headGroups: HeadGroup[];
  onSuccess?: () => void;
}

const initialState = {
  errors: {} as Record<string, string[]>,
  message: '',
};

export function AddAccountForm({
  societyData,
  headGroups,
  onSuccess,
}: AddAccountFormProps) {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(
    createAccountAction.bind(null, {
      societyCode: societyData.code,
      idSociety: societyData.id,
    }),
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  // Get parent groups (groups with no parent)
  const groupData = headGroups.filter((group) => !group.id_parent);

  // Get subgroups based on selected parent
  const subGroups = selectedGroupId
    ? headGroups.filter(
        (group) => group.id_parent === parseInt(selectedGroupId)
      )
    : [];

  useEffect(() => {
    if (state.message === 'success') {
      toast({
        title: 'Success',
        description: 'Account created successfully',
      });
      onSuccess?.();
    }
  }, [state.message, toast, onSuccess]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Account Code</Label>
          <Input
            id="code"
            name="code"
            placeholder="Enter account code"
            aria-describedby="code-error"
          />
          {state.errors?.code ? (
            <p className="text-sm text-red-500" id="code-error">
              {state.errors.code}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Account Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter account name"
            aria-describedby="name-error"
          />
          {state.errors?.name ? (
            <p className="text-sm text-red-500" id="name-error">
              {state.errors.name}
            </p>
          ) : null}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="groupId">Group Name</Label>
          <Select
            name="groupId"
            onValueChange={(value) => {
              setSelectedGroupId(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select group name" />
            </SelectTrigger>
            <SelectContent>
              {groupData.map((group) => (
                <SelectItem key={group.id} value={group.id.toString()}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.errors?.groupId ? (
            <p className="text-sm text-red-500" id="parentGroup-error">
              {state.errors.groupId}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subGroupId">Sub Group</Label>
          <Select
            name="subGroupId"
            disabled={!selectedGroupId || subGroups.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sub group name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">None</SelectItem>
              {subGroups.map((group) => (
                <SelectItem key={group.id} value={group.id.toString()}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.errors?.subGroupId ? (
            <p className="text-sm text-red-500" id="group-error">
              {state.errors.subGroupId}
            </p>
          ) : null}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="opBalance">Opening Balance</Label>
          <Input
            id="opBalance"
            name="opBalance"
            type="number"
            step="0.01"
            defaultValue="0"
            placeholder="Enter opening balance"
            aria-describedby="opBalance-error"
          />
          {state.errors?.opBalance ? (
            <p className="text-sm text-red-500" id="opBalance-error">
              {state.errors.opBalance}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="opType">Opening Balance Type</Label>
          <Select name="opType" defaultValue="credit">
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="credit">Credit</SelectItem>
              <SelectItem value="debit">Debit</SelectItem>
            </SelectContent>
          </Select>
          {state.errors?.opType ? (
            <p className="text-sm text-red-500" id="opType-error">
              {state.errors.opType}
            </p>
          ) : null}
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Account'}
      </Button>
      {state.message && state.message !== 'success' ? (
        <p className="text-sm text-red-500 text-center">{state.message}</p>
      ) : null}
    </form>
  );
}
