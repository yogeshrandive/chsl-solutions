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
import { UpdateSocietyStep2Form } from './update-society-step2-form';
import { getUserDetails } from '@/lib/dal';
import { getSocietyById } from '@/models/society';

export default async function UpdateSocietyStep2({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUserDetails();
  if (!user) {
    redirect('/login');
  }

  const { id } = await params;

  const society = await getSocietyById(parseInt(id));

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
            <BreadcrumbSeparator></BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Interest Formula</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Card>
        <CardHeader className="pt-1">
          <SocietyFormTabs currentStep={society.step} formStep={2} />
        </CardHeader>
        <CardContent className="max-w-[1050px] mx-auto items-center justify-center">
          <div className="grid w-full gap-4">
            <UpdateSocietyStep2Form societyData={society} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
