import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BillGenerationForm } from './bill-generation-form';
import { BillsTable } from './bills-table';
import { redirect } from 'next/navigation';
import { getUserDetails } from '@/lib/dal';
import { getSocietyByCode } from '@/models/society';

export default async function BillsPage({
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
    <>
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
        <BillGenerationForm societyData={societyData} />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>Previous Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
            <BillsTable />
          </Suspense>
        </CardContent>
      </Card>
    </>
  );
}
