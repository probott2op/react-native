// 1. TripSelector Component (src/components/dashboard/TripSelector/TripSelector.tsx)
import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { tripSelectorStyles } from './TripSelector.styles';

interface TripSelectorProps {
  numberOfTrips: number;
  onTripsChange: (trips: number) => void;
}

const TripSelector: React.FC<TripSelectorProps> = ({ numberOfTrips, onTripsChange }) => {
  return (
    <View style={tripSelectorStyles.container}>
      <Text style={tripSelectorStyles.label}>Analysis Period</Text>
      <View style={tripSelectorStyles.modernPickerContainer}>
        <View style={tripSelectorStyles.pickerBackground}>
          <Picker
            selectedValue={numberOfTrips}
            onValueChange={(value) => onTripsChange(value)}
            style={tripSelectorStyles.modernPicker}
            dropdownIconColor="#FFFFFF"
            mode="dropdown"
          >
            {[1, 2, 3, 4, 5, 10, 15, 20, 25, 30].map(num => (
              <Picker.Item 
                key={num} 
                label={`Last ${num} trip${num !== 1 ? 's' : ''}`} 
                value={num}
                style={tripSelectorStyles.pickerItem}
              />
            ))}
          </Picker>
          <View style={tripSelectorStyles.pickerIconContainer}>
            <Text style={tripSelectorStyles.pickerIcon}>▼</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TripSelector;

