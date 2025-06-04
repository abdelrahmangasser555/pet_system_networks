"use client";
import { DisplayAnimalTooltip } from "@/features/page_control/components/display_animal_tooltip";
import BarPoll from "@/features/page_control/components/food_refill";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BarChart3,
  Cookie,
  RefreshCw,
  Target,
  Plus,
  Minus,
  AlertTriangle,
  Clock,
  ChefHat,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimalAnalytics } from "@/features/page_control/components/analytcis/components/analyticsBoard";
import SimpleSpeechToText from "@/features/page_control/components/speech_to_text";
import { AddingFood } from "@/features/food_control/components/adding_food";
import SingleBar from "@/features/page_control/components/food_refill";
import { useEffect, useState } from "react";
import { useMqttLogger } from "@/features/food_control/hooks/useSubscribeMqttConsole";
import { useUpdateHistory } from "@/features/page_control/hooks/useUpdateHistory";
interface AnimalData {
  name: string;
  description: string;
  default_weight: number;
  nickname?: string;
  current_food?: number;
}

export default function ControlPage() {
  const [animalData, setAnimalData] = useState<AnimalData | null>(null);
  const [currentFood, setCurrentFood] = useState(0);
  const [foodRemaining, setFoodRemaining] = useState(50);
  const [foodAmount, setFoodAmount] = useState([50]);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [lastHistoryItem, setLastHistoryItem] = useState<any>(null);
  useMqttLogger({
    topic: "dispense",
  });

  useMqttLogger({
    topic: "history",
  });

  useUpdateHistory();

  useEffect(() => {
    const selectedAnimal = localStorage.getItem("selectedAnimal");
    if (selectedAnimal) {
      try {
        const data = JSON.parse(selectedAnimal);
        setAnimalData(data);
        setCurrentFood(data.current_food || 0);
      } catch (error) {
        console.error("Failed to parse animal data from localStorage:", error);
      }
    }

    // Load food_remaining from history
    const history = localStorage.getItem("history");
    if (history) {
      try {
        const historyArray = JSON.parse(history);
        if (Array.isArray(historyArray) && historyArray.length > 0) {
          const lastHistoryItem = historyArray[historyArray.length - 1];
          if (lastHistoryItem.food_remains !== undefined) {
            setFoodRemaining(lastHistoryItem.food_remains);
          }
        }
      } catch (error) {
        console.error("Failed to parse history data from localStorage:", error);
      }
    }
  }, []);

  const updateFoodAmount = (newAmount: number) => {
    if (!animalData) return;

    const maxFood = animalData.default_weight * 1000; // Convert kg to grams
    const clampedAmount = Math.max(0, Math.min(newAmount, maxFood)); // Clamp between 0 and maxFood

    const updatedData = { ...animalData, current_food: clampedAmount };

    setCurrentFood(clampedAmount);
    setAnimalData(updatedData);
    localStorage.setItem("selectedAnimal", JSON.stringify(updatedData));
  };

  const addFood = async (amount: number = foodAmount[0]) => {
    if (!animalData) return;

    // Send MQTT message to dispense food (without updating current food state)
    try {
      const response = await fetch("/apis/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: "dispense",
          message: JSON.stringify({
            animalId: animalData?.name || "unknown",
            amount: amount,
            timestamp: new Date().toISOString(),
          }),
        }),
      });

      if (!response.ok) {
        console.error("Failed to send dispense command");
      }
    } catch (error) {
      console.error("Error sending dispense command:", error);
    }
  };

  const removeFood = () => {
    updateFoodAmount(currentFood - 5);
  };

  async function updateHistory() {
    await fetch("/apis/publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: "history",
        message: JSON.stringify({
          time: new Date().toISOString(),
          food_added: Math.floor(Math.random() * 101),
          food_remains: Math.floor(Math.random() * 101),
        }),
      }),
    });
  }

  const maxFoodGrams = animalData ? animalData.default_weight * 1000 : 100;

  const getFoodRemainingColor = (current: number, full: number) => {
    const percentage = (current / full) * 100;

    if (percentage < 10) return "bg-red-500";
    if (percentage < 30) return "bg-orange-500";
    if (percentage < 50) return "bg-yellow-500";
    if (percentage < 80) return "bg-lime-500";
    return "bg-green-500";
  };

  const getFoodPercentage = (current: number, full: number) => {
    return (current / full) * 100;
  };

  const updateFoodInStorage = () => {
    const newAmount = currentFood + 5;
    updateFoodAmount(newAmount);
  };

  async function handleSpeech(text: string) {
    console.log("Recognized speech:", text);
    const lowerText = text.toLowerCase();

    try {
      // Add food command
      if (lowerText.includes("add")) {
        const numberMatch = lowerText.match(/\d+/);
        if (numberMatch) {
          const amount = parseInt(numberMatch[0]);
          await addFood(amount);
          toast("Food Added", {
            description: `Added ${amount}g of food successfully!`,
          });
          return;
        }
      }

      // Refill command
      if (lowerText.includes("refill")) {
        const numberMatch = lowerText.match(/\d+/);
        if (numberMatch) {
          const amount = parseInt(numberMatch[0]);
          updateFoodAmount(amount);
          toast("Food Refilled", {
            description: `Current food set to ${amount}g!`,
          });
          return;
        }
      }

      // History command
      if (
        lowerText.includes("last") ||
        lowerText.includes("previous") ||
        lowerText.includes("history")
      ) {
        const history = localStorage.getItem("history");
        if (history) {
          try {
            const historyArray = JSON.parse(history);
            if (Array.isArray(historyArray) && historyArray.length > 0) {
              const lastItem = historyArray[historyArray.length - 1];
              setLastHistoryItem(lastItem);
              setShowHistoryDialog(true);
              toast("History Retrieved", {
                description: "Showing last feeding record",
              });
            } else {
              toast("No History", {
                description: "No feeding history found",
              });
            }
          } catch (error) {
            toast("Error", {
              description: "Failed to retrieve history",
            });
          }
        }
        return;
      }

      // Unknown command
      toast("Unknown Command", {
        description:
          "Command not recognized. Try 'add [number]', 'refill [number]', or 'history'",
      });
    } catch (error) {
      console.error("Error processing speech command:", error);
      toast("Error", {
        description: "Failed to process voice command",
      });
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <Button className="mt-6" onClick={updateHistory}>
        test update history
        <RefreshCw className="w-4 h-4 ml-2" />
      </Button>
      <DisplayAnimalTooltip
        className="flex items-center justify-center mb-6"
        avatarClassName="w-[200px] h-[200px] text-6xl"
        handleSpeech={handleSpeech}
      />
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="food-control" className="flex items-center gap-2">
            <Cookie className="w-4 h-4" />
            Food Control
          </TabsTrigger>

          {/* <TabsTrigger value="expectations" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Expectations
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="analytics" className="mt-6">
          <AnimalAnalytics />
        </TabsContent>

        <TabsContent value="food-control" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Food Control</h2>
            <p className="text-muted-foreground">
              Manage your pet's food intake and refill schedule.
            </p>
            <div className="px-5">
              {getFoodPercentage(foodRemaining, 700) < 10 && (
                <Alert className="animate-pulse" variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Food level is critically low! Refill needed immediately.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SingleBar
                full={700}
                current={foodRemaining}
                containerTitle="Food Remaining"
                containerColor={getFoodRemainingColor(foodRemaining, 700)}
              />
              <div className="space-y-2 relative">
                <SingleBar
                  full={700}
                  current={currentFood}
                  containerTitle="Refill"
                  containerColor="bg-blue-500"
                />
                <div className="flex justify-center gap-2 absolute top-[60px] left-10 ">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={removeFood}
                    disabled={currentFood <= 0}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={updateFoodInStorage}
                    disabled={currentFood >= maxFoodGrams}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <AddingFood
              AddFood={addFood}
              maxAmount={100}
              minAmount={0}
              foodAmount={foodAmount}
              setFoodAmount={setFoodAmount}
            />

            {/* <SimpleSpeechToText /> */}
          </div>
        </TabsContent>

        <TabsContent value="expectations" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Expectations</h2>
            <p className="text-muted-foreground">
              Set and view pet expectations here.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <AnimatePresence>
        {showHistoryDialog && (
          <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Last Feeding Record
                </DialogTitle>
              </DialogHeader>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {lastHistoryItem && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Food Added:
                          </span>
                          <div className="flex items-center gap-2">
                            <ChefHat className="w-4 h-4 text-primary" />
                            <span className="font-semibold">
                              {lastHistoryItem.food_added}g
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Food Remaining:
                          </span>
                          <div className="flex items-center gap-2">
                            <Cookie className="w-4 h-4 text-primary" />
                            <span className="font-semibold">
                              {lastHistoryItem.food_remains}g
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Timestamp:
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(lastHistoryItem.time).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
