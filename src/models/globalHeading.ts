import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';

export const GlobalHeadingSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  is_gst: z.boolean(),
  is_interest: z.boolean(),
});

export type GlobalHeading = z.infer<typeof GlobalHeadingSchema>;

export async function getGlobalHeadings(): Promise<GlobalHeading[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('global_headings')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching global headings:', error);
    return [];
  }

  return data;
}

export const memberHeadingSchema = z.object({
  id_society_heading: z.coerce.number().min(1, 'Society heading is required'),
  curr_amount: z.coerce.number().min(0, 'Current amount must be positive'),
  next_amount: z.coerce.number().min(0, 'Next amount must be positive'),
});

export type MemberHeading = {
  id: number;
  id_society_heading: number;
  code: string;
  name: string;
  curr_amount: number;
  next_amount: number;
};

export type SocietyHeading = {
  id: number;
  code: string;
  name: string;
  amount: number;
};

export type FormDataInterface = z.infer<typeof memberHeadingSchema>;
