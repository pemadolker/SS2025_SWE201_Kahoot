import { Pressable, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function Button({ text, href }: { text: string; href: string }) {
  return (
    <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={() => router.push(href)}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#555555', // Grey
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
  },
  text: {
    color: '#FFFFFF', // White text
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    backgroundColor: '#444444', // Darker grey
  },
});
