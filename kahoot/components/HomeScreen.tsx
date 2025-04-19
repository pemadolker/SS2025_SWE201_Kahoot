import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import type { StackNavigationProp } from '@react-navigation/stack';

type HomeScreenProps = {
  navigation: StackNavigationProp<any>;
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigation.navigate('Auth');
    }
  };

  return (
    <View style={styles.container}>
      {showSplash ? (
        <Text style={styles.splashText}>Kahoot</Text>
      ) : (
        <>
          <Text style={styles.title}>Welcome to Kahoot!</Text>
          <Button title="Sign Out" onPress={handleSignOut} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  splashText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4e54c8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default HomeScreen;
