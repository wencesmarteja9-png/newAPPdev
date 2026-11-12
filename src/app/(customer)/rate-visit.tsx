import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStore } from '@/repositories/store';
import { formatDate } from '@/utils/format';

const GOLD = '#D4AF37';
const CARD = '#181818';
const BORDER = '#2A2A2A';
const MUTED = '#A3A3A3';

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} onPress={() => onChange(n)} hitSlop={6}>
          <Text style={[styles.star, { color: n <= value ? GOLD : '#444444' }]}>★</Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function RateVisit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { bookings, shops, addReview } = useStore();

  const [shopRating, setShopRating] = useState(0);
  const [barberRating, setBarberRating] = useState(0);
  const [comment, setComment] = useState('');

  const booking = bookings.find((b) => b.id === id);
  const shop = shops.find((s) => s.id === booking?.shopId);

  const submit = () => {
    if (!booking) return;
    if (shopRating < 1 || barberRating < 1) {
      Alert.alert('Please rate both the shop and barber');
      return;
    }
    const ok = addReview({ bookingId: booking.id, shopRating, barberRating, comment });
    if (!ok) {
      Alert.alert('This booking cannot be rated.');
      return;
    }
    Alert.alert('Thanks for your review!', undefined, [{ text: 'OK', onPress: () => router.back() }]);
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Rate your visit</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {!booking || !shop ? (
          <Text style={styles.muted}>Booking not found.</Text>
        ) : (
          <>
            <View style={styles.shopCard}>
              <View style={styles.shopImage}>
                <Text style={styles.shopImageText}>{shop.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.shopName}>{shop.name}</Text>
                <Text style={styles.muted}>
                  {booking.serviceName} · {formatDate(booking.date)}
                </Text>
              </View>
            </View>

            <Text style={styles.label}>Rate the shop</Text>
            <StarPicker value={shopRating} onChange={setShopRating} />

            <Text style={styles.label}>Rate your barber ({booking.barberName})</Text>
            <StarPicker value={barberRating} onChange={setBarberRating} />

            <Text style={styles.muted}>Comment (optional)</Text>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="How was your visit?"
              placeholderTextColor={MUTED}
              multiline
              style={styles.input}
            />

            <Pressable style={styles.submit} onPress={submit}>
              <Text style={styles.submitText}>Submit review</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0D0D0D' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 18, paddingBottom: 10 },
  back: { color: '#FFFFFF', fontSize: 24 },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  content: { padding: 18, gap: 10 },
  muted: { color: MUTED, fontSize: 12 },
  label: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginTop: 10 },
  shopCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 16, padding: 12 },
  shopImage: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#262626', alignItems: 'center', justifyContent: 'center' },
  shopImageText: { color: GOLD, fontSize: 18, fontWeight: '800' },
  shopName: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  starRow: { flexDirection: 'row', gap: 10 },
  star: { fontSize: 34 },
  input: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 12, color: '#FFFFFF', padding: 12, minHeight: 80, textAlignVertical: 'top' },
  submit: { backgroundColor: GOLD, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  submitText: { color: '#0D0D0D', fontSize: 14, fontWeight: '700' },
});