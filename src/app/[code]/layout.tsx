'use client';

import { redirect, useParams } from 'next/navigation';
import { SocietyProvider } from '@/contexts/society-context';
import { useEffect, useState } from 'react';
import { getSocietyByCode, getSocietyTotalMembers } from '@/models/society';
import { Tables } from '@/utils/supabase/database.types';
import { billTypes } from '@/lib/constants';
import { HeaderContent } from '@/components/header-content';
import { SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function CodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [society, setSociety] = useState<Tables<'societies'> | null>(null);
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const params = useParams();
  const societyCode = params.code as string;

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
        bill_type:
          billTypes.find((b) => b.value === society.bill_type)?.value || '',
        total_members: totalMembers,
      }}
    >
      <SidebarProvider>
        <div className="flex flex-1 overflow-hidden">
          <MainSidebar />
          <SidebarInset>
            <HeaderContent />
            <main className="flex-1 p-6">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </SocietyProvider>
  );
}
