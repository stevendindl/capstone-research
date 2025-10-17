import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react';
import { Button, Text } from 'react-native-paper';
import { supabase } from '@/lib/supabase';
import { Alert } from 'react-native';
import { router } from 'expo-router'
import EmailInput from '@/components/text-inputs/email-input'
import UsernameInput from '@/components/text-inputs/username-input'
import PasswordInput from '@/components/text-inputs/password-input'
import DuplicateInput from '@/components/text-inputs/duplicate-input'

const Signup = () => {
    // Text input boxes
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Text box checks
    const [emailError, setEmailError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setconfirmPasswordError] = useState(false);

    // Loading state
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateAccount = async () => {
        setIsLoading(true);
        
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        username: username,
                    }
                }
            });

            if (error) {
                Alert.alert('Error', error.message);
                return;
            }

            Alert.alert('Success', 'Check your email to verify your account!');
            router.push('/(onboard)/signin');
            
        } catch (error) {
            console.error('Signup error:', error);
            Alert.alert('Error', 'Something went wrong during signup');
        } finally {
            setIsLoading(false);
        }
    };

    const fieldErrors = emailError || usernameError || passwordError || confirmPasswordError;
    const fieldsFilled = email !== '' && username !== '' && password !== '' && confirmPassword !== '';

    return (
        <View style={styles.container}>
            <Text variant="displaySmall" style={styles.title}>
                Sign Up
            </Text>

            <Text variant="bodyMedium" style={styles.subtitle}>
                Create your account to get started
            </Text>

            {/* Email/Password Form */}
            <EmailInput value={email} onChangeText={setEmail} onErrorChange={setEmailError} />
            <UsernameInput value={username} onChangeText={setUsername} onErrorChange={setUsernameError}/>
            <PasswordInput value={password} onChangeText={setPassword} onErrorChange={setPasswordError}/>
            <DuplicateInput
                label="Confirm Password"
                previousValue={password}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                errorMessage="Passwords do not match!"
                secureTextEntry
                onErrorChange={setconfirmPasswordError}
            />
            <Button 
                mode="contained"  
                onPress={handleCreateAccount}
                disabled={(!fieldsFilled) || fieldErrors || isLoading}
                loading={isLoading}
                style={styles.createButton}
            >
                Create Account
            </Button>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
                <Text variant="bodyMedium" style={styles.signInText}>
                    Already have an account?{' '}
                </Text>
                <Button 
                    mode="text"
                    onPress={() => router.push('/(onboard)/signin')}
                    compact
                    style={styles.signInButton}
                >
                    Sign In
                </Button>
            </View>
        </View>
    );
};

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
    createButton: {
        marginTop: 24,
        paddingVertical: 4,
    },
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    signInText: {
        color: '#666',
    },
    signInButton: {
        marginLeft: -8,
    },
});

export default Signup;