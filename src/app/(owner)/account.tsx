import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput } from 'react-native';

import SubScreen from '@/components/ui/sub-screen';
import { useStore } from '@/repositories/store';

const GOLD = '#D4AF37';
const CARD = '#181818';
const BORDER = '#2A2A2A';
const MUTED = '#A3A3A3';

export default function AccountScreen() {
  const router = useRouter();
  const { userName, setUserName, signOut } = useStore();
  const [name, setName] = useState(userName);

  const save = () => {
    if (!name.trim()) {
      Alert.alert('Please enter a name');
      return;
    }
    setUserName(name.trim());
    Alert.alert('Saved');
  };

  const handleSignOut = () => {
    signOut();
    router.replace('/(auth)/login');
  };

  return (
    <SubScreen title="Account">
      <Text style={styles.label}>Owner name</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} placeholderTextColor={MUTED} />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value="owner@goldedge.ph"
        editable={false}
        style={[styles.input, { color: MUTED }]}
      />

      <Pressable style={styles.save} onPress={save}>
        <Text style={styles.saveText}>Save</Text>
      </Pressable>

      <Pressable style={styles.signOut} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  label: { color: MUTED, fontSize: 12, marginTop: 8 },
  input: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 12, color: '#FFFFFF', paddingHorizontal: 14, height: 46 },
  save: { backgroundColor: GOLD, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  saveText: { color: '#0D0D0D', fontSize: 14, fontWeight: '700' },
  signOut: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  signOutText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});