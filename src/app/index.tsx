import { Redirect } from 'expo-router';

import { useStore } from '@/repositories/store';

export default function Index() {
  const { role } = useStore();

  if (role === 'customer') return <Redirect href="/(customer)/(tabs)/home" />;
  if (role === 'owner') return <Redirect href="/(owner)/(tabs)/dashboard" />;
  return <Redirect href="/(auth)/login" />;
}

// The shop managed by the Shop Owner account in this prototype
export const OWNER_SHOP_ID = 'shop1';