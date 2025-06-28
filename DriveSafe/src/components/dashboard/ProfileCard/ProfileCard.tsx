// 9. ProfileCard Component (src/components/dashboard/ProfileCard/ProfileCard.tsx)
import React from 'react';
import { View, Text } from 'react-native';
import { User } from '@/src/types/User';
import { profileCardStyles } from './ProfileCard.styles';

interface ProfileCardProps {
  userData: User | null;
}

interface ProfileRowData {
  label: string;
  value: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ userData }) => {
  const profileRows: ProfileRowData[] = [
    {
      label: 'Vehicle',
      value: userData?.vehicleNo || 'Not set'
    },
    {
      label: 'Driver ID',
      value: `#${userData?.userId || '---'}`
    },
    {
      label: 'Email',
      value: userData?.email || 'Not available'
    }
  ];

  return (
    <View style={profileCardStyles.container}>
      <Text style={profileCardStyles.cardTitle}>Driver Profile</Text>
      
      <View style={profileCardStyles.profileDetails}>
        {profileRows.map((row, index) => (
          <View key={index} style={profileCardStyles.profileRow}>
            <Text style={profileCardStyles.profileLabel}>{row.label}</Text>
            <Text style={profileCardStyles.profileValue}>{row.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ProfileCard;

