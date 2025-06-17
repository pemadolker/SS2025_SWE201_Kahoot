import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import Header from '../../components/Header';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';

export default function JoinQuiz() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    if (pin.length !== 6) {
      Alert.alert('Invalid PIN', 'Please enter a valid 6-digit PIN');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('quizzes')
      .select('title')
      .eq('pin', pin)
      .single();
    setLoading(false);

    if (error || !data) {
      Alert.alert('Quiz Not Found', 'No quiz matches the entered PIN');
    } else {
      // Navigate to waiting room and pass quiz title and pin
      router.push({
        pathname: '/player/waiting-room',
        params: { title: data.title, pin },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Join a Quiz" />
      <TextInput
        style={styles.input}
        placeholder="Enter Quiz PIN"
        placeholderTextColor="#aaa"
        value={pin}
        onChangeText={setPin}
        keyboardType="numeric"
        maxLength={6}
      />
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleJoin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Joining...' : 'Join Quiz'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#e5e5e5',
    color: '#222',
  },
  button: {
    backgroundColor: '#666',
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonPressed: {
    backgroundColor: '#444',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
