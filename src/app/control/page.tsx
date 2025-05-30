import { DisplayAnimalTooltip } from "@/features/page_control/components/display_animal_tooltip";
import BarPoll from "@/features/page_control/components/food_refill";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Cookie, RefreshCw, Target } from "lucide-react";
import { AnimalAnalytics } from "@/features/page_control/components/analytcis/components/analyticsBoard";
export default function ControlPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <DisplayAnimalTooltip
        className="flex items-center justify-center mb-6"
        avatarClassName="w-[200px] h-[200px] text-6xl"
      />
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="food-control" className="flex items-center gap-2">
            <Cookie className="w-4 h-4" />
            Food Control
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refill
          </TabsTrigger>
          <TabsTrigger value="expectations" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Expectations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="mt-6">
          <AnimalAnalytics />
        </TabsContent>

        <TabsContent value="food-control" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Food Control</h2>
          </div>
        </TabsContent>

        <TabsContent value="data" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Data</h2>
            <p className="text-muted-foreground">
              Manage pet data and information here.
            </p>
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
    </div>
  );
}
