import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Alert,
  AlertTitle,
  Chip,
  Skeleton,
  Fab,
} from '@mui/material';
import {
  Thermostat as ThermostatIcon,
  WaterDrop as WaterDropIcon,
  Grass as GrassIcon,
  Science as ScienceIcon,
  WbSunny as SunnyIcon,
  Battery90 as BatteryIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import MetricCard from '../components/MetricCard';
import { useWebSocket } from '../contexts/WebSocketContext';
import { 
  getLatestSensorData, 
  getAnalysisResults, 
  runAnalysis, 
  getHistoricalData,
  getSystemStatus 
} from '../services/api';
import { DashboardProps, AnalysisRequest } from '../types';

const Dashboard: React.FC<DashboardProps> = () => {
  const queryClient = useQueryClient();
  const { latestSensorData, isConnected, alerts } = useWebSocket();
  const [analysisRunning, setAnalysisRunning] = useState(false);

  // Query latest sensor data
  const { data: sensorData, isLoading: sensorLoading } = useQuery({
    queryKey: ['sensorData'],
    queryFn: getLatestSensorData,
    refetchInterval: isConnected ? 0 : 10000, // Don't refetch if WebSocket is connected
  });

  // Query analysis results
  const { data: analysisResults, isLoading: analysisLoading } = useQuery({
    queryKey: ['analysisResults'],
    queryFn: getAnalysisResults,
    refetchInterval: 30000,
  });

  // Query historical data for charts
  const { data: historicalData } = useQuery({
    queryKey: ['historicalData'],
    queryFn: () => getHistoricalData(undefined, undefined, undefined, 24), // Last 24 hours
    refetchInterval: 60000, // Refetch every minute
  });

  // Query system status
  const { data: systemStatus } = useQuery({
    queryKey: ['systemStatus'],
    queryFn: getSystemStatus,
    refetchInterval: 15000,
  });

  // Mutation for running analysis
  const runAnalysisMutation = useMutation({
    mutationFn: (request: AnalysisRequest) => runAnalysis(request),
    onMutate: () => {
      setAnalysisRunning(true);
      toast.loading('Starting analysis...', { id: 'analysis' });
    },
    onSuccess: () => {
      toast.success('Analysis started successfully', { id: 'analysis' });
      // Refetch analysis results after a delay
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['analysisResults'] });
      }, 5000);
    },
    onError: (error: any) => {
      toast.error(`Failed to start analysis: ${error.message}`, { id: 'analysis' });
    },
    onSettled: () => {
      setAnalysisRunning(false);
    },
  });

  const handleRunAnalysis = () => {
    runAnalysisMutation.mutate({
      include_hyperspectral: true,
      analysis_function: 'run_main_analysis_enhanced',
      force_refresh: true,
    });
  };

  // Get current sensor readings
  const currentData = latestSensorData.length > 0 ? latestSensorData : sensorData?.devices || [];
  const primaryDevice = currentData[0];

  // Prepare chart data
  const chartData = historicalData?.data?.map(point => ({
    time: format(new Date(point.timestamp), 'HH:mm'),
    temperature: point.temperature,
    humidity: point.humidity,
    soil_moisture: point.soil_moisture,
  })) || [];

  // Calculate status based on values
  const getTemperatureStatus = (temp: number) => {
    if (temp >= 20 && temp <= 30) return 'excellent';
    if (temp >= 15 && temp <= 35) return 'good';
    if (temp >= 10 && temp <= 40) return 'warning';
    return 'critical';
  };

  const getHumidityStatus = (humidity: number) => {
    if (humidity >= 60 && humidity <= 70) return 'excellent';
    if (humidity >= 50 && humidity <= 80) return 'good';
    if (humidity >= 40 && humidity <= 90) return 'warning';
    return 'critical';
  };

  const getMoistureStatus = (moisture: number) => {
    if (moisture >= 40 && moisture <= 60) return 'excellent';
    if (moisture >= 30 && moisture <= 70) return 'good';
    if (moisture >= 20 && moisture <= 80) return 'warning';
    return 'critical';
  };

  return (
    <Box className="fade-in">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          🌾 Agricultural Dashboard
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          {systemStatus && (
            <Chip
              label={`${systemStatus.connected_devices} devices connected`}
              color="primary"
              variant="outlined"
            />
          )}
          <Button
            variant="contained"
            startIcon={<PlayIcon />}
            onClick={handleRunAnalysis}
            disabled={analysisRunning || !systemStatus?.matlab_engine_status}
          >
            Run Analysis
          </Button>
        </Box>
      </Box>

      {/* Connection Status Alert */}
      {!isConnected && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>Real-time connection unavailable</AlertTitle>
          Using cached data. Some features may be limited.
        </Alert>
      )}

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            🚨 Active Alerts
          </Typography>
          <Grid container spacing={2}>
            {alerts.slice(0, 3).map((alert) => (
              <Grid item xs={12} md={4} key={alert.alert_id}>
                <Alert 
                  severity={alert.severity === 'critical' ? 'error' : alert.severity as any}
                  variant="filled"
                >
                  <AlertTitle>{alert.severity.toUpperCase()}</AlertTitle>
                  {alert.message}
                </Alert>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Metrics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Temperature"
            value={primaryDevice?.temperature || 0}
            unit="°C"
            icon={<ThermostatIcon />}
            status={primaryDevice ? getTemperatureStatus(primaryDevice.temperature) : 'good'}
            trend={{ direction: 'up', percentage: 2.5 }}
            loading={sensorLoading && !primaryDevice}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Humidity"
            value={primaryDevice?.humidity || 0}
            unit="%"
            icon={<WaterDropIcon />}
            status={primaryDevice ? getHumidityStatus(primaryDevice.humidity) : 'good'}
            trend={{ direction: 'down', percentage: -1.2 }}
            loading={sensorLoading && !primaryDevice}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Soil Moisture"
            value={primaryDevice?.soil_moisture || 0}
            unit="%"
            icon={<GrassIcon />}
            status={primaryDevice ? getMoistureStatus(primaryDevice.soil_moisture) : 'good'}
            trend={{ direction: 'stable', percentage: 0.1 }}
            loading={sensorLoading && !primaryDevice}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="pH Level"
            value={primaryDevice?.ph_level || 7.0}
            unit=""
            icon={<ScienceIcon />}
            status="good"
            loading={sensorLoading && !primaryDevice}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Light Intensity"
            value={primaryDevice?.light_intensity || 0}
            unit="lux"
            icon={<SunnyIcon />}
            status="excellent"
            loading={sensorLoading && !primaryDevice}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Battery"
            value={primaryDevice?.battery_level || 0}
            unit="%"
            icon={<BatteryIcon />}
            status={primaryDevice?.battery_level ? (primaryDevice.battery_level > 70 ? 'excellent' : primaryDevice.battery_level > 30 ? 'good' : 'warning') : 'good'}
            loading={sensorLoading && !primaryDevice}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Environmental Trends Chart */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              📈 Environmental Trends (Last 24h)
            </Typography>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#FF6B6B" 
                    strokeWidth={3}
                    name="Temperature (°C)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#4ECDC4" 
                    strokeWidth={3}
                    name="Humidity (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="soil_moisture" 
                    stroke="#45B7D1" 
                    strokeWidth={3}
                    name="Soil Moisture (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height={320}>
                <Typography variant="body1" color="textSecondary">
                  Loading historical data...
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Analysis Results */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              🧠 AI Analysis Results
            </Typography>
            {analysisLoading ? (
              <Box>
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="rectangular" width="100%" height={100} sx={{ my: 2 }} />
                <Skeleton variant="text" width="60%" height={20} />
              </Box>
            ) : analysisResults ? (
              <Box>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Overall Health Score
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {((analysisResults.statistics.overall_health_score || 0.85) * 100).toFixed(1)}%
                  </Typography>
                </Box>
                
                <Box mb={2}>
                  <Typography variant="subtitle2" color="textSecondary">
                    NDVI Mean
                  </Typography>
                  <Typography variant="h6">
                    {(analysisResults.statistics.ndvi_mean || 0.75).toFixed(3)}
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Confidence Level
                  </Typography>
                  <Typography variant="h6">
                    {(analysisResults.confidence * 100).toFixed(1)}%
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2">
                    {format(new Date(analysisResults.timestamp), 'MMM dd, HH:mm')}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="80%">
                <Typography variant="body1" color="textSecondary" textAlign="center" mb={2}>
                  No analysis results available
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleRunAnalysis}
                  disabled={analysisRunning}
                >
                  Run Analysis
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Device Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              📡 Device Status
            </Typography>
            {currentData.length > 0 ? (
              <Box>
                {currentData.map((device, index) => (
                  <Box key={device.device_id} mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" fontWeight="bold">
                        {device.device_id}
                      </Typography>
                      <Chip
                        label="Online"
                        color="success"
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      Last update: {format(new Date(device.timestamp), 'HH:mm:ss')}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No devices connected
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* System Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              ⚙️ System Information
            </Typography>
            {systemStatus ? (
              <Box>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="textSecondary">
                    System Status
                  </Typography>
                  <Chip
                    label={systemStatus.status}
                    color="success"
                    size="small"
                  />
                </Box>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="textSecondary">
                    MATLAB Engine
                  </Typography>
                  <Chip
                    label={systemStatus.matlab_engine_status}
                    color={systemStatus.matlab_engine_status === 'ready' ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Uptime
                  </Typography>
                  <Typography variant="body2">
                    {Math.floor(systemStatus.uptime_seconds / 3600)}h {Math.floor((systemStatus.uptime_seconds % 3600) / 60)}m
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">
                Loading system information...
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Floating Action Button for Refresh */}
      <Fab
        color="primary"
        aria-label="refresh"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => {
          queryClient.invalidateQueries();
          toast.success('Data refreshed');
        }}
      >
        <RefreshIcon />
      </Fab>
    </Box>
  );
};

export default Dashboard;