'use server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Slash } from 'lucide-react';
import { SocietyFormTabs } from '../../society-form-tab';
import { UpdateSocietyForm } from './update-society-form';
import { getSocietyById } from '@/models/society';
import { getUserDetails } from '@/lib/dal';
import { Suspense } from 'react';
import SocietyStep1Loading from './loading';
import { getStates } from '../../create/actions';

export default async function UpdateSocietyStep1({
  params,
}: {
  params: { id: string };
}) {
  return (
    <Suspense fallback={<SocietyStep1Loading />}>
      <UpdateSocietyStep1Content params={params} />
    </Suspense>
  );
}

async function UpdateSocietyStep1Content({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUserDetails();
  if (!user) {
    redirect('/login');
  }

  const { id } = params;
  const society = await getSocietyById(parseInt(id));
  if (!society) {
    redirect('/society');
  }

  const states = await getStates();

  return (
    <div>
      <div className="pb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/society">All Societies</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Card>
        <CardHeader className="pt-1">
          <SocietyFormTabs currentStep={society.step} formStep={1} />
        </CardHeader>
        <CardContent className="max-w-[1050px] mx-auto items-center justify-center">
          <div className="grid w-full gap-4">
            <UpdateSocietyForm
              userData={user}
              societyData={society}
              states={states}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
