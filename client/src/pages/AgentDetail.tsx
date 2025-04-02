import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, Star, Calendar, Users, Globe, Mail, Phone, 
  MessageCircle, Clock, ChevronLeft, User, Award 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTourGuide, getTourGuideReviews, getTourGuidePhotos } from "@/lib/api";
import { TourGuide, TourGuideReview, TourGuidePhoto } from "@shared/schema";

interface TourAgent {
  id: number;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  specialties: string[];
  languages: string[];
  imageUrl: string;
  toursCompleted: number;
  yearsExperience: number;
  bio: string;
  contactEmail: string;
  contactPhone: string;
  certifications: string[];
}

interface Review {
  id: number;
  reviewerName: string;
  reviewerImage: string;
  rating: number;
  date: string;
  comment: string;
  tourLocation: string;
}

interface ClientPhoto {
  id: number;
  imageUrl: string;
  location: string;
  tourDate: string;
}

interface CompletedTour {
  id: number;
  destination: string;
  date: string;
  duration: string;
  travelers: number;
  imageUrl: string;
}

// Mock data for a tour agent
const mockAgentDetail: TourAgent = {
  id: 1,
  name: "Maria Rodriguez",
  location: "Barcelona, Spain",
  rating: 4.9,
  reviews: 124,
  specialties: ["Cultural", "Historical", "Food", "Art & Museums", "Local Experiences"],
  languages: ["English", "Spanish", "French"],
  imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&h=300&auto=format&fit=crop",
  toursCompleted: 342,
  yearsExperience: 8,
  bio: "As a native Barcelonian with a degree in Art History, I've dedicated my career to sharing the rich cultural heritage of my city with travelers from around the world. My tours combine historical insights with authentic local experiences, giving you a deeper understanding of Barcelona beyond the typical tourist spots. I specialize in Gaudí architecture, Catalan cuisine, and hidden neighborhood gems that most visitors never discover.",
  contactEmail: "maria@barcelonaguides.com",
  contactPhone: "+34 612 345 678",
  certifications: ["Licensed Barcelona Tour Guide", "First Aid Certified", "Sustainable Tourism Advocate"]
};

// Mock reviews
const mockReviews: Review[] = [
  {
    id: 1,
    reviewerName: "James Wilson",
    reviewerImage: "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=100&h=100&auto=format&fit=crop",
    rating: 5,
    date: "October 15, 2024",
    comment: "Maria was incredible! Her knowledge of Barcelona's architecture was impressive, and she took us to some amazing local spots we would never have found on our own. Highly recommend!",
    tourLocation: "Barcelona"
  },
  {
    id: 2,
    reviewerName: "Emma Johnson",
    reviewerImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop",
    rating: 5,
    date: "September 28, 2024",
    comment: "Our family had a wonderful experience with Maria. She was patient with our children and made the historical sites engaging for them. She also recommended a fantastic local restaurant for dinner.",
    tourLocation: "Barcelona"
  },
  {
    id: 3,
    reviewerName: "Miguel Santos",
    reviewerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&auto=format&fit=crop",
    rating: 4,
    date: "August 16, 2024",
    comment: "Great tour of Sagrada Familia and Park Güell. Maria's insights about Gaudí's work were fascinating. Would have liked a bit more time at each location, but overall excellent experience.",
    tourLocation: "Barcelona"
  },
  {
    id: 4,
    reviewerName: "Sophie Chen",
    reviewerImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&h=100&auto=format&fit=crop",
    rating: 5,
    date: "July 22, 2024",
    comment: "Maria customized our food tour perfectly to accommodate dietary restrictions. We discovered incredible tapas bars and learned so much about Catalan cuisine. A highlight of our trip!",
    tourLocation: "Barcelona"
  }
];

// Mock client photos
const mockClientPhotos: ClientPhoto[] = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1464790719320-516ecd75af6c?q=80&w=300&h=200&auto=format&fit=crop",
    location: "Sagrada Familia, Barcelona",
    tourDate: "October 2024"
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1583779791512-eecbcbce262a?q=80&w=300&h=200&auto=format&fit=crop",
    location: "Park Güell, Barcelona",
    tourDate: "September 2024"
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1558370781-d6196949e317?q=80&w=300&h=200&auto=format&fit=crop",
    location: "Gothic Quarter, Barcelona",
    tourDate: "August 2024"
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?q=80&w=300&h=200&auto=format&fit=crop",
    location: "La Boqueria Market, Barcelona",
    tourDate: "July 2024"
  },
  {
    id: 5,
    imageUrl: "https://images.unsplash.com/photo-1574173228362-6efea98aef76?q=80&w=300&h=200&auto=format&fit=crop",
    location: "Barceloneta Beach, Barcelona",
    tourDate: "June 2024"
  },
  {
    id: 6,
    imageUrl: "https://images.unsplash.com/photo-1557041833-3d0e26e0d668?q=80&w=300&h=200&auto=format&fit=crop",
    location: "Casa Batlló, Barcelona",
    tourDate: "May 2024"
  }
];

// Mock completed tours
const mockCompletedTours: CompletedTour[] = [
  {
    id: 1,
    destination: "Barcelona Historical Walking Tour",
    date: "October 10-12, 2024",
    duration: "3 days",
    travelers: 4,
    imageUrl: "https://images.unsplash.com/photo-1583779791512-eecbcbce262a?q=80&w=300&h=200&auto=format&fit=crop"
  },
  {
    id: 2,
    destination: "Gaudí Architecture Masterpieces",
    date: "September 15-16, 2024",
    duration: "2 days",
    travelers: 2,
    imageUrl: "https://images.unsplash.com/photo-1464790719320-516ecd75af6c?q=80&w=300&h=200&auto=format&fit=crop"
  },
  {
    id: 3,
    destination: "Barcelona Culinary Experience",
    date: "August 20-21, 2024",
    duration: "2 days",
    travelers: 6,
    imageUrl: "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?q=80&w=300&h=200&auto=format&fit=crop"
  },
  {
    id: 4,
    destination: "Barcelona & Montserrat",
    date: "July 5-8, 2024",
    duration: "4 days",
    travelers: 2,
    imageUrl: "https://images.unsplash.com/photo-1552993871-c92bbfd15011?q=80&w=300&h=200&auto=format&fit=crop"
  }
];

export default function AgentDetail() {
  const [, params] = useRoute("/agents/:id");
  const agentId = params?.id ? parseInt(params.id, 10) : 0;
  
  // Fetch tour guide data
  const { 
    data: agent, 
    isLoading: isLoadingAgent, 
    error: agentError 
  } = useQuery({
    queryKey: ['/api/tour-guides', agentId],
    queryFn: () => getTourGuide(agentId),
    enabled: !!agentId
  });
  
  // Fetch tour guide reviews
  const { 
    data: reviews, 
    isLoading: isLoadingReviews 
  } = useQuery({
    queryKey: ['/api/tour-guides', agentId, 'reviews'],
    queryFn: () => getTourGuideReviews(agentId),
    enabled: !!agentId
  });
  
  // Fetch tour guide photos
  const { 
    data: photos, 
    isLoading: isLoadingPhotos 
  } = useQuery({
    queryKey: ['/api/tour-guides', agentId, 'photos'],
    queryFn: () => getTourGuidePhotos(agentId),
    enabled: !!agentId
  });
  
  // For tours/completed trips, we'll use mock data since there's no API endpoint for it
  const completedTours = mockCompletedTours;
  
  // Loading state
  if (isLoadingAgent || !agent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/agents">
          <Button variant="ghost" className="mb-6">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to All Guides
          </Button>
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <Skeleton className="w-40 h-40 rounded-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/4 mb-4" />
                  <Separator className="my-4" />
                  <div className="w-full space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-1/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (agentError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">Error loading tour guide information. Please try again later.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/agents">Back to Tour Guides</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/agents">
        <Button variant="ghost" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to All Guides
        </Button>
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4">
                  <img 
                    src={agent.imageUrl} 
                    alt={agent.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-semibold text-center">{agent.name}</h2>
                <div className="flex items-center mt-1 text-neutral-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{agent.location}</span>
                </div>
                <div className="flex items-center mt-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-medium">{agent.rating}</span>
                  <span className="text-sm text-neutral-500 ml-1">({agent.reviewCount} reviews)</span>
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="flex flex-col items-center p-2 bg-neutral-50 rounded-lg">
                    <Users className="h-5 w-5 text-primary mb-1" />
                    <span className="font-semibold">{agent.toursCompleted}</span>
                    <span className="text-xs text-neutral-600">Tours</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-neutral-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary mb-1" />
                    <span className="font-semibold">{agent.yearsExperience}</span>
                    <span className="text-xs text-neutral-600">Years</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="w-full">
                  <h3 className="font-medium mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-1">
                    {agent.languages.map((language: string) => (
                      <Badge key={language} variant="outline" className="flex items-center">
                        <Globe className="h-3 w-3 mr-1" />
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="w-full">
                  <h3 className="font-medium mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-1">
                    {agent.specialties.map((specialty: string) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="w-full">
                  <h3 className="font-medium mb-2">Certifications</h3>
                  <ul className="space-y-2">
                    {agent.certifications.map((cert: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <Award className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Separator className="my-4" />
                
                <div className="w-full">
                  <h3 className="font-medium mb-2">Contact</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-neutral-500 mr-2" />
                      <a href={`mailto:${agent.contactEmail}`} className="text-sm text-primary hover:underline">
                        {agent.contactEmail}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-neutral-500 mr-2" />
                      <a href={`tel:${agent.contactPhone}`} className="text-sm text-primary hover:underline">
                        {agent.contactPhone}
                      </a>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-6">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Message {agent.name.split(' ')[0]}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>About {agent.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-700 whitespace-pre-line">{agent.bio}</p>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="reviews">
            <TabsList className="mb-4">
              <TabsTrigger value="reviews">Reviews ({reviews?.length || 0})</TabsTrigger>
              <TabsTrigger value="tours">Completed Tours</TabsTrigger>
              <TabsTrigger value="photos">Client Photos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reviews" className="space-y-4">
              {isLoadingReviews ? (
                // Loading skeleton for reviews
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <Skeleton className="w-12 h-12 rounded-full mr-4" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-1/3 mb-2" />
                          <Skeleton className="h-4 w-2/3 mb-3" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full mt-1" />
                          <Skeleton className="h-4 w-2/3 mt-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : reviews && reviews.length > 0 ? (
                // Actual reviews
                reviews.map((review: TourGuideReview) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img 
                              src={review.reviewerImage} 
                              alt={review.reviewerName} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{review.reviewerName}</h4>
                            <div className="flex items-center">
                              {Array.from({ length: Math.floor(review.rating) }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-neutral-500 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(review.date).toLocaleDateString()}
                            <span className="mx-2">•</span>
                            <MapPin className="h-3 w-3 mr-1" />
                            {review.tourLocation}
                          </div>
                          <p className="mt-3 text-neutral-700">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                // No reviews
                <div className="text-center py-8">
                  <p className="text-neutral-500">No reviews yet.</p>
                </div>
              )}
              {reviews && reviews.length > 0 && (
                <Button variant="outline" className="w-full">
                  View All Reviews
                </Button>
              )}
            </TabsContent>
            
            <TabsContent value="tours" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedTours.map((tour: CompletedTour) => (
                <Card key={tour.id} className="overflow-hidden">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={tour.imageUrl} 
                      alt={tour.destination} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium">{tour.destination}</h4>
                    <div className="flex flex-wrap text-sm text-neutral-600 mt-2 gap-y-1">
                      <div className="flex items-center mr-4">
                        <Calendar className="h-3 w-3 mr-1" />
                        {tour.date}
                      </div>
                      <div className="flex items-center mr-4">
                        <Clock className="h-3 w-3 mr-1" />
                        {tour.duration}
                      </div>
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {tour.travelers} travelers
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" className="col-span-full">
                View All Tours
              </Button>
            </TabsContent>
            
            <TabsContent value="photos" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {isLoadingPhotos ? (
                // Loading skeleton for photos
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-3">
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <Skeleton className="h-3 w-1/2" />
                    </CardContent>
                  </Card>
                ))
              ) : photos && photos.length > 0 ? (
                // Actual photos
                photos.map((photo: TourGuidePhoto) => (
                  <Card key={photo.id} className="overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={photo.imageUrl} 
                        alt={photo.location} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-3">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3 w-3 text-neutral-500 mr-1" />
                        <span className="truncate">{photo.location}</span>
                      </div>
                      <div className="flex items-center text-xs text-neutral-500 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(photo.date).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                // No photos
                <div className="col-span-full text-center py-8">
                  <p className="text-neutral-500">No client photos available.</p>
                </div>
              )}
              {photos && photos.length > 0 && (
                <Button variant="outline" className="col-span-full">
                  View All Photos
                </Button>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}