// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  destinations;
  hotels;
  attractions;
  trips;
  tripDetails;
  budgetAllocations;
  countries;
  tourGuides;
  tourGuideReviews;
  tourGuidePhotos;
  userIdCounter;
  destinationIdCounter;
  hotelIdCounter;
  attractionIdCounter;
  tripIdCounter;
  tripDetailIdCounter;
  budgetAllocationIdCounter;
  tourGuideIdCounter;
  tourGuideReviewIdCounter;
  tourGuidePhotoIdCounter;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.destinations = /* @__PURE__ */ new Map();
    this.hotels = /* @__PURE__ */ new Map();
    this.attractions = /* @__PURE__ */ new Map();
    this.trips = /* @__PURE__ */ new Map();
    this.tripDetails = /* @__PURE__ */ new Map();
    this.budgetAllocations = /* @__PURE__ */ new Map();
    this.countries = /* @__PURE__ */ new Map();
    this.tourGuides = /* @__PURE__ */ new Map();
    this.tourGuideReviews = /* @__PURE__ */ new Map();
    this.tourGuidePhotos = /* @__PURE__ */ new Map();
    this.userIdCounter = 1;
    this.destinationIdCounter = 1;
    this.hotelIdCounter = 1;
    this.attractionIdCounter = 1;
    this.tripIdCounter = 1;
    this.tripDetailIdCounter = 1;
    this.budgetAllocationIdCounter = 1;
    this.tourGuideIdCounter = 1;
    this.tourGuideReviewIdCounter = 1;
    this.tourGuidePhotoIdCounter = 1;
    this.initializeData();
  }
  // User methods (from original implementation)
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userIdCounter++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Destination methods
  async getDestinations() {
    return Array.from(this.destinations.values());
  }
  async getDestination(id) {
    return this.destinations.get(id);
  }
  async createDestination(destination) {
    const id = this.destinationIdCounter++;
    const newDestination = { ...destination, id };
    this.destinations.set(id, newDestination);
    return newDestination;
  }
  async searchDestinations(params) {
    let results = Array.from(this.destinations.values());
    if (params.destination) {
      const searchTerm = params.destination.toLowerCase();
      results = results.filter(
        (dest) => dest.name.toLowerCase().includes(searchTerm) || dest.country.toLowerCase().includes(searchTerm)
      );
    }
    if (params.budget) {
      results = results.filter((dest) => dest.pricePerPerson * (params.travelers || 1) <= params.budget);
      results = results.sort((a, b) => b.budgetMatch - a.budgetMatch);
    }
    if (params.tripType) {
      const tripType = params.tripType.toLowerCase();
      results = results.filter(
        (dest) => dest.tags.some((tag) => tag.toLowerCase() === tripType)
      );
    }
    return results;
  }
  // Country and City methods
  async getCountries() {
    return Array.from(this.countries.values());
  }
  async getCountryByCode(code) {
    return this.countries.get(code);
  }
  // Hotel methods
  async getHotels(destinationId) {
    return Array.from(this.hotels.values()).filter((hotel) => hotel.destinationId === destinationId);
  }
  async getHotel(id) {
    return this.hotels.get(id);
  }
  async createHotel(hotel) {
    const id = this.hotelIdCounter++;
    const newHotel = {
      ...hotel,
      id,
      label: hotel.label || null,
      discountInfo: hotel.discountInfo || null
    };
    this.hotels.set(id, newHotel);
    return newHotel;
  }
  // Attraction methods
  async getAttractions(destinationId) {
    return Array.from(this.attractions.values()).filter((attraction) => attraction.destinationId === destinationId);
  }
  async getAttraction(id) {
    return this.attractions.get(id);
  }
  async createAttraction(attraction) {
    const id = this.attractionIdCounter++;
    const newAttraction = {
      ...attraction,
      id,
      label: attraction.label || null
    };
    this.attractions.set(id, newAttraction);
    return newAttraction;
  }
  // Trip methods
  async getTrips(userId) {
    let trips2 = Array.from(this.trips.values());
    if (userId) {
      trips2 = trips2.filter((trip) => trip.userId === userId);
    }
    return trips2;
  }
  async getTrip(id) {
    return this.trips.get(id);
  }
  async createTrip(trip) {
    const id = this.tripIdCounter++;
    const createdAt = /* @__PURE__ */ new Date();
    const newTrip = {
      ...trip,
      id,
      createdAt,
      travelers: trip.travelers || 1,
      duration: trip.duration || 1,
      userId: trip.userId || null,
      hotelId: trip.hotelId || null,
      totalCost: trip.totalCost || null,
      preferences: trip.preferences || [],
      tripType: trip.tripType || null,
      tourGuideRequested: trip.tourGuideRequested === true ? true : false,
      endDate: trip.endDate || null
    };
    this.trips.set(id, newTrip);
    console.log("Created trip:", newTrip);
    return newTrip;
  }
  async updateTrip(id, tripUpdate) {
    const trip = this.trips.get(id);
    if (!trip) return void 0;
    const updatedTrip = { ...trip, ...tripUpdate };
    this.trips.set(id, updatedTrip);
    return updatedTrip;
  }
  async deleteTrip(id) {
    return this.trips.delete(id);
  }
  // Trip details methods
  async getTripDetails(tripId) {
    return Array.from(this.tripDetails.values()).filter((detail) => detail.tripId === tripId).sort((a, b) => a.day - b.day);
  }
  async createTripDetail(detail) {
    const id = this.tripDetailIdCounter++;
    const newDetail = { ...detail, id };
    this.tripDetails.set(id, newDetail);
    return newDetail;
  }
  // Budget allocation methods
  async getBudgetAllocation(tripId) {
    return Array.from(this.budgetAllocations.values()).find((allocation) => allocation.tripId === tripId);
  }
  async createBudgetAllocation(allocation) {
    const id = this.budgetAllocationIdCounter++;
    const newAllocation = { ...allocation, id };
    this.budgetAllocations.set(id, newAllocation);
    return newAllocation;
  }
  async updateBudgetAllocation(tripId, allocationUpdate) {
    const allocation = Array.from(this.budgetAllocations.values()).find((a) => a.tripId === tripId);
    if (!allocation) return void 0;
    const updatedAllocation = { ...allocation, ...allocationUpdate };
    this.budgetAllocations.set(allocation.id, updatedAllocation);
    return updatedAllocation;
  }
  // Tour guide methods
  async getTourGuides() {
    return Array.from(this.tourGuides.values());
  }
  async getTourGuide(id) {
    return this.tourGuides.get(id);
  }
  async createTourGuide(tourGuide) {
    const id = this.tourGuideIdCounter++;
    const newTourGuide = { ...tourGuide, id };
    this.tourGuides.set(id, newTourGuide);
    return newTourGuide;
  }
  // Tour guide reviews methods
  async getTourGuideReviews(tourGuideId) {
    return Array.from(this.tourGuideReviews.values()).filter((review) => review.tourGuideId === tourGuideId);
  }
  async createTourGuideReview(review) {
    const id = this.tourGuideReviewIdCounter++;
    const newReview = { ...review, id };
    this.tourGuideReviews.set(id, newReview);
    return newReview;
  }
  // Tour guide photos methods
  async getTourGuidePhotos(tourGuideId) {
    return Array.from(this.tourGuidePhotos.values()).filter((photo) => photo.tourGuideId === tourGuideId);
  }
  async createTourGuidePhoto(photo) {
    const id = this.tourGuidePhotoIdCounter++;
    const newPhoto = { ...photo, id };
    this.tourGuidePhotos.set(id, newPhoto);
    return newPhoto;
  }
  // Initialize with sample data for development
  initializeData() {
    const countries = [
      {
        name: "United States",
        code: "US",
        cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Francisco"]
      },
      {
        name: "Spain",
        code: "ES",
        cities: ["Madrid", "Barcelona", "Valencia", "Seville", "M\xE1laga", "Bilbao", "Granada", "Palma de Mallorca", "Tenerife", "C\xF3rdoba"]
      },
      {
        name: "France",
        code: "FR",
        cities: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille"]
      },
      {
        name: "Italy",
        code: "IT",
        cities: ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence", "Bari", "Venice"]
      },
      {
        name: "Japan",
        code: "JP",
        cities: ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Sapporo", "Nagoya", "Fukuoka", "Kobe", "Hiroshima", "Sendai"]
      },
      {
        name: "United Kingdom",
        code: "GB",
        cities: ["London", "Manchester", "Birmingham", "Edinburgh", "Glasgow", "Liverpool", "Bristol", "Leeds", "Newcastle", "Sheffield"]
      },
      {
        name: "Germany",
        code: "DE",
        cities: ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "D\xFCsseldorf", "Leipzig", "Dortmund", "Essen"]
      },
      {
        name: "Australia",
        code: "AU",
        cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra", "Newcastle", "Wollongong", "Hobart"]
      },
      {
        name: "Greece",
        code: "GR",
        cities: ["Athens", "Thessaloniki", "Patras", "Heraklion", "Larissa", "Volos", "Rhodes", "Chania", "Santorini", "Corfu"]
      },
      {
        name: "Thailand",
        code: "TH",
        cities: ["Bangkok", "Chiang Mai", "Phuket", "Pattaya", "Hua Hin", "Koh Samui", "Krabi", "Ayutthaya", "Phi Phi Islands", "Kanchanaburi"]
      }
    ];
    countries.forEach((country) => {
      this.countries.set(country.code, country);
    });
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
      rating: 4,
      reviewCount: 188,
      pricePerPerson: 1450,
      durationDays: 6,
      tags: ["Beach", "Relaxation", "Romantic"],
      budgetMatch: 95
    });
    this.createHotel({
      name: "Hotel Arts Barcelona",
      destinationId: 1,
      // Barcelona
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
      destinationId: 1,
      // Barcelona
      description: "Boutique hotel in a modernist building with charming terrace, central location near Passeig de Gr\xE0cia.",
      imageUrl: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1174&q=80",
      location: "Eixample",
      distanceFromCenter: 0.5,
      rating: 4,
      reviewCount: 526,
      pricePerNight: 150,
      facilities: ["Free WiFi", "Breakfast", "Historic Building"],
      label: "Best Value",
      discountInfo: "Free cancellation",
      withinBudget: true
    });
    this.createHotel({
      name: "Casa Camper Barcelona",
      destinationId: 1,
      // Barcelona
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
      destinationId: 1,
      // Barcelona
      description: "Modern hostel with private rooms and social atmosphere, rooftop terrace and trendy bar area.",
      imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      location: "Gr\xE0cia",
      distanceFromCenter: 1.5,
      rating: 3,
      reviewCount: 523,
      pricePerNight: 85,
      facilities: ["Free WiFi", "Bar", "Social"],
      label: "Budget Friendly",
      discountInfo: "Save $15 with code SUMMER",
      withinBudget: true
    });
    this.createAttraction({
      name: "Sagrada Familia",
      destinationId: 1,
      // Barcelona
      description: "Gaud\xED's unfinished masterpiece, this spectacular basilica is a must-see Barcelona attraction.",
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
      name: "Park G\xFCell",
      destinationId: 1,
      // Barcelona
      description: "Colorful park with amazing views, featuring Gaud\xED's iconic mosaic work and natural design.",
      imageUrl: "https://images.unsplash.com/photo-1551634979-2b11f8c218da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      location: "Gr\xE0cia",
      type: "Sightseeing",
      rating: 4.3,
      reviewCount: 9873,
      price: 12,
      withinBudget: true,
      label: "Within Budget"
    });
    this.createAttraction({
      name: "Gothic Quarter Tour",
      destinationId: 1,
      // Barcelona
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
      destinationId: 1,
      // Barcelona
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
      name: "Casa Batll\xF3",
      destinationId: 1,
      // Barcelona
      description: "One of Gaud\xED's most famous buildings with a dragon-inspired fa\xE7ade and innovative design.",
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      location: "Passeig de Gr\xE0cia",
      type: "Sightseeing",
      rating: 4.6,
      reviewCount: 7842,
      price: 35,
      withinBudget: true,
      label: "Within Budget"
    });
    const trip = this.createTrip({
      userId: null,
      destinationId: 1,
      // Barcelona
      startDate: "2023-06-15",
      endDate: "2023-06-22",
      budget: 2e3,
      travelers: 2,
      tripType: "City",
      hotelId: 1,
      // Hotel Arts Barcelona
      totalCost: 3840
    });
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
      title: "Gaud\xED Masterpieces",
      activities: [
        { time: "9:00 AM", description: "Sagrada Familia guided tour" },
        { time: "1:00 PM", description: "Lunch at Enrique Tom\xE1s" },
        { time: "3:00 PM", description: "Park G\xFCell visit" }
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
    this.createBudgetAllocation({
      tripId: 1,
      accommodation: 800,
      transportation: 300,
      food: 400,
      activities: 200,
      miscellaneous: 300
    });
    const tourGuide1 = this.createTourGuide({
      name: "Elena Gomez",
      location: "Barcelona, Spain",
      bio: "Professional guide with over 10 years of experience showing tourists the hidden gems of Barcelona. Fluent in Spanish, English, and French, specializing in architectural and culinary tours.",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=988&q=80",
      rating: 4.9,
      reviewCount: 143,
      specialties: ["Architecture", "Culinary", "Local Culture"],
      languages: ["Spanish", "English", "French"],
      pricePerDay: 180,
      yearsExperience: 10,
      toursCompleted: 756,
      certifications: ["Licensed Barcelona Tour Guide", "Culinary Tour Specialist", "First Aid Certified"],
      contactEmail: "elena.gomez@barcelonaguides.com",
      contactPhone: "+34 612 345 678"
    });
    const tourGuide2 = this.createTourGuide({
      name: "Akira Tanaka",
      location: "Tokyo, Japan",
      bio: "Tokyo native with extensive knowledge of both traditional and modern aspects of Japanese culture. Passionate about sharing authentic experiences with travelers seeking to discover the real Japan.",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      rating: 4.8,
      reviewCount: 98,
      specialties: ["Traditional Culture", "Technology", "Food Tours"],
      languages: ["Japanese", "English", "Mandarin"],
      pricePerDay: 200,
      yearsExperience: 8,
      toursCompleted: 512,
      certifications: ["Tokyo Tourism Association Guide", "Japanese Cultural Heritage Expert", "Language Proficiency"],
      contactEmail: "akira.tanaka@tokyoguides.jp",
      contactPhone: "+81 90 1234 5678"
    });
    const tourGuide3 = this.createTourGuide({
      name: "Dimitris Papadopoulos",
      location: "Santorini, Greece",
      bio: "Island native with deep knowledge of Greek history and culture. Specializes in private tours that combine breathtaking scenery, historical sites, and authentic local experiences off the beaten path.",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
      rating: 4.7,
      reviewCount: 76,
      specialties: ["History", "Photography", "Culinary", "Sailing"],
      languages: ["Greek", "English", "Italian", "German"],
      pricePerDay: 160,
      yearsExperience: 15,
      toursCompleted: 628,
      certifications: ["Greek National Tourism Organization License", "Marine Safety Certified", "Advanced First Aid"],
      contactEmail: "dimitris@santoriniexplorers.gr",
      contactPhone: "+30 695 123 4567"
    });
    this.createTourGuideReview({
      tourGuideId: 1,
      reviewerName: "Sarah Johnson",
      reviewerImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
      rating: 5,
      comment: "Elena showed us a Barcelona we would never have discovered on our own. Her knowledge of Gaud\xED's architecture was incredible, and she knew exactly when to visit each site to avoid the crowds. She also took us to an amazing tapas place that wasn't in any guidebook!",
      date: "2023-05-15",
      tourLocation: "Barcelona"
    });
    this.createTourGuideReview({
      tourGuideId: 1,
      reviewerName: "Michael Chen",
      reviewerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
      rating: 4.5,
      comment: "Elena is extremely knowledgeable and friendly. She customized our tour perfectly for our interests and was especially attentive to our children, making the experience engaging for them as well. Her restaurant recommendations were spot on!",
      date: "2023-04-22",
      tourLocation: "Barcelona"
    });
    this.createTourGuidePhoto({
      tourGuideId: 1,
      imageUrl: "https://images.unsplash.com/photo-1551622996-91a4c97ad239?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      location: "Sagrada Familia, Barcelona",
      date: "2023-03-10"
    });
    this.createTourGuidePhoto({
      tourGuideId: 1,
      imageUrl: "https://images.unsplash.com/photo-1561409106-fece0aca76fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
      location: "Park G\xFCell, Barcelona",
      date: "2023-02-15"
    });
    this.createTourGuidePhoto({
      tourGuideId: 1,
      imageUrl: "https://images.unsplash.com/photo-1587789202069-f57ef526faf2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
      location: "Gothic Quarter, Barcelona",
      date: "2023-04-18"
    });
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, date, timestamp, json, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: real("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  pricePerPerson: integer("price_per_person").notNull(),
  durationDays: integer("duration_days").notNull(),
  tags: text("tags").array().notNull(),
  budgetMatch: integer("budget_match").notNull()
});
var insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true
});
var hotels = pgTable("hotels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  destinationId: integer("destination_id").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  location: text("location").notNull(),
  distanceFromCenter: real("distance_from_center").notNull(),
  rating: real("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  pricePerNight: integer("price_per_night").notNull(),
  facilities: text("facilities").array().notNull(),
  label: text("label"),
  // "Recommended", "Best Value", etc.
  discountInfo: text("discount_info"),
  withinBudget: boolean("within_budget").notNull()
});
var insertHotelSchema = createInsertSchema(hotels).omit({
  id: true
});
var attractions = pgTable("attractions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  destinationId: integer("destination_id").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  // "Sightseeing", "Tour", "Food & Drink", etc.
  rating: real("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  price: integer("price").notNull(),
  withinBudget: boolean("within_budget").notNull(),
  label: text("label")
  // "Within Budget", "Best Value", "Popular"
});
var insertAttractionSchema = createInsertSchema(attractions).omit({
  id: true
});
var trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  destinationId: integer("destination_id").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  duration: integer("duration").notNull().default(1),
  budget: integer("budget").notNull(),
  travelers: integer("travelers").notNull().default(1),
  tripType: text("trip_type"),
  // "Beach", "City", "Mountain", etc.
  preferences: text("preferences").array(),
  // Array of preferences
  hotelId: integer("hotel_id"),
  totalCost: integer("total_cost"),
  tourGuideRequested: boolean("tour_guide_requested").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var insertTripSchema = createInsertSchema(trips).omit({
  id: true,
  createdAt: true
});
var tripDetails = pgTable("trip_details", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id").notNull(),
  day: integer("day").notNull(),
  title: text("title").notNull(),
  activities: json("activities").notNull()
});
var insertTripDetailSchema = createInsertSchema(tripDetails).omit({
  id: true
});
var budgetAllocations = pgTable("budget_allocations", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id").notNull(),
  accommodation: integer("accommodation").notNull(),
  transportation: integer("transportation").notNull(),
  food: integer("food").notNull(),
  activities: integer("activities").notNull(),
  miscellaneous: integer("miscellaneous").notNull()
});
var insertBudgetAllocationSchema = createInsertSchema(budgetAllocations).omit({
  id: true
});
var tourGuides = pgTable("tour_guides", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  bio: text("bio").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: real("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  specialties: text("specialties").array().notNull(),
  languages: text("languages").array().notNull(),
  pricePerDay: integer("price_per_day").notNull(),
  yearsExperience: integer("years_experience").notNull(),
  toursCompleted: integer("tours_completed").notNull(),
  certifications: text("certifications").array().notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull()
});
var insertTourGuideSchema = createInsertSchema(tourGuides).omit({
  id: true
});
var tourGuideReviews = pgTable("tour_guide_reviews", {
  id: serial("id").primaryKey(),
  tourGuideId: integer("tour_guide_id").notNull(),
  reviewerName: text("reviewer_name").notNull(),
  reviewerImage: text("reviewer_image").notNull(),
  rating: real("rating").notNull(),
  comment: text("comment").notNull(),
  date: date("date").notNull(),
  tourLocation: text("tour_location").notNull()
});
var insertTourGuideReviewSchema = createInsertSchema(tourGuideReviews).omit({
  id: true
});
var tourGuidePhotos = pgTable("tour_guide_photos", {
  id: serial("id").primaryKey(),
  tourGuideId: integer("tour_guide_id").notNull(),
  imageUrl: text("image_url").notNull(),
  location: text("location").notNull(),
  date: date("date").notNull()
});
var insertTourGuidePhotoSchema = createInsertSchema(tourGuidePhotos).omit({
  id: true
});
var countrySchema = z.object({
  name: z.string(),
  code: z.string(),
  cities: z.array(z.string())
});
var tripSearchSchema = z.object({
  destination: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().min(0).optional(),
  tripType: z.string().optional(),
  travelers: z.number().int().positive().default(1)
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/countries", async (req, res) => {
    try {
      const countries = await storage.getCountries();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch countries" });
    }
  });
  app2.get("/api/countries/:code", async (req, res) => {
    try {
      const code = req.params.code;
      const country = await storage.getCountryByCode(code);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      res.json(country);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch country" });
    }
  });
  app2.get("/api/destinations", async (req, res) => {
    try {
      const destinations2 = await storage.getDestinations();
      res.json(destinations2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destinations" });
    }
  });
  app2.get("/api/destinations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid destination ID" });
      }
      const destination = await storage.getDestination(id);
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      res.json(destination);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destination" });
    }
  });
  app2.post("/api/destinations/search", async (req, res) => {
    try {
      const validationResult = tripSearchSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid search parameters",
          errors: validationResult.error.format()
        });
      }
      const searchParams = validationResult.data;
      const destinations2 = await storage.searchDestinations(searchParams);
      res.json(destinations2);
    } catch (error) {
      res.status(500).json({ message: "Failed to search destinations" });
    }
  });
  app2.get("/api/destinations/:id/hotels", async (req, res) => {
    try {
      const destinationId = parseInt(req.params.id);
      if (isNaN(destinationId)) {
        return res.status(400).json({ message: "Invalid destination ID" });
      }
      const hotels2 = await storage.getHotels(destinationId);
      const destination = await storage.getDestination(destinationId);
      const enrichedHotels = hotels2.map((hotel) => ({
        ...hotel,
        destinationName: destination?.name,
        country: destination?.country
      }));
      res.json(enrichedHotels);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hotels" });
    }
  });
  app2.get("/api/hotels", async (req, res) => {
    try {
      const destinations2 = await storage.getDestinations();
      const allHotels = [];
      for (const destination of destinations2) {
        const hotels2 = await storage.getHotels(destination.id);
        const enrichedHotels = hotels2.map((hotel) => ({
          ...hotel,
          destinationName: destination.name,
          country: destination.country
        }));
        allHotels.push(...enrichedHotels);
      }
      res.json(allHotels);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch all hotels" });
    }
  });
  app2.get("/api/hotels/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hotel ID" });
      }
      const hotel = await storage.getHotel(id);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      res.json(hotel);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hotel" });
    }
  });
  app2.get("/api/destinations/:id/attractions", async (req, res) => {
    try {
      const destinationId = parseInt(req.params.id);
      if (isNaN(destinationId)) {
        return res.status(400).json({ message: "Invalid destination ID" });
      }
      const attractions2 = await storage.getAttractions(destinationId);
      const destination = await storage.getDestination(destinationId);
      const enrichedAttractions = attractions2.map((attraction) => ({
        ...attraction,
        destinationName: destination?.name,
        country: destination?.country
      }));
      res.json(enrichedAttractions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch attractions" });
    }
  });
  app2.get("/api/attractions", async (req, res) => {
    try {
      const destinations2 = await storage.getDestinations();
      const allAttractions = [];
      for (const destination of destinations2) {
        const attractions2 = await storage.getAttractions(destination.id);
        const enrichedAttractions = attractions2.map((attraction) => ({
          ...attraction,
          destinationName: destination.name,
          country: destination.country
        }));
        allAttractions.push(...enrichedAttractions);
      }
      res.json(allAttractions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch all attractions" });
    }
  });
  app2.get("/api/attractions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid attraction ID" });
      }
      const attraction = await storage.getAttraction(id);
      if (!attraction) {
        return res.status(404).json({ message: "Attraction not found" });
      }
      res.json(attraction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch attraction" });
    }
  });
  app2.get("/api/trips", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId) : void 0;
      const trips2 = await storage.getTrips(userId);
      res.json(trips2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trips" });
    }
  });
  app2.get("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid trip ID" });
      }
      const trip = await storage.getTrip(id);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      res.json(trip);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trip" });
    }
  });
  app2.post("/api/trips", async (req, res) => {
    try {
      const tripData = req.body;
      console.log("Received trip data:", JSON.stringify(tripData, null, 2));
      if (!tripData.destinationId) {
        return res.status(400).json({ message: "Destination ID is required" });
      }
      if (!tripData.startDate) {
        return res.status(400).json({ message: "Start date is required" });
      }
      if (!tripData.budget) {
        return res.status(400).json({ message: "Budget is required" });
      }
      const processedData = {
        ...tripData,
        // Ensure travelers has a value
        travelers: tripData.travelers || 1,
        // Ensure duration is calculated if missing
        duration: tripData.duration || (tripData.endDate ? Math.ceil((new Date(tripData.endDate).getTime() - new Date(tripData.startDate).getTime()) / (1e3 * 60 * 60 * 24)) : 1),
        // Handle preferences field
        preferences: Array.isArray(tripData.preferences) ? tripData.preferences : [],
        // Set default for tourGuideRequested
        tourGuideRequested: tripData.tourGuideRequested === true
      };
      console.log("Processed trip data:", JSON.stringify(processedData, null, 2));
      const newTrip = await storage.createTrip(processedData);
      if (newTrip.budget) {
        const totalBudget = newTrip.budget;
        await storage.createBudgetAllocation({
          tripId: newTrip.id,
          accommodation: Math.round(totalBudget * 0.4),
          // 40% for accommodation
          transportation: Math.round(totalBudget * 0.15),
          // 15% for transportation
          food: Math.round(totalBudget * 0.2),
          // 20% for food
          activities: Math.round(totalBudget * 0.1),
          // 10% for activities
          miscellaneous: Math.round(totalBudget * 0.15)
          // 15% for miscellaneous
        });
      }
      const tripDuration = newTrip.duration || 5;
      const destination = await storage.getDestination(newTrip.destinationId);
      const destinationName = destination ? destination.name : "Your Destination";
      for (let day = 1; day <= tripDuration; day++) {
        const dayTitle = day === 1 ? `Welcome to ${destinationName}` : day === tripDuration ? `Farewell to ${destinationName}` : `Exploring ${destinationName} - Day ${day}`;
        const activities = [
          {
            time: "08:00",
            title: "Breakfast at hotel",
            description: "Start your day with a delicious breakfast",
            location: "Hotel",
            type: "breakfast",
            cost: Math.round(newTrip.budget * 0.01)
            // ~1% of budget
          },
          {
            time: "10:00",
            title: day === 1 ? `${destinationName} Orientation Tour` : `${destinationName} ${newTrip.preferences && newTrip.preferences.length > 0 ? newTrip.preferences[Math.floor(Math.random() * newTrip.preferences.length)] : "Cultural"} Experience`,
            description: "Explore the highlights of the area",
            location: "City Center",
            type: "sightseeing",
            cost: Math.round(newTrip.budget * 0.02)
            // ~2% of budget
          },
          {
            time: "13:00",
            title: "Lunch break",
            description: "Enjoy local cuisine at a recommended restaurant",
            location: "Local Restaurant",
            type: "lunch",
            cost: Math.round(newTrip.budget * 0.015)
            // ~1.5% of budget
          },
          {
            time: "15:00",
            title: day === tripDuration ? "Souvenir Shopping" : `${destinationName} Attraction Visit`,
            description: "Visit a popular local attraction",
            location: "Tourist Area",
            type: "sightseeing",
            cost: Math.round(newTrip.budget * 0.025)
            // ~2.5% of budget
          },
          {
            time: "19:00",
            title: "Dinner experience",
            description: "Savor the local flavors at a recommended venue",
            location: "Restaurant District",
            type: "dinner",
            cost: Math.round(newTrip.budget * 0.03)
            // ~3% of budget
          }
        ];
        await storage.createTripDetail({
          tripId: newTrip.id,
          day,
          title: dayTitle,
          activities
        });
      }
      console.log("Trip created successfully with details:", newTrip);
      res.status(201).json(newTrip);
    } catch (error) {
      console.error("Error creating trip:", error);
      res.status(500).json({ message: "Failed to create trip", error: String(error) });
    }
  });
  app2.put("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid trip ID" });
      }
      const tripUpdate = req.body;
      const updatedTrip = await storage.updateTrip(id, tripUpdate);
      if (!updatedTrip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      res.json(updatedTrip);
    } catch (error) {
      res.status(500).json({ message: "Failed to update trip" });
    }
  });
  app2.delete("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid trip ID" });
      }
      const deleted = await storage.deleteTrip(id);
      if (!deleted) {
        return res.status(404).json({ message: "Trip not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete trip" });
    }
  });
  app2.get("/api/trips/:id/details", async (req, res) => {
    try {
      const tripId = parseInt(req.params.id);
      if (isNaN(tripId)) {
        return res.status(400).json({ message: "Invalid trip ID" });
      }
      const details = await storage.getTripDetails(tripId);
      res.json(details);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trip details" });
    }
  });
  app2.post("/api/trips/:id/details", async (req, res) => {
    try {
      const tripId = parseInt(req.params.id);
      if (isNaN(tripId)) {
        return res.status(400).json({ message: "Invalid trip ID" });
      }
      const detail = { ...req.body, tripId };
      const newDetail = await storage.createTripDetail(detail);
      res.status(201).json(newDetail);
    } catch (error) {
      res.status(500).json({ message: "Failed to create trip detail" });
    }
  });
  app2.get("/api/trips/:id/budget", async (req, res) => {
    try {
      const tripId = parseInt(req.params.id);
      if (isNaN(tripId)) {
        return res.status(400).json({ message: "Invalid trip ID" });
      }
      const budget = await storage.getBudgetAllocation(tripId);
      if (!budget) {
        return res.status(404).json({ message: "Budget allocation not found" });
      }
      res.json(budget);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch budget allocation" });
    }
  });
  app2.put("/api/trips/:id/budget", async (req, res) => {
    try {
      const tripId = parseInt(req.params.id);
      if (isNaN(tripId)) {
        return res.status(400).json({ message: "Invalid trip ID" });
      }
      const budgetUpdate = req.body;
      const updatedBudget = await storage.updateBudgetAllocation(tripId, budgetUpdate);
      if (!updatedBudget) {
        return res.status(404).json({ message: "Budget allocation not found" });
      }
      res.json(updatedBudget);
    } catch (error) {
      res.status(500).json({ message: "Failed to update budget allocation" });
    }
  });
  app2.get("/api/tour-guides", async (req, res) => {
    try {
      const tourGuides2 = await storage.getTourGuides();
      res.json(tourGuides2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tour guides" });
    }
  });
  app2.get("/api/tour-guides/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tour guide ID" });
      }
      const tourGuide = await storage.getTourGuide(id);
      if (!tourGuide) {
        return res.status(404).json({ message: "Tour guide not found" });
      }
      res.json(tourGuide);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tour guide" });
    }
  });
  app2.post("/api/tour-guides", async (req, res) => {
    try {
      const tourGuide = req.body;
      const newTourGuide = await storage.createTourGuide(tourGuide);
      res.status(201).json(newTourGuide);
    } catch (error) {
      res.status(500).json({ message: "Failed to create tour guide" });
    }
  });
  app2.get("/api/tour-guides/:id/reviews", async (req, res) => {
    try {
      const tourGuideId = parseInt(req.params.id);
      if (isNaN(tourGuideId)) {
        return res.status(400).json({ message: "Invalid tour guide ID" });
      }
      const reviews = await storage.getTourGuideReviews(tourGuideId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tour guide reviews" });
    }
  });
  app2.post("/api/tour-guides/:id/reviews", async (req, res) => {
    try {
      const tourGuideId = parseInt(req.params.id);
      if (isNaN(tourGuideId)) {
        return res.status(400).json({ message: "Invalid tour guide ID" });
      }
      const review = { ...req.body, tourGuideId };
      const newReview = await storage.createTourGuideReview(review);
      res.status(201).json(newReview);
    } catch (error) {
      res.status(500).json({ message: "Failed to create tour guide review" });
    }
  });
  app2.get("/api/tour-guides/:id/photos", async (req, res) => {
    try {
      const tourGuideId = parseInt(req.params.id);
      if (isNaN(tourGuideId)) {
        return res.status(400).json({ message: "Invalid tour guide ID" });
      }
      const photos = await storage.getTourGuidePhotos(tourGuideId);
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tour guide photos" });
    }
  });
  app2.post("/api/tour-guides/:id/photos", async (req, res) => {
    try {
      const tourGuideId = parseInt(req.params.id);
      if (isNaN(tourGuideId)) {
        return res.status(400).json({ message: "Invalid tour guide ID" });
      }
      const photo = { ...req.body, tourGuideId };
      const newPhoto = await storage.createTourGuidePhoto(photo);
      res.status(201).json(newPhoto);
    } catch (error) {
      res.status(500).json({ message: "Failed to create tour guide photo" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: {
      middlewareMode: true,
      hmr: { server },
      allowedHosts: true
    },
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
