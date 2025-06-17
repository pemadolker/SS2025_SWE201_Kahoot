import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../../lib/supabase';

export default function AddQuestions() {
  const { quizId } = useLocalSearchParams<{ quizId: string }>();
  const router = useRouter();

  const [quizTitle, setQuizTitle] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState([
    { text: '', is_correct: false },
    { text: '', is_correct: false },
    { text: '', is_correct: false },
    { text: '', is_correct: false },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) return;
      const { data, error } = await supabase.from('quizzes').select('title').eq('id', quizId).single();
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setQuizTitle(data.title);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index].text = value;
    setAnswers(newAnswers);
  };

  const toggleCorrect = (index: number) => {
    const newAnswers = answers.map((ans, i) => ({
      ...ans,
      is_correct: i === index,
    }));
    setAnswers(newAnswers);
  };

  const handleAddQuestion = async () => {
    if (!questionText.trim()) {
      Alert.alert('Validation Error', 'Question text cannot be empty');
      return;
    }

    if (answers.some((a) => a.text.trim() === '')) {
      Alert.alert('Validation Error', 'All answer fields must be filled');
      return;
    }

    if (!answers.some((a) => a.is_correct)) {
      Alert.alert('Validation Error', 'Select the correct answer');
      return;
    }

    setLoading(true);

    // Insert question
    const { data: questionData, error: questionError } = await supabase
      .from('questions')
      .insert([{ quiz_id: quizId, question_text: questionText.trim() }])
      .select()
      .single();

    if (questionError) {
      setLoading(false);
      Alert.alert('Error', questionError.message);
      return;
    }

    // Insert answers
    const answersToInsert = answers.map((a) => ({
      question_id: questionData.id,
      answer_text: a.text.trim(),
      is_correct: a.is_correct,
    }));

    const { error: answersError } = await supabase.from('answers').insert(answersToInsert);

    setLoading(false);

    if (answersError) {
      Alert.alert('Error', answersError.message);
    } else {
      Alert.alert('Success', 'Question and answers added!');
      // Reset question and answers
      setQuestionText('');
      setAnswers([
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
      ]);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Add Questions to "{quizTitle}"</Text>

      <TextInput
        style={styles.input}
        placeholder="Question text"
        value={questionText}
        onChangeText={setQuestionText}
        multiline
      />

      {answers.map((ans, idx) => (
        <View key={idx} style={styles.answerRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder={`Answer ${idx + 1}`}
            value={ans.text}
            onChangeText={(text) => handleAnswerChange(idx, text)}
          />
          <Pressable
            style={[styles.correctBtn, ans.is_correct ? styles.correctBtnSelected : null]}
            onPress={() => toggleCorrect(idx)}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>{ans.is_correct ? 'Correct' : 'Mark'}</Text>
          </Pressable>
        </View>
      ))}

      <Pressable
        style={[styles.button, loading && { backgroundColor: '#aaa' }]}
        onPress={handleAddQuestion}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Adding...' : 'Add Question'}</Text>
      </Pressable>

      <Pressable style={styles.backBtn} onPress={() => router.push('/profile')}>
        <Text style={{ color: '#4C5CFF', fontWeight: '600' }}>Back to Profile</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  answerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  correctBtn: {
    backgroundColor: '#888',
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  correctBtnSelected: {
    backgroundColor: '#4C5CFF',
  },
  button: {
    backgroundColor: '#4C5CFF',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  backBtn: {
    marginTop: 24,
    alignSelf: 'center',
  },
});
