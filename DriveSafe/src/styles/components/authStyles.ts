// src/styles/components/authStyles.ts
import { StyleSheet } from 'react-native';
import { colors} from '../colors';
import { typography } from '../typography';
import { spacing } from '../spacing';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.sizes.large,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.medium,
    color: colors.text.secondary,
  },
  form: {
    width: '100%',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orText: {
    marginHorizontal: spacing.sm,
    color: colors.text.secondary,
    fontSize: typography.sizes.small,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.medium,
  },
  signupLink: {
    color: colors.primary,
    fontSize: typography.sizes.medium,
    fontWeight: typography.weights.semiBold,
  },
});
