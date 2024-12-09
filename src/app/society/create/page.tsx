import { CreateSocietyForm } from './create-society-form';
import { getUserDetails } from '@/lib/dal';
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
import { SocietyFormTabs } from './../society-form-tab';

export default async function CreateSocietyPage() {
  const user = await getUserDetails();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Create New Society
        </h2>
      </div>
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList className="flex flex-wrap items-center">
            <BreadcrumbItem>
              <BreadcrumbLink href="/society" className="text-sm sm:text-base">
                All Societies
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm sm:text-base">
                Create New
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Card className="w-full">
        <CardHeader className="p-4 sm:p-6">
          <SocietyFormTabs currentStep={1} formStep={1} />
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="w-full max-w-4xl mx-auto">
            <CreateSocietyForm tenantId={user.id_tenant} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
