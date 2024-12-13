'use server';
import { createClient } from '@/utils/supabase/server';
import { TablesInsert, TablesUpdate } from '@/utils/supabase/database.types';

export async function getAllAccounts(idSociety: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('society_account_master')
    .select(
      `
      id,
      code,
      name,
      op_balance,
      op_type,
      id_group,
      id_sub_group,
      group:society_heading_groups!id_group (
        id,
        name
      ),
      sub_group:society_heading_groups!id_sub_group (
        id,
        name
      )
    `
    )
    .eq('id_society', idSociety)
    .order('code');

  if (error) throw error;
  return data;
}

export async function createAccount(
  inputData: TablesInsert<'society_account_master'>
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('society_account_master')
    .insert(inputData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAccount(
  inputData: TablesUpdate<'society_account_master'> & { id: number }
) {
  const supabase = await createClient();
  const { id, ...updateData } = inputData;

  const { data, error } = await supabase
    .from('society_account_master')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAccount(id: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('society_account_master')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function getAccountByCode(code: string, idSociety: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('society_account_master')
    .select('id')
    .eq('code', code)
    .eq('id_society', idSociety)
    .select();

  if (error) throw error;
  return data[0];
}
