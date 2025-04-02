import { 
  User, InsertUser, 
  Destination, InsertDestination,
  Hotel, InsertHotel,
  Attraction, InsertAttraction,
  Trip, InsertTrip,
  TripDetail, InsertTripDetail,
  BudgetAllocation, InsertBudgetAllocation,
  TripSearchParams
} from "@shared/schema";

// Extended storage interface with all CRUD methods we need
export interface IStorage {
  // Original user methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Destination methods
  getDestinations(): Promise<Destination[]>;
  getDestination(id: number): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  searchDestinations(params: TripSearchParams): Promise<Destination[]>;
  
  // Hotel methods
  getHotels(destinationId: number): Promise<Hotel[]>;
  getHotel(id: number): Promise<Hotel | undefined>;
  createHotel(hotel: InsertHotel): Promise<Hotel>;
  
  // Attraction methods
  getAttractions(destinationId: number): Promise<Attraction[]>;
  getAttraction(id: number): Promise<Attraction | undefined>;
  createAttraction(attraction: InsertAttraction): Promise<Attraction>;
  
  // Trip methods
  getTrips(userId?: number): Promise<Trip[]>;
  getTrip(id: number): Promise<Trip | undefined>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  updateTrip(id: number, trip: Partial<InsertTrip>): Promise<Trip | undefined>;
  deleteTrip(id: number): Promise<boolean>;
  
  // Trip details methods
  getTripDetails(tripId: number): Promise<TripDetail[]>;
  createTripDetail(detail: InsertTripDetail): Promise<TripDetail>;
  
  // Budget allocation methods
  getBudgetAllocation(tripId: number): Promise<BudgetAllocation | undefined>;
  createBudgetAllocation(allocation: InsertBudgetAllocation): Promise<BudgetAllocation>;
  updateBudgetAllocation(tripId: number, allocation: Partial<InsertBudgetAllocation>): Promise<BudgetAllocation | undefined>;
}

// Implementation of the storage interface using in-memory data
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private destinations: Map<number, Destination>;
  private hotels: Map<number, Hotel>;
  private attractions: Map<number, Attraction>;
  private trips: Map<number, Trip>;
  private tripDetails: Map<number, TripDetail>;
  private budgetAllocations: Map<number, BudgetAllocation>;
  
  private userIdCounter: number;
  private destinationIdCounter: number;
  private hotelIdCounter: number;
  private attractionIdCounter: number;
  private tripIdCounter: number;
  private tripDetailIdCounter: number;
  private budgetAllocationIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.destinations = new Map();
    this.hotels = new Map();
    this.attractions = new Map();
    this.trips = new Map();
    this.tripDetails = new Map();
    this.budgetAllocations = new Map();
    
    this.userIdCounter = 1;
    this.destinationIdCounter = 1;
    this.hotelIdCounter = 1;
    this.attractionIdCounter = 1;
    this.tripIdCounter = 1;
    this.tripDetailIdCounter = 1;
    this.budgetAllocationIdCounter = 1;
    
    // Initialize with sample travel data
    this.initializeData();
  }
  
  // User methods (from original implementation)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Destination methods
  async getDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }
  
  async getDestination(id: number): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }
  
  async createDestination(destination: InsertDestination): Promise<Destination> {
    const id = this.destinationIdCounter++;
    const newDestination: Destination = { ...destination, id };
    this.destinations.set(id, newDestination);
    return newDestination;
  }
  
  async searchDestinations(params: TripSearchParams): Promise<Destination[]> {
    let results = Array.from(this.destinations.values());
    
    if (params.destination) {
      const searchTerm = params.destination.toLowerCase();
      results = results.filter(dest => 
        dest.name.toLowerCase().includes(searchTerm) || 
        dest.country.toLowerCase().includes(searchTerm)
      );
    }
    
    if (params.budget) {
      results = results.filter(dest => dest.pricePerPerson * (params.travelers || 1) <= params.budget!);
      
      // Sort by budget match percentage
      results = results.sort((a, b) => b.budgetMatch - a.budgetMatch);
    }
    
    if (params.tripType) {
      const tripType = params.tripType.toLowerCase();
      results = results.filter(dest => 
        dest.tags.some(tag => tag.toLowerCase() === tripType)
      );
    }
    
    return results;
  }
  
  // Hotel methods
  async getHotels(destinationId: number): Promise<Hotel[]> {
    return Array.from(this.hotels.values())
      .filter(hotel => hotel.destinationId === destinationId);
  }
  
  async getHotel(id: number): Promise<Hotel | undefined> {
    return this.hotels.get(id);
  }
  
  async createHotel(hotel: InsertHotel): Promise<Hotel> {
    const id = this.hotelIdCounter++;
    const newHotel: Hotel = { ...hotel, id };
    this.hotels.set(id, newHotel);
    return newHotel;
  }
  
  // Attraction methods
  async getAttractions(destinationId: number): Promise<Attraction[]> {
    return Array.from(this.attractions.values())
      .filter(attraction => attraction.destinationId === destinationId);
  }
  
  async getAttraction(id: number): Promise<Attraction | undefined> {
    return this.attractions.get(id);
  }
  
  async createAttraction(attraction: InsertAttraction): Promise<Attraction> {
    const id = this.attractionIdCounter++;
    const newAttraction: Attraction = { ...attraction, id };
    this.attractions.set(id, newAttraction);
    return newAttraction;
  }
  
  // Trip methods
  async getTrips(userId?: number): Promise<Trip[]> {
    let trips = Array.from(this.trips.values());
    if (userId) {
      trips = trips.filter(trip => trip.userId === userId);
    }
    return trips;
  }
  
  async getTrip(id: number): Promise<Trip | undefined> {
    return this.trips.get(id);
  }
  
  async createTrip(trip: InsertTrip): Promise<Trip> {
    const id = this.tripIdCounter++;
    const createdAt = new Date();
    const newTrip: Trip = { ...trip, id, createdAt };
    this.trips.set(id, newTrip);
    return newTrip;
  }
  
  async updateTrip(id: number, tripUpdate: Partial<InsertTrip>): Promise<Trip | undefined> {
    const trip = this.trips.get(id);
    if (!trip) return undefined;
    
    const updatedTrip: Trip = { ...trip, ...tripUpdate };
    this.trips.set(id, updatedTrip);
    return updatedTrip;
  }
  
  async deleteTrip(id: number): Promise<boolean> {
    return this.trips.delete(id);
  }
  
  // Trip details methods
  async getTripDetails(tripId: number): Promise<TripDetail[]> {
    return Array.from(this.tripDetails.values())
      .filter(detail => detail.tripId === tripId)
      .sort((a, b) => a.day - b.day);
  }
  
  async createTripDetail(detail: InsertTripDetail): Promise<TripDetail> {
    const id = this.tripDetailIdCounter++;
    const newDetail: TripDetail = { ...detail, id };
    this.tripDetails.set(id, newDetail);
    return newDetail;
  }
  
  // Budget allocation methods
  async getBudgetAllocation(tripId: number): Promise<BudgetAllocation | undefined> {
    return Array.from(this.budgetAllocations.values())
      .find(allocation => allocation.tripId === tripId);
  }
  
  async createBudgetAllocation(allocation: InsertBudgetAllocation): Promise<BudgetAllocation> {
    const id = this.budgetAllocationIdCounter++;
    const newAllocation: BudgetAllocation = { ...allocation, id };
    this.budgetAllocations.set(id, newAllocation);
    return newAllocation;
  }
  
  async updateBudgetAllocation(tripId: number, allocationUpdate: Partial<InsertBudgetAllocation>): Promise<BudgetAllocation | undefined> {
    const allocation = Array.from(this.budgetAllocations.values())
      .find(a => a.tripId === tripId);
      
    if (!allocation) return undefined;
    
    const updatedAllocation: BudgetAllocation = { ...allocation, ...allocationUpdate };
    this.budgetAllocations.set(allocation.id, updatedAllocation);
    return updatedAllocation;
  }
  
  // Initialize with sample data for development
  private initializeData() {
    // Sample destinations
    const barcelona = this.createDestination({
      name: "Barcelona",
      country: "Spain",
      description: "A vibrant city known for its architecture, culture, and beautiful beaches.",
      imageUrl: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      rating: 4.5,
      reviewCount: 236,
      pricePerPerson: 1200,
      durationDays: 7,
      tags: ["Beach", "Culture", "Food"],
      budgetMatch: 98
    });
    
    const tokyo = this.createDestination({
      name: "Tokyo",
      country: "Japan",
      description: "A fascinating blend of traditional and ultra-modern, with something for everyone.",
      imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      rating: 4.9,
      reviewCount: 412,
      pricePerPerson: 1850,
      durationDays: 10,
      tags: ["City", "Culture", "Food"],
      budgetMatch: 82
    });
    
    const santorini = this.createDestination({
      name: "Santorini",
      country: "Greece",
      description: "Famous for its stunning sunsets, white-washed buildings and blue domes.",
      imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      rating: 4.0,
      reviewCount: 188,
      pricePerPerson: 1450,
      durationDays: 6,
      tags: ["Beach", "Relaxation", "Romantic"],
      budgetMatch: 95
    });
    
    // Add hotels for Barcelona
    this.createHotel({
      name: "Hotel Arts Barcelona",
      destinationId: 1,  // Barcelona
      description: "5-star luxury hotel with stunning sea views, rooftop pool, and award-winning dining.",
      imageUrl: "https://images.unsplash.com/photo-1455587734955-081b22074882?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      location: "Beachfront",
      distanceFromCenter: 2.1,
      rating: 4.5,
      reviewCount: 842,
      pricePerNight: 210,
      facilities: ["Free WiFi", "Pool", "Restaurant", "Room Service"],
      label: "Recommended",
      discountInfo: "15% off for your dates",
      withinBudget: true
    });
    
    this.createHotel({
      name: "Praktik Rambla",
      destinationId: 1,  // Barcelona
      description: "Boutique hotel in a modernist building with charming terrace, central location near Passeig de Gràcia.",
      imageUrl: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1174&q=80",
      location: "Eixample",
      distanceFromCenter: 0.5,
      rating: 4.0,
      reviewCount: 526,
      pricePerNight: 150,
      facilities: ["Free WiFi", "Breakfast", "Historic Building"],
      label: "Best Value",
      discountInfo: "Free cancellation",
      withinBudget: true
    });
    
    this.createHotel({
      name: "Casa Camper Barcelona",
      destinationId: 1,  // Barcelona
      description: "Designer boutique hotel with 24-hour complimentary snacks and drinks, spacious rooms with sitting areas.",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      location: "El Raval",
      distanceFromCenter: 0.8,
      rating: 4.8,
      reviewCount: 368,
      pricePerNight: 280,
      facilities: ["Free WiFi", "24h Food", "Fitness", "Laundry"],
      label: "Premium",
      discountInfo: "Only 2 rooms left",
      withinBudget: false
    });
    
    this.createHotel({
      name: "Generator Barcelona",
      destinationId: 1,  // Barcelona
      description: "Modern hostel with private rooms and social atmosphere, rooftop terrace and trendy bar area.",
      imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      location: "Gràcia",
      distanceFromCenter: 1.5,
      rating: 3.0,
      reviewCount: 523,
      pricePerNight: 85,
      facilities: ["Free WiFi", "Bar", "Social"],
      label: "Budget Friendly",
      discountInfo: "Save $15 with code SUMMER",
      withinBudget: true
    });
    
    // Add attractions for Barcelona
    this.createAttraction({
      name: "Sagrada Familia",
      destinationId: 1,  // Barcelona
      description: "Gaudí's unfinished masterpiece, this spectacular basilica is a must-see Barcelona attraction.",
      imageUrl: "https://images.unsplash.com/photo-1583779457094-ab6f9164a1c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      location: "L'Eixample",
      type: "Sightseeing",
      rating: 4.8,
      reviewCount: 14257,
      price: 26,
      withinBudget: true,
      label: "Within Budget"
    });
    
    this.createAttraction({
      name: "Park Güell",
      destinationId: 1,  // Barcelona
      description: "Colorful park with amazing views, featuring Gaudí's iconic mosaic work and natural design.",
      imageUrl: "https://images.unsplash.com/photo-1551634979-2b11f8c218da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      location: "Gràcia",
      type: "Sightseeing",
      rating: 4.3,
      reviewCount: 9873,
      price: 12,
      withinBudget: true,
      label: "Within Budget"
    });
    
    this.createAttraction({
      name: "Gothic Quarter Tour",
      destinationId: 1,  // Barcelona
      description: "Walking tour through Barcelona's historic Gothic Quarter with a knowledgeable local guide.",
      imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      location: "Ciutat Vella",
      type: "Tour",
      rating: 4.9,
      reviewCount: 3421,
      price: 18,
      withinBudget: true,
      label: "Best Value"
    });
    
    this.createAttraction({
      name: "Tapas Cooking Class",
      destinationId: 1,  // Barcelona
      description: "Learn to cook authentic Spanish tapas with a professional chef, then enjoy your creations.",
      imageUrl: "https://images.unsplash.com/photo-1591780980986-58d9b721a7e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      location: "El Born",
      type: "Food & Drink",
      rating: 4.7,
      reviewCount: 1238,
      price: 65,
      withinBudget: false,
      label: "Popular"
    });
    
    this.createAttraction({
      name: "Casa Batlló",
      destinationId: 1,  // Barcelona
      description: "One of Gaudí's most famous buildings with a dragon-inspired façade and innovative design.",
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      location: "Passeig de Gràcia",
      type: "Sightseeing",
      rating: 4.6,
      reviewCount: 7842,
      price: 35,
      withinBudget: true,
      label: "Within Budget"
    });
    
    // Add sample trip
    const trip = this.createTrip({
      userId: null,
      destinationId: 1, // Barcelona
      startDate: new Date("2023-06-15"),
      endDate: new Date("2023-06-22"),
      budget: 2000,
      travelers: 2,
      tripType: "City",
      hotelId: 1, // Hotel Arts Barcelona
      totalCost: 3840
    });
    
    // Add trip details
    this.createTripDetail({
      tripId: 1,
      day: 1,
      title: "Arrival & Exploration",
      activities: [
        { time: "10:45 AM", description: "Arrival at Barcelona El Prat Airport" },
        { time: "12:30 PM", description: "Hotel check-in & refreshment" },
        { time: "2:00 PM", description: "Explore Las Ramblas & Gothic Quarter" },
        { time: "7:00 PM", description: "Welcome dinner at El Nacional" }
      ]
    });
    
    this.createTripDetail({
      tripId: 1,
      day: 2,
      title: "Gaudí Masterpieces",
      activities: [
        { time: "9:00 AM", description: "Sagrada Familia guided tour" },
        { time: "1:00 PM", description: "Lunch at Enrique Tomás" },
        { time: "3:00 PM", description: "Park Güell visit" }
      ]
    });
    
    this.createTripDetail({
      tripId: 1,
      day: 3,
      title: "Beach & Culture",
      activities: [
        { time: "10:00 AM", description: "Relaxation at Barceloneta Beach" },
        { time: "2:00 PM", description: "Visit Picasso Museum" },
        { time: "7:00 PM", description: "Tapas Cooking Class & Dinner" }
      ]
    });
    
    // Add budget allocation
    this.createBudgetAllocation({
      tripId: 1,
      accommodation: 800,
      transportation: 300,
      food: 400,
      activities: 200,
      miscellaneous: 300
    });
  }
}

export const storage = new MemStorage();
