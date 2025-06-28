// 6. RiskAnalysisCard Styles (src/components/dashboard/RiskAnalysisCard/RiskAnalysisCard.styles.ts)
import { StyleSheet } from 'react-native';

export const riskAnalysisCardStyles = StyleSheet.create({
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStart: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  progressEnd: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  riskFactors: {
    gap: 12,
  },
  riskFactor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  factorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  factorIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  factorName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  factorBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  factorStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
