import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="welcome" 
        options={{ 
          title: 'Welcome',
          headerShown: false // Typical for welcome screens
        }} 
      />
      <Stack.Screen 
        name="signin" 
        options={{ 
          title: 'Sign In',
          headerShown: false // Typical for auth screens
        }} 
      />
      <Stack.Screen 
        name="signup" 
        options={{ 
          title: 'Sign Up',
          headerShown: false // Typical for auth screens
        }} 
      />
    </Stack>
  );
}