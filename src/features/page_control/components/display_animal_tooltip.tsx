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

interface AnimalData {
  name: string;
  description: string;
  default_weight: number;
  nickname?: string;
}

interface DisplayAnimalTooltipProps {
  className?: string;
  avatarClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function DisplayAnimalTooltip({
  className,
  avatarClassName,
  size = "md",
}: DisplayAnimalTooltipProps) {
  const [animalData, setAnimalData] = useState<AnimalData | null>(null);
  const selectedAnimal = localStorage.getItem("selectedAnimal");

  useEffect(() => {
    if (selectedAnimal) {
      try {
        const data = JSON.parse(selectedAnimal);
        setAnimalData(data);
      } catch (error) {
        console.error("Failed to parse animal data from localStorage:", error);
      }
    }
  }, [selectedAnimal]);

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
          <Avatar
            className={cn(
              "cursor-pointer",
              getSizeClasses(size),
              avatarClassName
            )}
          >
            <AvatarFallback className="bg-muted">
              {getAnimalEmoji(animalData.name)}
            </AvatarFallback>
          </Avatar>
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
