import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import SubScreen from '@/components/ui/sub-screen';
import { OWNER_SHOP_ID } from '@/repositories/mock-data';
import { useStore } from '@/repositories/store';

const GOLD = '#D4AF37';
const CARD = '#181818';
const BORDER = '#2A2A2A';
const MUTED = '#A3A3A3';

export default function EstablishmentScreen() {
  const { shops, updateShop } = useStore();
  const shop = shops.find((s) => s.id === OWNER_SHOP_ID);

  const [name, setName] = useState(shop?.name ?? '');
  const [address, setAddress] = useState(shop?.address ?? '');
  const [phone, setPhone] = useState(shop?.phone ?? '');
  const [description, setDescription] = useState(shop?.description ?? '');

  if (!shop) return null;

  const save = () => {
    if (!name.trim()) {
      Alert.alert('Please enter a shop name');
      return;
    }
    updateShop(shop.id, {
      name: name.trim(),
      address: address.trim(),
      phone: phone.trim(),
      description: description.trim(),
    });
    Alert.alert('Saved');
  };

  return (
    <SubScreen title="Establishment">
      <View style={styles.photoRow}>
        <View style={styles.photo}>
          <Text style={styles.photoText}>{name.charAt(0) || '?'}</Text>
        </View>
        <Text style={styles.muted}>Photo upload comes in the polish pass.</Text>
      </View>

      <Text style={styles.label}>Shop name</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} placeholderTextColor={MUTED} />

      <Text style={styles.label}>Address</Text>
      <TextInput value={address} onChangeText={setAddress} style={styles.input} placeholderTextColor={MUTED} />

      <Text style={styles.label}>Contact</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
        placeholderTextColor={MUTED}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        multiline
        style={[styles.input, styles.multiline]}
        placeholderTextColor={MUTED}
      />

      <Pressable style={styles.save} onPress={save}>
        <Text style={styles.saveText}>Save changes</Text>
      </Pressable>
      <Text style={styles.muted}>Operating hours are edited in Schedule.</Text>
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 6 },
  photo: { width: 64, height: 64, borderRadius: 14, backgroundColor: '#262626', alignItems: 'center', justifyContent: 'center' },
  photoText: { color: GOLD, fontSize: 24, fontWeight: '800' },
  muted: { color: MUTED, fontSize: 11, flexShrink: 1 },
  label: { color: MUTED, fontSize: 12, marginTop: 8 },
  input: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 12, color: '#FFFFFF', paddingHorizontal: 14, height: 46 },
  multiline: { height: 90, paddingTop: 12, textAlignVertical: 'top' },
  save: { backgroundColor: GOLD, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  saveText: { color: '#0D0D0D', fontSize: 14, fontWeight: '700' },
});