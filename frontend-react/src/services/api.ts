import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  SensorData,
  SensorReading,
  SystemStatus,
  AnalysisRequest,
  AnalysisResults,
  Alert,
  HistoricalData,
  ApiError,
} from '../types';

// Create axios instance with default config
const createApiClient = (): AxiosInstance => {
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  
  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error('API Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`API Response: ${response.status} ${response.config.url}`);
      return response;
    },
    (error) => {
      console.error('API Response Error:', error);
      
      const apiError: ApiError = {
        message: error.response?.data?.detail || error.message || 'An error occurred',
        status: error.response?.status,
        code: error.code,
      };
      
      return Promise.reject(apiError);
    }
  );

  return client;
};

const api = createApiClient();

// Health Check
export const healthCheck = async (): Promise<any> => {
  const response = await api.get('/api/health');
  return response.data;
};

// System Status
export const getSystemStatus = async (): Promise<SystemStatus> => {
  const response = await api.get('/api/system/status');
  return response.data;
};

// Sensor Data APIs
export const getLatestSensorData = async (): Promise<SensorData> => {
  const response = await api.get('/api/sensors/latest');
  return response.data;
};

export const getSensorData = async (deviceId: string): Promise<SensorReading> => {
  const response = await api.get(`/api/sensors/${deviceId}`);
  return response.data;
};

export const sendSensorData = async (sensorReading: SensorReading): Promise<any> => {
  const response = await api.post('/api/sensors/data', sensorReading);
  return response.data;
};

// Analysis APIs
export const runAnalysis = async (request: AnalysisRequest): Promise<any> => {
  const response = await api.post('/api/analysis/run', request);
  return response.data;
};

export const getAnalysisResults = async (): Promise<AnalysisResults | null> => {
  try {
    const response = await api.get('/api/analysis/results');
    
    // Check if there are no results
    if (response.data.status === 'no_results') {
      return null;
    }
    
    return response.data;
  } catch (error: any) {
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
};

// Alert APIs
export const getAlerts = async (): Promise<Alert[]> => {
  const response = await api.get('/api/alerts');
  return response.data;
};

export const createAlert = async (alert: Omit<Alert, 'alert_id'>): Promise<any> => {
  const alertWithId = {
    ...alert,
    alert_id: `alert_${Date.now()}`,
  };
  const response = await api.post('/api/alerts', alertWithId);
  return response.data;
};

export const dismissAlert = async (alertId: string): Promise<any> => {
  const response = await api.delete(`/api/alerts/${alertId}`);
  return response.data;
};

// Historical Data API
export const getHistoricalData = async (
  deviceId?: string,
  startDate?: string,
  endDate?: string,
  limit: number = 100
): Promise<HistoricalData> => {
  const params: Record<string, any> = { limit };
  
  if (deviceId) params.device_id = deviceId;
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;

  const response = await api.get('/api/data/history', { params });
  return response.data;
};

// MQTT Integration API
export const sendMqttData = async (data: Record<string, any>): Promise<any> => {
  const response = await api.post('/api/mqtt/sensor', data);
  return response.data;
};

// Utility functions
export const isApiError = (error: any): error is ApiError => {
  return error && typeof error.message === 'string';
};

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

// Test connection function
export const testConnection = async (): Promise<boolean> => {
  try {
    await healthCheck();
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};

export default api;