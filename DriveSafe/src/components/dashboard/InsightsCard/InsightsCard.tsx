// 7. InsightsCard Component (src/components/dashboard/InsightsCard/InsightsCard.tsx)
import React from 'react';
import { View, Text } from 'react-native';
import { insightsCardStyles } from './InsightsCard.styles';

interface InsightsCardProps {
  scorePercentage: number;
  numberOfTrips: number;
}

interface InsightItem {
  icon: string;
  title: string;
  text: string;
}

const InsightsCard: React.FC<InsightsCardProps> = ({ scorePercentage, numberOfTrips }) => {
  const insights: InsightItem[] = [
    {
      icon: '🎯',
      title: scorePercentage >= 80 ? 'Excellent Driving!' : 
             scorePercentage >= 60 ? 'Room for Improvement' : 'Focus on Safety',
      text: scorePercentage >= 80 ? 'Your driving patterns show excellent safety awareness.' :
            scorePercentage >= 60 ? 'Small improvements can boost your score significantly.' :
            'Consider more cautious driving for better results.'
    },
    {
      icon: '📈',
      title: 'Data Accuracy',
      text: numberOfTrips >= 10 ? 'High accuracy with sufficient data points.' :
            `Analyze ${10 - numberOfTrips} more trips for better insights.`
    }
  ];

  return (
    <View style={insightsCardStyles.container}>
      <Text style={insightsCardStyles.cardTitle}>Smart Insights</Text>
      
      {insights.map((insight, index) => (
        <View key={index} style={insightsCardStyles.insightItem}>
          <View style={insightsCardStyles.insightIcon}>
            <Text style={insightsCardStyles.insightEmoji}>{insight.icon}</Text>
          </View>
          <View style={insightsCardStyles.insightContent}>
            <Text style={insightsCardStyles.insightTitle}>{insight.title}</Text>
            <Text style={insightsCardStyles.insightText}>{insight.text}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default InsightsCard;
