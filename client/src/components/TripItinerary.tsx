import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTripDetails } from "@/lib/api";
import { TripDetail } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Coffee, Loader2, MapPin, Utensils, Home, Sunrise, Sunset, Moon } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { convertCurrency, formatCurrencyByCode } from "@/lib/currency";

interface TripItineraryProps {
  tripId: number;
}

// Define a type for a daily activity
interface Activity {
  id: number;
  time: string;
  title: string;
  description: string;
  location: string;
  duration: string;
  type: "breakfast" | "lunch" | "dinner" | "sightseeing" | "transportation" | "leisure" | "accommodation";
  cost: number;
}

// Mock sample data for a trip
const generateDayActivities = (day: number): Activity[] => {
  // This would normally come from the API
  return [
    {
      id: day * 100 + 1,
      time: "08:00",
      title: "Breakfast at the hotel",
      description: "Start your day with a delicious breakfast at your hotel.",
      location: "Hotel",
      duration: "1 hour",
      type: "breakfast",
      cost: 15,
    },
    {
      id: day * 100 + 2,
      time: "09:30",
      title: day % 3 === 0 ? "Visit the Central Market" : day % 3 === 1 ? "Museum Tour" : "Beach Day",
      description: day % 3 === 0 
        ? "Explore the vibrant local market with fresh produce and local specialties." 
        : day % 3 === 1 
          ? "Visit the city's famous art museum with works from renowned artists."
          : "Relax on the beautiful sandy beaches and enjoy the sun.",
      location: day % 3 === 0 ? "Central Market" : day % 3 === 1 ? "City Museum" : "Main Beach",
      duration: "2.5 hours",
      type: "sightseeing",
      cost: day % 3 === 0 ? 0 : day % 3 === 1 ? 20 : 5,
    },
    {
      id: day * 100 + 3,
      time: "12:30",
      title: "Lunch at " + (day % 2 === 0 ? "local restaurant" : "seaside café"),
      description: "Enjoy local cuisine at a charming " + (day % 2 === 0 ? "restaurant in the old town" : "café with ocean views"),
      location: day % 2 === 0 ? "Old Town" : "Seafront",
      duration: "1.5 hours",
      type: "lunch",
      cost: 25,
    },
    {
      id: day * 100 + 4,
      time: "14:30",
      title: day % 4 === 0 
        ? "Historical Walking Tour" 
        : day % 4 === 1 
          ? "Shopping in City Center" 
          : day % 4 === 2
            ? "Visit Cathedral"
            : "Boat Tour",
      description: day % 4 === 0 
        ? "Discover the rich history of the city with a guided walking tour." 
        : day % 4 === 1 
          ? "Shop for souvenirs and local products in the city's main shopping district."
          : day % 4 === 2
            ? "Visit the magnificent cathedral with stunning architecture and art."
            : "Enjoy a relaxing boat tour around the bay with beautiful views.",
      location: day % 4 === 0 
        ? "Historic Quarter" 
        : day % 4 === 1 
          ? "Shopping District" 
          : day % 4 === 2
            ? "Cathedral"
            : "Harbor",
      duration: "2 hours",
      type: "sightseeing",
      cost: day % 4 === 0 ? 30 : day % 4 === 1 ? 0 : day % 4 === 2 ? 10 : 40,
    },
    {
      id: day * 100 + 5,
      time: "17:00",
      title: "Free time / Rest at hotel",
      description: "Take some time to relax or explore on your own.",
      location: "Various",
      duration: "2 hours",
      type: "leisure",
      cost: 0,
    },
    {
      id: day * 100 + 6,
      time: "19:30",
      title: day % 3 === 0 
        ? "Dinner at Traditional Restaurant" 
        : day % 3 === 1 
          ? "Tapas Experience"
          : "Seafood Dinner",
      description: day % 3 === 0 
        ? "Enjoy authentic local cuisine at a traditional restaurant." 
        : day % 3 === 1 
          ? "Try a variety of small plates at different tapas bars."
          : "Fresh seafood dinner at a renowned restaurant.",
      location: day % 3 === 0 
        ? "Old Town" 
        : day % 3 === 1 
          ? "Tapas District"
          : "Seaside Restaurant",
      duration: "2 hours",
      type: "dinner",
      cost: 35,
    },
    {
      id: day * 100 + 7,
      time: "22:00",
      title: day % 2 === 0 ? "Evening Stroll" : "Nightlife Experience",
      description: day % 2 === 0 
        ? "Take a pleasant evening walk through the illuminated streets." 
        : "Explore the city's vibrant nightlife scene.",
      location: day % 2 === 0 ? "Waterfront Promenade" : "Entertainment District",
      duration: "1.5 hours",
      type: "leisure",
      cost: day % 2 === 0 ? 0 : 20,
    },
  ];
};

const TripItinerary = ({ tripId }: TripItineraryProps) => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [showMap, setShowMap] = useState(false);
  
  // This would normally fetch from the API
  // const { data: tripDetails, isLoading } = useQuery<TripDetail[]>({
  //   queryKey: [`/api/trips/${tripId}/details`],
  //   enabled: !!tripId,
  // });
  
  // For demonstration purposes, we'll use mock data
  const isLoading = false;
  const mockDays = 5; // Number of days in the trip
  
  // Get an array of day numbers (1 to number of days)
  const dayNumbers = Array.from({ length: mockDays }, (_, i) => i + 1);
  
  // Get activities for the selected day
  const dayActivities = generateDayActivities(selectedDay);
  
  // For currency conversion
  const { selectedCurrency } = useCurrency();
  
  // Calculate daily cost
  const dailyCost = dayActivities.reduce((sum, activity) => sum + activity.cost, 0);
  const convertedDailyCost = convertCurrency(dailyCost, selectedCurrency.code);
  const formattedDailyCost = formatCurrencyByCode(convertedDailyCost, selectedCurrency.code);
  
  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "breakfast":
        return <Coffee className="h-4 w-4 text-orange-500" />;
      case "lunch":
      case "dinner":
        return <Utensils className="h-4 w-4 text-green-500" />;
      case "sightseeing":
        return <MapPin className="h-4 w-4 text-blue-500" />;
      case "transportation":
        return <MapPin className="h-4 w-4 text-purple-500" />;
      case "leisure":
        return <Coffee className="h-4 w-4 text-yellow-500" />;
      case "accommodation":
        return <Home className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get time of day icon
  const getTimeOfDayIcon = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 5 && hour < 12) {
      return <Sunrise className="h-4 w-4 text-orange-400" />;
    } else if (hour >= 12 && hour < 18) {
      return <Clock className="h-4 w-4 text-blue-400" />;
    } else if (hour >= 18 && hour < 22) {
      return <Sunset className="h-4 w-4 text-purple-400" />;
    } else {
      return <Moon className="h-4 w-4 text-indigo-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="mt-4">Loading your itinerary...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue={selectedDay.toString()} 
        value={selectedDay.toString()}
        onValueChange={(value) => setSelectedDay(parseInt(value))}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Day-by-Day Itinerary</h3>
          <div className="flex items-center">
            <span className="text-sm mr-4">Daily Budget: {formattedDailyCost}</span>
            <Button variant="outline" size="sm" onClick={() => setShowMap(!showMap)}>
              {showMap ? "Hide Map" : "Show Map"}
            </Button>
          </div>
        </div>
        
        <TabsList className="grid grid-cols-5 mb-4">
          {dayNumbers.map(day => (
            <TabsTrigger 
              key={day} 
              value={day.toString()}
              className="text-sm sm:text-base"
            >
              Day {day}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {dayNumbers.map(day => (
          <TabsContent key={day} value={day.toString()} className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Day {day} Activities</h4>
              {day === 1 && (
                <Badge variant="outline" className="text-xs">
                  Arrival Day
                </Badge>
              )}
              {day === dayNumbers.length && (
                <Badge variant="outline" className="text-xs">
                  Departure Day
                </Badge>
              )}
            </div>
            
            <div className="relative">
              {/* Timeline */}
              <div className="absolute top-0 bottom-0 left-16 w-px bg-neutral-200"></div>
              
              <div className="space-y-8">
                {generateDayActivities(day).map((activity) => {
                  const activityCost = convertCurrency(activity.cost, selectedCurrency.code);
                  const formattedCost = formatCurrencyByCode(activityCost, selectedCurrency.code);
                  
                  return (
                    <div key={activity.id} className="relative pl-24">
                      {/* Time indicator */}
                      <div className="absolute left-0 flex flex-col items-center">
                        <span className="text-sm font-medium">{activity.time}</span>
                        <div className="mt-1 h-8 w-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center z-10">
                          {getTimeOfDayIcon(activity.time)}
                        </div>
                      </div>
                      
                      {/* Activity card */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">{activity.title}</h5>
                              <p className="text-sm text-neutral-600 mt-1">
                                {activity.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                <div className="flex items-center text-xs text-neutral-500">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {activity.location}
                                </div>
                                <div className="flex items-center text-xs text-neutral-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {activity.duration}
                                </div>
                                {activity.cost > 0 && (
                                  <div className="flex items-center text-xs text-neutral-500">
                                    <span className="mr-1">Cost:</span>
                                    {formattedCost}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Badge 
                              variant="secondary" 
                              className="text-xs flex items-center gap-1"
                            >
                              {getActivityIcon(activity.type)}
                              {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      {showMap && (
        <Card className="mt-6 overflow-hidden">
          <div className="h-80 bg-neutral-100 flex items-center justify-center text-neutral-500">
            <div className="text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-neutral-400" />
              <p>Interactive map would be displayed here</p>
              <p className="text-sm">Showing all activities for selected day</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TripItinerary;