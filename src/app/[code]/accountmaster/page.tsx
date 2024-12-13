/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from 'react';
import { getUserDetails } from '@/lib/dal';
import { getSocietyByCode } from '@/models/society';
import { redirect } from 'next/navigation';
import AccountMasterClientPage from './client-page';
import { getAllAccounts } from '@/models/accountMaster';
import { getAllGroups } from '@/models/societyHeadingGroups';
import AccountMasterLoading from './loading';

export default async function AccountMasterPage({
  params,
}: {
  params: { code: string };
}) {
  const user = await getUserDetails();
  if (!user) {
    redirect('/login');
  }

  const { code } = await params;
  const societyData = await getSocietyByCode(code);
  if (!societyData) redirect('/');

  return (
    <Suspense fallback={<AccountMasterLoading />}>
      <AccountMasterContent
        societyId={societyData.id}
        societyData={societyData}
      />
    </Suspense>
  );
}

async function AccountMasterContent({
  societyId,
  societyData,
}: {
  societyId: number;
  societyData: any;
}) {
  const [accounts, headGroups] = await Promise.all([
    getAllAccounts(societyId),
    getAllGroups(societyId),
  ]);

  return (
    <AccountMasterClientPage
      societyData={societyData}
      accounts={accounts}
      headGroups={headGroups}
    />
  );
}
