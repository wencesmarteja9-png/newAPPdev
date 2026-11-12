import { Pressable, StyleSheet, Text, View } from 'react-native';

import ScreenContainer from '@/components/ui/screen-container';
import { OWNER_SHOP_ID, isoDate } from '@/repositories/mock-data';
import { useStore } from '@/repositories/store';
import type { Booking } from '@/types';

const GOLD = '#D4AF37';
const CARD = '#181818';
const BORDER = '#2A2A2A';
const MUTED = '#A3A3A3';

function refNumber(b: Booking): number {
  return parseInt(b.reference.replace('QL-', ''), 10) || 0;
}

export default function OwnerQueue() {
  const { bookings, setBookingStatus } = useStore();
  const today = isoDate(0);

  // Today's Checked In and In Progress bookings; the customer being served goes first
  const queue = bookings
    .filter(
      (b) =>
        b.shopId === OWNER_SHOP_ID &&
        b.date === today &&
        ['Checked In', 'In Progress'].includes(b.status),
    )
    .sort((a, b) => {
      if (a.status === b.status) return refNumber(a) - refNumber(b);
      return a.status === 'In Progress' ? -1 : 1;
    });

  const serving = queue.find((b) => b.status === 'In Progress');
  const nextUp = queue.find((b) => b.status === 'Checked In');
  const canCallNext = !serving && !!nextUp;

  return (
    <ScreenContainer>
      <Text style={styles.title}>Queue</Text>
      <Text style={styles.muted}>{queue.length} in queue today</Text>

      {queue.length === 0 ? (
        <Text style={styles.empty}>Nobody is in the queue.</Text>
      ) : (
        queue.map((b, index) => {
          const isServing = b.id === serving?.id;
          return (
            <View key={b.id} style={[styles.card, isServing && styles.cardServing]}>
              <View style={[styles.number, isServing && styles.numberServing]}>
                <Text style={[styles.numberText, isServing && { color: '#0D0D0D' }]}>
                  {index + 1}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{b.customerName}</Text>
                <Text style={styles.meta}>
                  {b.serviceName} · {b.reference}
                </Text>
              </View>
              {isServing ? (
                <View style={styles.servingPill}>
                  <Text style={styles.servingText}>Now serving</Text>
                </View>
              ) : (
                <Text style={styles.position}>#{index + 1}</Text>
              )}
            </View>
          );
        })
      )}

      <View style={styles.buttonRow}>
        <Pressable
          disabled={!serving}
          onPress={() => serving && setBookingStatus(serving.id, 'Completed')}
          style={[styles.servedButton, !serving && styles.disabled]}
        >
          <Text style={[styles.buttonText, { color: '#4ADE80' }]}>Mark as Served</Text>
        </Pressable>
        <Pressable
          disabled={!serving}
          onPress={() => serving && setBookingStatus(serving.id, 'No-Show')}
          style={[styles.noShowButton, !serving && styles.disabled]}
        >
          <Text style={[styles.buttonText, { color: '#F87171' }]}>No-Show</Text>
        </Pressable>
      </View>

      <Pressable
        disabled={!canCallNext}
        onPress={() => nextUp && setBookingStatus(nextUp.id, 'In Progress')}
        style={[styles.callNext, !canCallNext && styles.callNextDisabled]}
      >
        <Text style={styles.callNextText}>Call Next</Text>
      </Pressable>

      <View style={{ height: 100 }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  muted: { color: MUTED, fontSize: 12, marginTop: 2, marginBottom: 6 },
  empty: { color: MUTED, textAlign: 'center', marginTop: 30 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 14, padding: 12, marginTop: 10 },
  cardServing: { borderColor: GOLD },
  number: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#2E2710', alignItems: 'center', justifyContent: 'center' },
  numberServing: { backgroundColor: GOLD },
  numberText: { color: GOLD, fontSize: 13, fontWeight: '700' },
  name: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  meta: { color: MUTED, fontSize: 11, marginTop: 2 },
  servingPill: { backgroundColor: '#2E2710', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  servingText: { color: GOLD, fontSize: 10, fontWeight: '700' },
  position: { color: MUTED, fontSize: 11 },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  servedButton: { flex: 1, backgroundColor: '#12301F', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  noShowButton: { flex: 1, backgroundColor: '#3A1517', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  buttonText: { fontSize: 13, fontWeight: '700' },
  disabled: { opacity: 0.4 },
  callNext: { backgroundColor: GOLD, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  callNextDisabled: { opacity: 0.4 },
  callNextText: { color: '#0D0D0D', fontSize: 16, fontWeight: '800' },
});