import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStore } from '@/repositories/store';
import { formatRating, stars } from '@/utils/format';

const GOLD = '#D4AF37';
const CARD = '#181818';
const BORDER = '#2A2A2A';
const MUTED = '#A3A3A3';

export default function ShopDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { shops, reviews, favorites, toggleFavorite, getShopRating, getBarberRating } = useStore();
  const [serviceId, setServiceId] = useState<string | null>(null);

  const shop = shops.find((s) => s.id === id);

  if (!shop) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 20, padding: 20 }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.muted}>Shop not found.</Text>
      </View>
    );
  }

  const selected = shop.services.find((s) => s.id === serviceId) ?? shop.services[0];
  const rating = getShopRating(shop.id);
  const shopReviews = reviews.filter((r) => r.shopId === shop.id).slice(0, 3);
  const isFavorite = favorites.includes(shop.id);
  const canBook = shop.isOpen && !!selected;

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {shop.name}
        </Text>
        <Pressable onPress={() => toggleFavorite(shop.id)} hitSlop={10}>
          <Text style={styles.star}>{isFavorite ? '★' : '☆'}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.cover}>
          <Text style={styles.coverText}>{shop.name.charAt(0)}</Text>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.muted}>
            {shop.category} · <Text style={{ color: GOLD }}>★ {formatRating(rating.average)}</Text> (
            {rating.count})
          </Text>
          <View style={[styles.pill, { backgroundColor: shop.isOpen ? '#12301F' : '#3A1517' }]}>
            <Text style={[styles.pillText, { color: shop.isOpen ? '#4ADE80' : '#F87171' }]}>
              {shop.isOpen ? 'Available now' : 'Closed'}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{shop.description}</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoLine}>📍 {shop.address}</Text>
          <Text style={styles.infoLine}>📞 {shop.phone}</Text>
          <Text style={styles.infoLine}>🕒 {shop.hours}</Text>
        </View>

        {/* SERVICES */}
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Services</Text>
          <Text style={styles.tiny}>Tap to choose one</Text>
        </View>
        {shop.services.map((service) => {
          const active = selected?.id === service.id;
          return (
            <Pressable
              key={service.id}
              onPress={() => setServiceId(service.id)}
              style={[styles.serviceCard, active && styles.serviceActive]}
            >
              <View>
                <Text style={styles.serviceName}>
                  {active ? '✓ ' : ''}
                  {service.name}
                </Text>
                <Text style={styles.tiny}>{service.minutes} min</Text>
              </View>
              <Text style={styles.price}>₱{service.price}</Text>
            </Pressable>
          );
        })}

        {/* BARBERS */}
        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Barbers</Text>
        {shop.barbers.map((barber) => {
          const r = getBarberRating(shop.id, barber.id);
          return (
            <View key={barber.id} style={styles.barberCard}>
              <Text style={styles.serviceName}>{barber.name}</Text>
              <Text style={styles.muted}>
                <Text style={{ color: GOLD }}>★ {formatRating(r.average)}</Text> · {r.count}
              </Text>
            </View>
          );
        })}

        {/* REVIEWS */}
        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Reviews</Text>
        {shopReviews.length === 0 ? (
          <Text style={styles.muted}>No reviews yet.</Text>
        ) : (
          shopReviews.map((r) => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.serviceName}>{r.customerName}</Text>
                <Text style={{ color: GOLD }}>{stars(r.shopRating)}</Text>
              </View>
              <Text style={styles.tiny}>
                Barber {r.barberName} <Text style={{ color: GOLD }}>{stars(r.barberRating)}</Text>
              </Text>
              {r.comment ? <Text style={styles.comment}>{r.comment}</Text> : null}
            </View>
          ))
        )}
      </ScrollView>

      {/* FIXED BOOK BUTTON */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          disabled={!canBook}
          onPress={() =>
            router.push({
              pathname: '/(customer)/booking-form',
              params: { shopId: shop.id, serviceId: selected.id },
            })
          }
          style={[styles.bookButton, !canBook && styles.bookDisabled]}
        >
          <Text style={styles.bookText}>
            {!shop.isOpen
              ? 'Currently unavailable'
              : selected
                ? `Book: ${selected.name} · ₱${selected.price}`
                : 'No services available'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0D0D0D' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 10,
    gap: 12,
  },
  back: { color: '#FFFFFF', fontSize: 24 },
  headerTitle: { flex: 1, color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  star: { color: GOLD, fontSize: 24 },
  content: { padding: 18, paddingBottom: 130, gap: 10 },
  cover: {
    height: 150,
    borderRadius: 16,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverText: { color: GOLD, fontSize: 56, fontWeight: '800' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  muted: { color: MUTED, fontSize: 12 },
  tiny: { color: MUTED, fontSize: 11 },
  description: { color: '#FFFFFF', fontSize: 13 },
  pill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  pillText: { fontSize: 10, fontWeight: '600' },
  infoCard: {
    backgroundColor: CARD,
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 6,
  },
  infoLine: { color: MUTED, fontSize: 12 },
  sectionTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: CARD,
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  serviceActive: { borderColor: GOLD, backgroundColor: '#2E2710' },
  serviceName: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  price: { color: GOLD, fontSize: 14, fontWeight: '700' },
  barberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: CARD,
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  reviewCard: {
    backgroundColor: CARD,
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  comment: { color: '#FFFFFF', fontSize: 12, marginTop: 2 },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 12,
    backgroundColor: '#0D0D0D',
    borderTopColor: BORDER,
    borderTopWidth: 1,
  },
  bookButton: {
    backgroundColor: GOLD,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookDisabled: { opacity: 0.4 },
  bookText: { color: '#0D0D0D', fontSize: 14, fontWeight: '700' },
});