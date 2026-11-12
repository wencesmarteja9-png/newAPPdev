import { StyleSheet, Text, View } from 'react-native';

import { useStore } from '@/repositories/store';

export default function Toast() {
  const { toast } = useStore();
  if (!toast) return null;

  return (
    <View style={styles.wrap} pointerEvents="none">
      <View style={styles.pill}>
        <Text style={styles.text}>{toast}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 110, alignItems: 'center' },
  pill: { backgroundColor: '#FFFFFF', borderRadius: 999, paddingHorizontal: 18, paddingVertical: 10 },
  text: { color: '#0D0D0D', fontSize: 12, fontWeight: '700' },
});