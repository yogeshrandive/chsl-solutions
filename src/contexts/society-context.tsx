'use client';

import { createContext, useContext, ReactNode } from 'react';

interface SocietyContextType {
  societyData: {
    id: number;
    code: string;
    name: string;
    location: string;
    email: string;
    phone: string;
    reg_no: string;
    bill_type: string;
    total_members: number;
  } | null;
}

export const SocietyContext = createContext<SocietyContextType | undefined>(
  undefined
);

export function SocietyProvider({
  children,
  societyData,
}: {
  children: ReactNode;
  societyData: SocietyContextType['societyData'];
}) {
  return (
    <SocietyContext.Provider value={{ societyData }}>
      {children}
    </SocietyContext.Provider>
  );
}

export function useSociety() {
  const context = useContext(SocietyContext);
  if (context === undefined) {
    throw new Error('useSociety must be used within a SocietyProvider');
  }
  return context;
}
