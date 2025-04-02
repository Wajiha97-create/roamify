import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, MapPin, Star, DollarSign, Hotel as HotelIcon, Filter } from "lucide-react";
import { Link } from "wouter";
import { useCurrency } from "../contexts/CurrencyContext";
import { convertCurrency, formatCurrencyByCode } from "../lib/currency";
import type { Hotel, Destination } from "@shared/schema";

const HotelsPage = () => {
  // State for filters
  const [countryFilter, setCountryFilter] = useState<string>("");
  const [cityFilter, setCityFilter] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Get destinations and countries for filter options
  const { data: destinations, isLoading: isLoadingDestinations } = useQuery({
    queryKey: ['/api/destinations'],
  });

  // Get all hotels
  const { data: allHotels, isLoading: isLoadingHotels } = useQuery({
    queryKey: ['/api/hotels'],
  });

  // Extract countries and cities from destinations for filters
  const countries = destinations ? Array.from(new Set(destinations.map((dest: Destination) => dest.country))) : [];
  
  const cities = destinations 
    ? countryFilter 
      ? destinations.filter((dest: Destination) => dest.country === countryFilter).map((dest: Destination) => dest.name)
      : Array.from(new Set(destinations.map((dest: Destination) => dest.name)))
    : [];

  // For currency display
  const { selectedCurrency } = useCurrency();

  // Unique hotel types for filtering
  const hotelTypes = allHotels && Array.isArray(allHotels)
    ? Array.from(new Set(allHotels.map((hotel: any) => hotel.type || "Standard")))
    : ["Luxury", "Boutique", "Budget", "Resort", "Apartment"];

  // Filter hotels based on user selections
  const filteredHotels = allHotels ? allHotels
    .filter((hotel: Hotel & { destinationName?: string; country?: string }) => {
      const matchesSearch = searchQuery === "" || 
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (hotel.description && hotel.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCountry = countryFilter === "" || hotel.country === countryFilter;
      
      const matchesCity = cityFilter === "" || hotel.destinationName === cityFilter;
      
      const matchesType = typeFilter === "" || hotel.type === typeFilter;
      
      const matchesPrice = hotel.pricePerNight <= maxPrice;
      
      return matchesSearch && matchesCountry && matchesCity && matchesType && matchesPrice;
    })
    : [];

  const clearFilters = () => {
    setCountryFilter("");
    setCityFilter("");
    setMaxPrice(1000);
    setTypeFilter("");
    setSearchQuery("");
  };

  // Render loading state
  if (isLoadingDestinations || isLoadingHotels) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-lg">Loading hotels...</p>
        </div>
      </div>
    );
  }

  // For development test data if no hotels are returned
  const hotelData = allHotels?.length > 0 ? allHotels : [
    // The data would normally be fetched from the API
    // These are just placeholders for rendering demonstration
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find the Perfect Accommodation</h1>
        <p className="text-gray-600">
          Browse and filter hotels based on your preferences
        </p>
      </div>
      
      {/* Search and filter section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search hotels by name or features..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="sm:w-auto w-full flex items-center"
          >
            <Filter className="mr-2" size={18} />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {showFilters && (
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="country-filter">Country</Label>
                    <Select value={countryFilter} onValueChange={setCountryFilter}>
                      <SelectTrigger id="country-filter" className="mt-1">
                        <SelectValue placeholder="All countries" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All countries</SelectItem>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="city-filter">City</Label>
                    <Select value={cityFilter} onValueChange={setCityFilter}>
                      <SelectTrigger id="city-filter" className="mt-1">
                        <SelectValue placeholder="All cities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All cities</SelectItem>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Hotel Types</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {hotelTypes.map((type) => (
                      <Button
                        key={type}
                        variant={typeFilter === type ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => setTypeFilter(typeFilter === type ? "" : type)}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label>Price Range per Night</Label>
                    <span className="text-sm text-gray-500">
                      {formatCurrencyByCode(convertCurrency(maxPrice, selectedCurrency.code), selectedCurrency.code)}
                    </span>
                  </div>
                  <Slider
                    className="mt-3"
                    min={50}
                    max={1000}
                    step={50}
                    value={[maxPrice]}
                    onValueChange={(value) => setMaxPrice(value[0])}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="price-filter">Maximum Price per Night</Label>
                    <span className="text-sm text-gray-500">
                      {formatCurrencyByCode(convertCurrency(maxPrice, selectedCurrency.code), selectedCurrency.code)}
                    </span>
                  </div>
                  <Slider
                    id="price-filter"
                    className="mt-3"
                    min={50}
                    max={1000}
                    step={50}
                    value={[maxPrice]}
                    onValueChange={(value) => setMaxPrice(value[0])}
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button 
                  variant="outline" 
                  onClick={clearFilters} 
                  className="mr-2"
                >
                  Clear Filters
                </Button>
                <Button onClick={() => setShowFilters(false)}>
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Results count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600">
          {filteredHotels.length} {filteredHotels.length === 1 ? 'hotel' : 'hotels'} found
        </p>
        <Select defaultValue="price_asc">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="rating_desc">Rating: High to Low</SelectItem>
            <SelectItem value="name_asc">Name: A to Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Hotel listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel: Hotel & { destinationName?: string; rating?: number }) => (
          <Card key={hotel.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 overflow-hidden">
              <img 
                src={hotel.imageUrl} 
                alt={hotel.name} 
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle className="text-xl">{hotel.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin size={14} className="mr-1" />
                    {hotel.location || `${hotel.destinationName}, ${hotel.country}`}
                  </CardDescription>
                </div>
                <Badge variant={hotel.type === "Luxury" ? "default" : "outline"} className="capitalize">
                  {hotel.type || "Hotel"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex items-center mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < (hotel.rating || 4) ? "text-yellow-400 fill-current" : "text-gray-300"}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {hotel.rating || "4.0"} ({hotel.reviewCount || "24"} reviews)
                </span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">
                {hotel.description || "Experience the best in hospitality with our comfortable rooms, exceptional service, and convenient location."}
              </p>
              <div className="flex items-center mt-4">
                <div className="text-lg font-semibold">
                  {formatCurrencyByCode(
                    convertCurrency(hotel.pricePerNight, selectedCurrency.code),
                    selectedCurrency.code
                  )}
                </div>
                <span className="text-sm text-gray-500 ml-1">/ night</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full">
                <HotelIcon size={16} className="mr-2" />
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredHotels.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <HotelIcon size={28} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No hotels found</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Try adjusting your filters or search criteria to find more options
          </p>
          <Button onClick={clearFilters} variant="outline">
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default HotelsPage;