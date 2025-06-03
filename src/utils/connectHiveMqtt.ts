// lib/mqtt.js
import mqtt from "mqtt";

// Replace these with your real credentials from HiveMQ Access Management
const MQTT_HOST = "2ea6c74a7a744dfd8cbf2c79f87dcfe1.s1.eu.hivemq.cloud";
const MQTT_PORT = 8883;
const MQTT_USERNAME = "gasser";
const MQTT_PASSWORD = "Gasser2005@";

// Create a reusable function to connect securely
export function connectMQTT() {
  return mqtt.connect({
    host: MQTT_HOST,
    port: MQTT_PORT,
    protocol: "mqtts", // TLS-secured
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    rejectUnauthorized: true,
    connectTimeout: 5000,
    clean: true,
  });
}
