import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Destination } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, MapPin, User, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/contexts/CurrencyContext";
import { convertCurrency, formatCurrencyByCode } from "@/lib/currency";
import { Checkbox } from "@/components/ui/checkbox";

// Preference options
const PREFERENCES = [
  { value: "beach", label: "Beaches" },
  { value: "mountain", label: "Mountains" },
  { value: "museum", label: "Museums" },
  { value: "historical", label: "Historical Sites" },
  { value: "nightlife", label: "Nightlife" },
  { value: "shopping", label: "Shopping" },
  { value: "food", label: "Food & Dining" },
  { value: "adventure", label: "Adventure" },
  { value: "nature", label: "Nature" },
  { value: "cultural", label: "Cultural" },
];

export default function ItineraryPlannerPage() {
  // Active tab state
  const [activeTab, setActiveTab] = useState("destination");

  // Form state
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>("");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [budget, setBudget] = useState<number>(2000);
  const [travelers, setTravelers] = useState<number>(2);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  // Fetch destinations
  const { data: destinations = [] } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
  });

  // Currency conversion
  const { selectedCurrency } = useCurrency();
  const formattedBudget = formatCurrencyByCode(
    convertCurrency(budget, selectedCurrency.code),
    selectedCurrency.code
  );

  // Find selected destination
  const selectedDestination = destinations.find(
    d => d.id.toString() === selectedDestinationId
  );

  // Handle preference selection
  const togglePreference = (value: string) => {
    setSelectedPreferences(current =>
      current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value]
    );
  };

  // Navigate to next tab
  const goToNextTab = () => {
    if (activeTab === "destination" && selectedDestinationId) {
      setActiveTab("preferences");
    } else if (activeTab === "preferences" && selectedPreferences.length > 0) {
      setActiveTab("dates");
    } else if (activeTab === "dates" && dateRange.from && dateRange.to) {
      setActiveTab("budget");
    } else if (activeTab === "budget") {
      setActiveTab("summary");
    }
  };

  // Go to previous tab
  const goToPreviousTab = () => {
    if (activeTab === "preferences") {
      setActiveTab("destination");
    } else if (activeTab === "dates") {
      setActiveTab("preferences");
    } else if (activeTab === "budget") {
      setActiveTab("dates");
    } else if (activeTab === "summary") {
      setActiveTab("budget");
    }
  };

  // Calculate trip duration
  const calculateTripDuration = () => {
    if (dateRange.from && dateRange.to) {
      const diffTime = Math.abs(dateRange.to.getTime() - dateRange.from.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Plan Your Perfect Trip</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl mx-auto">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="destination">Destination</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="dates">Dates</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>
        
        {/* Destination Selection */}
        <TabsContent value="destination">
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Destination</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedDestinationId} onValueChange={setSelectedDestinationId}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {destinations.map((destination) => (
                    <div
                      key={destination.id}
                      className={`border rounded-lg overflow-hidden cursor-pointer transition-all
                        ${selectedDestinationId === destination.id.toString() ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                      onClick={() => setSelectedDestinationId(destination.id.toString())}
                    >
                      <div className="h-32 overflow-hidden">
                        <img
                          src={destination.imageUrl}
                          alt={destination.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{destination.name}</h3>
                          <p className="text-sm text-muted-foreground">{destination.country}</p>
                        </div>
                        <RadioGroupItem value={destination.id.toString()} id={`destination-${destination.id}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={goToNextTab}
                  disabled={!selectedDestinationId}
                >
                  Next: Select Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Preferences Selection */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>What Do You Want to Experience?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {PREFERENCES.map((preference) => (
                  <div
                    key={preference.value}
                    className={`border rounded-lg p-3 flex flex-col items-center text-center cursor-pointer transition-all
                      ${selectedPreferences.includes(preference.value) ? 'bg-primary/10 border-primary' : 'hover:bg-neutral-50'}`}
                    onClick={() => togglePreference(preference.value)}
                  >
                    <Checkbox
                      id={`pref-${preference.value}`}
                      checked={selectedPreferences.includes(preference.value)}
                      className="mb-2"
                    />
                    <Label htmlFor={`pref-${preference.value}`} className="cursor-pointer text-sm">
                      {preference.label}
                    </Label>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={goToPreviousTab}>
                  Back
                </Button>
                <Button
                  onClick={goToNextTab}
                  disabled={selectedPreferences.length === 0}
                >
                  Next: Select Dates
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Dates Selection */}
        <TabsContent value="dates">
          <Card>
            <CardHeader>
              <CardTitle>When Are You Traveling?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Travel Dates</Label>
                  <div className="mt-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from && dateRange.to ? (
                            <>
                              {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
                            </>
                          ) : (
                            <span>Select date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          selected={dateRange}
                          onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                          initialFocus
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {dateRange.from && dateRange.to && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Trip duration: {calculateTripDuration()} days
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="travelers">Number of Travelers</Label>
                  <div className="flex items-center mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    >
                      -
                    </Button>
                    <Input
                      id="travelers"
                      type="number"
                      min={1}
                      value={travelers}
                      onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                      className="w-16 h-8 mx-2 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setTravelers(travelers + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={goToPreviousTab}>
                  Back
                </Button>
                <Button
                  onClick={goToNextTab}
                  disabled={!dateRange.from || !dateRange.to}
                >
                  Next: Set Budget
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Budget Selection */}
        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>What's Your Budget?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="budget">Total Budget ({selectedCurrency.code})</Label>
                  <div className="relative mt-2">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="budget"
                      type="number"
                      min={100}
                      value={budget}
                      onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This is approximately {formattedBudget} for your entire trip.
                  </p>
                  
                  {travelers > 1 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      That's about {formatCurrencyByCode(convertCurrency(budget / travelers, selectedCurrency.code), selectedCurrency.code)} per person.
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={goToPreviousTab}>
                  Back
                </Button>
                <Button onClick={goToNextTab}>
                  Next: Review Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Summary */}
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Your Trip Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDestination && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="h-48 rounded-lg overflow-hidden">
                        <img 
                          src={selectedDestination.imageUrl} 
                          alt={selectedDestination.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">{selectedDestination.name}, {selectedDestination.country}</h3>
                        <p className="text-muted-foreground">{selectedDestination.description}</p>
                      </div>
                      
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {dateRange.from && dateRange.to && (
                            <>
                              {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
                              <span className="text-muted-foreground ml-1">
                                ({calculateTripDuration()} days)
                              </span>
                            </>
                          )}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{travelers} {travelers === 1 ? 'traveler' : 'travelers'}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formattedBudget} total budget</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Your Preferences</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPreferences.map(pref => (
                        <Badge key={pref} variant="secondary">
                          {PREFERENCES.find(p => p.value === pref)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button className="w-full" size="lg">
                      Generate My Personalized Itinerary
                    </Button>
                    <p className="text-sm text-center text-muted-foreground mt-2">
                      We'll create a custom day-by-day plan based on your preferences
                    </p>
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex justify-start">
                <Button variant="outline" onClick={goToPreviousTab}>
                  Back to Budget
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}