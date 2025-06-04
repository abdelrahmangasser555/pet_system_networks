"use client";

import { useEffect, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import SimpleSpeechToText from "./speech_to_text";

interface AnimalData {
  name: string;
  description: string;
  default_weight: number;
  nickname?: string;
  handleSpeech?: any;
}

interface DisplayAnimalTooltipProps {
  className?: string;
  avatarClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  handleSpeech?: (speech: string) => void;
}

export function DisplayAnimalTooltip({
  className,
  avatarClassName,
  size = "md",
  handleSpeech,
}: DisplayAnimalTooltipProps) {
  const [animalData, setAnimalData] = useState<AnimalData | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [storageKey, setStorageKey] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleStorageChange = () => {
      setStorageKey((prev) => prev + 1);
    };

    const selectedAnimal = localStorage.getItem("selectedAnimal");
    if (selectedAnimal) {
      try {
        const data = JSON.parse(selectedAnimal);
        setAnimalData(data);
      } catch (error) {
        console.error("Failed to parse animal data from localStorage:", error);
      }
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isMounted, storageKey]);

  const getAnimalEmoji = (name: string) => {
    const emojiMap: { [key: string]: string } = {
      cat: "🐱",
      dog: "🐶",
      rabbit: "🐰",
      hamster: "🐹",
      bird: "🐦",
      fish: "🐟",
      turtle: "🐢",
      monkey: "🐒",
      snake: "🐍",
    };
    return emojiMap[name] || "🐾";
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return "h-8 w-8 text-lg";
      case "md":
        return "h-12 w-12 text-2xl";
      case "lg":
        return "h-16 w-16 text-3xl";
      case "xl":
        return "h-20 w-20 text-4xl";
      default:
        return "h-12 w-12 text-2xl";
    }
  };

  if (!animalData) {
    return (
      <Avatar className={cn(getSizeClasses(size), avatarClassName)}>
        <AvatarFallback className="bg-muted">🐾</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div className={cn("inline-block", className)}>
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="relative">
            <Avatar
              className={cn(
                "cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-200",
                getSizeClasses(size),
                avatarClassName
              )}
            >
              <AvatarFallback className="bg-muted">
                {getAnimalEmoji(animalData.name)}
              </AvatarFallback>
            </Avatar>
            <SimpleSpeechToText
              className="absolute bottom-5 right-2 z-10 bg-secondary rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.3)] transition-shadow duration-200"
              handleSpeech={handleSpeech}
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex justify-between space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-2xl bg-muted">
                {getAnimalEmoji(animalData.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 flex-1">
              <h4 className="text-sm font-semibold capitalize">
                {animalData.nickname || animalData.name}
              </h4>
              {animalData.nickname && (
                <Badge variant="secondary" className="text-xs">
                  {animalData.name}
                </Badge>
              )}
              <p className="text-sm text-muted-foreground">
                {animalData.description}
              </p>
              <div className="flex items-center pt-2">
                <span className="text-xs text-muted-foreground">
                  Default Weight: {animalData.default_weight} kg
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
