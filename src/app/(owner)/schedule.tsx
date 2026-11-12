import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import SubScreen from '@/components/ui/sub-screen';
import { OWNER_SHOP_ID, TIME_SLOTS } from '@/repositories/mock-data';
import { useStore } from '@/repositories/store';

const GOLD = '#D4AF37';
const CARD = '#181818';
const BORDER = '#2A2A2A';
const MUTED = '#A3A3A3';

export default function ScheduleScreen() {
  const { shops, updateShop } = useStore();
  const shop = shops.find((s) => s.id === OWNER_SHOP_ID);

  const [capacity, setCapacity] = useState(String(shop?.capacity ?? 1));
  const [blocked, setBlocked] = useState<string[]>(shop?.blockedSlots ?? []);

  if (!shop) return null;

  const [opens, closes] = shop.hours.split(' – ');

  const toggle = (slot: string) =>
    setBlocked((prev) => (prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]));

  const save = () => {
    const value = Math.min(10, Math.max(1, Number(capacity.replace(/[^0-9]/g, '')) || 1));
    setCapacity(String(value));
    updateShop(shop.id, { capacity: value, blockedSlots: blocked });
    Alert.alert('Saved');
  };

  return (
    <SubScreen title="Schedule">
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Opens</Text>
          <View style={styles.readonly}>
            <Text style={styles.readonlyText}>{opens}</Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Closes</Text>
          <View style={styles.readonly}>
            <Text style={styles.readonlyText}>{closes}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.note}>Opens and Closes are display only in this prototype.</Text>

      <Text style={styles.label}>Customers per time slot</Text>
      <TextInput
        value={capacity}
        onChangeText={setCapacity}
        keyboardType="number-pad"
        style={styles.input}
      />

      <Text style={styles.heading}>Tap to block / unblock</Text>
      <View style={styles.grid}>
        {TIME_SLOTS.map((slot) => {
          const isBlocked = blocked.includes(slot);
          return (
            <Pressable
              key={slot}
              onPress={() => toggle(slot)}
              style={[styles.slot, isBlocked && styles.slotBlocked]}
            >
              <Text style={[styles.slotText, isBlocked && { color: '#F87171' }]}>{slot}</Text>
            </Pressable>
          );
        })}
      </View>

      {blocked.length > 0 && <Text style={styles.note}>Red = blocked (tap Unblock below)</Text>}
      {TIME_SLOTS.filter((s) => blocked.includes(s)).map((slot) => (
        <Pressable key={slot} style={styles.unblock} onPress={() => toggle(slot)}>
          <Text style={styles.unblockText}>Unblock {slot}</Text>
        </Pressable>
      ))}

      <Pressable style={styles.save} onPress={save}>
        <Text style={styles.saveText}>Save schedule</Text>
      </Pressable>
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  label: { color: MUTED, fontSize: 12, marginTop: 8, marginBottom: 4 },
  readonly: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 12, height: 46, justifyContent: 'center', paddingHorizontal: 14 },
  readonlyText: { color: '#FFFFFF', fontSize: 13 },
  note: { color: MUTED, fontSize: 11, marginTop: 4 },
  input: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 12, color: '#FFFFFF', paddingHorizontal: 14, height: 46 },
  heading: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginTop: 16, marginBottom: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: { width: '31.5%', backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  slotBlocked: { backgroundColor: '#3A1517', borderColor: '#5A2326' },
  slotText: { color: '#FFFFFF', fontSize: 12 },
  unblock: { backgroundColor: '#3A1517', borderRadius: 12, height: 44, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  unblockText: { color: '#F87171', fontSize: 13 },
  save: { backgroundColor: GOLD, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  saveText: { color: '#0D0D0D', fontSize: 14, fontWeight: '700' },
});