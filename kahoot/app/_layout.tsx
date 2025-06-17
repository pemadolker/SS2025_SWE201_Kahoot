// _layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#333333', // Dark grey header
        },
        headerTintColor: '#FFFFFF', // White text/icons
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center', // Optional: center the title
      }}
    />
  );
}
