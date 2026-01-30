import axios from 'axios';
import { metricsManager } from './metrics';
import { auth } from '../firebase/config';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication interceptor - inject Firebase token
api.interceptors.request.use(async (config) => {
    const requestId = Math.random().toString(36).substring(7);
    (config as any).metadata = { requestId };
    metricsManager.startRequest(requestId);
    
    // Get current user token and add to Authorization header
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Failed to get auth token:', error);
      }
    }
    
    return config;
});

api.interceptors.response.use(
    response => {
        const { requestId } = (response.config as any).metadata;
        metricsManager.endRequest(requestId, 'system', false);
        return response;
    },
    error => {
        const { requestId } = (error.config as any).metadata || {};
        if (requestId) {
            metricsManager.endRequest(requestId, 'system', true);
        }
        
        // Handle authentication errors
        if (error.response?.status === 401) {
            console.error('Authentication failed - redirecting to login');
            // Redirect to login page
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

export default api;
