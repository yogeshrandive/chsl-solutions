'use server';

import {
  createHeadGroup,
  updateHeadGroup,
  checkHeadGroupDependencies,
  deleteHeadGroup,
} from '@/models/societyHeadingGroups';
import { HeadType } from '@/lib/constants';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { DEFAULT_HEAD_GROUPS } from '@/lib/constants/headGroups';

interface CreateHeadGroupData {
  headType: string;
  parentId: string;
  groupName: string;
  description?: string;
  idSociety: number;
  societyCode: string;
}

interface UpdateHeadGroupData extends CreateHeadGroupData {
  id: number;
}

export async function createHeadGroupAction(data: CreateHeadGroupData) {
  try {
    const result = await createHeadGroup({
      head: data.headType as HeadType,
      id_parent: data.parentId === 'main' ? null : parseInt(data.parentId),
      name: data.groupName,
      id_society: data.idSociety,
      description: data.description,
    });

    revalidatePath(`/${data.societyCode}/headgroup`);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to create head group' };
  }
}

export async function updateHeadGroupAction(data: UpdateHeadGroupData) {
  try {
    const result = await updateHeadGroup({
      id: data.id,
      head: data.headType as HeadType,
      id_parent: data.parentId === 'main' ? null : parseInt(data.parentId),
      name: data.groupName,
      id_society: data.idSociety,
      description: data.description,
    });

    revalidatePath(`/${data.societyCode}/headgroup`);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to update head group' };
  }
}

export async function deleteHeadGroupAction(id: number, societyCode: string) {
  try {
    const hasChildren = await checkHeadGroupDependencies(id);
    if (hasChildren) {
      return {
        success: false,
        error:
          'Cannot delete group with sub-groups. Please delete sub-groups first.',
      };
    }

    await deleteHeadGroup(id);
    revalidatePath(`/${societyCode}/headgroup`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to delete head group' };
  }
}

export async function importDefaultHeadGroups(
  societyId: number,
  societyCode: string
) {
  const supabase = await createClient();

  try {
    // First create parent groups
    const parentGroups = DEFAULT_HEAD_GROUPS.filter((group) => !group.parent);
    for (const group of parentGroups) {
      const { data: parentData, error: parentError } = await supabase
        .from('society_heading_groups')
        .insert({
          name: group.name,
          description: group.description,
          head: group.head,
          id_society: societyId,
        })
        .select()
        .single();

      if (parentError) throw parentError;

      // Create child groups
      const childGroups = DEFAULT_HEAD_GROUPS.filter(
        (child) => child.parent === group.name
      );

      for (const child of childGroups) {
        const { error: childError } = await supabase
          .from('society_heading_groups')
          .insert({
            name: child.name,
            description: child.description,
            head: child.head,
            id_society: societyId,
            id_parent: parentData.id,
          });

        if (childError) throw childError;
      }
    }

    revalidatePath(`/${societyCode}/headgroup`);
    return { success: true };
  } catch (error) {
    console.error('Error importing default head groups:', error);
    return { success: false, error: 'Failed to import default head groups' };
  }
}
