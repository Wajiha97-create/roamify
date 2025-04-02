
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Hotel } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, ArrowLeft, Wifi, Check } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { convertCurrency, formatCurrencyByCode } from "@/lib/currency";

const HotelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedCurrency } = useCurrency();

  const { data: hotel, isLoading } = useQuery<Hotel>({
    queryKey: [`/api/hotels/${id}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-lg">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Hotel not found</h2>
        <Link href="/hotels">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hotels
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/hotels">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hotels
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
        <div className="flex items-center mt-2">
          <MapPin className="h-4 w-4 text-gray-500 mr-1" />
          <span className="text-gray-600">{hotel.location}</span>
          <span className="mx-2">•</span>
          <span className="text-gray-600">{hotel.distanceFromCenter}km from center</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-video rounded-lg overflow-hidden">
            <img 
              src={hotel.imageUrl} 
              alt={hotel.name} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">About this hotel</h2>
            <p className="text-gray-600">{hotel.description}</p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Facilities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {hotel.facilities.map((facility, index) => (
                <div key={index} className="flex items-center">
                  {facility.includes("WiFi") ? (
                    <Wifi className="h-4 w-4 text-gray-500 mr-2" />
                  ) : (
                    <Check className="h-4 w-4 text-gray-500 mr-2" />
                  )}
                  <span>{facility}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="flex">
                  {Array.from({ length: Math.floor(hotel.rating) }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  ({hotel.reviewCount} reviews)
                </span>
              </div>
              {hotel.label && (
                <Badge variant="secondary">{hotel.label}</Badge>
              )}
            </div>

            <div className="text-center mb-6">
              <div className="text-3xl font-bold">
                {formatCurrencyByCode(
                  convertCurrency(hotel.pricePerNight, selectedCurrency.code),
                  selectedCurrency.code
                )}
              </div>
              <div className="text-gray-500">per night</div>
            </div>

            {hotel.discountInfo && (
              <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
                <Check className="h-4 w-4 inline-block mr-1" />
                {hotel.discountInfo}
              </div>
            )}

            <Button className="w-full">
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
