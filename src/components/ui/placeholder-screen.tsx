import { StyleSheet, Text, View } from 'react-native';

export default function PlaceholderScreen({ title, note }: { title: string; note: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.note}>{note}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10 },
  title: { color: '#D4AF37', fontSize: 24, fontWeight: 'bold' },
  note: { color: '#A3A3A3', fontSize: 14, textAlign: 'center' },
});