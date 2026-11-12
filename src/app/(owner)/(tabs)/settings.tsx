import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import ScreenContainer from '@/components/ui/screen-container';

const ROWS = [
  { title: 'Establishment', sub: 'Shop info & photo', href: '/(owner)/establishment' },
  { title: 'Services', sub: 'Prices & durations', href: '/(owner)/services' },
  { title: 'Schedule', sub: 'Hours, capacity, blocked slots', href: '/(owner)/schedule' },
  { title: 'Reviews', sub: 'Ratings from customers', href: '/(owner)/reviews' },
  { title: 'Reports', sub: 'Statistics', href: '/(owner)/reports' },
  { title: 'Account', sub: 'Profile & sign out', href: '/(owner)/account' },
] as const;

export default function OwnerSettings() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <Text style={styles.title}>Settings</Text>

      {ROWS.map((row) => (
        <Pressable key={row.title} style={styles.row} onPress={() => router.push(row.href)}>
          <View>
            <Text style={styles.rowTitle}>{row.title}</Text>
            <Text style={styles.rowSub}>{row.sub}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      ))}

      <View style={{ height: 100 }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#181818', borderColor: '#2A2A2A', borderWidth: 1, borderRadius: 14, padding: 16, marginTop: 10 },
  rowTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  rowSub: { color: '#A3A3A3', fontSize: 11, marginTop: 2 },
  arrow: { color: '#A3A3A3', fontSize: 22 },
});