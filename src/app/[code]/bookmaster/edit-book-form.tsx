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
import { updateBookAction } from './actions';
import {
  AwaitedReactNode,
  JSXElementConstructor,
  ReactPortal,
  ReactNode,
  Key,
  ReactElement,
  useActionState,
  useEffect,
  useState,
} from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface EditBookFormProps {
  societyData: {
    id: number;
    code: string;
  };
  book: any;
  headGroups: any;
  onSuccess?: () => void;
}

const initialState = {
  errors: {} as Record<string, string[]>,
  message: '',
};

export function EditBookForm({
  societyData,
  book,
  headGroups,
  onSuccess,
}: EditBookFormProps) {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<'bank' | 'cash'>(book.type);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    book.id_group.toString()
  );

  const [state, formAction, isPending] = useActionState(
    updateBookAction.bind(
      null,
      {
        societyCode: societyData.code,
        idSociety: societyData.id,
      },
      book.id
    ),
    initialState
  );

  // Get parent groups (groups with no parent)
  const groupData = headGroups.filter(
    (group: { id_parent: any }) => !group.id_parent
  );

  // Get subgroups based on selected parent
  const subGroups = selectedGroupId
    ? headGroups.filter(
        (group: { id_parent: number }) =>
          group.id_parent === parseInt(selectedGroupId)
      )
    : [];

  useEffect(() => {
    if (state.message === 'success') {
      toast({
        title: 'Success',
        description: 'Book updated successfully',
      });
      onSuccess?.();
    }
  }, [state.message, toast, onSuccess]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Book Type</Label>
            <Select
              name="type"
              value={selectedType}
              onValueChange={(value: 'bank' | 'cash') => setSelectedType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">Bank</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.type ? (
              <p className="text-sm text-red-500" id="type-error">
                {state.errors.type}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Book Code</Label>
            <Input
              id="code"
              name="code"
              defaultValue={book.code}
              placeholder="Enter book code"
              aria-describedby="code-error"
            />
            {state.errors?.code ? (
              <p className="text-sm text-red-500" id="code-error">
                {state.errors.code}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Book Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={book.name}
            placeholder="Enter book name"
            aria-describedby="name-error"
          />
          {state.errors?.name ? (
            <p className="text-sm text-red-500" id="name-error">
              {state.errors.name}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="groupId">Group Name</Label>
          <Select
            name="groupId"
            defaultValue={book.id_group.toString()}
            onValueChange={(value) => {
              setSelectedGroupId(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select group name" />
            </SelectTrigger>
            <SelectContent>
              {groupData.map(
                (group: {
                  id: Key | null | undefined;
                  name:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<any, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Promise<AwaitedReactNode>
                    | null
                    | undefined;
                }) => (
                  <SelectItem
                    key={group.id}
                    value={group.id?.toString() || '0'}
                  >
                    {group.name}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          {state.errors?.groupId ? (
            <p className="text-sm text-red-500" id="group-error">
              {state.errors.groupId}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subGroupId">Sub Group</Label>
          <Select
            name="subGroupId"
            defaultValue={book.id_sub_group?.toString() || '0'}
            disabled={!selectedGroupId || subGroups.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sub group name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">None</SelectItem>
              {subGroups.map(
                (group: {
                  id: Key | null | undefined;
                  name:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<any, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Promise<AwaitedReactNode>
                    | null
                    | undefined;
                }) => (
                  <SelectItem
                    key={group.id}
                    value={group.id?.toString() || '0'}
                  >
                    {group.name}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          {state.errors?.subGroupId ? (
            <p className="text-sm text-red-500" id="subGroup-error">
              {state.errors.subGroupId}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="opBalance">Opening Balance</Label>
            <Input
              id="opBalance"
              name="opBalance"
              type="number"
              step="0.01"
              defaultValue={book.op_balance}
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
            <Label htmlFor="opType">Opening Type</Label>
            <Select name="opType" defaultValue={book.op_type || 'credit'}>
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
      </div>

      {selectedType === 'bank' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountNo">Account Number</Label>
              <Input
                id="accountNo"
                name="accountNo"
                defaultValue={book.acc_no || ''}
                placeholder="Enter account number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input
                id="ifscCode"
                name="ifscCode"
                defaultValue={book.ifsc_code || ''}
                placeholder="Enter IFSC code"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branchName">Branch Name</Label>
              <Input
                id="branchName"
                name="branchName"
                defaultValue={book.branch_name || ''}
                placeholder="Enter branch name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={book.phone_no || ''}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              defaultValue={book.address || ''}
              placeholder="Enter bank address"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isCollection"
              name="isCollection"
              defaultChecked={book.is_collection_acount}
            />
            <Label htmlFor="isCollection">Is Collection Account</Label>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Updating...' : 'Update Book'}
      </Button>

      {state.message && state.message !== 'success' ? (
        <p className="text-sm text-red-500 text-center">{state.message}</p>
      ) : null}
    </form>
  );
}
