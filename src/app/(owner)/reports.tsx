import { StyleSheet, Text, View } from 'react-native';

import SubScreen from '@/components/ui/sub-screen';
import { OWNER_SHOP_ID } from '@/repositories/mock-data';
import { useStore } from '@/repositories/store';
import type { BookingStatus } from '@/types';

const GOLD = '#D4AF37';
const CARD = '#181818';
const BORDER = '#2A2A2A';
const MUTED = '#A3A3A3';

const STATUSES: BookingStatus[] = [
  'Pending',
  'Confirmed',
  'Checked In',
  'In Progress',
  'Completed',
  'Cancelled',
  'No-Show',
];

export default function ReportsScreen() {
  const { bookings } = useStore();
  const mine = bookings.filter((b) => b.shopId === OWNER_SHOP_ID);

  const revenue = mine
    .filter((b) => b.status === 'Completed')
    .reduce((sum, b) => sum + b.price, 0);

  const counts = STATUSES.map((status) => ({
    status,
    count: mine.filter((b) => b.status === status).length,
  }));
  const max = Math.max(...counts.map((c) => c.count), 1);

  return (
    <SubScreen title="Reports">
      <View style={styles.row}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>₱{revenue}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: '#FFFFFF' }]}>{mine.length}</Text>
          <Text style={styles.statLabel}>Total bookings</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>By status</Text>
        {counts.map(({ status, count }) => (
          <View key={status} style={styles.barRow}>
            <Text style={styles.barLabel}>{status}</Text>
            <View style={styles.track}>
              {count > 0 && <View style={[styles.fill, { width: `${(count / max) * 100}%` }]} />}
            </View>
            <Text style={styles.barCount}>{count}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.note}>Revenue is the total price of Completed bookings.</Text>
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 14, padding: 14 },
  statValue: { color: GOLD, fontSize: 22, fontWeight: '800' },
  statLabel: { color: MUTED, fontSize: 11, marginTop: 2 },
  card: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 16, padding: 14, gap: 12, marginTop: 6 },
  heading: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barLabel: { color: MUTED, fontSize: 11, width: 74 },
  track: { flex: 1, height: 8, borderRadius: 4, backgroundColor: '#262626', overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4, backgroundColor: GOLD },
  barCount: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', width: 22, textAlign: 'right' },
  note: { color: MUTED, fontSize: 11, marginTop: 4 },
});