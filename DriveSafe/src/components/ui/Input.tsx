// src/components/ui/Input.tsx
import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { inputStyles } from '../../styles/components/inputStyles';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  style,
  ...props
}) => {
  return (
    <View style={inputStyles.container}>
      <Text style={inputStyles.label}>{label}</Text>
      <TextInput
        style={[inputStyles.input, style]}
        {...props}
      />
      {error && <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{error}</Text>}
    </View>
  );
};
