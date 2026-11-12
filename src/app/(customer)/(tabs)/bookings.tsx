import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import ScreenContainer from '@/components/ui/screen-container';
import { isoDate } from '@/repositories/mock-data';
import { useStore } from '@/repositories/store';
import type { Booking } from '@/types';
import { formatDate, statusColors } from '@/utils/format';

const GOLD = '#D4AF37';
const CARD = '#181818';
const BORDER = '#2A2A2A';
const MUTED = '#A3A3A3';

const UPCOMING = ['Pending', 'Confirmed', 'Checked In', 'In Progress'];
const HISTORY = ['Completed', 'Cancelled', 'No-Show'];

export default function BookingsScreen() {
  const router = useRouter();
  const { userName, bookings, shops, setBookingStatus } = useStore();
  const [tab, setTab] = useState<'Upcoming' | 'History'>('Upcoming');

  const mine = bookings.filter((b) => b.customerName === userName);
  const list = mine.filter((b) => (tab === 'Upcoming' ? UPCOMING : HISTORY).includes(b.status));

  // Queue position for a checked-in booking (today's Checked In and In Progress, served first)
  const queueBanner = (booking: Booking): string | null => {
    if (booking.status === 'In Progress') return 'You are being served now';
    if (booking.status !== 'Checked In') return null;
    const queue = bookings
      .filter(
        (b) =>
          b.shopId === booking.shopId &&
          b.date === isoDate(0) &&
          ['Checked In', 'In Progress'].includes(b.status),
      )
      .sort((a, b) => (b.status === 'In Progress' ? 1 : 0) - (a.status === 'In Progress' ? 1 : 0));
    const index = queue.findIndex((b) => b.id === booking.id);
    if (index < 0) return null;
    return `Queue position #${index + 1} · ${index} ahead`;
  };

  const confirmCancel = (booking: Booking) => {
    Alert.alert('Cancel booking?', `${booking.reference} will be cancelled.`, [
      { text: 'Keep it', style: 'cancel' },
      { text: 'Cancel booking', style: 'destructive', onPress: () => setBookingStatus(booking.id, 'Cancelled') },
    ]);
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>My Bookings</Text>

      <View style={styles.toggleRow}>
        {(['Upcoming', 'History'] as const).map((item) => {
          const active = tab === item;
          return (
            <Pressable
              key={item}
              onPress={() => setTab(item)}
              style={[styles.toggle, active && styles.toggleActive]}
            >
              <Text style={[styles.toggleText, active && styles.toggleTextActive]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>

      {list.length === 0 ? (
        <Text style={styles.empty}>
          {tab === 'Upcoming' ? 'No upcoming bookings.' : 'No past bookings yet.'}
        </Text>
      ) : (
        list.map((booking) => {
          const shop = shops.find((s) => s.id === booking.shopId);
          const pill = statusColors(booking.status);
          const banner = queueBanner(booking);
          const canCancel = booking.status === 'Pending' || booking.status === 'Confirmed';

          return (
            <View key={booking.id} style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.shopName}>{shop?.name}</Text>
                <View style={[styles.pill, { backgroundColor: pill.bg }]}>
                  <Text style={[styles.pillText, { color: pill.fg }]}>{booking.status}</Text>
                </View>
              </View>

              <Text style={styles.meta}>
                {booking.serviceName} · {formatDate(booking.date)} · {booking.time} · {booking.reference}
              </Text>
              <Text style={styles.meta}>
                Barber {booking.barberName} · <Text style={{ color: GOLD }}>₱{booking.price}</Text>
              </Text>

              {banner && (
                <View style={styles.banner}>
                  <Text style={styles.bannerText}>{banner}</Text>
                </View>
              )}

              <View style={styles.buttonRow}>
                <Pressable
                  style={styles.outline}
                  onPress={() =>
                    router.push({ pathname: '/(customer)/receipt', params: { id: booking.id } })
                  }
                >
                  <Text style={styles.outlineText}>Receipt</Text>
                </Pressable>

                {canCancel && (
                  <Pressable style={styles.danger} onPress={() => confirmCancel(booking)}>
                    <Text style={styles.dangerText}>Cancel</Text>
                  </Pressable>
                )}

                {booking.status === 'Completed' &&
                  (booking.rated ? (
                    <View style={styles.ratedPill}>
                      <Text style={styles.ratedText}>Rated ✓</Text>
                    </View>
                  ) : (
                    <Pressable
                      style={styles.rate}
                      onPress={() =>
                        router.push({ pathname: '/(customer)/rate-visit', params: { id: booking.id } })
                      }
                    >
                      <Text style={styles.rateText}>Rate</Text>
                    </Pressable>
                  ))}
              </View>
            </View>
          );
        })
      )}

      <View style={{ height: 20 }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginBottom: 14 },
  toggleRow: { flexDirection: 'row', gap: 10, marginBottom: 6 },
  toggle: { flex: 1, backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  toggleActive: { backgroundColor: GOLD, borderColor: GOLD },
  toggleText: { color: '#FFFFFF', fontSize: 13 },
  toggleTextActive: { color: '#0D0D0D', fontWeight: '700' },
  empty: { color: MUTED, textAlign: 'center', marginTop: 30 },
  card: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 12, gap: 6 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  shopName: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', flexShrink: 1 },
  meta: { color: MUTED, fontSize: 11 },
  pill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  pillText: { fontSize: 10, fontWeight: '600' },
  banner: { backgroundColor: '#2E2710', borderRadius: 10, paddingVertical: 8, alignItems: 'center', marginTop: 4 },
  bannerText: { color: GOLD, fontSize: 11, fontWeight: '600' },
  buttonRow: { flexDirection: 'row', gap: 8, marginTop: 6, alignItems: 'center' },
  outline: { backgroundColor: '#0D0D0D', borderColor: BORDER, borderWidth: 1, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 9 },
  outlineText: { color: '#FFFFFF', fontSize: 12 },
  danger: { backgroundColor: '#3A1517', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 9 },
  dangerText: { color: '#F87171', fontSize: 12, fontWeight: '600' },
  rate: { backgroundColor: GOLD, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 9 },
  rateText: { color: '#0D0D0D', fontSize: 12, fontWeight: '700' },
  ratedPill: { backgroundColor: '#2E2710', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  ratedText: { color: GOLD, fontSize: 11, fontWeight: '600' },
});