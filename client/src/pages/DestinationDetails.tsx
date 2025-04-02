import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation, Link } from "wouter";
import { Destination, Hotel, Attraction, Trip, BudgetAllocation } from "@shared/schema";
import BudgetBreakdown from "@/components/BudgetBreakdown";
import HotelCard from "@/components/HotelCard";
import AttractionCard from "@/components/AttractionCard";
import TripItinerary from "@/components/TripItinerary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Hotel as HotelIcon, MapPin, Users, CalendarDays, Tag, Clock } from "lucide-react";
import { formatDate, calculateTripDuration } from "@/lib/utils";

const DestinationDetails = () => {
  const [, params] = useRoute("/destinations/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  const { toast } = useToast();
  const [tripId, setTripId] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  // Fetch destination data
  const { data: destination, isLoading: destinationLoading } = useQuery<Destination>({
    queryKey: [`/api/destinations/${id}`],
    enabled: !!id
  });

  // Fetch hotels for this destination
  const { data: hotels, isLoading: hotelsLoading } = useQuery<Hotel[]>({
    queryKey: [`/api/destinations/${id}/hotels`],
    enabled: !!id
  });

  // Fetch attractions for this destination
  const { data: attractions, isLoading: attractionsLoading } = useQuery<Attraction[]>({
    queryKey: [`/api/destinations/${id}/attractions`],
    enabled: !!id
  });

  // Create a sample trip when the destination is loaded
  useEffect(() => {
    if (destination && !tripId) {
      createSampleTrip();
    }
  }, [destination]);

  const createSampleTrip = async () => {
    try {
      // Create a sample trip for demonstration purposes
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + destination!.durationDays);

      const tripData = {
        destinationId: destination!.id,
        startDate,
        endDate,
        budget: 2000,
        travelers: 2,
        tripType: "city",
        hotelId: hotels && hotels.length > 0 ? hotels[0].id : undefined,
        totalCost: destination!.pricePerPerson * 2
      };

      const response = await apiRequest("POST", "/api/trips", tripData);
      const newTrip = await response.json();
      setTripId(newTrip.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not create a sample trip. Some features may be limited.",
        variant: "destructive"
      });
    }
  };

  // Loading states
  if (destinationLoading) {
    return <DestinationSkeleton />;
  }

  if (!destination) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="p-10 text-center">
            <h2 className="text-2xl font-bold mb-4">Destination Not Found</h2>
            <p className="text-neutral-600 mb-6">The destination you're looking for doesn't exist or has been removed.</p>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-6">
      {/* Destination Header */}
      <section className="relative h-72 md:h-96 bg-gradient-to-r from-blue-700 to-primary">
        <div className="absolute inset-0">
          <img 
            src={destination.imageUrl} 
            alt={`${destination.name}, ${destination.country}`} 
            className="w-full h-full object-cover opacity-40" 
          />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
          <div className="flex items-center text-white mb-2">
            <MapPin className="h-5 w-5 mr-1" />
            <span className="font-medium">{destination.country}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-heading">{destination.name}</h1>
          <div className="flex flex-wrap items-center mt-4 text-white space-x-6">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>{destination.durationDays} days</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <span>Best for 2-4 people</span>
            </div>
            <div className="flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              <span>From ${destination.pricePerPerson} per person</span>
            </div>
          </div>
        </div>
      </section>

      {/* Destination Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-wrap gap-6">
            <div className="w-full lg:w-2/3">
              <h2 className="text-2xl font-bold font-heading mb-4">About {destination.name}</h2>
              <p className="text-neutral-700 mb-6">{destination.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-lg">Best Time to Visit</h3>
                  <p className="text-neutral-700">April to October for the best weather and fewer crowds.</p>
                </div>
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-lg">Languages</h3>
                  <p className="text-neutral-700">Spanish, Catalan (official languages)</p>
                </div>
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-lg">Currency</h3>
                  <p className="text-neutral-700">Euro (€)</p>
                </div>
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-lg">Local Transport</h3>
                  <p className="text-neutral-700">Metro, bus, and tram systems are efficient and affordable.</p>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/4 lg:ml-auto">
              <div className="bg-primary bg-opacity-10 p-5 rounded-xl border border-primary">
                <h3 className="font-semibold text-lg mb-4 text-primary">Why Visit {destination.name}?</h3>
                <ul className="space-y-3">
                  {destination.tags.map((tag, index) => (
                    <li key={index} className="flex items-start">
                      <div className="rounded-full bg-primary text-white p-1 mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>{tag} {index === 0 ? '- Famous architecture' : index === 1 ? '- Rich heritage' : '- Incredible cuisine'}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link href="/plan">
                    <Button className="w-full">
                      Create Personalized Itinerary
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Budget Breakdown */}
      {tripId && <BudgetBreakdown 
        tripId={tripId} 
        totalBudget={2000} 
        destinationName={destination.name}
        duration={destination.durationDays}
      />}

      {/* Hotel Recommendations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold font-heading text-neutral-800">Recommended Hotels</h2>
            <p className="text-neutral-600">For your trip to {destination.name}, {destination.country}</p>
          </div>
          <div className="hidden md:flex space-x-4">
            <select className="appearance-none pl-3 pr-10 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Best Rated</option>
              <option>Distance to Center</option>
            </select>
            <select className="appearance-none pl-3 pr-10 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option>All Hotel Types</option>
              <option>Luxury</option>
              <option>Mid-range</option>
              <option>Budget</option>
              <option>Apartments</option>
            </select>
          </div>
        </div>
        
        {hotelsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-2/5 h-48 md:h-auto">
                  <Skeleton className="w-full h-full" />
                </div>
                <div className="md:w-3/5 p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <Skeleton className="h-6 w-40 mb-1" />
                      <Skeleton className="h-4 w-60 mb-1" />
                      <Skeleton className="h-4 w-32 mt-2" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-5 w-24 mb-1" />
                      <Skeleton className="h-6 w-16 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-6 w-20 rounded" />
                      <Skeleton className="h-6 w-20 rounded" />
                      <Skeleton className="h-6 w-20 rounded" />
                    </div>
                    <Skeleton className="h-16 w-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-9 w-24 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {hotels?.map(hotel => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Button 
            variant="outline"
            className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium rounded-lg transition flex items-center justify-center mx-auto"
          >
            <HotelIcon className="mr-2 h-5 w-5" /> View All {hotels?.length || 0} Hotels
          </Button>
        </div>
      </section>

      {/* Attractions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold font-heading text-neutral-800">Things to Do in {destination.name}</h2>
            <p className="text-neutral-600">Top-rated attractions within your budget</p>
          </div>
          <div className="hidden md:flex space-x-4">
            <Button variant="outline" className="px-4 py-2 rounded-full">All</Button>
            <Button className="px-4 py-2 rounded-full">Sightseeing</Button>
            <Button variant="outline" className="px-4 py-2 rounded-full">Tours</Button>
            <Button variant="outline" className="px-4 py-2 rounded-full">Food & Drink</Button>
            <Button variant="outline" className="px-4 py-2 rounded-full">Nature</Button>
          </div>
        </div>
        
        {attractionsLoading ? (
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex space-x-5 pb-6" style={{ minWidth: "max-content" }}>
              {[...Array(4)].map((_, index) => (
                <div key={index} className="w-80">
                  <Skeleton className="h-48 w-full rounded-t-xl" />
                  <div className="p-5 bg-white rounded-b-xl shadow-md">
                    <div className="flex justify-between mb-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-5 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-40 mb-3" />
                    <Skeleton className="h-4 w-32 mb-3" />
                    <Skeleton className="h-16 w-full mb-3" />
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-10 w-24 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex space-x-5 pb-6" style={{ minWidth: "max-content" }}>
              {attractions?.map(attraction => (
                <AttractionCard key={attraction.id} attraction={attraction} />
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-6">
          <Button 
            variant="outline"
            className="w-full md:w-auto px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium rounded-lg transition flex items-center justify-center mx-auto"
          >
            <MapPin className="mr-2 h-5 w-5" /> Explore All {attractions?.length || 0} Attractions
          </Button>
        </div>
      </section>

      {/* Trip Itinerary */}
      {tripId && <TripItinerary tripId={tripId} />}
    </div>
  );
};

const DestinationSkeleton = () => (
  <div className="pt-6">
    {/* Header Skeleton */}
    <section className="relative h-72 md:h-96 bg-gradient-to-r from-blue-700 to-primary">
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-10 w-80 mb-4" />
        <div className="flex flex-wrap items-center mt-4 space-x-6">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-40" />
        </div>
      </div>
    </section>

    {/* Details Skeleton */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-wrap gap-6">
          <div className="w-full lg:w-2/3">
            <Skeleton className="h-8 w-60 mb-4" />
            <Skeleton className="h-20 w-full mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-neutral-50 p-4 rounded-lg">
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/4 lg:ml-auto">
            <div className="bg-primary bg-opacity-10 p-5 rounded-xl border border-primary">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start">
                    <Skeleton className="h-6 w-6 rounded-full mr-3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Skeleton className="h-10 w-full rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default DestinationDetails;
