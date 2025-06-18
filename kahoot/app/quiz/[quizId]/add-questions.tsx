import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
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
  const [submittedQuestions, setSubmittedQuestions] = useState<
    { question: string; correctAnswer: string }[]
  >([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) return;

      const { data, error } = await supabase
        .from('quizzes')
        .select('title')
        .eq('id', quizId)
        .single();

      if (error) {
        Alert.alert('Error', error.message);
        console.error('Fetch quiz error:', error);
      } else {
        setQuizTitle(data.title);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index].text = value;
    setAnswers(updatedAnswers);
  };

  const toggleCorrect = (index: number) => {
    const updatedAnswers = answers.map((ans, i) => ({
      ...ans,
      is_correct: i === index, // Only one correct
    }));
    setAnswers(updatedAnswers);
  };

  const handleAddQuestion = async () => {
    if (!questionText.trim()) {
      Alert.alert('Validation Error', 'Question text cannot be empty.');
      return;
    }

    if (answers.some((a) => a.text.trim() === '')) {
      Alert.alert('Validation Error', 'All answer fields must be filled.');
      return;
    }

    if (!answers.some((a) => a.is_correct)) {
      Alert.alert('Validation Error', 'Please select the correct answer.');
      return;
    }

    try {
      setLoading(true);

      const { data: questionData, error: questionError } = await supabase
        .from('questions')
        .insert([{ quiz_id: quizId, question_text: questionText.trim() }])
        .select()
        .single();

      if (questionError) throw questionError;

      const answersToInsert = answers.map((a) => ({
        question_id: questionData.id,
        answer_text: a.text.trim(),
        is_correct: a.is_correct,
      }));

      const { error: answersError } = await supabase
        .from('answers')
        .insert(answersToInsert);

      if (answersError) throw answersError;

      const correctAnswer = answers.find((a) => a.is_correct)?.text || '';

      setSubmittedQuestions((prev) => [
        ...prev,
        { question: questionText.trim(), correctAnswer },
      ]);

      setQuestionText('');
      setAnswers([
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
      ]);
    } catch (err: any) {
      console.error('Insert error:', err);
      Alert.alert('Error', err.message || 'Failed to add question.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.title}>Add Questions to "{quizTitle}"</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your question here"
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
              <Text style={{ color: 'white', fontWeight: '600' }}>
                {ans.is_correct ? 'Correct' : 'Mark'}
              </Text>
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

        {submittedQuestions.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>
              Added Questions:
            </Text>
            {submittedQuestions.map((q, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: '#F2F2F2',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontWeight: '500' }}>
                  {idx + 1}. {q.question}
                </Text>
                <Text style={{ color: '#4C5CFF', marginTop: 4 }}>
                  Correct: {q.correctAnswer}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
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
