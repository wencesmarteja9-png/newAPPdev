import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import ScreenContainer from '@/components/ui/screen-container';
import { OWNER_SHOP_ID } from '@/repositories/mock-data';
import { useStore } from '@/repositories/store';
import type { Booking, BookingStatus } from '@/types';
import { formatDate, statusColors } from '@/utils/format';

const GOLD = '#D4AF37';
const CARD = '#181818';
const BORDER = '#2A2A2A';
const MUTED = '#A3A3A3';

const FILTERS = [
  'All',
  'Pending',
  'Confirmed',
  'Checked In',
  'In Progress',
  'Completed',
  'Cancelled',
  'No-Show',
] as const;
type Filter = (typeof FILTERS)[number];

type Action = { label: string; next: BookingStatus; danger?: boolean };

// Pending -> Confirm, Confirmed -> Check In, Checked In -> In Progress, In Progress -> Completed.
// No-Show is offered while Pending, Confirmed or Checked In.
function actionsFor(status: BookingStatus): Action[] {
  switch (status) {
    case 'Pending':
      return [
        { label: 'Confirm', next: 'Confirmed' },
        { label: 'No-Show', next: 'No-Show', danger: true },
      ];
    case 'Confirmed':
      return [
        { label: 'Check In', next: 'Checked In' },
        { label: 'No-Show', next: 'No-Show', danger: true },
      ];
    case 'Checked In':
      return [
        { label: 'In Progress', next: 'In Progress' },
        { label: 'No-Show', next: 'No-Show', danger: true },
      ];
    case 'In Progress':
      return [{ label: 'Completed', next: 'Completed' }];
    default:
      return [];
  }
}

function refNumber(b: Booking): number {
  return parseInt(b.reference.replace('QL-', ''), 10) || 0;
}

export default function OwnerBookings() {
  const { bookings, setBookingStatus } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const showMessage = (text: string) => {
    setMessage(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 2000);
  };

  const query = search.trim().toLowerCase();
  const list = bookings
    .filter((b) => b.shopId === OWNER_SHOP_ID)
    .filter((b) => filter === 'All' || b.status === filter)
    .filter(
      (b) =>
        !query ||
        b.customerName.toLowerCase().includes(query) ||
        b.reference.toLowerCase().includes(query),
    )
    .sort((a, b) => refNumber(a) - refNumber(b));

  const apply = (booking: Booking, action: Action) => {
    setBookingStatus(booking.id, action.next);
    showMessage(`${booking.reference} · ${booking.customerName}: ${action.next}`);
  };

  return (
    <View style={styles.screen}>
      <ScreenContainer>
        <Text style={styles.title}>Bookings</Text>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search customers"
          placeholderTextColor={MUTED}
          style={styles.search}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {FILTERS.map((item) => {
            const active = filter === item;
            return (
              <Pressable
                key={item}
                onPress={() => setFilter(item)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {list.length === 0 ? (
          <Text style={styles.empty}>No bookings found.</Text>
        ) : (
          list.map((b) => {
            const pill = statusColors(b.status);
            const actions = actionsFor(b.status);
            return (
              <View key={b.id} style={styles.card}>
                <View style={styles.rowBetween}>
                  <Text style={styles.name}>{b.customerName}</Text>
                  <View style={[styles.pill, { backgroundColor: pill.bg }]}>
                    <Text style={[styles.pillText, { color: pill.fg }]}>{b.status}</Text>
                  </View>
                </View>
                <Text style={styles.meta}>
                  {b.serviceName} · {formatDate(b.date)} · {b.time} · {b.reference}
                </Text>

                {actions.length > 0 && (
                  <View style={styles.buttonRow}>
                    {actions.map((a) => (
                      <Pressable
                        key={a.label}
                        onPress={() => apply(b, a)}
                        style={[styles.action, a.danger ? styles.actionDanger : styles.actionOk]}
                      >
                        <Text
                          style={[styles.actionText, { color: a.danger ? '#F87171' : '#4ADE80' }]}
                        >
                          {a.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            );
          })
        )}

        <View style={{ height: 100 }} />
      </ScreenContainer>

      {message && (
        <View style={styles.toast} pointerEvents="none">
          <Text style={styles.toastText}>{message}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0D0D0D' },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginBottom: 14 },
  search: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 12, color: '#FFFFFF', paddingHorizontal: 14, height: 46, marginBottom: 12 },
  chipRow: { gap: 8, paddingBottom: 4 },
  chip: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  chipActive: { backgroundColor: GOLD, borderColor: GOLD },
  chipText: { color: '#FFFFFF', fontSize: 12 },
  chipTextActive: { color: '#0D0D0D', fontWeight: '700' },
  empty: { color: MUTED, textAlign: 'center', marginTop: 30 },
  card: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 12, gap: 6 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  meta: { color: MUTED, fontSize: 11 },
  pill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  pillText: { fontSize: 10, fontWeight: '600' },
  buttonRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  action: { borderRadius: 10, paddingHorizontal: 16, paddingVertical: 9 },
  actionOk: { backgroundColor: '#12301F' },
  actionDanger: { backgroundColor: '#3A1517' },
  actionText: { fontSize: 12, fontWeight: '600' },
  toast: { position: 'absolute', left: 24, right: 24, bottom: 110, backgroundColor: '#FFFFFF', borderRadius: 999, paddingVertical: 10, alignItems: 'center' },
  toastText: { color: '#0D0D0D', fontSize: 12, fontWeight: '700' },
});