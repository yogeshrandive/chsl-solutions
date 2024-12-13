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
import { SocietyFormTabs } from '../society-form-tab';
import { RebateSettingsForm } from './rebate-settings-form';
import { getSocietyByCode } from '@/models/society';
import { getUserDetails } from '@/lib/dal';
import { Society } from '@/models/societyDefinations';

export default async function UpdateSocietyStep4({
  params,
}: {
  params: { code: string };
}) {
  const user = await getUserDetails();
  if (!user) {
    redirect('/login');
  }

  const { code } = await params;

  const society = await getSocietyByCode(code);

  if (!society) {
    redirect('/society');
  }

  return (
    <div>
      <div className="pb-4 ">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${code}/dashboard`}>
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator></BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Rebate Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Card>
        <CardHeader className="pt-1">
          <SocietyFormTabs currentStep={society.step} formStep={4} />
        </CardHeader>
        <CardContent className="max-w-[1050px] mx-auto items-center justify-center">
          <div className="grid w-full gap-4">
            <RebateSettingsForm
              societyId={society.id.toString()}
              societyData={society as Society}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
