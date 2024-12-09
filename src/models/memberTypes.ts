import { createClient } from '@/utils/supabase/server';

export async function getMemberTypes() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('member_types')
    .select('*')
    .order('id')
    .select();

  if (error) {
    console.error('Error fetching member types:', error);
    return [];
  }

  return data;
}
