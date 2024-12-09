'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import {
  Condition,
  ConditionsForm as conditionFormType,
  conditionsFormSchema,
} from '@/models/societyDefinations';
import { updateSocietyStep6, fetchConditions } from '@/models/society';

export function ConditionsForm({ societyId }: { societyId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<conditionFormType>({
    resolver: zodResolver(conditionsFormSchema),
  });

  useEffect(() => {
    fetchConditions(societyId).then(setConditions);
  }, [societyId]);

  const onSubmit: SubmitHandler<conditionFormType> = async (data) => {
    try {
      const newCondition: Condition = {
        id: Date.now().toString(),
        description: data.newCondition,
      };
      const updatedConditions = [...conditions, newCondition];
      await updateSocietyStep6(societyId, updatedConditions);
      setConditions(updatedConditions);
      reset();
      toast({
        description: 'Condition added successfully!',
      });
    } catch (error) {
      console.error('Error adding condition:', error);
      toast({
        variant: 'destructive',
        description: 'Failed to add condition',
      });
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleDelete = async (id: string) => {
    const updatedConditions = conditions.filter(
      (condition) => condition.id !== id
    );
    await updateSocietyStep6(societyId, updatedConditions);
    setConditions(updatedConditions);
    toast({
      description: 'Condition deleted successfully!',
    });
  };

  const handleUpdate = async (id: string, newDescription: string) => {
    const updatedConditions = conditions.map((condition) =>
      condition.id === id
        ? { ...condition, description: newDescription }
        : condition
    );
    await updateSocietyStep6(societyId, updatedConditions);
    setConditions(updatedConditions);
    setEditingId(null);
    toast({
      description: 'Condition updated successfully!',
    });
  };

  const handleSaveAndSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateSocietyStep6(societyId, conditions);
      toast({
        description: 'Society updated successfully!',
      });
      router.push('/society');
    } catch (error) {
      console.error('Error saving society:', error);
      toast({
        variant: 'destructive',
        description: 'Failed to save society',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Society Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center space-x-2 mb-4"
          >
            <Input
              placeholder="Add a new condition..."
              {...register('newCondition')}
              className="flex-grow"
            />
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add
            </Button>
          </form>
          {errors.newCondition && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newCondition.message}
            </p>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Condition</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conditions.map((condition) => (
                <TableRow key={condition.id}>
                  <TableCell>
                    {editingId === condition.id ? (
                      <Input
                        defaultValue={condition.description}
                        onBlur={(e) =>
                          handleUpdate(condition.id, e.target.value)
                        }
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdate(condition.id, e.currentTarget.value);
                          }
                        }}
                      />
                    ) : (
                      condition.description
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(condition.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(condition.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          type="button"
          onClick={() => router.push(`/society/${societyId}/step5`)}
          variant="outline"
        >
          Previous
        </Button>
        <Button
          onClick={handleSaveAndSubmit}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save & Submit'}
        </Button>
      </div>
    </div>
  );
}
