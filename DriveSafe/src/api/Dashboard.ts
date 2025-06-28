import axios from 'axios';
import { User } from '../types/User';


const API_BASE_URL = 'http://192.168.1.9:8080/api';

class dashboardApi {
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

    // User endpoints
  async getUser(userid: string, token: string): Promise<any> {
    return this.handleRequest(
      axios.get(`${this.baseURL}/user/${userid}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    );
  }

  async getDriscScore(userid: string, trips: number, token: string): Promise<any> {
    return this.handleRequest(
      axios.get(`${this.baseURL}/drisc-score/${userid}`, {
        params: { N: trips },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    );
  }
}

export const dashboardClient = new dashboardApi(API_BASE_URL);