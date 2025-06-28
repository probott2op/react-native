// src/app/register.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

// Step 1: Personal Details Component
type PersonalDetailsStepProps = {
  data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    drivingLicense: string;
    [key: string]: string;
  };
  onDataChange: (field: string, value: string) => void;
  onNext: () => void;
};

const PersonalDetailsStep: React.FC<PersonalDetailsStepProps> = ({ data, onDataChange, onNext }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePersonalDetails = () => {
    if (!data.fullName || !data.email || !data.password || !data.confirmPassword || !data.drivingLicense) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (data.password !== data.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (data.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validatePersonalDetails()) {
      onNext();
    }
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={data.fullName}
          onChangeText={(text) => onDataChange('fullName', text)}
          autoCapitalize="words"
          autoComplete="name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={data.email}
          onChangeText={(text) => onDataChange('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Driving License Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your driving license number"
          value={data.drivingLicense}
          onChangeText={(text) => onDataChange('drivingLicense', text)}
          autoCapitalize="characters"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Create a password"
            value={data.password}
            onChangeText={(text) => onDataChange('password', text)}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm your password"
            value={data.confirmPassword}
            onChangeText={(text) => onDataChange('confirmPassword', text)}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

// Step 2: Vehicle Details Component
type VehicleDetailsStepProps = {
  data: {
    chassisNo: string;
    vehicleNo: string;
    model: string;
    manufacturer: string;
    [key: string]: string;
  };
  onDataChange: (field: string, value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
};

const VehicleDetailsStep: React.FC<VehicleDetailsStepProps> = ({ data, onDataChange, onBack, onSubmit, isLoading }) => {
  const validateVehicleDetails = () => {
    if (!data.chassisNo || !data.vehicleNo || !data.model || !data.manufacturer) {
      Alert.alert('Error', 'Please fill in all vehicle details');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateVehicleDetails()) {
      onSubmit();
    }
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Vehicle Information</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Vehicle Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your vehicle number (e.g., KA01AB1234)"
          value={data.vehicleNo}
          onChangeText={(text) => onDataChange('vehicleNo', text)}
          autoCapitalize="characters"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Chassis Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your vehicle chassis number"
          value={data.chassisNo}
          onChangeText={(text) => onDataChange('chassisNo', text)}
          autoCapitalize="characters"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Manufacturer</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter vehicle manufacturer (e.g., Honda, Toyota)"
          value={data.manufacturer}
          onChangeText={(text) => onDataChange('manufacturer', text)}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Model</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter vehicle model (e.g., City, Camry)"
          value={data.model}
          onChangeText={(text) => onDataChange('model', text)}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#007AFF" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.registerButton, isLoading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.registerButtonText}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Progress Indicator Component
type ProgressIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <View style={styles.progressContainer}>
      <Text style={styles.progressText}>Step {currentStep} of {totalSteps}</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(currentStep / totalSteps) * 100}%` }]} />
      </View>
    </View>
  );
};

// Main Register Screen Component
export default function RegisterScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    drivingLicense: '',
    chassisNo: '',
    vehicleNo: '',
    model: '',
    manufacturer: '',
  });

  const { register } = useAuth();

  const handleDataChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      await register(
        formData.fullName, 
        formData.email, 
        formData.password, 
        formData.chassisNo, 
        formData.vehicleNo, 
        formData.drivingLicense, 
        formData.model, 
        formData.manufacturer
      );
      router.replace('/');
    } catch (error) {
      Alert.alert('Registration Failed', 'Unable to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <ProgressIndicator currentStep={currentStep} totalSteps={2} />

        {currentStep === 1 ? (
          <PersonalDetailsStep
            data={formData}
            onDataChange={handleDataChange}
            onNext={handleNext}
          />
        ) : (
          <VehicleDetailsStep
            data={formData}
            onDataChange={handleDataChange}
            onBack={handleBack}
            onSubmit={handleRegister}
            isLoading={isLoading}
          />
        )}

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Link href="/" asChild>
            <TouchableOpacity>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e1e5e9',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 2,
  },
  stepContainer: {
    width: '100%',
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1a1a1a',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1a1a1a',
  },
  eyeIcon: {
    padding: 16,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  backButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    flex: 2,
    backgroundColor: '#28a745',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 16,
  },
  loginLink: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});