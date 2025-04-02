import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Destination } from "@shared/schema";
import BudgetInput from "@/components/BudgetInput";
import DestinationCard from "@/components/DestinationCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  // Query to get all destinations
  const { data: destinations, isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
  });

  const [visibleDestinations, setVisibleDestinations] = useState<number>(3);

  const handleShowMore = () => {
    if (destinations) {
      setVisibleDestinations(Math.min(destinations.length, visibleDestinations + 3));
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2 lg:pr-12">
              <h1 className="text-4xl sm:text-5xl font-bold font-heading leading-tight mb-6">
                Plan your perfect trip within your budget
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Discover amazing destinations, find the best hotels, and create memorable experiences without breaking the bank.
              </p>
              
              {/* Budget Input Component */}
              <BudgetInput />
            </div>
            <div className="hidden lg:block lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Scenic travel destination" 
                className="rounded-xl shadow-xl object-cover h-full w-full" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Destination Recommendations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold font-heading text-neutral-800">Recommended Destinations</h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <Skeleton className="h-52 w-full" />
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <Skeleton className="h-6 w-40 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-6 w-20 mb-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <div className="mt-3 mb-4">
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1 mb-4">
                    <Skeleton className="h-6 w-16 rounded" />
                    <Skeleton className="h-6 w-20 rounded" />
                    <Skeleton className="h-6 w-16 rounded" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations?.slice(0, visibleDestinations).map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
            
            {destinations && visibleDestinations < destinations.length && (
              <div className="mt-8 text-center">
                <Button 
                  variant="outline"
                  className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium rounded-lg transition flex items-center justify-center mx-auto"
                  onClick={handleShowMore}
                >
                  <Globe className="mr-2 h-5 w-5" /> Explore More Destinations
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default Home;
