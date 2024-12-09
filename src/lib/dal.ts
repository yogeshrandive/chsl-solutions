import 'server-only';

import { cache } from 'react';
import { createClient } from '@/utils/supabase/client';
import { createClient as createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const verifySession = cache(async () => {
  const supabase = await createClient();
  const userSession = await supabase.auth.getUser();

  if (!userSession.data.user) {
    redirect('/login');
  }

  return { isAuth: true, userId: userSession.data.user?.id };
});

export const getUserDetails = cache(async () => {
  const supabase = await createServerClient();
  const userSession = await supabase.auth.getUser();

  // get the user details
  const { data: profileData } = await supabase
    .from('users')
    .select('*')
    .eq('id', userSession.data.user?.id || 0)
    .single();

  if (!profileData) {
    return null;
  }

  return { ...profileData };
});
