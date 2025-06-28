// src/styles/components/inputStyles.ts
import { StyleSheet } from 'react-native';
import { colors} from '../colors';
import { typography } from '../typography';
import { spacing } from '../spacing';

export const inputStyles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: typography.sizes.medium,
    fontWeight: typography.weights.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.medium,
    color: colors.text.primary,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.medium,
    color: colors.text.primary,
  },
  eyeIcon: {
    padding: spacing.sm,
  },
});
