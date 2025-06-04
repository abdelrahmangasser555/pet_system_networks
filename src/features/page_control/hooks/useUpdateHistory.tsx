import { useEffect } from "react";
import mqtt from "mqtt";

export function useUpdateHistory() {
  useEffect(() => {
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
      console.log(`🔌 Connected to MQTT for history updates`);
      client.subscribe("history", (err) => {
        if (err) {
          console.error(
            `❌ Failed to subscribe to history topic:`,
            err.message
          );
        } else {
          console.log(`📡 Subscribed to history topic`);
        }
      });
    });

    client.on("message", (receivedTopic, payload) => {
      if (receivedTopic === "history") {
        try {
          const payloadString = payload.toString();
          console.log(`📥 History data received:`, payloadString);

          let newHistoryItem;

          // Try to parse as JSON, if it fails use as string
          try {
            newHistoryItem = JSON.parse(payloadString);
          } catch {
            // If not JSON, create an object with the raw data
            newHistoryItem = {
              data: payloadString,
              timestamp: new Date().toISOString(),
            };
          }

          // Get existing history from localStorage
          const existingHistory = localStorage.getItem("history");
          let historyArray = [];

          if (existingHistory) {
            try {
              historyArray = JSON.parse(existingHistory);
              if (!Array.isArray(historyArray)) {
                historyArray = [];
              }
            } catch (error) {
              console.error("Failed to parse existing history:", error);
              historyArray = [];
            }
          }

          // Add new item to history array
          historyArray.push(newHistoryItem);

          // Save updated history back to localStorage
          localStorage.setItem("history", JSON.stringify(historyArray));
          console.log(`✅ History updated with new item:`, newHistoryItem);
        } catch (error) {
          console.error("❌ Error processing history message:", error);
        }
      }
    });

    client.on("error", (err) => {
      console.error("❌ MQTT connection error:", err.message);
    });

    return () => {
      client.end(true, () => {
        console.log(`🔌 Disconnected from MQTT history subscription`);
      });
    };
  }, []);
}
