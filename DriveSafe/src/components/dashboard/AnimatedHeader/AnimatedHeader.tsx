// 3. AnimatedHeader Component (src/components/dashboard/AnimatedHeader/AnimatedHeader.tsx)
import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TripSelector from '../TripSelector/TripSelector';
import { User } from '@/src/types/User';
import { DriscScore, RiskLevel } from '@/src/types/dashboard.types';
import { animatedHeaderStyles } from './AnimatedHeader.styles';

interface AnimatedHeaderProps {
  userData: User | null;
  driscScore: DriscScore | null;
  riskData: RiskLevel | null;
  scoreLoading: boolean;
  numberOfTrips: number;
  onTripsChange: (trips: number) => void;
  scrollY: Animated.Value;
  headerMaxHeight: number;
  headerMinHeight: number;
  headerScrollDistance: number;
}

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  userData,
  driscScore,
  riskData,
  scoreLoading,
  numberOfTrips,
  onTripsChange,
  scrollY,
  headerMaxHeight,
  headerMinHeight,
  headerScrollDistance,
}) => {
  const scorePercentage = driscScore?.score || 0;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, headerScrollDistance],
    outputRange: [headerMaxHeight, headerMinHeight],
    extrapolate: 'clamp',
  });

  const welcomeOpacity = scrollY.interpolate({
    inputRange: [0, headerScrollDistance / 2, headerScrollDistance],
    outputRange: [1, 0.7, 0],
    extrapolate: 'clamp',
  });

  const scoreScale = scrollY.interpolate({
    inputRange: [0, headerScrollDistance],
    outputRange: [1, 0.7],
    extrapolate: 'clamp',
  });

  const compactScoreTranslateY = scrollY.interpolate({
    inputRange: [0, headerScrollDistance],
    outputRange: [0, -30],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[animatedHeaderStyles.heroHeader, { height: headerHeight }]}>
      <LinearGradient
        colors={['#667EEA', '#764BA2']}
        style={animatedHeaderStyles.gradient}
      />
      
      {/* Fixed Header Content */}
      <View style={animatedHeaderStyles.fixedHeaderContent}>
        <Animated.View style={[animatedHeaderStyles.headerContent, { opacity: welcomeOpacity }]}>
          <View style={animatedHeaderStyles.welcomeSection}>
            <Text style={animatedHeaderStyles.welcomeText}>Welcome back</Text>
            <Text style={animatedHeaderStyles.userNameHeader}>
              {userData?.fullName || 'Driver'}
            </Text>
          </View>
          
          <TouchableOpacity style={animatedHeaderStyles.avatarButton}>
            <View style={animatedHeaderStyles.avatarCircle}>
              <Text style={animatedHeaderStyles.avatarText}>
                {userData?.fullName?.charAt(0) || '👤'}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Score Section */}
      <View style={animatedHeaderStyles.scoreSection}>
        <Animated.View style={[animatedHeaderStyles.mainScoreContainer, { transform: [{ scale: scoreScale }] }]}>
          <View style={animatedHeaderStyles.scoreCircle}>
            <Text style={animatedHeaderStyles.scoreNumber}>
              {scoreLoading ? '...' : Math.round(scorePercentage)}
            </Text>
            <Text style={animatedHeaderStyles.scoreLabel}>DRISC Score</Text>
          </View>
          
          <View style={animatedHeaderStyles.riskLevelBadge}>
            <Text style={animatedHeaderStyles.riskIcon}>{riskData?.icon}</Text>
            <Text style={animatedHeaderStyles.riskLevelText}>{riskData?.level}</Text>
          </View>
        </Animated.View>
      </View>

      {/* Trip Selector */}
      <TripSelector
        numberOfTrips={numberOfTrips}
        onTripsChange={onTripsChange}
      />

      {/* Compact Score */}
      <Animated.View 
        style={[
          animatedHeaderStyles.compactScore,
          {
            opacity: scrollY.interpolate({
              inputRange: [headerScrollDistance * 0.5, headerScrollDistance],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
            transform: [{ translateY: compactScoreTranslateY }]
          }
        ]}
      >
        <Text style={animatedHeaderStyles.compactScoreNumber}>
          {scoreLoading ? '...' : Math.round(scorePercentage)}
        </Text>
        <Text style={animatedHeaderStyles.compactScoreLabel}>DRISC</Text>
        <View style={[animatedHeaderStyles.compactRiskDot, { backgroundColor: riskData?.color }]} />
      </Animated.View>
    </Animated.View>
  );
};

export default AnimatedHeader;