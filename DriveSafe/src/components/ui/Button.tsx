// src/components/ui/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { buttonStyles } from '../../styles/components/buttonStyles';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'link';
  loading?: boolean;
  loadingText?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  loadingText,
  disabled,
  style,
  ...props
}) => {
  const buttonStyle = variant === 'primary' ? buttonStyles.primary : buttonStyles.link;
  const textStyle = variant === 'primary' ? buttonStyles.text : buttonStyles.linkText;

  return (
    <TouchableOpacity
      style={[
        buttonStyle,
        disabled || loading ? buttonStyles.disabled : null,
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      <Text style={textStyle}>
        {loading && loadingText ? loadingText : title}
      </Text>
    </TouchableOpacity>
  );
};
