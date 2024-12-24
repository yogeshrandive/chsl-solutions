'use server';

import { TablesInsert } from '@/utils/supabase/database.types';
import { createClient } from '@/utils/supabase/server';

export async function getSocietyHeadings(societyId: number) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('society_headings')
      .select(
        `
        *,
        society_account_master:id_account_master (
          code,
          name
        )
      `
      )
      .eq('id_society', societyId);

    if (error) throw error;
    return data.map((heading) => ({
      ...heading,
      society_account_master: heading.society_account_master || {
        code: '',
        name: '',
      },
    }));
  } catch (error) {
    console.error('Error fetching society headings:', error);
    return [];
  }
}

export async function addSocietyHeading(
  heading: TablesInsert<'society_headings'> & { id_account_master: number }
) {
  const supabase = await createClient();
  // Check if heading already exists for this society
  const { data: existingHeading, error: checkError } = await supabase
    .from('society_headings')
    .select('id')
    .eq('id_society', heading.id_society)
    .eq('id_account_master', heading.id_account_master);

  if (checkError && checkError.code !== 'PGRST116') {
    // PGRST116 means no rows returned, any other error should be thrown
    throw new Error('Error checking existing heading');
  }

  if (existingHeading && existingHeading.length > 0) {
    throw new Error(
      'A heading with this account already exists for this society'
    );
  }

  try {
    const { error } = await supabase.from('society_headings').insert(heading);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding society heading:', error);
    return false;
  }
}

export async function updateSocietyHeading(
  id: number,
  heading: Partial<TablesInsert<'society_headings'>>
) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('society_headings')
      .update(heading)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating society heading:', error);
    return false;
  }
}
