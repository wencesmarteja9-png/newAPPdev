import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TIME_SLOTS, isoDate } from '@/repositories/mock-data';
import { useStore } from '@/repositories/store';
import { formatDate } from '@/utils/format';

const GOLD = '#D4AF37';
const CARD = '#181818';
const BORDER = '#2A2A2A';
const MUTED = '#A3A3A3';

type Option = { id: string; label: string };

function Dropdown({
  selectedId,
  options,
  onSelect,
}: {
  selectedId: string | undefined;
  options: Option[];
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.id === selectedId);

  return (
    <View>
      <Pressable style={styles.dropdown} onPress={() => setOpen(!open)}>
        <Text style={styles.dropdownText}>{current?.label ?? 'Select'}</Text>
        <Text style={styles.chevron}>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open && (
        <View style={styles.options}>
          {options.map((o) => (
            <Pressable
              key={o.id}
              style={styles.option}
              onPress={() => {
                onSelect(o.id);
                setOpen(false);
              }}
            >
              <Text style={[styles.optionText, o.id === selectedId && { color: GOLD }]}>
                {o.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export default function BookingForm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    shopId,
    serviceIds: serviceParam,
    barberId: barberParam,
  } = useLocalSearchParams<{
    shopId: string;
    serviceIds?: string;
    barberId?: string;
  }>();
  const { shops, isSlotAvailable, createBooking } = useStore();

  const shop = shops.find((s) => s.id === shopId);

  const [serviceIds, setServiceIds] = useState<string[]>(
    serviceParam ? serviceParam.split(',').filter(Boolean) : [],
  );
  const [barberId, setBarberId] = useState<string | undefined>(barberParam);
  const [date, setDate] = useState(isoDate(0));
  const [time, setTime] = useState<string | null>(null);

  if (!shop) {
    return (
      <View style={[styles.screen, { padding: 20, paddingTop: insets.top + 20 }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.muted}>Shop not found.</Text>
      </View>
    );
  }

  const chosen = shop.services.filter((s) => serviceIds.includes(s.id));
  const total = chosen.reduce((sum, s) => sum + s.price, 0);
  const minutes = chosen.reduce((sum, s) => sum + s.minutes, 0);
  const barber = shop.barbers.find((b) => b.id === barberId) ?? shop.barbers[0];
  const dates = Array.from({ length: 7 }, (_, i) => isoDate(i));
  const canConfirm = chosen.length > 0 && !!barber && !!time;

  const toggleService = (sid: string) => {
    setServiceIds((prev) => (prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]));
  };

  const handleConfirm = () => {
    if (chosen.length === 0 || !barber || !time) return;
    const booking = createBooking({
      shopId: shop.id,
      serviceIds: chosen.map((s) => s.id),
      barberId: barber.id,
      date,
      time,
    });
    if (!booking) {
      Alert.alert('Slot unavailable', 'That time was just taken. Please pick another.');
      setTime(null);
      return;
    }
    router.replace({ pathname: '/(customer)/confirmation', params: { id: booking.id } });
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Book Appointment</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 30 }]}>
        {/* SHOP CARD */}
        <View style={styles.shopCard}>
          <View style={styles.shopImage}>
            <Text style={styles.shopImageText}>{shop.name.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.shopName}>{shop.name}</Text>
            <Text style={styles.muted}>{shop.address}</Text>
          </View>
        </View>

        {/* SERVICES */}
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Services</Text>
          <View style={styles.linkRow}>
            <Pressable onPress={() => setServiceIds(shop.services.map((s) => s.id))} hitSlop={8}>
              <Text style={styles.link}>Select all</Text>
            </Pressable>
            <Text style={styles.muted}> · </Text>
            <Pressable onPress={() => setServiceIds([])} hitSlop={8}>
              <Text style={styles.link}>Clear</Text>
            </Pressable>
          </View>
        </View>
        {shop.services.map((s) => {
          const active = serviceIds.includes(s.id);
          return (
            <Pressable
              key={s.id}
              onPress={() => toggleService(s.id)}
              style={[styles.serviceRow, active && styles.serviceRowActive]}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.checkbox, active && styles.checkboxActive]}>
                  {active && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <View>
                  <Text style={styles.serviceName}>{s.name}</Text>
                  <Text style={styles.muted}>{s.minutes} min</Text>
                </View>
              </View>
              <Text style={styles.price}>₱{s.price}</Text>
            </Pressable>
          );
        })}

        {/* BARBER */}
        <Text style={styles.label}>Barber</Text>
        <Dropdown
          selectedId={barber?.id}
          options={shop.barbers.map((b) => ({ id: b.id, label: b.name }))}
          onSelect={setBarberId}
        />

        {/* DATE */}
        <Text style={styles.label}>Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
          {dates.map((d) => {
            const active = d === date;
            const [weekday] = formatDate(d).split(', ');
            return (
              <Pressable
                key={d}
                onPress={() => {
                  setDate(d);
                  setTime(null);
                }}
                style={[styles.dateChip, active && styles.dateChipActive]}
              >
                <Text style={[styles.dateDay, active && styles.dateTextActive]}>{weekday}</Text>
                <Text style={[styles.dateNum, active && styles.dateTextActive]}>
                  {Number(d.split('-')[2])}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* TIME */}
        <Text style={styles.label}>Time</Text>
        <View style={styles.slotGrid}>
          {TIME_SLOTS.map((slot) => {
            const available = isSlotAvailable(shop.id, date, slot);
            const selected = time === slot;
            return (
              <Pressable
                key={slot}
                disabled={!available}
                onPress={() => setTime(slot)}
                style={[
                  styles.slot,
                  available ? styles.slotFree : styles.slotTaken,
                  selected && styles.slotSelected,
                ]}
              >
                <Text
                  style={[
                    styles.slotText,
                    { color: available ? '#4ADE80' : '#F87171' },
                    selected && { color: '#0D0D0D', fontWeight: '700' },
                  ]}
                >
                  {slot}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* LEGEND */}
        <View style={styles.legend}>
          <Text style={[styles.legendText, { color: '#4ADE80' }]}>● Available</Text>
          <Text style={[styles.legendText, { color: '#F87171' }]}>● Unavailable</Text>
          <Text style={[styles.legendText, { color: GOLD }]}>● Selected</Text>
        </View>

        {/* SUMMARY */}
        <View style={styles.summary}>
          <SummaryRow
            label="Services"
            value={chosen.length > 0 ? chosen.map((s) => s.name).join(', ') : '—'}
          />
          <SummaryRow label="Barber" value={barber?.name ?? '—'} />
          <SummaryRow label="When" value={time ? `${formatDate(date)} · ${time}` : '—'} />
          <SummaryRow label="Duration" value={minutes > 0 ? `${minutes} min` : '—'} />
          <SummaryRow label="Total" value={chosen.length > 0 ? `₱${total}` : '—'} gold />
        </View>

        <Pressable
          disabled={!canConfirm}
          onPress={handleConfirm}
          style={[styles.confirm, !canConfirm && { opacity: 0.4 }]}
        >
          <Text style={styles.confirmText}>Confirm Booking</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function SummaryRow({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={[styles.summaryValue, gold && { color: GOLD, fontWeight: '700' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0D0D0D' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 18, paddingBottom: 10 },
  back: { color: '#FFFFFF', fontSize: 24 },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  content: { padding: 18, gap: 8 },
  muted: { color: MUTED, fontSize: 12 },
  label: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginTop: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  linkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  link: { color: GOLD, fontSize: 12, fontWeight: '600' },
  shopCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 16, padding: 12 },
  shopImage: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#262626', alignItems: 'center', justifyContent: 'center' },
  shopImageText: { color: GOLD, fontSize: 18, fontWeight: '800' },
  shopName: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  serviceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 12, padding: 12 },
  serviceRowActive: { borderColor: GOLD, backgroundColor: '#2E2710' },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: MUTED, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: GOLD, borderColor: GOLD },
  checkMark: { color: '#0D0D0D', fontSize: 14, fontWeight: '800' },
  serviceName: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  price: { color: GOLD, fontSize: 13, fontWeight: '700' },
  dropdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, height: 46 },
  dropdownText: { color: '#FFFFFF', fontSize: 13 },
  chevron: { color: MUTED, fontSize: 14 },
  options: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 12, marginTop: 6, overflow: 'hidden' },
  option: { paddingHorizontal: 14, paddingVertical: 12, borderBottomColor: BORDER, borderBottomWidth: 1 },
  optionText: { color: '#FFFFFF', fontSize: 13 },
  dateRow: { gap: 8, paddingVertical: 2 },
  dateChip: { width: 56, alignItems: 'center', backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 12, paddingVertical: 10 },
  dateChipActive: { backgroundColor: GOLD, borderColor: GOLD },
  dateDay: { color: MUTED, fontSize: 11 },
  dateNum: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginTop: 2 },
  dateTextActive: { color: '#0D0D0D' },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: { width: '31.5%', borderRadius: 10, paddingVertical: 12, alignItems: 'center', borderWidth: 1 },
  slotFree: { backgroundColor: '#12301F', borderColor: '#1F5A36' },
  slotTaken: { backgroundColor: '#3A1517', borderColor: '#5A2326' },
  slotSelected: { backgroundColor: GOLD, borderColor: GOLD },
  slotText: { fontSize: 12 },
  legend: { flexDirection: 'row', gap: 16, marginTop: 4 },
  legendText: { fontSize: 11 },
  summary: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 14, padding: 14, gap: 8, marginTop: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
  summaryValue: { color: '#FFFFFF', fontSize: 12, flexShrink: 1, textAlign: 'right' },
  confirm: { backgroundColor: GOLD, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  confirmText: { color: '#0D0D0D', fontSize: 14, fontWeight: '700' },
});