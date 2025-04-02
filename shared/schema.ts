import { pgTable, text, serial, integer, boolean, date, timestamp, json, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base user table from original schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Destination table
export const destinations = pgTable("destinations", {
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
  budgetMatch: integer("budget_match").notNull(),
});

export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
});

// Hotel table
export const hotels = pgTable("hotels", {
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
  label: text("label"), // "Recommended", "Best Value", etc.
  discountInfo: text("discount_info"),
  withinBudget: boolean("within_budget").notNull(),
});

export const insertHotelSchema = createInsertSchema(hotels).omit({
  id: true,
});

// Attractions table
export const attractions = pgTable("attractions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  destinationId: integer("destination_id").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(), // "Sightseeing", "Tour", "Food & Drink", etc.
  rating: real("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  price: integer("price").notNull(),
  withinBudget: boolean("within_budget").notNull(),
  label: text("label"), // "Within Budget", "Best Value", "Popular"
});

export const insertAttractionSchema = createInsertSchema(attractions).omit({
  id: true,
});

// User Trip table
export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  destinationId: integer("destination_id").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  budget: integer("budget").notNull(),
  travelers: integer("travelers").notNull().default(1),
  tripType: text("trip_type").notNull(), // "Beach", "City", "Mountain", etc.
  hotelId: integer("hotel_id"),
  totalCost: integer("total_cost"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTripSchema = createInsertSchema(trips).omit({
  id: true,
  createdAt: true,
});

// Trip Details table
export const tripDetails = pgTable("trip_details", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id").notNull(),
  day: integer("day").notNull(),
  title: text("title").notNull(),
  activities: json("activities").notNull(),
});

export const insertTripDetailSchema = createInsertSchema(tripDetails).omit({
  id: true,
});

// Budget Allocation table
export const budgetAllocations = pgTable("budget_allocations", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id").notNull(),
  accommodation: integer("accommodation").notNull(),
  transportation: integer("transportation").notNull(),
  food: integer("food").notNull(),
  activities: integer("activities").notNull(),
  miscellaneous: integer("miscellaneous").notNull(),
});

export const insertBudgetAllocationSchema = createInsertSchema(budgetAllocations).omit({
  id: true,
});

// Tour Guide table
export const tourGuides = pgTable("tour_guides", {
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
  contactPhone: text("contact_phone").notNull(),
});

export const insertTourGuideSchema = createInsertSchema(tourGuides).omit({
  id: true,
});

// Tour Guide Reviews table
export const tourGuideReviews = pgTable("tour_guide_reviews", {
  id: serial("id").primaryKey(),
  tourGuideId: integer("tour_guide_id").notNull(),
  reviewerName: text("reviewer_name").notNull(),
  reviewerImage: text("reviewer_image").notNull(),
  rating: real("rating").notNull(),
  comment: text("comment").notNull(),
  date: date("date").notNull(),
  tourLocation: text("tour_location").notNull(),
});

export const insertTourGuideReviewSchema = createInsertSchema(tourGuideReviews).omit({
  id: true,
});

// Tour Guide Photos table
export const tourGuidePhotos = pgTable("tour_guide_photos", {
  id: serial("id").primaryKey(),
  tourGuideId: integer("tour_guide_id").notNull(),
  imageUrl: text("image_url").notNull(),
  location: text("location").notNull(),
  date: date("date").notNull(),
});

export const insertTourGuidePhotoSchema = createInsertSchema(tourGuidePhotos).omit({
  id: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Destination = typeof destinations.$inferSelect;
export type InsertDestination = z.infer<typeof insertDestinationSchema>;

export type Hotel = typeof hotels.$inferSelect;
export type InsertHotel = z.infer<typeof insertHotelSchema>;

export type Attraction = typeof attractions.$inferSelect;
export type InsertAttraction = z.infer<typeof insertAttractionSchema>;

export type Trip = typeof trips.$inferSelect;
export type InsertTrip = z.infer<typeof insertTripSchema>;

export type TripDetail = typeof tripDetails.$inferSelect;
export type InsertTripDetail = z.infer<typeof insertTripDetailSchema>;

export type BudgetAllocation = typeof budgetAllocations.$inferSelect;
export type InsertBudgetAllocation = z.infer<typeof insertBudgetAllocationSchema>;

export type TourGuide = typeof tourGuides.$inferSelect;
export type InsertTourGuide = z.infer<typeof insertTourGuideSchema>;

export type TourGuideReview = typeof tourGuideReviews.$inferSelect;
export type InsertTourGuideReview = z.infer<typeof insertTourGuideReviewSchema>;

export type TourGuidePhoto = typeof tourGuidePhotos.$inferSelect;
export type InsertTourGuidePhoto = z.infer<typeof insertTourGuidePhotoSchema>;

// Country and city-related schemas
export const countrySchema = z.object({
  name: z.string(),
  code: z.string(),
  cities: z.array(z.string())
});

export type Country = z.infer<typeof countrySchema>;

// Additional schemas for API requests
export const tripSearchSchema = z.object({
  destination: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().min(0).optional(),
  tripType: z.string().optional(),
  travelers: z.number().int().positive().default(1),
});

export type TripSearchParams = z.infer<typeof tripSearchSchema>;
