'use server';

import {
  createBook,
  getBookByCode,
  updateBook,
  deleteBook,
} from '@/models/bookMaster';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const bookSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['bank', 'cash']),
  groupId: z.string().min(1, 'Group is required'),
  subGroupId: z.string().nullable(),
  opBalance: z.string().transform((val) => parseFloat(val) || 0),
  opType: z.enum(['credit', 'debit']),
  accountNo: z.string().nullable(),
  ifscCode: z.string().nullable(),
  branchName: z.string().nullable(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  isCollection: z.boolean().optional(),
});

interface FormState {
  errors: Record<string, string[]>;
  message: string;
}

export async function createBookAction(
  context: {
    societyCode: string;
    idSociety: number;
  },
  prevState: FormState,
  formData: FormData
) {
  const validatedFields = bookSchema.safeParse({
    code: formData.get('code'),
    name: formData.get('name'),
    type: formData.get('type'),
    groupId: formData.get('groupId'),
    subGroupId: formData.get('subGroupId'),
    opBalance: formData.get('opBalance'),
    opType: formData.get('opType'),
    accountNo: formData.get('accountNo'),
    ifscCode: formData.get('ifscCode'),
    branchName: formData.get('branchName'),
    address: formData.get('address'),
    phone: formData.get('phone'),
    isCollection: formData.get('isCollection') === 'on',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields',
    };
  }

  const {
    code,
    name,
    type,
    groupId,
    subGroupId,
    opBalance,
    opType,
    ...bankDetails
  } = validatedFields.data;

  try {
    console.log(validatedFields.data);
    const existingBook = await getBookByCode(code, context.idSociety);
    if (existingBook) {
      return {
        errors: { code: ['Book code already exists'] },
        message: 'Book code already exists',
      };
    }

    await createBook({
      code,
      name,
      type,
      id_group: parseInt(groupId),
      id_sub_group:
        subGroupId === '0' || !subGroupId ? null : parseInt(subGroupId),
      op_balance: opBalance,
      op_type: opType,
      id_society: context.idSociety,
      ...(type === 'bank'
        ? {
            acc_no: bankDetails.accountNo ?? '',
            ifsc_code: bankDetails.ifscCode ?? '',
            branch_name: bankDetails.branchName ?? '',
            address: bankDetails.address ?? '',
            phone_no: bankDetails.phone ?? '',
            is_collection_acount: bankDetails.isCollection,
          }
        : {}),
    });

    revalidatePath(`/${context.societyCode}/bookmaster`);
    return { errors: {}, message: 'success' };
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      message: 'Failed to create book',
    };
  }
}

export async function updateBookAction(
  context: {
    societyCode: string;
    idSociety: number;
  },
  bookId: number,
  prevState: FormState,
  formData: FormData
) {
  const validatedFields = bookSchema.safeParse({
    code: formData.get('code'),
    name: formData.get('name'),
    type: formData.get('type'),
    groupId: formData.get('groupId'),
    subGroupId: formData.get('subGroupId'),
    opBalance: formData.get('opBalance'),
    opType: formData.get('opType'),
    accountNo: formData.get('accountNo'),
    ifscCode: formData.get('ifscCode'),
    branchName: formData.get('branchName'),
    address: formData.get('address'),
    phone: formData.get('phone'),
    isCollection: formData.get('isCollection') === 'on',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields',
    };
  }

  const {
    code,
    name,
    type,
    groupId,
    subGroupId,
    opBalance,
    opType,
    ...bankDetails
  } = validatedFields.data;

  try {
    await updateBook(bookId, {
      code,
      name,
      type,
      id_group: parseInt(groupId),
      id_sub_group:
        subGroupId === '0' || !subGroupId ? null : parseInt(subGroupId),
      op_balance: opBalance,
      op_type: opType,
      ...(type === 'bank'
        ? {
            acc_no: bankDetails.accountNo ?? '',
            ifsc_code: bankDetails.ifscCode ?? '',
            branch_name: bankDetails.branchName ?? '',
            address: bankDetails.address ?? '',
            phone_no: bankDetails.phone ?? '',
            is_collection_acount: bankDetails.isCollection,
          }
        : {}),
    });

    revalidatePath(`/${context.societyCode}/bookmaster`);
    return { errors: {}, message: 'success' };
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      message: 'Failed to update book',
    };
  }
}

export async function deleteBookAction(
  context: {
    societyCode: string;
  },
  bookId: number
) {
  try {
    await deleteBook(bookId);
    revalidatePath(`/${context.societyCode}/bookmaster`);
    return { message: 'success' };
  } catch (error) {
    console.error(error);
    return { message: 'Failed to delete book' };
  }
}
