'use server';

import { createClient } from '@/utils/supabase/server';
import {
  HeadingFormData,
  PenaltySettings,
  Society,
  step1FormSchema,
  step2FormSchema,
  RebateSettings,
  Condition,
} from './societyDefinations';
import { Tables } from '@/utils/supabase/database.types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { SOCIETY_STATUS } from '@/lib/constants';

export type ActionState = {
  error_message?: string;
  error?: Record<string, string[]>;
} | null;

function getLatestStep(societyData: Tables<'societies'>, formStep: number) {
  return societyData.step > formStep ? societyData.step : formStep;
}

export async function getSocietyById(
  societyId: number
): Promise<Tables<'societies'> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('societies')
    .select('*')
    .eq('id', societyId)
    .single();

  if (error) {
    console.error('Error fetching society data:', error);
    return null;
  }

  return data;
}

export async function getSocietyByCode(
  societyCode: string
): Promise<Tables<'societies'> | null> {
  console.log('called');
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('societies')
    .select('*')
    .eq('code', societyCode)
    .eq('status', SOCIETY_STATUS.ACTIVE)
    .select();

  if (error) {
    console.error('Error fetching society data:', error);
    return null;
  }

  return data[0];
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

// Step 1
export async function updateSocietyStep1(
  prevState: ActionState,
  formData: FormData
) {
  const supabase = await createClient();

  const idSociety = await formData.get('id');
  if (!idSociety) {
    return { error_message: 'Invalid Society Id' };
  }

  const societyData = await getSocietyById(Number(idSociety));
  if (!societyData) {
    return { error_message: 'Society not found' };
  }

  const validatedFields = step1FormSchema.safeParse({
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
    step: 2,
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const updateData = validatedFields.data;

  const { error } = await supabase
    .from('societies')
    .update({
      ...updateData,
      step: await getLatestStep(societyData, 2),
    })
    .eq('id', idSociety)
    .select();

  if (error) {
    return { error_message: 'Failed to update society' };
  }

  revalidatePath(`/society/${idSociety}/step1`);
  redirect(`/society/${idSociety}/step2`);
}
// Step 2
export async function updateSocietyStep2(
  prevState: ActionState,
  formData: FormData
) {
  const supabase = await createClient();

  const idSociety = await formData.get('id');
  if (!idSociety) {
    return { error_message: 'Invalid Society Id' };
  }

  const societyData = await getSocietyById(Number(idSociety));
  if (!societyData) {
    return { error_message: 'Society not found' };
  }

  const validatedFields = step2FormSchema.safeParse({
    payment_due_date: Number(formData.get('payment_due_date')),
    grace_period: Number(formData.get('grace_period')),
    interest_rate: Number(formData.get('interest_rate')),
    period_of_calculation: formData.get('period_of_calculation'),
    interest_type: formData.get('interest_type'),
    interest_min_rs: Number(formData.get('interest_min_rs')),
    round_off_amount: formData.get('round_off_amount') === 'true',
    credit_adj_first: formData.get('credit_adj_first'),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const updateData = validatedFields.data;

  const { error } = await supabase
    .from('societies')
    .update({
      ...updateData,
      step: await getLatestStep(societyData, 3),
    })
    .eq('id', idSociety);

  if (error) {
    console.error('Error updating society:', error);
    return { error_message: 'Failed to update society' };
  }

  revalidatePath(`/society/${idSociety}/step2`);
  redirect(`/society/${idSociety}/step3`);
}

export async function getTenantSocieties(
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

// step3
export async function updateSocietyStep3(
  prevState: ActionState,
  formData: { id: string; step: number }
) {
  const supabase = await createClient();

  const idSociety = formData.id;
  if (!idSociety) {
    return { error_message: 'Invalid Society Id' };
  }

  const societyData = await getSocietyById(Number(idSociety));
  if (!societyData) {
    return { error_message: 'Society not found' };
  }

  const { error } = await supabase
    .from('societies')
    .update({ step: await getLatestStep(societyData, 4) })
    .eq('id', formData.id);

  if (error) {
    console.error('Error updating society:', error);
    return { error_message: 'Failed to update society' };
  }

  return { message: 'Society updated successfully' };
}

export async function getSocietyHeadings(
  societyId: number
): Promise<Tables<'society_headings'>[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('society_headings')
      .select('*')
      .eq('id_society', Number(societyId))
      .order('code', { ascending: true });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching society headings:', error);
    return [];
  }
}

export async function addHeading(
  societyId: string,
  headingData: HeadingFormData
) {
  const supabase = await createClient();

  try {
    // Check if heading code already exists for this society
    const { data: existingHeading, error: checkError } = await supabase
      .from('society_headings')
      .select('id')
      .eq('id_society', Number(societyId))
      .eq('code', headingData.code)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, any other error should be thrown
      throw new Error('Heading code already exists');
    }

    if (existingHeading) {
      throw new Error(
        'A heading with this code already exists for this society'
      );
    }

    const { error } = await supabase
      .from('society_headings')
      .insert({ ...headingData, id_society: Number(societyId) });

    if (error) throw error;

    return { message: 'Heading added successfully' };
  } catch (error) {
    console.error('Error adding heading:', error);
    throw new Error('Failed to add heading');
  }
}

export async function updateHeading(
  headingId: number,
  headingData: HeadingFormData
) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('society_headings')
      .update(headingData)
      .eq('id', headingId);

    if (error) throw error;

    return { message: 'Heading updated successfully' };
  } catch (error) {
    console.error('Error updating heading:', error);
    throw new Error('Failed to update heading');
  }
}

export async function deleteHeading(headingId: number) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('society_headings')
      .delete()
      .eq('id', headingId);

    if (error) throw error;

    return { message: 'Heading deleted successfully' };
  } catch (error) {
    console.error('Error deleting heading:', error);
    throw new Error('Failed to delete heading');
  }
}

export async function updateSocietyStep4(
  societyId: string,
  data: RebateSettings
) {
  const supabase = await createClient();

  const societyData = await getSocietyById(Number(societyId));
  if (!societyData) {
    return { error_message: 'Society not found' };
  }

  try {
    const { error } = await supabase
      .from('societies')
      .update({
        ...data,
        step: await getLatestStep(societyData, 5),
      })
      .eq('id', societyId);

    if (error) throw error;

    revalidatePath('/society');
    return { message: 'Rebate settings updated successfully' };
  } catch (error) {
    console.error('Error updating rebate settings:', error);
    throw new Error('Failed to update rebate settings');
  }
}

export async function fetchRebateSettings(
  societyId: string
): Promise<RebateSettings | null> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('societies')
      .select('*')
      .eq('id', societyId)
      .single();

    if (error) throw error;

    return {
      rebate_apply: data?.rebate_apply ?? false,
      rebate_type:
        (data?.rebate_type as RebateSettings['rebate_type']) ?? 'manual',
      rebate_due_date: data?.rebate_due_date ?? 1,
      rebate_fixed_amount: data?.rebate_fixed_amount ?? 0,
      rebate_percentage: data?.rebate_percentage ?? 0,
    };
  } catch (error) {
    console.error('Error fetching rebate settings:', error);
    return null;
  }
}

export async function updateHeadingRebate(
  headingId: number,
  data: { rebate_amount: number; rebate_percentage: number }
) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('society_headings')
      .update(data)
      .eq('id', headingId);

    if (error) throw error;

    return { message: 'Heading rebate updated successfully' };
  } catch (error) {
    console.error('Error updating heading rebate:', error);
    throw new Error('Failed to update heading rebate');
  }
}

export async function updateSocietyStep5(
  societyId: string,
  data: PenaltySettings
) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('societies')
      .update({
        ...data,
        step: 6,
      })
      .eq('id', societyId);

    if (error) throw error;

    revalidatePath('/society');
    return { message: 'Penalty settings updated successfully' };
  } catch (error) {
    console.error('Error updating penalty settings:', error);
    throw new Error('Failed to update penalty settings');
  }
}

export async function fetchPenaltySettings(
  societyId: string
): Promise<PenaltySettings | null> {
  const supabase = await createClient();

  try {
    const { data: societyData, error } = await supabase
      .from('societies')
      .select(
        'penalty_apply, penalty_charged_on, penalty_fixed_amount, penalty_per, penalty_on_bill_exceed'
      )
      .eq('id', societyId)
      .select();

    if (error) throw error;

    const data = societyData[0];
    return {
      penalty_apply: data.penalty_apply || false,
      penalty_charged_on:
        (data.penalty_charged_on as PenaltySettings['penalty_charged_on']) ||
        'fixed_amount',
      penalty_fixed_amount: data.penalty_fixed_amount || 0,
      penalty_percentage: data.penalty_percentage || 0,
      penalty_on_bill_exceed: data.penalty_on_bill_exceed || 0,
    };
  } catch (error) {
    console.error('Error fetching penalty settings:', error);
    return null;
  }
}

export async function updateSocietyStep6(
  societyId: string,
  conditions: Condition[]
) {
  const supabase = await createClient();

  try {
    const { data: societyData, error: societyError } = await supabase
      .from('societies')
      .select('status')
      .eq('id', societyId)
      .single();

    if (societyError) throw societyError;

    const { error } = await supabase
      .from('societies')
      .update({
        conditions,
        status:
          societyData.status === 'pending' ? 'active' : societyData.status,
        step: 7,
      })
      .eq('id', societyId);

    if (error) throw error;

    revalidatePath('/society');
    return { message: 'Conditions updated successfully' };
  } catch (error) {
    console.error('Error updating conditions:', error);
    throw new Error('Failed to update conditions');
  }
}

export async function fetchConditions(societyId: string): Promise<Condition[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('societies')
      .select('conditions')
      .eq('id', societyId)
      .single();

    if (error) throw error;

    return (data?.conditions as Condition[]) || [];
  } catch (error) {
    console.error('Error fetching conditions:', error);
    return [];
  }
}
