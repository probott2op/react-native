import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {dashboardClient} from '../../api/Dashboard';
import { useNavigation } from '@react-navigation/native';
import { User } from '@/src/types/User';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface DriscScore {
  score: number;
  tripsConsidered?: number;
  trips_considered?: number;
}

interface RiskLevel {
  level: string;
  color: string;
  gradient: string[];
  icon: string;
}

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [driscScore, setDriscScore] = useState<DriscScore | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [scoreLoading, setScoreLoading] = useState<boolean>(false);
  const [numberOfTrips, setNumberOfTrips] = useState<number>(1);
  const navigation = useNavigation();
  const {user, logout, token} = useAuth();
  
  // Animation values for collapsible header
  const scrollY = useRef(new Animated.Value(0)).current;
  const HEADER_MAX_HEIGHT = 320;
  const HEADER_MIN_HEIGHT = 120;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    const fetchData = async () => {
      try {
        if (!user?.userId) {
          logout();
          router.replace('/');
          return;
        }
        const currentUser = user.userId;
        if (token){
        const score = await dashboardClient.getDriscScore(currentUser, numberOfTrips, token);
        setUserData(user);
        setDriscScore(score);
        console.log('DRISC Score data:', score);
        }
        else{
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

    fetchData();
  }, [numberOfTrips]);

  const handleTripsChange = async (newN: number) => {
    setNumberOfTrips(newN);
    setScoreLoading(true);

    try {
      const currentUser = user?.userId
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
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#667EEA', '#764BA2']}
          style={StyleSheet.absoluteFill}
        />
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  const riskData = driscScore ? getRiskLevel(driscScore.score) : null;
  const tripsCount = driscScore?.tripsConsidered || driscScore?.trips_considered || 0;
  const scorePercentage = driscScore?.score || 0;

  // Animated header height
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  // Animated opacity for welcome section only
  const welcomeOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.7, 0],
    extrapolate: 'clamp',
  });

  // Animated scale for score circle
  const scoreScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.7],
    extrapolate: 'clamp',
  });

  // Animated translation for compact score
  const compactScoreTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -30],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667EEA" />
      
      {/* Animated Hero Header */}
      <Animated.View style={[styles.heroHeader, { height: headerHeight }]}>
        <LinearGradient
          colors={['#667EEA', '#764BA2']}
          style={StyleSheet.absoluteFill}
        />
        
        {/* Fixed Header Content - Only welcome section fades */}
        <View style={styles.fixedHeaderContent}>
          <Animated.View style={[styles.headerContent, { opacity: welcomeOpacity }]}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.userNameHeader}>{userData?.fullName || 'Driver'}</Text>
            </View>
            
            <TouchableOpacity style={styles.avatarButton}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {userData?.fullName?.charAt(0) || '👤'}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Score Section - No opacity animation, stays visible */}
        <View style={styles.scoreSection}>
          <Animated.View style={[styles.mainScoreContainer, { transform: [{ scale: scoreScale }] }]}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>
                {scoreLoading ? '...' : Math.round(scorePercentage)}
              </Text>
              <Text style={styles.scoreLabel}>DRISC Score</Text>
            </View>
            
            <View style={styles.riskLevelBadge}>
              <Text style={styles.riskIcon}>{riskData?.icon}</Text>
              <Text style={styles.riskLevelText}>{riskData?.level}</Text>
            </View>
          </Animated.View>
        </View>

        {/* Trip Selector - Fixed position at bottom of header */}
        <View style={styles.tripSelectorFixed}>
          <Text style={styles.tripSelectorLabel}>Analysis Period</Text>
          <View style={styles.modernPickerContainer}>
            <View style={styles.pickerBackground}>
              <Picker
                selectedValue={numberOfTrips}
                onValueChange={(value) => handleTripsChange(value)}
                style={styles.modernPicker}
                dropdownIconColor="#FFFFFF"
                mode="dropdown"
              >
                {[1, 2, 3, 4, 5, 10, 15, 20, 25, 30].map(num => (
                  <Picker.Item 
                    key={num} 
                    label={`Last ${num} trip${num !== 1 ? 's' : ''}`} 
                    value={num}
                    style={styles.pickerItem}
                  />
                ))}
              </Picker>
              <View style={styles.pickerIconContainer}>
                <Text style={styles.pickerIcon}>▼</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Compact Score (visible when scrolled) */}
        <Animated.View 
          style={[
            styles.compactScore,
            {
              opacity: scrollY.interpolate({
                inputRange: [HEADER_SCROLL_DISTANCE * 0.5, HEADER_SCROLL_DISTANCE],
                outputRange: [0, 1],
                extrapolate: 'clamp',
              }),
              transform: [{ translateY: compactScoreTranslateY }]
            }
          ]}
        >
          <Text style={styles.compactScoreNumber}>
            {scoreLoading ? '...' : Math.round(scorePercentage)}
          </Text>
          <Text style={styles.compactScoreLabel}>DRISC</Text>
          <View style={[styles.compactRiskDot, { backgroundColor: riskData?.color }]} />
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT + 24 }}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleStartTrip}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionIcon}>🚗</Text>
              <Text style={styles.actionText}>Start Live Trip</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionText}>View History</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.statCardLeft]}>
              <Text style={styles.statNumber}>{tripsCount}</Text>
              <Text style={styles.statLabel}>Trips Analyzed</Text>
              <View style={styles.statIcon}>
                <Text style={styles.statIconText}>🛣️</Text>
              </View>
            </View>
            
            <View style={[styles.statCard, styles.statCardRight]}>
              <Text style={styles.statNumber}>
                {scorePercentage > 70 ? Math.round((100 - scorePercentage) * 0.8) : 0}%
              </Text>
              <Text style={styles.statLabel}>Premium Savings</Text>
              <View style={styles.statIcon}>
                <Text style={styles.statIconText}>💰</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Risk Analysis Card */}
        <View style={styles.analysisCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Risk Analysis</Text>
            <View style={[styles.statusDot, { backgroundColor: riskData?.color }]} />
          </View>
          
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${scorePercentage}%`,
                    backgroundColor: riskData?.color 
                  }
                ]} 
              />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressStart}>0</Text>
              <Text style={styles.progressEnd}>100</Text>
            </View>
          </View>

          <View style={styles.riskFactors}>
            {[
              { name: 'Speed Control', status: 'Good', color: '#10B981', icon: '🏎️' },
              { name: 'Smooth Braking', status: 'Fair', color: '#F59E0B', icon: '🛑' },
              { name: 'Cornering', status: 'Excellent', color: '#10B981', icon: '🔄' },
              { name: 'Focus Level', status: 'Good', color: '#10B981', icon: '👁️' },
            ].map((factor, index) => (
              <View key={index} style={styles.riskFactor}>
                <View style={styles.factorLeft}>
                  <Text style={styles.factorIcon}>{factor.icon}</Text>
                  <Text style={styles.factorName}>{factor.name}</Text>
                </View>
                <View style={[styles.factorBadge, { backgroundColor: factor.color }]}>
                  <Text style={styles.factorStatus}>{factor.status}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Insights Card */}
        <View style={styles.insightsCard}>
          <Text style={styles.cardTitle}>Smart Insights</Text>
          
          <View style={styles.insightItem}>
            <View style={styles.insightIcon}>
              <Text style={styles.insightEmoji}>🎯</Text>
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>
                {scorePercentage >= 80 ? 'Excellent Driving!' : 
                 scorePercentage >= 60 ? 'Room for Improvement' : 'Focus on Safety'}
              </Text>
              <Text style={styles.insightText}>
                {scorePercentage >= 80 ? 'Your driving patterns show excellent safety awareness.' :
                 scorePercentage >= 60 ? 'Small improvements can boost your score significantly.' :
                 'Consider more cautious driving for better results.'}
              </Text>
            </View>
          </View>

          <View style={styles.insightItem}>
            <View style={styles.insightIcon}>
              <Text style={styles.insightEmoji}>📈</Text>
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Data Accuracy</Text>
              <Text style={styles.insightText}>
                {numberOfTrips >= 10 ? 'High accuracy with sufficient data points.' :
                 `Analyze ${10 - numberOfTrips} more trips for better insights.`}
              </Text>
            </View>
          </View>
        </View>

        {/* Profile Summary */}
        <View style={styles.profileCard}>
          <Text style={styles.cardTitle}>Driver Profile</Text>
          
          <View style={styles.profileDetails}>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Vehicle</Text>
              <Text style={styles.profileValue}>{userData?.vehicleNo || 'Not set'}</Text>
            </View>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Driver ID</Text>
              <Text style={styles.profileValue}>#{userData?.userId || '---'}</Text>
            </View>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Email</Text>
              <Text style={styles.profileValue}>{userData?.email || 'Not available'}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  heroHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    overflow: 'hidden',
  },
  fixedHeaderContent: {
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  mainScoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  userNameHeader: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  avatarButton: {
    padding: 4,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  scoreNumber: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  riskLevelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  riskIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  riskLevelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tripSelector: {
    alignItems: 'center',
  },
  // tripSelectorLabel: {
  //   fontSize: 14,
  //   color: 'rgba(255, 255, 255, 0.8)',
  //   marginBottom: 8,
  // },
  // pickerWrapper: {
  //   backgroundColor: 'rgba(255, 255, 255, 0.15)',
  //   borderRadius: 12,
  //   paddingHorizontal: 16,
  //   minWidth: 200,
  // },
  // modernPicker: {
  //   color: '#FFFFFF',
  //   fontWeight: '600',
  // },
  compactScore: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  compactScoreNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  compactScoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  compactRiskDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  statCardLeft: {},
  statCardRight: {},
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIconText: {
    fontSize: 18,
  },
  analysisCard: {
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
  insightsCard: {
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
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  insightEmoji: {
    fontSize: 24,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  profileCard: {
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
  bottomSpacer: {
    height: 40,
  },

  tripSelectorFixed: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  tripSelectorLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  modernPickerContainer: {
    width: '100%',
    maxWidth: 280,
  },
  pickerBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 4,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  modernPicker: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  pickerItem: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  pickerIconContainer: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -8 }],
    pointerEvents: 'none',
  },
  pickerIcon: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
  },

  // Update the existing pickerWrapper style (if you want to keep it as fallback):
  pickerWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 4,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default Dashboard;