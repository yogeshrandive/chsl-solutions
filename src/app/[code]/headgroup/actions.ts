'use server';

import {
  createHeadGroup,
  updateHeadGroup,
  checkHeadGroupDependencies,
  deleteHeadGroup,
} from '@/models/societyHeadingGroups';
import { HeadType } from '@/lib/constants';
import { revalidatePath } from 'next/cache';

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
