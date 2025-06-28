// 10. ProfileCard Styles (src/components/dashboard/ProfileCard/ProfileCard.styles.ts)
import { StyleSheet } from 'react-native';

export const profileCardStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  profileDetails: {
    gap: 16,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  profileLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  profileValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
});