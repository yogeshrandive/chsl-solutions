/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from 'react';
import { getUserDetails } from '@/lib/dal';
import { getSocietyByCode } from '@/models/society';
import { redirect } from 'next/navigation';
import BookMasterClientPage from './client-page';
import { getAllBooks } from '@/models/bookMaster';
import { getAllGroups } from '@/models/societyHeadingGroups';
import BookMasterLoading from './loading';

export default async function BookMasterPage({
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
    <Suspense fallback={<BookMasterLoading />}>
      <BookMasterContent
        societyCode={code}
        societyId={societyData.id}
        societyData={societyData}
      />
    </Suspense>
  );
}

async function BookMasterContent({
  societyId,
  societyData,
}: {
  societyCode: string;
  societyId: number;
  societyData: any;
}) {
  const [books, headGroups] = await Promise.all([
    getAllBooks(societyId),
    getAllGroups(societyId),
  ]);

  return (
    <BookMasterClientPage
      societyData={societyData}
      books={books}
      headGroups={headGroups}
    />
  );
}
