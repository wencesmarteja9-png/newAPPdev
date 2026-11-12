import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import ScreenContainer from '@/components/ui/screen-container';
import ShopCard from '@/components/ui/shop-card';
import { useStore } from '@/repositories/store';
import type { ShopCategory } from '@/types';
import { formatDate, statusColors } from '@/utils/format';

const GOLD = '#D4AF37';
const CARD = '#181818';
const BORDER = '#2A2A2A';
const MUTED = '#A3A3A3';

export default function CustomerHome() {
  const router = useRouter();
  const { userName, shops, bookings, favorites } = useStore();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ShopCategory | null>(null);

  const filteredShops = useMemo(
    () =>
      shops.filter(
        (shop) =>
          shop.name.toLowerCase().includes(search.toLowerCase()) &&
          (category === null || shop.category === category),
      ),
    [shops, search, category],
  );

  const upcoming = bookings.find(
    (b) =>
      b.customerName === userName &&
      ['Pending', 'Confirmed', 'Checked In'].includes(b.status),
  );
  const upcomingShop = upcoming ? shops.find((s) => s.id === upcoming.shopId) : undefined;
  const pill = upcoming ? statusColors(upcoming.status) : null;

  return (
    <ScreenContainer>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>
            Que<Text style={styles.gold}>Less</Text>
          </Text>
          <Text style={styles.tagline}>Book smart. Wait less.</Text>
        </View>
        <Pressable
          style={styles.avatar}
          onPress={() => router.navigate('/(customer)/(tabs)/profile')}
        >
          <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
        </Pressable>
      </View>

      {/* GREETING */}
      <Text style={styles.goodDay}>Good day,</Text>
      <Text style={styles.greeting}>Hi, {userName}</Text>

      {/* SEARCH */}
      <TextInput
        placeholder="Search barbershops and salons"
        placeholderTextColor={MUTED}
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      {/* CATEGORY CHIPS */}
      <View style={styles.chipRow}>
        {(['Barbershop', 'Salon'] as ShopCategory[]).map((item) => {
          const active = category === item;
          return (
            <Pressable
              key={item}
              onPress={() => setCategory(active ? null : item)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* UPCOMING APPOINTMENT */}
      {upcoming && pill ? (
        <View style={styles.upcomingCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.smallMuted}>Upcoming appointment</Text>
            <View style={[styles.pill, { backgroundColor: pill.bg }]}>
              <Text style={[styles.pillText, { color: pill.fg }]}>{upcoming.status}</Text>
            </View>
          </View>
          <Text style={styles.upcomingService}>{upcoming.serviceName}</Text>
          <Text style={styles.smallMuted}>
            {formatDate(upcoming.date)} · {upcoming.time} · {upcomingShop?.name}
          </Text>
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.smallMuted}>No upcoming appointments.</Text>
        </View>
      )}

      {/* FAVORITES (opens the Favorites page in a later step) */}
            <Pressable
        style={styles.favoriteCard}
        onPress={() => router.push('/(customer)/favorites')}
      >
        <Text style={styles.favoriteStar}>★</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Favorites</Text>
          <Text style={styles.smallMuted}>{favorites.length} saved · see where you've been</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </Pressable>

      {/* NEARBY */}
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Nearby</Text>
        <Pressable onPress={() => router.navigate('/(customer)/(tabs)/discover')}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>

      {filteredShops.length === 0 ? (
        <View style={[styles.emptyCard, { marginTop: 12 }]}>
          <Text style={styles.smallMuted}>No establishments found.</Text>
        </View>
      ) : (
        filteredShops.map((shop) => <ShopCard key={shop.id} shop={shop} />)
      )}

      <View style={{ height: 20 }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  logo: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  gold: { color: GOLD },
  tagline: { color: MUTED, fontSize: 11 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#2E2710', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: GOLD, fontWeight: '700' },
  goodDay: { color: MUTED, fontSize: 12 },
  greeting: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginBottom: 14 },
  searchInput: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 12, color: '#FFFFFF', paddingHorizontal: 14, height: 46, marginBottom: 12 },
  chipRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  chip: { flex: 1, backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  chipActive: { backgroundColor: GOLD, borderColor: GOLD },
  chipText: { color: '#FFFFFF', fontSize: 13 },
  chipTextActive: { color: '#0D0D0D', fontWeight: '700' },
  upcomingCard: { backgroundColor: CARD, borderColor: GOLD, borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 12, gap: 4 },
  upcomingService: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  emptyCard: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 12 },
  favoriteCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 16 },
  favoriteStar: { color: GOLD, fontSize: 22 },
  arrow: { color: MUTED, fontSize: 22 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  seeAll: { color: GOLD, fontSize: 12 },
  smallMuted: { color: MUTED, fontSize: 12 },
  cardTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  pill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  pillText: { fontSize: 10, fontWeight: '600' },
});