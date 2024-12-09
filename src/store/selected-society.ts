'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SelectedSociety {
  id: number;
  id_tenant: number;
  name: string;
  code: string;
  bill_type: string;
  regi_no: string;
  total_members: number;
}

interface SelectedSocietyStore {
  society: SelectedSociety | null;
  // eslint-disable-next-line no-unused-vars
  setSociety: (society: SelectedSociety | null) => void;
}

export const useSelectedSociety = create<SelectedSocietyStore>()(
  persist(
    (set) => ({
      society: null,
      setSociety: (society) => set({ society }),
    }),
    {
      name: 'selected-society',
    }
  )
);
