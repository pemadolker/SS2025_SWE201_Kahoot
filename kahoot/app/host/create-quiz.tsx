import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { useState } from 'react';
import Header from '../../components/Header';
import { supabase } from '../../lib/supabase';
import { router } from 'expo-router';
function generatePin() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!quizTitle.trim()) {
      Alert.alert('Validation Error', 'Quiz title cannot be empty');
      return;
    }

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      Alert.alert('Error', 'You must be logged in to create a quiz.');
      return;
    }

    // Generate unique PIN
    let pin = generatePin();
    let isUnique = false;

    while (!isUnique) {
      const { data } = await supabase.from('quizzes').select('id').eq('pin', pin).single();
      if (data) {
        pin = generatePin();
      } else {
        isUnique = true;
      }
    }

    const { data: quizData, error } = await supabase
      .from('quizzes')
      .insert([
        {
          title: quizTitle.trim(),
          owner: user.id,
          pin,
        },
      ])
      .select()
      .single();

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setQuizTitle('');
      console.log('Redirecting to pin page with pin:', quizData.pin);
      router.push(`/pin/${quizData.pin}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Create New Quiz" />
      <TextInput
        style={styles.input}
        placeholder="Enter Quiz Title"
        value={quizTitle}
        onChangeText={setQuizTitle}
        placeholderTextColor="#aaa"
      />
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleCreate}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create Quiz'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#f8f8f8' },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    backgroundColor: '#888',
    paddingVertical: 16,
    borderRadius: 10,
  },
  buttonPressed: {
    backgroundColor: '#777',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
});


