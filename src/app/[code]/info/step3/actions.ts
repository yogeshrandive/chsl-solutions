'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';

const schema = z.object({
  amount: z.number().min(0, 'Amount must be 0 or greater'),
  is_interest: z.boolean(),
  is_gst: z.boolean(),
  id_account_master: z.number().min(1, 'Account selection is required'),
  id_society: z.number().min(1, 'Society ID is required'),
});

interface FormState {
  message: string;
  errors:
    | {
        is_gst?: string[];
        is_interest?: string[];
        amount?: string[];
        id_society?: string[];
        id_account_master?: string[];
        _form?: string;
      }
    | {
        _form: string;
      };
}

export async function addSocietyHeadingAction(
  societyId: number,
  prevState: FormState,
  formData: FormData
) {
  const validatedFields = schema.safeParse({
    amount: Number(formData.get('amount')),
    is_interest: formData.get('is_interest') === 'true',
    is_gst: formData.get('is_gst') === 'true',
    id_account_master: Number(formData.get('id_account_master')),
    id_society: societyId,
  });

  if (!validatedFields.success) {
    return {
      message: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('society_headings')
    .insert([validatedFields.data])
    .select()
    .single();

  if (error) {
    return {
      message: 'error',
      errors: {
        _form: 'Failed to save heading',
      },
    };
  }

  revalidatePath('/[code]/info/step3');
  return {
    message: 'success',
    errors: {},
  };
}
