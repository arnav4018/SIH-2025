import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  AlertTitle,
  Chip,
  Skeleton,
  Fab,
  AppBar,
  Toolbar,
  Container,
  IconButton,
  Badge,
  Tooltip,
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
  Home as HomeIcon,
  Notifications as NotificationsIcon,
  WifiOff as WifiOffIcon,
  Wifi as WifiIcon,
  Agriculture as AgricultureIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// Using native JavaScript Date formatting instead of date-fns
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
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC<DashboardProps> = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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
    time: new Date(point.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Navigation Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          color: '#1a1a1a'
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              mr: 4
            }}
            onClick={() => navigate('/')}
          >
            <AgricultureIcon sx={{ 
              color: '#2E7D32', 
              mr: 1.5, 
              fontSize: '1.75rem' 
            }} />
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#1a1a1a', 
                fontWeight: 600,
                fontSize: '1.1rem',
                fontFamily: '"Inter", sans-serif'
              }}
            >
              AgroBotics
            </Typography>
          </Box>
          
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#666' }}>
            Dashboard
          </Typography>

          <Box display="flex" alignItems="center" gap={2}>
            {/* Connection Status */}
            <Tooltip title={isConnected ? 'Real-time Connected' : 'Disconnected'}>
              <Chip
                icon={isConnected ? <WifiIcon /> : <WifiOffIcon />}
                label={isConnected ? 'Live' : 'Offline'}
                color={isConnected ? 'success' : 'default'}
                size="small"
                variant={isConnected ? 'filled' : 'outlined'}
              />
            </Tooltip>

            {/* System Status */}
            {systemStatus && (
              <Chip
                label={`${systemStatus.connected_devices} devices`}
                size="small"
                variant="outlined"
                sx={{ color: '#666' }}
              />
            )}

            {/* Alerts */}
            <Tooltip title={`${alerts.length} active alerts`}>
              <IconButton sx={{ color: '#666' }}>
                <Badge badgeContent={alerts.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Home Button */}
            <Tooltip title="Back to Home">
              <IconButton 
                onClick={() => navigate('/')}
                sx={{ 
                  color: '#666',
                  '&:hover': {
                    color: '#2E7D32',
                    backgroundColor: 'rgba(46, 125, 50, 0.04)'
                  }
                }}
              >
                <HomeIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Dashboard Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 6,
          p: 4,
          background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.05), rgba(76, 175, 80, 0.05))',
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'rgba(46, 125, 50, 0.2)',
          backgroundColor: 'white'
        }}>
        <Box>
          <Typography variant="h3" component="h1" fontWeight={600} gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Control and monitor your autonomous robotic farming fleet
          </Typography>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          {systemStatus && (
            <Chip
              label={`${systemStatus.connected_devices} devices active`}
              color="secondary"
              variant="outlined"
              sx={{ 
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'secondary.main'
              }}
            />
          )}
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PlayIcon />}
            onClick={handleRunAnalysis}
            disabled={analysisRunning || !systemStatus?.matlab_engine_status}
            sx={{ 
              px: 3,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            {analysisRunning ? 'Analyzing...' : 'Run Analysis'}
          </Button>
        </Box>
      </Box>

      {/* Connection Status Alert */}
      {!isConnected && (
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 4,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'warning.light',
            '& .MuiAlert-icon': {
              color: 'warning.main'
            }
          }}
        >
          <AlertTitle sx={{ fontWeight: 600 }}>Real-time connection unavailable</AlertTitle>
          Using cached data. Some features may be limited.
        </Alert>
      )}

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
            Active Alerts
          </Typography>
          <Grid container spacing={3}>
            {alerts.slice(0, 3).map((alert) => (
              <Grid item xs={12} md={4} key={alert.alert_id}>
                <Alert 
                  severity={alert.severity === 'critical' ? 'error' : alert.severity as any}
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    backgroundColor: 'background.paper',
                    '& .MuiAlert-icon': {
                      alignItems: 'center'
                    }
                  }}
                >
                  <AlertTitle sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                    {alert.severity} Alert
                  </AlertTitle>
                  {alert.message}
                </Alert>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Metrics Cards */}
      <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
        Environmental Metrics
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
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

      <Grid container spacing={4}>
        {/* Environmental Trends Chart */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={0} sx={{ 
            p: 4, 
            height: 450,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'grey.200'
          }}>
            <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
              Environmental Trends (24h)
            </Typography>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#EF4444" 
                    strokeWidth={3}
                    dot={{ fill: '#EF4444', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: '#EF4444' }}
                    name="Temperature (°C)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: '#3B82F6' }}
                    name="Humidity (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="soil_moisture" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: '#10B981' }}
                    name="Soil Moisture (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height={360}>
                <Typography variant="body1" color="text.secondary">
                  Loading historical data...
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Analysis Results */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={{ 
            p: 4, 
            height: 450,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'grey.200',
            background: 'linear-gradient(135deg, rgba(139, 90, 60, 0.02), rgba(107, 114, 128, 0.02))'
          }}>
            <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
              AI Analysis
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
                    {new Date(analysisResults.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
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
          <Paper elevation={0} sx={{ 
            p: 4,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'grey.200'
          }}>
            <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
              Device Status
            </Typography>
            {currentData.length > 0 ? (
              <Box>
                {currentData.map((device, index) => (
                  <Box key={device.device_id} sx={{ 
                    mb: 3,
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: 'grey.50',
                    border: '1px solid',
                    borderColor: 'grey.200'
                  }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="h6" fontWeight={600}>
                        {device.device_id}
                      </Typography>
                      <Chip
                        label="Active"
                        color="success"
                        size="small"
                        sx={{ 
                          borderRadius: 2,
                          fontWeight: 500
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Last update: {new Date(device.timestamp).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
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
          <Paper elevation={0} sx={{ 
            p: 4,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'grey.200'
          }}>
            <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
              System Information
            </Typography>
            {systemStatus ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ 
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'success.light'
                }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    System Status
                  </Typography>
                  <Chip
                    label={systemStatus.status}
                    color="success"
                    size="small"
                    sx={{ borderRadius: 2, fontWeight: 500 }}
                  />
                </Box>
                <Box sx={{ 
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: systemStatus.matlab_engine_status === 'ready' ? 'success.light' : 'error.light'
                }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    MATLAB Engine
                  </Typography>
                  <Chip
                    label={systemStatus.matlab_engine_status}
                    color={systemStatus.matlab_engine_status === 'ready' ? 'success' : 'error'}
                    size="small"
                    sx={{ borderRadius: 2, fontWeight: 500 }}
                  />
                </Box>
                <Box sx={{ 
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'grey.300'
                }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Uptime
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
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
          color="secondary"
          aria-label="refresh"
          sx={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            '&:hover': {
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              transform: 'translateY(-2px)'
            }
          }}
          onClick={() => {
            queryClient.invalidateQueries();
            toast.success('Data refreshed');
          }}
        >
          <RefreshIcon />
        </Fab>
      </Container>
    </Box>
  );
};

export default Dashboard;