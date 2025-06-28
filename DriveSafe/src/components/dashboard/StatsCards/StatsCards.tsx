// 3. StatsCards Component (src/components/dashboard/StatsCards/StatsCards.tsx)
import React from 'react';
import { View, Text } from 'react-native';
import { statsCardsStyles } from './StatsCards.styles';

interface StatsCardsProps {
  tripsCount: number;
  scorePercentage: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ tripsCount, scorePercentage }) => {
  const premiumSavings = scorePercentage > 70 ? Math.round((100 - scorePercentage) * 0.8) : 0;

  return (
    <View style={statsCardsStyles.container}>
      <View style={statsCardsStyles.statsRow}>
        <View style={[statsCardsStyles.statCard, statsCardsStyles.statCardLeft]}>
          <Text style={statsCardsStyles.statNumber}>{tripsCount}</Text>
          <Text style={statsCardsStyles.statLabel}>Trips Analyzed</Text>
          <View style={statsCardsStyles.statIcon}>
            <Text style={statsCardsStyles.statIconText}>🛣️</Text>
          </View>
        </View>
        
        <View style={[statsCardsStyles.statCard, statsCardsStyles.statCardRight]}>
          <Text style={statsCardsStyles.statNumber}>{premiumSavings}%</Text>
          <Text style={statsCardsStyles.statLabel}>Premium Savings</Text>
          <View style={statsCardsStyles.statIcon}>
            <Text style={statsCardsStyles.statIconText}>💰</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default StatsCards;
