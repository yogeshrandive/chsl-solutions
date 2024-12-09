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

export default async function UpdateSocietyStep1({
  params,
}: {
  params: { id: number };
}) {
  const user = await getUserDetails();
  if (!user) {
    redirect('/login');
  }

  const { id } = await params;
  const society = await getSocietyById(Number(id));

  if (!society) {
    redirect('/society');
  }

  if (user.id_tenant != society?.id_tenant)
    throw new Error('Invalid society details.');

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
            <UpdateSocietyForm userData={user} societyData={society} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
