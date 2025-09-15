import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { WebSocketMessage, SensorReading, Alert } from '../types';

interface WebSocketContextType {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (message: any) => void;
  latestSensorData: SensorReading[];
  alerts: Alert[];
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [latestSensorData, setLatestSensorData] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const connectWebSocket = useCallback(() => {
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws';
    
    setConnectionStatus('connecting');
    
    try {
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
        
        // Send ping to test connection
        socket.send(JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() }));
        
        toast.success('Real-time connection established');
      };

      socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      socket.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        socketRef.current = null;

        // Attempt to reconnect if not a manual close
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connectWebSocket();
          }, delay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setConnectionStatus('error');
          toast.error('Failed to establish real-time connection after multiple attempts');
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
        toast.error('Real-time connection error');
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionStatus('error');
    }
  }, []);

  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'sensor_update':
        if (message.data && message.device_id) {
          setLatestSensorData(prevData => {
            const existingIndex = prevData.findIndex(d => d.device_id === message.device_id);
            if (existingIndex >= 0) {
              const newData = [...prevData];
              newData[existingIndex] = message.data;
              return newData;
            } else {
              return [...prevData, message.data];
            }
          });
        }
        break;

      case 'analysis_complete':
        toast.success('Analysis completed successfully');
        if (message.results) {
          console.log('Analysis results received:', message.results);
        }
        break;

      case 'analysis_error':
        toast.error(`Analysis failed: ${message.error || 'Unknown error'}`);
        break;

      case 'new_alert':
        if (message.alert) {
          setAlerts(prevAlerts => [message.alert!, ...prevAlerts]);
          
          // Show toast notification based on severity
          switch (message.alert.severity) {
            case 'critical':
              toast.error(`🚨 Critical Alert: ${message.alert.message}`);
              break;
            case 'error':
              toast.error(`❌ Error: ${message.alert.message}`);
              break;
            case 'warning':
              toast(message.alert.message, {
                icon: '⚠️',
                style: {
                  background: '#FF9800',
                  color: 'white',
                },
              });
              break;
            case 'info':
              toast(message.alert.message, {
                icon: 'ℹ️',
                style: {
                  background: '#2196F3',
                  color: 'white',
                },
              });
              break;
          }
        }
        break;

      case 'alert_dismissed':
        if (message.alert_id) {
          setAlerts(prevAlerts => prevAlerts.filter(alert => alert.alert_id !== message.alert_id));
        }
        break;

      case 'connection_established':
        console.log('WebSocket connection established:', message.message);
        break;

      case 'pong':
        console.log('WebSocket pong received');
        break;

      case 'keepalive':
        // Respond to keepalive
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() }));
        }
        break;

      default:
        console.log('Unknown WebSocket message type:', message.type);
    }
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }, []);

  useEffect(() => {
    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (socketRef.current) {
        socketRef.current.close(1000, 'Component unmounting');
      }
    };
  }, [connectWebSocket]);

  // Ping interval to keep connection alive
  useEffect(() => {
    if (isConnected) {
      const pingInterval = setInterval(() => {
        sendMessage({ type: 'ping', timestamp: new Date().toISOString() });
      }, 30000); // Ping every 30 seconds

      return () => clearInterval(pingInterval);
    }
  }, [isConnected, sendMessage]);

  const contextValue: WebSocketContextType = {
    isConnected,
    lastMessage,
    sendMessage,
    latestSensorData,
    alerts,
    connectionStatus,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};