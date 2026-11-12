import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStore } from '@/repositories/store';
import type { Role } from '@/types';

const GOLD = '#D4AF37';
const CARD = '#181818';
const BORDER = '#2A2A2A';
const MUTED = '#A3A3A3';

// "juan@email.com" -> "Juan"
function nameFromEmail(email: string): string {
  const base = email.split('@')[0].trim();
  return base ? base.charAt(0).toUpperCase() + base.slice(1) : 'Guest';
}

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signIn } = useStore();

  const [role, setRole] = useState<Role>('customer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isRegister = mode === 'register';

  const submit = () => {
    if (!email.trim() || !password) {
      setError('Enter email and password');
      return;
    }
    setError('');

    let name: string;
    if (isRegister && fullName.trim()) name = fullName.trim();
    else if (role === 'owner') name = 'Shop Owner';
    else name = nameFromEmail(email);

    signIn(role, name);
    router.replace(role === 'customer' ? '/(customer)/(tabs)/home' : '/(owner)/(tabs)/dashboard');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 30 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.logo}>
          Que<Text style={{ color: GOLD }}>Less</Text>
        </Text>
        <Text style={styles.tagline}>Book smart. Wait less.</Text>

        {/* ROLE SWITCH */}
        <View style={styles.roleRow}>
          {(['customer', 'owner'] as Role[]).map((r) => {
            const active = role === r;
            return (
              <Pressable
                key={r}
                onPress={() => setRole(r)}
                style={[styles.roleChip, active && styles.roleChipActive]}
              >
                <Text style={[styles.roleText, active && styles.roleTextActive]}>
                  {r === 'customer' ? 'Customer' : 'Shop Owner'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.heading}>{isRegister ? 'Create account' : 'Sign in'}</Text>

        {isRegister && (
          <>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Juan"
              placeholderTextColor={MUTED}
              style={styles.input}
            />
          </>
        )}

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@email.com"
          placeholderTextColor={MUTED}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor={MUTED}
          secureTextEntry
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>{isRegister ? 'Register' : 'Sign in'}</Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace(isRegister ? '/(auth)/login' : '/(auth)/register')}
          hitSlop={10}
        >
          <Text style={styles.switchLink}>
            {isRegister ? 'Have an account? Sign in' : 'No account? Register'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0D0D0D' },
  content: { paddingHorizontal: 22, gap: 8 },
  logo: { color: '#FFFFFF', fontSize: 36, fontWeight: '800', textAlign: 'center' },
  tagline: { color: MUTED, fontSize: 12, textAlign: 'center', marginBottom: 22 },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  roleChip: { flex: 1, backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  roleChipActive: { backgroundColor: GOLD, borderColor: GOLD },
  roleText: { color: '#FFFFFF', fontSize: 13 },
  roleTextActive: { color: '#0D0D0D', fontWeight: '700' },
  heading: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 2 },
  label: { color: MUTED, fontSize: 12, marginTop: 6 },
  input: { backgroundColor: CARD, borderColor: BORDER, borderWidth: 1, borderRadius: 12, color: '#FFFFFF', paddingHorizontal: 14, height: 46 },
  error: { color: '#F87171', fontSize: 12, marginTop: 6 },
  button: { backgroundColor: GOLD, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  buttonText: { color: '#0D0D0D', fontSize: 14, fontWeight: '700' },
  switchLink: { color: GOLD, fontSize: 13, textAlign: 'center', marginTop: 14 },
});