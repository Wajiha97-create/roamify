import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTripDetails } from "@/lib/api";
import { TripDetail } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, Calendar, Clock, Coffee, Droplet, Heart, 
  Loader2, MapPin, Utensils, Home, Sunrise, Sunset, Moon, 
  Bus, Plane, Train, DollarSign, Camera, LucideIcon,
  LifeBuoy, Umbrella, Thermometer, Wind, Info,
  Navigation
} from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { convertCurrency, formatCurrencyByCode } from "@/lib/currency";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface TripItineraryProps {
  tripId: number;
  destinationName?: string;
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
  tips?: string[];
  alternativeOptions?: {title: string, description: string, cost: number}[];
}

// Define a type for daily weather
interface DailyWeather {
  condition: "sunny" | "partly-cloudy" | "cloudy" | "rainy" | "stormy";
  highTemp: number;
  lowTemp: number;
  precipitation: number;
  windSpeed: number;
  humidity: number;
}

// Define a type for daily trip summary
interface DaySummary {
  day: number;
  title: string;
  description: string;
  highlights: string[];
  weather: DailyWeather;
  totalCost: number;
  budgetTips: string[];
  culturalTips: string[];
}

// Function to generate weather for a day
const generateWeather = (day: number): DailyWeather => {
  const weatherType = ["sunny", "partly-cloudy", "cloudy", "rainy", "stormy"] as const;
  const randomCondition = weatherType[Math.floor(Math.random() * 3)]; // Mostly good weather
  
  return {
    condition: randomCondition,
    highTemp: Math.floor(Math.random() * 10) + 22, // 22-32 degrees
    lowTemp: Math.floor(Math.random() * 8) + 15, // 15-23 degrees
    precipitation: randomCondition === "rainy" || randomCondition === "stormy" ? Math.floor(Math.random() * 70) + 20 : 0,
    windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
    humidity: Math.floor(Math.random() * 30) + 40, // 40-70%
  };
};

// Function to generate summary for a day
const generateDaySummary = (day: number, destinationName: string = "Barcelona"): DaySummary => {
  const weather = generateWeather(day);
  const highlights = [
    day % 3 === 0 ? "Traditional cuisine experience" : day % 3 === 1 ? "Historical sightseeing" : "Beach and coast exploration",
    day % 4 === 0 ? "Hidden gem discovery" : day % 4 === 1 ? "Local market visit" : day % 4 === 2 ? "Architectural masterpieces" : "Cultural immersion",
    day % 2 === 0 ? "Scenic views and photo spots" : "Relaxation and leisure time"
  ];
  
  let title, description;
  
  if (day === 1) {
    title = `Welcome to ${destinationName}`;
    description = `Arrive and get settled in ${destinationName}. This first day is designed to help you acclimate to the city and its rhythm.`;
  } else if (day === 2) {
    title = `Exploring ${destinationName}'s Historic Center`;
    description = `Discover the rich history and culture of ${destinationName}'s old town, with its narrow streets and ancient buildings.`;
  } else if (day === 3) {
    title = `${destinationName}'s Modern Side`;
    description = `Experience the contemporary aspects of ${destinationName}, from innovative architecture to modern art and culture.`;
  } else if (day === 4) {
    title = `Natural Beauty around ${destinationName}`;
    description = `Venture beyond the city limits to explore the stunning natural landscapes surrounding ${destinationName}.`;
  } else {
    title = `Farewell to ${destinationName}`;
    description = `Make the most of your final day in ${destinationName} with some last-minute sightseeing and souvenir shopping before departure.`;
  }
  
  const budgetTips = [
    "Look for menu del día (fixed-price lunch menus) for great value meals",
    "Use public transportation instead of taxis to save money",
    "Visit museums on their free admission days (usually first Sunday of the month)",
    "Stay hydrated with tap water instead of buying bottled water",
    "Consider city passes if you plan to visit multiple attractions"
  ];
  
  const culturalTips = [
    "Greet locals with 'Hola' (Hello) or 'Buenos días' (Good morning)",
    "Tipping is appreciated but not obligatory (5-10% is sufficient)",
    "Mealtimes are later than in many countries (lunch: 2pm, dinner: 9pm)",
    "Businesses often close for siesta between 2pm and 5pm",
    "Dress appropriately when visiting religious sites (cover shoulders and knees)"
  ];
  
  // Select 2 random tips from each array for variety
  const shuffledBudgetTips = [...budgetTips].sort(() => 0.5 - Math.random()).slice(0, 2);
  const shuffledCulturalTips = [...culturalTips].sort(() => 0.5 - Math.random()).slice(0, 2);
  
  return {
    day,
    title,
    description,
    highlights,
    weather,
    totalCost: Math.floor(Math.random() * 50) + 100, // 100-150 base cost
    budgetTips: shuffledBudgetTips,
    culturalTips: shuffledCulturalTips
  };
};

// Activity tips by type
const activityTips = {
  breakfast: [
    "Try the local breakfast specialties for an authentic experience",
    "Most hotels offer early breakfast for guests with morning tours",
    "Ask for seat by the window to enjoy the view while dining"
  ],
  lunch: [
    "Avoid tourist traps by dining at least two streets away from major attractions",
    "Look for restaurants filled with locals for the most authentic experience",
    "Consider packing a picnic lunch to save money and enjoy local parks"
  ],
  dinner: [
    "Make reservations for popular restaurants, especially on weekends",
    "Try the chef's recommendations for the best local dishes",
    "Dinner is typically served later in Mediterranean countries (8-10pm)"
  ],
  sightseeing: [
    "Arrive early at popular attractions to avoid crowds",
    "Check for guided tours that include skip-the-line access",
    "Don't forget to carry water, sunscreen, and comfortable shoes"
  ],
  transportation: [
    "Consider day passes for unlimited public transportation",
    "Download the local transit app for real-time schedules",
    "Validate tickets before boarding to avoid fines"
  ],
  leisure: [
    "Ask locals for recommendations on lesser-known spots",
    "Consider free walking tours to explore neighborhoods",
    "Many parks and public spaces offer free WiFi"
  ],
  accommodation: [
    "Request a quiet room away from elevators and street noise",
    "Let the hotel know about any special occasions for possible upgrades",
    "Check if breakfast is included in your rate"
  ]
};

// Mock sample data for a trip with enhanced details
const generateDayActivities = (day: number, destinationName: string = "Barcelona"): Activity[] => {
  // This would normally come from the API
  const activities: Activity[] = [
    {
      id: day * 100 + 1,
      time: "08:00",
      title: "Breakfast at the hotel",
      description: "Start your day with a delicious breakfast at your hotel. Many hotels in " + destinationName + " offer a buffet with local and international options.",
      location: "Hotel",
      duration: "1 hour",
      type: "breakfast",
      cost: 15,
      tips: activityTips.breakfast.sort(() => 0.5 - Math.random()).slice(0, 2),
      alternativeOptions: [
        {
          title: "Local café breakfast",
          description: "Try a nearby café for a more authentic local breakfast experience with fresh pastries and coffee.",
          cost: 10
        },
        {
          title: "Quick breakfast",
          description: "Grab a quick breakfast from a bakery if you're eager to start sightseeing early.",
          cost: 7
        }
      ]
    }
  ];
  
  // Morning activity
  if (day === 1) {
    activities.push({
      id: day * 100 + 2,
      time: "09:30",
      title: "Orientation Walking Tour",
      description: `Get oriented in ${destinationName} with a guided walking tour of the main neighborhoods and landmarks. This is a perfect introduction to the city.`,
      location: "City Center",
      duration: "2.5 hours",
      type: "sightseeing",
      cost: 15,
      tips: activityTips.sightseeing.sort(() => 0.5 - Math.random()).slice(0, 2),
      alternativeOptions: [
        {
          title: "Self-guided city tour",
          description: "Follow a free downloadable walking route to see the main sights at your own pace.",
          cost: 0
        }
      ]
    });
  } else if (day === 2) {
    activities.push({
      id: day * 100 + 2,
      time: "09:30",
      title: "Historic District Exploration",
      description: `Visit the historic quarter of ${destinationName} with its medieval architecture, narrow streets, and hidden squares.`,
      location: "Old Town",
      duration: "3 hours",
      type: "sightseeing",
      cost: 0,
      tips: activityTips.sightseeing.sort(() => 0.5 - Math.random()).slice(0, 2),
      alternativeOptions: [
        {
          title: "Guided history tour",
          description: "Join a specialized guide for deeper insights into the city's history.",
          cost: 25
        }
      ]
    });
  } else if (day === 3) {
    activities.push({
      id: day * 100 + 2,
      time: "09:30",
      title: "Art Museum Visit",
      description: `Explore ${destinationName}'s renowned art museum featuring both local masters and international artists.`,
      location: "Art District",
      duration: "2.5 hours",
      type: "sightseeing",
      cost: 20,
      tips: ["Visit on the first Sunday of the month for free entry", "Audio guides are available in multiple languages"],
      alternativeOptions: [
        {
          title: "Contemporary Art Gallery",
          description: "For modern art lovers, visit the city's contemporary art space instead.",
          cost: 15
        }
      ]
    });
  } else if (day === 4) {
    activities.push({
      id: day * 100 + 2,
      time: "09:30",
      title: "Local Market Experience",
      description: `Immerse yourself in the colors, aromas, and flavors of ${destinationName}'s most famous food market.`,
      location: "Central Market",
      duration: "2 hours",
      type: "sightseeing",
      cost: 0,
      tips: ["Go early to avoid crowds and see vendors setting up", "Sample local specialties from different stalls"],
      alternativeOptions: [
        {
          title: "Cooking class",
          description: "Take a cooking class using fresh market ingredients.",
          cost: 60
        }
      ]
    });
  } else {
    activities.push({
      id: day * 100 + 2,
      time: "09:30",
      title: "Beach & Coastal Walk",
      description: `Enjoy the beautiful coastline of ${destinationName} with a leisurely walk along the beachfront promenade.`,
      location: "Beachfront",
      duration: "2.5 hours",
      type: "leisure",
      cost: 0,
      tips: ["Bring sunscreen and a hat, especially in summer months", "Beach umbrellas and chairs are available for rent"],
      alternativeOptions: [
        {
          title: "Water sports",
          description: "Try paddleboarding or kayaking along the coast.",
          cost: 35
        }
      ]
    });
  }
  
  // Lunch
  activities.push({
    id: day * 100 + 3,
    time: "12:30",
    title: day % 2 === 0 ? "Lunch at local restaurant" : "Seaside café lunch",
    description: "Enjoy local cuisine at a charming " + (day % 2 === 0 ? `restaurant in ${destinationName}'s old town` : "café with ocean views"),
    location: day % 2 === 0 ? "Old Town" : "Seafront",
    duration: "1.5 hours",
    type: "lunch",
    cost: 25,
    tips: activityTips.lunch.sort(() => 0.5 - Math.random()).slice(0, 2),
    alternativeOptions: [
      {
        title: "Quick bite at food stand",
        description: "Try local street food for a more budget-friendly option.",
        cost: 10
      },
      {
        title: "Picnic in the park",
        description: "Purchase fresh items from local shops and enjoy a picnic.",
        cost: 15
      }
    ]
  });
  
  // Afternoon activity
  if (day === 1) {
    activities.push({
      id: day * 100 + 4,
      time: "14:30",
      title: "Visit Main Cathedral",
      description: `Explore ${destinationName}'s magnificent cathedral, a masterpiece of architecture and history.`,
      location: "Cathedral Square",
      duration: "2 hours",
      type: "sightseeing",
      cost: 12,
      tips: ["Check opening hours as they vary by season", "Dress modestly when visiting religious sites"],
      alternativeOptions: [
        {
          title: "City viewpoint visit",
          description: "Visit a nearby viewpoint for panoramic city views instead.",
          cost: 8
        }
      ]
    });
  } else if (day === 2) {
    activities.push({
      id: day * 100 + 4,
      time: "14:30",
      title: "Visit Famous Landmark",
      description: `Discover the city's most iconic landmark, a symbol of ${destinationName} known worldwide.`,
      location: "City Center",
      duration: "2 hours",
      type: "sightseeing",
      cost: 25,
      tips: ["Book tickets online in advance to avoid queues", "The best photos can be taken from the northern side"],
      alternativeOptions: [
        {
          title: "Virtual tour experience",
          description: "Try the new virtual reality tour of the landmark for a different perspective.",
          cost: 15
        }
      ]
    });
  } else if (day === 3) {
    activities.push({
      id: day * 100 + 4,
      time: "14:30",
      title: "Park & Gardens Tour",
      description: `Stroll through ${destinationName}'s most beautiful park with fountains, sculptures, and lush gardens.`,
      location: "City Park",
      duration: "2.5 hours",
      type: "leisure",
      cost: 0,
      tips: ["Visit the rose garden which is particularly beautiful in spring", "Boat rentals are available at the main lake"],
      alternativeOptions: [
        {
          title: "Botanical Garden visit",
          description: "Visit the specialized botanical gardens instead for exotic plant species.",
          cost: 10
        }
      ]
    });
  } else if (day === 4) {
    activities.push({
      id: day * 100 + 4,
      time: "14:30",
      title: "Boat Tour",
      description: `See ${destinationName} from a different perspective with a relaxing boat tour along the coast or river.`,
      location: "Harbor",
      duration: "2 hours",
      type: "sightseeing",
      cost: 35,
      tips: ["Sit on the right side of the boat for the best views", "Bring a light jacket as it can be windy on the water"],
      alternativeOptions: [
        {
          title: "Sunset sailing trip",
          description: "Wait for the later sailing trip to catch the sunset views.",
          cost: 45
        }
      ]
    });
  } else {
    activities.push({
      id: day * 100 + 4,
      time: "14:30",
      title: "Shopping & Souvenirs",
      description: `Find the perfect souvenirs and local products in ${destinationName}'s best shopping districts.`,
      location: "Shopping District",
      duration: "2.5 hours",
      type: "leisure",
      cost: 0, // Shopping cost depends on purchases
      tips: ["Look for 'Artisan Made' labels for authentic local crafts", "Most shops close for lunch and reopen around 4-5pm"],
      alternativeOptions: [
        {
          title: "Artisan workshop visit",
          description: "Visit a local artisan's workshop to see traditional crafts being made.",
          cost: 15
        }
      ]
    });
  }
  
  // Free time / Rest
  activities.push({
    id: day * 100 + 5,
    time: "17:00",
    title: "Free time / Rest at hotel",
    description: "Take some time to relax, freshen up, or explore on your own before evening activities.",
    location: "Hotel or nearby",
    duration: "2 hours",
    type: "leisure",
    cost: 0,
    tips: ["Use this time to send postcards or call home", "Many hotel spas offer short relaxation treatments"],
    alternativeOptions: [
      {
        title: "Café and people watching",
        description: "Sit at a local café and enjoy watching city life pass by.",
        cost: 5
      }
    ]
  });
  
  // Dinner
  activities.push({
    id: day * 100 + 6,
    time: "19:30",
    title: day % 3 === 0 
      ? "Traditional Dinner Experience" 
      : day % 3 === 1 
        ? "Tapas Tour"
        : "Seafood Dinner",
    description: day % 3 === 0 
      ? `Enjoy authentic local cuisine at a traditional restaurant in ${destinationName}.` 
      : day % 3 === 1 
        ? "Experience the local tapas culture by trying a variety of small plates at different bars."
        : "Fresh seafood dinner at a renowned restaurant with views of the water.",
    location: day % 3 === 0 
      ? "Old Town" 
      : day % 3 === 1 
        ? "Tapas District"
        : "Seaside Restaurant",
    duration: "2 hours",
    type: "dinner",
    cost: 35,
    tips: activityTips.dinner.sort(() => 0.5 - Math.random()).slice(0, 2),
    alternativeOptions: [
      {
        title: "Food market dinner",
        description: "Try various food stalls at the evening market for a more casual experience.",
        cost: 20
      },
      {
        title: "Cooking class dinner",
        description: "Learn to cook local dishes and then enjoy your creation.",
        cost: 45
      }
    ]
  });
  
  // Evening activity
  if (day === 1 || day === 4) {
    activities.push({
      id: day * 100 + 7,
      time: "22:00",
      title: "Evening Stroll & Illuminated Monuments",
      description: `Take a pleasant evening walk through ${destinationName}'s illuminated streets and monuments.`,
      location: "City Center",
      duration: "1.5 hours",
      type: "leisure",
      cost: 0,
      tips: ["The main square is particularly beautiful at night", "Bring a camera with good low-light capabilities"],
      alternativeOptions: [
        {
          title: "Night photography tour",
          description: "Join a specialized photography tour to capture the city at night.",
          cost: 30
        }
      ]
    });
  } else if (day === 2) {
    activities.push({
      id: day * 100 + 7,
      time: "22:00",
      title: "Flamenco Show Experience",
      description: "Experience the passion and artistry of traditional flamenco dance and music.",
      location: "Flamenco Theater",
      duration: "1.5 hours",
      type: "leisure",
      cost: 35,
      tips: ["Book in advance as shows often sell out", "Front rows offer the best experience but any seat will be good"],
      alternativeOptions: [
        {
          title: "Local music venue",
          description: "Visit a venue featuring contemporary local musicians instead.",
          cost: 20
        }
      ]
    });
  } else {
    activities.push({
      id: day * 100 + 7,
      time: "22:00",
      title: "Rooftop Bar Experience",
      description: `Enjoy drinks with a spectacular view of ${destinationName} from one of the city's trendy rooftop bars.`,
      location: "Hotel Rooftop",
      duration: "2 hours",
      type: "leisure",
      cost: 20,
      tips: ["Arrive early to get the best seats with a view", "Many rooftops require reservations in high season"],
      alternativeOptions: [
        {
          title: "Local wine tasting",
          description: "Sample regional wines with an expert sommelier.",
          cost: 30
        }
      ]
    });
  }
  
  return activities;
};

// Weather icon mapping
const weatherIcons: Record<string, LucideIcon> = {
  "sunny": Sunrise,
  "partly-cloudy": Cloud,
  "cloudy": CloudFog,
  "rainy": CloudRain,
  "stormy": CloudLightning
};

// Import missing icons
import { Cloud, CloudFog, CloudRain, CloudLightning } from "lucide-react";

const TripItinerary = ({ tripId, destinationName = "Barcelona" }: TripItineraryProps) => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const [selectedView, setSelectedView] = useState<"timeline" | "details" | "tips">("timeline");
  
  // Fetch trip details
  const { 
    data: tripDetails, 
    isLoading: isLoadingTripDetails,
    error 
  } = useQuery<TripDetail[]>({
    queryKey: [`/api/trips/${tripId}/details`],
    enabled: !!tripId,
  });
  
  // Fetch trip data to get duration
  const { 
    data: tripData, 
    isLoading: isLoadingTripData 
  } = useQuery({
    queryKey: [`/api/trips/${tripId}`],
    enabled: !!tripId,
  });
  
  // Get trip data and trip details with loading state
  const isLoading = isLoadingTripDetails || isLoadingTripData;
  
  // Get the number of days in the trip
  const tripDuration = tripData?.duration || 5;
  
  // Get an array of day numbers (1 to number of days)
  const dayNumbers = Array.from({ length: tripDuration }, (_, i) => i + 1);
  
  // Get details for the selected day from fetched data, or fallback to generated
  const selectedDayDetail = tripDetails?.find(detail => detail.day === selectedDay);
  
  // Parse activities from the trip detail or fall back to generated data
  const dayActivities = selectedDayDetail?.activities as Activity[] || generateDayActivities(selectedDay, destinationName);
  
  // Get day summary (either from API or generate)
  const daySummary = generateDaySummary(selectedDay, destinationName);
  
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
        return <Camera className="h-4 w-4 text-blue-500" />;
      case "transportation":
        return <Bus className="h-4 w-4 text-purple-500" />;
      case "leisure":
        return <Heart className="h-4 w-4 text-yellow-500" />;
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

  // Get weather description
  const getWeatherDescription = (weather: DailyWeather) => {
    const { condition, highTemp, lowTemp, precipitation, windSpeed } = weather;
    
    let description = `Expect ${condition.replace('-', ' ')} conditions `;
    description += `with temperatures between ${lowTemp}°C and ${highTemp}°C. `;
    
    if (precipitation > 0) {
      description += `There's a chance of rain with ${precipitation}% precipitation. `;
    }
    
    if (windSpeed > 15) {
      description += `Be prepared for somewhat windy conditions.`;
    } else {
      description += `Wind should be mild.`;
    }
    
    return description;
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-heading text-gray-900 mb-3">Your Personalized Trip Itinerary</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We've created a detailed day-by-day plan for your trip to {destinationName}, 
          complete with activities, recommendations, and local tips.
        </p>
      </div>
      
      <Card className="overflow-hidden shadow-lg border-primary/10">
        <CardContent className="p-6">
          <Tabs 
            defaultValue={selectedDay.toString()} 
            value={selectedDay.toString()}
            onValueChange={(value) => setSelectedDay(parseInt(value))}
            className="w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold font-heading">Day-by-Day Itinerary</h3>
                <p className="text-sm text-gray-500">
                  Plan, track and adjust your travel activities
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" /> 
                  <span>Daily Budget: {formattedDailyCost}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowMap(!showMap)}>
                  <MapPin className="h-4 w-4 mr-2" />
                  {showMap ? "Hide Map" : "Show Map"}
                </Button>
              </div>
            </div>
            
            <div className="border-b mb-6">
              <TabsList className="flex justify-start mb-0 w-full overflow-x-auto hide-scrollbar">
                {dayNumbers.map(day => (
                  <TabsTrigger 
                    key={day} 
                    value={day.toString()}
                    className="text-sm sm:text-base py-2 px-5 whitespace-nowrap flex-shrink-0"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Day {day}
                    {day === 1 && <span className="ml-2 text-xs opacity-70">(Arrival)</span>}
                    {day === dayNumbers.length && <span className="ml-2 text-xs opacity-70">(Departure)</span>}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <div className="mb-6">
              <div className="flex border-b">
                <button 
                  onClick={() => setSelectedView("timeline")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium flex items-center",
                    selectedView === "timeline" 
                      ? "border-b-2 border-primary text-primary" 
                      : "text-gray-600 hover:text-primary"
                  )}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Timeline
                </button>
                <button 
                  onClick={() => setSelectedView("details")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium flex items-center",
                    selectedView === "details" 
                      ? "border-b-2 border-primary text-primary" 
                      : "text-gray-600 hover:text-primary"
                  )}
                >
                  <Info className="h-4 w-4 mr-2" />
                  Day Overview
                </button>
                <button 
                  onClick={() => setSelectedView("tips")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium flex items-center",
                    selectedView === "tips" 
                      ? "border-b-2 border-primary text-primary" 
                      : "text-gray-600 hover:text-primary"
                  )}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Travel Tips
                </button>
              </div>
            </div>
            
            {dayNumbers.map(day => (
              <TabsContent key={day} value={day.toString()} className="space-y-6">
                {selectedView === "timeline" && (
                  <div className="relative">
                    {/* Timeline */}
                    <div className="absolute top-0 bottom-0 left-16 w-px bg-neutral-200"></div>
                    
                    <div className="space-y-8">
                      {dayActivities.map((activity) => {
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
                                          <DollarSign className="h-3 w-3 mr-1" />
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
                                
                                {(activity.tips || activity.alternativeOptions) && (
                                  <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                                    <Accordion type="single" collapsible className="w-full">
                                      {activity.tips && activity.tips.length > 0 && (
                                        <AccordionItem value="tips" className="border-b-0">
                                          <AccordionTrigger className="text-sm text-primary py-2 hover:no-underline">
                                            <AlertCircle className="h-4 w-4 mr-2" />
                                            Local Tips
                                          </AccordionTrigger>
                                          <AccordionContent>
                                            <ul className="space-y-2">
                                              {activity.tips.map((tip, index) => (
                                                <li key={index} className="text-sm text-gray-600 flex">
                                                  <span className="text-primary mr-2">•</span>
                                                  {tip}
                                                </li>
                                              ))}
                                            </ul>
                                          </AccordionContent>
                                        </AccordionItem>
                                      )}
                                      
                                      {activity.alternativeOptions && activity.alternativeOptions.length > 0 && (
                                        <AccordionItem value="alternatives" className="border-b-0">
                                          <AccordionTrigger className="text-sm text-primary py-2 hover:no-underline">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            Alternative Options
                                          </AccordionTrigger>
                                          <AccordionContent>
                                            <div className="space-y-3">
                                              {activity.alternativeOptions.map((option, index) => {
                                                const optionCost = convertCurrency(option.cost, selectedCurrency.code);
                                                const formattedOptionCost = formatCurrencyByCode(optionCost, selectedCurrency.code);
                                                
                                                return (
                                                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                                                    <div className="flex justify-between items-start">
                                                      <h6 className="text-sm font-medium">{option.title}</h6>
                                                      <span className="text-xs text-gray-500">{formattedOptionCost}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </AccordionContent>
                                        </AccordionItem>
                                      )}
                                    </Accordion>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {selectedView === "details" && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{generateDaySummary(day, destinationName).title}</h3>
                          <p className="text-gray-600">{generateDaySummary(day, destinationName).description}</p>
                        </div>
                        
                        <div className="bg-white rounded-md p-3 shadow-sm flex items-center space-x-4 min-w-[200px]">
                          <div className="p-2 bg-gray-100 rounded-full">
                            {(weatherIcons[daySummary.weather.condition] || Sunrise)({
                              className: "h-6 w-6 text-primary"
                            })}
                          </div>
                          <div>
                            <div className="font-medium">
                              {daySummary.weather.highTemp}°C / {daySummary.weather.lowTemp}°C
                            </div>
                            <div className="text-xs text-gray-500 capitalize">
                              {daySummary.weather.condition.replace('-', ' ')}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {daySummary.highlights.map((highlight, index) => (
                          <Badge key={index} variant="outline" className="bg-white">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium flex items-center mb-3">
                            <Thermometer className="h-4 w-4 mr-2 text-blue-500" />
                            Weather & What to Pack
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            {getWeatherDescription(daySummary.weather)}
                          </p>
                          <div className="bg-gray-50 p-3 rounded-md mt-2">
                            <h5 className="text-sm font-medium mb-2">Suggested Items:</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                {daySummary.weather.highTemp > 25 ? "Light, breathable clothing" : "Layered clothing"}
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                {daySummary.weather.condition === "sunny" ? "Sunscreen and hat" : 
                                 daySummary.weather.condition === "rainy" || daySummary.weather.condition === "stormy" ? 
                                 "Umbrella or raincoat" : "Light jacket"}
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                Comfortable walking shoes
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                Water bottle and day bag
                              </li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium flex items-center mb-3">
                            <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                            Budget Breakdown
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Food & Drinks</span>
                              <span className="text-sm font-medium">
                                {formatCurrencyByCode(
                                  convertCurrency(
                                    dayActivities
                                      .filter(a => ["breakfast", "lunch", "dinner"].includes(a.type))
                                      .reduce((sum, a) => sum + a.cost, 0),
                                    selectedCurrency.code
                                  ),
                                  selectedCurrency.code
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Attractions & Activities</span>
                              <span className="text-sm font-medium">
                                {formatCurrencyByCode(
                                  convertCurrency(
                                    dayActivities
                                      .filter(a => ["sightseeing", "leisure"].includes(a.type))
                                      .reduce((sum, a) => sum + a.cost, 0),
                                    selectedCurrency.code
                                  ),
                                  selectedCurrency.code
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Transportation</span>
                              <span className="text-sm font-medium">
                                {formatCurrencyByCode(
                                  convertCurrency(
                                    dayActivities
                                      .filter(a => a.type === "transportation")
                                      .reduce((sum, a) => sum + a.cost, 0) || 10, // Default transportation cost
                                    selectedCurrency.code
                                  ),
                                  selectedCurrency.code
                                )}
                              </span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between items-center font-medium">
                              <span>Daily Total</span>
                              <span>{formattedDailyCost}</span>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-md mt-4">
                            <h5 className="text-sm font-medium mb-1">Money-Saving Tip:</h5>
                            <p className="text-xs text-gray-600">
                              {daySummary.budgetTips[0]}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
                
                {selectedView === "tips" && (
                  <div className="space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <h4 className="text-lg font-semibold mb-4 flex items-center">
                          <Navigation className="h-5 w-5 mr-2 text-primary" />
                          Essential Travel Tips
                        </h4>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-medium text-md mb-3 flex items-center">
                              <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                              Budget Tips
                            </h5>
                            <ul className="space-y-3">
                              {daySummary.budgetTips.map((tip, index) => (
                                <li key={index} className="flex items-start bg-gray-50 rounded-md p-3">
                                  <span className="text-primary font-bold mr-2">•</span>
                                  <span className="text-sm">{tip}</span>
                                </li>
                              ))}
                              <li className="flex items-start bg-gray-50 rounded-md p-3">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span className="text-sm">Always carry some cash for small vendors that might not accept cards</span>
                              </li>
                            </ul>
                            
                            <h5 className="font-medium text-md mt-6 mb-3 flex items-center">
                              <Umbrella className="h-4 w-4 mr-2 text-blue-500" />
                              Safety & Health
                            </h5>
                            <ul className="space-y-3">
                              <li className="flex items-start bg-gray-50 rounded-md p-3">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span className="text-sm">Keep emergency numbers saved in your phone: 112 for general emergencies</span>
                              </li>
                              <li className="flex items-start bg-gray-50 rounded-md p-3">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span className="text-sm">Carry a basic first aid kit with essential medications</span>
                              </li>
                              <li className="flex items-start bg-gray-50 rounded-md p-3">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span className="text-sm">Stay hydrated, especially during summer months</span>
                              </li>
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-md mb-3 flex items-center">
                              <Heart className="h-4 w-4 mr-2 text-red-500" />
                              Cultural Tips
                            </h5>
                            <ul className="space-y-3">
                              {daySummary.culturalTips.map((tip, index) => (
                                <li key={index} className="flex items-start bg-gray-50 rounded-md p-3">
                                  <span className="text-primary font-bold mr-2">•</span>
                                  <span className="text-sm">{tip}</span>
                                </li>
                              ))}
                              <li className="flex items-start bg-gray-50 rounded-md p-3">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span className="text-sm">Learn a few basic phrases in the local language - it's appreciated</span>
                              </li>
                            </ul>
                            
                            <h5 className="font-medium text-md mt-6 mb-3 flex items-center">
                              <Camera className="h-4 w-4 mr-2 text-purple-500" />
                              Photography & Souvenirs
                            </h5>
                            <ul className="space-y-3">
                              <li className="flex items-start bg-gray-50 rounded-md p-3">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span className="text-sm">Best photo spots: Central Plaza at sunset, Harbor viewpoint, Old Town streets</span>
                              </li>
                              <li className="flex items-start bg-gray-50 rounded-md p-3">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span className="text-sm">Look for locally-made crafts rather than mass-produced souvenirs</span>
                              </li>
                              <li className="flex items-start bg-gray-50 rounded-md p-3">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span className="text-sm">Always ask permission before photographing people</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="mt-6 bg-primary/10 rounded-lg p-4">
                          <h5 className="font-medium mb-2 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2 text-primary" />
                            Insider Tip for Day {selectedDay}
                          </h5>
                          <p className="text-sm text-gray-700">
                            {selectedDay === 1 ? 
                              `On your first day in ${destinationName}, ask your hotel reception for their recommended local restaurants - they often have special arrangements with authentic places tourists don't know about.` :
                             selectedDay === 2 ?
                              `The best time to visit the main cathedral is early morning to avoid crowds. Look for the hidden side chapel with beautiful stained glass that most tourists miss.` :
                             selectedDay === 3 ?
                              `When visiting the art museum, check if they offer guided tours in your language. They often reveal fascinating details about the artworks that aren't mentioned in the descriptions.` :
                             selectedDay === 4 ?
                              `At the market, head to the back corner where locals shop for the freshest products and best prices. The vendors there are usually happy to let you sample before buying.` :
                              `Before leaving ${destinationName}, visit the viewpoint above the city for one last panoramic view and photo opportunity that perfectly captures your trip memories.`}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <h4 className="font-medium mb-3">Common Phrases in Local Language</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm font-medium">Hello / Good day</p>
                            <p className="text-xs text-gray-600 italic">Hola / Buenos días</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm font-medium">Thank you</p>
                            <p className="text-xs text-gray-600 italic">Gracias</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm font-medium">Please</p>
                            <p className="text-xs text-gray-600 italic">Por favor</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm font-medium">Excuse me</p>
                            <p className="text-xs text-gray-600 italic">Perdón / Disculpe</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm font-medium">How much is it?</p>
                            <p className="text-xs text-gray-600 italic">¿Cuánto cuesta?</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm font-medium">Where is...?</p>
                            <p className="text-xs text-gray-600 italic">¿Dónde está...?</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        
        {showMap && (
          <div className="border-t">
            <div className="h-96 bg-neutral-100 flex items-center justify-center text-neutral-500 relative">
              <div className="absolute top-4 right-4 bg-white p-2 rounded-md shadow-md z-10">
                <h5 className="text-sm font-medium mb-2">Day {selectedDay} Activities</h5>
                <ul className="text-xs space-y-1">
                  {generateDayActivities(selectedDay, destinationName).map((activity) => (
                    <li key={activity.id} className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                      <span>{activity.location}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-neutral-400" />
                <p>Interactive map would be displayed here</p>
                <p className="text-sm">Showing all activities for Day {selectedDay}</p>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      <div className="bg-neutral-50 rounded-lg p-6 shadow-sm border border-neutral-100">
        <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Want to adjust your itinerary?</h3>
            <p className="text-sm text-neutral-600">
              This itinerary is just a suggestion. Feel free to customize it based on your preferences.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Droplet className="h-4 w-4 mr-2" />
              Customize Plan
            </Button>
            <Button>
              <Printer className="h-4 w-4 mr-2" />
              Save Itinerary
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Missing icon import
import { Printer } from "lucide-react";

export default TripItinerary;