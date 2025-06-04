"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpeechToTextProps {
  handleSpeech?: (speech: string) => void;
  className?: string;
}

function SimpleSpeechToText({ handleSpeech, className }: SpeechToTextProps) {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const recognitionRef = useRef<any | null>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

      // Call the provided callback with the recognized speech
      if (handleSpeech) {
        handleSpeech(speech);
      }

      // Auto-open popover when speech is recognized
      setIsPopoverOpen(true);
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
    <div className={cn("relative", className)}>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            onClick={toggleListening}
            variant="ghost"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full transition-colors duration-200",
              isActive
                ? listening
                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  : "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {isActive ? (
              <Mic className="h-5 w-5" />
            ) : (
              <MicOff className="h-5 w-5" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 p-3 bg-popover border-border"
          side="bottom"
          align="center"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {isActive
                  ? listening
                    ? "Listening..."
                    : "Reconnecting..."
                  : "Click to start"}
              </span>
              <Button
                onClick={() => setText("")}
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
              >
                Clear
              </Button>
            </div>
            <div className="min-h-[60px] p-2 bg-muted/50 rounded border text-sm">
              {text || "Speech will appear here..."}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default SimpleSpeechToText;
