'use server';

import { createClient } from '@/utils/supabase/server';
import { Tables, TablesInsert } from '@/utils/supabase/database.types';
import { getSocietyById } from './society';
import {
  memberSchema,
  memberStep2Schema,
  step1MemberSchema,
} from './memberSchema';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export type ActionState = {
  error_message?: string;
  error?: Record<string, string[]>;
} | null;

function getLatestStep(memberData: Tables<'members'>, formStep: number) {
  return Number(memberData.step || 1) > formStep ? memberData.step : formStep;
}

async function isCodeUnique(code: string, societyId: number) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('members')
    .select('*')
    .eq('code', code)
    .eq('id_society', societyId)
    .select();

  return !data?.[0];
}

export async function createMember(prevState: ActionState, formData: FormData) {
  const supabase = await createClient();
  const idSociety = formData.get('id_society');
  if (!idSociety) {
    return { error_message: 'Please select a society first' };
  }

  const society = await getSocietyById(Number(idSociety));
  if (!society) {
    return { error_message: 'Society not found' };
  }

  const code = formData.get('code');
  if (!(await isCodeUnique(code as string, Number(society.id)))) {
    console.log('code already exists');
    return {
      error: {
        code: ['Member code already exists'],
      },
    };
  }

  const validatedFields = memberSchema.safeParse({
    code: formData.get('code'),
    salutation: formData.get('salutation'),
    full_name: formData.get('full_name'),
    assoc_name: formData.get('assoc_name'),
    id_member_type: Number(formData.get('id_member_type')),
    mobile: formData.get('mobile'),
    assoc_mobile: formData.get('assoc_mobile'),
    aadhaar_no: formData.get('aadhaar_no'),
    pan_no: formData.get('pan_no'),
    flat_no: formData.get('flat_no'),
    build_name: formData.get('build_name'),
    premise_type: formData.get('premise_type'),
    premise_unit_type: formData.get('premise_unit_type'),
    add_premise: formData.get('add_premise'),
    area: Number(formData.get('area')),
    area_unit: formData.get('area_unit'),
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { data, error } = await supabase
    .from('members')
    .insert({
      ...validatedFields.data,
      id_society: Number(idSociety),
      id_tenant: society.id_tenant,
      step: 2,
    })
    .select()
    .single();

  if (!data || error) {
    return { error_message: 'Failed to create member' };
  }

  revalidatePath(`/${society.code}/members/create`);
  redirect(`/${society.code}/members/${data.id}/step2`);
}

export async function getMember(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createMemberHeadings(
  memberHeadingsData: TablesInsert<'member_headings'>[]
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('member_headings')
    .insert(memberHeadingsData);

  if (error) throw new Error(error.message);
  return true;
}

export async function getMembers(societyId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id_society', societyId);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function updateMember(prevState: ActionState, formData: FormData) {
  const supabase = await createClient();
  const idMember = await formData.get('id');
  const societyCode = await formData.get('society_code');
  if (!idMember) {
    return { error_message: 'Invalid Society Id' };
  }

  //   const memberData = await getMember(Number(idMember));
  const { data: memberData } = await supabase
    .from('members')
    .select('*')
    .eq('id', idMember)
    .single();

  if (!memberData) {
    return { error_message: 'Invalid Member Id' };
  }

  const validatedFields = step1MemberSchema.safeParse({
    salutation: formData.get('salutation') as 'mr' | 'mrs' | 'ms',
    full_name: formData.get('full_name') as string,
    assoc_name: formData.get('assoc_name') as string,
    id_member_type: Number(formData.get('id_member_type')),
    mobile: formData.get('mobile') as string,
    assoc_mobile: formData.get('assoc_mobile') as string,
    aadhaar_no: formData.get('aadhaar_no') as string,
    pan_no: formData.get('pan_no') as string,
    premise_type: formData.get('premise_type') as string,
    premise_unit_type: formData.get('premise_unit_type') as string,
    flat_no: formData.get('flat_no') as string,
    build_name: formData.get('build_name') as string,
    add_premise: formData.get('add_premise') as string,
    area: Number(formData.get('area')),
    area_unit: formData.get('area_unit') as string,
    email: formData.get('email') as string,
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const updateData = validatedFields.data;
  const { error } = await supabase
    .from('members')
    .update({
      ...updateData,
      step: await getLatestStep(memberData, 2),
    })
    .eq('id', idMember);

  if (error) {
    console.error(error);
    return { error_message: 'Failed to update society' };
  }

  revalidatePath(`/${societyCode}/members/${idMember}/step1`);
  redirect(`/${societyCode}/members/${idMember}/step2`);
}

export async function updateMemberStep2(
  prevState: ActionState,
  formData: FormData
) {
  const supabase = await createClient();
  const idMember = formData.get('id');
  const societyCode = formData.get('society_code');
  if (!idMember) {
    return { error_message: 'Invalid Member Id' };
  }

  const { data: memberData } = await supabase
    .from('members')
    .select('*')
    .eq('id', idMember)
    .single();

  if (!memberData) {
    return { error_message: 'Invalid Member Id' };
  }

  const validatedFields = memberStep2Schema.safeParse({
    principle_op_balance: Number(formData.get('principle_op_balance')),
    interest_op_balance: Number(formData.get('interest_op_balance')),
    interest_free_arrears: Number(formData.get('interest_free_arrears')),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const updateData = validatedFields.data;
  const newStep = await getLatestStep(memberData, 3);

  const { error } = await supabase
    .from('members')
    .update({
      ...updateData,
      step: newStep,
    })
    .eq('id', idMember);

  if (error) {
    return { error_message: 'Failed to update member' };
  }

  revalidatePath(`/${societyCode}/members/${idMember}/step2`);
  redirect(`/${societyCode}/members/${idMember}/step3`);
}

export async function updateMemberStep3(id: number) {
  const supabase = await createClient();
  const idMember = id;
  if (!idMember) {
    return { error_message: 'Invalid Member Id' };
  }

  const { data: memberData } = await supabase
    .from('members')
    .select('*')
    .eq('id', idMember)
    .select();

  if (!memberData?.[0]) {
    return { error_message: 'Invalid Member Id' };
  }

  // Update member step
  const { error } = await supabase
    .from('members')
    .update({
      step: 4,
      status: 'active',
    })
    .eq('id', idMember);

  if (error) {
    throw new Error('Failed to update member');
  }
}

export async function getMemberHeadings(memberId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('member_headings')
    .select('*, society_headings(code, name)')
    .eq('id_member', memberId)
    .order('id', { ascending: false });

  if (error) throw error;
  return data.map((heading) => ({
    ...heading,
    code: heading.society_headings?.code,
    name: heading.society_headings?.name,
  }));
}

export async function getSocietyHeadings(societyId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('society_headings')
    .select('*')
    .eq('id_society', societyId);

  if (error) throw error;
  return data;
}

export async function deleteMemberHeading(id: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('member_headings')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function createMemberHeading(data: {
  id_member: number;
  id_society_heading: number;
  curr_amount: number;
  next_amount: number;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from('member_headings').insert(data);
  if (error) throw error;
}

export async function updateMemberHeading(
  id: number,
  data: { curr_amount: number; next_amount: number }
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('member_headings')
    .update(data)
    .eq('id', id);
  if (error) throw error;
}

export async function uploadCreateMember(data: TablesInsert<'members'>) {
  const supabase = await createClient();
  const { data: memberData, error } = await supabase
    .from('members')
    .insert(data)
    .select();

  if (error) throw error;

  return memberData?.[0]?.id;
}
