/*
 * Agricultural IoT Sensor Device - Complete Implementation
 * ======================================================
 * 
 * ESP32-based agricultural monitoring device that reads multiple sensors
 * and publishes data to MQTT broker for real-time monitoring.
 * 
 * Hardware Requirements:
 * - ESP32 Dev Board
 * - DHT22 (Temperature & Humidity)
 * - Soil Moisture Sensor (Capacitive)
 * - pH Sensor Module
 * - LDR (Light Dependent Resistor)
 * - Optional: GPS module for location
 * 
 * Features:
 * - WiFi connectivity
 * - MQTT data publishing
 * - JSON formatted sensor data
 * - Battery monitoring
 * - Error handling and recovery
 * - Deep sleep for power conservation
 * 
 * Author: Agricultural Monitoring Team
 * Version: v1.0
 * Compatible with: HiveMQ, Mosquitto, AWS IoT Core
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <esp_sleep.h>

// ===== CONFIGURATION =====
const char* WIFI_SSID = "YourWiFiNetwork";
const char* WIFI_PASSWORD = "YourWiFiPassword";

// MQTT Configuration
const char* MQTT_BROKER = "broker.hivemq.com";
const int MQTT_PORT = 1883;
const char* MQTT_CLIENT_ID = "agri_sensor_001";
const char* MQTT_TOPIC = "agri/sensors/field1/data";
const char* MQTT_STATUS_TOPIC = "agri/devices/field1/status";

// Device Configuration
const String DEVICE_ID = "FIELD1_SENSOR_001";
const int SENSOR_READ_INTERVAL = 30000;  // 30 seconds
const int DEEP_SLEEP_TIME = 300;  // 5 minutes (in seconds)
const bool ENABLE_DEEP_SLEEP = false;  // Set to true for battery operation

// Pin Definitions
#define DHT_PIN 4
#define DHT_TYPE DHT22
#define SOIL_MOISTURE_PIN A0
#define PH_SENSOR_PIN A1
#define LDR_PIN A2
#define BATTERY_PIN A3
#define STATUS_LED_PIN 2

// Sensor Calibration Values
#define SOIL_DRY_VALUE 3000    // Sensor value in dry soil
#define SOIL_WET_VALUE 1300    // Sensor value in wet soil
#define PH_NEUTRAL_VOLTAGE 2.5 // Voltage at pH 7
#define PH_ACID_SLOPE 0.18     // pH slope (voltage per pH unit)

// ===== GLOBAL VARIABLES =====
WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);
DHT dht(DHT_PIN, DHT_TYPE);

unsigned long lastSensorRead = 0;
unsigned long lastMqttAttempt = 0;
int wifiReconnectAttempts = 0;
int mqttReconnectAttempts = 0;

// Sensor data structure
struct SensorData {
  float temperature;
  float humidity;
  float soilMoisture;
  float phLevel;
  float lightIntensity;
  float batteryLevel;
  int signalStrength;
  bool dataValid;
};

SensorData currentData;

// ===== SETUP =====
void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("=== Agricultural IoT Sensor Starting ===");
  Serial.println("Device ID: " + DEVICE_ID);
  
  // Initialize pins
  pinMode(STATUS_LED_PIN, OUTPUT);
  pinMode(SOIL_MOISTURE_PIN, INPUT);
  pinMode(PH_SENSOR_PIN, INPUT);
  pinMode(LDR_PIN, INPUT);
  pinMode(BATTERY_PIN, INPUT);
  
  // Initialize sensors
  dht.begin();
  
  // Initialize WiFi and MQTT
  initializeWiFi();
  initializeMQTT();
  
  // Initial sensor reading
  readAllSensors();
  
  // Send startup message
  sendStatusMessage("Device started successfully");
  
  Serial.println("Setup complete - entering main loop");
  blinkStatusLED(3, 200);  // 3 quick blinks
}

// ===== MAIN LOOP =====
void loop() {
  unsigned long currentTime = millis();
  
  // Maintain WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    handleWiFiReconnect();
  }
  
  // Maintain MQTT connection
  if (WiFi.status() == WL_CONNECTED && !mqttClient.connected()) {
    handleMQTTReconnect();
  }
  
  // Process MQTT messages
  if (mqttClient.connected()) {
    mqttClient.loop();
  }
  
  // Read sensors and publish data
  if (currentTime - lastSensorRead >= SENSOR_READ_INTERVAL) {
    digitalWrite(STATUS_LED_PIN, HIGH);  // Turn on LED during sensor reading
    
    readAllSensors();
    
    if (currentData.dataValid) {
      publishSensorData();
    }
    
    lastSensorRead = currentTime;
    digitalWrite(STATUS_LED_PIN, LOW);
  }
  
  // Enter deep sleep if enabled (for battery operation)
  if (ENABLE_DEEP_SLEEP) {
    enterDeepSleep();
  }
  
  delay(1000);  // Small delay to prevent watchdog issues
}

// ===== WIFI FUNCTIONS =====
void initializeWiFi() {
  Serial.print("Connecting to WiFi: " + String(WIFI_SSID));
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected successfully!");
    Serial.println("IP address: " + WiFi.localIP().toString());
    Serial.println("Signal strength: " + String(WiFi.RSSI()) + " dBm");
    wifiReconnectAttempts = 0;
  } else {
    Serial.println("\nWiFi connection failed!");
  }
}

void handleWiFiReconnect() {
  if (wifiReconnectAttempts < 3) {
    Serial.println("WiFi disconnected - attempting to reconnect...");
    WiFi.reconnect();
    wifiReconnectAttempts++;
    delay(5000);
  } else {
    Serial.println("Multiple WiFi failures - restarting device...");
    ESP.restart();
  }
}

// ===== MQTT FUNCTIONS =====
void initializeMQTT() {
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setCallback(onMqttMessage);
  
  // Set larger buffer for JSON messages
  mqttClient.setBufferSize(512);
}

void handleMQTTReconnect() {
  if (millis() - lastMqttAttempt > 5000) {  // Try every 5 seconds
    Serial.print("Attempting MQTT connection...");
    
    if (mqttClient.connect(MQTT_CLIENT_ID)) {
      Serial.println(" connected!");
      mqttReconnectAttempts = 0;
      
      // Subscribe to control topics if needed
      mqttClient.subscribe("agri/control/field1/commands");
      
      // Send connection status
      sendStatusMessage("MQTT connected");
      
    } else {
      Serial.print(" failed, rc=");
      Serial.println(mqttClient.state());
      mqttReconnectAttempts++;
      
      if (mqttReconnectAttempts > 5) {
        Serial.println("Multiple MQTT failures - restarting device...");
        ESP.restart();
      }
    }
    
    lastMqttAttempt = millis();
  }
}

void onMqttMessage(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  
  Serial.println("Received MQTT message: " + message);
  
  // Handle remote commands (optional)
  if (String(topic) == "agri/control/field1/commands") {
    handleRemoteCommand(message);
  }
}

void handleRemoteCommand(String command) {
  if (command == "RESTART") {
    Serial.println("Remote restart command received");
    ESP.restart();
  } else if (command == "STATUS") {
    sendStatusMessage("Status requested - device operational");
  } else if (command == "READ_SENSORS") {
    readAllSensors();
    publishSensorData();
  }
}

// ===== SENSOR READING FUNCTIONS =====
void readAllSensors() {
  Serial.println("Reading all sensors...");
  
  // Reset data validity
  currentData.dataValid = true;
  
  // Read DHT22 (Temperature & Humidity)
  readDHT22();
  
  // Read soil moisture
  readSoilMoisture();
  
  // Read pH level
  readPHLevel();
  
  // Read light intensity
  readLightIntensity();
  
  // Read battery level
  readBatteryLevel();
  
  // Get WiFi signal strength
  currentData.signalStrength = WiFi.RSSI();
  
  // Validate data
  validateSensorData();
  
  // Print sensor values
  printSensorData();
}

void readDHT22() {
  currentData.temperature = dht.readTemperature();
  currentData.humidity = dht.readHumidity();
  
  if (isnan(currentData.temperature) || isnan(currentData.humidity)) {
    Serial.println("Warning: DHT22 sensor reading failed");
    currentData.temperature = -999;
    currentData.humidity = -999;
    currentData.dataValid = false;
  }
}

void readSoilMoisture() {
  int rawValue = analogRead(SOIL_MOISTURE_PIN);
  
  // Convert to percentage (0-100%)
  currentData.soilMoisture = map(rawValue, SOIL_DRY_VALUE, SOIL_WET_VALUE, 0, 100);
  currentData.soilMoisture = constrain(currentData.soilMoisture, 0, 100);
  
  Serial.println("Soil moisture raw: " + String(rawValue) + " -> " + String(currentData.soilMoisture) + "%");
}

void readPHLevel() {
  int rawValue = analogRead(PH_SENSOR_PIN);
  float voltage = rawValue * (3.3 / 4095.0);  // Convert to voltage
  
  // Convert voltage to pH (calibration required)
  currentData.phLevel = 7.0 + ((PH_NEUTRAL_VOLTAGE - voltage) / PH_ACID_SLOPE);
  currentData.phLevel = constrain(currentData.phLevel, 0, 14);
  
  Serial.println("pH raw: " + String(rawValue) + " voltage: " + String(voltage) + "V -> pH: " + String(currentData.phLevel));
}

void readLightIntensity() {
  int rawValue = analogRead(LDR_PIN);
  
  // Convert to approximate lux (calibration needed)
  currentData.lightIntensity = map(rawValue, 0, 4095, 0, 1000);
  
  Serial.println("Light raw: " + String(rawValue) + " -> " + String(currentData.lightIntensity) + " lux");
}

void readBatteryLevel() {
  int rawValue = analogRead(BATTERY_PIN);
  float voltage = rawValue * (3.3 / 4095.0) * 2;  // Voltage divider correction
  
  // Convert to percentage (assuming 3.0V = 0%, 4.2V = 100%)
  currentData.batteryLevel = map(voltage * 100, 300, 420, 0, 100);
  currentData.batteryLevel = constrain(currentData.batteryLevel, 0, 100);
  
  Serial.println("Battery voltage: " + String(voltage) + "V -> " + String(currentData.batteryLevel) + "%");
}

void validateSensorData() {
  // Check for reasonable ranges
  if (currentData.temperature < -50 || currentData.temperature > 60) {
    Serial.println("Warning: Temperature out of range");
  }
  
  if (currentData.humidity < 0 || currentData.humidity > 100) {
    Serial.println("Warning: Humidity out of range");
  }
  
  if (currentData.phLevel < 0 || currentData.phLevel > 14) {
    Serial.println("Warning: pH out of range");
  }
  
  // Overall data quality assessment
  int validReadings = 0;
  if (currentData.temperature > -50 && currentData.temperature < 60) validReadings++;
  if (currentData.humidity >= 0 && currentData.humidity <= 100) validReadings++;
  if (currentData.soilMoisture >= 0 && currentData.soilMoisture <= 100) validReadings++;
  if (currentData.phLevel >= 0 && currentData.phLevel <= 14) validReadings++;
  if (currentData.lightIntensity >= 0) validReadings++;
  
  if (validReadings < 3) {
    Serial.println("Warning: Multiple sensor failures detected");
    currentData.dataValid = false;
  }
}

void printSensorData() {
  Serial.println("=== Sensor Readings ===");
  Serial.println("Temperature: " + String(currentData.temperature) + "°C");
  Serial.println("Humidity: " + String(currentData.humidity) + "%");
  Serial.println("Soil Moisture: " + String(currentData.soilMoisture) + "%");
  Serial.println("pH Level: " + String(currentData.phLevel));
  Serial.println("Light Intensity: " + String(currentData.lightIntensity) + " lux");
  Serial.println("Battery Level: " + String(currentData.batteryLevel) + "%");
  Serial.println("Signal Strength: " + String(currentData.signalStrength) + " dBm");
  Serial.println("Data Valid: " + String(currentData.dataValid ? "Yes" : "No"));
  Serial.println("=======================");
}

// ===== MQTT PUBLISHING =====
void publishSensorData() {
  if (!mqttClient.connected()) {
    Serial.println("MQTT not connected - cannot publish data");
    return;
  }
  
  // Create JSON document
  DynamicJsonDocument doc(512);
  
  // Device information
  doc["device_id"] = DEVICE_ID;
  doc["timestamp"] = millis();
  
  // Sensor readings
  doc["temperature"] = currentData.temperature;
  doc["humidity"] = currentData.humidity;
  doc["soil_moisture"] = currentData.soilMoisture;
  doc["ph_level"] = currentData.phLevel;
  doc["light_intensity"] = currentData.lightIntensity;
  doc["battery_level"] = currentData.batteryLevel;
  doc["signal_strength"] = currentData.signalStrength;
  
  // Location (if available - add GPS coordinates here)
  JsonObject location = doc.createNestedObject("location");
  location["lat"] = 0.0;  // Replace with actual GPS latitude
  location["lon"] = 0.0;  // Replace with actual GPS longitude
  
  // Data quality
  doc["data_quality"] = currentData.dataValid ? 1.0 : 0.5;
  
  // Convert to string
  String jsonString;
  serializeJson(doc, jsonString);
  
  // Publish to MQTT
  if (mqttClient.publish(MQTT_TOPIC, jsonString.c_str())) {
    Serial.println("Sensor data published successfully");
    Serial.println("Published: " + jsonString);
    blinkStatusLED(1, 100);  // Single blink for successful publish
  } else {
    Serial.println("Failed to publish sensor data");
    blinkStatusLED(5, 50);   // Rapid blinks for error
  }
}

void sendStatusMessage(String message) {
  if (!mqttClient.connected()) {
    return;
  }
  
  DynamicJsonDocument doc(256);
  doc["device_id"] = DEVICE_ID;
  doc["timestamp"] = millis();
  doc["status"] = message;
  doc["uptime"] = millis() / 1000;
  doc["free_heap"] = ESP.getFreeHeap();
  doc["wifi_rssi"] = WiFi.RSSI();
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  mqttClient.publish(MQTT_STATUS_TOPIC, jsonString.c_str());
  Serial.println("Status message sent: " + message);
}

// ===== UTILITY FUNCTIONS =====
void blinkStatusLED(int times, int delayMs) {
  for (int i = 0; i < times; i++) {
    digitalWrite(STATUS_LED_PIN, HIGH);
    delay(delayMs);
    digitalWrite(STATUS_LED_PIN, LOW);
    delay(delayMs);
  }
}

void enterDeepSleep() {
  Serial.println("Entering deep sleep for " + String(DEEP_SLEEP_TIME) + " seconds...");
  
  // Send sleep notification
  sendStatusMessage("Entering deep sleep mode");
  delay(1000);  // Give time for message to send
  
  // Configure wake-up timer
  esp_sleep_enable_timer_wakeup(DEEP_SLEEP_TIME * 1000000);  // Convert to microseconds
  
  // Go to sleep
  esp_deep_sleep_start();
}

// ===== ERROR HANDLING =====
void handleSensorError(String sensorName, String error) {
  String errorMsg = sensorName + " error: " + error;
  Serial.println("ERROR: " + errorMsg);
  
  // Send error notification via MQTT
  if (mqttClient.connected()) {
    DynamicJsonDocument doc(256);
    doc["device_id"] = DEVICE_ID;
    doc["error"] = errorMsg;
    doc["timestamp"] = millis();
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    mqttClient.publish("agri/errors/field1", jsonString.c_str());
  }
  
  // Visual indication
  blinkStatusLED(10, 100);  // 10 fast blinks for error
}

/*
 * MQTT Message Format Example:
 * {
 *   "device_id": "FIELD1_SENSOR_001",
 *   "timestamp": 123456789,
 *   "temperature": 25.4,
 *   "humidity": 68.2,
 *   "soil_moisture": 45.7,
 *   "ph_level": 6.8,
 *   "light_intensity": 750,
 *   "battery_level": 85,
 *   "signal_strength": -45,
 *   "location": {
 *     "lat": 40.7128,
 *     "lon": -74.0060
 *   },
 *   "data_quality": 1.0
 * }
 */