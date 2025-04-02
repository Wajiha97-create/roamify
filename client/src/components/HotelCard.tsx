import { type Hotel } from "@shared/schema";
import { Star, StarHalf, MapPin, Wifi, DollarSign, Check, Tag, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard = ({ hotel }: HotelCardProps) => {
  const {
    name,
    description,
    imageUrl,
    location,
    distanceFromCenter,
    rating,
    reviewCount,
    pricePerNight,
    facilities,
    label,
    discountInfo,
    withinBudget
  } = hotel;

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

  // Get label badge style based on label content
  const getLabelBadgeStyle = (label: string) => {
    switch (label) {
      case "Recommended":
        return "bg-primary text-white";
      case "Best Value":
        return "bg-green-50 text-green-700";
      case "Premium":
        return "bg-yellow-50 text-yellow-700";
      case "Budget Friendly":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-neutral-50 text-neutral-700";
    }
  };

  // Get discount info icon and style
  const getDiscountInfoStyle = (info: string) => {
    if (info.includes("off") || info.includes("Free") || info.includes("Save")) {
      return {
        icon: <Tag className="mr-1 h-3 w-3" />,
        className: "text-green-600"
      };
    } else if (info.includes("Only") || info.includes("left")) {
      return {
        icon: <AlertTriangle className="mr-1 h-3 w-3" />,
        className: "text-red-600"
      };
    } else {
      return {
        icon: <Check className="mr-1 h-3 w-3" />,
        className: "text-blue-600"
      };
    }
  };

  // Get budget badge style
  const getBudgetBadgeStyle = (withinBudget: boolean) => {
    return withinBudget 
      ? "bg-green-50 text-green-700" 
      : "bg-yellow-50 text-yellow-700";
  };
  
  const discountStyle = discountInfo ? getDiscountInfoStyle(discountInfo) : null;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col md:flex-row">
      <div className="md:w-2/5 h-48 md:h-auto relative">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover" 
        />
        {label && (
          <div className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold ${getLabelBadgeStyle(label)}`}>
            {label}
          </div>
        )}
      </div>
      <div className="md:w-3/5 p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <div className="flex items-center">
              <MapPin className="text-primary text-sm mr-1 h-4 w-4" />
              <p className="text-neutral-500 text-sm">{location}, {distanceFromCenter}km from city center</p>
            </div>
            <div className="flex items-center mt-2">
              <div className="flex text-yellow-400">
                {renderRatingStars(rating)}
              </div>
              <span className="ml-2 text-xs text-neutral-600">{rating} ({reviewCount.toLocaleString()} reviews)</span>
            </div>
          </div>
          <div className="text-right">
            <Badge className={`text-xs px-2 py-1 rounded-full inline-block mb-1 ${getBudgetBadgeStyle(withinBudget)}`}>
              {withinBudget ? "Within Budget" : label || "Premium"}
            </Badge>
            <p className="text-lg font-semibold text-primary">${pricePerNight}</p>
            <p className="text-xs text-neutral-500">per night</p>
          </div>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex flex-wrap gap-2">
            {facilities.map((facility, index) => (
              <span key={index} className="flex items-center text-xs bg-neutral-100 px-2 py-1 rounded">
                {facility.includes("WiFi") && <Wifi className="text-neutral-600 mr-1 h-3 w-3" />}
                {facility}
              </span>
            ))}
          </div>
          
          <div>
            <p className="text-neutral-700 text-sm">{description}</p>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            {discountInfo && (
              <div className={`text-xs font-medium ${discountStyle?.className}`}>
                <span className="flex items-center">
                  {discountStyle?.icon}
                  {discountInfo}
                </span>
              </div>
            )}
            <Button className="px-4 py-2 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg text-sm">
              View Rooms
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
