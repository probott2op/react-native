import {User} from '../types/User';
import {AxiosResponse} from 'axios';
import {dashboardClient} from '../api/Dashboard';
class UserService
{
    static async getUserDetails(userId: string, token: string): Promise<User | null> {
        try {
        const response: AxiosResponse = await dashboardClient.getUser(userId, token);
        return response.data;
        } catch (error) {
        console.error('Error fetching user details:', error);
        return null;
        }
    }
}

export default UserService;