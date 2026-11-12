import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStore } from '@/repositories/store';
import { formatDate, statusColors } from '@/utils/format';

const GOLD = '#D4AF37';
const CARD = '#181818';
const BORDER = '#2A2A2A';
const MUTED = '#A3A3A3';

export default function Receipt() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { bookings, shops } = useStore();

  const booking = bookings.find((b) => b.id === id);
  const shop = shops.find((s) => s.id === booking?.shopId);

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Digital Receipt</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!booking ? (
          <Text style={styles.muted}>Receipt not found.</Text>
        ) : (
          <View style={styles.card}>
            <Text style={styles.logo}>
              Que<Text style={{ color: GOLD }}>Less</Text>
            </Text>

            <View style={styles.divider} />

            <Row label="Reference" value={booking.reference} />
            <Row label="Customer" value={booking.customerName} />
            <Row label="Establishment" value={shop?.name ?? ''} />
            <Row label="Service" value={booking.serviceName} />
            <Row label="Barber" value={booking.barberName} />
            <Row label="Date" value={formatDate(booking.date)} />
            <Row label="Time" value={booking.time} />
            <View style={styles.row}>
              <Text style={styles.muted}>Status</Text>
              <View style={[styles.pill, { backgroundColor: statusColors(booking.status).bg }]}>
                <Text style={[styles.pillText, { color: statusColors(booking.status).fg }]}>
                  {booking.status}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₱{booking.price}</Text>
            </View>
            <Text style={styles.note}>Pay at the shop. Thank you!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0D0D0D' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 18, paddingBottom: 10 },
  back: { color: '#FFFFFF', fontSize: 24 },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  content: { padding: 18 },
  card: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 16, padding: 16, gap: 10 },
  logo: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', textAlign: 'center' },
  divider: { height: 1, backgroundColor: BORDER, marginVertical: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  muted: { color: MUTED, fontSize: 12 },
  value: { color: '#FFFFFF', fontSize: 12 },
  pill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  pillText: { fontSize: 10, fontWeight: '600' },
  totalLabel: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  totalValue: { color: GOLD, fontSize: 22, fontWeight: '800' },
  note: { color: MUTED, fontSize: 12, textAlign: 'center', marginTop: 4 },
});