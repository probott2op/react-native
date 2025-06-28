// src/components/ui/Divider.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { authStyles } from '../../styles/components/authStyles';

interface DividerProps {
  text?: string;
}

export const Divider: React.FC<DividerProps> = ({ text = 'or' }) => {
  return (
    <View style={authStyles.divider}>
      <View style={authStyles.line} />
      <Text style={authStyles.orText}>{text}</Text>
      <View style={authStyles.line} />
    </View>
  );
};