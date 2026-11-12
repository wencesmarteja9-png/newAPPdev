import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import ScreenContainer from '@/components/ui/screen-container';
import ShopCard from '@/components/ui/shop-card';
import { useStore } from '@/repositories/store';
import type { ShopCategory } from '@/types';

const GOLD = '#D4AF37';
const CARD = '#181818';
const BORDER = '#2A2A2A';
const MUTED = '#A3A3A3';

export default function ExploreScreen() {
  const { shops } = useStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ShopCategory | 'All'>('All');

  const filtered = useMemo(
    () =>
      shops.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) &&
          (category === 'All' || s.category === category),
      ),
    [shops, search, category],
  );

  return (
    <ScreenContainer>
      <Text style={styles.title}>Explore</Text>

      <TextInput
        placeholder="Search establishments"
        placeholderTextColor={MUTED}
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <View style={styles.chipRow}>
        {(['All', 'Barbershop', 'Salon'] as const).map((item) => {
          const active = category === item;
          return (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>

      {filtered.length === 0 ? (
        <Text style={[styles.empty]}>No establishments found.</Text>
      ) : (
        filtered.map((shop) => <ShopCard key={shop.id} shop={shop} />)
      )}

      <View style={{ height: 20 }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginBottom: 14 },
  search: {
    backgroundColor: CARD,
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 12,
    color: '#FFFFFF',
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 12,
  },
  chipRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  chip: {
    flex: 1,
    backgroundColor: CARD,
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  chipActive: { backgroundColor: GOLD, borderColor: GOLD },
  chipText: { color: '#FFFFFF', fontSize: 13 },
  chipTextActive: { color: '#0D0D0D', fontWeight: '700' },
  empty: { color: MUTED, marginTop: 20, textAlign: 'center' },
});