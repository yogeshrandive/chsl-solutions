import { z } from 'zod';

export const billGenerationSchema = z.object({
  billDate: z.string().min(1, 'Bill date is required'),
  societyId: z.number().min(1, 'Society is required'),
  billPeriodFrom: z.string().min(1, 'Bill period from is required'),
  billPeriodTo: z.string().min(1, 'Bill period to is required'),
  billLot: z.number().min(1, 'Bill lot is required'),
  startBillNo: z.number().min(1, 'Start bill number is required'),
});

export type BillGenerationFormData = z.infer<typeof billGenerationSchema>;

export interface Bill {
  id: number;
  id_society: number;
  bill_date: string | null;
  bill_period_from: string;
  bill_period_to: string;
  bill_lot: number;
  start_bill_no: number;
  status: string;
  notes: string[] | null;
  created_at: string;
  updated_at: string;
}
