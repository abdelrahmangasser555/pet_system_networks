// hooks/useMqttLogger.ts
import { useEffect } from "react";
import mqtt from "mqtt";

type UseMqttLoggerOptions = {
  topic: string;
};

export function useMqttLogger({ topic }: UseMqttLoggerOptions) {
  useEffect(() => {
    if (!topic) return;

    const client = mqtt.connect(
      "wss://2ea6c74a7a744dfd8cbf2c79f87dcfe1.s1.eu.hivemq.cloud:8884/mqtt",
      {
        username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
        password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
        connectTimeout: 5000,
        reconnectPeriod: 1000,
        clean: true,
      }
    );

    client.on("connect", () => {
      console.log(`🔌 Connected to MQTT`);
      client.subscribe(topic, (err) => {
        if (err) {
          console.error(
            `❌ Failed to subscribe to topic "${topic}":`,
            err.message
          );
        } else {
          console.log(`📡 Subscribed to topic "${topic}"`);
        }
      });
    });

    client.on("message", (receivedTopic, payload) => {
      console.log(
        `📥 Message received on topic "${receivedTopic}":`,
        payload.toString()
      );
    });

    client.on("error", (err) => {
      console.error("❌ MQTT connection error:", err.message);
    });

    return () => {
      client.end(true, () => {
        console.log(`🔌 Disconnected from MQTT`);
      });
    };
  }, [topic]);
}
