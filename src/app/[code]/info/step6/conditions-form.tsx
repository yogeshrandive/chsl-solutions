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
  ConditionsForm as conditionFormType,
  conditionsFormSchema,
} from '@/models/societyDefinations';
import { updateSocietyStep6, fetchConditions } from '@/models/society';
import { Society } from '@/models/societyDefinations';

export function ConditionsForm({
  societyId,
  societyData,
}: {
  societyId: string;
  societyData: Society;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<conditionFormType>({
    resolver: zodResolver(conditionsFormSchema),
  });

  useEffect(() => {
    fetchConditions(societyId).then(setComments);
  }, [societyId]);

  const onSubmit: SubmitHandler<conditionFormType> = async (data) => {
    try {
      const updatedComments = [...comments, data.newCondition];
      await updateSocietyStep6(societyId, updatedComments);
      setComments(updatedComments);
      reset();
      toast({
        description: 'Comment added successfully!',
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        variant: 'destructive',
        description: 'Failed to add comment',
      });
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleDelete = async (index: number) => {
    const updatedComments = comments.filter((_, i) => i !== index);
    await updateSocietyStep6(societyId, updatedComments);
    setComments(updatedComments);
    toast({
      description: 'Comment deleted successfully!',
    });
  };

  const handleUpdate = async (index: number, newComment: string) => {
    const updatedComments = comments.map((comment, i) =>
      i === index ? newComment : comment
    );
    await updateSocietyStep6(societyId, updatedComments);
    setComments(updatedComments);
    setEditingIndex(null);
    toast({
      description: 'Comment updated successfully!',
    });
  };

  const handleSaveAndSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateSocietyStep6(societyId, comments);
      toast({
        description: 'Society updated successfully!',
      });
      router.refresh();
      window.location.href = `/${societyData.code}/dashboard`;
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
          <CardTitle>Society Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center space-x-2 mb-4"
          >
            <Input
              placeholder="Add a new comment..."
              {...register('newCondition')}
              className="flex-grow"
            />
            <Button type="submit">
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
                <TableHead>Comment</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {editingIndex === index ? (
                      <Input
                        defaultValue={comment}
                        onBlur={(e) => handleUpdate(index, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdate(index, e.currentTarget.value);
                          }
                        }}
                      />
                    ) : (
                      comment
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(index)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(index)}
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
          onClick={() => router.push(`/${societyData.code}/info/step5`)}
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
