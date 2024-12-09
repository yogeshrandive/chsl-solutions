'use server';

// import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import {
  billGenerationSchema,
  type Bill,
  type BillGenerationFormData,
} from './schema';
// import { TablesInsert } from '@/utils/supabase/database.types';

export async function generateBill(formData: BillGenerationFormData) {
  try {
    const validated = billGenerationSchema.safeParse(formData);
    if (!validated.success) throw new Error('Invalid form data');

    const supabase = await createClient();
    const { data: newBill, error } = await supabase
      .from('society_bills')
      .insert({
        id_society: validated.data.societyId,
        id_tenant: 1,
        bill_date: validated.data.billDate,
        bill_period_from: validated.data.billPeriodFrom,
        bill_period_to: validated.data.billPeriodTo,
        bill_lot: validated.data.billLot,
        start_bill_no: validated.data.startBillNo,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return newBill;
  } catch (error) {
    console.error('Error generating bill:', error);
    throw new Error('Failed to generate bill');
  }
}

export async function getBills(societyId: number): Promise<Bill[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('society_bills')
      .select('*')
      .eq('id_society', societyId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching bills:', error);
    throw new Error('Failed to fetch bills');
  }
}

export async function getSocietyDetails(societyId: number) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('societies')
      .select('*')
      .eq('id', societyId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching society details:', error);
    throw new Error('Failed to fetch society details');
  }
}
