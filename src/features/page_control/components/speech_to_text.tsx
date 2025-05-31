import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, Lightbulb } from "lucide-react";
import { emojiDict } from "./emojies";

function SimpleSpeechToText() {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [lastAction, setLastAction] = useState("");
  const [emojiReaction, setEmojiReaction] = useState("");
  const recognitionRef = useRef<any | null>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Emoji dictionary with multiple trigger words - you can easily add more words here

  const checkForEmojis = (speech: string) => {
    const words = speech.toLowerCase().split(" ");
    for (const word of words) {
      // Remove punctuation and check if word exists in emoji dictionary
      const cleanWord = word.replace(/[.,!?;]/g, "");
      if (emojiDict[cleanWord]) {
        setEmojiReaction(emojiDict[cleanWord]);
        // Clear emoji after animation
        setTimeout(() => setEmojiReaction(""), 2000);
        break; // Only show first emoji found
      }
    }
  };

  const checkForActions = async (speech: string) => {
    const lowerSpeech = speech.toLowerCase();

    if (lowerSpeech.includes("turn") && lowerSpeech.includes("on")) {
      try {
        const res = await fetch(
          "http://localhost:3000/auth-send?message=turn_on"
        );
        console.log(res, "this is the response");

        if (res.ok) {
          setLastAction("🔆 Lights turned on successfully!");
          console.log("Action triggered: Turn lights on");
        } else {
          setLastAction("❌ Failed to turn lights on - Server error");
        }
      } catch (error) {
        console.error("Failed to send request:", error);
        setLastAction("❌ Failed to turn lights on - Network error");
      }
      setTimeout(() => setLastAction(""), 3000);
    } else if (lowerSpeech.includes("turn") && lowerSpeech.includes("off")) {
      try {
        const res = await fetch(
          "http://localhost:3000/auth-send?message=turn_off"
        );
        console.log(res, "this is the response");

        if (res.ok) {
          setLastAction("🔅 Lights turned off successfully!");
          console.log("Action triggered: Turn lights off");
        } else {
          setLastAction("❌ Failed to turn lights off - Server error");
        }
      } catch (error) {
        console.error("Failed to send request:", error);
        setLastAction("❌ Failed to turn lights off - Network error");
      }
      setTimeout(() => setLastAction(""), 3000);
    } else if (
      lowerSpeech.includes("fake") ||
      lowerSpeech.includes("unauthorized")
    ) {
      try {
        const res = await fetch(
          "http://localhost:3000/no-auth-send?message=no_turn"
        );
        console.log(res, "this is the response");

        if (res.ok) {
          const responseText = await res.text();
          console.log("Response body:", responseText);
          setLastAction("🚫 Unauthorized access attempt detected!");
          console.log("Action triggered: No-auth request");
        } else {
          const errorText = await res.text();
          console.error("Server error response:", errorText);
          setLastAction(
            `❌ Failed to process unauthorized request - ${res.status}`
          );
        }
      } catch (error) {
        console.error("Failed to send request:", error);
        setLastAction("❌ Failed to send unauthorized request - Network error");
      }
      setTimeout(() => setLastAction(""), 3000);
    }
  };

  const startContinuousListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
      // Auto-restart if still active
      if (isActive) {
        restartTimeoutRef.current = setTimeout(() => {
          if (isActive) {
            startContinuousListening();
          }
        }, 100);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
      // Auto-restart on error if still active
      if (isActive && event.error !== "aborted") {
        restartTimeoutRef.current = setTimeout(() => {
          if (isActive) {
            startContinuousListening();
          }
        }, 1000);
      }
    };

    recognition.onresult = (event) => {
      const speech = event.results[event.results.length - 1][0].transcript;
      console.log("Recognized:", speech);
      setText(speech);

      // Check for emoji keywords
      checkForEmojis(speech);

      // Check for action keywords
      checkForActions(speech);
    };

    recognition.start();
  };

  const toggleListening = () => {
    if (isActive) {
      // Stop listening
      setIsActive(false);
      setListening(false);
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      // Start continuous listening
      setIsActive(true);
      setText("");
      setLastAction("");
      startContinuousListening();
    }
  };

  useEffect(() => {
    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Voice Control System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge
              variant={
                isActive ? (listening ? "default" : "secondary") : "outline"
              }
            >
              {isActive
                ? listening
                  ? "Listening..."
                  : "Reconnecting..."
                : "Inactive"}
            </Badge>
            <motion.div
              animate={{ scale: listening ? [1, 1.2, 1] : 1 }}
              transition={{ repeat: listening ? Infinity : 0, duration: 1 }}
            >
              {listening ? (
                <Mic className="h-5 w-5 text-green-500" />
              ) : isActive ? (
                <Mic className="h-5 w-5 text-orange-500" />
              ) : (
                <MicOff className="h-5 w-5 text-gray-400" />
              )}
            </motion.div>
          </div>

          <AnimatePresence>
            {emojiReaction && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                  scale: [0, 1.5, 1.2, 1],
                  rotate: [0, 360, 0],
                  y: [0, -10, 0],
                }}
                exit={{
                  scale: 0,
                  rotate: 180,
                  opacity: 0,
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  times: [0, 0.4, 0.7, 1],
                }}
                className="text-center"
              >
                <div className="text-6xl filter drop-shadow-lg">
                  {emojiReaction}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {lastAction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
              >
                <Lightbulb className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-700 font-medium">
                  {lastAction}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-[100px] p-4 bg-muted rounded-lg border"
          >
            <p className="text-sm whitespace-pre-wrap">
              {text ||
                "Say words like 'monkey', 'pizza', 'rocket' for emoji reactions or 'turn lights on' for actions!"}
            </p>
          </motion.div>

          <div className="flex gap-2">
            <Button
              onClick={toggleListening}
              variant={isActive ? "destructive" : "default"}
              className="flex-1"
            >
              {isActive ? (
                <>
                  <MicOff className="h-4 w-4 mr-2" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Start Listening
                </>
              )}
            </Button>
            <Button onClick={() => setText("")} variant="outline">
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default SimpleSpeechToText;
