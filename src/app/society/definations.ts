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

export type Society = z.infer<typeof SocietySchema>;
