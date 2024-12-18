/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getBillsBySocietyId(societyId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('society_bills')
    .select('*')
    .eq('id_society', societyId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function checkExistingBill(societyId: number, billLot: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('society_bills')
    .select('id')
    .eq('id_society', societyId)
    .eq('bill_lot', billLot)
    .eq('status', 'published')
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}

export async function generateBill(data: any & { id_society: number }) {
  const supabase = await createClient();

  // Get society details for tenant ID and bill frequency
  const { data: society } = await supabase
    .from('societies')
    .select('id_tenant, bill_frequency, interest_type')
    .eq('id', data.id_society)
    .single();

  if (!society) throw new Error('Society not found');

  const existingBill = await checkExistingBill(data.id_society, data.bill_lot);
  if (existingBill) {
    throw new Error('A published bill already exists for this bill lot');
  }

  const { error } = await supabase.from('society_bills').insert({
    id_tenant: society.id_tenant,
    id_society: data.id_society,
    bill_frequency: society.bill_frequency,
    bill_lot: data.bill_lot,
    start_bill_no: data.start_bill_no,
    bill_date: data.bill_date,
    bill_period_from: data.bill_period_from,
    bill_period_to: data.bill_period_to,
    due_date: data.due_date,
    status: 'pending',
    interest_rate: data.interest_rate,
    interest_type: society.interest_type,
    credit_adj_first: data.credit_adj_first,
    comments: data.comments,
  });

  if (error) throw error;
  revalidatePath(`/${data.id_society}/bills`);
  return true;
}
