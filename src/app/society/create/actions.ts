'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { formSchema } from './definations';
import { ActionState } from '@/models/society';

async function checkSocietyCodeExists(code: string, tenantId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('societies')
    .select('code')
    .eq('code', code.toUpperCase())
    .eq('id_tenant', tenantId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking society code:', error);
    throw new Error('Failed to check society code');
  }

  return !!data;
}

export async function createSociety(
  prevState: ActionState,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error_message: 'You must be logged in to create a society' };
  }
  const validatedFields = formSchema.safeParse({
    code: formData.get('code'),
    name: formData.get('name'),
    regi_no: formData.get('regi_no'),
    email: formData.get('email'),
    phone_number: formData.get('phone_number'),
    address: formData.get('address'),
    location: formData.get('location'),
    pin_code: Number(formData.get('pin_code')),
    id_state: Number(formData.get('id_state')),
    id_city: Number(formData.get('id_city')),
    bill_no: Number(formData.get('bill_no')),
    receipt_no: Number(formData.get('receipt_no')),
    gst_no: formData.get('gst_no'),
    pan_no: formData.get('pan_no'),
    tan_no: formData.get('tan_no'),
    sac_code: formData.get('sac_code'),
    bill_type: formData.get('bill_type'),
    period_from: formData.get('period_from'),
    period_to: formData.get('period_to'),
    cur_period_from: formData.get('cur_period_from'),
    cur_period_to: formData.get('cur_period_to'),
    next_bill_date: formData.get('next_bill_date'),
    bill_lot: 2,
    id_tenant: Number(formData.get('id_tenant')),
    status: 'pending',
    step: 1,
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const {
    code,
    period_from,
    period_to,
    cur_period_from,
    cur_period_to,
    next_bill_date,
    id_tenant,
    ...rest
  } = validatedFields.data;

  const codeExists = await checkSocietyCodeExists(code, Number(id_tenant));
  if (codeExists) {
    return {
      error_message: 'Society code already exists for this tenant',
    };
  }

  const { data: society, error } = await supabase
    .from('societies')
    .insert([
      {
        ...rest,
        code: code.toUpperCase(),
        period_from: period_from,
        period_to: period_to,
        cur_period_to: cur_period_to,
        cur_period_from: cur_period_from,
        next_bill_date: next_bill_date,
        step: 2,
        id_tenant: Number(id_tenant),
        status: 'pending',
        created_by: user.id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating society:', error);
    return { error_message: 'Failed to create society' };
  }

  revalidatePath('/society');
  redirect(`/society/${society.id}/step2`);
}

export async function getStates() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('state')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function getCitiesByState(stateId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('city')
    .select('*')
    .eq('id_state', stateId)
    .order('name');

  if (error) throw error;
  return data || [];
}
