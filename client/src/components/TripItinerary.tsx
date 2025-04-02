import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trip, TripDetail, Destination, Hotel, BudgetAllocation } from "@shared/schema";
import { Plane, Hotel as HotelIcon, Map, Plane as PlaneDeparture, Info, Lightbulb, Utensils, Globe as Languages, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface TripItineraryProps {
  tripId: number;
}

const TripItinerary = ({ tripId }: TripItineraryProps) => {
  const [showAllDays, setShowAllDays] = useState(false);
  
  const { data: trip, isLoading: tripLoading } = useQuery<Trip>({
    queryKey: [`/api/trips/${tripId}`],
  });
  
  const { data: tripDetails, isLoading: detailsLoading } = useQuery<TripDetail[]>({
    queryKey: [`/api/trips/${tripId}/details`],
    enabled: !!tripId
  });
  
  const { data: destination, isLoading: destinationLoading } = useQuery<Destination>({
    queryKey: [`/api/destinations/${trip?.destinationId}`],
    enabled: !!trip?.destinationId
  });
  
  const { data: hotel, isLoading: hotelLoading } = useQuery<Hotel>({
    queryKey: [`/api/hotels/${trip?.hotelId}`],
    enabled: !!trip?.hotelId
  });
  
  const { data: budget, isLoading: budgetLoading } = useQuery<BudgetAllocation>({
    queryKey: [`/api/trips/${tripId}/budget`],
    enabled: !!tripId
  });
  
  if (tripLoading || detailsLoading || destinationLoading || hotelLoading || budgetLoading) {
    return <TripItinerarySkeleton />;
  }
  
  if (!trip || !destination || !tripDetails) {
    return <div>Trip information not available</div>;
  }
  
  // Format dates 
  const startDate = trip.startDate instanceof Date 
    ? format(trip.startDate, "MMM d, yyyy") 
    : format(new Date(trip.startDate), "MMM d, yyyy");
  
  const endDate = trip.endDate instanceof Date 
    ? format(trip.endDate, "MMM d, yyyy") 
    : format(new Date(trip.endDate), "MMM d, yyyy");
  
  // Calculate duration
  const startDateObj = trip.startDate instanceof Date 
    ? trip.startDate 
    : new Date(trip.startDate);
  
  const endDateObj = trip.endDate instanceof Date 
    ? trip.endDate 
    : new Date(trip.endDate);
    
  const tripDuration = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24));
  
  // For displaying all days or just first 3
  const displayedDetails = showAllDays ? tripDetails : tripDetails.slice(0, 3);
  
  // Calculate total trip cost
  const totalCost = trip.totalCost || 0;
  const costPerPerson = totalCost / (trip.travelers || 1);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-200">
          <h2 className="text-2xl font-bold font-heading text-neutral-800">Your Trip Itinerary</h2>
          <p className="text-neutral-600">
            {destination.name}, {destination.country} · {startDate} - {endDate} · {tripDuration} days
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
          <div className="p-6">
            <h3 className="font-heading font-semibold text-lg mb-4">Trip Summary</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <PlaneDeparture className="text-primary" />
                </div>
                <div className="ml-4">
                  <p className="font-medium">Departure</p>
                  <p className="text-neutral-600 text-sm">{startDate} · 10:45 AM</p>
                  <p className="text-neutral-800">JFK → BCN</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <HotelIcon className="text-primary" />
                </div>
                <div className="ml-4">
                  <p className="font-medium">Accommodation</p>
                  <p className="text-neutral-600 text-sm">{tripDuration} nights</p>
                  <p className="text-neutral-800">{hotel?.name || "Not selected"}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <Map className="text-primary" />
                </div>
                <div className="ml-4">
                  <p className="font-medium">Activities</p>
                  <p className="text-neutral-600 text-sm">{tripDetails.length} activities planned</p>
                  <p className="text-neutral-800">4 guided tours, 3 attractions, 1 class</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <Plane className="text-primary" />
                </div>
                <div className="ml-4">
                  <p className="font-medium">Return</p>
                  <p className="text-neutral-600 text-sm">{endDate} · 5:20 PM</p>
                  <p className="text-neutral-800">BCN → JFK</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                variant="outline" 
                className="w-full py-2 px-4 border border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition duration-200"
              >
                Edit Trip Details
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="font-heading font-semibold text-lg mb-4">Daily Schedule</h3>
            
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-neutral-200"></div>
              
              {displayedDetails.map((detail, index) => (
                <div key={index} className="relative pl-10 pb-6">
                  <div className={`absolute left-0 w-8 h-8 rounded-full ${
                    index === 0 ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-700'
                  } flex items-center justify-center`}>
                    <span>{detail.day}</span>
                  </div>
                  <h4 className="font-medium">Day {detail.day}: {detail.title}</h4>
                  <ul className="mt-2 space-y-2 text-sm text-neutral-700">
                    {detail.activities.map((activity: any, actIndex: number) => (
                      <li key={actIndex} className="flex items-start">
                        <span className="text-neutral-400 w-16 flex-shrink-0">{activity.time}</span>
                        <span>{activity.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              
              {tripDetails.length > 3 && (
                <Button 
                  variant="link" 
                  className="mt-4 text-primary hover:text-blue-700 text-sm font-medium flex items-center"
                  onClick={() => setShowAllDays(!showAllDays)}
                >
                  <span>{showAllDays ? 'Show less' : `View all ${tripDetails.length} days`}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`ml-1 h-4 w-4 transition-transform ${showAllDays ? 'rotate-180' : ''}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              )}
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="font-heading font-semibold text-lg mb-4">Trip Notes & Tips</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium flex items-center">
                  <LightBulb className="text-yellow-500 mr-2 h-4 w-4" />
                  Local Transport
                </h4>
                <p className="text-sm mt-1">Consider getting a T-10 ticket (€11.35) for 10 rides on public transport. It can be shared between travelers and is more economical than single tickets.</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium flex items-center">
                  <Utensils className="text-green-500 mr-2 h-4 w-4" />
                  Dining Times
                </h4>
                <p className="text-sm mt-1">Locals typically have lunch between 2-4pm and dinner from 9-11pm. Many restaurants won't open for dinner until 8pm.</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium flex items-center">
                  <Languages className="text-blue-500 mr-2 h-4 w-4" />
                  Language
                </h4>
                <p className="text-sm mt-1">While Spanish is understood, Catalan is the local language. Learning a few basic Catalan phrases like "Bon dia" (good day) is appreciated by locals.</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium flex items-center">
                  <Ticket className="text-purple-500 mr-2 h-4 w-4" />
                  Attraction Tickets
                </h4>
                <p className="text-sm mt-1">Book major attractions like Sagrada Familia and Park Güell online in advance as they often sell out, especially during high season.</p>
              </div>
            </div>
            
            <div className="mt-5">
              <Button 
                variant="outline" 
                className="flex items-center justify-center w-full py-2 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium rounded-lg transition"
              >
                <span className="mr-2">+</span> Add Note
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-neutral-50 border-t border-neutral-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-semibold text-lg">Total Trip Cost</h3>
              <p className="text-neutral-600">All inclusive estimate for {trip.travelers} travelers</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">${totalCost.toLocaleString()}</p>
              <p className="text-neutral-600">${costPerPerson.toLocaleString()} per person</p>
            </div>
            <div className="w-full mt-2 md:mt-0 md:w-auto flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1 md:flex-initial py-2 px-6 border border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition duration-200"
              >
                Download PDF
              </Button>
              <Button 
                className="flex-1 md:flex-initial py-2 px-6 bg-primary text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Save Itinerary
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TripItinerarySkeleton = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-neutral-200">
        <Skeleton className="h-8 w-60 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>
      
      <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
        <div className="p-6">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex">
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="ml-4 flex-1">
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-36 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-full mt-6" />
        </div>
        
        <div className="p-6">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="space-y-6 relative">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="pl-10">
                <Skeleton className="absolute left-0 h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-40 mb-2" />
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex">
                      <Skeleton className="h-4 w-16 mr-2" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
            <Skeleton className="h-10 w-full mt-2" />
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-neutral-50 border-t border-neutral-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Skeleton className="h-6 w-40 mb-1" />
            <Skeleton className="h-4 w-60" />
          </div>
          <div className="text-right">
            <Skeleton className="h-10 w-32 mb-1" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="w-full md:w-auto flex space-x-3">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default TripItinerary;
