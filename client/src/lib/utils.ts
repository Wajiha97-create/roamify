import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  if (!date) return "";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  return dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

export function calculateTripDuration(startDate: Date | string, endDate: Date | string): number {
  if (!startDate || !endDate) return 0;
  
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  
  // Calculate the difference in milliseconds
  const diffTime = Math.abs(end.getTime() - start.getTime());
  
  // Convert to days
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatNumberWithCommas(number: number): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function calculateBudgetPerPerson(totalBudget: number, travelers: number): number {
  if (!travelers) return totalBudget;
  return Math.round(totalBudget / travelers);
}

export function getTruncatedText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getBudgetMatchLabel(percentage: number): string {
  if (percentage >= 90) return "Perfect Match";
  if (percentage >= 80) return "Great Match";
  if (percentage >= 70) return "Good Match";
  return "Budget Match";
}

export function getBudgetMatchColor(percentage: number): string {
  if (percentage >= 90) return "green";
  if (percentage >= 80) return "lime";
  if (percentage >= 70) return "yellow";
  return "orange";
}
