import { StyleSheet, Text, View } from 'react-native';

import SubScreen from '@/components/ui/sub-screen';
import { OWNER_SHOP_ID } from '@/repositories/mock-data';
import { useStore } from '@/repositories/store';
import { formatDate, formatRating, stars } from '@/utils/format';

const GOLD = '#D4AF37';
const CARD = '#181818';
const BORDER = '#2A2A2A';
const MUTED = '#A3A3A3';

export default function ReviewsScreen() {
  const { shops, reviews, getShopRating, getBarberRating } = useStore();
  const shop = shops.find((s) => s.id === OWNER_SHOP_ID);
  if (!shop) return null;

  // Newest first: new reviews are added to the front of the list
  const list = reviews.filter((r) => r.shopId === shop.id);
  const shopRating = getShopRating(shop.id);

  const barberValues = list.map((r) => r.barberRating);
  const barberAverage =
    barberValues.length > 0
      ? Math.round((barberValues.reduce((a, b) => a + b, 0) / barberValues.length) * 10) / 10
      : null;

  return (
    <SubScreen title="Reviews">
      <View style={styles.row}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>★ {formatRating(shopRating.average)}</Text>
          <Text style={styles.statLabel}>Shop rating · {shopRating.count} reviews</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>★ {formatRating(barberAverage)}</Text>
          <Text style={styles.statLabel}>Barber rating</Text>
        </View>
      </View>

      <Text style={styles.heading}>By barber</Text>
      {shop.barbers.map((b) => {
        const r = getBarberRating(shop.id, b.id);
        return (
          <View key={b.id} style={styles.barberRow}>
            <Text style={styles.name}>{b.name}</Text>
            <Text style={styles.muted}>
              <Text style={{ color: GOLD }}>★ {formatRating(r.average)}</Text> · {r.count}
            </Text>
          </View>
        );
      })}

      <Text style={styles.heading}>Customer reviews</Text>
      {list.length === 0 ? (
        <Text style={styles.muted}>No reviews yet.</Text>
      ) : (
        list.map((r) => (
          <View key={r.id} style={styles.reviewCard}>
            <View style={styles.rowBetween}>
              <Text style={styles.name}>{r.customerName}</Text>
              <Text style={styles.muted}>{formatDate(r.date)}</Text>
            </View>
            <Text style={styles.stars}>Shop {stars(r.shopRating)}</Text>
            <Text style={styles.stars}>
              {r.barberName} {stars(r.barberRating)}
            </Text>
            {r.comment ? <Text style={styles.comment}>{r.comment}</Text> : null}
          </View>
        ))
      )}
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statCard: { flex: 1, backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 14, padding: 12 },
  statValue: { color: GOLD, fontSize: 20, fontWeight: '800' },
  statLabel: { color: MUTED, fontSize: 10, marginTop: 2 },
  heading: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', marginTop: 14 },
  barberRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 12, padding: 14 },
  name: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  muted: { color: MUTED, fontSize: 12 },
  reviewCard: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 14, padding: 12, gap: 4 },
  stars: { color: GOLD, fontSize: 12 },
  comment: { color: '#FFFFFF', fontSize: 12, marginTop: 2 },
});