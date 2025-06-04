import { NextRequest, NextResponse } from "next/server";
import { connectMQTT } from "@/utils/connectHiveMqtt";

export async function POST(request: NextRequest) {
  try {
    const { topic, message } = await request.json();

    if (!topic || !message) {
      return NextResponse.json(
        { error: "Topic and message are required" },
        { status: 400 }
      );
    }

    return new Promise((resolve) => {
      const client = connectMQTT();

      client.on("connect", () => {
        client.publish(topic, message, {}, (err) => {
          if (err) {
            resolve(
              NextResponse.json(
                { error: "Publish failed", details: err.message },
                { status: 500 }
              )
            );
          } else {
            resolve(
              NextResponse.json(
                { success: true, message: "Message published" },
                { status: 200 }
              )
            );
          }
          client.end();
        });
      });

      client.on("error", (err) => {
        console.error("MQTT error:", err.message);
        resolve(
          NextResponse.json(
            { error: "Connection error", details: err.message },
            { status: 500 }
          )
        );
      });
    });
  } catch (error) {
    console.error("Error in POST /refill:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get("topic");

    if (!topic) {
      return NextResponse.json(
        { error: "Topic parameter is required" },
        { status: 400 }
      );
    }

    return new Promise((resolve) => {
      const client = connectMQTT();
      let messageReceived = false;
      const timeout = setTimeout(() => {
        if (!messageReceived) {
          client.end();
          resolve(
            NextResponse.json(
              { error: "Subscription timeout - no message received" },
              { status: 408 }
            )
          );
        }
      }, 10000); // 10 second timeout

      client.on("connect", () => {
        client.subscribe(topic, (err) => {
          if (err) {
            clearTimeout(timeout);
            resolve(
              NextResponse.json(
                { error: "Subscribe failed", details: err.message },
                { status: 500 }
              )
            );
            client.end();
          }
        });
      });

      client.on("message", (receivedTopic, message) => {
        if (receivedTopic === topic && !messageReceived) {
          messageReceived = true;
          clearTimeout(timeout);
          resolve(
            NextResponse.json(
              {
                success: true,
                topic: receivedTopic,
                message: message.toString(),
              },
              { status: 200 }
            )
          );
          client.end();
        }
      });

      client.on("error", (err) => {
        clearTimeout(timeout);
        console.error("MQTT error:", err.message);
        resolve(
          NextResponse.json(
            { error: "Connection error", details: err.message },
            { status: 500 }
          )
        );
      });
    });
  } catch (error) {
    console.error("Error in GET /refill:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
