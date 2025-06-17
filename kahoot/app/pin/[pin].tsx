import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function PinScreen() {
  const { pin } = useLocalSearchParams<{ pin: string }>();
  const router = useRouter();
  const [quiz, setQuiz] = useState<{ id: string; title: string; pin: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('quizzes')
        .select('id, title, pin')
        .eq('pin', pin)
        .maybeSingle();

      setLoading(false);
      if (error) {
        Alert.alert('Error', error.message);
      } else if (!data) {
        Alert.alert('Quiz not found');
        router.replace('/profile');
      } else {
        setQuiz(data);
      }
    };

    if (pin) fetchQuiz();
  }, [pin]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#888" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Created!</Text>
      <Text style={styles.subtitle}>PIN:</Text>
      <Text style={styles.pin}>{quiz?.pin}</Text>
      <Text style={styles.quizTitle}>{quiz?.title}</Text>

      <Pressable style={styles.addButton} onPress={() => router.push(`/quiz/${quiz?.id}/add-questions`)}>
        <Text style={styles.buttonText}>Add Questions</Text>
      </Pressable>

      <Pressable style={styles.startButton} onPress={() => router.push(`/quiz/${quiz?.id}/start`)}>
        <Text style={styles.buttonText}>Start Quiz</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#333', marginBottom: 12 },
  subtitle: { fontSize: 18, color: '#666' },
  pin: { fontSize: 48, fontWeight: 'bold', color: '#444', marginVertical: 8 },
  quizTitle: { fontSize: 20, fontWeight: '600', color: '#222', marginBottom: 24 },
  addButton: {
    backgroundColor: '#4C5CFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginBottom: 12,
  },
  startButton: {
    backgroundColor: '#888',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
