import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { tripSearchSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // All routes should be prefixed with /api
  
  // Country and City endpoints
  app.get("/api/countries", async (req, res) => {
    try {
      const countries = await storage.getCountries();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch countries" });
    }
  });

  app.get("/api/countries/:code", async (req, res) => {
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
  
  // Destinations endpoints
  app.get("/api/destinations", async (req, res) => {
    try {
      const destinations = await storage.getDestinations();
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destinations" });
    }
  });
  
  app.get("/api/destinations/:id", async (req, res) => {
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
  
  app.post("/api/destinations/search", async (req, res) => {
    try {
      const validationResult = tripSearchSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid search parameters",
          errors: validationResult.error.format() 
        });
      }
      
      const searchParams = validationResult.data;
      const destinations = await storage.searchDestinations(searchParams);
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to search destinations" });
    }
  });
  
  // Hotels endpoints
  app.get("/api/destinations/:id/hotels", async (req, res) => {
    try {
      const destinationId = parseInt(req.params.id);
      if (isNaN(destinationId)) {
        return res.status(400).json({ message: "Invalid destination ID" });
      }
      
      const hotels = await storage.getHotels(destinationId);
      
      // Get destination info to enrich hotel data
      const destination = await storage.getDestination(destinationId);
      
      // Add destination name and country to each hotel
      const enrichedHotels = hotels.map(hotel => ({
        ...hotel,
        destinationName: destination?.name,
        country: destination?.country
      }));
      
      res.json(enrichedHotels);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hotels" });
    }
  });
  
  app.get("/api/hotels", async (req, res) => {
    try {
      // Get all destinations
      const destinations = await storage.getDestinations();
      const allHotels = [];
      
      // For each destination, get hotels and add destination details
      for (const destination of destinations) {
        const hotels = await storage.getHotels(destination.id);
        const enrichedHotels = hotels.map(hotel => ({
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
  
  app.get("/api/hotels/:id", async (req, res) => {
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
  
  // Attractions endpoints
  app.get("/api/destinations/:id/attractions", async (req, res) => {
    try {
      const destinationId = parseInt(req.params.id);
      if (isNaN(destinationId)) {
        return res.status(400).json({ message: "Invalid destination ID" });
      }
      
      const attractions = await storage.getAttractions(destinationId);
      
      // Get destination info to enrich attraction data
      const destination = await storage.getDestination(destinationId);
      
      // Add destination name and country to each attraction
      const enrichedAttractions = attractions.map(attraction => ({
        ...attraction,
        destinationName: destination?.name,
        country: destination?.country
      }));
      
      res.json(enrichedAttractions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch attractions" });
    }
  });
  
  app.get("/api/attractions", async (req, res) => {
    try {
      // Get all destinations
      const destinations = await storage.getDestinations();
      const allAttractions = [];
      
      // For each destination, get attractions and add destination details
      for (const destination of destinations) {
        const attractions = await storage.getAttractions(destination.id);
        const enrichedAttractions = attractions.map(attraction => ({
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
  
  app.get("/api/attractions/:id", async (req, res) => {
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
  
  // Trip management endpoints
  app.get("/api/trips", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const trips = await storage.getTrips(userId);
      res.json(trips);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trips" });
    }
  });
  
  app.get("/api/trips/:id", async (req, res) => {
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
  
  app.post("/api/trips", async (req, res) => {
    try {
      const tripData = req.body;
      console.log("Received trip data:", JSON.stringify(tripData, null, 2));
      
      // Validate required fields
      if (!tripData.destinationId) {
        return res.status(400).json({ message: "Destination ID is required" });
      }
      
      if (!tripData.startDate) {
        return res.status(400).json({ message: "Start date is required" });
      }
      
      if (!tripData.budget) {
        return res.status(400).json({ message: "Budget is required" });
      }
      
      // Create the trip with prepared data
      const processedData = {
        ...tripData,
        // Ensure travelers has a value
        travelers: tripData.travelers || 1,
        // Ensure duration is calculated if missing
        duration: tripData.duration || 
          (tripData.endDate ? Math.ceil((new Date(tripData.endDate).getTime() - new Date(tripData.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 1),
        // Handle preferences field
        preferences: Array.isArray(tripData.preferences) ? tripData.preferences : [],
        // Set default for tourGuideRequested
        tourGuideRequested: tripData.tourGuideRequested === true
      };
      
      console.log("Processed trip data:", JSON.stringify(processedData, null, 2));
      
      // Create the trip
      const newTrip = await storage.createTrip(processedData);
      
      // Create default budget allocation
      if (newTrip.budget) {
        const totalBudget = newTrip.budget;
        await storage.createBudgetAllocation({
          tripId: newTrip.id,
          accommodation: Math.round(totalBudget * 0.4), // 40% for accommodation
          transportation: Math.round(totalBudget * 0.15), // 15% for transportation
          food: Math.round(totalBudget * 0.2), // 20% for food
          activities: Math.round(totalBudget * 0.1), // 10% for activities
          miscellaneous: Math.round(totalBudget * 0.15) // 15% for miscellaneous
        });
      }
      
      // Generate trip details for each day
      const tripDuration = newTrip.duration || 5; // Default to 5 days if not specified
      const destination = await storage.getDestination(newTrip.destinationId);
      const destinationName = destination ? destination.name : "Your Destination";
      
      // Create trip details for each day
      for (let day = 1; day <= tripDuration; day++) {
        const dayTitle = day === 1 
          ? `Welcome to ${destinationName}` 
          : day === tripDuration 
            ? `Farewell to ${destinationName}` 
            : `Exploring ${destinationName} - Day ${day}`;
            
        const activities = [
          {
            time: "08:00",
            title: "Breakfast at hotel",
            description: "Start your day with a delicious breakfast",
            location: "Hotel",
            type: "breakfast",
            cost: Math.round(newTrip.budget * 0.01) // ~1% of budget
          },
          {
            time: "10:00",
            title: day === 1 
              ? `${destinationName} Orientation Tour` 
              : `${destinationName} ${newTrip.preferences && newTrip.preferences.length > 0 
                  ? newTrip.preferences[Math.floor(Math.random() * newTrip.preferences.length)] 
                  : 'Cultural'} Experience`,
            description: "Explore the highlights of the area",
            location: "City Center",
            type: "sightseeing",
            cost: Math.round(newTrip.budget * 0.02) // ~2% of budget
          },
          {
            time: "13:00",
            title: "Lunch break",
            description: "Enjoy local cuisine at a recommended restaurant",
            location: "Local Restaurant",
            type: "lunch",
            cost: Math.round(newTrip.budget * 0.015) // ~1.5% of budget
          },
          {
            time: "15:00",
            title: day === tripDuration 
              ? "Souvenir Shopping" 
              : `${destinationName} Attraction Visit`,
            description: "Visit a popular local attraction",
            location: "Tourist Area",
            type: "sightseeing",
            cost: Math.round(newTrip.budget * 0.025) // ~2.5% of budget
          },
          {
            time: "19:00",
            title: "Dinner experience",
            description: "Savor the local flavors at a recommended venue",
            location: "Restaurant District",
            type: "dinner",
            cost: Math.round(newTrip.budget * 0.03) // ~3% of budget
          }
        ];
        
        await storage.createTripDetail({
          tripId: newTrip.id,
          day: day,
          title: dayTitle,
          activities: activities
        });
      }
      
      console.log("Trip created successfully with details:", newTrip);
      res.status(201).json(newTrip);
    } catch (error) {
      console.error("Error creating trip:", error);
      res.status(500).json({ message: "Failed to create trip", error: String(error) });
    }
  });
  
  app.put("/api/trips/:id", async (req, res) => {
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
  
  app.delete("/api/trips/:id", async (req, res) => {
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
  
  // Trip details endpoints
  app.get("/api/trips/:id/details", async (req, res) => {
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
  
  app.post("/api/trips/:id/details", async (req, res) => {
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
  
  // Budget allocation endpoints
  app.get("/api/trips/:id/budget", async (req, res) => {
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
  
  app.put("/api/trips/:id/budget", async (req, res) => {
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
  
  // Tour guides endpoints
  app.get("/api/tour-guides", async (req, res) => {
    try {
      const tourGuides = await storage.getTourGuides();
      res.json(tourGuides);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tour guides" });
    }
  });
  
  app.get("/api/tour-guides/:id", async (req, res) => {
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
  
  app.post("/api/tour-guides", async (req, res) => {
    try {
      const tourGuide = req.body;
      const newTourGuide = await storage.createTourGuide(tourGuide);
      res.status(201).json(newTourGuide);
    } catch (error) {
      res.status(500).json({ message: "Failed to create tour guide" });
    }
  });
  
  // Tour guide reviews endpoints
  app.get("/api/tour-guides/:id/reviews", async (req, res) => {
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
  
  app.post("/api/tour-guides/:id/reviews", async (req, res) => {
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
  
  // Tour guide photos endpoints
  app.get("/api/tour-guides/:id/photos", async (req, res) => {
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
  
  app.post("/api/tour-guides/:id/photos", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
