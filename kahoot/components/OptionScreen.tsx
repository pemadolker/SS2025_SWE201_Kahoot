import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../lib/supabase';

type RootStackParamList = {
  Home: undefined;
};

type OptionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const OptionScreen = () => {
  const [splashVisible, setSplashVisible] = useState(true);
  const [roleSelected, setRoleSelected] = useState<'teacher' | 'student' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<OptionScreenNavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => setSplashVisible(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSignUp = async () => {
    if (!validateEmail(email) || password.length < 6) {
      Alert.alert('Error', 'Please enter a valid email and a password with 6+ characters.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Signup Failed', error.message);
    } else {
      Alert.alert('Success', 'Check your email for confirmation!');
      navigation.navigate('Home');
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  if (splashVisible) {
    return (
      <View style={styles.splashContainer}>
        <Text style={styles.splashText}>Kahoot</Text>
      </View>
    );
  }

  if (!roleSelected) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Who are you?</Text>
        <TouchableOpacity style={styles.roleButton} onPress={() => setRoleSelected('teacher')}>
          <Text style={styles.buttonText}>Teacher</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.roleButton} onPress={() => setRoleSelected('student')}>
          <Text style={styles.buttonText}>Student</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (roleSelected === 'student') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Student Mode Coming Soon...</Text>
        <TouchableOpacity style={styles.roleButton} onPress={() => setRoleSelected(null)}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Teacher signup form
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teacher Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password (min 6 chars)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setRoleSelected(null)}>
        <Text style={styles.linkText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4e54c8',
  },
  splashText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  roleButton: {
    backgroundColor: '#4e54c8',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6,
    marginVertical: 8,
    width: '70%',
  },
  button: {
    backgroundColor: '#4e54c8',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6,
    marginTop: 8,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  linkText: {
    marginTop: 16,
    color: '#4e54c8',
    fontSize: 14,
  },
});

export default OptionScreen;
