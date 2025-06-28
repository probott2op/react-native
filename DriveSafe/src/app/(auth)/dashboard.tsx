// 1. Main Dashboard Component (Dashboard.tsx)
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dashboardClient } from '../../api/Dashboard';
import { useNavigation } from '@react-navigation/native';
import { User } from '@/src/types/User';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Component imports
import AnimatedHeader from '@/src/components/dashboard/AnimatedHeader/AnimatedHeader';
import QuickActions from '@/src/components/dashboard/QuickActions/QuickActions';
import StatsCards from '@/src/components/dashboard/StatsCards/StatsCards';
import RiskAnalysisCard from '@/src/components/dashboard/RiskAnalysisCard/RiskAnalysisCard';
import InsightsCard from '@/src/components/dashboard/InsightsCard/InsightsCard';
import ProfileCard from '@/src/components/dashboard/ProfileCard/ProfileCard';
import LoadingScreen from '@/src/components/common/LoadingScreen/LoadingScreen';

// Styles
import { dashboardStyles } from '@/src/styles/dashboard/dashboard.styles';

// Types
import { DriscScore, RiskLevel } from '@/src/types/dashboard.types';

// Constants
const HEADER_MAX_HEIGHT = 320;
const HEADER_MIN_HEIGHT = 120;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [driscScore, setDriscScore] = useState<DriscScore | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [scoreLoading, setScoreLoading] = useState<boolean>(false);
  const [numberOfTrips, setNumberOfTrips] = useState<number>(1);
  const navigation = useNavigation();
  const { user, logout, token } = useAuth();
  
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    fetchData();
  }, [numberOfTrips]);

  const fetchData = async () => {
    try {
      if (!user?.userId) {
        logout();
        router.replace('/');
        return;
      }
      
      const currentUser = user.userId;
      if (token) {
        const score = await dashboardClient.getDriscScore(currentUser, numberOfTrips, token);
        setUserData(user);
        setDriscScore(score);
        console.log('DRISC Score data:', score);
      } else {
        logout();
        router.replace('/');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleTripsChange = async (newN: number) => {
    setNumberOfTrips(newN);
    setScoreLoading(true);

    try {
      const currentUser = user?.userId;
      if (currentUser && token) {
        const score = await dashboardClient.getDriscScore(currentUser, newN, token);
        setDriscScore(score);
        console.log('Updated DRISC Score data:', score);
      }
    } catch (error) {
      console.error('Error fetching updated score:', error);
      Alert.alert('Error', 'Failed to update score');
    } finally {
      setScoreLoading(false);
    }
  };

  const getRiskLevel = (score: number): RiskLevel => {
    if (score >= 80) return { 
      level: 'Excellent', 
      color: '#10B981', 
      gradient: ['#10B981', '#059669'],
      icon: '🛡️'
    };
    if (score >= 60) return { 
      level: 'Good', 
      color: '#F59E0B', 
      gradient: ['#F59E0B', '#D97706'],
      icon: '⚠️'
    };
    return { 
      level: 'Needs Attention', 
      color: '#EF4444', 
      gradient: ['#EF4444', '#DC2626'],
      icon: '🚨'
    };
  };

  const handleStartTrip = () => {
    navigation.navigate('TripMonitor' as never);
  };

  if (loading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  const riskData = driscScore ? getRiskLevel(driscScore.score) : null;
  const tripsCount = driscScore?.tripsConsidered || driscScore?.trips_considered || 0;
  const scorePercentage = driscScore?.score || 0;

  return (
    <View style={dashboardStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667EEA" />
      
      <AnimatedHeader
        userData={userData}
        driscScore={driscScore}
        riskData={riskData}
        scoreLoading={scoreLoading}
        numberOfTrips={numberOfTrips}
        onTripsChange={handleTripsChange}
        scrollY={scrollY}
        headerMaxHeight={HEADER_MAX_HEIGHT}
        headerMinHeight={HEADER_MIN_HEIGHT}
        headerScrollDistance={HEADER_SCROLL_DISTANCE}
      />

      <Animated.ScrollView 
        style={dashboardStyles.scrollContainer}
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT + 24 }}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <QuickActions onStartTrip={handleStartTrip} />
        
        <StatsCards 
          tripsCount={tripsCount}
          scorePercentage={scorePercentage}
        />

        <RiskAnalysisCard 
          riskData={riskData}
          scorePercentage={scorePercentage}
        />

        <InsightsCard 
          scorePercentage={scorePercentage}
          numberOfTrips={numberOfTrips}
        />

        <ProfileCard userData={userData} />
        
        <View style={dashboardStyles.bottomSpacer} />
      </Animated.ScrollView>
    </View>
  );
};

export default Dashboard;








// Additional component files would follow similar patterns...

// Complete folder structure:
/*
src/
├── components/
│   ├── common/
│   │   └── LoadingScreen/
│   │       ├── LoadingScreen.tsx
│   │       └── LoadingScreen.styles.ts
│   └── dashboard/
│       ├── AnimatedHeader/
│       │   ├── AnimatedHeader.tsx
│       │   └── AnimatedHeader.styles.ts
│       ├── QuickActions/
│       │   ├── QuickActions.tsx
│       │   └── QuickActions.styles.ts
│       ├── StatsCards/
│       │   ├── StatsCards.tsx
│       │   └── StatsCards.styles.ts
│       ├── RiskAnalysisCard/
│       │   ├── RiskAnalysisCard.tsx
│       │   └── RiskAnalysisCard.styles.ts
│       ├── InsightsCard/
│       │   ├── InsightsCard.tsx
│       │   └── InsightsCard.styles.ts
│       ├── ProfileCard/
│       │   ├── ProfileCard.tsx
│       │   └── ProfileCard.styles.ts
│       └── TripSelector/
│           ├── TripSelector.tsx
│           └── TripSelector.styles.ts
├── screens/
│   └── Dashboard/
│       └── Dashboard.tsx
├── styles/
│   ├── common/
│   │   └── common.styles.ts
│   └── dashboard/
│       └── dashboard.styles.ts
├── types/
│   ├── dashboard.types.ts
│   └── common.types.ts
└── utils/
    └── dashboard/
        └── dashboard.utils.ts
*/







