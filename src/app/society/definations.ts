import { z } from 'zod';

export const SocietySchema = z.object({
  id: z.number(),
  id_tenant: z.number(),
  code: z.string(),
  name: z.string(),
  bill_lot: z.number(),
  bill_type: z.string(),
  cur_period_from: z.string(),
  cur_period_to: z.string(),
  next_bill_date: z.string(),
  status: z.string(),
  address: z.string(),
  regi_no: z.string(),
});

export interface Society {
  id: number;
  name: string;
  code: string;
  id_tenant: number;
  status: string;
  address: string | null;
  bill_lot: number;
  bill_frequency: string;
  cur_period_from: string;
  cur_period_to: string;
  next_bill_date: string | null;
  regi_no: string | null;
  step: number;
}
