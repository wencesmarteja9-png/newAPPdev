import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useStore } from '@/repositories/store';
import { formatDate, statusColors } from '@/utils/format';

const GOLD = '#D4AF37';
const CARD = '#181818';
const BORDER = '#2A2A2A';
const MUTED = '#A3A3A3';

export default function Confirmation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { bookings, shops } = useStore();

  const booking = bookings.find((b) => b.id === id);
  const shop = shops.find((s) => s.id === booking?.shopId);

  if (!booking) {
    return (
      <View style={styles.screen}>
        <Text style={styles.muted}>Booking not found.</Text>
      </View>
    );
  }

  const pill = statusColors(booking.status);

  return (
    <View style={styles.screen}>
      <View style={styles.check}>
        <Text style={styles.checkMark}>✓</Text>
      </View>
      <Text style={styles.title}>Booking submitted!</Text>

      <View style={styles.card}>
        <Row label="Reference" value={booking.reference} gold />
        <Row label="Shop" value={shop?.name ?? ''} />
        <Row label="Service" value={booking.serviceName} />
        <Row label="Barber" value={booking.barberName} />
        <Row label="When" value={`${formatDate(booking.date)} · ${booking.time}`} />
        <View style={styles.row}>
          <Text style={styles.muted}>Status</Text>
          <View style={[styles.pill, { backgroundColor: pill.bg }]}>
            <Text style={[styles.pillText, { color: pill.fg }]}>{booking.status}</Text>
          </View>
        </View>
      </View>

      <Pressable
        style={styles.primary}
        onPress={() => router.push({ pathname: '/(customer)/receipt', params: { id: booking.id } })}
      >
        <Text style={styles.primaryText}>View Digital Receipt</Text>
      </Pressable>

      <Pressable
        style={styles.outline}
        onPress={() => router.navigate('/(customer)/(tabs)/bookings')}
      >
        <Text style={styles.outlineText}>My Bookings</Text>
      </Pressable>
    </View>
  );
}

function Row({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={[styles.value, gold && { color: GOLD, fontWeight: '700' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0D0D0D', padding: 20, justifyContent: 'center', gap: 14 },
  check: { alignSelf: 'center', width: 64, height: 64, borderRadius: 32, backgroundColor: '#12301F', alignItems: 'center', justifyContent: 'center' },
  checkMark: { color: '#4ADE80', fontSize: 28 },
  title: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  card: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 16, padding: 14, gap: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  muted: { color: MUTED, fontSize: 12 },
  value: { color: '#FFFFFF', fontSize: 12 },
  pill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  pillText: { fontSize: 10, fontWeight: '600' },
  primary: { backgroundColor: GOLD, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#0D0D0D', fontSize: 14, fontWeight: '700' },
  outline: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  outlineText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});