// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { View, Alert, TouchableOpacity, Text } from 'react-native';
import { Link } from 'expo-router';
import { Input } from '@/src/components/ui/Input';
import { PasswordInput } from '@/src/components/ui/PasswordInput';
import { Button } from '@/src/components/ui/Button';
import { Divider } from '@/src/components/ui/Divider';
import { authStyles } from '@/src/styles/components/authStyles';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await onLogin(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={authStyles.form}>
      <Input
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
      />

      <Button
        variant="link"
        title="Forgot Password?"
        style={authStyles.form}
      />

      <Button
        title="Sign In"
        loading={isLoading}
        loadingText="Signing In..."
        onPress={handleLogin}
      />

      <Divider />

      <View style={authStyles.signupContainer}>
        <Text style={authStyles.signupText}>Don't have an account? </Text>
        <Link href={'register' as any} asChild>
          <TouchableOpacity>
            <Text style={authStyles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};