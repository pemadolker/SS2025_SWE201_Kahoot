import { supabase } from '../lib/supabase';
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import Header from '../components/Header';
import { router } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // supabase.auth.signInWithPassword returns { data, error }
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setLoading(false);

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      if (data?.user) {
        // Successfully logged in — route to profile page
        router.replace('/profile');
      } else {
        setErrorMsg('Login failed: no user data returned');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Unexpected error: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Host Login" />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </Pressable>
      <Text style={styles.link} onPress={() => router.push('/signup')}>
        Don’t have an account? <Text style={styles.linkHighlight}>Sign up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#f0f0f0' },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    backgroundColor: '#e5e5e5',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    color: '#222',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#666',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 24,
  },
  buttonPressed: {
    backgroundColor: '#444',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  link: {
    color: '#555',
    textAlign: 'center',
    fontSize: 15,
  },
  linkHighlight: {
    color: '#222',
    fontWeight: '600',
  },
});
