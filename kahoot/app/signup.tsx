import { supabase } from '../lib/supabase';
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import Header from '../components/Header';
import { router } from 'expo-router';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = async () => {
    setLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      alert('Signup successful! Please check your email to confirm.');
      router.replace('/login');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Create an Account" />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      {errorMsg ? <Text style={{ color: 'red', marginBottom: 12 }}>{errorMsg}</Text> : null}
      <Pressable style={styles.button} onPress={handleSignup} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Sign Up'}</Text>
      </Pressable>

      {/* Add login link below */}
      <Text style={styles.loginLink}>
        Already have an account?{' '}
        <Text style={styles.loginLinkBold} onPress={() => router.push('/login')}>
          Login
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 24,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    backgroundColor: '#FFF',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#555',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 24,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  loginLinkBold: {
    color: '#333',
    fontWeight: '600',
  },
});
