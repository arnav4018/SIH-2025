/*
 * Agricultural IoT Device - Main Code
 * Created by: Harshit
 * Purpose: Collect sensor data and transmit to backend system
 * 
 * Hardware: Arduino/ESP32 with sensors
 * Sensors: Temperature, Humidity, Soil Moisture, Light, pH
 * 
 * TODO: Implement sensor reading and data transmission
 * 1. Initialize sensors
 * 2. Read sensor values periodically
 * 3. Format data as JSON
 * 4. Send via WiFi/cellular to backend
 */

void setup() {
  Serial.begin(9600);
  Serial.println("Agricultural IoT Device - Initialization");
  
  // TODO: Initialize sensors
  // TODO: Setup WiFi/connectivity
  
  Serial.println("Device ready for Harshit's implementation");
}

void loop() {
  // TODO: Read sensors
  // TODO: Process data
  // TODO: Transmit to backend
  
  delay(30000); // 30 second intervals
}
