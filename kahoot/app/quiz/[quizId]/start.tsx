import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function StartQuiz() {
  const { quizId } = useLocalSearchParams<{ quizId: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start Quiz</Text>
      <Text style={styles.quizId}>Quiz ID: {quizId}</Text>

      <Pressable style={styles.button} onPress={() => alert('Quiz Started!')}>
        <Text style={styles.buttonText}>Start</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.backButton]} onPress={() => router.push('/profile')}>
        <Text style={[styles.buttonText, { color: '#4C5CFF' }]}>Back to Profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#333', marginBottom: 20 },
  quizId: { fontSize: 18, color: '#666', marginBottom: 24 },
  button: {
    backgroundColor: '#4C5CFF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 12,
  },
  backButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4C5CFF',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
