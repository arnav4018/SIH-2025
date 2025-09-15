// Sensor Data Types
export interface SensorReading {
  device_id: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  soil_moisture: number;
  ph_level: number;
  light_intensity?: number;
  battery_level?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface SensorData {
  timestamp: string;
  devices: SensorReading[];
}

// System Status Types
export interface SystemStatus {
  status: string;
  matlab_engine_status: string;
  connected_devices: number;
  last_analysis_time?: string;
  uptime_seconds: number;
}

// Analysis Types
export interface AnalysisRequest {
  include_hyperspectral?: boolean;
  analysis_function?: string;
  force_refresh?: boolean;
}

export interface AnalysisResults {
  timestamp: string;
  health_map: number[][];
  statistics: {
    temperature?: number;
    humidity?: number;
    soil_moisture?: number;
    overall_health_score?: number;
    ndvi_mean?: number;
    predicted_temperature?: number;
    analysis_timestamp?: string;
    data_source?: string;
    [key: string]: any;
  };
  alerts: Alert[];
  confidence: number;
}

// Alert Types
export interface Alert {
  alert_id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: string;
  device_id?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  confidence: number;
}

// Historical Data Types
export interface HistoricalDataPoint {
  timestamp: string;
  device_id: string;
  temperature: number;
  humidity: number;
  soil_moisture: number;
  ph_level?: number;
  light_intensity?: number;
}

export interface HistoricalData {
  data: HistoricalDataPoint[];
  total_records: number;
  query_params: {
    device_id?: string;
    start_date: string;
    end_date: string;
    limit: number;
  };
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: 'sensor_update' | 'analysis_complete' | 'analysis_error' | 'new_alert' | 'alert_dismissed' | 'connection_established' | 'keepalive' | 'pong';
  timestamp: string;
  device_id?: string;
  data?: any;
  results?: Partial<AnalysisResults>;
  alert?: Alert;
  alert_id?: string;
  error?: string;
  message?: string;
}

// UI Component Props Types
export interface DashboardProps {
  className?: string;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
  status?: 'excellent' | 'good' | 'warning' | 'critical';
  loading?: boolean;
}

export interface ChartData {
  timestamp: string;
  value: number;
  label?: string;
}

export interface HealthMapProps {
  healthMap: number[][];
  loading?: boolean;
  width?: number;
  height?: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface DeviceStatus {
  device_id: string;
  status: 'online' | 'offline' | 'warning';
  last_seen: string;
  battery_level?: number;
  signal_strength?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
}

// Theme and Layout Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface LayoutProps {
  children: React.ReactNode;
}

// Form Types
export interface AnalysisFormData {
  analysis_function: string;
  include_hyperspectral: boolean;
  force_refresh: boolean;
}

// Error Types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}