'use server';

import { createClient } from '@/utils/supabase/server';
import { Society } from './definations';

export async function getSocieties(
  tenantId: number,
  filter: string | undefined
): Promise<Society[]> {
  const supabase = await createClient();
  const query = supabase
    .from('societies')
    .select('*')
    .eq('id_tenant', tenantId);

  if (filter != undefined) {
    query.or(`name.ilike.%${filter}%,code.ilike.%${filter}%`);
  }
  const { data, error } = await query
    .order('name', { ascending: true })
    .order('status', { ascending: false });

  if (error) {
    console.error('Error fetching societies:', error);
    return [];
  }

  return data as Society[];
}

export async function getSocietyTotalMembers(
  societyId: number
): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('members')
    .select('id', { count: 'exact' })
    .eq('id_society', societyId); // Replace 5 with the desired society ID

  if (error) {
    console.error('Error fetching society total members:', error);
    return 0;
  }

  return data.length;
}
