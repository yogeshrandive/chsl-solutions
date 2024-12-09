import { cookies } from 'next/headers';

export async function getSelectedSociety() {
  const cookieStore = await cookies();
  const societyData = cookieStore.get('selected-society');

  if (!societyData) return null;

  try {
    const data = JSON.parse(societyData.value);
    return data.state.society;
  } catch {
    return null;
  }
}
