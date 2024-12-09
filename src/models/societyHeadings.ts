import { createClient } from '@/utils/supabase/server';

export async function getSocietyHeadings(societyId: number) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('society_headings')
      .select('id, code, name')
      .eq('id_society', societyId);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching society headings:', error);
    return [];
  }
}
