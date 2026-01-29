import axios from 'axios';
import { metricsManager } from './metrics';

// Create an instance with default config
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api', // Use env var in prod, proxy in dev
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
    const requestId = Math.random().toString(36).substring(7);
    (config as any).metadata = { requestId };
    metricsManager.startRequest(requestId);
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
        return Promise.reject(error);
    }
);

export default api;
