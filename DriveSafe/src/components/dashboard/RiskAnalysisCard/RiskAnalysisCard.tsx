// 5. RiskAnalysisCard Component (src/components/dashboard/RiskAnalysisCard/RiskAnalysisCard.tsx)
import React from 'react';
import { View, Text } from 'react-native';
import { RiskLevel } from '@/src/types/dashboard.types';
import { riskAnalysisCardStyles } from './RiskAnalysisCard.styles';

interface RiskAnalysisCardProps {
  riskData: RiskLevel | null;
  scorePercentage: number;
}

interface RiskFactorData {
  name: string;
  status: string;
  color: string;
  icon: string;
}

const RiskAnalysisCard: React.FC<RiskAnalysisCardProps> = ({ riskData, scorePercentage }) => {
  const riskFactors: RiskFactorData[] = [
    { name: 'Speed Control', status: 'Good', color: '#10B981', icon: '🏎️' },
    { name: 'Smooth Braking', status: 'Fair', color: '#F59E0B', icon: '🛑' },
    { name: 'Cornering', status: 'Excellent', color: '#10B981', icon: '🔄' },
    { name: 'Focus Level', status: 'Good', color: '#10B981', icon: '👁️' },
  ];

  return (
    <View style={riskAnalysisCardStyles.container}>
      <View style={riskAnalysisCardStyles.cardHeader}>
        <Text style={riskAnalysisCardStyles.cardTitle}>Risk Analysis</Text>
        <View style={[riskAnalysisCardStyles.statusDot, { backgroundColor: riskData?.color }]} />
      </View>
      
      <View style={riskAnalysisCardStyles.progressSection}>
        <View style={riskAnalysisCardStyles.progressBar}>
          <View 
            style={[
              riskAnalysisCardStyles.progressFill, 
              { 
                width: `${scorePercentage}%`,
                backgroundColor: riskData?.color 
              }
            ]} 
          />
        </View>
        <View style={riskAnalysisCardStyles.progressLabels}>
          <Text style={riskAnalysisCardStyles.progressStart}>0</Text>
          <Text style={riskAnalysisCardStyles.progressEnd}>100</Text>
        </View>
      </View>

      <View style={riskAnalysisCardStyles.riskFactors}>
        {riskFactors.map((factor, index) => (
          <View key={index} style={riskAnalysisCardStyles.riskFactor}>
            <View style={riskAnalysisCardStyles.factorLeft}>
              <Text style={riskAnalysisCardStyles.factorIcon}>{factor.icon}</Text>
              <Text style={riskAnalysisCardStyles.factorName}>{factor.name}</Text>
            </View>
            <View style={[riskAnalysisCardStyles.factorBadge, { backgroundColor: factor.color }]}>
              <Text style={riskAnalysisCardStyles.factorStatus}>{factor.status}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default RiskAnalysisCard;
