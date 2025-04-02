import { useQuery } from "@tanstack/react-query";
import { BudgetAllocation } from "@shared/schema";
import { Lightbulb, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface BudgetBreakdownProps {
  tripId: number;
  totalBudget: number;
  destinationName?: string;
  startDate?: string;
  endDate?: string;
  duration?: number;
  travelers?: number;
}

const BudgetBreakdown = ({ 
  tripId, 
  totalBudget, 
  destinationName = "Barcelona",
  startDate = "June 15, 2023",
  endDate = "June 22, 2023",
  duration = 7,
  travelers = 2
}: BudgetBreakdownProps) => {
  const { data: allocation, isLoading } = useQuery<BudgetAllocation>({
    queryKey: [`/api/trips/${tripId}/budget`],
    enabled: !!tripId
  });

  if (isLoading) {
    return <BudgetBreakdownSkeleton />;
  }

  // If no allocation data is available, use default percentages
  const budgetData = allocation || {
    accommodation: totalBudget * 0.4,
    transportation: totalBudget * 0.15,
    food: totalBudget * 0.2,
    activities: totalBudget * 0.1,
    miscellaneous: totalBudget * 0.15
  };

  const totalAllocated = 
    budgetData.accommodation +
    budgetData.transportation +
    budgetData.food +
    budgetData.activities +
    budgetData.miscellaneous;
  
  const remaining = totalBudget - totalAllocated;
  const allocatedPercentage = (totalAllocated / totalBudget) * 100;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold font-heading text-neutral-800 mb-4">Your Budget Breakdown</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-neutral-700">Total Budget</span>
                  <span className="font-semibold text-xl">${totalBudget.toLocaleString()}</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-4">
                  <div 
                    className="bg-primary h-4 rounded-full" 
                    style={{ width: `${allocatedPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-green-600">${totalAllocated.toLocaleString()} allocated</span>
                  <span className="text-neutral-600">${remaining.toLocaleString()} remaining</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <BudgetItem 
                  title="Accommodation" 
                  amount={budgetData.accommodation} 
                  percentage={(budgetData.accommodation / totalBudget) * 100} 
                  color="bg-blue-400" 
                />
                
                <BudgetItem 
                  title="Transportation" 
                  amount={budgetData.transportation} 
                  percentage={(budgetData.transportation / totalBudget) * 100} 
                  color="bg-purple-400" 
                />
                
                <BudgetItem 
                  title="Food & Dining" 
                  amount={budgetData.food} 
                  percentage={(budgetData.food / totalBudget) * 100} 
                  color="bg-yellow-400" 
                />
                
                <BudgetItem 
                  title="Activities" 
                  amount={budgetData.activities} 
                  percentage={(budgetData.activities / totalBudget) * 100} 
                  color="bg-green-400" 
                />
                
                <BudgetItem 
                  title="Miscellaneous" 
                  amount={budgetData.miscellaneous} 
                  percentage={(budgetData.miscellaneous / totalBudget) * 100} 
                  color="bg-red-400" 
                />
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="bg-neutral-50 rounded-lg p-5">
                <h3 className="font-heading font-semibold text-lg mb-3">Budget Tips</h3>
                <ul className="space-y-2">
                  <BudgetTip 
                    text="Consider traveling during shoulder season (Apr-May, Sep-Oct) to save up to 20% on accommodations." 
                  />
                  <BudgetTip 
                    text="Book flights at least 2 months in advance for better rates." 
                  />
                  <BudgetTip 
                    text="Look for accommodations with kitchen facilities to save on dining expenses." 
                  />
                </ul>
              </div>
              
              <div>
                <h3 className="font-heading font-semibold text-lg mb-3">Adjust Your Budget</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700">
                    Less Luxury
                  </Button>
                  <Button variant="outline" className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700">
                    More Activities
                  </Button>
                  <Button variant="outline" className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700">
                    Better Hotels
                  </Button>
                  <Button variant="outline" className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700">
                    Fine Dining
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Info className="text-primary text-xl mr-4" />
                <p className="text-neutral-700">We've optimized your budget based on {duration} days in {destinationName} for {travelers} travelers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface BudgetItemProps {
  title: string;
  amount: number;
  percentage: number;
  color: string;
}

const BudgetItem = ({ title, amount, percentage, color }: BudgetItemProps) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <span className="font-medium">{title}</span>
      <span className="font-medium">${amount.toLocaleString()} ({Math.round(percentage)}%)</span>
    </div>
    <div className="w-full bg-neutral-200 rounded-full h-3">
      <div className={`${color} h-3 rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);

interface BudgetTipProps {
  text: string;
}

const BudgetTip = ({ text }: BudgetTipProps) => (
  <li className="flex items-start">
    <Lightbulb className="text-accent mt-1 mr-3 h-4 w-4" />
    <span>{text}</span>
  </li>
);

const BudgetBreakdownSkeleton = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 sm:p-8">
        <Skeleton className="h-8 w-72 mb-6" />
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-4 w-full rounded-full mb-2" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-3 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-5">
            <div className="bg-neutral-50 rounded-lg p-5">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex">
                    <Skeleton className="h-4 w-4 mr-3 mt-1" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Skeleton className="h-6 w-48 mb-3" />
              <div className="flex flex-wrap gap-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-28 rounded-lg" />
                ))}
              </div>
            </div>
            
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default BudgetBreakdown;
