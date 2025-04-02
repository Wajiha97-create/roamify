import { Link } from "wouter";
import { type Destination } from "@shared/schema";
import { Star, StarHalf, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";
import { convertCurrency, formatCurrencyByCode } from "@/lib/currency";

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard = ({ destination }: DestinationCardProps) => {
  const {
    id,
    name,
    country,
    description,
    imageUrl,
    rating,
    reviewCount,
    pricePerPerson,
    durationDays,
    tags,
    budgetMatch
  } = destination;

  // Generate rating stars
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-yellow-400 text-yellow-400" />);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-yellow-400 text-yellow-400" />);
    }

    // Add empty stars to make 5 total
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="text-yellow-400" />);
    }

    return stars;
  };

  // Get budget match indicator
  const getBudgetMatchIcon = (percentage: number) => {
    if (percentage >= 90) {
      return "👍";
    } else if (percentage >= 70) {
      return "👍";
    } else {
      return "👍";
    }
  };

  const getBudgetMatchText = (percentage: number) => {
    return `${percentage}% Budget Match`;
  };

  // Generate tag badges
  const tagColors: Record<string, string> = {
    Beach: "bg-blue-50 text-blue-700",
    Culture: "bg-purple-50 text-purple-700",
    Food: "bg-amber-50 text-amber-700",
    City: "bg-red-50 text-red-700",
    Relaxation: "bg-green-50 text-green-700",
    Romantic: "bg-purple-50 text-purple-700"
  };

  const { selectedCurrency } = useCurrency();
  
  // Convert price to selected currency
  const convertedPrice = convertCurrency(pricePerPerson, selectedCurrency.code);
  const formattedPrice = formatCurrencyByCode(convertedPrice, selectedCurrency.code);
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-52">
        <img 
          src={imageUrl} 
          alt={`${name}, ${country}`} 
          className="w-full h-full object-cover"
        />
        
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-accent font-semibold">{name}, {country}</h3>
            <p className="text-neutral-500">{durationDays} days trip</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-primary">{formattedPrice}</p>
            <p className="text-sm text-neutral-500">per person</p>
          </div>
        </div>
        <div className="flex items-center mt-3 mb-4">
          <div className="flex text-yellow-400">
            {renderRatingStars(rating)}
          </div>
          <span className="ml-2 text-sm text-neutral-600">{rating} ({reviewCount.toLocaleString()} reviews)</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-1 mb-4">
          {tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className={`px-2 py-1 rounded text-xs font-medium ${tagColors[tag] || "bg-gray-50 text-gray-700"}`}
            >
              {tag}
            </Badge>
          ))}
        </div>
        <Link href={`/destinations/${id}`}>
          <Button 
            variant="secondary" 
            className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium py-2 px-4 rounded-lg transition flex items-center justify-center"
          >
            <Info className="mr-2 h-4 w-4" /> View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DestinationCard;
