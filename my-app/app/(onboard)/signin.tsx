import { StyleSheet, View, Alert } from 'react-native'
import React, { useState } from 'react';
import { Button, Text } from 'react-native-paper'
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

import UsernameOrEmailInput from '@/components/text-inputs/username-or-email-input'
import PasswordInput from '@/components/text-inputs/password-input';

const Signin = () => {
  // Username/email
  const [user, setUser] = useState('');
  const [userError, setUserError] = useState(false);

  // Password
  const [pwd, setPwd] = useState('');
  const [pwdError, setPwdError] = useState(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Field validation
  const fieldErrors = userError || pwdError;
  const fieldsFilled = user !== '' && pwd !== '';

  const handleSignIn = async () => {
    setIsLoading(true);
    
    try {
      // Function to check if input looks like an email
      const isEmail = (input: string) => {
        return input.includes('@') && input.includes('.');
      };

      let emailToUse = user;

      // If input doesn't look like an email, try to find the email by username
      if (!isEmail(user)) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', user)
          .single();

        if (profileError || !profile) {
          Alert.alert('Error', 'Username not found');
          return;
        }

        emailToUse = profile.email;
      }

      // Try to sign in with the email (either provided directly or looked up)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: pwd,
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      // Successfully signed in
      router.push('/(tabs)');
      
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Error', 'Something went wrong during sign in');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text variant="displaySmall" style={styles.title}>
        Sign In
      </Text>

      <Text variant="bodyMedium" style={styles.subtitle}>
        Welcome back! Please sign in to your account
      </Text>

      <UsernameOrEmailInput 
        value={user} 
        onChangeText={setUser} 
        onErrorChange={setUserError} 
      />
      <PasswordInput 
        value={pwd} 
        onChangeText={setPwd} 
        onErrorChange={setPwdError} 
      />
      
      <Button 
        mode="contained" 
        onPress={handleSignIn} 
        disabled={(!fieldsFilled) || fieldErrors || isLoading}
        loading={isLoading}
        style={styles.signInButton}
      >
        Sign In
      </Button>

      {/* Sign Up Link */}
      <View style={styles.signUpContainer}>
        <Text variant="bodyMedium" style={styles.signUpText}>
          Don't have an account?{' '}
        </Text>
        <Button 
          mode="text"
          onPress={() => router.push('/(onboard)/signup')}
          compact
          style={styles.signUpButton}
        >
          Sign Up
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    paddingBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    paddingBottom: 32,
    textAlign: 'center',
    color: '#666',
  },
  signInButton: {
    marginTop: 24,
    paddingVertical: 4,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signUpText: {
    color: '#666',
  },
  signUpButton: {
    marginLeft: -8,
  },
});

export default Signin
