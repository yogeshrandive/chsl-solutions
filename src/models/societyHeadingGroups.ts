import { createClient } from '@/utils/supabase/server';
import { TablesInsert, TablesUpdate } from '@/utils/supabase/database.types';

export async function createHeadGroup(
  inputData: TablesInsert<'society_heading_groups'>
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('society_heading_groups')
    .insert(inputData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getParentGroups(idSociety: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('society_heading_groups')
    .select('id, name')
    .eq('id_society', idSociety)
    .is('id_parent', null);

  if (error) throw error;
  return data;
}

export async function getAllGroups(idSociety: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('society_heading_groups')
    .select(
      `
        id,
        name,
        head,
        description,
        id_parent
      `
    )
    .eq('id_society', idSociety)
    .order('id_parent', { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateHeadGroup(
  inputData: TablesUpdate<'society_heading_groups'> & { id: number }
) {
  const supabase = await createClient();
  const { id, ...updateData } = inputData;

  const { data, error } = await supabase
    .from('society_heading_groups')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function checkHeadGroupDependencies(id: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('society_heading_groups')
    .select('id')
    .eq('id_parent', id);

  if (error) throw error;
  return data.length > 0;
}

export async function deleteHeadGroup(id: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('society_heading_groups')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}
