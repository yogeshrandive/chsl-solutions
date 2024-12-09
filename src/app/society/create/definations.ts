import { z } from 'zod';

export const formSchema = z.object({
  code: z.string().min(1, 'Society code is required'),
  name: z.string().min(1, 'Society name is required'),
  regi_no: z.string().min(1, 'Registration number is required'),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(1, 'Address is required'),
  location: z.string().min(1, 'Location is required'),
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
  bill_lot: z.number().min(1, 'Bill lot must be at least 1'),
  id_tenant: z.number(),
  status: z.string(),
  step: z.number(),
});

export type FormDataInterface = z.infer<typeof formSchema>;
