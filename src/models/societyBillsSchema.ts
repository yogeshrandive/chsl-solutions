import { z } from "zod";

export const billGenerateSchema = z.object({
  bill_lot: z.number(),
  bill_date: z.string(),
  bill_period_from: z.string(),
  bill_period_to: z.string(),
  due_date: z.string(),
  start_bill_no: z.number(),
  interest_rate: z.number(),
  interest_period: z.string(),
  credit_adj_first: z.enum(["principle", "interest"]).nullable(),
  credit_adjustment: z.number().optional(),
  comments: z.array(z.string()),
});

export type BillGenerateData = z.infer<typeof billGenerateSchema>;
