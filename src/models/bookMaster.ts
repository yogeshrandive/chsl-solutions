'use server';
import { createClient } from '@/utils/supabase/server';
import { TablesInsert } from '@/utils/supabase/database.types';

export interface Book {
  id: number;
  code: string;
  name: string;
  type: 'bank' | 'cash';
  op_balance: number;
  op_type: 'credit' | 'debit' | null;
  id_group: number;
  id_sub_group: number | null;
  group: { id: number; name: string };
  sub_group: { id: number; name: string };
}

export async function getAllBooks(idSociety: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('society_book_master')
    .select(
      `
      id,
      code,
      name,
      type,
      op_balance,
      op_type,
      id_group,
      id_sub_group,
      acc_no,
      is_collection_acount,
    ifsc_code,
    branch_name,
    address,
    phone_no,
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

export async function createBook(
  inputData: TablesInsert<'society_book_master'>
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('society_book_master')
    .insert(inputData)
    .select()
    .single();

  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

export async function getBookByCode(code: string, idSociety: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('society_book_master')
    .select('id')
    .eq('code', code)
    .eq('id_society', idSociety)
    .select();

  if (error) throw error;
  return data[0];
}

export async function updateBook(
  id: number,
  inputData: Partial<TablesInsert<'society_book_master'>>
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('society_book_master')
    .update(inputData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw error;
  }
  return data;
}

export async function deleteBook(id: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('society_book_master')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(error);
    throw error;
  }
}
