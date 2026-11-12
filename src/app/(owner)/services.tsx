import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import SubScreen from '@/components/ui/sub-screen';
import { OWNER_SHOP_ID } from '@/repositories/mock-data';
import { useStore } from '@/repositories/store';
import type { Service } from '@/types';

const GOLD = '#D4AF37';
const CARD = '#181818';
const BORDER = '#2A2A2A';
const MUTED = '#A3A3A3';

const toNumber = (text: string) => Number(text.replace(/[^0-9]/g, '')) || 0;

export default function ServicesScreen() {
  const { shops, updateShop } = useStore();
  const shop = shops.find((s) => s.id === OWNER_SHOP_ID);
  const [services, setServices] = useState<Service[]>(
    shop ? shop.services.map((s) => ({ ...s })) : [],
  );

  if (!shop) return null;

  const patch = (id: string, change: Partial<Service>) =>
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...change } : s)));

  const remove = (id: string) => setServices((prev) => prev.filter((s) => s.id !== id));

  const add = () =>
    setServices((prev) => [
      ...prev,
      { id: `s${Date.now()}`, name: 'New service', price: 200, minutes: 30 },
    ]);

  const save = () => {
    if (services.length === 0) {
      Alert.alert('Keep at least one service');
      return;
    }
    if (services.some((s) => !s.name.trim() || s.minutes <= 0)) {
      Alert.alert('Every service needs a name and a duration');
      return;
    }
    updateShop(shop.id, { services: services.map((s) => ({ ...s, name: s.name.trim() })) });
    Alert.alert('Saved');
  };

  return (
    <SubScreen title="Services">
      {services.map((s) => (
        <View key={s.id} style={styles.card}>
          <TextInput
            value={s.name}
            onChangeText={(t) => patch(s.id, { name: t })}
            style={styles.input}
            placeholder="Service name"
            placeholderTextColor={MUTED}
          />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Price ₱</Text>
              <TextInput
                value={String(s.price)}
                onChangeText={(t) => patch(s.id, { price: toNumber(t) })}
                keyboardType="number-pad"
                style={styles.input}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Minutes</Text>
              <TextInput
                value={String(s.minutes)}
                onChangeText={(t) => patch(s.id, { minutes: toNumber(t) })}
                keyboardType="number-pad"
                style={styles.input}
              />
            </View>
            <Pressable style={styles.delete} onPress={() => remove(s.id)}>
              <Text style={styles.deleteText}>✕</Text>
            </Pressable>
          </View>
        </View>
      ))}

      <Pressable style={styles.add} onPress={add}>
        <Text style={styles.addText}>+ Add service</Text>
      </Pressable>

      <Pressable style={styles.save} onPress={save}>
        <Text style={styles.saveText}>Save</Text>
      </Pressable>
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 16, padding: 12, gap: 8 },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  label: { color: MUTED, fontSize: 11, marginBottom: 4 },
  input: { backgroundColor: '#0D0D0D', borderColor: BORDER, borderWidth: 1, borderRadius: 10, color: '#FFFFFF', paddingHorizontal: 12, height: 44 },
  delete: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#3A1517', alignItems: 'center', justifyContent: 'center' },
  deleteText: { color: '#F87171', fontSize: 16 },
  add: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  addText: { color: '#FFFFFF', fontSize: 13 },
  save: { backgroundColor: GOLD, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  saveText: { color: '#0D0D0D', fontSize: 14, fontWeight: '700' },
});