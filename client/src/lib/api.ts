import { apiRequest } from "./queryClient";
import { 
  Destination, 
  Hotel, 
  Attraction, 
  Trip, 
  TripDetail, 
  BudgetAllocation,
  TripSearchParams,
  Country,
  TourGuide,
  TourGuideReview,
  TourGuidePhoto
} from "@shared/schema";

// Countries and Cities APIs
export const getCountries = async (): Promise<Country[]> => {
  const response = await apiRequest("GET", "/api/countries");
  return response.json();
};

export const getCountryByCode = async (code: string): Promise<Country> => {
  const response = await apiRequest("GET", `/api/countries/${code}`);
  return response.json();
};

// Destinations APIs
export const getDestinations = async (): Promise<Destination[]> => {
  const response = await apiRequest("GET", "/api/destinations");
  return response.json();
};

export const getDestination = async (id: number): Promise<Destination> => {
  const response = await apiRequest("GET", `/api/destinations/${id}`);
  return response.json();
};

export const searchDestinations = async (params: TripSearchParams): Promise<Destination[]> => {
  const response = await apiRequest("POST", "/api/destinations/search", params);
  return response.json();
};

// Hotels APIs
export const getHotels = async (destinationId: number): Promise<Hotel[]> => {
  const response = await apiRequest("GET", `/api/destinations/${destinationId}/hotels`);
  return response.json();
};

export const getHotel = async (id: number): Promise<Hotel> => {
  const response = await apiRequest("GET", `/api/hotels/${id}`);
  return response.json();
};

// Attractions APIs
export const getAttractions = async (destinationId: number): Promise<Attraction[]> => {
  const response = await apiRequest("GET", `/api/destinations/${destinationId}/attractions`);
  return response.json();
};

export const getAttraction = async (id: number): Promise<Attraction> => {
  const response = await apiRequest("GET", `/api/attractions/${id}`);
  return response.json();
};

// Trips APIs
export const getTrips = async (userId?: number): Promise<Trip[]> => {
  const url = userId ? `/api/trips?userId=${userId}` : "/api/trips";
  const response = await apiRequest("GET", url);
  return response.json();
};

export const getTrip = async (id: number): Promise<Trip> => {
  const response = await apiRequest("GET", `/api/trips/${id}`);
  return response.json();
};

export const createTrip = async (trip: any): Promise<Trip> => {
  const response = await apiRequest("POST", "/api/trips", trip);
  return response.json();
};

export const updateTrip = async (id: number, trip: any): Promise<Trip> => {
  const response = await apiRequest("PUT", `/api/trips/${id}`, trip);
  return response.json();
};

export const deleteTrip = async (id: number): Promise<void> => {
  await apiRequest("DELETE", `/api/trips/${id}`);
};

// Trip details APIs
export const getTripDetails = async (tripId: number): Promise<TripDetail[]> => {
  const response = await apiRequest("GET", `/api/trips/${tripId}/details`);
  return response.json();
};

export const createTripDetail = async (tripId: number, detail: any): Promise<TripDetail> => {
  const response = await apiRequest("POST", `/api/trips/${tripId}/details`, detail);
  return response.json();
};

// Budget allocation APIs
export const getBudgetAllocation = async (tripId: number): Promise<BudgetAllocation> => {
  const response = await apiRequest("GET", `/api/trips/${tripId}/budget`);
  return response.json();
};

export const updateBudgetAllocation = async (tripId: number, budget: any): Promise<BudgetAllocation> => {
  const response = await apiRequest("PUT", `/api/trips/${tripId}/budget`, budget);
  return response.json();
};

// Tour Guide APIs
export const getTourGuides = async (): Promise<TourGuide[]> => {
  const response = await apiRequest("GET", "/api/tour-guides");
  return response.json();
};

export const getTourGuide = async (id: number): Promise<TourGuide> => {
  const response = await apiRequest("GET", `/api/tour-guides/${id}`);
  return response.json();
};

export const createTourGuide = async (tourGuide: any): Promise<TourGuide> => {
  const response = await apiRequest("POST", "/api/tour-guides", tourGuide);
  return response.json();
};

// Tour Guide Reviews APIs
export const getTourGuideReviews = async (tourGuideId: number): Promise<TourGuideReview[]> => {
  const response = await apiRequest("GET", `/api/tour-guides/${tourGuideId}/reviews`);
  return response.json();
};

export const createTourGuideReview = async (tourGuideId: number, review: any): Promise<TourGuideReview> => {
  const response = await apiRequest("POST", `/api/tour-guides/${tourGuideId}/reviews`, review);
  return response.json();
};

// Tour Guide Photos APIs
export const getTourGuidePhotos = async (tourGuideId: number): Promise<TourGuidePhoto[]> => {
  const response = await apiRequest("GET", `/api/tour-guides/${tourGuideId}/photos`);
  return response.json();
};

export const createTourGuidePhoto = async (tourGuideId: number, photo: any): Promise<TourGuidePhoto> => {
  const response = await apiRequest("POST", `/api/tour-guides/${tourGuideId}/photos`, photo);
  return response.json();
};
