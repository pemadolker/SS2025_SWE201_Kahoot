import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const EmailVerificationScreen = () => {
  const route = useRoute<{ key: string; name: string; params: { email: string } }>();
  const { email } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check your email</Text>
      <Text style={styles.text}>
        We've sent a magic link to {email}
      </Text>
      <Text style={styles.note}>
        If you don't see the email, check your spam folder.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  note: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default EmailVerificationScreen;