import { useEffect } from 'react';
import { View } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  useEffect(() => {
    const handleAuthStateChange = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Redirect to main app after successful OAuth
        router.replace('/(tabs)');
      } else if (event === 'SIGNED_OUT') {
        // Redirect to welcome/signin if sign out
        router.replace('/(onboard)/welcome');
      }
    });

    // Cleanup subscription
    return () => {
      handleAuthStateChange.data.subscription.unsubscribe();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text variant="bodyMedium" style={{ marginTop: 16 }}>
        Completing sign in...
      </Text>
    </View>
  );
}