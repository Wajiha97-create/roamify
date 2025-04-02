import { useState } from "react";
import { type Attraction } from "@shared/schema";
import { Star, StarHalf, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/contexts/CurrencyContext";
import { convertCurrency, formatCurrencyByCode } from "@/lib/currency";
import { Link } from "wouter";
import { Camera } from "lucide-react";
//import { useRouter } from 'next/router'; // Removed useRouter import

interface AttractionCardProps {
  attraction: Attraction;
  setLocation: (location: string) => void; // Added setLocation function
}

const AttractionCard = ({ attraction, setLocation }: AttractionCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  //const router = useRouter(); // Removed useRouter initialization

  const {
    name,
    description,
    imageUrl,
    location,
    type,
    rating,
    reviewCount,
    price,
    withinBudget,
    label
  } = attraction;

  // Generate rating stars
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-yellow-400 text-yellow-400 text-sm" />);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-yellow-400 text-yellow-400 text-sm" />);
    }

    // Add empty stars to make 5 total
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="text-yellow-400 text-sm" />);
    }

    return stars;
  };

  // Toggle favorite status
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const { selectedCurrency } = useCurrency();

  // Convert price to selected currency
  const convertedPrice = convertCurrency(price, selectedCurrency.code);
  const formattedPrice = formatCurrencyByCode(convertedPrice, selectedCurrency.code);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-80 hover:shadow-lg transition-shadow">
      <div className="h-48 relative">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover" 
        />
        <div 
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md cursor-pointer"
          onClick={toggleFavorite}
        >
          <Heart 
            className={isFavorite ? "text-primary fill-primary" : "text-neutral-400"} 
          />
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{name}</h3>
          <Badge className={`bg-${withinBudget ? 'green' : 'yellow'}-50 text-${withinBudget ? 'green' : 'yellow'}-700 px-2 py-1 rounded-full text-xs font-medium`}>
            {label || (withinBudget ? "Within Budget" : "Premium")}
          </Badge>
        </div>
        <div className="flex items-center mb-3">
          <MapPin className="text-primary text-sm mr-1 h-4 w-4" />
          <p className="text-neutral-500 text-sm">{location}</p>
        </div>
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {renderRatingStars(rating)}
          </div>
          <span className="ml-2 text-sm text-neutral-600">{rating} ({reviewCount.toLocaleString()} reviews)</span>
        </div>
        <p className="text-neutral-700 text-sm mb-3">{description}</p>
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-primary">{formattedPrice}</p>
          <div className="flex"> {/* Added a div to hold both buttons */}
            <Button className="px-4 py-2 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition mr-2">
              Book Now
            </Button>
            <Link to={`/attractions/${attraction.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                <Camera size={16} className="mr-2" />
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionCard;