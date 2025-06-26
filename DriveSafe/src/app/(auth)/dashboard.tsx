import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserService from '../../api/Dashboard';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface UserData {
  fullName: string;
  email: string;
  vehicleNo: string;
  userId: string;
}

interface DriscScore {
  score: number;
  tripsConsidered?: number;
  trips_considered?: number;
}

interface RiskLevel {
  level: string;
  color: string;
  symbol: string;
}

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [driscScore, setDriscScore] = useState<DriscScore | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [scoreLoading, setScoreLoading] = useState<boolean>(false);
  const [numberOfTrips, setNumberOfTrips] = useState<number>(1);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await AsyncStorage.getItem('userId');
        if (currentUser) {
          const [user, score] = await Promise.all([
            UserService.getUserById(currentUser),
            UserService.getDriscScore(currentUser, numberOfTrips)
          ]);
          setUserData(user);
          setDriscScore(score);
          console.log('DRISC Score data:', score);
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
      const currentUser = await AsyncStorage.getItem('userId');
      if (currentUser) {
        const score = await UserService.getDriscScore(currentUser, newN);
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
    if (score >= 80) return { level: 'Low', color: '#10b981', symbol: '✓' };
    if (score >= 60) return { level: 'Medium', color: '#f59e0b', symbol: '⚠' };
    return { level: 'High', color: '#ef4444', symbol: '⚠' };
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const handleStartTrip = () => {
    navigation.navigate('TripMonitor' as never);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  const riskData = driscScore ? getRiskLevel(driscScore.score) : null;
  const tripsCount = driscScore?.tripsConsidered || driscScore?.trips_considered || 0;

  const StatCard: React.FC<{
    title: string;
    value: string;
    subtitle: string;
    icon: string;
    color: string;
    children?: React.ReactNode;
  }> = ({ title, value, subtitle, icon, color, children }) => (
    <View style={[styles.statCard, scoreLoading && styles.loadingOpacity]}>
      <View style={styles.statCardHeader}>
        <View>
          <Text style={styles.statCardTitle}>{title}</Text>
          <Text style={[styles.statCardValue, { color }]}>{value}</Text>
        </View>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
      </View>
      {children}
      <View style={styles.statCardFooter}>
        <Text style={styles.statCardSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );

  const RiskFactorItem: React.FC<{
    icon: string;
    label: string;
    level: string;
    color: string;
  }> = ({ icon, label, level, color }) => (
    <View style={styles.riskFactorItem}>
      <View style={styles.riskFactorLeft}>
        <Text style={styles.riskFactorIcon}>{icon}</Text>
        <Text style={styles.riskFactorLabel}>{label}</Text>
      </View>
      <View style={[styles.riskFactorBadge, { backgroundColor: color }]}>
        <Text style={styles.riskFactorBadgeText}>{level}</Text>
      </View>
    </View>
  );

  const RecommendationCard: React.FC<{
    icon: string;
    title: string;
    message: string;
    color: string;
  }> = ({ icon, title, message, color }) => (
    <View style={[styles.recommendationCard, { backgroundColor: `${color}10`, borderColor: `${color}20` }]}>
      <Text style={styles.recommendationIcon}>{icon}</Text>
      <View style={styles.recommendationContent}>
        <Text style={[styles.recommendationTitle, { color }]}>{title}</Text>
        <Text style={styles.recommendationMessage}>{message}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Risk Scoring Dashboard</Text>
          <Text style={styles.headerSubtitle}>Monitor and analyze driving risk metrics</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.tripButton} onPress={handleStartTrip}>
            <Text style={styles.tripButtonText}>🚗 Show Live Trip</Text>
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Text style={styles.userInfoText}>
              👤 {userData?.fullName || 'Loading...'}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="DRISC SCORE"
          value={scoreLoading ? '...' : (driscScore?.score?.toFixed(1) || '0.0')}
          subtitle="📈 Risk assessment"
          icon="📊"
          color={getScoreColor(driscScore?.score || 0)}
        >
          <View style={styles.tripsSelector}>
            <View style={styles.tripsSelectorRow}>
              <Text style={styles.tripsSelectorLabel}>Number of trips:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={numberOfTrips}
                  onValueChange={(value) => handleTripsChange(value)}
                  style={styles.picker}
                  enabled={!scoreLoading}
                >
                  {[1, 2, 3, 4, 5, 10, 15, 20, 25, 30].map(num => (
                    <Picker.Item key={num} label={`N = ${num}`} value={num} />
                  ))}
                </Picker>
              </View>
            </View>
            <Text style={styles.tripsSelectorSubtext}>
              {scoreLoading ? 'Calculating...' : `Based on last ${numberOfTrips} trip${numberOfTrips !== 1 ? 's' : ''}`}
            </Text>
          </View>
        </StatCard>

        <StatCard
          title="RISK LEVEL"
          value={riskData?.level || 'N/A'}
          subtitle="🛡 Current status"
          icon={riskData?.symbol || '🛡'}
          color={riskData?.color || '#9ca3af'}
        />

        <StatCard
          title="TRIPS ANALYZED"
          value={tripsCount.toString()}
          subtitle={`🕒 ${tripsCount > 0 ? 'Data points collected' : 'No trips recorded'}`}
          icon="🚗"
          color="#3b82f6"
        />

        <StatCard
          title="PREMIUM IMPACT"
          value={driscScore?.score ? `${100 - driscScore.score}% Saved` : '0% Saved'}
          subtitle="📉 Estimated savings"
          icon="💰"
          color="#10b981"
        />
      </View>

      {/* User Profile */}
      <View style={styles.card}>
        <View style={styles.userProfile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View>
            <Text style={styles.userName}>{userData?.fullName || 'Loading...'}</Text>
            <Text style={styles.userEmail}>{userData?.email || 'Loading...'}</Text>
          </View>
        </View>

        <View style={styles.userDetails}>
          {[
            { icon: '🚗', label: 'Vehicle', value: userData?.vehicleNo || 'Loading...' },
            { icon: '📍', label: 'User ID', value: `#${userData?.userId || 'Loading...'}` },
            { icon: '🛣️', label: 'Total Trips', value: `${tripsCount} trips` }
          ].map((item, index) => (
            <View key={index} style={[styles.userDetailItem, index > 0 && styles.userDetailBorder]}>
              <View style={styles.userDetailLeft}>
                <Text style={styles.userDetailIcon}>{item.icon}</Text>
                <Text style={styles.userDetailLabel}>{item.label}</Text>
              </View>
              <Text style={styles.userDetailValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Risk Analysis */}
      <View style={styles.card}>
        <View style={styles.riskAnalysisHeader}>
          <Text style={styles.cardTitle}>Risk Analysis</Text>
          <View style={styles.riskBadges}>
            {[
              { label: 'Safe', color: '#10b981' },
              { label: 'Moderate', color: '#f59e0b' },
              { label: 'High Risk', color: '#ef4444' }
            ].map((badge, index) => (
              <View key={index} style={[styles.riskBadge, { backgroundColor: badge.color }]}>
                <Text style={styles.riskBadgeText}>{badge.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Score Visualization */}
        <View style={styles.scoreVisualization}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreLabel}>Overall Risk Score</Text>
            <Text style={[styles.scoreValue, { color: getScoreColor(driscScore?.score || 0) }]}>
              {driscScore?.score?.toFixed(1) || '0.0'}/100
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${driscScore?.score || 0}%`, 
                  backgroundColor: getScoreColor(driscScore?.score || 0) 
                }
              ]} 
            />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>
              Based on {numberOfTrips} trip{numberOfTrips !== 1 ? 's' : ''}
            </Text>
            <Text style={styles.progressLabel}>
              {numberOfTrips < 5 ? 'More trips needed for accuracy' : 'Sufficient data'}
            </Text>
          </View>
        </View>

        {/* Risk Factors */}
        <View style={styles.riskFactors}>
          <Text style={styles.sectionTitle}>Risk Factors</Text>
          <View style={styles.riskFactorsList}>
            <RiskFactorItem icon="🏎" label="Speeding Events" level="Low" color="#10b981" />
            <RiskFactorItem icon="🛑" label="Hard Braking" level="Moderate" color="#f59e0b" />
            <RiskFactorItem icon="🔄" label="Sharp Turns" level="Low" color="#10b981" />
            <RiskFactorItem icon="🌙" label="Night Driving" level="Normal" color="#3b82f6" />
          </View>
        </View>
      </View>

      {/* Recommendations */}
      <View style={[styles.card, styles.lastCard]}>
        <Text style={styles.cardTitle}>Recommendations</Text>
        <View style={styles.recommendationsList}>
          <RecommendationCard
            icon={numberOfTrips >= 5 ? "✅" : "ℹ️"}
            title={numberOfTrips >= 5 ? "Good Score!" : "Getting Started"}
            message={numberOfTrips >= 5
              ? "Your driving behavior shows low risk patterns."
              : `Try increasing N to ${Math.min(numberOfTrips + 2, 10)} for more comprehensive scoring.`}
            color={numberOfTrips >= 5 ? '#3b82f6' : '#06b6d4'}
          />
          <RecommendationCard
            icon="⚠️"
            title="Data Analysis"
            message={numberOfTrips < 10
              ? "Consider analyzing more trips for better accuracy."
              : "Your data is comprehensive for analysis."}
            color="#f59e0b"
          />
          <RecommendationCard
            icon="💰"
            title="Premium Benefits"
            message={numberOfTrips >= 5
              ? "Eligible for reduced insurance premiums."
              : "Analyze more trips to unlock premium benefits."}
            color="#10b981"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  headerActions: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  tripButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  userInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  userInfoText: {
    fontWeight: '600',
    color: '#1f2937',
  },
  statsGrid: {
    padding: 20,
    gap: 16,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 8,
  },
  loadingOpacity: {
    opacity: 0.7,
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  statCardValue: {
    fontSize: 36,
    fontWeight: '700',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  statCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  statCardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  tripsSelector: {
    marginVertical: 16,
  },
  tripsSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tripsSelectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  pickerContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minWidth: 100,
  },
  picker: {
    height: 40,
  },
  tripsSelectorSubtext: {
    fontSize: 12,
    color: '#6b7280',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lastCard: {
    marginBottom: 32,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 24,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    color: 'white',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  userDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 20,
  },
  userDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  userDetailBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  userDetailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userDetailIcon: {
    fontSize: 16,
  },
  userDetailLabel: {
    fontWeight: '500',
    color: '#374151',
  },
  userDetailValue: {
    color: '#1f2937',
    fontWeight: '600',
  },
  riskAnalysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  riskBadges: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  riskBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  scoreVisualization: {
    marginBottom: 32,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreLabel: {
    fontWeight: '500',
    color: '#374151',
  },
  scoreValue: {
    fontWeight: '700',
    fontSize: 16,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
  riskFactors: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  riskFactorsList: {
    gap: 12,
  },
  riskFactorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  riskFactorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  riskFactorIcon: {
    fontSize: 16,
  },
  riskFactorLabel: {
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  riskFactorBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  riskFactorBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  recommendationsList: {
    gap: 20,
  },
  recommendationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  recommendationIcon: {
    fontSize: 24,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  recommendationMessage: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});

export default Dashboard;