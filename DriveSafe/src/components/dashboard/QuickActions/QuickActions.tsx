// 4. QuickActions Component (src/components/dashboard/QuickActions/QuickActions.tsx)
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { quickActionsStyles } from './QuickActions.styles';

interface QuickActionsProps {
  onStartTrip: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onStartTrip }) => {
  return (
    <View style={quickActionsStyles.container}>
      <TouchableOpacity style={quickActionsStyles.actionButton} onPress={onStartTrip}>
        <LinearGradient
          colors={['#10B981', '#059669']}
          style={quickActionsStyles.actionGradient}
        >
          <Text style={quickActionsStyles.actionIcon}>🚗</Text>
          <Text style={quickActionsStyles.actionText}>Start Live Trip</Text>
        </LinearGradient>
      </TouchableOpacity>
      
      <TouchableOpacity style={quickActionsStyles.actionButton}>
        <LinearGradient
          colors={['#3B82F6', '#2563EB']}
          style={quickActionsStyles.actionGradient}
        >
          <Text style={quickActionsStyles.actionIcon}>📊</Text>
          <Text style={quickActionsStyles.actionText}>View History</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default QuickActions;

