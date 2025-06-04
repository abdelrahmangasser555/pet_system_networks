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

          // Try to parse the ESP JSON format
          try {
            // Fix malformed JSON from ESP - quote the time value
            let fixedPayloadString = payloadString;

            // Handle unquoted time values like: "time":00:06:05
            fixedPayloadString = fixedPayloadString.replace(
              /"time":(\d{2}:\d{2}:\d{2})/g,
              '"time":"$1"'
            );

            console.log(`🔧 Fixed JSON:`, fixedPayloadString);
            const parsedData = JSON.parse(fixedPayloadString);

            // Check if it has the expected ESP format
            if (
              parsedData.time &&
              typeof parsedData.food_added !== "undefined" &&
              parsedData.food_remains
            ) {
              // Convert time format from "00:06:05" to ISO timestamp
              const timeString = parsedData.time;
              const today = new Date();
              const [hours, minutes, seconds] = timeString
                .split(":")
                .map(Number);

              today.setHours(hours, minutes, seconds, 0);

              newHistoryItem = {
                time: today.toISOString(),
                food_added: parseFloat(parsedData.food_added),
                food_remains: parseFloat(parsedData.food_remains),
                timestamp: new Date().toISOString(),
              };

              console.log(`✅ Parsed ESP data:`, newHistoryItem);
            } else {
              // Fallback for other JSON formats
              newHistoryItem = parsedData;
            }
          } catch (parseError) {
            console.error("❌ JSON parsing failed:", parseError);
            // If parsing fails completely, store as raw data
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
