import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';

export default function Profile() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user quizzes
  const fetchQuizzes = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from('quizzes')
        .select('id, title, description')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error.message);
      } else {
        setQuizzes(data || []);
      }
    } else {
      router.replace('/login');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  // Navigate to create quiz screen
  const handleCreateQuiz = () => {
    router.push('/host/create-quiz');
  };

  const renderQuizCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDesc}>{item.description}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#888" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top header bar with profile info left, logout right */}
      <View style={styles.headerBar}>
        <Text style={styles.profileText}>Welcome!</Text>
        <Pressable onPress={handleLogout} style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutPressed]}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      {/* Create Quiz button */}
      <Pressable
        style={({ pressed }) => [
          styles.createButton,
          pressed && { backgroundColor: '#555' },
        ]}
        onPress={handleCreateQuiz}
      >
        <Text style={styles.createButtonText}>Create Quiz</Text>
      </Pressable>

      {/* Quiz list or no quiz message */}
      {quizzes.length === 0 ? (
        <Text style={styles.noQuizText}>No quizzes created yet.</Text>
      ) : (
        <FlatList
          data={quizzes}
          renderItem={renderQuizCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f9f9f9',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },
  logoutButton: {
    backgroundColor: '#cc4444',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  logoutPressed: {
    backgroundColor: '#aa2222',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  createButton: {
    backgroundColor: '#888',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  noQuizText: {
    marginTop: 32,
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: '#222',
  },
  cardDesc: {
    fontSize: 14,
    color: '#555',
  },
});
