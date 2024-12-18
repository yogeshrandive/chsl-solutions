'use client';

import { redirect, useParams, usePathname } from 'next/navigation';
import { SocietyProvider } from '@/contexts/society-context';
import { useEffect, useState } from 'react';
import { getSocietyByCode, getSocietyTotalMembers } from '@/models/society';
import { Tables } from '@/utils/supabase/database.types';
import { billFrequency } from '@/lib/constants';
import { HeaderContent } from '@/components/header-content';
import { SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [society, setSociety] = useState<Tables<'societies'> | null>(null);
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const params = useParams();
  const societyCode = params.code as string;
  const pathname = usePathname();

  useEffect(() => {
    const getSociety = async () => {
      const societyData = await getSocietyByCode(societyCode);
      if (!societyData) {
        redirect('/society');
      }

      // get society total memnbers
      const totalMembers = await getSocietyTotalMembers(societyData.id);
      setTotalMembers(totalMembers);
      setSociety(societyData);
    };

    getSociety();
  }, [societyCode, setSociety]);

  // Check if current route is info page
  const isInfoPage =
    pathname.includes('/info/') ||
    pathname.includes('/headgroup') ||
    pathname.includes('/accountmaster');

  // Render pending society message
  // const renderPendingMessage = () => {
  //   if (society?.status.toLowerCase() === 'pending' && !isInfoPage) {
  //     return (

  //     );
  //   }
  //   return null;
  // };

  if (!society) {
    return null;
  }

  return (
    <SocietyProvider
      societyData={{
        id: society.id,
        code: society.code,
        name: society.name,
        location: society.location || '',
        email: society.email || '',
        phone: society.phone_number || '',
        reg_no: society.regi_no || '',
        bill_frequency:
          billFrequency.find((b) => b.value === society.bill_frequency)
            ?.value || '',
        total_members: totalMembers,
        status: society.status,
        step: society.step,
      }}
    >
      <SidebarProvider>
        <div className="flex flex-1 overflow-hidden">
          <MainSidebar />
          <SidebarInset>
            <HeaderContent />
            <main className="flex-1 p-6">
              {society?.status.toLowerCase() === 'pending' && !isInfoPage ? (
                <>
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Society Setup Incomplete</AlertTitle>
                    <AlertDescription>
                      This society is in pending state. Please complete the
                      setup process to activate the society.
                      <Button variant="link" asChild className="p-0 ml-2">
                        <Link href={`/${societyCode}/info/step${society.step}`}>
                          Complete Setup
                        </Link>
                      </Button>
                    </AlertDescription>
                  </Alert>
                </>
              ) : (
                children
              )}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </SocietyProvider>
  );
}
