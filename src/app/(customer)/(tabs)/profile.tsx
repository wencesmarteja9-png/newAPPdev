import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import ScreenContainer from '@/components/ui/screen-container';
import ShopCard from '@/components/ui/shop-card';
import { useStore } from '@/repositories/store';

const GOLD = '#D4AF37';
const CARD = '#181818';
const BORDER = '#2A2A2A';
const MUTED = '#A3A3A3';

export default function ProfileScreen() {
  const router = useRouter();
  const { userName, setUserName, shops, favorites, signOut } = useStore();
  const [name, setName] = useState(userName);

  const favoriteShops = shops.filter((s) => favorites.includes(s.id)).slice(0, 2);

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Please enter a display name');
      return;
    }
    setUserName(trimmed);
    Alert.alert('Saved');
  };

  const handleSignOut = () => {
    signOut();
    router.replace('/(auth)/login');
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
        </View>
        <View>
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.muted}>Customer</Text>
        </View>
      </View>

      <Text style={[styles.muted, { marginTop: 14 }]}>Display name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        placeholderTextColor={MUTED}
        style={styles.input}
      />
      <Pressable style={styles.saveButton} onPress={save}>
        <Text style={styles.saveText}>Save name</Text>
      </Pressable>
      <Text style={styles.note}>
        Bookings are linked to your display name, so changing it hides bookings made under the
        earlier name.
      </Text>

      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Favorites</Text>
        <Pressable onPress={() => router.push('/(customer)/favorites')}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>

      {favoriteShops.length === 0 ? (
        <Text style={[styles.muted, { marginTop: 10 }]}>No favorites saved yet.</Text>
      ) : (
        favoriteShops.map((shop) => <ShopCard key={shop.id} shop={shop} />)
      )}

      <Pressable style={styles.signOut} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>

      <View style={{ height: 20 }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginBottom: 14 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 16, padding: 14 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#2E2710', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: GOLD, fontSize: 18, fontWeight: '700' },
  name: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  muted: { color: MUTED, fontSize: 12 },
  input: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 12, color: '#FFFFFF', paddingHorizontal: 14, height: 46, marginTop: 6 },
  saveButton: { backgroundColor: GOLD, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  saveText: { color: '#0D0D0D', fontSize: 13, fontWeight: '700' },
  note: { color: MUTED, fontSize: 11, marginTop: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  sectionTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  seeAll: { color: GOLD, fontSize: 12 },
  signOut: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  signOutText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});