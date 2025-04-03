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
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, MapPin, Filter, Clock, DollarSign, Camera } from "lucide-react";
import { Link } from "wouter";
import { useCurrency } from "../contexts/CurrencyContext";
import { convertCurrency, formatCurrencyByCode } from "../lib/currency";
import type { Attraction, Destination } from "@shared/schema";

const AttractionsPage = () => {
  // State for filters
  const [countryFilter, setCountryFilter] = useState<string>("");
  const [cityFilter, setCityFilter] = useState<string>("all_cities");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Get destinations and countries for filter options
  const { data: destinations, isLoading: isLoadingDestinations } = useQuery({
    queryKey: ['/api/destinations'],
  });

  // Get all attractions
  const { data: allAttractions, isLoading: isLoadingAttractions } = useQuery({
    queryKey: ['/api/attractions'],
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

  // Unique attraction types for filtering
  const attractionTypes = allAttractions && Array.isArray(allAttractions)
    ? Array.from(new Set(allAttractions.map((attraction: any) => attraction.type || "Other")))
    : ["Historical", "Museum", "Nature", "Park", "Religious", "Shopping", "Entertainment"];

  // Filter attractions based on user selections
  const filteredAttractions = allAttractions ? allAttractions
    .filter((attraction: Attraction & { destinationName?: string; country?: string }) => {
      const matchesSearch = searchQuery === "" || 
        attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (attraction.description && attraction.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCountry = countryFilter === "" || attraction.country === countryFilter;

      const matchesCity = cityFilter === "all_cities" || attraction.destinationName === cityFilter;

      const matchesType = typeFilter === "" || attraction.type === typeFilter;

      return matchesSearch && matchesCountry && matchesCity && matchesType;
    })
    : [];

  const clearFilters = () => {
    setCountryFilter("");
    setCityFilter("all_cities");
    setTypeFilter("");
    setSearchQuery("");
  };

  // Render loading state
  if (isLoadingDestinations || isLoadingAttractions) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-lg">Loading attractions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Amazing Attractions</h1>
        <p className="text-gray-600">
          Explore and filter attractions around the world
        </p>
      </div>

      {/* Search and filter section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search attractions by name or features..."
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
                        <SelectItem value="all">All countries</SelectItem>
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
                        <SelectItem value="all_cities">All cities</SelectItem>
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
                  <Label>Attraction Types</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {attractionTypes.map((type) => (
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

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label>Price Range</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Input 
                        type="number" 
                        placeholder="Min" 
                        className="w-full"
                      />
                      <span>to</span>
                      <Input 
                        type="number" 
                        placeholder="Max" 
                        className="w-full"
                      />
                    </div>
                  </div>
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
                <Button onClick={() => {
                setShowFilters(false);
                // Filters are already applied through the state changes
              }}>
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
          {filteredAttractions.length} {filteredAttractions.length === 1 ? 'attraction' : 'attractions'} found
        </p>
        <Select defaultValue="popularity">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">Popularity</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="name_asc">Name: A to Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Attraction listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAttractions.map((attraction: Attraction & { destinationName?: string; country?: string; duration?: string }) => (
          <Card key={attraction.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 overflow-hidden relative">
              <img 
                src={attraction.imageUrl} 
                alt={attraction.name} 
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-2">
                <Badge variant="outline" className="bg-white/80 text-black capitalize">
                  {attraction.type || "Attraction"}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{attraction.name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <MapPin size={14} className="mr-1" />
                {attraction.location || `${attraction.destinationName}, ${attraction.country}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-gray-600 text-sm line-clamp-3">
                {attraction.description || "Experience this amazing attraction, full of history and culture. A must-visit place for all travelers."}
              </p>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={16} className="mr-1" />
                  {attraction.duration || "2-3 hours"}
                </div>
                <div className="font-semibold">
                  {attraction.price ? formatCurrencyByCode(
                    convertCurrency(attraction.price, selectedCurrency.code),
                    selectedCurrency.code
                  ) : "Free entry"}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link to={`/attractions/${attraction.id}`}>
              <Button variant="outline" className="w-full">
                  <Camera size={16} className="mr-2" />
                  View Details
              </Button>
            </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredAttractions.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Camera size={28} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No attractions found</h3>
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

export default AttractionsPage;