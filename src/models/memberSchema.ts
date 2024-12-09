import { z } from 'zod';

export const memberSchema = z.object({
  code: z.string().min(1, 'Member code is required'),
  salutation: z.enum(['mr', 'mrs', 'ms']),
  full_name: z.string().min(1, 'Full name is required'),
  assoc_name: z.string().optional(),
  id_member_type: z.number().min(1, 'Member type is required'),
  mobile: z.string().min(10, 'Mobile number must be 10 digits'),
  assoc_mobile: z.string().optional(),
  aadhaar_no: z.string().optional(),
  pan_no: z.string().optional(),
  flat_no: z.string().min(1, 'Flat/Shop number is required'),
  build_name: z.string().optional(),
  premise_type: z.enum(['commercial', 'residential']),
  premise_unit_type: z.enum(['flat', 'shop', 'office', 'warehouse', 'gala']),
  add_premise: z.string().optional(),
  area: z.number().min(1, 'Area must be positive'),
  area_unit: z.enum(['sq_ft', 'sq_m']),
  email: z.string().email().optional(),
});

export type FormDataInterface = z.infer<typeof memberSchema>;

export const step1MemberSchema = z.object({
  salutation: z.enum(['mr', 'mrs', 'ms']),
  full_name: z.string().min(1, 'Full name is required'),
  assoc_name: z.string().optional(),
  id_member_type: z.number().min(1, 'Member type is required'),
  mobile: z.string().min(10, 'Mobile number must be 10 digits'),
  assoc_mobile: z.string().optional(),
  aadhaar_no: z.string().optional(),
  pan_no: z.string().optional(),
  flat_no: z.string().min(1, 'Flat/Shop number is required'),
  build_name: z.string().optional(),
  premise_type: z.enum(['commercial', 'residential']),
  premise_unit_type: z.enum(['flat', 'shop', 'office', 'warehouse', 'gala']),
  add_premise: z.string().optional(),
  area: z.number().min(1, 'Area must be positive'),
  area_unit: z.enum(['sq_ft', 'sq_m']),
  email: z.string().email().optional(),
});

export type step1FormDataInterface = z.infer<typeof step1MemberSchema>;

export const memberStep2Schema = z.object({
  principle_op_balance: z
    .number()
    .min(0, 'Principle Opening Balance must be positive'),
  interest_op_balance: z
    .number()
    .min(0, 'Interest Opening Balance must be positive'),
  interest_free_arrears: z
    .number()
    .min(0, 'Interest free arrears must be positive'),
});

export type step2FormDataInterface = z.infer<typeof memberStep2Schema>;

export const memberHeadingSchema = z.object({
  id_society_heading: z.coerce.number().min(1, 'Society heading is required'),
  curr_amount: z.coerce.number().min(0, 'Current amount must be positive'),
  next_amount: z.coerce.number().min(0, 'Next amount must be positive'),
});

export type memberHeadingInterface = z.infer<typeof memberHeadingSchema>;
