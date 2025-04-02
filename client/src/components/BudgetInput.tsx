import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Plane, 
  Umbrella, 
  Mountain, 
  Building
} from "lucide-react";

const tripTypes = [
  { id: "beach", label: "Beach", icon: <Umbrella className="text-accent text-xl mb-2" /> },
  { id: "mountain", label: "Mountain", icon: <Mountain className="text-accent text-xl mb-2" /> },
  { id: "city", label: "City", icon: <Building className="text-accent text-xl mb-2" /> }
];

const formSchema = z.object({
  destination: z.string().min(2, "Please enter a destination"),
  startDate: z.string().min(1, "Please select a start date"),
  endDate: z.string().min(1, "Please select an end date"),
  budget: z.number().min(1, "Budget must be greater than 0")
});

type FormValues = z.infer<typeof formSchema>;

const BudgetInput = () => {
  const [selectedType, setSelectedType] = useState<string>("city");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      startDate: "",
      endDate: "",
      budget: undefined,
      tripType: "city"
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setLocation(`/plan?destination=${encodeURIComponent(data.destination)}&startDate=${data.startDate}&endDate=${data.endDate}&budget=${data.budget}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search destinations. Please try again.",
        variant: "destructive"
      });
    }
  };

  const selectTripType = (type: string) => {
    setSelectedType(type);
    form.setValue("tripType", type);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 text-neutral-800">
      <h2 className="text-lg font-semibold mb-4 text-neutral-700">Let's plan your dream vacation</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-neutral-600">Where do you want to go?</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder="Enter a destination"
                      className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                      {...field}
                    />
                  </FormControl>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-600">Start Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-600">End Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-neutral-600">Budget (USD)</FormLabel>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-neutral-500">$</span>
                  </div>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your total budget"
                      className="w-full pl-8 pr-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                      {...field}
                      onChange={event => field.onChange(parseFloat(event.target.value))}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          
          
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            <Plane className="mr-2 h-5 w-5" /> Find My Perfect Trip
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BudgetInput;
