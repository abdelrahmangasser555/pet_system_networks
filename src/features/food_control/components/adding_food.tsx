"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CookingPot, Dog } from "lucide-react";

interface AddingFoodProps {
  AddFood?: (amount: number) => void;
  maxAmount?: number;
  minAmount?: number;
  foodAmount: number[];
  setFoodAmount: (value: number[]) => void;
}

export function AddingFood({
  AddFood,
  maxAmount = 500,
  minAmount = 0,
  foodAmount,
  setFoodAmount,
}: AddingFoodProps) {
  const handleAddFood = () => {
    AddFood?.(foodAmount[0]);
  };

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CookingPot /> Refill Manually
        </CardTitle>
        <CardDescription>
          Select the amount of food to add to your pet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="food-slider" className="text-sm font-medium">
            Food Amount: {foodAmount[0]}g
          </Label>
          <Slider
            id="food-slider"
            min={minAmount}
            max={maxAmount}
            step={5}
            value={foodAmount}
            onValueChange={setFoodAmount}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{minAmount}g</span>
            <span>{maxAmount}g</span>
          </div>
        </div>
        <Button onClick={handleAddFood} className="w-full" size="lg">
          Add Food ({foodAmount[0]}g)
        </Button>
      </CardContent>
    </Card>
  );
}
