// Header.tsx
import { Text, StyleSheet } from 'react-native';

export default function Header({ title }: { title: string }) {
  return <Text style={styles.header}>{title}</Text>;
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#4C5CFF',
  },
});
