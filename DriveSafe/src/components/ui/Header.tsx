// src/components/ui/Header.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { authStyles } from '../../styles/components/authStyles';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <View style={authStyles.header}>
      <Text style={authStyles.title}>{title}</Text>
      {subtitle && <Text style={authStyles.subtitle}>{subtitle}</Text>}
    </View>
  );
};
