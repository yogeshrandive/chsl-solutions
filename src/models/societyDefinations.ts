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

export const step1FormSchema = z.object({
  name: z.string().min(1, 'Society name is required'),
  regi_no: z.string().min(1, 'Registration number is required'),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(10, 'Phone number must be at least 10 digits'),
  location: z.string().min(1, 'Location is required'),
  address: z.string().min(1, 'Address is required'),
  pin_code: z
    .number()
    .min(100000, 'PIN code must be 6 digits')
    .max(999999, 'PIN code must be 6 digits'),
  id_state: z.number().min(1, 'Please select a state'),
  id_city: z.number().min(1, 'Please select a city'),
  bill_no: z.number().min(1, 'Bill number must be at least 1'),
  receipt_no: z.number().min(1, 'Receipt number must be at least 1'),
  gst_no: z.string().optional(),
  pan_no: z.string().optional(),
  tan_no: z.string().optional(),
  sac_code: z.string().optional(),
  bill_type: z.string().min(1, 'Bill type is required'),
  period_from: z.string().min(1, 'Period from date is required'),
  period_to: z.string().min(1, 'Period to date is required'),
  cur_period_from: z.string().min(1, 'Current period from date is required'),
  cur_period_to: z.string().min(1, 'Current period to date is required'),
  next_bill_date: z.string().min(1, 'Next bill date is required'),
  step: z.number(),
});

export type Step1FormDataInterface = z.infer<typeof step1FormSchema>;

export const step2FormSchema = z.object({
  payment_due_date: z
    .number()
    .min(1, 'Must be between 1 and 30')
    .max(30, 'Must be between 1 and 30'),
  grace_period: z
    .number()
    .min(0, 'Must be between 0 and 30')
    .max(30, 'Must be between 0 and 30'),
  interest_rate: z
    .number()
    .min(0, 'Must be 0 or greater')
    .max(100, 'Must be 100 or less'),
  period_of_calculation: z.enum(['daily', 'as_per_bill_type']),
  interest_type: z.enum(['simple', 'compound']),
  interest_min_rs: z.number().min(0, 'Must be 0 or greater'),
  round_off_amount: z.boolean(),
  credit_adj_first: z.enum(['interest', 'principle']),
});

export type Step2FormDataInterface = z.infer<typeof step2FormSchema>;

export const periodOfCalculationOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'as_per_bill_type', label: 'As Per Bill Type' },
];

export const interestTypeOptions = [
  { value: 'simple', label: 'Simple' },
  { value: 'compound', label: 'Compound' },
];

export const creditAdjFirstOptions = [
  { value: 'interest', label: 'Interest' },
  { value: 'principle', label: 'Principle' },
];

export const headingSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
  amount: z.number().min(0, 'Amount must be 0 or greater'),
  is_interest: z.boolean(),
  is_gst: z.boolean(),
});

export type HeadingFormData = z.infer<typeof headingSchema>;

export const rebateSettingsSchema = z.object({
  rebate_apply: z.boolean().default(false),
  rebate_type: z.enum(['fixed_amount', 'fixed_per', 'manual']),
  rebate_due_date: z.number().min(1).max(30),
  rebate_fixed_amount: z.number().min(0).default(0),
  rebate_percentage: z.number().min(0).max(100).default(0),
});

export type RebateSettings = z.infer<typeof rebateSettingsSchema>;

export const penaltySettingsSchema = z.object({
  penalty_apply: z.boolean(),
  penalty_charged_on: z.enum(['fixed_amount', 'percentage']),
  penalty_fixed_amount: z.number().min(0, 'Amount must be positive').optional(),
  penalty_percentage: z
    .number()
    .min(0, 'Percentage must be between 0 and 100')
    .max(100, 'Percentage must be between 0 and 100')
    .optional(),
  penalty_on_bill_exceed: z.number().min(0, 'Value must be 0 or greater'),
});

export type PenaltySettings = z.infer<typeof penaltySettingsSchema>;

export const conditionSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Condition description is required'),
});

export type Condition = z.infer<typeof conditionSchema>;

export const conditionsFormSchema = z.object({
  newCondition: z.string().min(1, 'Condition is required'),
});

export type ConditionsForm = z.infer<typeof conditionsFormSchema>;

export interface SocietyHeading extends HeadingFormData {
  id: number;
  id_society: number;
  created_at: string;
  amount: number;
  rebate_amount: number | null;
  rebate_percentage: number | null;
}
