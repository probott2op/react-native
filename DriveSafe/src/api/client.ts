// src/api/client.ts
import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.9:8080/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async handleRequest<T>(request: Promise<any>): Promise<T> {
    try {
      const response = await request;
      return response;
    } catch (error: any) {
      console.error('API request failed:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Authentication failed');
      }
      
      throw new Error(`HTTP error! status: ${error.response?.status || 'Network error'}`);
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<any> {
    return this.handleRequest(
      axios.post(`${this.baseURL}/login`, { 'email': email, 'password': password })
    );
  }

  async register(
    fullName: string, 
    email: string, 
    password: string, 
    chassisNo: string, 
    vehicleNo: string, 
    drivingLicense: string, 
    model: string, 
    manufacturer: string
  ): Promise<any> {
    return this.handleRequest(
      axios.post(`${this.baseURL}/register`, {
        'fullName': fullName,
        'email': email,
        'password': password,
        'chasisNo': chassisNo,
        'vehicleNo': vehicleNo,
        'drivingLicense': drivingLicense,
        'model': model,
        'manufacturer': manufacturer
      })
    );
  }
}

export const apiClient = new ApiClient(API_BASE_URL);