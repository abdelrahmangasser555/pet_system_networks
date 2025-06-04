"use client";

import { TrendingUp, Utensils, Package, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "Pet Food Analytics Dashboard";

export function AnimalAnalytics() {
  const [historyData, setHistoryData] = useState<any[]>([]);

  const loadHistoryData = () => {
    const history = localStorage.getItem("history");
    if (history) {
      try {
        const data = JSON.parse(history);
        setHistoryData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to parse history data from localStorage:", error);
        setHistoryData([]);
      }
    } else {
      setHistoryData([]);
    }
  };

  useEffect(() => {
    // Load initial data
    loadHistoryData();

    // Set up polling every 2 seconds
    const interval = setInterval(() => {
      loadHistoryData();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Process the data for charts
  const processedData = historyData.map((item, index) => ({
    time: new Date(item.time).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
    }),
    food_added: item.food_added,
    food_remains: item.food_remains,
    food_consumed:
      item.food_added -
      (item.food_remains - (historyData[index - 1]?.food_remains || 0)),
  }));

  // Pie chart data
  const totalFoodAdded = historyData.reduce(
    (sum, item) => sum + item.food_added,
    0
  );
  const currentFoodRemains =
    historyData.length > 0
      ? historyData[historyData.length - 1].food_remains
      : 0;
  const pieData = [
    { name: "Total Added", value: totalFoodAdded, color: "var(--chart-1)" },
    {
      name: "Currently Remaining",
      value: currentFoodRemains,
      color: "var(--chart-2)",
    },
  ];

  // Bar chart data - daily totals
  const dailyData = historyData.reduce((acc, item) => {
    const date = new Date(item.time).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { date, food_added: 0, food_remains: 0, count: 0 };
    }
    acc[date].food_added += item.food_added;
    acc[date].food_remains += item.food_remains;
    acc[date].count += 1;
    return acc;
  }, {} as Record<string, any>);

  const barChartData = Object.values(dailyData).map((day: any) => ({
    date: new Date(day.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    food_added: day.food_added,
    avg_remains: Math.round(day.food_remains / day.count),
  }));

  const chartConfig = {
    food_added: {
      label: "Food Added",
      color: "var(--chart-1)",
    },
    food_remains: {
      label: "Food Remains",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const latestData =
    historyData.length > 0 ? historyData[historyData.length - 1] : null;
  const previousData =
    historyData.length > 1 ? historyData[historyData.length - 2] : null;
  const trendPercentage =
    latestData && previousData
      ? (
          ((latestData.food_remains - previousData.food_remains) /
            previousData.food_remains) *
          100
        ).toFixed(1)
      : "0";

  const lastFeedingTime = latestData
    ? new Date(latestData.time).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "No data";

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const numberVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  if (historyData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <h3 className="text-lg font-medium text-muted-foreground">
            No feeding history
          </h3>
          <p className="text-sm text-muted-foreground">
            Start feeding your pet to see analytics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
              <CardTitle className="text-sm font-medium">
                Total Food Added to Pet
              </CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-3xl font-bold"
                variants={numberVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {totalFoodAdded}g
              </motion.div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              <p className="text-xs text-muted-foreground">
                grams across all feedings
              </p>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
              <CardTitle className="text-sm font-medium">
                Current Food in Container
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-3xl font-bold"
                variants={numberVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {currentFoodRemains}g
              </motion.div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              <p className="text-xs text-muted-foreground">
                grams remaining after last feeding
              </p>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
              <CardTitle className="text-sm font-medium">
                Latest Pet Feeding
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-3xl font-bold"
                variants={numberVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {latestData?.food_added || 0}g
              </motion.div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              <p className="text-xs text-muted-foreground">
                {latestData?.food_remains || 0}g remaining in container
              </p>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
              <CardTitle className="text-sm font-medium">
                Last Feeding Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-lg font-bold"
                variants={numberVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {lastFeedingTime}
              </motion.div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              <p className="text-xs text-muted-foreground">
                Fed {latestData?.food_added || 0}g •{" "}
                {latestData?.food_remains || 0}g left
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Main Line Chart */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Pet Food Tracking Over Time</CardTitle>
            <CardDescription>
              Food added to pet vs remaining in container (grams)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <LineChart
                accessibilityLayer
                data={processedData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 12,
                  bottom: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  dataKey="food_added"
                  type="monotone"
                  stroke="var(--color-food_added)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  dataKey="food_remains"
                  type="monotone"
                  stroke="var(--color-food_remains)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 leading-none font-medium">
                  Food levels{" "}
                  {parseFloat(trendPercentage) >= 0 ? "increased" : "decreased"}{" "}
                  by {Math.abs(parseFloat(trendPercentage))}%
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                  Tracking food consumption patterns over recent feedings
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Food Distribution</CardTitle>
              <CardDescription>
                Total added vs currently remaining (grams)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Daily Food Summary</CardTitle>
              <CardDescription>
                Daily totals and averages (grams)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={barChartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="food_added"
                    fill="var(--color-food_added)"
                    radius={4}
                  />
                  <Bar
                    dataKey="avg_remains"
                    fill="var(--color-food_remains)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
