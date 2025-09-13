# IoT Directory - Device Development & Sensor Networks

## 👥 **Team Member: Harshit**
**Role:** IoT Engineer - Hardware Integration, Sensor Networks, and Real-time Data Collection

---

## 🎯 **Your Mission & Responsibility**

You are the **hardware heart** of the agricultural monitoring system. Your IoT devices and sensor networks are the eyes and ears in the field, collecting real-time environmental data that feeds the entire system. You're building the physical infrastructure that makes precision agriculture possible.

### **Key Responsibilities:**
- **Device Development**: Design and program ESP32/Arduino-based sensor nodes
- **Sensor Integration**: Connect multiple environmental sensors (temperature, humidity, soil moisture, pH, light)
- **MQTT Communication**: Implement reliable wireless data transmission
- **Power Management**: Optimize battery life and solar charging systems
- **Network Architecture**: Design mesh networks and communication protocols
- **Field Deployment**: Ensure devices work reliably in harsh agricultural environments

---

## 🏗️ **Directory Structure**

```
iot/
├── README.md                          # This comprehensive documentation
├── agricultural_sensor_device.ino     # Main Arduino/ESP32 code
├── main_device_code.ino               # Alternative device implementation
├── mqtt_data_manager.py               # Python MQTT data handler
├── device_configs/                    # Device configuration files
│   ├── sensor_calibration.json       # Sensor calibration data
│   ├── network_settings.json         # WiFi and MQTT settings
│   └── power_management.json         # Power optimization settings
├── libraries/                         # Custom libraries and drivers
│   ├── SensorManager/                 # Unified sensor interface
│   ├── MQTTClient/                    # Enhanced MQTT client
│   └── PowerManager/                  # Battery and power management
├── firmware/                          # Different firmware versions
│   ├── basic_sensor_node.ino         # Basic functionality
│   ├── advanced_sensor_node.ino      # Full feature set
│   └── low_power_node.ino            # Battery-optimized version
├── hardware/                          # Hardware design files
│   ├── schematics/                    # Circuit diagrams
│   ├── pcb_designs/                   # PCB layout files
│   └── 3d_models/                     # Enclosure designs
├── testing/                           # Device testing tools
│   ├── sensor_test.ino                # Individual sensor tests
│   ├── connectivity_test.ino          # Network connectivity tests
│   └── performance_benchmark.ino      # Performance measurements
└── deployment/                        # Field deployment guides
    ├── installation_guide.md          # Setup instructions
    ├── calibration_procedure.md       # Sensor calibration steps
    └── troubleshooting_guide.md       # Common issues and fixes
```

---

## 🚀 **Technology Stack**

### **Hardware Platform:**

#### **1. ESP32 Microcontroller**
```cpp
// Main ESP32 features we utilize:
// - Dual-core processor (240MHz)
// - Built-in WiFi and Bluetooth
// - Low power modes
// - Multiple ADC channels
// - I2C, SPI, UART interfaces
// - Real-time clock (RTC)

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <esp_sleep.h>
```

**Why ESP32?**
- **Connectivity**: Built-in WiFi for MQTT communication
- **Processing Power**: Sufficient for sensor data processing and transmission
- **Low Power**: Deep sleep modes for battery operation
- **Expandability**: Multiple interfaces for various sensors
- **Cost-Effective**: Affordable for large-scale deployment

#### **2. Sensor Integration**
- **DHT22**: Temperature and humidity sensor
- **Soil Moisture Sensors**: Capacitive and resistive types
- **pH Sensors**: Soil acidity measurement
- **Light Sensors**: Photoresistors and lux meters
- **NPK Sensors**: Soil nutrient analysis
- **Rain Sensors**: Precipitation detection

#### **3. Communication Protocols**
- **MQTT**: Primary data transmission protocol
- **WiFi**: Wireless network connectivity
- **LoRaWAN**: Long-range, low-power communication (future)
- **Bluetooth**: Local configuration and debugging

---

## 📟 **Device Architecture**

### **Core System Design:**

```cpp
// Main system architecture
class AgriculturalSensorNode {
private:
    SensorManager sensors;
    MQTTClient mqttClient;
    PowerManager powerMgr;
    DataLogger logger;
    
public:
    void setup();
    void loop();
    void enterSleepMode();
    void handleWakeup();
    
    // Sensor operations
    bool readAllSensors();
    void calibrateSensors();
    void validateReadings();
    
    // Communication
    bool connectToNetwork();
    bool publishData();
    void handleIncomingCommands();
    
    // Power management
    void optimizePowerConsumption();
    float getBatteryLevel();
    void manageSolarCharging();
};
```

### **Sensor Data Structure:**

```cpp
struct SensorReading {
    uint32_t timestamp;
    String deviceId;
    Location coordinates;
    
    struct Environment {
        float temperature;      // Celsius
        float humidity;         // Percentage
        float soilMoisture;     // Percentage
        float soilPH;          // pH units
        float lightIntensity;   // Lux
        float batteryVoltage;   // Volts
    } environment;
    
    struct QualityFlags {
        bool temperatureValid;
        bool humidityValid;
        bool soilMoistureValid;
        bool phValid;
        bool lightValid;
    } quality;
    
    float signalStrength;      // WiFi RSSI
    uint8_t dataQuality;       // Overall quality score (0-100)
};
```

---

## 🔧 **Device Implementation**

### **1. Main Sensor Node Code:**

```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <esp_sleep.h>

class AgriculturalSensorDevice {
private:
    // Hardware pins
    static const int DHT_PIN = 4;
    static const int SOIL_MOISTURE_PIN = A0;
    static const int PH_SENSOR_PIN = A1;
    static const int LIGHT_SENSOR_PIN = A2;
    static const int BATTERY_PIN = A3;
    
    // Sensor objects
    DHT dht;
    WiFiClient wifiClient;
    PubSubClient mqttClient;
    
    // Configuration
    String deviceId;
    String wifiSSID;
    String wifiPassword;
    String mqttBroker;
    int mqttPort;
    
    // Data buffers
    SensorReading currentReading;
    SensorReading previousReading;
    
public:
    AgriculturalSensorDevice() : dht(DHT_PIN, DHT22), mqttClient(wifiClient) {
        // Initialize device ID
        deviceId = "AGRI_" + WiFi.macAddress();
        deviceId.replace(":", "");
    }
    
    void setup() {
        Serial.begin(115200);
        
        // Initialize sensors
        dht.begin();
        analogReadResolution(12);  // 12-bit ADC resolution
        
        // Load configuration
        loadConfiguration();
        
        // Setup WiFi and MQTT
        setupWiFi();
        setupMQTT();
        
        // Initialize RTC for timestamps
        configTime(0, 0, "pool.ntp.org");
        
        Serial.println("Agricultural Sensor Node initialized: " + deviceId);
    }
    
    void loop() {
        // Maintain MQTT connection
        if (!mqttClient.connected()) {
            reconnectMQTT();
        }
        mqttClient.loop();
        
        // Read sensors every minute
        static unsigned long lastReading = 0;
        if (millis() - lastReading >= 60000) {
            if (readAllSensors()) {
                publishSensorData();
                logDataLocally();
            }
            lastReading = millis();
        }
        
        // Check for low battery
        if (currentReading.environment.batteryVoltage < 3.3) {
            enterLowPowerMode();
        }
        
        // Handle OTA updates
        handleOTAUpdates();
        
        delay(1000);
    }
    
private:
    bool readAllSensors() {
        currentReading.timestamp = getUnixTime();
        currentReading.deviceId = deviceId;
        
        // Read DHT22 (temperature and humidity)
        float temp = dht.readTemperature();
        float hum = dht.readHumidity();
        
        if (!isnan(temp) && !isnan(hum)) {
            currentReading.environment.temperature = temp;
            currentReading.environment.humidity = hum;
            currentReading.quality.temperatureValid = true;
            currentReading.quality.humidityValid = true;
        } else {
            currentReading.quality.temperatureValid = false;
            currentReading.quality.humidityValid = false;
        }
        
        // Read soil moisture (capacitive sensor)
        int soilRaw = analogRead(SOIL_MOISTURE_PIN);
        currentReading.environment.soilMoisture = mapSoilMoisture(soilRaw);
        currentReading.quality.soilMoistureValid = (soilRaw > 0 && soilRaw < 4095);
        
        // Read pH sensor
        int phRaw = analogRead(PH_SENSOR_PIN);
        currentReading.environment.soilPH = calibratePH(phRaw);
        currentReading.quality.phValid = (phRaw > 100 && phRaw < 3900);
        
        // Read light sensor
        int lightRaw = analogRead(LIGHT_SENSOR_PIN);
        currentReading.environment.lightIntensity = mapLightIntensity(lightRaw);
        currentReading.quality.lightValid = true;
        
        // Read battery voltage
        int batteryRaw = analogRead(BATTERY_PIN);
        currentReading.environment.batteryVoltage = (batteryRaw * 3.3) / 4095.0 * 2; // Voltage divider
        
        // Get WiFi signal strength
        currentReading.signalStrength = WiFi.RSSI();
        
        // Calculate overall data quality
        currentReading.dataQuality = calculateDataQuality();
        
        // Validate readings against previous values
        return validateReadings();
    }
    
    float mapSoilMoisture(int rawValue) {
        // Calibration values for capacitive soil moisture sensor
        const int dryValue = 3000;    // Sensor value in dry soil
        const int wetValue = 1000;    // Sensor value in wet soil
        
        if (rawValue > dryValue) return 0;
        if (rawValue < wetValue) return 100;
        
        return map(rawValue, dryValue, wetValue, 0, 100);
    }
    
    float calibratePH(int rawValue) {
        // pH sensor calibration (typical values)
        const float neutralVoltage = 1.65;  // 1.65V at pH 7
        const float acidSlope = 0.18;       // -59.16mV/pH unit
        
        float voltage = (rawValue * 3.3) / 4095.0;
        float ph = 7.0 - ((voltage - neutralVoltage) / acidSlope);
        
        return constrain(ph, 0.0, 14.0);
    }
    
    float mapLightIntensity(int rawValue) {
        // Convert analog reading to lux (approximate)
        float voltage = (rawValue * 3.3) / 4095.0;
        float resistance = (3.3 - voltage) / voltage * 10000; // 10kΩ pull-up
        
        // Approximate lux calculation for LDR
        return 500000.0 / resistance;
    }
    
    bool validateReadings() {
        // Check for reasonable sensor values
        if (currentReading.environment.temperature < -40 || 
            currentReading.environment.temperature > 80) {
            return false;
        }
        
        if (currentReading.environment.humidity < 0 || 
            currentReading.environment.humidity > 100) {
            return false;
        }
        
        // Check for sudden large changes (possible sensor malfunction)
        if (abs(currentReading.environment.temperature - previousReading.environment.temperature) > 10) {
            Serial.println("Warning: Large temperature change detected");
        }
        
        return true;
    }
    
    uint8_t calculateDataQuality() {
        uint8_t score = 0;
        uint8_t maxScore = 0;
        
        // Temperature quality
        if (currentReading.quality.temperatureValid) score += 20;
        maxScore += 20;
        
        // Humidity quality
        if (currentReading.quality.humidityValid) score += 20;
        maxScore += 20;
        
        // Soil moisture quality
        if (currentReading.quality.soilMoistureValid) score += 25;
        maxScore += 25;
        
        // pH quality
        if (currentReading.quality.phValid) score += 20;
        maxScore += 20;
        
        // Signal strength quality
        if (currentReading.signalStrength > -70) score += 15;
        maxScore += 15;
        
        return (score * 100) / maxScore;
    }
    
    void publishSensorData() {
        // Create JSON payload
        StaticJsonDocument<1024> doc;
        doc["device_id"] = deviceId;
        doc["timestamp"] = currentReading.timestamp;
        doc["location"]["lat"] = 0.0;  // Set actual coordinates
        doc["location"]["lon"] = 0.0;
        
        doc["measurements"]["temperature"] = currentReading.environment.temperature;
        doc["measurements"]["humidity"] = currentReading.environment.humidity;
        doc["measurements"]["soil_moisture"] = currentReading.environment.soilMoisture;
        doc["measurements"]["ph_level"] = currentReading.environment.soilPH;
        doc["measurements"]["light_intensity"] = currentReading.environment.lightIntensity;
        doc["measurements"]["battery_level"] = currentReading.environment.batteryVoltage;
        
        doc["quality"]["overall_score"] = currentReading.dataQuality;
        doc["quality"]["temperature_valid"] = currentReading.quality.temperatureValid;
        doc["quality"]["humidity_valid"] = currentReading.quality.humidityValid;
        doc["quality"]["soil_moisture_valid"] = currentReading.quality.soilMoistureValid;
        doc["quality"]["ph_valid"] = currentReading.quality.phValid;
        
        doc["network"]["signal_strength"] = currentReading.signalStrength;
        doc["network"]["ip_address"] = WiFi.localIP().toString();
        
        // Serialize and publish
        String payload;
        serializeJson(doc, payload);
        
        String topic = "agri/sensors/" + deviceId + "/data";
        
        if (mqttClient.publish(topic.c_str(), payload.c_str())) {
            Serial.println("Data published successfully");
            Serial.println("Payload: " + payload);
        } else {
            Serial.println("Failed to publish data");
            // Store data locally for retry
            storeForRetry(payload);
        }
    }
};
```

### **2. Power Management:**

```cpp
class PowerManager {
private:
    const int BATTERY_PIN = A3;
    const int SOLAR_PIN = A4;
    const int CHARGING_PIN = 5;
    
    float batteryVoltage;
    float solarVoltage;
    bool isCharging;
    
public:
    void setup() {
        pinMode(CHARGING_PIN, INPUT);
        analogReadResolution(12);
    }
    
    void updatePowerStatus() {
        // Read battery voltage
        int batteryRaw = analogRead(BATTERY_PIN);
        batteryVoltage = (batteryRaw * 3.3 / 4095.0) * 2; // Voltage divider compensation
        
        // Read solar panel voltage
        int solarRaw = analogRead(SOLAR_PIN);
        solarVoltage = (solarRaw * 3.3 / 4095.0) * 3; // Solar panel voltage divider
        
        // Check charging status
        isCharging = digitalRead(CHARGING_PIN);
    }
    
    bool shouldEnterDeepSleep() {
        return (batteryVoltage < 3.4 && !isCharging);
    }
    
    void enterDeepSleep(uint64_t sleepTimeUs) {
        Serial.println("Entering deep sleep for " + String(sleepTimeUs / 1000000) + " seconds");
        
        // Configure wakeup source
        esp_sleep_enable_timer_wakeup(sleepTimeUs);
        
        // Optionally wake up on external interrupt (rain sensor, etc.)
        esp_sleep_enable_ext0_wakeup(GPIO_NUM_2, 0);
        
        // Enter deep sleep
        esp_deep_sleep_start();
    }
    
    uint8_t getBatteryPercentage() {
        // LiPo battery: 3.0V (empty) to 4.2V (full)
        if (batteryVoltage >= 4.2) return 100;
        if (batteryVoltage <= 3.0) return 0;
        
        return (uint8_t)((batteryVoltage - 3.0) / 1.2 * 100);
    }
};
```

### **3. MQTT Communication Handler:**

```cpp
class MQTTManager {
private:
    PubSubClient* client;
    String brokerHost;
    int brokerPort;
    String username;
    String password;
    String clientId;
    
public:
    MQTTManager(PubSubClient* mqttClient) : client(mqttClient) {}
    
    void setup(String broker, int port, String user, String pass) {
        brokerHost = broker;
        brokerPort = port;
        username = user;
        password = pass;
        clientId = "AgriSensor_" + WiFi.macAddress();
        
        client->setServer(broker.c_str(), port);
        client->setCallback([this](char* topic, byte* payload, unsigned int length) {
            this->handleIncomingMessage(topic, payload, length);
        });
    }
    
    bool connect() {
        Serial.print("Connecting to MQTT broker: " + brokerHost);
        
        int attempts = 0;
        while (!client->connected() && attempts < 5) {
            Serial.print(".");
            
            if (client->connect(clientId.c_str(), username.c_str(), password.c_str())) {
                Serial.println(" connected!");
                
                // Subscribe to command topics
                subscribeToCommands();
                
                // Publish device online status
                publishDeviceStatus("online");
                
                return true;
            }
            
            attempts++;
            delay(2000);
        }
        
        Serial.println(" failed!");
        return false;
    }
    
    void subscribeToCommands() {
        String commandTopic = "agri/sensors/" + getDeviceId() + "/commands";
        client->subscribe(commandTopic.c_str());
        
        String configTopic = "agri/sensors/" + getDeviceId() + "/config";
        client->subscribe(configTopic.c_str());
        
        Serial.println("Subscribed to command topics");
    }
    
    void handleIncomingMessage(char* topic, byte* payload, unsigned int length) {
        String message;
        for (int i = 0; i < length; i++) {
            message += (char)payload[i];
        }
        
        Serial.println("Received message on topic: " + String(topic));
        Serial.println("Message: " + message);
        
        // Parse JSON command
        StaticJsonDocument<256> doc;
        deserializeJson(doc, message);
        
        String command = doc["command"];
        
        if (command == "calibrate") {
            calibrateSensors();
        } else if (command == "reset") {
            ESP.restart();
        } else if (command == "sleep") {
            int sleepMinutes = doc["duration"];
            enterDeepSleep(sleepMinutes * 60 * 1000000ULL);
        } else if (command == "update_config") {
            updateConfiguration(doc);
        }
    }
    
    bool publishData(const String& data) {
        String topic = "agri/sensors/" + getDeviceId() + "/data";
        
        if (client->publish(topic.c_str(), data.c_str(), true)) { // Retained message
            return true;
        }
        
        // If publish fails, store for retry
        storeFailedMessage(topic, data);
        return false;
    }
    
    void publishDeviceStatus(const String& status) {
        String topic = "agri/sensors/" + getDeviceId() + "/status";
        
        StaticJsonDocument<128> doc;
        doc["status"] = status;
        doc["timestamp"] = getUnixTime();
        doc["ip"] = WiFi.localIP().toString();
        doc["rssi"] = WiFi.RSSI();
        
        String payload;
        serializeJson(doc, payload);
        
        client->publish(topic.c_str(), payload.c_str(), true);
    }
};
```

---

## 🌐 **Network Architecture**

### **Communication Protocol Stack:**

```
┌─────────────────┐
│   Application   │  JSON data format, sensor readings
├─────────────────┤
│      MQTT       │  Publish/Subscribe messaging
├─────────────────┤
│      TCP        │  Reliable data transmission
├─────────────────┤
│      WiFi       │  Wireless network layer
├─────────────────┤
│   IEEE 802.11   │  Physical wireless standard
└─────────────────┘
```

### **MQTT Topic Structure:**

```
agri/
├── sensors/
│   ├── DEVICE_001/
│   │   ├── data          # Sensor readings
│   │   ├── status        # Device status
│   │   ├── commands      # Remote commands
│   │   └── config        # Configuration updates
│   ├── DEVICE_002/
│   │   └── ...
│   └── ...
├── alerts/
│   ├── critical          # Critical system alerts
│   ├── warnings          # Warning messages
│   └── info              # Informational messages
└── system/
    ├── network_status    # Network health
    ├── gateway_status    # Gateway device status
    └── diagnostics       # System diagnostics
```

### **Data Transmission Optimization:**

```cpp
class DataTransmissionOptimizer {
private:
    struct QueuedMessage {
        String topic;
        String payload;
        unsigned long timestamp;
        int retryCount;
    };
    
    std::vector<QueuedMessage> messageQueue;
    const int MAX_QUEUE_SIZE = 50;
    const int MAX_RETRIES = 3;
    
public:
    void addMessage(const String& topic, const String& payload) {
        if (messageQueue.size() >= MAX_QUEUE_SIZE) {
            // Remove oldest message if queue is full
            messageQueue.erase(messageQueue.begin());
        }
        
        QueuedMessage msg = {topic, payload, millis(), 0};
        messageQueue.push_back(msg);
    }
    
    void processQueue(MQTTManager& mqtt) {
        auto it = messageQueue.begin();
        
        while (it != messageQueue.end()) {
            if (mqtt.publish(it->topic, it->payload)) {
                // Message sent successfully
                it = messageQueue.erase(it);
            } else {
                // Increment retry count
                it->retryCount++;
                
                if (it->retryCount > MAX_RETRIES) {
                    Serial.println("Message exceeded max retries, dropping");
                    it = messageQueue.erase(it);
                } else {
                    ++it;
                }
            }
        }
    }
    
    void compressData(String& jsonData) {
        // Simple data compression techniques
        jsonData.replace("temperature", "t");
        jsonData.replace("humidity", "h");
        jsonData.replace("soil_moisture", "sm");
        jsonData.replace("ph_level", "ph");
        jsonData.replace("light_intensity", "li");
        jsonData.replace("battery_level", "bl");
    }
};
```

---

## 🔋 **Power Management & Optimization**

### **Battery Life Optimization Strategies:**

#### **1. Intelligent Sleep Modes**
```cpp
class IntelligentPowerManager {
private:
    enum PowerMode {
        NORMAL_OPERATION,
        ECO_MODE,
        DEEP_SLEEP_MODE,
        EMERGENCY_MODE
    };
    
    PowerMode currentMode;
    float batteryVoltage;
    bool solarCharging;
    
public:
    void optimizePowerConsumption() {
        updatePowerStatus();
        
        if (batteryVoltage > 4.0 && solarCharging) {
            currentMode = NORMAL_OPERATION;
            setReadingInterval(60);  // 1 minute intervals
            
        } else if (batteryVoltage > 3.7) {
            currentMode = ECO_MODE;
            setReadingInterval(300); // 5 minute intervals
            
        } else if (batteryVoltage > 3.4) {
            currentMode = DEEP_SLEEP_MODE;
            setReadingInterval(1800); // 30 minute intervals
            
        } else {
            currentMode = EMERGENCY_MODE;
            setReadingInterval(3600); // 1 hour intervals
        }
    }
    
    void setReadingInterval(int seconds) {
        // Configure timer wakeup for next reading
        esp_sleep_enable_timer_wakeup(seconds * 1000000ULL);
    }
    
    void enterSmartSleep() {
        // Disable unnecessary peripherals
        WiFi.disconnect();
        WiFi.mode(WIFI_OFF);
        btStop();
        
        // Configure minimal wakeup sources
        esp_sleep_enable_timer_wakeup(getNextWakeupTime());
        esp_sleep_enable_ext0_wakeup(GPIO_NUM_2, 0); // Emergency wakeup button
        
        Serial.println("Entering smart sleep mode");
        esp_deep_sleep_start();
    }
};
```

#### **2. Solar Charging Integration**
```cpp
class SolarChargeController {
private:
    const int SOLAR_VOLTAGE_PIN = A4;
    const int CHARGE_CURRENT_PIN = A5;
    const int MPPT_CONTROL_PIN = 6;
    
public:
    struct SolarStatus {
        float solarVoltage;
        float chargeCurrent;
        float powerGenerated;
        bool isSolarAvailable;
        bool isCharging;
    };
    
    SolarStatus getSolarStatus() {
        SolarStatus status;
        
        // Read solar panel voltage
        int solarRaw = analogRead(SOLAR_VOLTAGE_PIN);
        status.solarVoltage = (solarRaw * 3.3 / 4095.0) * 5; // Voltage divider for higher voltages
        
        // Read charge current (using current sensor)
        int currentRaw = analogRead(CHARGE_CURRENT_PIN);
        status.chargeCurrent = (currentRaw - 2048) * 3.3 / 4095.0 / 0.066; // ACS712 sensor
        
        // Calculate power
        status.powerGenerated = status.solarVoltage * status.chargeCurrent;
        
        // Determine solar availability
        status.isSolarAvailable = status.solarVoltage > 5.0;
        status.isCharging = status.chargeCurrent > 0.1;
        
        return status;
    }
    
    void optimizeChargingEfficiency() {
        SolarStatus solar = getSolarStatus();
        
        if (solar.isSolarAvailable) {
            // Implement simple MPPT (Maximum Power Point Tracking)
            float targetVoltage = solar.solarVoltage * 0.8; // Approximate MPP
            
            // Adjust charging parameters (simplified)
            int pwmValue = map(targetVoltage, 0, 20, 0, 255);
            analogWrite(MPPT_CONTROL_PIN, pwmValue);
        }
    }
};
```

---

## 🛡️ **Device Security & Authentication**

### **Security Implementation:**

```cpp
class DeviceSecurity {
private:
    String deviceCertificate;
    String privateKey;
    String rootCA;
    
public:
    bool setupTLSSecurity() {
        // Load certificates from SPIFFS
        if (!loadCertificates()) {
            Serial.println("Failed to load security certificates");
            return false;
        }
        
        // Configure secure MQTT with TLS
        WiFiClientSecure secureClient;
        secureClient.setCACert(rootCA.c_str());
        secureClient.setCertificate(deviceCertificate.c_str());
        secureClient.setPrivateKey(privateKey.c_str());
        
        return true;
    }
    
    String generateSecureDeviceId() {
        // Use ESP32 unique chip ID and MAC address
        uint64_t chipId = ESP.getEfuseMac();
        String macAddress = WiFi.macAddress();
        
        // Create hash-based secure ID
        return "AGRI_" + String((uint32_t)(chipId >> 32), HEX) + 
               String((uint32_t)chipId, HEX);
    }
    
    bool validateDataIntegrity(const String& data, const String& checksum) {
        // Simple checksum validation
        uint32_t calculatedChecksum = 0;
        for (char c : data) {
            calculatedChecksum += (uint8_t)c;
        }
        
        return String(calculatedChecksum, HEX) == checksum;
    }
    
    String encryptSensitiveData(const String& data) {
        // Implement simple XOR encryption for sensitive data
        String encrypted = data;
        const char key[] = "AGRI_SECRET_KEY_2024";
        
        for (int i = 0; i < encrypted.length(); i++) {
            encrypted[i] ^= key[i % strlen(key)];
        }
        
        return encrypted;
    }
};
```

---

## 📡 **Field Deployment & Installation**

### **Device Installation Guide:**

#### **1. Site Selection Criteria**
```cpp
class SiteAssessment {
public:
    struct SiteScore {
        float wifiSignalStrength;
        float solarExposure;
        float soilAccessibility;
        float protectionLevel;
        float overallScore;
        bool recommended;
    };
    
    SiteScore assessInstallationSite() {
        SiteScore score;
        
        // WiFi signal assessment
        score.wifiSignalStrength = assessWiFiSignal();
        
        // Solar exposure assessment (simplified)
        score.solarExposure = assessSolarExposure();
        
        // Soil accessibility
        score.soilAccessibility = 1.0; // Manual assessment
        
        // Protection from weather/animals
        score.protectionLevel = assessProtection();
        
        // Calculate overall score
        score.overallScore = (score.wifiSignalStrength * 0.3 +
                             score.solarExposure * 0.25 +
                             score.soilAccessibility * 0.25 +
                             score.protectionLevel * 0.2);
        
        score.recommended = score.overallScore > 0.7;
        
        return score;
    }
    
private:
    float assessWiFiSignal() {
        int32_t rssi = WiFi.RSSI();
        if (rssi > -50) return 1.0;      // Excellent
        if (rssi > -60) return 0.8;      // Good
        if (rssi > -70) return 0.6;      // Fair
        if (rssi > -80) return 0.4;      // Poor
        return 0.2;                      // Very poor
    }
    
    float assessSolarExposure() {
        // Read light sensor for several hours to assess solar exposure
        // This is a simplified version - actual implementation would
        // require extended monitoring
        int lightReading = analogRead(A2);
        return map(lightReading, 0, 4095, 0.0, 1.0);
    }
    
    float assessProtection() {
        // Manual assessment criteria
        // - Distance from water sources
        // - Protection from animals
        // - Shelter from extreme weather
        return 0.8; // Default good protection
    }
};
```

#### **2. Calibration Procedures**
```cpp
class SensorCalibration {
private:
    struct CalibrationData {
        float tempOffset;
        float humidityOffset;
        float soilMoistureMin;
        float soilMoistureMax;
        float phNeutralVoltage;
        float phSlope;
    };
    
    CalibrationData calibration;
    
public:
    void performFullCalibration() {
        Serial.println("Starting sensor calibration...");
        
        // Temperature calibration
        calibrateTemperature();
        
        // Humidity calibration
        calibrateHumidity();
        
        // Soil moisture calibration
        calibrateSoilMoisture();
        
        // pH calibration
        calibratePH();
        
        // Save calibration data
        saveCalibrationData();
        
        Serial.println("Calibration complete!");
    }
    
private:
    void calibrateTemperature() {
        Serial.println("Temperature calibration:");
        Serial.println("Place sensor in known temperature environment");
        Serial.println("Enter reference temperature (°C):");
        
        // Wait for user input or reference temperature
        float referenceTemp = 25.0; // Default or user input
        
        // Take multiple readings
        float sensorTemp = 0;
        for (int i = 0; i < 10; i++) {
            sensorTemp += dht.readTemperature();
            delay(1000);
        }
        sensorTemp /= 10;
        
        calibration.tempOffset = referenceTemp - sensorTemp;
        
        Serial.println("Temperature offset: " + String(calibration.tempOffset));
    }
    
    void calibrateSoilMoisture() {
        Serial.println("Soil moisture calibration:");
        
        // Dry soil calibration
        Serial.println("Place sensor in completely dry soil, press button when ready");
        waitForButtonPress();
        
        int dryReading = 0;
        for (int i = 0; i < 20; i++) {
            dryReading += analogRead(SOIL_MOISTURE_PIN);
            delay(500);
        }
        calibration.soilMoistureMax = dryReading / 20;
        
        // Wet soil calibration
        Serial.println("Place sensor in saturated soil, press button when ready");
        waitForButtonPress();
        
        int wetReading = 0;
        for (int i = 0; i < 20; i++) {
            wetReading += analogRead(SOIL_MOISTURE_PIN);
            delay(500);
        }
        calibration.soilMoistureMin = wetReading / 20;
        
        Serial.println("Soil moisture range: " + String(calibration.soilMoistureMin) + 
                      " to " + String(calibration.soilMoistureMax));
    }
    
    void calibratePH() {
        Serial.println("pH sensor calibration:");
        
        // pH 7 calibration
        Serial.println("Place sensor in pH 7 buffer solution");
        waitForButtonPress();
        
        int neutralReading = 0;
        for (int i = 0; i < 20; i++) {
            neutralReading += analogRead(PH_SENSOR_PIN);
            delay(500);
        }
        calibration.phNeutralVoltage = (neutralReading / 20) * 3.3 / 4095.0;
        
        // pH 4 calibration for slope
        Serial.println("Place sensor in pH 4 buffer solution");
        waitForButtonPress();
        
        int acidReading = 0;
        for (int i = 0; i < 20; i++) {
            acidReading += analogRead(PH_SENSOR_PIN);
            delay(500);
        }
        float acidVoltage = (acidReading / 20) * 3.3 / 4095.0;
        
        calibration.phSlope = (calibration.phNeutralVoltage - acidVoltage) / (7.0 - 4.0);
        
        Serial.println("pH calibration complete");
        Serial.println("Neutral voltage: " + String(calibration.phNeutralVoltage));
        Serial.println("pH slope: " + String(calibration.phSlope));
    }
};
```

---

## 🔧 **Integration with Other Teams**

### **Backend Integration (Suryansh):**

#### **MQTT Data Format Contract**
```cpp
// Standardized JSON format for sensor data
{
  "device_id": "AGRI_SENSOR_001",
  "timestamp": 1638360000,
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "elevation": 10.5
  },
  "measurements": {
    "temperature": 25.4,
    "humidity": 68.2,
    "soil_moisture": 45.7,
    "ph_level": 6.8,
    "light_intensity": 850.3,
    "battery_level": 3.8
  },
  "quality_flags": {
    "temperature_valid": true,
    "humidity_valid": true,
    "soil_moisture_valid": true,
    "ph_valid": true,
    "light_valid": true,
    "overall_quality": 95
  },
  "device_status": {
    "signal_strength": -65,
    "battery_percentage": 85,
    "solar_charging": true,
    "uptime_minutes": 1440,
    "last_reboot_reason": "power_on"
  }
}
```

#### **Command Interface**
```cpp
// Commands that devices can receive from backend
void handleRemoteCommand(const String& command, const JsonObject& params) {
    if (command == "calibrate_sensors") {
        String sensorType = params["sensor_type"];
        performCalibration(sensorType);
        
    } else if (command == "update_reading_interval") {
        int newInterval = params["interval_seconds"];
        setReadingInterval(newInterval);
        
    } else if (command == "enter_maintenance_mode") {
        enterMaintenanceMode();
        
    } else if (command == "reboot") {
        publishStatus("rebooting");
        delay(1000);
        ESP.restart();
        
    } else if (command == "update_location") {
        float lat = params["latitude"];
        float lon = params["longitude"];
        updateDeviceLocation(lat, lon);
    }
}
```

### **AI Team Integration (Aryan):**

#### **Enhanced Sensor Data for AI**
```cpp
class AIDataEnhancer {
public:
    JsonObject enhanceDataForAI(JsonObject basicData) {
        StaticJsonDocument<2048> enhancedDoc;
        
        // Copy basic sensor data
        enhancedDoc["basic_measurements"] = basicData["measurements"];
        
        // Add derived features for AI
        enhancedDoc["derived_features"] = calculateDerivedFeatures(basicData);
        
        // Add temporal context
        enhancedDoc["temporal_context"] = getTemporalContext();
        
        // Add environmental context
        enhancedDoc["environmental_context"] = getEnvironmentalContext();
        
        return enhancedDoc.as<JsonObject>();
    }
    
private:
    JsonObject calculateDerivedFeatures(JsonObject data) {
        StaticJsonDocument<512> derived;
        
        float temp = data["measurements"]["temperature"];
        float humidity = data["measurements"]["humidity"];
        float soilMoisture = data["measurements"]["soil_moisture"];
        
        // Vapor Pressure Deficit (important for plant stress)
        float vpd = calculateVPD(temp, humidity);
        derived["vapor_pressure_deficit"] = vpd;
        
        // Growing Degree Days contribution
        derived["gdd_contribution"] = max(0.0f, (temp - 10.0f)); // Base temp 10°C
        
        // Soil moisture stress indicator
        derived["soil_stress_index"] = calculateSoilStressIndex(soilMoisture);
        
        // Light adequacy for photosynthesis
        float light = data["measurements"]["light_intensity"];
        derived["light_adequacy"] = light / 2000.0; // Normalized to typical full sun
        
        return derived.as<JsonObject>();
    }
    
    float calculateVPD(float temperature, float relativeHumidity) {
        // Calculate Vapor Pressure Deficit
        float svp = 0.6108 * exp(17.27 * temperature / (temperature + 237.3));
        float avp = svp * relativeHumidity / 100.0;
        return svp - avp;
    }
};
```

### **Data Team Integration (Neha):**

#### **Data Quality Assurance**
```cpp
class DataQualityManager {
private:
    struct QualityMetrics {
        float completeness;     // Percentage of successful readings
        float accuracy;         // Based on sensor validation
        float consistency;      // Temporal consistency
        float timeliness;       // Data freshness
        float overall_score;
    };
    
public:
    QualityMetrics assessDataQuality(const SensorReading& reading) {
        QualityMetrics metrics;
        
        // Completeness - how many sensors provided valid data
        int validSensors = 0;
        int totalSensors = 5; // temp, humidity, soil, pH, light
        
        if (reading.quality.temperatureValid) validSensors++;
        if (reading.quality.humidityValid) validSensors++;
        if (reading.quality.soilMoistureValid) validSensors++;
        if (reading.quality.phValid) validSensors++;
        if (reading.quality.lightValid) validSensors++;
        
        metrics.completeness = (float)validSensors / totalSensors;
        
        // Accuracy - based on sensor specifications and validation
        metrics.accuracy = calculateAccuracyScore(reading);
        
        // Consistency - compare with recent readings
        metrics.consistency = assessTemporalConsistency(reading);
        
        // Timeliness - how recent is the data
        metrics.timeliness = assessTimeliness(reading.timestamp);
        
        // Overall score (weighted average)
        metrics.overall_score = (metrics.completeness * 0.3 +
                               metrics.accuracy * 0.3 +
                               metrics.consistency * 0.2 +
                               metrics.timeliness * 0.2);
        
        return metrics;
    }
    
    bool shouldTransmitReading(const QualityMetrics& quality) {
        // Only transmit if overall quality is acceptable
        return quality.overall_score >= 0.7;
    }
    
    String generateQualityReport(const QualityMetrics& quality) {
        StaticJsonDocument<256> report;
        
        report["completeness"] = quality.completeness;
        report["accuracy"] = quality.accuracy;
        report["consistency"] = quality.consistency;
        report["timeliness"] = quality.timeliness;
        report["overall_score"] = quality.overall_score;
        report["recommendation"] = quality.overall_score >= 0.8 ? "excellent" :
                                  quality.overall_score >= 0.6 ? "good" : "needs_attention";
        
        String output;
        serializeJson(report, output);
        return output;
    }
};
```

---

## 🧪 **Testing & Validation**

### **Device Testing Framework:**

#### **1. Automated Hardware Tests**
```cpp
class HardwareTestSuite {
public:
    struct TestResults {
        bool sensorConnectivity;
        bool wifiConnectivity;
        bool mqttConnectivity;
        bool powerSystem;
        bool dataAccuracy;
        float overallScore;
    };
    
    TestResults runFullDiagnostics() {
        TestResults results = {false, false, false, false, false, 0.0};
        
        Serial.println("=== HARDWARE DIAGNOSTICS ===");
        
        // Test 1: Sensor connectivity
        results.sensorConnectivity = testSensorConnectivity();
        
        // Test 2: WiFi connectivity  
        results.wifiConnectivity = testWiFiConnectivity();
        
        // Test 3: MQTT connectivity
        results.mqttConnectivity = testMQTTConnectivity();
        
        // Test 4: Power system
        results.powerSystem = testPowerSystem();
        
        // Test 5: Data accuracy
        results.dataAccuracy = testDataAccuracy();
        
        // Calculate overall score
        int passedTests = results.sensorConnectivity + results.wifiConnectivity + 
                         results.mqttConnectivity + results.powerSystem + results.dataAccuracy;
        results.overallScore = (float)passedTests / 5.0;
        
        printTestResults(results);
        
        return results;
    }
    
private:
    bool testSensorConnectivity() {
        Serial.print("Testing sensor connectivity... ");
        
        // Test DHT22
        float temp = dht.readTemperature();
        float hum = dht.readHumidity();
        bool dhtOk = !isnan(temp) && !isnan(hum);
        
        // Test analog sensors
        bool analogOk = true;
        int soilReading = analogRead(SOIL_MOISTURE_PIN);
        int phReading = analogRead(PH_SENSOR_PIN);
        int lightReading = analogRead(LIGHT_SENSOR_PIN);
        
        analogOk = (soilReading > 0 && soilReading < 4095) &&
                   (phReading > 0 && phReading < 4095) &&
                   (lightReading >= 0 && lightReading <= 4095);
        
        bool result = dhtOk && analogOk;
        Serial.println(result ? "PASS" : "FAIL");
        
        if (!result) {
            Serial.println("  DHT22: " + String(dhtOk ? "OK" : "FAIL"));
            Serial.println("  Analog sensors: " + String(analogOk ? "OK" : "FAIL"));
        }
        
        return result;
    }
    
    bool testWiFiConnectivity() {
        Serial.print("Testing WiFi connectivity... ");
        
        WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
        
        int timeout = 0;
        while (WiFi.status() != WL_CONNECTED && timeout < 20) {
            delay(500);
            timeout++;
        }
        
        bool connected = WiFi.status() == WL_CONNECTED;
        Serial.println(connected ? "PASS" : "FAIL");
        
        if (connected) {
            Serial.println("  IP: " + WiFi.localIP().toString());
            Serial.println("  RSSI: " + String(WiFi.RSSI()) + " dBm");
        }
        
        return connected;
    }
    
    bool testMQTTConnectivity() {
        Serial.print("Testing MQTT connectivity... ");
        
        PubSubClient testClient(wifiClient);
        testClient.setServer(MQTT_BROKER, MQTT_PORT);
        
        bool connected = testClient.connect("TEST_CLIENT");
        Serial.println(connected ? "PASS" : "FAIL");
        
        if (connected) {
            // Test publish
            bool published = testClient.publish("test/connectivity", "test_message");
            Serial.println("  Publish test: " + String(published ? "OK" : "FAIL"));
            testClient.disconnect();
        }
        
        return connected;
    }
    
    bool testPowerSystem() {
        Serial.print("Testing power system... ");
        
        // Read battery voltage
        int batteryRaw = analogRead(BATTERY_PIN);
        float batteryVoltage = (batteryRaw * 3.3 / 4095.0) * 2;
        
        // Check solar panel
        int solarRaw = analogRead(SOLAR_PIN);
        float solarVoltage = (solarRaw * 3.3 / 4095.0) * 3;
        
        bool batteryOk = batteryVoltage > 3.0 && batteryVoltage < 5.0;
        bool solarOk = solarVoltage >= 0.0 && solarVoltage < 25.0;
        
        bool result = batteryOk && solarOk;
        Serial.println(result ? "PASS" : "FAIL");
        
        Serial.println("  Battery voltage: " + String(batteryVoltage) + "V");
        Serial.println("  Solar voltage: " + String(solarVoltage) + "V");
        
        return result;
    }
    
    bool testDataAccuracy() {
        Serial.print("Testing data accuracy... ");
        
        // Take multiple sensor readings and check for consistency
        float tempSum = 0, humSum = 0;
        int validReadings = 0;
        
        for (int i = 0; i < 5; i++) {
            float temp = dht.readTemperature();
            float hum = dht.readHumidity();
            
            if (!isnan(temp) && !isnan(hum)) {
                tempSum += temp;
                humSum += hum;
                validReadings++;
            }
            
            delay(2000);
        }
        
        if (validReadings >= 3) {
            float avgTemp = tempSum / validReadings;
            float avgHum = humSum / validReadings;
            
            // Check if readings are within reasonable ranges
            bool tempReasonable = avgTemp >= -40 && avgTemp <= 80;
            bool humReasonable = avgHum >= 0 && avgHum <= 100;
            
            bool result = tempReasonable && humReasonable;
            Serial.println(result ? "PASS" : "FAIL");
            
            Serial.println("  Avg temperature: " + String(avgTemp) + "°C");
            Serial.println("  Avg humidity: " + String(avgHum) + "%");
            
            return result;
        }
        
        Serial.println("FAIL - Insufficient valid readings");
        return false;
    }
};
```

#### **2. Field Testing Protocol**
```cpp
class FieldTestProtocol {
public:
    void performFieldTest(int durationHours = 24) {
        Serial.println("Starting " + String(durationHours) + "-hour field test");
        
        unsigned long startTime = millis();
        unsigned long endTime = startTime + (durationHours * 3600000UL);
        
        int successfulTransmissions = 0;
        int totalAttempts = 0;
        float minBattery = 5.0;
        float maxBattery = 0.0;
        
        while (millis() < endTime) {
            // Regular sensor reading and transmission
            if (readAllSensors()) {
                totalAttempts++;
                if (publishSensorData()) {
                    successfulTransmissions++;
                }
            }
            
            // Monitor battery levels
            float currentBattery = getBatteryVoltage();
            minBattery = min(minBattery, currentBattery);
            maxBattery = max(maxBattery, currentBattery);
            
            // Log progress every hour
            if ((millis() - startTime) % 3600000 == 0) {
                logFieldTestProgress(successfulTransmissions, totalAttempts, 
                                   currentBattery, minBattery, maxBattery);
            }
            
            delay(60000); // 1 minute intervals
        }
        
        // Generate final report
        generateFieldTestReport(successfulTransmissions, totalAttempts,
                              minBattery, maxBattery, durationHours);
    }
    
private:
    void generateFieldTestReport(int successful, int total, 
                               float minBatt, float maxBatt, int hours) {
        float successRate = (float)successful / total * 100.0;
        float batteryDrop = maxBatt - minBatt;
        
        Serial.println("=== FIELD TEST REPORT ===");
        Serial.println("Duration: " + String(hours) + " hours");
        Serial.println("Transmission success rate: " + String(successRate) + "%");
        Serial.println("Total transmissions attempted: " + String(total));
        Serial.println("Successful transmissions: " + String(successful));
        Serial.println("Battery performance:");
        Serial.println("  Starting voltage: " + String(maxBatt) + "V");
        Serial.println("  Ending voltage: " + String(minBatt) + "V");
        Serial.println("  Total drop: " + String(batteryDrop) + "V");
        
        // Evaluate performance
        if (successRate >= 95.0 && batteryDrop < 0.5) {
            Serial.println("RESULT: EXCELLENT - Ready for deployment");
        } else if (successRate >= 85.0 && batteryDrop < 1.0) {
            Serial.println("RESULT: GOOD - Minor optimizations needed");
        } else {
            Serial.println("RESULT: NEEDS IMPROVEMENT - Address issues before deployment");
        }
    }
};
```

---

## 🎯 **Your Success Metrics**

### **Technical KPIs:**
1. **Data Transmission Reliability**: > 95% successful MQTT transmissions
2. **Battery Life**: > 30 days operation on single charge (with solar assistance)
3. **Sensor Accuracy**: ±2% for critical measurements
4. **Network Connectivity**: > 90% uptime in field conditions
5. **Environmental Resilience**: IP65 rating, -20°C to +70°C operation

### **System Integration KPIs:**
1. **Backend Compatibility**: 100% data format compliance
2. **Real-time Performance**: < 5 second data transmission latency
3. **Scalability**: Support 100+ devices per network
4. **Configuration Flexibility**: Remote configuration and updates
5. **Maintenance Requirements**: < 4 site visits per year per device

### **Deployment KPIs:**
1. **Installation Time**: < 30 minutes per device
2. **Calibration Accuracy**: ±5% deviation from reference standards
3. **Field Reliability**: > 99% device uptime
4. **User Training**: < 2 hours training for farm operators
5. **Support Response**: < 24 hours for critical issues

---

## 🚀 **Advanced Features & Future Development**

### **Edge Computing Capabilities:**
```cpp
// Future: Local AI processing on ESP32
class EdgeAIProcessor {
public:
    bool detectAnomalies(const SensorReading& reading) {
        // Simple anomaly detection using thresholds
        // Future: implement TinyML models
        return reading.environment.temperature > 45 || 
               reading.environment.soilMoisture < 10;
    }
    
    float predictSoilMoisture(const std::vector<float>& history) {
        // Simple linear prediction
        // Future: implement neural network inference
        if (history.size() >= 3) {
            float slope = (history.back() - history[history.size()-3]) / 2.0;
            return history.back() + slope;
        }
        return history.back();
    }
};
```

### **Mesh Networking:**
```cpp
// Future: ESP-NOW mesh network for extended coverage
class MeshNetworking {
private:
    struct MeshNode {
        uint8_t macAddress[6];
        int rssi;
        bool isGateway;
        int hopCount;
    };
    
public:
    void setupMeshNetwork() {
        // Initialize ESP-NOW for mesh communication
        // Implement routing protocols for multi-hop communication
    }
    
    bool forwardDataToGateway(const String& data) {
        // Forward sensor data through mesh network to gateway
        return false; // Implementation needed
    }
};
```

---

**Remember: You're building the nervous system of smart agriculture! Every sensor you deploy, every byte of data you transmit, and every optimization you make directly impacts how effectively farmers can monitor and care for their crops. Your IoT devices are the foundation that enables precision agriculture and sustainable farming practices! 🌱📡**

**The data your devices collect becomes the intelligence that drives better farming decisions, optimizes resource usage, and ultimately helps feed the world more efficiently. Keep pushing the boundaries of what's possible with IoT in agriculture! 🚀🌾**