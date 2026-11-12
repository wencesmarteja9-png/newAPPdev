import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useStore } from '@/repositories/store';
import type { Shop } from '@/types';
import { formatRating } from '@/utils/format';

const GOLD = '#D4AF37';
const CARD = '#181818';
const BORDER = '#2A2A2A';
const MUTED = '#A3A3A3';

export default function ShopCard({ shop }: { shop: Shop }) {
  const router = useRouter();
  const { favorites, toggleFavorite, getShopRating } = useStore();
  const rating = getShopRating(shop.id);
  const isFavorite = favorites.includes(shop.id);

  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({ pathname: '/(customer)/shop-details', params: { id: shop.id } })
      }
    >
      <View style={styles.image}>
        <Text style={styles.imageText}>{shop.name.charAt(0)}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{shop.name}</Text>
        <Text style={styles.meta}>
          {shop.category} · {shop.address} ·{' '}
          <Text style={{ color: GOLD }}>★ {formatRating(rating.average)}</Text>
        </Text>
        <View style={styles.bottom}>
          <Text style={styles.meta}>{shop.hours}</Text>
          <View style={[styles.pill, { backgroundColor: shop.isOpen ? '#12301F' : '#3A1517' }]}>
            <Text style={[styles.pillText, { color: shop.isOpen ? '#4ADE80' : '#F87171' }]}>
              {shop.isOpen ? 'Available' : 'Unavailable'}
            </Text>
          </View>
        </View>
      </View>

      <Pressable onPress={() => toggleFavorite(shop.id)} hitSlop={10} style={styles.starButton}>
        <Text style={styles.star}>{isFavorite ? '★' : '☆'}</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: CARD,
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageText: { color: GOLD, fontSize: 22, fontWeight: '800' },
  name: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  meta: { color: MUTED, fontSize: 11, marginTop: 3 },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  pillText: { fontSize: 10, fontWeight: '600' },
  starButton: { alignSelf: 'flex-start' },
  star: { color: GOLD, fontSize: 20 },
});