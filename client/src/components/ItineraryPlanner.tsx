import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Destination, Attraction, Hotel } from "@shared/schema";
import { getDestinations, getAttractions, getHotels } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ChevronRight, ChevronDown, Map, Loader2, Hotel as HotelIcon, MapPin, Coffee, Utensils, Camera, Palmtree, Mountain, Building, User, Calendar as CalendarIcon2 } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/contexts/CurrencyContext";
import { convertCurrency, formatCurrencyByCode } from "@/lib/currency";
import TripItinerary from "@/components/TripItinerary";

// Preference types that users can select
type PreferenceType = "Beach" | "Mountain" | "Museum" | "Historical" | "Nightlife" | "Shopping" | "Food" | "Adventure" | "Nature" | "Cultural";

interface ItineraryPlannerProps {
  initialDestinationId?: number;
}

const ItineraryPlanner = ({ initialDestinationId }: ItineraryPlannerProps) => {
  // State for the multi-step form
  const [step, setStep] = useState(1);
  const [selectedDestinationId, setSelectedDestinationId] = useState<number | null>(initialDestinationId || null);
  const [preferences, setPreferences] = useState<PreferenceType[]>([]);
  const [tripDuration, setTripDuration] = useState(5);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(2000);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date | undefined }>({
    from: new Date(),
    to: undefined,
  });
  const [generatedTripId, setGeneratedTripId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Get all destinations
  const { data: destinations, isLoading: isLoadingDestinations } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
  });

  // Get attractions for selected destination
  const { data: attractions, isLoading: isLoadingAttractions } = useQuery<Attraction[]>({
    queryKey: [`/api/destinations/${selectedDestinationId}/attractions`],
    enabled: !!selectedDestinationId,
  });

  // Get hotels for selected destination
  const { data: hotels, isLoading: isLoadingHotels } = useQuery<Hotel[]>({
    queryKey: [`/api/destinations/${selectedDestinationId}/hotels`],
    enabled: !!selectedDestinationId && step >= 3,
  });

  // Selected destination object
  const selectedDestination = destinations?.find(d => d.id === selectedDestinationId);

  // Filter attractions by user preferences
  const filteredAttractions = attractions?.filter(attraction => 
    preferences.some(pref => 
      attraction.type.includes(pref)
    )
  );

  // Handle preference toggle
  const togglePreference = (preference: PreferenceType) => {
    if (preferences.includes(preference)) {
      setPreferences(preferences.filter(p => p !== preference));
    } else {
      setPreferences([...preferences, preference]);
    }
  };

  // Generate trip itinerary
  const generateItinerary = async () => {
    setIsGenerating(true);
    
    // In a real app, we would call the API to create a trip
    // For now, we'll simulate the API call with a timeout
    setTimeout(() => {
      // Set a mock trip ID - in a real app this would come from the API
      const mockTripId = Math.floor(Math.random() * 1000) + 1;
      setGeneratedTripId(mockTripId);
      setIsGenerating(false);
      setStep(4);
    }, 1500);
  };

  // Currency conversion for budget display
  const { selectedCurrency } = useCurrency();
  const convertedBudget = convertCurrency(budget, selectedCurrency.code);
  const formattedBudget = formatCurrencyByCode(convertedBudget, selectedCurrency.code);

  // Preference option definitions with icons
  const preferenceOptions: { value: PreferenceType; label: string; icon: React.ReactNode }[] = [
    { value: "Beach", label: "Beaches", icon: <Palmtree className="h-4 w-4" /> },
    { value: "Mountain", label: "Mountains", icon: <Mountain className="h-4 w-4" /> },
    { value: "Museum", label: "Museums", icon: <Building className="h-4 w-4" /> },
    { value: "Historical", label: "Historical Sites", icon: <Building className="h-4 w-4" /> },
    { value: "Nightlife", label: "Nightlife", icon: <Coffee className="h-4 w-4" /> },
    { value: "Shopping", label: "Shopping", icon: <Building className="h-4 w-4" /> },
    { value: "Food", label: "Food & Dining", icon: <Utensils className="h-4 w-4" /> },
    { value: "Adventure", label: "Adventure", icon: <Mountain className="h-4 w-4" /> },
    { value: "Nature", label: "Nature", icon: <Palmtree className="h-4 w-4" /> },
    { value: "Cultural", label: "Cultural", icon: <Building className="h-4 w-4" /> },
  ];

  // Render different steps based on current step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Choose Your Destination</h3>
              <p className="text-neutral-600">Select a city or country for your trip:</p>
              
              {isLoadingDestinations ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <RadioGroup value={selectedDestinationId?.toString() || ""} onValueChange={(val) => setSelectedDestinationId(Number(val))}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {destinations?.map(destination => (
                      <Card 
                        key={destination.id} 
                        className={`cursor-pointer transition-all ${selectedDestinationId === destination.id ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                        onClick={() => setSelectedDestinationId(destination.id)}
                      >
                        <div className="h-36 overflow-hidden">
                          <img 
                            src={destination.imageUrl} 
                            alt={destination.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{destination.name}</h4>
                              <p className="text-sm text-neutral-500">{destination.country}</p>
                            </div>
                            <RadioGroupItem 
                              value={destination.id.toString()} 
                              id={`destination-${destination.id}`}
                              className="mt-1"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </RadioGroup>
              )}
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button 
                onClick={() => setStep(2)} 
                disabled={!selectedDestinationId}
                className="flex items-center"
              >
                Next Step <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        );
        
      case 2:
        return (
          <>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">What Do You Want to Experience?</h3>
              <p className="text-neutral-600">Choose the types of attractions you'd like to visit in {selectedDestination?.name}:</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                {preferenceOptions.map(option => (
                  <div 
                    key={option.value}
                    className={`border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-all ${preferences.includes(option.value) ? 'bg-primary/10 border-primary' : 'hover:bg-neutral-50'}`}
                    onClick={() => togglePreference(option.value)}
                  >
                    <div className={`rounded-full p-2 ${preferences.includes(option.value) ? 'bg-primary/20 text-primary' : 'bg-neutral-100 text-neutral-600'}`}>
                      {option.icon}
                    </div>
                    <span className="mt-2 text-sm font-medium text-center">{option.label}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="trip-duration">Trip Duration (Days)</Label>
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setTripDuration(Math.max(1, tripDuration - 1))}
                        className="h-10"
                      >-</Button>
                      <Input 
                        id="trip-duration"
                        type="number" 
                        min={1} 
                        max={30} 
                        value={tripDuration} 
                        onChange={e => setTripDuration(parseInt(e.target.value) || 1)}
                        className="mx-2 text-center"
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setTripDuration(Math.min(30, tripDuration + 1))}
                        className="h-10"
                      >+</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="travelers">Number of Travelers</Label>
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                        className="h-10"
                      >-</Button>
                      <Input 
                        id="travelers"
                        type="number" 
                        min={1} 
                        max={20} 
                        value={travelers} 
                        onChange={e => setTravelers(parseInt(e.target.value) || 1)}
                        className="mx-2 text-center"
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setTravelers(Math.min(20, travelers + 1))}
                        className="h-10"
                      >+</Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="budget">Total Budget ({selectedCurrency.code})</Label>
                  <Input 
                    id="budget"
                    type="number" 
                    value={budget} 
                    onChange={e => setBudget(parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                  <p className="text-sm text-neutral-500 mt-1">
                    This is approximately {formattedBudget} for your entire trip.
                  </p>
                </div>
                
                <div>
                  <Label>Travel Dates</Label>
                  <div className="flex flex-col sm:flex-row gap-2 mt-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "PPP")} - {format(dateRange.to, "PPP")}
                              </>
                            ) : (
                              format(dateRange.from, "PPP")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          selected={dateRange}
                          onSelect={(range) => {
                            if (range?.from && range?.to) {
                              // Calculate the number of days between dates
                              const days = Math.round((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                              setTripDuration(days);
                            }
                            setDateRange(range as { from: Date; to: Date | undefined });
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setStep(1)} 
                className="flex items-center"
              >
                Back
              </Button>
              <Button 
                onClick={() => setStep(3)} 
                disabled={preferences.length === 0 || !dateRange.from || !dateRange.to}
                className="flex items-center"
              >
                Next Step <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        );
        
      case 3:
        return (
          <>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Review Your Selections</h3>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trip Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-primary mr-2" />
                        <span className="font-medium">Destination:</span>
                        <span className="ml-2">{selectedDestination?.name}, {selectedDestination?.country}</span>
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon2 className="h-4 w-4 text-primary mr-2" />
                        <span className="font-medium">Dates:</span>
                        <span className="ml-2">
                          {dateRange.from && dateRange.to && (
                            <>
                              {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
                            </>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-primary mr-2" />
                        <span className="font-medium">Travelers:</span>
                        <span className="ml-2">{travelers}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <span className="font-medium mr-2">Budget:</span>
                        <span>{formattedBudget}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="font-medium mr-2">Duration:</span>
                        <span>{tripDuration} days</span>
                      </div>
                      <div className="flex items-start">
                        <span className="font-medium mr-2">Preferences:</span>
                        <div className="flex flex-wrap gap-1">
                          {preferences.map(pref => (
                            <Badge key={pref} variant="secondary" className="mr-1">{pref}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-4 mt-6">
                <h4 className="font-medium">Selected Attractions Based on Your Preferences</h4>
                
                {isLoadingAttractions ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredAttractions && filteredAttractions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredAttractions.slice(0, 6).map(attraction => (
                      <Card key={attraction.id} className="flex overflow-hidden">
                        <div className="w-1/3">
                          <img 
                            src={attraction.imageUrl} 
                            alt={attraction.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <CardContent className="w-2/3 p-4">
                          <h5 className="font-medium">{attraction.name}</h5>
                          <p className="text-sm text-neutral-600 line-clamp-2 mt-1">{attraction.description}</p>
                          <div className="flex items-center mt-2">
                            <Badge variant="outline" className="text-xs">
                              {attraction.type}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-4 text-center">
                    <p>No attractions found for your preferences. Please go back and select different preferences.</p>
                  </Card>
                )}
                
                {filteredAttractions && filteredAttractions.length > 6 && (
                  <div className="text-center text-sm text-neutral-600">
                    +{filteredAttractions.length - 6} more attractions available
                  </div>
                )}
              </div>
              
              <div className="space-y-4 mt-6">
                <h4 className="font-medium">Suggested Accommodations</h4>
                
                {isLoadingHotels ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : hotels && hotels.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hotels.slice(0, 3).map(hotel => (
                      <Card key={hotel.id} className="flex overflow-hidden">
                        <div className="w-1/3">
                          <img 
                            src={hotel.imageUrl} 
                            alt={hotel.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <CardContent className="w-2/3 p-4">
                          <h5 className="font-medium">{hotel.name}</h5>
                          <div className="flex items-center mt-1">
                            <MapPin className="h-3 w-3 text-neutral-500 mr-1" />
                            <p className="text-xs text-neutral-600">{hotel.location}</p>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <Badge className={`text-xs ${hotel.withinBudget ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                              {hotel.withinBudget ? "Within Budget" : "Premium"}
                            </Badge>
                            <p className="text-sm font-medium">
                              {formatCurrencyByCode(convertCurrency(hotel.pricePerNight, selectedCurrency.code), selectedCurrency.code)}
                              <span className="text-xs text-neutral-500">/night</span>
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-4 text-center">
                    <p>No hotels found for this destination.</p>
                  </Card>
                )}
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setStep(2)} 
                className="flex items-center"
              >
                Back
              </Button>
              <Button 
                onClick={generateItinerary} 
                disabled={isGenerating || !filteredAttractions || filteredAttractions.length === 0}
                className="flex items-center"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Itinerary
                  </>
                ) : (
                  <>
                    Generate Itinerary <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </>
        );
        
      case 4:
        return (
          <>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Your Personalized Itinerary</h3>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Map className="mr-2 h-4 w-4" />
                  View on Map
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Trip to {selectedDestination?.name}</CardTitle>
                  <CardDescription>
                    {dateRange.from && dateRange.to && (
                      <>
                        {format(dateRange.from, "MMMM d")} - {format(dateRange.to, "MMMM d, yyyy")} • {tripDuration} days • {travelers} {travelers === 1 ? 'traveler' : 'travelers'}
                      </>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedTripId && <TripItinerary tripId={generatedTripId} />}
                  
                  {!generatedTripId && (
                    <div className="p-8 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                      <p className="mt-4">Loading your itinerary...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4">Travel Tips for {selectedDestination?.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Local Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          Best time to visit {selectedDestination?.name} is during the shoulder seasons (April-May and September-October) for fewer crowds.
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          Local transportation is efficient and affordable. Consider buying a multi-day pass for savings.
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          Many museums offer free entry on the first Sunday of each month.
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Dining Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          Try local specialties like {selectedDestination?.country === "Spain" ? "paella and tapas" : "local cuisine"}.
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          Lunch menus (menu del día) offer great value at many restaurants.
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          Make dinner reservations in advance for popular restaurants, especially on weekends.
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Budget Optimization</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          Consider the city tourist card for bundled attraction discounts and public transportation.
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          Book attractions online in advance for better rates and to skip lines.
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          Look for accommodations with kitchen facilities to save on dining expenses.
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Weather Considerations</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          {selectedDestination?.country === "Spain" ? "Summers can be very hot, especially in inland areas. Stay hydrated and plan indoor activities during midday." : "Check seasonal weather patterns before packing."}
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          Bring comfortable walking shoes as you'll likely explore a lot on foot.
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          Pack layers, as temperatures can vary throughout the day.
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setStep(3)} 
                className="flex items-center"
              >
                Back
              </Button>
              <Button className="flex items-center">
                Save Trip Plan
              </Button>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Plan Your Personalized Trip</h2>
        <p className="text-neutral-600 mt-1">
          Create a custom itinerary based on your preferences and budget.
        </p>
      </div>
      
      <div className="mb-8">
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-neutral-200 z-0" />
          <div className="relative z-10 flex justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div 
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step >= stepNumber ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-600'
                  } transition-colors mb-2`}
                >
                  {stepNumber}
                </div>
                <span className="text-sm font-medium hidden sm:block">
                  {stepNumber === 1 && "Destination"}
                  {stepNumber === 2 && "Preferences"}
                  {stepNumber === 3 && "Review"}
                  {stepNumber === 4 && "Itinerary"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Card className="p-6">
        {renderStepContent()}
      </Card>
    </div>
  );
};

export default ItineraryPlanner;