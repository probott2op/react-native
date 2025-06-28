// 2. TripSelector Styles (src/components/dashboard/TripSelector/TripSelector.styles.ts)
import { StyleSheet } from 'react-native';

export const tripSelectorStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  label: {
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
});
