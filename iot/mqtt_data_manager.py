"""
IoT Data Manager - MQTT Integration System
=========================================

Comprehensive system for receiving, processing, and storing IoT sensor data
via MQTT protocol. Integrates with the agricultural monitoring dashboard
for real-time data visualization.

Features:
- MQTT client with automatic reconnection
- JSON data validation and processing
- SQLite database for data persistence
- CSV export functionality
- Integration with MATLAB analysis engine
- Real-time data streaming to dashboard

Author: Agricultural Monitoring Team
Version: v1.0
Compatible with: HiveMQ, Mosquitto, AWS IoT Core
"""

import json
import sqlite3
import csv
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import time
import logging
import threading
import queue
import os
import sys
from typing import Dict, List, Optional, Any

try:
    import paho.mqtt.client as mqtt
    MQTT_AVAILABLE = True
except ImportError:
    print("Warning: paho-mqtt not installed. Install with: pip install paho-mqtt")
    MQTT_AVAILABLE = False

class IoTDataManager:
    """
    Main class for managing IoT data from MQTT sources
    """
    
    def __init__(self, config_file: Optional[str] = None):
        """
        Initialize the IoT Data Manager
        
        Args:
            config_file: Path to configuration file (JSON)
        """
        # Load configuration
        self.config = self._load_config(config_file)
        
        # Initialize components
        self.mqtt_client = None
        self.db_path = self.config.get('database_path', 'iot_sensor_data.db')
        self.csv_path = self.config.get('csv_export_path', 'live_sensor_data.csv')
        self.matlab_export_path = self.config.get('matlab_export_path', 'latest_sensor_data.mat')
        
        # Data queues for processing
        self.data_queue = queue.Queue(maxsize=1000)
        self.processing_thread = None
        self.running = False
        
        # Setup logging
        self._setup_logging()
        
        # Initialize database
        self._init_database()
        
        # Statistics
        self.stats = {
            'messages_received': 0,
            'messages_processed': 0,
            'last_message_time': None,
            'connection_status': 'disconnected'
        }
        
        self.logger.info("IoT Data Manager initialized")
    
    def _load_config(self, config_file: Optional[str]) -> Dict[str, Any]:
        """Load configuration from file or use defaults"""
        default_config = {
            'mqtt_broker': 'broker.hivemq.com',
            'mqtt_port': 1883,
            'mqtt_topics': ['agri/sensors/+/data'],
            'mqtt_client_id': f'agri_monitor_{int(time.time())}',
            'database_path': 'iot_sensor_data.db',
            'csv_export_path': 'live_sensor_data.csv',
            'matlab_export_path': 'latest_sensor_data.mat',
            'data_retention_days': 30,
            'processing_interval': 1.0,
            'csv_update_interval': 10.0
        }
        
        if config_file and os.path.exists(config_file):
            try:
                with open(config_file, 'r') as f:
                    user_config = json.load(f)
                default_config.update(user_config)
                print(f"Configuration loaded from {config_file}")
            except Exception as e:
                print(f"Error loading config file: {e}. Using defaults.")
        
        return default_config
    
    def _setup_logging(self):
        """Setup logging configuration"""
        log_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        logging.basicConfig(
            level=logging.INFO,
            format=log_format,
            handlers=[
                logging.FileHandler('iot_data_manager.log'),
                logging.StreamHandler(sys.stdout)
            ]
        )
        self.logger = logging.getLogger('IoTDataManager')
    
    def _init_database(self):
        """Initialize SQLite database for sensor data storage"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Create main sensor data table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS sensor_data (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    device_id TEXT,
                    sensor_type TEXT,
                    temperature REAL,
                    humidity REAL,
                    soil_moisture REAL,
                    ph_level REAL,
                    light_intensity REAL,
                    latitude REAL,
                    longitude REAL,
                    battery_level REAL,
                    signal_strength REAL,
                    data_quality REAL,
                    raw_json TEXT,
                    processed BOOLEAN DEFAULT 0
                )
            ''')
            
            # Create indexes for better performance
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_timestamp ON sensor_data(timestamp)')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_device_id ON sensor_data(device_id)')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_processed ON sensor_data(processed)')
            
            # Create alerts table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS alerts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    device_id TEXT,
                    alert_type TEXT,
                    severity TEXT,
                    message TEXT,
                    acknowledged BOOLEAN DEFAULT 0
                )
            ''')
            
            conn.commit()
            conn.close()
            
            self.logger.info(f"Database initialized: {self.db_path}")
            
        except Exception as e:
            self.logger.error(f"Database initialization failed: {e}")
            raise
    
    def start_mqtt_client(self):
        """Start MQTT client and begin listening for sensor data"""
        if not MQTT_AVAILABLE:
            raise ImportError("paho-mqtt library not available. Install with: pip install paho-mqtt")
        
        try:
            # Create MQTT client
            self.mqtt_client = mqtt.Client(self.config['mqtt_client_id'])
            
            # Set callbacks
            self.mqtt_client.on_connect = self._on_connect
            self.mqtt_client.on_message = self._on_message
            self.mqtt_client.on_disconnect = self._on_disconnect
            self.mqtt_client.on_log = self._on_log
            
            # Connect to broker
            self.logger.info(f"Connecting to MQTT broker: {self.config['mqtt_broker']}:{self.config['mqtt_port']}")
            self.mqtt_client.connect(self.config['mqtt_broker'], self.config['mqtt_port'], 60)
            
            # Start the MQTT client loop in a separate thread
            self.mqtt_client.loop_start()
            
            # Start data processing thread
            self.running = True
            self.processing_thread = threading.Thread(target=self._data_processing_loop)
            self.processing_thread.start()
            
            self.logger.info("MQTT client started successfully")
            
        except Exception as e:
            self.logger.error(f"Failed to start MQTT client: {e}")
            raise
    
    def stop_mqtt_client(self):
        """Stop MQTT client and processing threads"""
        self.running = False
        
        if self.mqtt_client:
            self.mqtt_client.loop_stop()
            self.mqtt_client.disconnect()
        
        if self.processing_thread and self.processing_thread.is_alive():
            self.processing_thread.join(timeout=5)
        
        self.logger.info("MQTT client stopped")
    
    def _on_connect(self, client, userdata, flags, rc):
        """Callback for MQTT connection"""
        if rc == 0:
            self.stats['connection_status'] = 'connected'
            self.logger.info("Connected to MQTT broker")
            
            # Subscribe to configured topics
            for topic in self.config['mqtt_topics']:
                client.subscribe(topic)
                self.logger.info(f"Subscribed to topic: {topic}")
        else:
            self.stats['connection_status'] = 'failed'
            self.logger.error(f"Failed to connect to MQTT broker. Code: {rc}")
    
    def _on_disconnect(self, client, userdata, rc):
        """Callback for MQTT disconnection"""
        self.stats['connection_status'] = 'disconnected'
        if rc != 0:
            self.logger.warning("Unexpected MQTT disconnection. Attempting to reconnect...")
        else:
            self.logger.info("MQTT client disconnected")
    
    def _on_log(self, client, userdata, level, buf):
        """Callback for MQTT logging"""
        self.logger.debug(f"MQTT: {buf}")
    
    def _on_message(self, client, userdata, msg):
        """Callback for incoming MQTT messages"""
        try:
            # Decode message
            topic = msg.topic
            payload = msg.payload.decode('utf-8')
            
            self.stats['messages_received'] += 1
            self.stats['last_message_time'] = datetime.now()
            
            self.logger.debug(f"Received message on {topic}: {payload}")
            
            # Add to processing queue
            if not self.data_queue.full():
                self.data_queue.put({
                    'topic': topic,
                    'payload': payload,
                    'timestamp': datetime.now(),
                    'qos': msg.qos
                })
            else:
                self.logger.warning("Data queue full, dropping message")
                
        except Exception as e:
            self.logger.error(f"Error processing MQTT message: {e}")
    
    def _data_processing_loop(self):
        """Main data processing loop"""
        self.logger.info("Data processing loop started")
        
        last_csv_update = time.time()
        
        while self.running:
            try:
                # Process queued messages
                while not self.data_queue.empty():
                    message = self.data_queue.get_nowait()
                    self._process_sensor_message(message)
                
                # Periodic CSV update
                if time.time() - last_csv_update > self.config['csv_update_interval']:
                    self._update_csv_export()
                    self._update_matlab_export()
                    last_csv_update = time.time()
                
                # Clean old data
                self._cleanup_old_data()
                
                time.sleep(self.config['processing_interval'])
                
            except Exception as e:
                self.logger.error(f"Error in data processing loop: {e}")
                time.sleep(1)
        
        self.logger.info("Data processing loop stopped")
    
    def _process_sensor_message(self, message: Dict[str, Any]):
        """Process individual sensor message"""
        try:
            # Parse JSON payload
            data = json.loads(message['payload'])
            
            # Extract device information
            topic_parts = message['topic'].split('/')
            device_id = topic_parts[2] if len(topic_parts) > 2 else 'unknown'
            
            # Validate and extract sensor data
            sensor_data = self._validate_sensor_data(data)
            sensor_data['device_id'] = device_id
            sensor_data['timestamp'] = message['timestamp']
            sensor_data['raw_json'] = message['payload']
            
            # Store in database
            self._store_sensor_data(sensor_data)
            
            # Generate alerts if needed
            self._check_alert_conditions(sensor_data)
            
            self.stats['messages_processed'] += 1
            self.logger.debug(f"Processed sensor data from device: {device_id}")
            
        except json.JSONDecodeError as e:
            self.logger.error(f"Invalid JSON in message: {e}")
        except Exception as e:
            self.logger.error(f"Error processing sensor message: {e}")
    
    def _validate_sensor_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and normalize sensor data"""
        validated = {}
        
        # Define validation ranges
        ranges = {
            'temperature': (-50, 60),
            'humidity': (0, 100),
            'soil_moisture': (0, 100),
            'ph_level': (0, 14),
            'light_intensity': (0, 2000),
            'battery_level': (0, 100),
            'signal_strength': (-120, 0)
        }
        
        # Validate each sensor reading
        for field, (min_val, max_val) in ranges.items():
            value = data.get(field)
            if value is not None:
                try:
                    value = float(value)
                    if min_val <= value <= max_val:
                        validated[field] = value
                    else:
                        self.logger.warning(f"Value out of range for {field}: {value}")
                        validated[field] = None
                except (ValueError, TypeError):
                    validated[field] = None
            else:
                validated[field] = None
        
        # Handle location data
        if 'location' in data and isinstance(data['location'], dict):
            validated['latitude'] = data['location'].get('lat')
            validated['longitude'] = data['location'].get('lon')
        else:
            validated['latitude'] = None
            validated['longitude'] = None
        
        # Calculate data quality score
        valid_count = sum(1 for v in validated.values() if v is not None)
        total_count = len(validated)
        validated['data_quality'] = valid_count / total_count if total_count > 0 else 0
        
        return validated
    
    def _store_sensor_data(self, sensor_data: Dict[str, Any]):
        """Store sensor data in SQLite database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO sensor_data (
                    timestamp, device_id, temperature, humidity, soil_moisture,
                    ph_level, light_intensity, latitude, longitude, battery_level,
                    signal_strength, data_quality, raw_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                sensor_data['timestamp'],
                sensor_data['device_id'],
                sensor_data.get('temperature'),
                sensor_data.get('humidity'),
                sensor_data.get('soil_moisture'),
                sensor_data.get('ph_level'),
                sensor_data.get('light_intensity'),
                sensor_data.get('latitude'),
                sensor_data.get('longitude'),
                sensor_data.get('battery_level'),
                sensor_data.get('signal_strength'),
                sensor_data.get('data_quality'),
                sensor_data['raw_json']
            ))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            self.logger.error(f"Error storing sensor data: {e}")
    
    def _check_alert_conditions(self, sensor_data: Dict[str, Any]):
        """Check for alert conditions and generate alerts"""
        alerts = []
        device_id = sensor_data['device_id']
        
        # Temperature alerts
        temp = sensor_data.get('temperature')
        if temp is not None:
            if temp < 5:
                alerts.append(('critical', f"Critically low temperature: {temp}°C"))
            elif temp > 40:
                alerts.append(('critical', f"Critically high temperature: {temp}°C"))
            elif temp < 10 or temp > 35:
                alerts.append(('warning', f"Temperature out of optimal range: {temp}°C"))
        
        # Soil moisture alerts
        moisture = sensor_data.get('soil_moisture')
        if moisture is not None:
            if moisture < 20:
                alerts.append(('critical', f"Critical low soil moisture: {moisture}%"))
            elif moisture < 30:
                alerts.append(('warning', f"Low soil moisture: {moisture}%"))
            elif moisture > 80:
                alerts.append(('warning', f"High soil moisture: {moisture}%"))
        
        # pH alerts
        ph = sensor_data.get('ph_level')
        if ph is not None:
            if ph < 5.5 or ph > 8.0:
                alerts.append(('warning', f"pH level out of optimal range: {ph}"))
        
        # Battery alerts
        battery = sensor_data.get('battery_level')
        if battery is not None:
            if battery < 10:
                alerts.append(('critical', f"Critical low battery: {battery}%"))
            elif battery < 20:
                alerts.append(('warning', f"Low battery: {battery}%"))
        
        # Store alerts
        for severity, message in alerts:
            self._store_alert(device_id, 'sensor_threshold', severity, message)
    
    def _store_alert(self, device_id: str, alert_type: str, severity: str, message: str):
        """Store alert in database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO alerts (device_id, alert_type, severity, message)
                VALUES (?, ?, ?, ?)
            ''', (device_id, alert_type, severity, message))
            
            conn.commit()
            conn.close()
            
            self.logger.info(f"Alert generated for {device_id}: {severity} - {message}")
            
        except Exception as e:
            self.logger.error(f"Error storing alert: {e}")
    
    def _update_csv_export(self):
        """Update CSV file with latest sensor data"""
        try:
            # Query recent data from database
            conn = sqlite3.connect(self.db_path)
            
            # Get data from last 24 hours
            query = '''
                SELECT timestamp, device_id, temperature, humidity, soil_moisture,
                       ph_level, light_intensity, latitude, longitude, data_quality
                FROM sensor_data
                WHERE timestamp > datetime('now', '-1 day')
                ORDER BY timestamp DESC
                LIMIT 1000
            '''
            
            df = pd.read_sql_query(query, conn)
            conn.close()
            
            if not df.empty:
                # Export to CSV
                df.to_csv(self.csv_path, index=False)
                self.logger.debug(f"CSV export updated: {len(df)} records")
            
        except Exception as e:
            self.logger.error(f"Error updating CSV export: {e}")
    
    def _update_matlab_export(self):
        """Update MATLAB .mat file with latest sensor data"""
        try:
            # Get the most recent reading from each device
            conn = sqlite3.connect(self.db_path)
            
            query = '''
                SELECT device_id, temperature, humidity, soil_moisture, ph_level,
                       light_intensity, latitude, longitude, timestamp, data_quality,
                       MAX(timestamp) as latest_time
                FROM sensor_data
                WHERE timestamp > datetime('now', '-1 hour')
                GROUP BY device_id
            '''
            
            cursor = conn.cursor()
            cursor.execute(query)
            rows = cursor.fetchall()
            conn.close()
            
            if rows:
                # Prepare data for MATLAB
                matlab_data = {
                    'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'devices': []
                }
                
                for row in rows:
                    device_data = {
                        'device_id': row[0],
                        'temperature': row[1] if row[1] is not None else float('nan'),
                        'humidity': row[2] if row[2] is not None else float('nan'),
                        'soil_moisture': row[3] if row[3] is not None else float('nan'),
                        'ph': row[4] if row[4] is not None else float('nan'),
                        'light_intensity': row[5] if row[5] is not None else float('nan'),
                        'latitude': row[6] if row[6] is not None else float('nan'),
                        'longitude': row[7] if row[7] is not None else float('nan'),
                        'data_quality': row[9] if row[9] is not None else 0
                    }
                    matlab_data['devices'].append(device_data)
                
                # Save as JSON (MATLAB can read this)
                json_path = self.matlab_export_path.replace('.mat', '.json')
                with open(json_path, 'w') as f:
                    json.dump(matlab_data, f, indent=2)
                
                self.logger.debug(f"MATLAB export updated: {len(rows)} devices")
            
        except Exception as e:
            self.logger.error(f"Error updating MATLAB export: {e}")
    
    def _cleanup_old_data(self):
        """Remove old data from database"""
        try:
            retention_days = self.config.get('data_retention_days', 30)
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Clean old sensor data
            cursor.execute('''
                DELETE FROM sensor_data 
                WHERE timestamp < datetime('now', '-{} days')
            '''.format(retention_days))
            
            # Clean old alerts
            cursor.execute('''
                DELETE FROM alerts 
                WHERE timestamp < datetime('now', '-{} days')
            '''.format(retention_days))
            
            deleted = cursor.rowcount
            conn.commit()
            conn.close()
            
            if deleted > 0:
                self.logger.info(f"Cleaned up {deleted} old records")
                
        except Exception as e:
            self.logger.error(f"Error cleaning up old data: {e}")
    
    def get_latest_data(self, device_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get latest sensor data for dashboard"""
        try:
            conn = sqlite3.connect(self.db_path)
            
            if device_id:
                query = '''
                    SELECT * FROM sensor_data 
                    WHERE device_id = ? 
                    ORDER BY timestamp DESC 
                    LIMIT 10
                '''
                df = pd.read_sql_query(query, conn, params=[device_id])
            else:
                query = '''
                    SELECT * FROM sensor_data 
                    ORDER BY timestamp DESC 
                    LIMIT 50
                '''
                df = pd.read_sql_query(query, conn)
            
            conn.close()
            return df.to_dict('records')
            
        except Exception as e:
            self.logger.error(f"Error getting latest data: {e}")
            return []
    
    def get_active_alerts(self) -> List[Dict[str, Any]]:
        """Get active alerts for dashboard"""
        try:
            conn = sqlite3.connect(self.db_path)
            
            query = '''
                SELECT * FROM alerts 
                WHERE acknowledged = 0 
                ORDER BY timestamp DESC 
                LIMIT 20
            '''
            
            df = pd.read_sql_query(query, conn)
            conn.close()
            
            return df.to_dict('records')
            
        except Exception as e:
            self.logger.error(f"Error getting active alerts: {e}")
            return []
    
    def acknowledge_alert(self, alert_id: int):
        """Acknowledge an alert"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('UPDATE alerts SET acknowledged = 1 WHERE id = ?', [alert_id])
            conn.commit()
            conn.close()
            
            self.logger.info(f"Alert {alert_id} acknowledged")
            
        except Exception as e:
            self.logger.error(f"Error acknowledging alert: {e}")
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get system statistics"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Get data counts
            cursor.execute('SELECT COUNT(*) FROM sensor_data')
            total_records = cursor.fetchone()[0]
            
            cursor.execute('SELECT COUNT(DISTINCT device_id) FROM sensor_data')
            unique_devices = cursor.fetchone()[0]
            
            cursor.execute('SELECT COUNT(*) FROM alerts WHERE acknowledged = 0')
            active_alerts = cursor.fetchone()[0]
            
            conn.close()
            
            stats = self.stats.copy()
            stats.update({
                'total_records': total_records,
                'unique_devices': unique_devices,
                'active_alerts': active_alerts,
                'database_size': os.path.getsize(self.db_path) if os.path.exists(self.db_path) else 0
            })
            
            return stats
            
        except Exception as e:
            self.logger.error(f"Error getting statistics: {e}")
            return self.stats

# Configuration file example
def create_sample_config():
    """Create a sample configuration file"""
    config = {
        "mqtt_broker": "broker.hivemq.com",
        "mqtt_port": 1883,
        "mqtt_topics": [
            "agri/sensors/+/data",
            "agri/devices/+/status"
        ],
        "mqtt_client_id": "agri_monitor_001",
        "database_path": "iot_sensor_data.db",
        "csv_export_path": "live_sensor_data.csv",
        "matlab_export_path": "latest_sensor_data.json",
        "data_retention_days": 30,
        "processing_interval": 1.0,
        "csv_update_interval": 10.0
    }
    
    with open('iot_config.json', 'w') as f:
        json.dump(config, f, indent=2)
    
    print("Sample configuration created: iot_config.json")

# Example usage
if __name__ == "__main__":
    # Create sample config if it doesn't exist
    if not os.path.exists('iot_config.json'):
        create_sample_config()
    
    # Initialize and start the IoT data manager
    manager = IoTDataManager('iot_config.json')
    
    try:
        print("Starting IoT Data Manager...")
        manager.start_mqtt_client()
        
        print("IoT Data Manager is running. Press Ctrl+C to stop.")
        while True:
            time.sleep(10)
            stats = manager.get_statistics()
            print(f"Status: {stats['connection_status']} | "
                  f"Messages: {stats['messages_received']} | "
                  f"Devices: {stats.get('unique_devices', 0)} | "
                  f"Alerts: {stats.get('active_alerts', 0)}")
    
    except KeyboardInterrupt:
        print("\nShutting down IoT Data Manager...")
        manager.stop_mqtt_client()
        print("IoT Data Manager stopped.")