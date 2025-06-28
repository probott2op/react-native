// src/app/index.tsx (Refactored Login Page)
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Header } from '@/src/components/ui/Header';
import { LoginForm } from '@/src/components/auth/LoginForm';
import { authStyles } from '../styles/components/authStyles';

export default function LoginScreen() {
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      router.replace('/(auth)/dashboard');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
      throw error; // Re-throw to let LoginForm handle loading state
    }
  };

  return (
    <KeyboardAvoidingView
      style={authStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={authStyles.scrollContainer}>
        <Header
          title="Welcome Back"
          subtitle="Sign in to your account"
        />
        <LoginForm onLogin={handleLogin} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}