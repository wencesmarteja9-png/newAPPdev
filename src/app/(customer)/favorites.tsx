import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ShopCard from '@/components/ui/shop-card';
import { useStore } from '@/repositories/store';
import { formatDate } from '@/utils/format';

const GOLD = '#D4AF37';
const MUTED = '#A3A3A3';

export default function Favorites() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { shops, favorites, bookings, userName } = useStore();

  // Most recent completed visit of this customer at a shop
  const lastVisit = (shopId: string) =>
    bookings
      .filter(
        (b) => b.customerName === userName && b.shopId === shopId && b.status === 'Completed',
      )
      .sort((a, b) => b.date.localeCompare(a.date))[0];

  // Most recently visited shop first; shops never visited go last
  const list = shops
    .filter((s) => favorites.includes(s.id))
    .map((shop) => ({ shop, visit: lastVisit(shop.id) }))
    .sort((a, b) => (b.visit?.date ?? '').localeCompare(a.visit?.date ?? ''));

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 30 }]}>
        <Text style={styles.muted}>
          {list.length} saved {list.length === 1 ? 'shop' : 'shops'}. Tap ☆ on any shop to save it
          here.
        </Text>

        {list.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nothing saved yet.</Text>
            <Pressable
              style={styles.exploreButton}
              onPress={() => router.navigate('/(customer)/(tabs)/discover')}
            >
              <Text style={styles.exploreText}>Explore shops</Text>
            </Pressable>
          </View>
        ) : (
          list.map(({ shop, visit }) => (
            <View key={shop.id}>
              <ShopCard shop={shop} />
              <Text style={styles.visit}>
                🕒{' '}
                {visit
                  ? `Last visit: ${formatDate(visit.date)} · ${visit.serviceName}`
                  : 'No visits yet'}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0D0D0D' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 18, paddingBottom: 10 },
  back: { color: '#FFFFFF', fontSize: 24 },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  content: { paddingHorizontal: 18 },
  muted: { color: MUTED, fontSize: 12 },
  visit: { color: MUTED, fontSize: 11, marginTop: 6, marginLeft: 4 },
  empty: { alignItems: 'center', marginTop: 40, gap: 14 },
  emptyText: { color: MUTED, fontSize: 14 },
  exploreButton: { backgroundColor: GOLD, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 13 },
  exploreText: { color: '#0D0D0D', fontSize: 14, fontWeight: '700' },
});