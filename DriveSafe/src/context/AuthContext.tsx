// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/client';
import { AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { MyJwtPayload } from '../types/JwtPayload';
import { User } from '../types/User';
import UserService from '../services/UserService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, chassisNo: string, vehicleNo: string, drivingLicense: string, model: string, manufacturer: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');
      const expiresAt = storedUser ? JSON.parse(storedUser).exp : null;
      if (storedToken && storedUser && !isTokenexpired(expiresAt)) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isTokenexpired = (exp: number): boolean => {
    return Date.now() > exp * 1000;
  };

  const login = async (email: string, password: string) => {
    try {
      const response: AxiosResponse = await apiClient.login(email, password);

      if (response.status !== 200) {
        throw new Error('Login failed');
      }

      const data = response.data;
      await AsyncStorage.setItem('authToken', data);
      const decoded = jwtDecode(data) as MyJwtPayload;
      setToken(data);
      if (data) {
        const user = await UserService.getUserDetails(decoded.userId, data);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        setUser(user);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (fullName: string, email: string, password: string, chassisNo: string, vehicleNo: string, drivingLicense: string, model: string, manufacturer: string) => {
    try {
      const response: AxiosResponse = await apiClient.register(fullName, email, password, chassisNo, vehicleNo, drivingLicense, model, manufacturer);

      if (response.status !== 200) {
        throw new Error('Registration failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};