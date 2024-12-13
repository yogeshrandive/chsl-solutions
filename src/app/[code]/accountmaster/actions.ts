'use server';

import { createAccount, getAccountByCode } from '@/models/accountMaster';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const accountSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
  groupId: z.string().min(1, 'Group is required'),
  subGroupId: z.string().nullable(),
  opBalance: z.string().transform((val) => parseFloat(val) || 0),
  opType: z.enum(['credit', 'debit']),
});

interface FormState {
  errors: Record<string, string[]>;
  message: string;
}

export async function createAccountAction(
  context: {
    societyCode: string;
    idSociety: number;
  },
  prevState: FormState,
  formData: FormData
) {
  const validatedFields = accountSchema.safeParse({
    code: formData.get('code'),
    name: formData.get('name'),
    groupId: formData.get('groupId'),
    subGroupId: formData.get('subGroupId'),
    opBalance: formData.get('opBalance'),
    opType: formData.get('opType'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields',
    };
  }

  const { code, name, groupId, subGroupId, opBalance, opType } =
    validatedFields.data;

  try {
    // Check if account code already exists for this society
    const existingAccount = await getAccountByCode(code, context.idSociety);

    if (existingAccount) {
      return {
        errors: { code: ['Account code already exists'] },
        message: 'Account code already exists',
      };
    }
    await createAccount({
      code,
      name,
      id_group: parseInt(groupId),
      id_sub_group:
        subGroupId === '0' || !subGroupId ? null : parseInt(subGroupId),
      op_balance: opBalance,
      op_type: opType,
      id_society: context.idSociety,
    });

    revalidatePath(`/${context.societyCode}/accountmaster`);
    return { errors: {}, message: 'success' };
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return {
        errors: { code: ['Account code already exists'] },
        message: 'Account code already exists',
      };
    }
    return {
      errors: {},
      message: 'Failed to create account',
    };
  }
}
