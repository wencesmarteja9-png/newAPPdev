import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import ScreenContainer from '@/components/ui/screen-container';
import { OWNER_SHOP_ID, isoDate } from '@/repositories/mock-data';
import { useStore } from '@/repositories/store';
import type { Booking, BookingStatus } from '@/types';
import { formatDate, formatRating, statusColors } from '@/utils/format';

const GOLD = '#D4AF37';
const CARD = '#181818';
const BORDER = '#2A2A2A';
const MUTED = '#A3A3A3';

// Sample values for the six days before today (as in the guide); the last bar is today's real count
const SAMPLE_WEEK = [4, 5, 3, 6, 4, 7];

function refNumber(b: Booking): number {
  return parseInt(b.reference.replace('QL-', ''), 10) || 0;
}

function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function OwnerDashboard() {
  const router = useRouter();
  const { shops, bookings, updateShop, getShopRating } = useStore();

  const shop = shops.find((s) => s.id === OWNER_SHOP_ID);
  if (!shop) return null;

  const mine = bookings.filter((b) => b.shopId === shop.id);
  const today = isoDate(0);
  const todayCount = mine.filter((b) => b.date === today).length;
  const countStatus = (status: BookingStatus) => mine.filter((b) => b.status === status).length;
  const activeQueue = mine.filter(
    (b) => b.date === today && ['Checked In', 'In Progress'].includes(b.status),
  ).length;
  const rating = getShopRating(shop.id);

  const recent = [...mine].sort((a, b) => refNumber(b) - refNumber(a)).slice(0, 3);

  const week = Array.from({ length: 7 }, (_, i) => {
    const [y, m, d] = isoDate(i - 6).split('-').map(Number);
    const letter = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][new Date(y, m - 1, d).getDay()];
    return { letter, value: i === 6 ? todayCount : SAMPLE_WEEK[i] };
  });
  const maxValue = Math.max(...week.map((w) => w.value), 1);

  return (
    <ScreenContainer>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>
            Que<Text style={{ color: GOLD }}>Less</Text>
          </Text>
          <Text style={styles.tagline}>{shop.name}</Text>
        </View>
        <Pressable style={styles.avatar} onPress={() => router.navigate('/(owner)/(tabs)/settings')}>
          <Text style={styles.avatarText}>S</Text>
        </Pressable>
      </View>

      {/* OPEN / CLOSED */}
      <View style={styles.rowBetween}>
        <View style={styles.rowLeft}>
          <View style={[styles.pill, { backgroundColor: shop.isOpen ? '#12301F' : '#3A1517' }]}>
            <Text style={[styles.pillText, { color: shop.isOpen ? '#4ADE80' : '#F87171' }]}>
              {shop.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
          <Text style={styles.muted}>{shop.hours}</Text>
        </View>
        <Pressable
          style={styles.toggleButton}
          onPress={() => updateShop(shop.id, { isOpen: !shop.isOpen })}
        >
          <Text style={styles.toggleText}>{shop.isOpen ? 'Close shop' : 'Open shop'}</Text>
        </Pressable>
      </View>

      {/* STAT CARDS */}
      <View style={styles.statGrid}>
        <StatCard value={String(todayCount)} label="Today" color={GOLD} />
        <StatCard value={String(countStatus('Pending'))} label="Pending" color="#FFFFFF" />
        <StatCard value={String(countStatus('Completed'))} label="Completed" color="#4ADE80" />
        <StatCard value={String(countStatus('Cancelled'))} label="Cancelled" color="#F87171" />
        <StatCard value={String(activeQueue)} label="Active queue" color={GOLD} />
        <StatCard value={`★ ${formatRating(rating.average)}`} label="Rating" color={GOLD} />
      </View>

      {/* WEEKLY CHART */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>This week</Text>
        <View style={styles.chartRow}>
          {week.map((w, i) => (
            <View key={i} style={styles.barColumn}>
              <View style={[styles.bar, { height: 14 + (w.value / maxValue) * 70 }]} />
              <Text style={styles.barLabel}>{w.letter}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* RECENT BOOKINGS */}
      <Text style={styles.sectionTitle}>Recent bookings</Text>
      {recent.length === 0 ? (
        <Text style={[styles.muted, { marginTop: 10 }]}>No bookings yet.</Text>
      ) : (
        recent.map((b) => {
          const pill = statusColors(b.status);
          return (
            <View key={b.id} style={styles.recentCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.recentName}>{b.customerName}</Text>
                <View style={[styles.pill, { backgroundColor: pill.bg }]}>
                  <Text style={[styles.pillText, { color: pill.fg }]}>{b.status}</Text>
                </View>
              </View>
              <Text style={styles.muted}>
                {b.serviceName} · {formatDate(b.date)} · {b.time} · {b.reference}
              </Text>
            </View>
          );
        })
      )}

      <View style={{ height: 20 }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  logo: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  tagline: { color: MUTED, fontSize: 11 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#2E2710', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: GOLD, fontWeight: '700' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  muted: { color: MUTED, fontSize: 11 },
  pill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  pillText: { fontSize: 10, fontWeight: '600' },
  toggleButton: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9 },
  toggleText: { color: '#FFFFFF', fontSize: 12 },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  statCard: { width: '31.5%', backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 14, padding: 12 },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { color: MUTED, fontSize: 11, marginTop: 2 },
  chartCard: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 14 },
  chartTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginBottom: 12 },
  chartRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 110 },
  barColumn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  bar: { width: 26, backgroundColor: GOLD, borderRadius: 6 },
  barLabel: { color: MUTED, fontSize: 10 },
  sectionTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', marginTop: 18 },
  recentCard: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 14, padding: 12, marginTop: 10, gap: 6 },
  recentName: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});