"""
MQTT Data Forwarder for AgriTech API Integration
===============================================

This module listens to MQTT sensor data and forwards it to the API server
for real-time processing and WebSocket broadcasting to React frontend.

Features:
- MQTT broker connection and message handling
- Data validation and formatting
- API server integration
- Error handling and reconnection
- Logging and monitoring

Author: AgriTech Innovators Team
Version: 1.0
"""

import asyncio
import json
import logging
import time
from datetime import datetime
from typing import Dict, Any, Optional
import aiohttp
import paho.mqtt.client as mqtt
import signal
import sys
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('mqtt_forwarder.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class MQTTDataForwarder:
    def __init__(self, 
                 mqtt_broker: str = "broker.hivemq.com",
                 mqtt_port: int = 1883,
                 api_base_url: str = "http://localhost:8000",
                 mqtt_topics: list = None):
        """
        Initialize MQTT Data Forwarder
        
        Args:
            mqtt_broker: MQTT broker hostname
            mqtt_port: MQTT broker port
            api_base_url: Base URL of the API server
            mqtt_topics: List of MQTT topics to subscribe to
        """
        self.mqtt_broker = mqtt_broker
        self.mqtt_port = mqtt_port
        self.api_base_url = api_base_url
        self.mqtt_topics = mqtt_topics or [
            "agri/sensors/+/data",
            "agri/devices/+/status",
            "agri/alerts/+"
        ]
        
        # MQTT client setup
        self.mqtt_client = mqtt.Client(client_id="agritech_api_forwarder")
        self.mqtt_client.on_connect = self.on_mqtt_connect
        self.mqtt_client.on_message = self.on_mqtt_message
        self.mqtt_client.on_disconnect = self.on_mqtt_disconnect
        
        # HTTP session for API calls
        self.http_session: Optional[aiohttp.ClientSession] = None
        
        # Statistics
        self.stats = {
            "messages_received": 0,
            "messages_forwarded": 0,
            "errors": 0,
            "last_message_time": None,
            "start_time": datetime.now()
        }
        
        # Control flags
        self.running = False
        
    async def start(self):
        """Start the MQTT data forwarder"""
        logger.info("Starting MQTT Data Forwarder...")
        
        # Create HTTP session
        self.http_session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=10)
        )
        
        # Test API connection
        if not await self.test_api_connection():
            logger.error("Failed to connect to API server. Exiting.")
            return
        
        # Connect to MQTT broker
        try:
            logger.info(f"Connecting to MQTT broker: {self.mqtt_broker}:{self.mqtt_port}")
            self.mqtt_client.connect(self.mqtt_broker, self.mqtt_port, 60)
            self.mqtt_client.loop_start()
            
            self.running = True
            logger.info("MQTT Data Forwarder started successfully")
            
            # Keep running
            await self.run_forever()
            
        except Exception as e:
            logger.error(f"Failed to start MQTT client: {e}")
            await self.cleanup()
            
    async def run_forever(self):
        """Keep the forwarder running and log statistics"""
        last_stats_time = time.time()
        
        while self.running:
            try:
                await asyncio.sleep(1)
                
                # Log statistics every 60 seconds
                if time.time() - last_stats_time > 60:
                    self.log_statistics()
                    last_stats_time = time.time()
                    
            except KeyboardInterrupt:
                logger.info("Received shutdown signal")
                break
            except Exception as e:
                logger.error(f"Error in main loop: {e}")
                await asyncio.sleep(5)
        
        await self.cleanup()
    
    async def test_api_connection(self) -> bool:
        """Test connection to API server"""
        try:
            async with self.http_session.get(f"{self.api_base_url}/api/health") as response:
                if response.status == 200:
                    logger.info("API server connection successful")
                    return True
                else:
                    logger.error(f"API server returned status {response.status}")
                    return False
        except Exception as e:
            logger.error(f"Failed to connect to API server: {e}")
            return False
    
    def on_mqtt_connect(self, client, userdata, flags, rc):
        """Callback for MQTT connection"""
        if rc == 0:
            logger.info("Connected to MQTT broker successfully")
            # Subscribe to topics
            for topic in self.mqtt_topics:
                client.subscribe(topic)
                logger.info(f"Subscribed to topic: {topic}")
        else:
            logger.error(f"Failed to connect to MQTT broker. Return code: {rc}")
    
    def on_mqtt_disconnect(self, client, userdata, rc):
        """Callback for MQTT disconnection"""
        logger.warning(f"Disconnected from MQTT broker. Return code: {rc}")
        if rc != 0:
            logger.info("Unexpected disconnection. Attempting to reconnect...")
    
    def on_mqtt_message(self, client, userdata, msg):
        """Callback for MQTT message received"""
        try:
            topic = msg.topic
            payload = msg.payload.decode('utf-8')
            
            logger.debug(f"Received MQTT message on topic '{topic}': {payload}")
            
            # Parse JSON payload
            data = json.loads(payload)
            
            # Update statistics
            self.stats["messages_received"] += 1
            self.stats["last_message_time"] = datetime.now()
            
            # Forward to API asynchronously
            asyncio.create_task(self.forward_to_api(topic, data))
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON from topic '{msg.topic}': {e}")
            self.stats["errors"] += 1
        except Exception as e:
            logger.error(f"Error processing MQTT message: {e}")
            self.stats["errors"] += 1
    
    async def forward_to_api(self, topic: str, data: Dict[str, Any]):
        """Forward MQTT data to API server"""
        try:
            # Determine API endpoint based on topic
            if "/data" in topic:
                endpoint = "/api/mqtt/sensor"
                processed_data = self.process_sensor_data(data)
            elif "/status" in topic:
                endpoint = "/api/mqtt/status"
                processed_data = self.process_status_data(data)
            elif "/alerts" in topic:
                endpoint = "/api/alerts"
                processed_data = self.process_alert_data(data)
            else:
                logger.warning(f"Unknown topic pattern: {topic}")
                return
            
            # Send to API
            url = f"{self.api_base_url}{endpoint}"
            async with self.http_session.post(url, json=processed_data) as response:
                if response.status in [200, 201]:
                    logger.debug(f"Successfully forwarded data to {endpoint}")
                    self.stats["messages_forwarded"] += 1
                else:
                    logger.error(f"API server returned status {response.status} for {endpoint}")
                    self.stats["errors"] += 1
                    
        except Exception as e:
            logger.error(f"Failed to forward data to API: {e}")
            self.stats["errors"] += 1
    
    def process_sensor_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process and validate sensor data"""
        processed = {
            "device_id": data.get("device_id", "unknown"),
            "timestamp": data.get("timestamp", datetime.now().isoformat()),
            "temperature": float(data.get("temperature", 0)),
            "humidity": float(data.get("humidity", 0)),
            "soil_moisture": float(data.get("soil_moisture", 0)),
            "ph_level": float(data.get("ph_level", 7.0)),
        }
        
        # Optional fields
        if "light_intensity" in data:
            processed["light_intensity"] = float(data["light_intensity"])
        if "battery_level" in data:
            processed["battery_level"] = float(data["battery_level"])
        if "location" in data:
            processed["location"] = data["location"]
            
        return processed
    
    def process_status_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process device status data"""
        return {
            "device_id": data.get("device_id", "unknown"),
            "status": data.get("status", "unknown"),
            "timestamp": data.get("timestamp", datetime.now().isoformat()),
            "battery_level": data.get("battery_level"),
            "signal_strength": data.get("signal_strength"),
            "location": data.get("location")
        }
    
    def process_alert_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process alert data"""
        return {
            "alert_id": f"mqtt_{int(time.time() * 1000)}",
            "severity": data.get("severity", "info"),
            "message": data.get("message", "MQTT Alert"),
            "timestamp": data.get("timestamp", datetime.now().isoformat()),
            "device_id": data.get("device_id"),
            "location": data.get("location"),
            "confidence": float(data.get("confidence", 1.0))
        }
    
    def log_statistics(self):
        """Log current statistics"""
        uptime = datetime.now() - self.stats["start_time"]
        logger.info(f"Statistics - Uptime: {uptime}, "
                   f"Messages Received: {self.stats['messages_received']}, "
                   f"Messages Forwarded: {self.stats['messages_forwarded']}, "
                   f"Errors: {self.stats['errors']}, "
                   f"Last Message: {self.stats['last_message_time']}")
    
    async def cleanup(self):
        """Cleanup resources"""
        logger.info("Shutting down MQTT Data Forwarder...")
        
        self.running = False
        
        # Stop MQTT client
        try:
            self.mqtt_client.loop_stop()
            self.mqtt_client.disconnect()
        except Exception as e:
            logger.error(f"Error stopping MQTT client: {e}")
        
        # Close HTTP session
        if self.http_session:
            try:
                await self.http_session.close()
            except Exception as e:
                logger.error(f"Error closing HTTP session: {e}")
        
        self.log_statistics()
        logger.info("MQTT Data Forwarder stopped")

# Signal handlers for graceful shutdown
forwarder_instance = None

def signal_handler(signum, frame):
    """Handle shutdown signals"""
    global forwarder_instance
    logger.info(f"Received signal {signum}")
    if forwarder_instance:
        forwarder_instance.running = False

async def main():
    """Main entry point"""
    global forwarder_instance
    
    # Register signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Create and start forwarder
    forwarder_instance = MQTTDataForwarder(
        mqtt_broker="broker.hivemq.com",  # You can change this to your MQTT broker
        mqtt_port=1883,
        api_base_url="http://localhost:8000"
    )
    
    try:
        await forwarder_instance.start()
    except Exception as e:
        logger.error(f"Error running forwarder: {e}")
    finally:
        if forwarder_instance:
            await forwarder_instance.cleanup()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Received keyboard interrupt")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        sys.exit(1)