// src/styles/components/buttonStyles.ts
import { StyleSheet } from 'react-native';
import { colors} from '../colors';
import { typography } from '../typography';
import { spacing } from '../spacing';

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  disabled: {
    backgroundColor: colors.disabled,
  },
  text: {
    color: colors.white,
    fontSize: typography.sizes.medium,
    fontWeight: typography.weights.semiBold,
  },
  link: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  linkText: {
    color: colors.primary,
    fontSize: typography.sizes.small,
    fontWeight: typography.weights.semiBold,
  },
});