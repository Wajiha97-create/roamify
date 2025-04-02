
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Loader2, MapPin, Star, StarHalf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrency } from "../contexts/CurrencyContext";
import { convertCurrency, formatCurrencyByCode } from "../lib/currency";
import type { Attraction } from "@shared/schema";

const AttractionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedCurrency } = useCurrency();

  const { data: attraction, isLoading } = useQuery<Attraction>({
    queryKey: [`/api/attractions/${id}`],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!attraction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Attraction not found</h1>
      </div>
    );
  }

  const convertedPrice = convertCurrency(attraction.price, selectedCurrency.code);
  const formattedPrice = formatCurrencyByCode(convertedPrice, selectedCurrency.code);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <img 
            src={attraction.imageUrl} 
            alt={attraction.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{attraction.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <MapPin size={18} className="mr-1" />
                {attraction.location}
              </div>
              <Badge variant="outline">{attraction.type}</Badge>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(Math.floor(attraction.rating))].map((_, i) => (
                <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
              ))}
              {attraction.rating % 1 >= 0.5 && (
                <StarHalf className="text-yellow-400 fill-yellow-400" size={20} />
              )}
            </div>
            <span className="text-gray-600">
              {attraction.rating} ({attraction.reviewCount.toLocaleString()} reviews)
            </span>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed">
            {attraction.description}
          </p>

          <div className="flex items-center justify-between bg-gray-50 p-6 rounded-lg">
            <div>
              <p className="text-gray-600">Price per person</p>
              <p className="text-2xl font-bold text-primary">{formattedPrice}</p>
            </div>
            <Button size="lg">
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionDetails;
