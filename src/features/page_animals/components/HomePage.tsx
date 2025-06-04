"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { animals_links } from "./animal_choose";
import { Input } from "@/components/ui/input";
import { DisplayAnimalTooltip } from "@/features/page_control/components/display_animal_tooltip";
export default function HomePage() {
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const router = useRouter();
  const [animalName, setAnimalName] = useState<string>("");

  const handleAnimalSelect = (animal: (typeof animals_links)[0]) => {
    setSelectedAnimal(animal.name);
    const animalData = {
      ...animal,
      nickname: animalName,
    };
    localStorage.setItem("selectedAnimal", JSON.stringify(animalData));
  };

  const handleNext = () => {
    // clear the localStorage
    localStorage.clear();
    if (selectedAnimal) {
      // Update localStorage with latest nickname before navigating
      const selectedAnimalData = animals_links.find(
        (animal) => animal.name === selectedAnimal
      );
      if (selectedAnimalData) {
        const animalData = {
          ...selectedAnimalData,
          nickname: animalName,
        };
        localStorage.setItem("selectedAnimal", JSON.stringify(animalData));
      }
      router.push("/control");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <DisplayAnimalTooltip className="fixed top-4 right-4 z-50" />
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
          Welcome to the Future of Pet Stores
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose your perfect companion
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar - Choose Your Animal */}

        {/* Animal Cards Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {animals_links.map((animal, index) => (
              <motion.div
                key={animal.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedAnimal === animal.name
                      ? "ring-2 ring-green-500 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => handleAnimalSelect(animal)}
                >
                  <CardHeader className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                      <span className="text-4xl">
                        {animal.name === "cat" && "🐱"}
                        {animal.name === "dog" && "🐶"}
                        {animal.name === "rabbit" && "🐰"}
                        {animal.name === "hamster" && "🐹"}
                        {animal.name === "bird" && "🐦"}
                        {animal.name === "fish" && "🐟"}
                        {animal.name === "turtle" && "🐢"}
                        {animal.name === "monkey" && "🐒"}
                        {animal.name === "snake" && "🐍"}
                      </span>
                    </div>
                    <CardTitle className="capitalize text-xl">
                      {animal.name}
                    </CardTitle>
                    <CardDescription>{animal.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                      Default Weight: {animal.default_weight} kg
                    </p>
                    <Button
                      variant={
                        selectedAnimal === animal.name ? "success" : "outline"
                      }
                      className="w-full"
                    >
                      {selectedAnimal === animal.name ? "Selected" : "Select"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">
                Choose Your Animal
              </CardTitle>
              <CardDescription className="text-center">
                Select your preferred pet companion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedAnimal && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-secondary rounded-lg border"
                >
                  <p className="text-secondary-foreground font-medium text-center flex items-center justify-center gap-x-2">
                    <span className="text-2xl">
                      {selectedAnimal === "cat" && "🐱"}
                      {selectedAnimal === "dog" && "🐶"}
                      {selectedAnimal === "rabbit" && "🐰"}
                      {selectedAnimal === "hamster" && "🐹"}
                      {selectedAnimal === "bird" && "🐦"}
                      {selectedAnimal === "fish" && "🐟"}
                      {selectedAnimal === "turtle" && "🐢"}
                      {selectedAnimal === "monkey" && "🐒"}
                      {selectedAnimal === "snake" && "🐍"}
                    </span>
                    Selected: {selectedAnimal}
                  </p>
                </motion.div>
              )}
              <Input
                className="w-full"
                placeholder="Name your animal..."
                value={animalName}
                onChange={(e) => setAnimalName(e.target.value)}
              />
              <Button
                onClick={handleNext}
                disabled={!selectedAnimal}
                className="w-full"
                size="lg"
              >
                Next →
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
