import { View, Text, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import Button from '../components/Button';

export default function Home() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/kahoot.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome to Kahoot!</Text>
      <Text style={styles.subtitle}>Create and play fun quizzes, fast.</Text>

      <View style={styles.buttonGroup}>
        <Button text="➕ Create a Quiz" href="/signup" />
        <Button text="🔑 Join a Quiz" href="/player/join" />
      </View>

      <Text style={styles.credits}>Built with ❤️ using React Native</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9', // Off-white
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333', // Dark Grey
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666', // Medium Grey
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonGroup: {
    width: '100%',
    gap: 16,
  },
  credits: {
    position: 'absolute',
    bottom: 24,
    fontSize: 12,
    color: '#999999', // Light Grey
  },
});
