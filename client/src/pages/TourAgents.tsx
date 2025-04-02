import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Calendar, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTourGuides } from "@/lib/api";
import { TourGuide } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function TourAgents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  
  // Fetch tour guides data from API
  const { data: tourGuides, isLoading, error } = useQuery({
    queryKey: ['/api/tour-guides'],
    queryFn: getTourGuides
  });
  
  // Filter agents based on search term and filters
  const filteredAgents = tourGuides?.filter(agent => {
    // Search filter
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         agent.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Location filter
    const matchesLocation = locationFilter === "" || locationFilter === "all" || agent.location.includes(locationFilter);
    
    // Specialty filter
    const matchesSpecialty = specialtyFilter === "" || specialtyFilter === "all" || agent.specialties.includes(specialtyFilter);
    
    return matchesSearch && matchesLocation && matchesSpecialty;
  }) || [];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tour Guides & Local Experts</h1>
        <p className="text-neutral-600">
          Connect with knowledgeable local guides who will enhance your travel experience with insider knowledge and personalized recommendations.
        </p>
      </div>
      
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
              <Input 
                placeholder="Search guides by name or location..." 
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Barcelona">Barcelona</SelectItem>
                <SelectItem value="Madrid">Madrid</SelectItem>
                <SelectItem value="Paris">Paris</SelectItem>
                <SelectItem value="Rome">Rome</SelectItem>
                <SelectItem value="Berlin">Berlin</SelectItem>
                <SelectItem value="Santorini">Santorini</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                <SelectItem value="Cultural">Cultural</SelectItem>
                <SelectItem value="Historical">Historical</SelectItem>
                <SelectItem value="Food">Food & Culinary</SelectItem>
                <SelectItem value="Art">Art & Museums</SelectItem>
                <SelectItem value="Adventure">Adventure</SelectItem>
                <SelectItem value="Nightlife">Nightlife</SelectItem>
                <SelectItem value="Beach">Beach</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-3">
                  <div className="col-span-1">
                    <Skeleton className="h-40 w-full" />
                  </div>
                  <div className="col-span-2 p-4">
                    <Skeleton className="h-5 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/4 mb-3" />
                    <div className="flex gap-1 mb-3">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          // Error state
          <div className="col-span-full text-center py-12">
            <p className="text-red-500">Error loading tour guides. Please try again later.</p>
          </div>
        ) : filteredAgents.length > 0 ? (
          // Loaded guides
          filteredAgents.map(agent => (
            <Link key={agent.id} href={`/agents/${agent.id}`}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="grid grid-cols-3">
                    <div className="col-span-1 bg-neutral-100">
                      <img 
                        src={agent.imageUrl} 
                        alt={agent.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="col-span-2 p-4">
                      <h3 className="font-semibold">{agent.name}</h3>
                      <div className="flex items-center text-sm text-neutral-600 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {agent.location}
                      </div>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 font-medium">{agent.rating}</span>
                        </div>
                        <span className="text-xs text-neutral-500 ml-1">({agent.reviewCount || 0} reviews)</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {agent.specialties.slice(0, 3).map(specialty => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-neutral-600">
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {agent.toursCompleted} tours
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {agent.yearsExperience} years
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          // No results after filtering
          <div className="col-span-full text-center py-12">
            <p>No tour guides found matching your criteria. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}